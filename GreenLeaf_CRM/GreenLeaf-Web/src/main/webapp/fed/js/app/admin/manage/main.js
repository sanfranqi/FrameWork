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
        Uploader = require('upload'),
        Validator = require('../../common/validator'),
        autorender = require('../../common/autorender'),
        listTemplate = require('./list.handlebars'),
        dialogTemplate = require('./dialog.handlebars');

    require('handlebars');
    require('runtime');
    require('jqPaginator');

    Validator.addRule('integer', function (options) {
        var $el = $(options.element),
            val = $el.val();

        return /^\d+$/g.test(val);
    }, '{{display}}格式错误，必须为大于0的整数');

    /**
     * 积分管理
     *
     * @class admin.manage
     */
    var app = {

        /**
         * 分页查询对象
         *
         * @property model
         */
        model:{
            userno: '',
            sort: '',
            pageNo: 1,
            pageSize: 15
        },

        /**
         * 初始化
         *
         * @method init
         */
        init: function () {
            var self = this;

            self.cacheElement();
            self.initUpload();
            self.getList();
            self.bindEvents();
            autorender.init();
        },

        /**
         * 缓存jQuery对象
         *
         * @method cacheElements
         */
        cacheElement: function () {
            var self = this;

            self.$search = $('#J_Search');
            self.$searchForm = $('#J_SearchForm');
            self.$importFormTemplate = $('#J_ImportFormTemplate');
            self.$hand = $('.hand');
            self.$list = $('#J_List');
            self.$adds = $('#J_Adds');
            self.$page = $('#J_Page');
        },

        /**
         * 校验查询对象，执行查询
         *
         * @method search
         */
        search: function () {
            var self = this,
                data = util.packForm(self.$searchForm);

            data.pageNo = 1;
            self.model = $.extend({}, self.model, data);

            self.getList();
        },

        /**
         * 排序查询
         *
         * @method sort
         * @param sort {String} 排序类型。'total_score'：荣誉积分，'score'：可用积分，'used_score'：消费积分
         */
        sort: function (sort) {
            var self = this;

            self.model.sort = sort;
            self.model.pageNo = 1;

            self.getList();
        },

        /**
         * 查询
         *
         * @method getList
         */
        getList: function () {
            var self = this;

            io.get(util.getUrl('adminScoreQuery'), self.model, function () {
                var result = this.data,
                    listHtml = listTemplate(result, {helpers: helpers});

                self.$list.html(listHtml);
                self.paginator(result.pageNo, result.pageSize, result.totalHit);
            });
        },

        /**
         * 分页
         *
         * @method paginator
         * @param currentPage {Number} 当前页
         * @param pageSize {Number} 每页的条数
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
         * 授予/扣除 积分
         *
         * @method scoreChange
         * @param name {String} 姓名
         * @param userno {String} 工号
         * @param [score] {Number} 积分。存在为扣除，否则为授予
         */
        scoreChange: function (name, userno, score) {
            var self = this,
                url = score ? util.getUrl('adminScoreDeduct') : util.getUrl('adminScoreAdd'),
                cb = new ConfirmBox({
                    align: {
                        selfXY: ['50%', '-65px'],
                        baseXY: ['50%', 0]
                    },
                    width: 400,
                    zIndex: 888,
                    message: dialogTemplate({
                        title: score ? '扣除' : '授予',
                        name: name,
                        userno: userno
                    }),
                    onConfirm: function () {
                        self.validator.execute(function(hasError) {
                            if (!hasError) {
                                var data = util.packForm('#J_Form');
                                data.comments = $.trim(data.comments).replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
                                io.post(url, data, function () {
                                    cb.hide();
                                    self.getList();
                                });
                            }
                        });
                    }
                }).after('show', function () {
                    self.initValidator(score);
                }).after('hide',function () {
                    self.validator && self.validator.destroy();
                    cb.destroy();
                }).show();
        },

        /**
         * 初始化验证控件
         *
         * @method initValidator
         * @param score
         */
        initValidator: function(score) {
            this.validator = new Validator({
                element: '#J_Form'
            }).addItem({
                element: '[name=scorenum]',
                display: '积分数',
                rule: (score ? 'integer max{max:' + score + '}' : 'integer') + ' maxlength{max:7}',
                required: true
            }).addItem({
                element: '[name=comments]',
                display: '理由',
                rule:'maxlength{max:300}',
                required: true
            });
        },

        /**
         * 初始化上传组件
         *
         * @method initUpload
         */
        initUpload: function () {
            var self = this;
            self.uploader = new Uploader({
                trigger: '#J_Adds',
                name: 'excelFile',
                data: {
                    comments: ''
                },
                action: util.getUrl('adminScoreImport'),
                accept: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            self.uploader.change(function(val) {
                var name = val[0].name,
                    index = name.lastIndexOf('.') + 1,
                    len = name.length,
                    suffix = name.slice(index - len),
                    msg = '<i class="ico ico-error"></i>格式必须是.xls或.xlsx';

                if (suffix !== 'xls' && suffix !== 'xlsx') {
                    $('[name="file"]').parent('div').addClass('has-error').children('.help-block').html(msg);
                } else {
                    util.showMessage('文件上传中...');
                    self.uploader.submit();
                }
            });
            self.uploader.success(function (response) {
                //bug: IE9会下载json数据，所以接口响应类型改为text/html 手动解析json
                response = $.parseJSON(response);
                io.processor(response, function () {
                    util.showMessage('导入成功！');
                    self.getList();
                });
            });
            self.uploader.error(function () {
                util.showMessage('导入出错，请检查文件，稍后再试！');
            });
        },

        /**
         * 绑定事件
         *
         * @method bindEvents
         */
        bindEvents: function () {
            var self = this;

            self.$search.on('click', $.proxy(self.search, self));

            self.$list.on('click', '[data-role="add"]', function () {
                var $tr = $(this).closest('tr'),
                    name = $tr.data('name'),
                    userno = $tr.data('userno');

                self.scoreChange(name, userno);
            });

            self.$list.on('click', '[data-role="deduct"]', function () {
                var $tr = $(this).closest('tr'),
                    name = $tr.data('name'),
                    userno = $tr.data('userno'),
                    score = $tr.data('score');

                self.scoreChange(name, userno, score);
            });

            self.$hand.on('click', function () {
                var $t = $(this);
                if ($t.children('i').hasClass('btn-up1')) {
                    return;
                }
                self.$hand.children('i').removeClass('btn-up1').addClass('btn-up');
                $t.children('i').removeClass('btn-up').addClass('btn-up1');
                self.sort($t.data('sort'));
            });
        }
    };

    app.init();
});