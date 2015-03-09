/**
 * 积分系统后台
 *
 * @module admin
 */
define(function (require) {
    'use strict';

    var $ = require('$'),
        util = require('../../common/util'),
        io = require('../../common/io'),
        helpers = require('../../common/helpers'),
        ConfirmBox = require('../../common/dialog/confirmbox'),
        Validator = require('../../common/validator'),
        moment = require('moment'),
        Uploader = require('upload'),
        auctionDialogTemplate = require('./auctionDialog.handlebars'),
        auctionListTemplate = require('./auctionList.handlebars'),
        awardFormTemplate = require('./awardForm.handlebars'),
        awardListTemplate = require('./awardList.handlebars'),
        awardSortTemplate = require('./awardSort.handlebars'),
        manageDialogTemplate = require('./manageDialog.handlebars'),
        resultDialogTemplate = require('./resultDialog.handlebars');

    require('handlebars');
    require('runtime');
    require('jqPaginator');
    require('dragsort');
    require('datetimepicker');
    require('datetimepicker.css');
    require('../../common/initDatetimepicker');

    //这个页面有Uploader，错误信息会导致按钮高度变化
    Validator = Validator.extend({
        attrs: {
            autoSubmit: false,
            stopOnError: true,
            showMessage: function(message, element) {
                message = '<i class="ico ico-error"></i>' + message;

                element = this.getItem(element).closest('form').find('.validatorError');
                this.getExplain(element).html(message);
                this.getItem(element).addClass('has-error');
            },
            hideMessage: function (message, element) {
                element = this.getItem(element).closest('form').find('.validatorError');
                this.getExplain(element).html('&nbsp;');
            }
        }
    });

    //Handlebars helpers
    helpers = $.extend({}, helpers, {
        getState: function (val) {
            var result = '';
            switch (val) {
                case '1':
                    result = '<span class="c-black">未开始</span>';
                    break;
                case '2':
                case '3':
                    result = '<span class="c-green">进行中</span>';
                    break;
                case '4':
                    result = '已结束';
                    break;
                default :
                    result = '';
                    break;
            }
            return result;
        },
        getBtnStatus: function (auctionState, startTime, type) {
            var result = '';
            switch (auctionState) {
                case '4':
                    result = type === 'get' ? '' : 'hide';
                    break;
                case '1':
                    if (type === 'get') {
                        result = 'hide';
                    } else {
                        result = (startTime - (+new Date()) > 15 * 60 * 1000) ? '' : 'hide';
                    }
                    break;
                case '2':
                case '3':
                    result = 'hide';
                    break;
                default :
                    result = '';
                    break;
            }
            return result;
        }
    });

    //validate rule
    Validator.addRule('customTime', function(options) {
        var $el = $(options.element),
            val = $el.val();

        return /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}$/g.test(val);
    }, '{{display}}格式错误');

    Validator.addRule('validTime', function () {
        var startTime = Date.parse($('#J_Dialog_StartTime').val().replace(/-/g, '/'));
        var auctionTime = Date.parse($('#J_Dialog_AuctionTime').val().replace(/-/g, '/'));

        return startTime < auctionTime;
    }, '开始时间须小于竞拍时间');

    Validator.addRule('integer', function (options) {
        var $el = $(options.element),
            val = $el.val();

        return /^\d+$/g.test(val);
    }, '{{display}}格式错误，必须为大于0的整数');

    /**
     * 拍卖管理
     *
     * @class admin.auction
     * @static
     */
    var app = {

        /**
         * 分页查询对象
         *
         * @property model
         */
        model: {
            title: '',
            auctionState: 1,
            startTimeStart: '',
            endTimeEnd: '',
            pageNo: 1,
            pageSize: 5
        },

        /**
         * 初始化
         *
         * @method init
         */
        init: function () {
            var self = this;

            self.cacheElement();
            self.initCalendar();
            self.proof();
            self.bindEvents();
        },

        /**
         * 缓存jQuery对象
         *
         * @method cacheElement
         */
        cacheElement: function () {
            var self = this;

            self.$form = $('#J_Form');
            self.$search = $('#J_Search');
            self.$list = $('#J_List');
            self.$add = $('#J_Add');
            self.$page = $('#J_Page');
        },

        /**
         * 初始化日期控件
         *
         * @method initCalendar
         */
        initCalendar: function () {
            $('#J_Form_StartTime').datetimepicker({
                format: 'yyyy-mm-dd',
                minView: 'month',
                autoclose: true
            });
            $('#J_Form_EndTime').datetimepicker({
                format: 'yyyy-mm-dd',
                minView: 'month',
                autoclose: true
            });
        },

        /**
         * 校验查询对象，执行查询
         *
         * @method proof
         */
        proof: function () {
            var self = this;

            self.model = $.extend({}, self.model, util.packForm(self.$form));
            self.model.pageNo = 1;

            if (!self.verify()) {
                return;
            }

            self.getList();
        },

        /**
         * 验证日期格式
         *
         * @method verify
         * @returns {boolean}
         */
        verify: function () {
            var self = this,
                startTime = self.model.startTimeStart,
                endTime = self.model.endTimeEnd,
                reg = /^\d{4}-\d{2}-\d{2}$/;

            if ((startTime && !reg.test(startTime)) || (endTime && !reg.test(endTime))) {
                util.showMessage('时间格式不正确!');
                return false;
            }

            startTime = startTime && Date.parse(startTime.replace(/-/g, '/') + ' 00:00:00');
            endTime = endTime && Date.parse(endTime.replace(/-/g, '/') + ' 23:59:59');

            if (startTime && endTime && startTime > endTime) {
                util.showMessage('开始时间必须小于结束时间!');
                return false;
            }

            self.model.startTimeStart = startTime;
            self.model.endTimeEnd = endTime;

            return true;
        },

        /**
         * 查询拍卖列表
         *
         * @method getList
         */
        getList: function () {
            var self = this;

            io.post(util.getUrl('auctionQuery'), self.model, function () {
                var result = this.data,
                    listHtml = auctionListTemplate(result, {helpers: helpers});

                self.$list.html(listHtml);
                self.paginator(result.pageNo, result.pageSize, result.totalHit);
            });
        },

        /**
         * 分页
         *
         * @method paginator
         * @param currentPage {Number} 当前页
         * @param pageSize {Number} 每页条数
         * @param totalCounts {Number} 总条数
         */
        paginator: function (currentPage, pageSize, totalCounts) {
            var self = this;

            if (totalCounts <= pageSize) {
                self.$page.data('jqPaginator') && self.$page.jqPaginator('destroy');
                return;
            }

            self.$page.jqPaginator({
                totalCounts: totalCounts,
                pageSize: pageSize,
                visiblePages: 6,
                currentPage: currentPage,

                first: '<li><a href="javascript:;">首页</a></li>',
                prev: '<li><a href="javascript:;"><i class="arrow arrow2"></i>上一页</a></li>',
                next: '<li><a href="javascript:;">下一页<i class="arrow arrow3"></i></a></li>',
                last: '<li><a href="javascript:;">末页</a></li>',
                page: '<li><a href="javascript:;">{{page}}</a></li>',
                onPageChange: function (num, type) {
                    if (type === 'change' && self.model.pageNo != num) {
                        self.model.pageNo = num;
                        self.getList();
                    }
                    return false;
                }
            });
        },

        /**
         * 添加拍卖
         *
         * @method add
         */
        add: function () {
            var self = this,
                cb = new ConfirmBox({
                    align: {
                        selfXY: ['50%', '-65px'],
                        baseXY: ['50%', 0]
                    },
                    width: 658,
                    zIndex: 888,
                    message: auctionDialogTemplate({idAdd: true, base: '3'}, {helpers: helpers}),
                    onConfirm: function () {
                        self.dialogValidator.execute(function(hasError) {
                            if (!hasError) {
                                var data = util.packForm('#J_Dialog_Form');
                                data.startTime = Date.parse(data.startTime.replace(/-/g, '/'));
                                data.auctionTime = Date.parse(data.auctionTime.replace(/-/g, '/'));
                                io.post(util.getUrl('auctionAdd'), data, function () {
                                    cb.hide();
                                    self.proof();
                                });
                            }
                        });
                    }
                }).after('show', function () {
                    self.initDialogValidator();
                    self.initDialogCalendar();
                }).after('hide',function () {
                    self.destroyDialogCalendar();
                    self.dialogValidator && self.dialogValidator.destroy();
                    cb.destroy();
                }).show();
        },

        /**
         * 编辑拍卖
         *
         * @method edit
         * @param id {Number} 拍卖ID
         */
        edit: function (id) {
            var self = this;

            io.get(util.getUrl('auctionGet'), {auctionId: id}, function () {
                var result = this.data;
                result.startTime = fdate(result.startTime);
                result.auctionTime = fdate(result.auctionTime);

                var cb = new ConfirmBox({
                    align: {
                        selfXY: ['50%', '-65px'],
                        baseXY: ['50%', 0]
                    },
                    width: 658,
                    zIndex: 888,
                    message: auctionDialogTemplate(result, {helpers: helpers}),
                    onConfirm: function () {
                        self.dialogValidator.execute(function (hasError) {
                            if (!hasError) {
                                var data = util.packForm('#J_Dialog_Form');
                                data.startTime = Date.parse(data.startTime.replace(/-/g, '/'));
                                data.auctionTime = Date.parse(data.auctionTime.replace(/-/g, '/'));
                                io.post(util.getUrl('auctionUpdate'), data, function () {
                                    cb.hide();
                                    self.proof();
                                });
                            }
                        });
                    }
                }).after('show',function () {
                    self.initDialogValidator();
                    self.initDialogCalendar();
                }).after('hide',function () {
                    self.destroyDialogCalendar();
                    self.dialogValidator && self.dialogValidator.destroy();
                    cb.destroy();
                }).show();
            });
        },

        /**
         * 初始化弹窗中的验证控件
         *
         * @method initDialogValidator
         */
        initDialogValidator: function () {
            this.dialogValidator = new Validator({
                element: '#J_Dialog_Form'
            }).addItem({
                element: '[name=title]',
                display: '主题',
                rule: 'maxlength{max:50}',
                required: true
            }).addItem({
                element: '[name=details]',
                display: '详情',
                rule: 'maxlength{max:500}',
                required: true
            }).addItem({
                element: '[name=startTime]',
                display: '开始时间',
                rule: 'customTime',
                required: true
            }).addItem({
                element: '[name=auctionTime]',
                display: '竞拍模式时间',
                rule: 'customTime validTime',
                required: true
            });
        },

        /**
         * 初始化弹窗中的日期控件
         *
         * @method initDialogCalendar
         */
        initDialogCalendar: function () {
            var self = this;
            $('#J_Dialog_StartTime').datetimepicker({
                format: 'yyyy-mm-dd hh:ii',
                autoclose: true,
                startDate: new Date(+new Date() + 16 * 60 * 1000)
            }).on('changeDate', function () {
                self.dialogValidator && self.dialogValidator.execute();
            });
            $('#J_Dialog_AuctionTime').datetimepicker({
                format: 'yyyy-mm-dd hh:ii',
                autoclose: true,
                startDate: new Date(+new Date() + 16 * 60 * 1000)
            }).on('changeDate', function () {
                self.dialogValidator && self.dialogValidator.execute();
            });
        },

        /**
         * 销毁弹窗中的日期控件
         *
         * @method destroyDialogCalendar
         */
        destroyDialogCalendar: function () {
            $('#J_Dialog_StartTime').datetimepicker('remove');
            $('#J_Dialog_AuctionTime').datetimepicker('remove');
        },

        /**
         * 删除拍卖
         *
         * @method del
         * @param id {Number} 拍卖ID
         */
        del: function (id) {
            var self = this;
            ConfirmBox.confirm('确定要删除？', function () {
                io.post(util.getUrl('auctionDelete'), {id: id}, function () {
                    self.model.pageNo = 1;
                    self.getList();
                });
            });
        },

        /**
         * 拍卖管理
         *
         * @method manage
         * @param auctionId {Number} 拍卖Id
         */
        manage: function (auctionId) {
            var self = this;

            var cb = new ConfirmBox({
                align: {
                    selfXY: ['50%', '-65px'],
                    baseXY: ['50%', 0]
                },
                width: 1250,
                zIndex: 888,
                message: manageDialogTemplate(),
                confirmTpl: '',
                cancelTpl: ''
            }).after('show',function () {
                var $manageDialogLeft = $('#J_ManageDialog_Left'),
                    $manageDialogRight = $('#J_ManageDialog_Right');

                //删除奖品
                $manageDialogLeft.on('click', '[data-role=del]', function () {
                    self.delAward($(this).data('id'), auctionId);
                });

                //编辑奖品
                $manageDialogLeft.on('click', '[data-role=edit]', function () {
                    self.renderAwardForm(auctionId, $(this).data('id'));
                });
                //切换到排序
                $manageDialogLeft.on('click', '#J_Sort', function () {
                    self.getAwartList(auctionId, 'sort');
                });
                //返回
                $manageDialogLeft.on('click', '#J_Sort_Save', $.proxy(self.sort, self, auctionId));
                //返回
                $manageDialogLeft.on('click', '#J_Sort_Back', function () {
                    self.getAwartList(auctionId);
                });

                //添加奖品
                $manageDialogRight.on('click', '#J_AwardForm_Add', $.proxy(self.saveAward, self, auctionId));
                //编辑奖品
                $manageDialogRight.on('click', '#J_AwardForm_Save', $.proxy(self.saveAward, self, auctionId, 'edit'));
                //取消编辑
                $manageDialogRight.on('click', '#J_AwardForm_Cancel', $.proxy(self.renderAwardForm, self, auctionId));

                self.getAwartList(auctionId);
                self.renderAwardForm(auctionId);
                self.initAwardUploader();
                self.initImportsUploader(auctionId);
            }).after('hide',function () {
                self.awardValidator && self.awardValidator.destroy();
                $('#J_ManageDialog_Left').off();
                $('#J_ManageDialog_Right').off();
                $('.J_Sort_List').sortable('destroy');
                cb.destroy();
            }).show();
        },

        /**
         * 获取一场拍卖的奖品列表
         *
         * @method getAwartList
         * @param auctionId {Number} 拍卖ID
         * @param [type=''] {String} 展现类型，'sort'表示排序模式，其他表示普通模式
         */
        getAwartList: function (auctionId, type) {
            $('.J_Sort_List').sortable('destroy');
            io.get(util.getUrl('auctionAwardQuery'), {auctionId: auctionId}, function () {
                var listData = this.data;
                if (type === 'sort') {
                    var batchList = sortData(listData);
                    $('#J_ManageDialog_Left').html(awardSortTemplate(batchList, {helpers: helpers}));
                    $('.J_Sort_List').sortable({
                        connectWith: '.J_Sort_List',
                        placeholder: 'dragsort'
                    }).disableSelection();
                } else {
                    $('#J_ManageDialog_Left').html(awardListTemplate(listData, {helpers: helpers}));
                }
            });
        },

        /**
         * 生成奖品添加/编辑的form
         *
         * @method renderAwardForm
         * @param auctionId {Number} 拍卖ID
         * @param [awardId] {Number} 奖品ID（设置奖品ID则为编辑模式）
         */
        renderAwardForm: function (auctionId, awardId) {
            var self = this;

            self.awardValidator && self.awardValidator.destroy();

            if (Object.prototype.toString.call(awardId) === '[object Number]') {
                io.get(util.getUrl('auctionAwardGet'), {awardId: awardId}, function () {
                    var result = $.extend({}, this.data, {isEdit: true, auctionId: auctionId});
                    $('#J_ManageDialog_Right').html(awardFormTemplate(result));
                    self.initAwardValidator('edit');
                });
            } else {
                $('#J_ManageDialog_Right').html(awardFormTemplate({auctionId: auctionId}));
                self.initAwardValidator();
            }
        },

        /**
         * 初始化编辑/新增奖品的form
         *
         * @method initAwardValidator
         * @param [type] {String} 等于'edit'的时候，表示是编辑奖品
         */
        initAwardValidator: function(type) {
            this.awardValidator = new Validator({
                element: '#J_AwardForm'
            }).addItem({
                element: '[name=name]',
                display: '名称',
                rule: 'maxlength{max:50}',
                required: true
            }).addItem({
                element: '[name=description]',
                display: '描述',
                rule: 'maxlength{max:500}',
                required: true
            }).addItem({
                element: '[name=image]',
                display: '图片',
                required: true,
                errormessageRequired:'请上传图片'
            }).addItem({
                element: '[name=price]',
                rule: 'integer',
                display: '价格',
                required: true
            });
            if (type !== 'edit') {
                this.awardValidator.addItem({
                    element: '[name=awardNum]',
                    rule: 'integer min{min:1}',
                    display: '物品数',
                    required: true
                });
            }
        },

        /**
         * 初始化奖品的图片上传
         *
         * @method initAwardUploader
         */
        initAwardUploader: function () {
            var awardUploader = new Uploader({
                trigger: '#J_AwardForm_Upload',
                name: 'imageFile',
                action: util.getUrl('auctionAwardUploadImage'),
                accept: 'image/jpeg,image/gif,image/bmp,image/png'
            });
            awardUploader.change(function(val) {
                var name = val[0].name,
                    index = name.lastIndexOf('.') + 1,
                    len = name.length,
                    suffix = name.slice(index - len),
                    msg = '<i class="ico ico-error"></i>格式必须是jpg,png,gif或bmp';

                if (suffix !== 'jpg' && suffix !== 'jpeg' && suffix !== 'png' && suffix !== 'gif' && suffix !== 'bmp') {
                    $('[name="image"]').parent('div').addClass('has-error').children('.help-block').html(msg);
                } else {
                    awardUploader.submit();
                }
            });
            awardUploader.success(function (response) {
                //bug: IE9会下载json数据，所以接口响应类型改为text/html 手动解析json
                response = $.parseJSON(response);
                io.processor(response, {
                    success: function () {
                        $('[name="image"]').val(this.data);
                    },
                    error: function (msg) {
                        $('[name="image"]').val('');
                        util.showMessage(msg);
                    }
                });
            });
            awardUploader.error(function () {
                util.showMessage('导入出错，请检查文件，稍后再试！');
            });
        },

        /**
         * 初始化导入按钮的上传
         *
         * @method initImportsUploader
         * @param auctionId {Number} 拍卖ID
         */
        initImportsUploader: function (auctionId) {
            var self = this;
            self.importsUploader = new Uploader({
                trigger: '#J_AwardForm_Imports',
                data: {
                    auctionId: auctionId
                },
                name: 'compressFile',
                action: util.getUrl('auctionAwardImports'),
                accept: '.rar, .zip' //application/zip,application/x-zip-compressed,application/rar,application/octet-stream rar无效
            });
            self.importsUploader.change(function(val) {
                var name = val[0].name,
                    index = name.lastIndexOf('.') + 1,
                    len = name.length,
                    suffix = name.slice(index - len),
                    msg = '格式必须是rar或zip';

                if (suffix !== 'rar' && suffix !== 'zip') {
                    util.showMessage(msg);
                } else {
                    util.showMessage('文件上传中...');
                    self.importsUploader.submit();
                }
            });
            self.importsUploader.success(function (response) {
                //bug: IE9会下载json数据，所以接口响应类型改为text/html 手动解析json
                response = $.parseJSON(response);
                io.processor(response, {
                    success: function () {
                        util.showMessage('导入成功！');
                        self.getAwartList(auctionId);
                        self.getList();//刷新当前的竞拍列表页
                    },
                    error: function (msg) {
                        util.showMessage(msg);
                    }
                });
            });
            self.importsUploader.error(function () {
                util.showMessage('导入出错，请检查文件，稍后再试！');
            });
        },

        /**
         * 保存奖品
         *
         * @method saveAward
         * @param id {Number} 拍卖ID
         * @param [type] {String} 'edit'表示是编辑后的保存
         */
        saveAward: function (id, type) {
            var self = this,
                url = util.getUrl('auctionAwardAdd');

            if (type === 'edit') {
                url = util.getUrl('auctionAwardUpdate');
            }

            self.awardValidator.execute(function (hasError) {
                if (!hasError) {
                    self.disableButton($('#J_AwardForm_Save'));
                    self.disableButton($('#J_AwardForm_Add'));
                    io.post(url, util.packForm('#J_AwardForm'), {
                        success: function () {
                            self.getAwartList(id);
                            self.renderAwardForm(id);
                            self.getList();//刷新当前的竞拍列表页
                        },
                        error: function (msg) {
                            self.showError(msg);
                            self.enableButton($('#J_AwardForm_Save'));
                            self.enableButton($('#J_AwardForm_Add'));
                        }
                    });
                }
            });
        },

        /**
         * 删除奖品
         *
         * @method delAward
         * @param id {Number} 奖品ID
         * @param auctionId {Number} 拍卖ID
         */
        delAward: function (id, auctionId) {
            var self = this;
            ConfirmBox.confirm('确定要删除？', function () {
                io.post(util.getUrl('auctionAwardDelete'), {id: id}, function () {
                    self.getAwartList(auctionId);
                    self.getList();//刷新当前的竞拍列表页
                });
            });
        },

        /**
         * 奖品排序
         *
         * @method sort
         * @param auctionId {Number} 拍卖ID
         */
        sort: function (auctionId) {
            var self = this,
                $uls = $('.J_Sort_List'),
                length = $uls.length,
                ids = [];

            for (var i = 0; i < length; i++) {
                if ($uls.eq(i).children('.J_Sort_Item').length < 6 && i + 1 !== length) {
                    util.showMessage('除最后一批次外，其余所有批次物品数必须为6！');
                    return;
                }
            }

            $('.J_Sort_Item').map(function () {
                ids.push($(this).data('id'));
            });

            io.post(util.getUrl('auctionAwardSort'), {ids: ids}, function () {
                self.getAwartList(auctionId);
            });
        },

        /**
         * 将Button设置为disable
         *
         * @method disableButton
         * @param $btn {Object} 按钮的jQuery对象
         */
        disableButton: function ($btn) {
            $btn.prop('disabled', true);
        },

        /**
         * 将Button设置为enable
         *
         * @method enableButton
         */
        enableButton: function ($btn) {
            $btn.prop('disabled', false);
        },

        /**
         * 查看竞拍结果
         *
         * @method getResult
         * @param auctionId
         */
        getResult: function (auctionId) {
            io.get(util.getUrl('auctionAwardResult'), {auctionId: auctionId}, function () {
                var result = this.data;
                var cb = new ConfirmBox({
                    align: {
                        selfXY: ['50%', '-65px'],
                        baseXY: ['50%', 0]
                    },
                    width: 900,
                    zIndex: 888,
                    message: resultDialogTemplate(result, {helpers: helpers}),
                    confirmTpl: '',
                    cancelTpl: ''
                }).after('hide',function () {
                    cb.destroy();
                }).show();
            });
        },

        /**
         * 事件绑定
         *
         * @method bindEvents
         */
        bindEvents: function () {
            var self = this;

            self.$list.on('click', '[data-role=del]', function () {
                self.del($(this).data('id'));
            });

            self.$list.on('click', '[data-role=edit]', function () {
                self.edit($(this).data('id'));
            });

            self.$list.on('click', '[data-role=manage]', function () {
                self.manage($(this).data('id'));
            });

            self.$list.on('click', '[data-role=get]', function () {
                self.getResult($(this).data('id'));
            });

            self.$search.on('click', $.proxy(self.proof, self));
            self.$add.on('click', $.proxy(self.add, self));
        }
    };

    /**
     * 辅助方法：格式化日期
     *
     * @method fdate
     * @param timestamp {Number} 时间戳
     * @returns {String}
     */
    function fdate(timestamp) {
        return moment(timestamp).format('YYYY-MM-DD HH:mm');
    }

    /**
     * 辅助方法：格式化排序对象
     *
     * @method sortData
     * @param data {Object} 奖品列表数据
     * @returns {Array}
     */
    function sortData(data){
        var batchList = [],
            batchIndex = 0,
            lastBatchTime = 0,
            currentAward = null;

        for (var i = 0, j = data.length; i < j; i++) {
            batchIndex = Math.floor(i / 6);
            currentAward = data[i];
            //注意：后端给的createTime是竞拍模式开始时间
            lastBatchTime = (lastBatchTime === 0 ? currentAward.createTime : lastBatchTime);
            if (!batchList[batchIndex]) {
                batchList[batchIndex] = {};
            }
            if (!batchList[batchIndex].title) {
                batchList[batchIndex].title = '第 ' + (batchIndex + 1) + ' 批次';
            }
            if(!batchList[batchIndex].time){
                batchList[batchIndex].time = '（' + fdate(lastBatchTime) + ' ~ ' + fdate(lastBatchTime += 720000) + '）';
            }
            if (!batchList[batchIndex].data) {
                batchList[batchIndex].data = [];
            }
            batchList[batchIndex].data.push(currentAward);
        }

        return batchList;
    }

    app.init();
});