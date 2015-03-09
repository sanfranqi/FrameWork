/**
 * 积分系统后台
 *
 * @module admin
 */
define("app/admin/auction/main-debug", [ "$-debug", "../../common/util-debug", "../../common/config-debug", "../../common/dialog/confirmbox-debug", "arale/dialog/1.3.0/dialog-debug", "arale/overlay/1.1.4/overlay-debug", "arale/position/1.0.1/position-debug", "arale/iframe-shim/1.0.2/iframe-shim-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "arale/overlay/1.1.4/mask-debug", "arale/templatable/0.9.2/templatable-debug", "gallery/handlebars/1.0.2/handlebars-debug", "gallery/handlebars/1.0.2/runtime-debug", "../../common/dialog/confirmbox-debug.handlebars", "../../common/dialog/confirmbox-debug.css", "../../common/io-debug", "../../common/helpers-debug", "gallery/moment/2.0.0/moment-debug", "../../common/validator-debug", "arale/validator/0.9.7/validator-debug", "arale/upload/1.1.1/upload-debug", "./auctionDialog-debug.handlebars", "./auctionList-debug.handlebars", "./awardForm-debug.handlebars", "./awardList-debug.handlebars", "./awardSort-debug.handlebars", "./manageDialog-debug.handlebars", "./resultDialog-debug.handlebars", "keenwon/jqPaginator/1.1.0/jqPaginator-debug", "keenwon/dragsort/0.5.1/dragsort-debug", "fiftyk/bootstrap-datetimepicker/1.0.0/bootstrap-datetimepicker-debug", "../../common/initDatetimepicker-debug" ], function(require) {
    "use strict";
    var $ = require("$-debug"), util = require("../../common/util-debug"), io = require("../../common/io-debug"), helpers = require("../../common/helpers-debug"), ConfirmBox = require("../../common/dialog/confirmbox-debug"), Validator = require("../../common/validator-debug"), moment = require("gallery/moment/2.0.0/moment-debug"), Uploader = require("arale/upload/1.1.1/upload-debug"), auctionDialogTemplate = require("./auctionDialog-debug.handlebars"), auctionListTemplate = require("./auctionList-debug.handlebars"), awardFormTemplate = require("./awardForm-debug.handlebars"), awardListTemplate = require("./awardList-debug.handlebars"), awardSortTemplate = require("./awardSort-debug.handlebars"), manageDialogTemplate = require("./manageDialog-debug.handlebars"), resultDialogTemplate = require("./resultDialog-debug.handlebars");
    require("gallery/handlebars/1.0.2/handlebars-debug");
    require("gallery/handlebars/1.0.2/runtime-debug");
    require("keenwon/jqPaginator/1.1.0/jqPaginator-debug");
    require("keenwon/dragsort/0.5.1/dragsort-debug");
    require("fiftyk/bootstrap-datetimepicker/1.0.0/bootstrap-datetimepicker-debug");
    require("fiftyk/bootstrap-datetimepicker/1.0.0/bootstrap-datetimepicker-debug.css");
    require("../../common/initDatetimepicker-debug");
    //这个页面有Uploader，错误信息会导致按钮高度变化
    Validator = Validator.extend({
        attrs: {
            autoSubmit: false,
            stopOnError: true,
            showMessage: function(message, element) {
                message = '<i class="ico ico-error"></i>' + message;
                element = this.getItem(element).closest("form").find(".validatorError");
                this.getExplain(element).html(message);
                this.getItem(element).addClass("has-error");
            },
            hideMessage: function(message, element) {
                element = this.getItem(element).closest("form").find(".validatorError");
                this.getExplain(element).html("&nbsp;");
            }
        }
    });
    //Handlebars helpers
    helpers = $.extend({}, helpers, {
        getState: function(val) {
            var result = "";
            switch (val) {
              case "1":
                result = '<span class="c-black">未开始</span>';
                break;

              case "2":
              case "3":
                result = '<span class="c-green">进行中</span>';
                break;

              case "4":
                result = "已结束";
                break;

              default:
                result = "";
                break;
            }
            return result;
        },
        getBtnStatus: function(auctionState, startTime, type) {
            var result = "";
            switch (auctionState) {
              case "4":
                result = type === "get" ? "" : "hide";
                break;

              case "1":
                if (type === "get") {
                    result = "hide";
                } else {
                    result = startTime - +new Date() > 15 * 60 * 1e3 ? "" : "hide";
                }
                break;

              case "2":
              case "3":
                result = "hide";
                break;

              default:
                result = "";
                break;
            }
            return result;
        }
    });
    //validate rule
    Validator.addRule("customTime", function(options) {
        var $el = $(options.element), val = $el.val();
        return /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}$/g.test(val);
    }, "{{display}}格式错误");
    Validator.addRule("validTime", function() {
        var startTime = Date.parse($("#J_Dialog_StartTime").val().replace(/-/g, "/"));
        var auctionTime = Date.parse($("#J_Dialog_AuctionTime").val().replace(/-/g, "/"));
        return startTime < auctionTime;
    }, "开始时间须小于竞拍时间");
    Validator.addRule("integer", function(options) {
        var $el = $(options.element), val = $el.val();
        return /^\d+$/g.test(val);
    }, "{{display}}格式错误，必须为大于0的整数");
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
            title: "",
            auctionState: 1,
            startTimeStart: "",
            endTimeEnd: "",
            pageNo: 1,
            pageSize: 5
        },
        /**
         * 初始化
         *
         * @method init
         */
        init: function() {
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
        cacheElement: function() {
            var self = this;
            self.$form = $("#J_Form");
            self.$search = $("#J_Search");
            self.$list = $("#J_List");
            self.$add = $("#J_Add");
            self.$page = $("#J_Page");
        },
        /**
         * 初始化日期控件
         *
         * @method initCalendar
         */
        initCalendar: function() {
            $("#J_Form_StartTime").datetimepicker({
                format: "yyyy-mm-dd",
                minView: "month",
                autoclose: true
            });
            $("#J_Form_EndTime").datetimepicker({
                format: "yyyy-mm-dd",
                minView: "month",
                autoclose: true
            });
        },
        /**
         * 校验查询对象，执行查询
         *
         * @method proof
         */
        proof: function() {
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
        verify: function() {
            var self = this, startTime = self.model.startTimeStart, endTime = self.model.endTimeEnd, reg = /^\d{4}-\d{2}-\d{2}$/;
            if (startTime && !reg.test(startTime) || endTime && !reg.test(endTime)) {
                util.showMessage("时间格式不正确!");
                return false;
            }
            startTime = startTime && Date.parse(startTime.replace(/-/g, "/") + " 00:00:00");
            endTime = endTime && Date.parse(endTime.replace(/-/g, "/") + " 23:59:59");
            if (startTime && endTime && startTime > endTime) {
                util.showMessage("开始时间必须小于结束时间!");
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
        getList: function() {
            var self = this;
            io.post(util.getUrl("auctionQuery"), self.model, function() {
                var result = this.data, listHtml = auctionListTemplate(result, {
                    helpers: helpers
                });
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
        paginator: function(currentPage, pageSize, totalCounts) {
            var self = this;
            if (totalCounts <= pageSize) {
                self.$page.data("jqPaginator") && self.$page.jqPaginator("destroy");
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
                onPageChange: function(num, type) {
                    if (type === "change" && self.model.pageNo != num) {
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
        add: function() {
            var self = this, cb = new ConfirmBox({
                align: {
                    selfXY: [ "50%", "-65px" ],
                    baseXY: [ "50%", 0 ]
                },
                width: 658,
                zIndex: 888,
                message: auctionDialogTemplate({
                    idAdd: true,
                    base: "3"
                }, {
                    helpers: helpers
                }),
                onConfirm: function() {
                    self.dialogValidator.execute(function(hasError) {
                        if (!hasError) {
                            var data = util.packForm("#J_Dialog_Form");
                            data.startTime = Date.parse(data.startTime.replace(/-/g, "/"));
                            data.auctionTime = Date.parse(data.auctionTime.replace(/-/g, "/"));
                            io.post(util.getUrl("auctionAdd"), data, function() {
                                cb.hide();
                                self.proof();
                            });
                        }
                    });
                }
            }).after("show", function() {
                self.initDialogValidator();
                self.initDialogCalendar();
            }).after("hide", function() {
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
        edit: function(id) {
            var self = this;
            io.get(util.getUrl("auctionGet"), {
                auctionId: id
            }, function() {
                var result = this.data;
                result.startTime = fdate(result.startTime);
                result.auctionTime = fdate(result.auctionTime);
                var cb = new ConfirmBox({
                    align: {
                        selfXY: [ "50%", "-65px" ],
                        baseXY: [ "50%", 0 ]
                    },
                    width: 658,
                    zIndex: 888,
                    message: auctionDialogTemplate(result, {
                        helpers: helpers
                    }),
                    onConfirm: function() {
                        self.dialogValidator.execute(function(hasError) {
                            if (!hasError) {
                                var data = util.packForm("#J_Dialog_Form");
                                data.startTime = Date.parse(data.startTime.replace(/-/g, "/"));
                                data.auctionTime = Date.parse(data.auctionTime.replace(/-/g, "/"));
                                io.post(util.getUrl("auctionUpdate"), data, function() {
                                    cb.hide();
                                    self.proof();
                                });
                            }
                        });
                    }
                }).after("show", function() {
                    self.initDialogValidator();
                    self.initDialogCalendar();
                }).after("hide", function() {
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
        initDialogValidator: function() {
            this.dialogValidator = new Validator({
                element: "#J_Dialog_Form"
            }).addItem({
                element: "[name=title]",
                display: "主题",
                rule: "maxlength{max:50}",
                required: true
            }).addItem({
                element: "[name=details]",
                display: "详情",
                rule: "maxlength{max:500}",
                required: true
            }).addItem({
                element: "[name=startTime]",
                display: "开始时间",
                rule: "customTime",
                required: true
            }).addItem({
                element: "[name=auctionTime]",
                display: "竞拍模式时间",
                rule: "customTime validTime",
                required: true
            });
        },
        /**
         * 初始化弹窗中的日期控件
         *
         * @method initDialogCalendar
         */
        initDialogCalendar: function() {
            var self = this;
            $("#J_Dialog_StartTime").datetimepicker({
                format: "yyyy-mm-dd hh:ii",
                autoclose: true,
                startDate: new Date(+new Date() + 16 * 60 * 1e3)
            }).on("changeDate", function() {
                self.dialogValidator && self.dialogValidator.execute();
            });
            $("#J_Dialog_AuctionTime").datetimepicker({
                format: "yyyy-mm-dd hh:ii",
                autoclose: true,
                startDate: new Date(+new Date() + 16 * 60 * 1e3)
            }).on("changeDate", function() {
                self.dialogValidator && self.dialogValidator.execute();
            });
        },
        /**
         * 销毁弹窗中的日期控件
         *
         * @method destroyDialogCalendar
         */
        destroyDialogCalendar: function() {
            $("#J_Dialog_StartTime").datetimepicker("remove");
            $("#J_Dialog_AuctionTime").datetimepicker("remove");
        },
        /**
         * 删除拍卖
         *
         * @method del
         * @param id {Number} 拍卖ID
         */
        del: function(id) {
            var self = this;
            ConfirmBox.confirm("确定要删除？", function() {
                io.post(util.getUrl("auctionDelete"), {
                    id: id
                }, function() {
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
        manage: function(auctionId) {
            var self = this;
            var cb = new ConfirmBox({
                align: {
                    selfXY: [ "50%", "-65px" ],
                    baseXY: [ "50%", 0 ]
                },
                width: 1250,
                zIndex: 888,
                message: manageDialogTemplate(),
                confirmTpl: "",
                cancelTpl: ""
            }).after("show", function() {
                var $manageDialogLeft = $("#J_ManageDialog_Left"), $manageDialogRight = $("#J_ManageDialog_Right");
                //删除奖品
                $manageDialogLeft.on("click", "[data-role=del]", function() {
                    self.delAward($(this).data("id"), auctionId);
                });
                //编辑奖品
                $manageDialogLeft.on("click", "[data-role=edit]", function() {
                    self.renderAwardForm(auctionId, $(this).data("id"));
                });
                //切换到排序
                $manageDialogLeft.on("click", "#J_Sort", function() {
                    self.getAwartList(auctionId, "sort");
                });
                //返回
                $manageDialogLeft.on("click", "#J_Sort_Save", $.proxy(self.sort, self, auctionId));
                //返回
                $manageDialogLeft.on("click", "#J_Sort_Back", function() {
                    self.getAwartList(auctionId);
                });
                //添加奖品
                $manageDialogRight.on("click", "#J_AwardForm_Add", $.proxy(self.saveAward, self, auctionId));
                //编辑奖品
                $manageDialogRight.on("click", "#J_AwardForm_Save", $.proxy(self.saveAward, self, auctionId, "edit"));
                //取消编辑
                $manageDialogRight.on("click", "#J_AwardForm_Cancel", $.proxy(self.renderAwardForm, self, auctionId));
                self.getAwartList(auctionId);
                self.renderAwardForm(auctionId);
                self.initAwardUploader();
                self.initImportsUploader(auctionId);
            }).after("hide", function() {
                self.awardValidator && self.awardValidator.destroy();
                $("#J_ManageDialog_Left").off();
                $("#J_ManageDialog_Right").off();
                $(".J_Sort_List").sortable("destroy");
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
        getAwartList: function(auctionId, type) {
            $(".J_Sort_List").sortable("destroy");
            io.get(util.getUrl("auctionAwardQuery"), {
                auctionId: auctionId
            }, function() {
                var listData = this.data;
                if (type === "sort") {
                    var batchList = sortData(listData);
                    $("#J_ManageDialog_Left").html(awardSortTemplate(batchList, {
                        helpers: helpers
                    }));
                    $(".J_Sort_List").sortable({
                        connectWith: ".J_Sort_List",
                        placeholder: "dragsort"
                    }).disableSelection();
                } else {
                    $("#J_ManageDialog_Left").html(awardListTemplate(listData, {
                        helpers: helpers
                    }));
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
        renderAwardForm: function(auctionId, awardId) {
            var self = this;
            self.awardValidator && self.awardValidator.destroy();
            if (Object.prototype.toString.call(awardId) === "[object Number]") {
                io.get(util.getUrl("auctionAwardGet"), {
                    awardId: awardId
                }, function() {
                    var result = $.extend({}, this.data, {
                        isEdit: true,
                        auctionId: auctionId
                    });
                    $("#J_ManageDialog_Right").html(awardFormTemplate(result));
                    self.initAwardValidator("edit");
                });
            } else {
                $("#J_ManageDialog_Right").html(awardFormTemplate({
                    auctionId: auctionId
                }));
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
                element: "#J_AwardForm"
            }).addItem({
                element: "[name=name]",
                display: "名称",
                rule: "maxlength{max:50}",
                required: true
            }).addItem({
                element: "[name=description]",
                display: "描述",
                rule: "maxlength{max:500}",
                required: true
            }).addItem({
                element: "[name=image]",
                display: "图片",
                required: true,
                errormessageRequired: "请上传图片"
            }).addItem({
                element: "[name=price]",
                rule: "integer",
                display: "价格",
                required: true
            });
            if (type !== "edit") {
                this.awardValidator.addItem({
                    element: "[name=awardNum]",
                    rule: "integer min{min:1}",
                    display: "物品数",
                    required: true
                });
            }
        },
        /**
         * 初始化奖品的图片上传
         *
         * @method initAwardUploader
         */
        initAwardUploader: function() {
            var awardUploader = new Uploader({
                trigger: "#J_AwardForm_Upload",
                name: "imageFile",
                action: util.getUrl("auctionAwardUploadImage"),
                accept: "image/jpeg,image/gif,image/bmp,image/png"
            });
            awardUploader.change(function(val) {
                var name = val[0].name, index = name.lastIndexOf(".") + 1, len = name.length, suffix = name.slice(index - len), msg = '<i class="ico ico-error"></i>格式必须是jpg,png,gif或bmp';
                if (suffix !== "jpg" && suffix !== "jpeg" && suffix !== "png" && suffix !== "gif" && suffix !== "bmp") {
                    $('[name="image"]').parent("div").addClass("has-error").children(".help-block").html(msg);
                } else {
                    awardUploader.submit();
                }
            });
            awardUploader.success(function(response) {
                //bug: IE9会下载json数据，所以接口响应类型改为text/html 手动解析json
                response = $.parseJSON(response);
                io.processor(response, {
                    success: function() {
                        $('[name="image"]').val(this.data);
                    },
                    error: function(msg) {
                        $('[name="image"]').val("");
                        util.showMessage(msg);
                    }
                });
            });
            awardUploader.error(function() {
                util.showMessage("导入出错，请检查文件，稍后再试！");
            });
        },
        /**
         * 初始化导入按钮的上传
         *
         * @method initImportsUploader
         * @param auctionId {Number} 拍卖ID
         */
        initImportsUploader: function(auctionId) {
            var self = this;
            self.importsUploader = new Uploader({
                trigger: "#J_AwardForm_Imports",
                data: {
                    auctionId: auctionId
                },
                name: "compressFile",
                action: util.getUrl("auctionAwardImports"),
                accept: ".rar, .zip"
            });
            self.importsUploader.change(function(val) {
                var name = val[0].name, index = name.lastIndexOf(".") + 1, len = name.length, suffix = name.slice(index - len), msg = "格式必须是rar或zip";
                if (suffix !== "rar" && suffix !== "zip") {
                    util.showMessage(msg);
                } else {
                    util.showMessage("文件上传中...");
                    self.importsUploader.submit();
                }
            });
            self.importsUploader.success(function(response) {
                //bug: IE9会下载json数据，所以接口响应类型改为text/html 手动解析json
                response = $.parseJSON(response);
                io.processor(response, {
                    success: function() {
                        util.showMessage("导入成功！");
                        self.getAwartList(auctionId);
                        self.getList();
                    },
                    error: function(msg) {
                        util.showMessage(msg);
                    }
                });
            });
            self.importsUploader.error(function() {
                util.showMessage("导入出错，请检查文件，稍后再试！");
            });
        },
        /**
         * 保存奖品
         *
         * @method saveAward
         * @param id {Number} 拍卖ID
         * @param [type] {String} 'edit'表示是编辑后的保存
         */
        saveAward: function(id, type) {
            var self = this, url = util.getUrl("auctionAwardAdd");
            if (type === "edit") {
                url = util.getUrl("auctionAwardUpdate");
            }
            self.awardValidator.execute(function(hasError) {
                if (!hasError) {
                    self.disableButton($("#J_AwardForm_Save"));
                    self.disableButton($("#J_AwardForm_Add"));
                    io.post(url, util.packForm("#J_AwardForm"), {
                        success: function() {
                            self.getAwartList(id);
                            self.renderAwardForm(id);
                            self.getList();
                        },
                        error: function(msg) {
                            self.showError(msg);
                            self.enableButton($("#J_AwardForm_Save"));
                            self.enableButton($("#J_AwardForm_Add"));
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
        delAward: function(id, auctionId) {
            var self = this;
            ConfirmBox.confirm("确定要删除？", function() {
                io.post(util.getUrl("auctionAwardDelete"), {
                    id: id
                }, function() {
                    self.getAwartList(auctionId);
                    self.getList();
                });
            });
        },
        /**
         * 奖品排序
         *
         * @method sort
         * @param auctionId {Number} 拍卖ID
         */
        sort: function(auctionId) {
            var self = this, $uls = $(".J_Sort_List"), length = $uls.length, ids = [];
            for (var i = 0; i < length; i++) {
                if ($uls.eq(i).children(".J_Sort_Item").length < 6 && i + 1 !== length) {
                    util.showMessage("除最后一批次外，其余所有批次物品数必须为6！");
                    return;
                }
            }
            $(".J_Sort_Item").map(function() {
                ids.push($(this).data("id"));
            });
            io.post(util.getUrl("auctionAwardSort"), {
                ids: ids
            }, function() {
                self.getAwartList(auctionId);
            });
        },
        /**
         * 将Button设置为disable
         *
         * @method disableButton
         * @param $btn {Object} 按钮的jQuery对象
         */
        disableButton: function($btn) {
            $btn.prop("disabled", true);
        },
        /**
         * 将Button设置为enable
         *
         * @method enableButton
         */
        enableButton: function($btn) {
            $btn.prop("disabled", false);
        },
        /**
         * 查看竞拍结果
         *
         * @method getResult
         * @param auctionId
         */
        getResult: function(auctionId) {
            io.get(util.getUrl("auctionAwardResult"), {
                auctionId: auctionId
            }, function() {
                var result = this.data;
                var cb = new ConfirmBox({
                    align: {
                        selfXY: [ "50%", "-65px" ],
                        baseXY: [ "50%", 0 ]
                    },
                    width: 900,
                    zIndex: 888,
                    message: resultDialogTemplate(result, {
                        helpers: helpers
                    }),
                    confirmTpl: "",
                    cancelTpl: ""
                }).after("hide", function() {
                    cb.destroy();
                }).show();
            });
        },
        /**
         * 事件绑定
         *
         * @method bindEvents
         */
        bindEvents: function() {
            var self = this;
            self.$list.on("click", "[data-role=del]", function() {
                self.del($(this).data("id"));
            });
            self.$list.on("click", "[data-role=edit]", function() {
                self.edit($(this).data("id"));
            });
            self.$list.on("click", "[data-role=manage]", function() {
                self.manage($(this).data("id"));
            });
            self.$list.on("click", "[data-role=get]", function() {
                self.getResult($(this).data("id"));
            });
            self.$search.on("click", $.proxy(self.proof, self));
            self.$add.on("click", $.proxy(self.add, self));
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
        return moment(timestamp).format("YYYY-MM-DD HH:mm");
    }
    /**
     * 辅助方法：格式化排序对象
     *
     * @method sortData
     * @param data {Object} 奖品列表数据
     * @returns {Array}
     */
    function sortData(data) {
        var batchList = [], batchIndex = 0, lastBatchTime = 0, currentAward = null;
        for (var i = 0, j = data.length; i < j; i++) {
            batchIndex = Math.floor(i / 6);
            currentAward = data[i];
            //注意：后端给的createTime是竞拍模式开始时间
            lastBatchTime = lastBatchTime === 0 ? currentAward.createTime : lastBatchTime;
            if (!batchList[batchIndex]) {
                batchList[batchIndex] = {};
            }
            if (!batchList[batchIndex].title) {
                batchList[batchIndex].title = "第 " + (batchIndex + 1) + " 批次";
            }
            if (!batchList[batchIndex].time) {
                batchList[batchIndex].time = "（" + fdate(lastBatchTime) + " ~ " + fdate(lastBatchTime += 72e4) + "）";
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

define("app/common/util-debug", [ "app/common/config-debug", "app/common/dialog/confirmbox-debug", "$-debug", "arale/dialog/1.3.0/dialog-debug", "arale/overlay/1.1.4/overlay-debug", "arale/position/1.0.1/position-debug", "arale/iframe-shim/1.0.2/iframe-shim-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "arale/overlay/1.1.4/mask-debug", "arale/templatable/0.9.2/templatable-debug", "gallery/handlebars/1.0.2/handlebars-debug", "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
    "use strict";
    var util = {};
    var config = require("app/common/config-debug");
    var ConfirmBox = require("app/common/dialog/confirmbox-debug");
    var $ = require("$-debug");
    var $message = $("#J_Message");
    var win = window;
    util.urlParams = function() {
        return util.queryToJson(window.location.search.replace(/^\?/, ""));
    };
    util.packForm = function(form, escape) {
        var $form = typeof form === "string" ? $(form) : form;
        var a = $form.serializeArray();
        var o = {};
        escape = typeof escape == "undefined" ? true : false;
        $.each(a, function() {
            var value = this.value;
            this.value = value === "null" ? null : this.value;
            if (typeof o[this.name] !== "undefined") {
                if (!o[this.name].push) {
                    o[this.name] = [ o[this.name] ];
                }
                o[this.name].push(escape ? util.escape(this.value) : $.trim(this.value));
            } else {
                o[this.name] = escape ? util.escape(this.value) : $.trim(this.value);
            }
        });
        return o;
    };
    util.escape = function(str) {
        return $.trim(str).replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    };
    util.getUrl = function(k) {
        var base = ctx ? ctx + "/" : "/";
        return base + config[k];
    };
    //    util.showMessage = function (msg) {
    //        ConfirmBox.show('<p style="text-align: center;">' + msg + '</p>', null, {
    //            align: {
    //                selfXY: ['50%', '-200px'],
    //                baseXY: ['50%', 0]
    //            },
    //            width: '350px'
    //        });
    //    };
    util.showMessage = function(msg, cfg) {
        if (!$message) {
            return;
        }
        cfg || (cfg = {
            isError: true,
            top: "0"
        });
        $message.find(".alert-message-text").html(msg);
        var isError = false;
        var top = "60px";
        if (cfg) {
            isError = cfg.isError;
            top = cfg.top;
        }
        $message.animate({
            top: top
        });
        if (isError) {
            $message.addClass("alert-error").find(".close").off("click").on("click", function() {
                $message.removeClass("alert-error").animate({
                    top: "-80px"
                });
            });
        } else {
            win.setTimeout(function() {
                $message.animate({
                    top: "-60px"
                });
            }, 3e3);
        }
    };
    return util;
});

define("app/common/config-debug", [], {
    //首页
    indexList: "scoreRecord/queryFrontScoreRecordList.do",
    indexUser: "score/queryUserScore.do",
    //历史拍卖
    historyList: "auction/query.do",
    historyDetail: "auctionRecord/queryByAwardId.do",
    //排行榜
    rankList: "score/userScoreList.do",
    //我的奖品
    myAward: "award/queryAwardPage.do",
    //拍卖
    systemTime: "auction/systemTime.do",
    auction: "auctionRecord/bidAward.do",
    //拍卖-普通模式
    queryMyScore: "auctionRecord/currentScore.do",
    normalQueryAll: "award/queryAwardNormalState.do",
    normalQueryAble: "award/queryAwardAble.do",
    normalQueryFollow: "award/queryFocusAward.do",
    normalQueryAllRefresh: "awardLeader/queryAwardLeaderByAuction.do",
    normalQueryAbleRefresh: "awardLeader/getMyLeaderInfoList.do",
    normalQueryFollowRefresh: "awardLeader/getFocusLeaderInfoList.do",
    normalFollow: "awardFocus/add.do",
    normalUnfollow: "awardFocus/delete.do",
    //拍卖-疯狂模式
    crazyQuery: "auction/crazy/refreshAll.do",
    crazyRefresh: "auction/crazy/refresh.do",
    //后台-下拉
    selectUsers: "select/users.do",
    selectSystems: "select/systems.do",
    //后台-积分列表管理
    adminScoreQuery: "score/query.do",
    adminScoreAdd: "score/increase.do",
    adminScoreImport: "score/importScoreList.do",
    adminScoreDeduct: "score/decrease.do",
    //后台-积分变更日志
    logQuery: "scoreRecord/query.do",
    //后台-拍卖管理
    auctionQuery: "auction/query.do",
    auctionDelete: "auction/delete.do",
    auctionAdd: "auction/add.do",
    auctionUpdate: "auction/update.do",
    auctionGet: "auction/get.do",
    auctionAwardResult: "award/queryAwardResult.do",
    auctionAwardGet: "award/get.do",
    auctionAwardQuery: "award/queryAwardResult.do",
    auctionAwardAdd: "award/add.do",
    auctionAwardUpdate: "award/update.do",
    auctionAwardDelete: "award/delete.do",
    auctionAwardUploadImage: "award/uploadImage.do",
    auctionAwardImports: "award/addByFile.do",
    auctionAwardSort: "award/sort.do"
});

define("app/common/dialog/confirmbox-debug", [ "$-debug", "arale/dialog/1.3.0/dialog-debug", "arale/overlay/1.1.4/overlay-debug", "arale/position/1.0.1/position-debug", "arale/iframe-shim/1.0.2/iframe-shim-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "arale/overlay/1.1.4/mask-debug", "arale/templatable/0.9.2/templatable-debug", "gallery/handlebars/1.0.2/handlebars-debug", "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
    "use strict";
    var $ = require("$-debug");
    var Dialog = require("arale/dialog/1.3.0/dialog-debug");
    var template = require("app/common/dialog/confirmbox-debug.handlebars");
    require("app/common/dialog/confirmbox-debug.css");
    // ConfirmBox
    // -------
    // ConfirmBox 是一个有基础模板和样式的对话框组件。
    /**
     * [setup description]
     * @param  {[type]}  )           {                                                                  ConfirmBox.superclass.setup.call(this);                                                        var model =                   {                                              classPrefix: this.get("classPrefix") [description]
     * @param  {[type]}  message:    this.get("message")    [description]
     * @param  {[type]}  title:      this.get("title")      [description]
     * @param  {[type]}  confirmTpl: this.get("confirmTpl") [description]
     * @param  {[type]}  cancelTpl:  this.get("cancelTpl")  [description]
     * @param  {Boolean} hasPadding: this.get('hasPadding') [description]
     * @param  {Boolean} hasFoot:    this.get("confirmTpl") ||            this.get("cancelTpl")                                                                        };                                        this.set("content", template(model));        } [description]
     * @param  {[type]}  events:     {                                                                  "click                                  [data-role=confirm]": function(e [description]
     * @return {[type]}              [description]
     */
    var ConfirmBox = Dialog.extend({
        attrs: {
            title: "",
            classPrefix: "ermp-dialog",
            width: "900px",
            hasPadding: true,
            confirmTpl: '<a class="btn btn2" href="javascript:;">确定</a>',
            cancelTpl: '<a class="btn btn2" href="javascript:;">取消</a>',
            message: "默认内容"
        },
        setup: function() {
            ConfirmBox.superclass.setup.call(this);
            var model = {
                classPrefix: this.get("classPrefix"),
                message: this.get("message"),
                title: this.get("title"),
                confirmTpl: this.get("confirmTpl"),
                cancelTpl: this.get("cancelTpl"),
                hasPadding: this.get("hasPadding"),
                hasFoot: this.get("confirmTpl") || this.get("cancelTpl")
            };
            this.set("content", template(model));
        },
        events: {
            "click [data-role=confirm]": function(e) {
                e.preventDefault();
                this.trigger("confirm");
            },
            "click [data-role=cancel]": function(e) {
                e.preventDefault();
                this.trigger("cancel");
                this.hide();
            }
        },
        _onChangeMessage: function(val) {
            this.$("[data-role=message]").html(val);
        },
        _onChangeTitle: function(val) {
            this.$("[data-role=title]").html(val);
        },
        _onChangeConfirmTpl: function(val) {
            this.$("[data-role=confirm]").html(val);
        },
        _onChangeCancelTpl: function(val) {
            this.$("[data-role=cancel]").html(val);
        }
    });
    ConfirmBox.alert = function(message, callback, options) {
        message = '<div style="padding:10px">' + message + "</div>";
        var defaults = {
            message: message,
            width: "500px",
            onConfirm: function() {
                typeof callback == "function" && callback();
                this.hide();
            }
        };
        new ConfirmBox($.extend(null, defaults, options)).show().after("hide", function() {
            this.destroy();
        });
    };
    ConfirmBox.confirm = function(message, onConfirm, onCancel, options) {
        // support confirm(message, title, onConfirm, options)
        if (typeof onCancel === "object" && !options) {
            options = onCancel;
        }
        var defaults = {
            message: message,
            className: "ermp-confirm",
            width: "250px",
            confirmTpl: '<a class="btn btn2 btn-s" href="javascript:;">确定</a>',
            cancelTpl: '<a class="btn btn2 btn-s" href="javascript:;">取消</a>',
            onConfirm: function() {
                onConfirm && onConfirm();
                this.hide();
            },
            onCancel: function() {
                typeof onCancel == "function" && onCancel();
                this.hide();
            },
            align: {
                selfXY: [ "50%", "-100px" ],
                baseXY: [ "50%", 0 ]
            }
        };
        new ConfirmBox($.extend(null, defaults, options)).show().after("hide", function() {
            this.destroy();
        });
    };
    /**
     * 纯显示内容，无确认，取消按钮
     * 
     * @param  {[type]}   message  显示的内容，可为 html
     * @param  {Function} callback 显示后的回调
     * @param  {[type]}   options  配置对象
     * @return {[type]}            [description]
     */
    ConfirmBox.show = function(message, callback, options) {
        var defaults = {
            message: message,
            title: "",
            confirmTpl: false,
            cancelTpl: false
        };
        new ConfirmBox($.extend(null, defaults, options)).after("show", function() {
            callback && callback();
        }).show().after("hide", function() {
            this.destroy();
        });
    };
    module.exports = ConfirmBox;
    module.exports.outerBoxClass = "arale-dialog-1_2_5";
});

define("arale/dialog/1.3.0/dialog-debug", [ "$-debug", "arale/overlay/1.1.4/overlay-debug", "arale/position/1.0.1/position-debug", "arale/iframe-shim/1.0.2/iframe-shim-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "arale/overlay/1.1.4/mask-debug", "arale/templatable/0.9.2/templatable-debug", "gallery/handlebars/1.0.2/handlebars-debug" ], function(require, exports, module) {
    var $ = require("$-debug"), Overlay = require("arale/overlay/1.1.4/overlay-debug"), mask = require("arale/overlay/1.1.4/mask-debug"), Events = require("arale/events/1.1.0/events-debug"), Templatable = require("arale/templatable/0.9.2/templatable-debug");
    // Dialog
    // ---
    // Dialog 是通用对话框组件，提供显隐关闭、遮罩层、内嵌iframe、内容区域自定义功能。
    // 是所有对话框类型组件的基类。
    var Dialog = Overlay.extend({
        Implements: Templatable,
        attrs: {
            // 模板
            template: require("./dialog-debug.handlebars"),
            // 对话框触发点
            trigger: {
                value: null,
                getter: function(val) {
                    return $(val);
                }
            },
            // 统一样式前缀
            classPrefix: "ui-dialog",
            // 指定内容元素，可以是 url 地址
            content: {
                value: null,
                setter: function(val) {
                    // 判断是否是 url 地址
                    if (/^(https?:\/\/|\/|\.\/|\.\.\/)/.test(val)) {
                        this._type = "iframe";
                        // 用 ajax 的方式而不是 iframe 进行载入
                        if (val.indexOf("?ajax") > 0 || val.indexOf("&ajax") > 0) {
                            this._ajax = true;
                        }
                    }
                    return val;
                }
            },
            // 是否有背景遮罩层
            hasMask: true,
            // 关闭按钮可以自定义
            closeTpl: "×",
            // 默认宽度
            width: 500,
            // 默认高度
            height: null,
            // iframe 类型时，dialog 的最初高度
            initialHeight: 300,
            // 简单的动画效果 none | fade
            effect: "none",
            // 不用解释了吧
            zIndex: 999,
            // 是否自适应高度
            autoFit: true,
            // 默认定位居中
            align: {
                value: {
                    selfXY: [ "50%", "50%" ],
                    baseXY: [ "50%", "42%" ]
                },
                getter: function(val) {
                    // 高度超过一屏的情况
                    // https://github.com/aralejs/dialog/issues/41
                    if (this.element.height() > $(window).height()) {
                        return {
                            selfXY: [ "50%", "0" ],
                            baseXY: [ "50%", "0" ]
                        };
                    }
                    return val;
                }
            }
        },
        parseElement: function() {
            this.set("model", {
                classPrefix: this.get("classPrefix")
            });
            Dialog.superclass.parseElement.call(this);
            this.contentElement = this.$("[data-role=content]");
            // 必要的样式
            this.contentElement.css({
                height: "100%",
                zoom: 1
            });
            // 关闭按钮先隐藏
            // 后面当 onRenderCloseTpl 时，如果 closeTpl 不为空，会显示出来
            // 这样写是为了回避 arale.base 的一个问题：
            // 当属性初始值为''时，不会进入 onRender 方法
            // https://github.com/aralejs/base/issues/7
            this.$("[data-role=close]").hide();
        },
        events: {
            "click [data-role=close]": function(e) {
                e.preventDefault();
                this.hide();
            }
        },
        show: function() {
            // iframe 要在载入完成才显示
            if (this._type === "iframe") {
                // ajax 读入内容并 append 到容器中
                if (this._ajax) {
                    this._ajaxHtml();
                } else {
                    // iframe 还未请求完，先设置一个固定高度
                    !this.get("height") && this.contentElement.css("height", this.get("initialHeight"));
                    this._showIframe();
                }
            }
            Dialog.superclass.show.call(this);
            return this;
        },
        hide: function() {
            // 把 iframe 状态复原
            if (this._type === "iframe" && this.iframe) {
                this.iframe.attr({
                    src: "javascript:'';"
                });
                // 原来只是将 iframe 的状态复原
                // 但是发现在 IE6 下，将 src 置为 javascript:''; 会出现 404 页面
                this.iframe.remove();
                this.iframe = null;
            }
            Dialog.superclass.hide.call(this);
            clearInterval(this._interval);
            delete this._interval;
            return this;
        },
        destroy: function() {
            this.element.remove();
            this._hideMask();
            clearInterval(this._interval);
            return Dialog.superclass.destroy.call(this);
        },
        setup: function() {
            Dialog.superclass.setup.call(this);
            this._setupTrigger();
            this._setupMask();
            this._setupKeyEvents();
            this._setupFocus();
            toTabed(this.element);
            toTabed(this.get("trigger"));
            // 默认当前触发器
            this.activeTrigger = this.get("trigger").eq(0);
        },
        // onRender
        // ---
        _onRenderContent: function(val) {
            if (this._type !== "iframe") {
                var value;
                // 有些情况会报错
                try {
                    value = $(val);
                } catch (e) {
                    value = [];
                }
                if (value[0]) {
                    this.contentElement.empty().append(value);
                } else {
                    this.contentElement.empty().html(val);
                }
                // #38 #44
                this._setPosition();
            }
        },
        _onRenderCloseTpl: function(val) {
            if (val === "") {
                this.$("[data-role=close]").html(val).hide();
            } else {
                this.$("[data-role=close]").html(val).show();
            }
        },
        // 覆盖 overlay，提供动画
        _onRenderVisible: function(val) {
            if (val) {
                if (this.get("effect") === "fade") {
                    // 固定 300 的动画时长，暂不可定制
                    this.element.fadeIn(300);
                } else {
                    this.element.show();
                }
            } else {
                this.element.hide();
            }
        },
        // 私有方法
        // ---
        // 绑定触发对话框出现的事件
        _setupTrigger: function() {
            this.delegateEvents(this.get("trigger"), "click", function(e) {
                e.preventDefault();
                // 标识当前点击的元素
                this.activeTrigger = $(e.currentTarget);
                this.show();
            });
        },
        // 绑定遮罩层事件
        _setupMask: function() {
            var that = this;
            // 存放 mask 对应的对话框
            mask._dialogs = mask._dialogs || [];
            this.after("show", function() {
                if (!this.get("hasMask")) {
                    return;
                }
                // not using the z-index
                // because multiable dialogs may share same mask
                mask.set("zIndex", that.get("zIndex")).show();
                mask.element.insertBefore(that.element);
                // 避免重复存放
                var existed = false;
                for (var i = 0; i < mask._dialogs.length; i++) {
                    if (mask._dialogs[i] === that) {
                        existed = true;
                    }
                }
                // 依次存放对应的对话框
                if (!existed) {
                    mask._dialogs.push(that);
                }
            });
            this.after("hide", this._hideMask);
        },
        // 隐藏 mask
        _hideMask: function() {
            if (!this.get("hasMask")) {
                return;
            }
            mask._dialogs && mask._dialogs.pop();
            if (mask._dialogs && mask._dialogs.length > 0) {
                var last = mask._dialogs[mask._dialogs.length - 1];
                mask.set("zIndex", last.get("zIndex"));
                mask.element.insertBefore(last.element);
            } else {
                mask.hide();
            }
        },
        // 绑定元素聚焦状态
        _setupFocus: function() {
            this.after("show", function() {
                this.element.focus();
            });
            this.after("hide", function() {
                // 关于网页中浮层消失后的焦点处理
                // http://www.qt06.com/post/280/
                this.activeTrigger && this.activeTrigger.focus();
            });
        },
        // 绑定键盘事件，ESC关闭窗口
        _setupKeyEvents: function() {
            this.delegateEvents($(document), "keyup.esc", function(e) {
                if (e.keyCode === 27) {
                    this.get("visible") && this.hide();
                }
            });
        },
        _showIframe: function() {
            var that = this;
            // 若未创建则新建一个
            if (!this.iframe) {
                this._createIframe();
            }
            // 开始请求 iframe
            this.iframe.attr({
                src: this._fixUrl(),
                name: "dialog-iframe" + new Date().getTime()
            });
            // 因为在 IE 下 onload 无法触发
            // http://my.oschina.net/liangrockman/blog/24015
            // 所以使用 jquery 的 one 函数来代替 onload
            // one 比 on 好，因为它只执行一次，并在执行后自动销毁
            this.iframe.one("load", function() {
                // 如果 dialog 已经隐藏了，就不需要触发 onload
                if (!that.get("visible")) {
                    return;
                }
                // 绑定自动处理高度的事件
                if (that.get("autoFit")) {
                    clearInterval(that._interval);
                    that._interval = setInterval(function() {
                        that._syncHeight();
                    }, 300);
                }
                that._syncHeight();
                that._setPosition();
                that.trigger("complete:show");
            });
        },
        _fixUrl: function() {
            var s = this.get("content").match(/([^?#]*)(\?[^#]*)?(#.*)?/);
            s.shift();
            s[1] = (s[1] && s[1] !== "?" ? s[1] + "&" : "?") + "t=" + new Date().getTime();
            return s.join("");
        },
        _createIframe: function() {
            var that = this;
            this.iframe = $("<iframe>", {
                src: "javascript:'';",
                scrolling: "no",
                frameborder: "no",
                allowTransparency: "true",
                css: {
                    border: "none",
                    width: "100%",
                    display: "block",
                    height: "100%",
                    overflow: "hidden"
                }
            }).appendTo(this.contentElement);
            // 给 iframe 绑一个 close 事件
            // iframe 内部可通过 window.frameElement.trigger('close') 关闭
            Events.mixTo(this.iframe[0]);
            this.iframe[0].on("close", function() {
                that.hide();
            });
        },
        _syncHeight: function() {
            var h;
            // 如果未传 height，才会自动获取
            if (!this.get("height")) {
                try {
                    this._errCount = 0;
                    h = getIframeHeight(this.iframe) + "px";
                } catch (err) {
                    // 页面跳转也会抛错，最多失败6次
                    this._errCount = (this._errCount || 0) + 1;
                    if (this._errCount >= 6) {
                        // 获取失败则给默认高度 300px
                        // 跨域会抛错进入这个流程
                        h = this.get("initialHeight");
                        clearInterval(this._interval);
                        delete this._interval;
                    }
                }
                this.contentElement.css("height", h);
                // force to reflow in ie6
                // http://44ux.com/blog/2011/08/24/ie67-reflow-bug/
                this.element[0].className = this.element[0].className;
            } else {
                clearInterval(this._interval);
                delete this._interval;
            }
        },
        _ajaxHtml: function() {
            var that = this;
            this.contentElement.css("height", this.get("initialHeight"));
            this.contentElement.load(this.get("content"), function() {
                that._setPosition();
                that.contentElement.css("height", "");
                that.trigger("complete:show");
            });
        }
    });
    module.exports = Dialog;
    // Helpers
    // ----
    // 让目标节点可以被 Tab
    function toTabed(element) {
        if (element.attr("tabindex") == null) {
            element.attr("tabindex", "-1");
        }
    }
    // 获取 iframe 内部的高度
    function getIframeHeight(iframe) {
        var D = iframe[0].contentWindow.document;
        if (D.body.scrollHeight && D.documentElement.scrollHeight) {
            return Math.min(D.body.scrollHeight, D.documentElement.scrollHeight);
        } else if (D.documentElement.scrollHeight) {
            return D.documentElement.scrollHeight;
        } else if (D.body.scrollHeight) {
            return D.body.scrollHeight;
        }
    }
    module.exports.outerBoxClass = "arale-dialog-1_3_0";
});

define("arale/dialog/1.3.0/dialog-debug.handlebars", [ "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.0.2/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 3, ">= 1.0.0-rc.4" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        var buffer = "", stack1, functionType = "function", escapeExpression = this.escapeExpression;
        buffer += '<div class="';
        if (stack1 = helpers.classPrefix) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.classPrefix;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + '">\n    <a class="';
        if (stack1 = helpers.classPrefix) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.classPrefix;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + '-close" title="Close" href="javascript:;" data-role="close"></a>\n    <div class="';
        if (stack1 = helpers.classPrefix) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.classPrefix;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + '-content" data-role="content"></div>\n</div>\n';
        return buffer;
    });
});

define("arale/overlay/1.1.4/overlay-debug", [ "$-debug", "arale/position/1.0.1/position-debug", "arale/iframe-shim/1.0.2/iframe-shim-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug" ], function(require, exports, module) {
    var $ = require("$-debug"), Position = require("arale/position/1.0.1/position-debug"), Shim = require("arale/iframe-shim/1.0.2/iframe-shim-debug"), Widget = require("arale/widget/1.1.1/widget-debug");
    // Overlay
    // -------
    // Overlay 组件的核心特点是可定位（Positionable）和可层叠（Stackable）
    // 是一切悬浮类 UI 组件的基类
    var Overlay = Widget.extend({
        attrs: {
            // 基本属性
            width: null,
            height: null,
            zIndex: 99,
            visible: false,
            // 定位配置
            align: {
                // element 的定位点，默认为左上角
                selfXY: [ 0, 0 ],
                // 基准定位元素，默认为当前可视区域
                baseElement: Position.VIEWPORT,
                // 基准定位元素的定位点，默认为左上角
                baseXY: [ 0, 0 ]
            },
            // 父元素
            parentNode: document.body
        },
        show: function() {
            // 若从未渲染，则调用 render
            if (!this.rendered) {
                this.render();
            }
            this.set("visible", true);
            return this;
        },
        hide: function() {
            this.set("visible", false);
            return this;
        },
        setup: function() {
            var that = this;
            // 加载 iframe 遮罩层并与 overlay 保持同步
            this._setupShim();
            // 窗口resize时，重新定位浮层
            this._setupResize();
            this.after("render", function() {
                var _pos = this.element.css("position");
                if (_pos === "static" || _pos === "relative") {
                    this.element.css({
                        position: "absolute",
                        left: "-9999px",
                        top: "-9999px"
                    });
                }
            });
            // 统一在显示之后重新设定位置
            this.after("show", function() {
                that._setPosition();
            });
        },
        destroy: function() {
            // 销毁两个静态数组中的实例
            erase(this, Overlay.allOverlays);
            erase(this, Overlay.blurOverlays);
            return Overlay.superclass.destroy.call(this);
        },
        // 进行定位
        _setPosition: function(align) {
            // 不在文档流中，定位无效
            if (!isInDocument(this.element[0])) return;
            align || (align = this.get("align"));
            // 如果align为空，表示不需要使用js对齐
            if (!align) return;
            var isHidden = this.element.css("display") === "none";
            // 在定位时，为避免元素高度不定，先显示出来
            if (isHidden) {
                this.element.css({
                    visibility: "hidden",
                    display: "block"
                });
            }
            Position.pin({
                element: this.element,
                x: align.selfXY[0],
                y: align.selfXY[1]
            }, {
                element: align.baseElement,
                x: align.baseXY[0],
                y: align.baseXY[1]
            });
            // 定位完成后，还原
            if (isHidden) {
                this.element.css({
                    visibility: "",
                    display: "none"
                });
            }
            return this;
        },
        // 加载 iframe 遮罩层并与 overlay 保持同步
        _setupShim: function() {
            var shim = new Shim(this.element);
            // 在隐藏和设置位置后，要重新定位
            // 显示后会设置位置，所以不用绑定 shim.sync
            this.after("hide _setPosition", shim.sync, shim);
            // 除了 parentNode 之外的其他属性发生变化时，都触发 shim 同步
            var attrs = [ "width", "height" ];
            for (var attr in attrs) {
                if (attrs.hasOwnProperty(attr)) {
                    this.on("change:" + attr, shim.sync, shim);
                }
            }
            // 在销魂自身前要销毁 shim
            this.before("destroy", shim.destroy, shim);
        },
        // resize窗口时重新定位浮层，用这个方法收集所有浮层实例
        _setupResize: function() {
            Overlay.allOverlays.push(this);
        },
        // 除了 element 和 relativeElements，点击 body 后都会隐藏 element
        _blurHide: function(arr) {
            arr = $.makeArray(arr);
            arr.push(this.element);
            this._relativeElements = arr;
            Overlay.blurOverlays.push(this);
        },
        // 用于 set 属性后的界面更新
        _onRenderWidth: function(val) {
            this.element.css("width", val);
        },
        _onRenderHeight: function(val) {
            this.element.css("height", val);
        },
        _onRenderZIndex: function(val) {
            this.element.css("zIndex", val);
        },
        _onRenderAlign: function(val) {
            this._setPosition(val);
        },
        _onRenderVisible: function(val) {
            this.element[val ? "show" : "hide"]();
        }
    });
    // 绑定 blur 隐藏事件
    Overlay.blurOverlays = [];
    $(document).on("click", function(e) {
        hideBlurOverlays(e);
    });
    // 绑定 resize 重新定位事件
    var timeout;
    var winWidth = $(window).width();
    var winHeight = $(window).height();
    Overlay.allOverlays = [];
    $(window).resize(function() {
        timeout && clearTimeout(timeout);
        timeout = setTimeout(function() {
            var winNewWidth = $(window).width();
            var winNewHeight = $(window).height();
            // IE678 莫名其妙触发 resize
            // http://stackoverflow.com/questions/1852751/window-resize-event-firing-in-internet-explorer
            if (winWidth !== winNewWidth || winHeight !== winNewHeight) {
                $(Overlay.allOverlays).each(function(i, item) {
                    // 当实例为空或隐藏时，不处理
                    if (!item || !item.get("visible")) {
                        return;
                    }
                    item._setPosition();
                });
            }
            winWidth = winNewWidth;
            winHeight = winNewHeight;
        }, 80);
    });
    module.exports = Overlay;
    // Helpers
    // -------
    function isInDocument(element) {
        return $.contains(document.documentElement, element);
    }
    function hideBlurOverlays(e) {
        $(Overlay.blurOverlays).each(function(index, item) {
            // 当实例为空或隐藏时，不处理
            if (!item || !item.get("visible")) {
                return;
            }
            // 遍历 _relativeElements ，当点击的元素落在这些元素上时，不处理
            for (var i = 0; i < item._relativeElements.length; i++) {
                var el = $(item._relativeElements[i])[0];
                if (el === e.target || $.contains(el, e.target)) {
                    return;
                }
            }
            // 到这里，判断触发了元素的 blur 事件，隐藏元素
            item.hide();
        });
    }
    // 从数组中删除对应元素
    function erase(target, array) {
        for (var i = 0; i < array.length; i++) {
            if (target === array[i]) {
                array.splice(i, 1);
                return array;
            }
        }
    }
});

define("arale/position/1.0.1/position-debug", [ "$-debug" ], function(require, exports) {
    // Position
    // --------
    // 定位工具组件，将一个 DOM 节点相对对另一个 DOM 节点进行定位操作。
    // 代码易改，人生难得
    var Position = exports, VIEWPORT = {
        _id: "VIEWPORT",
        nodeType: 1
    }, $ = require("$-debug"), isPinFixed = false, ua = (window.navigator.userAgent || "").toLowerCase(), isIE6 = ua.indexOf("msie 6") !== -1;
    // 将目标元素相对于基准元素进行定位
    // 这是 Position 的基础方法，接收两个参数，分别描述了目标元素和基准元素的定位点
    Position.pin = function(pinObject, baseObject) {
        // 将两个参数转换成标准定位对象 { element: a, x: 0, y: 0 }
        pinObject = normalize(pinObject);
        baseObject = normalize(baseObject);
        // 设定目标元素的 position 为绝对定位
        // 若元素的初始 position 不为 absolute，会影响元素的 display、宽高等属性
        var pinElement = $(pinObject.element);
        if (pinElement.css("position") !== "fixed" || isIE6) {
            pinElement.css("position", "absolute");
            isPinFixed = false;
        } else {
            // 定位 fixed 元素的标志位，下面有特殊处理
            isPinFixed = true;
        }
        // 将位置属性归一化为数值
        // 注：必须放在上面这句 `css('position', 'absolute')` 之后，
        //    否则获取的宽高有可能不对
        posConverter(pinObject);
        posConverter(baseObject);
        var parentOffset = getParentOffset(pinElement);
        var baseOffset = baseObject.offset();
        // 计算目标元素的位置
        var top = baseOffset.top + baseObject.y - pinObject.y - parentOffset.top;
        var left = baseOffset.left + baseObject.x - pinObject.x - parentOffset.left;
        // 定位目标元素
        pinElement.css({
            left: left,
            top: top
        });
    };
    // 将目标元素相对于基准元素进行居中定位
    // 接受两个参数，分别为目标元素和定位的基准元素，都是 DOM 节点类型
    Position.center = function(pinElement, baseElement) {
        Position.pin({
            element: pinElement,
            x: "50%",
            y: "50%"
        }, {
            element: baseElement,
            x: "50%",
            y: "50%"
        });
    };
    // 这是当前可视区域的伪 DOM 节点
    // 需要相对于当前可视区域定位时，可传入此对象作为 element 参数
    Position.VIEWPORT = VIEWPORT;
    // Helpers
    // -------
    // 将参数包装成标准的定位对象，形似 { element: a, x: 0, y: 0 }
    function normalize(posObject) {
        posObject = toElement(posObject) || {};
        if (posObject.nodeType) {
            posObject = {
                element: posObject
            };
        }
        var element = toElement(posObject.element) || VIEWPORT;
        if (element.nodeType !== 1) {
            throw new Error("posObject.element is invalid.");
        }
        var result = {
            element: element,
            x: posObject.x || 0,
            y: posObject.y || 0
        };
        // config 的深度克隆会替换掉 Position.VIEWPORT, 导致直接比较为 false
        var isVIEWPORT = element === VIEWPORT || element._id === "VIEWPORT";
        // 归一化 offset
        result.offset = function() {
            // 若定位 fixed 元素，则父元素的 offset 没有意义
            if (isPinFixed) {
                return {
                    left: 0,
                    top: 0
                };
            } else if (isVIEWPORT) {
                return {
                    left: $(document).scrollLeft(),
                    top: $(document).scrollTop()
                };
            } else {
                return getOffset($(element)[0]);
            }
        };
        // 归一化 size, 含 padding 和 border
        result.size = function() {
            var el = isVIEWPORT ? $(window) : $(element);
            return {
                width: el.outerWidth(),
                height: el.outerHeight()
            };
        };
        return result;
    }
    // 对 x, y 两个参数为 left|center|right|%|px 时的处理，全部处理为纯数字
    function posConverter(pinObject) {
        pinObject.x = xyConverter(pinObject.x, pinObject, "width");
        pinObject.y = xyConverter(pinObject.y, pinObject, "height");
    }
    // 处理 x, y 值，都转化为数字
    function xyConverter(x, pinObject, type) {
        // 先转成字符串再说！好处理
        x = x + "";
        // 处理 px
        x = x.replace(/px/gi, "");
        // 处理 alias
        if (/\D/.test(x)) {
            x = x.replace(/(?:top|left)/gi, "0%").replace(/center/gi, "50%").replace(/(?:bottom|right)/gi, "100%");
        }
        // 将百分比转为像素值
        if (x.indexOf("%") !== -1) {
            //支持小数
            x = x.replace(/(\d+(?:\.\d+)?)%/gi, function(m, d) {
                return pinObject.size()[type] * (d / 100);
            });
        }
        // 处理类似 100%+20px 的情况
        if (/[+\-*\/]/.test(x)) {
            try {
                // eval 会影响压缩
                // new Function 方法效率高于 for 循环拆字符串的方法
                // 参照：http://jsperf.com/eval-newfunction-for
                x = new Function("return " + x)();
            } catch (e) {
                throw new Error("Invalid position value: " + x);
            }
        }
        // 转回为数字
        return numberize(x);
    }
    // 获取 offsetParent 的位置
    function getParentOffset(element) {
        var parent = element.offsetParent();
        // IE7 下，body 子节点的 offsetParent 为 html 元素，其 offset 为
        // { top: 2, left: 2 }，会导致定位差 2 像素，所以这里将 parent
        // 转为 document.body
        if (parent[0] === document.documentElement) {
            parent = $(document.body);
        }
        // 修正 ie6 下 absolute 定位不准的 bug
        if (isIE6) {
            parent.css("zoom", 1);
        }
        // 获取 offsetParent 的 offset
        var offset;
        // 当 offsetParent 为 body，
        // 而且 body 的 position 是 static 时
        // 元素并不按照 body 来定位，而是按 document 定位
        // http://jsfiddle.net/afc163/hN9Tc/2/
        // 因此这里的偏移值直接设为 0 0
        if (parent[0] === document.body && parent.css("position") === "static") {
            offset = {
                top: 0,
                left: 0
            };
        } else {
            offset = getOffset(parent[0]);
        }
        // 根据基准元素 offsetParent 的 border 宽度，来修正 offsetParent 的基准位置
        offset.top += numberize(parent.css("border-top-width"));
        offset.left += numberize(parent.css("border-left-width"));
        return offset;
    }
    function numberize(s) {
        return parseFloat(s, 10) || 0;
    }
    function toElement(element) {
        return $(element)[0];
    }
    // fix jQuery 1.7.2 offset
    // document.body 的 position 是 absolute 或 relative 时
    // jQuery.offset 方法无法正确获取 body 的偏移值
    //   -> http://jsfiddle.net/afc163/gMAcp/
    // jQuery 1.9.1 已经修正了这个问题
    //   -> http://jsfiddle.net/afc163/gMAcp/1/
    // 这里先实现一份
    // 参照 kissy 和 jquery 1.9.1
    //   -> https://github.com/kissyteam/kissy/blob/master/src/dom/sub-modules/base/src/base/offset.js#L366 
    //   -> https://github.com/jquery/jquery/blob/1.9.1/src/offset.js#L28
    function getOffset(element) {
        var box = element.getBoundingClientRect(), docElem = document.documentElement;
        // < ie8 不支持 win.pageXOffset, 则使用 docElem.scrollLeft
        return {
            left: box.left + (window.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft || document.body.clientLeft || 0),
            top: box.top + (window.pageYOffset || docElem.scrollTop) - (docElem.clientTop || document.body.clientTop || 0)
        };
    }
});

define("arale/iframe-shim/1.0.2/iframe-shim-debug", [ "$-debug", "arale/position/1.0.1/position-debug" ], function(require, exports, module) {
    var $ = require("$-debug");
    var Position = require("arale/position/1.0.1/position-debug");
    var isIE6 = (window.navigator.userAgent || "").toLowerCase().indexOf("msie 6") !== -1;
    // target 是需要添加垫片的目标元素，可以传 `DOM Element` 或 `Selector`
    function Shim(target) {
        // 如果选择器选了多个 DOM，则只取第一个
        this.target = $(target).eq(0);
    }
    // 根据目标元素计算 iframe 的显隐、宽高、定位
    Shim.prototype.sync = function() {
        var target = this.target;
        var iframe = this.iframe;
        // 如果未传 target 则不处理
        if (!target.length) return this;
        var height = target.outerHeight();
        var width = target.outerWidth();
        // 如果目标元素隐藏，则 iframe 也隐藏
        // jquery 判断宽高同时为 0 才算隐藏，这里判断宽高其中一个为 0 就隐藏
        // http://api.jquery.com/hidden-selector/
        if (!height || !width || target.is(":hidden")) {
            iframe && iframe.hide();
        } else {
            // 第一次显示时才创建：as lazy as possible
            iframe || (iframe = this.iframe = createIframe(target));
            iframe.css({
                height: height,
                width: width
            });
            Position.pin(iframe[0], target[0]);
            iframe.show();
        }
        return this;
    };
    // 销毁 iframe 等
    Shim.prototype.destroy = function() {
        if (this.iframe) {
            this.iframe.remove();
            delete this.iframe;
        }
        delete this.target;
    };
    if (isIE6) {
        module.exports = Shim;
    } else {
        // 除了 IE6 都返回空函数
        function Noop() {}
        Noop.prototype.sync = function() {
            return this;
        };
        Noop.prototype.destroy = Noop;
        module.exports = Noop;
    }
    // Helpers
    // 在 target 之前创建 iframe，这样就没有 z-index 问题
    // iframe 永远在 target 下方
    function createIframe(target) {
        var css = {
            display: "none",
            border: "none",
            opacity: 0,
            position: "absolute"
        };
        // 如果 target 存在 zIndex 则设置
        var zIndex = target.css("zIndex");
        if (zIndex && zIndex > 0) {
            css.zIndex = zIndex - 1;
        }
        return $("<iframe>", {
            src: "javascript:''",
            // 不加的话，https 下会弹警告
            frameborder: 0,
            css: css
        }).insertBefore(target);
    }
});

define("arale/widget/1.1.1/widget-debug", [ "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "$-debug", "./daparser-debug", "./auto-render-debug" ], function(require, exports, module) {
    // Widget
    // ---------
    // Widget 是与 DOM 元素相关联的非工具类组件，主要负责 View 层的管理。
    // Widget 组件具有四个要素：描述状态的 attributes 和 properties，描述行为的 events
    // 和 methods。Widget 基类约定了这四要素创建时的基本流程和最佳实践。
    var Base = require("arale/base/1.1.1/base-debug");
    var $ = require("$-debug");
    var DAParser = require("./daparser-debug");
    var AutoRender = require("./auto-render-debug");
    var DELEGATE_EVENT_NS = ".delegate-events-";
    var ON_RENDER = "_onRender";
    var DATA_WIDGET_CID = "data-widget-cid";
    // 所有初始化过的 Widget 实例
    var cachedInstances = {};
    var Widget = Base.extend({
        // config 中的这些键值会直接添加到实例上，转换成 properties
        propsInAttrs: [ "initElement", "element", "events" ],
        // 与 widget 关联的 DOM 元素
        element: null,
        // 事件代理，格式为：
        //   {
        //     'mousedown .title': 'edit',
        //     'click {{attrs.saveButton}}': 'save'
        //     'click .open': function(ev) { ... }
        //   }
        events: null,
        // 属性列表
        attrs: {
            // 基本属性
            id: null,
            className: null,
            style: null,
            // 默认模板
            template: "<div></div>",
            // 默认数据模型
            model: null,
            // 组件的默认父节点
            parentNode: document.body
        },
        // 初始化方法，确定组件创建时的基本流程：
        // 初始化 attrs --》 初始化 props --》 初始化 events --》 子类的初始化
        initialize: function(config) {
            this.cid = uniqueCid();
            // 初始化 attrs
            var dataAttrsConfig = this._parseDataAttrsConfig(config);
            Widget.superclass.initialize.call(this, config ? $.extend(dataAttrsConfig, config) : dataAttrsConfig);
            // 初始化 props
            this.parseElement();
            this.initProps();
            // 初始化 events
            this.delegateEvents();
            // 子类自定义的初始化
            this.setup();
            // 保存实例信息
            this._stamp();
            // 是否由 template 初始化
            this._isTemplate = !(config && config.element);
        },
        // 解析通过 data-attr 设置的 api
        _parseDataAttrsConfig: function(config) {
            var element, dataAttrsConfig;
            if (config) {
                element = config.initElement ? $(config.initElement) : $(config.element);
            }
            // 解析 data-api 时，只考虑用户传入的 element，不考虑来自继承或从模板构建的
            if (element && element[0] && !AutoRender.isDataApiOff(element)) {
                dataAttrsConfig = DAParser.parseElement(element);
            }
            return dataAttrsConfig;
        },
        // 构建 this.element
        parseElement: function() {
            var element = this.element;
            if (element) {
                this.element = $(element);
            } else if (this.get("template")) {
                this.parseElementFromTemplate();
            }
            // 如果对应的 DOM 元素不存在，则报错
            if (!this.element || !this.element[0]) {
                throw new Error("element is invalid");
            }
        },
        // 从模板中构建 this.element
        parseElementFromTemplate: function() {
            this.element = $(this.get("template"));
        },
        // 负责 properties 的初始化，提供给子类覆盖
        initProps: function() {},
        // 注册事件代理
        delegateEvents: function(element, events, handler) {
            // widget.delegateEvents()
            if (arguments.length === 0) {
                events = getEvents(this);
                element = this.element;
            } else if (arguments.length === 1) {
                events = element;
                element = this.element;
            } else if (arguments.length === 2) {
                handler = events;
                events = element;
                element = this.element;
            } else {
                element || (element = this.element);
                this._delegateElements || (this._delegateElements = []);
                this._delegateElements.push($(element));
            }
            // 'click p' => {'click p': handler}
            if (isString(events) && isFunction(handler)) {
                var o = {};
                o[events] = handler;
                events = o;
            }
            // key 为 'event selector'
            for (var key in events) {
                if (!events.hasOwnProperty(key)) continue;
                var args = parseEventKey(key, this);
                var eventType = args.type;
                var selector = args.selector;
                (function(handler, widget) {
                    var callback = function(ev) {
                        if (isFunction(handler)) {
                            handler.call(widget, ev);
                        } else {
                            widget[handler](ev);
                        }
                    };
                    // delegate
                    if (selector) {
                        $(element).on(eventType, selector, callback);
                    } else {
                        $(element).on(eventType, callback);
                    }
                })(events[key], this);
            }
            return this;
        },
        // 卸载事件代理
        undelegateEvents: function(element, eventKey) {
            if (!eventKey) {
                eventKey = element;
                element = null;
            }
            // 卸载所有
            // .undelegateEvents()
            if (arguments.length === 0) {
                var type = DELEGATE_EVENT_NS + this.cid;
                this.element && this.element.off(type);
                // 卸载所有外部传入的 element
                if (this._delegateElements) {
                    for (var de in this._delegateElements) {
                        if (!this._delegateElements.hasOwnProperty(de)) continue;
                        this._delegateElements[de].off(type);
                    }
                }
            } else {
                var args = parseEventKey(eventKey, this);
                // 卸载 this.element
                // .undelegateEvents(events)
                if (!element) {
                    this.element && this.element.off(args.type, args.selector);
                } else {
                    $(element).off(args.type, args.selector);
                }
            }
            return this;
        },
        // 提供给子类覆盖的初始化方法
        setup: function() {},
        // 将 widget 渲染到页面上
        // 渲染不仅仅包括插入到 DOM 树中，还包括样式渲染等
        // 约定：子类覆盖时，需保持 `return this`
        render: function() {
            // 让渲染相关属性的初始值生效，并绑定到 change 事件
            if (!this.rendered) {
                this._renderAndBindAttrs();
                this.rendered = true;
            }
            // 插入到文档流中
            var parentNode = this.get("parentNode");
            if (parentNode && !isInDocument(this.element[0])) {
                // 隔离样式，添加统一的命名空间
                // https://github.com/aliceui/aliceui.org/issues/9
                var outerBoxClass = this.constructor.outerBoxClass;
                if (outerBoxClass) {
                    var outerBox = this._outerBox = $("<div></div>").addClass(outerBoxClass);
                    outerBox.append(this.element).appendTo(parentNode);
                } else {
                    this.element.appendTo(parentNode);
                }
            }
            return this;
        },
        // 让属性的初始值生效，并绑定到 change:attr 事件上
        _renderAndBindAttrs: function() {
            var widget = this;
            var attrs = widget.attrs;
            for (var attr in attrs) {
                if (!attrs.hasOwnProperty(attr)) continue;
                var m = ON_RENDER + ucfirst(attr);
                if (this[m]) {
                    var val = this.get(attr);
                    // 让属性的初始值生效。注：默认空值不触发
                    if (!isEmptyAttrValue(val)) {
                        this[m](val, undefined, attr);
                    }
                    // 将 _onRenderXx 自动绑定到 change:xx 事件上
                    (function(m) {
                        widget.on("change:" + attr, function(val, prev, key) {
                            widget[m](val, prev, key);
                        });
                    })(m);
                }
            }
        },
        _onRenderId: function(val) {
            this.element.attr("id", val);
        },
        _onRenderClassName: function(val) {
            this.element.addClass(val);
        },
        _onRenderStyle: function(val) {
            this.element.css(val);
        },
        // 让 element 与 Widget 实例建立关联
        _stamp: function() {
            var cid = this.cid;
            (this.initElement || this.element).attr(DATA_WIDGET_CID, cid);
            cachedInstances[cid] = this;
        },
        // 在 this.element 内寻找匹配节点
        $: function(selector) {
            return this.element.find(selector);
        },
        destroy: function() {
            this.undelegateEvents();
            delete cachedInstances[this.cid];
            // For memory leak
            if (this.element && this._isTemplate) {
                this.element.off();
                // 如果是 widget 生成的 element 则去除
                if (this._outerBox) {
                    this._outerBox.remove();
                } else {
                    this.element.remove();
                }
            }
            this.element = null;
            Widget.superclass.destroy.call(this);
        }
    });
    // For memory leak
    $(window).unload(function() {
        for (var cid in cachedInstances) {
            cachedInstances[cid].destroy();
        }
    });
    // 查询与 selector 匹配的第一个 DOM 节点，得到与该 DOM 节点相关联的 Widget 实例
    Widget.query = function(selector) {
        var element = $(selector).eq(0);
        var cid;
        element && (cid = element.attr(DATA_WIDGET_CID));
        return cachedInstances[cid];
    };
    Widget.autoRender = AutoRender.autoRender;
    Widget.autoRenderAll = AutoRender.autoRenderAll;
    Widget.StaticsWhiteList = [ "autoRender" ];
    module.exports = Widget;
    // Helpers
    // ------
    var toString = Object.prototype.toString;
    var cidCounter = 0;
    function uniqueCid() {
        return "widget-" + cidCounter++;
    }
    function isString(val) {
        return toString.call(val) === "[object String]";
    }
    function isFunction(val) {
        return toString.call(val) === "[object Function]";
    }
    // Zepto 上没有 contains 方法
    var contains = $.contains || function(a, b) {
        //noinspection JSBitwiseOperatorUsage
        return !!(a.compareDocumentPosition(b) & 16);
    };
    function isInDocument(element) {
        return contains(document.documentElement, element);
    }
    function ucfirst(str) {
        return str.charAt(0).toUpperCase() + str.substring(1);
    }
    var EVENT_KEY_SPLITTER = /^(\S+)\s*(.*)$/;
    var EXPRESSION_FLAG = /{{([^}]+)}}/g;
    var INVALID_SELECTOR = "INVALID_SELECTOR";
    function getEvents(widget) {
        if (isFunction(widget.events)) {
            widget.events = widget.events();
        }
        return widget.events;
    }
    function parseEventKey(eventKey, widget) {
        var match = eventKey.match(EVENT_KEY_SPLITTER);
        var eventType = match[1] + DELEGATE_EVENT_NS + widget.cid;
        // 当没有 selector 时，需要设置为 undefined，以使得 zepto 能正确转换为 bind
        var selector = match[2] || undefined;
        if (selector && selector.indexOf("{{") > -1) {
            selector = parseExpressionInEventKey(selector, widget);
        }
        return {
            type: eventType,
            selector: selector
        };
    }
    // 解析 eventKey 中的 {{xx}}, {{yy}}
    function parseExpressionInEventKey(selector, widget) {
        return selector.replace(EXPRESSION_FLAG, function(m, name) {
            var parts = name.split(".");
            var point = widget, part;
            while (part = parts.shift()) {
                if (point === widget.attrs) {
                    point = widget.get(part);
                } else {
                    point = point[part];
                }
            }
            // 已经是 className，比如来自 dataset 的
            if (isString(point)) {
                return point;
            }
            // 不能识别的，返回无效标识
            return INVALID_SELECTOR;
        });
    }
    // 对于 attrs 的 value 来说，以下值都认为是空值： null, undefined
    function isEmptyAttrValue(o) {
        return o == null || o === undefined;
    }
});

define("arale/widget/1.1.1/daparser-debug", [ "$-debug" ], function(require, exports) {
    // DAParser
    // --------
    // data api 解析器，提供对单个 element 的解析，可用来初始化页面中的所有 Widget 组件。
    var $ = require("$-debug");
    // 得到某个 DOM 元素的 dataset
    exports.parseElement = function(element, raw) {
        element = $(element)[0];
        var dataset = {};
        // ref: https://developer.mozilla.org/en/DOM/element.dataset
        if (element.dataset) {
            // 转换成普通对象
            dataset = $.extend({}, element.dataset);
        } else {
            var attrs = element.attributes;
            for (var i = 0, len = attrs.length; i < len; i++) {
                var attr = attrs[i];
                var name = attr.name;
                if (name.indexOf("data-") === 0) {
                    name = camelCase(name.substring(5));
                    dataset[name] = attr.value;
                }
            }
        }
        return raw === true ? dataset : normalizeValues(dataset);
    };
    // Helpers
    // ------
    var RE_DASH_WORD = /-([a-z])/g;
    var JSON_LITERAL_PATTERN = /^\s*[\[{].*[\]}]\s*$/;
    var parseJSON = this.JSON ? JSON.parse : $.parseJSON;
    // 仅处理字母开头的，其他情况转换为小写："data-x-y-123-_A" --> xY-123-_a
    function camelCase(str) {
        return str.toLowerCase().replace(RE_DASH_WORD, function(all, letter) {
            return (letter + "").toUpperCase();
        });
    }
    // 解析并归一化配置中的值
    function normalizeValues(data) {
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var val = data[key];
                if (typeof val !== "string") continue;
                if (JSON_LITERAL_PATTERN.test(val)) {
                    val = val.replace(/'/g, '"');
                    data[key] = normalizeValues(parseJSON(val));
                } else {
                    data[key] = normalizeValue(val);
                }
            }
        }
        return data;
    }
    // 将 'false' 转换为 false
    // 'true' 转换为 true
    // '3253.34' 转换为 3253.34
    function normalizeValue(val) {
        if (val.toLowerCase() === "false") {
            val = false;
        } else if (val.toLowerCase() === "true") {
            val = true;
        } else if (/\d/.test(val) && /[^a-z]/i.test(val)) {
            var number = parseFloat(val);
            if (number + "" === val) {
                val = number;
            }
        }
        return val;
    }
});

define("arale/widget/1.1.1/auto-render-debug", [ "$-debug" ], function(require, exports) {
    var $ = require("$-debug");
    var DATA_WIDGET_AUTO_RENDERED = "data-widget-auto-rendered";
    // 自动渲染接口，子类可根据自己的初始化逻辑进行覆盖
    exports.autoRender = function(config) {
        return new this(config).render();
    };
    // 根据 data-widget 属性，自动渲染所有开启了 data-api 的 widget 组件
    exports.autoRenderAll = function(root, callback) {
        if (typeof root === "function") {
            callback = root;
            root = null;
        }
        root = $(root || document.body);
        var modules = [];
        var elements = [];
        root.find("[data-widget]").each(function(i, element) {
            if (!exports.isDataApiOff(element)) {
                modules.push(element.getAttribute("data-widget").toLowerCase());
                elements.push(element);
            }
        });
        if (modules.length) {
            seajs.use(modules, function() {
                for (var i = 0; i < arguments.length; i++) {
                    var SubWidget = arguments[i];
                    var element = $(elements[i]);
                    // 已经渲染过
                    if (element.attr(DATA_WIDGET_AUTO_RENDERED)) continue;
                    var config = {
                        initElement: element,
                        renderType: "auto"
                    };
                    // data-widget-role 是指将当前的 DOM 作为 role 的属性去实例化，默认的 role 为 element
                    var role = element.attr("data-widget-role");
                    config[role ? role : "element"] = element;
                    // 调用自动渲染接口
                    SubWidget.autoRender && SubWidget.autoRender(config);
                    // 标记已经渲染过
                    element.attr(DATA_WIDGET_AUTO_RENDERED, "true");
                }
                // 在所有自动渲染完成后，执行回调
                callback && callback();
            });
        }
    };
    var isDefaultOff = $(document.body).attr("data-api") === "off";
    // 是否没开启 data-api
    exports.isDataApiOff = function(element) {
        var elementDataApi = $(element).attr("data-api");
        // data-api 默认开启，关闭只有两种方式：
        //  1. element 上有 data-api="off"，表示关闭单个
        //  2. document.body 上有 data-api="off"，表示关闭所有
        return elementDataApi === "off" || elementDataApi !== "on" && isDefaultOff;
    };
});

define("arale/base/1.1.1/base-debug", [ "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "./aspect-debug", "./attribute-debug" ], function(require, exports, module) {
    // Base
    // ---------
    // Base 是一个基础类，提供 Class、Events、Attrs 和 Aspect 支持。
    var Class = require("arale/class/1.1.0/class-debug");
    var Events = require("arale/events/1.1.0/events-debug");
    var Aspect = require("./aspect-debug");
    var Attribute = require("./attribute-debug");
    module.exports = Class.create({
        Implements: [ Events, Aspect, Attribute ],
        initialize: function(config) {
            this.initAttrs(config);
            // Automatically register `this._onChangeAttr` method as
            // a `change:attr` event handler.
            parseEventsFromInstance(this, this.attrs);
        },
        destroy: function() {
            this.off();
            for (var p in this) {
                if (this.hasOwnProperty(p)) {
                    delete this[p];
                }
            }
            // Destroy should be called only once, generate a fake destroy after called
            // https://github.com/aralejs/widget/issues/50
            this.destroy = function() {};
        }
    });
    function parseEventsFromInstance(host, attrs) {
        for (var attr in attrs) {
            if (attrs.hasOwnProperty(attr)) {
                var m = "_onChange" + ucfirst(attr);
                if (host[m]) {
                    host.on("change:" + attr, host[m]);
                }
            }
        }
    }
    function ucfirst(str) {
        return str.charAt(0).toUpperCase() + str.substring(1);
    }
});

define("arale/base/1.1.1/aspect-debug", [], function(require, exports) {
    // Aspect
    // ---------------------
    // Thanks to:
    //  - http://yuilibrary.com/yui/docs/api/classes/Do.html
    //  - http://code.google.com/p/jquery-aop/
    //  - http://lazutkin.com/blog/2008/may/18/aop-aspect-javascript-dojo/
    // 在指定方法执行前，先执行 callback
    exports.before = function(methodName, callback, context) {
        return weave.call(this, "before", methodName, callback, context);
    };
    // 在指定方法执行后，再执行 callback
    exports.after = function(methodName, callback, context) {
        return weave.call(this, "after", methodName, callback, context);
    };
    // Helpers
    // -------
    var eventSplitter = /\s+/;
    function weave(when, methodName, callback, context) {
        var names = methodName.split(eventSplitter);
        var name, method;
        while (name = names.shift()) {
            method = getMethod(this, name);
            if (!method.__isAspected) {
                wrap.call(this, name);
            }
            this.on(when + ":" + name, callback, context);
        }
        return this;
    }
    function getMethod(host, methodName) {
        var method = host[methodName];
        if (!method) {
            throw new Error("Invalid method name: " + methodName);
        }
        return method;
    }
    function wrap(methodName) {
        var old = this[methodName];
        this[methodName] = function() {
            var args = Array.prototype.slice.call(arguments);
            var beforeArgs = [ "before:" + methodName ].concat(args);
            // prevent if trigger return false
            if (this.trigger.apply(this, beforeArgs) === false) return;
            var ret = old.apply(this, arguments);
            var afterArgs = [ "after:" + methodName, ret ].concat(args);
            this.trigger.apply(this, afterArgs);
            return ret;
        };
        this[methodName].__isAspected = true;
    }
});

define("arale/base/1.1.1/attribute-debug", [], function(require, exports) {
    // Attribute
    // -----------------
    // Thanks to:
    //  - http://documentcloud.github.com/backbone/#Model
    //  - http://yuilibrary.com/yui/docs/api/classes/AttributeCore.html
    //  - https://github.com/berzniz/backbone.getters.setters
    // 负责 attributes 的初始化
    // attributes 是与实例相关的状态信息，可读可写，发生变化时，会自动触发相关事件
    exports.initAttrs = function(config) {
        // initAttrs 是在初始化时调用的，默认情况下实例上肯定没有 attrs，不存在覆盖问题
        var attrs = this.attrs = {};
        // Get all inherited attributes.
        var specialProps = this.propsInAttrs || [];
        mergeInheritedAttrs(attrs, this, specialProps);
        // Merge user-specific attributes from config.
        if (config) {
            mergeUserValue(attrs, config);
        }
        // 对于有 setter 的属性，要用初始值 set 一下，以保证关联属性也一同初始化
        setSetterAttrs(this, attrs, config);
        // Convert `on/before/afterXxx` config to event handler.
        parseEventsFromAttrs(this, attrs);
        // 将 this.attrs 上的 special properties 放回 this 上
        copySpecialProps(specialProps, this, attrs, true);
    };
    // Get the value of an attribute.
    exports.get = function(key) {
        var attr = this.attrs[key] || {};
        var val = attr.value;
        return attr.getter ? attr.getter.call(this, val, key) : val;
    };
    // Set a hash of model attributes on the object, firing `"change"` unless
    // you choose to silence it.
    exports.set = function(key, val, options) {
        var attrs = {};
        // set("key", val, options)
        if (isString(key)) {
            attrs[key] = val;
        } else {
            attrs = key;
            options = val;
        }
        options || (options = {});
        var silent = options.silent;
        var override = options.override;
        var now = this.attrs;
        var changed = this.__changedAttrs || (this.__changedAttrs = {});
        for (key in attrs) {
            if (!attrs.hasOwnProperty(key)) continue;
            var attr = now[key] || (now[key] = {});
            val = attrs[key];
            if (attr.readOnly) {
                throw new Error("This attribute is readOnly: " + key);
            }
            // invoke setter
            if (attr.setter) {
                val = attr.setter.call(this, val, key);
            }
            // 获取设置前的 prev 值
            var prev = this.get(key);
            // 获取需要设置的 val 值
            // 如果设置了 override 为 true，表示要强制覆盖，就不去 merge 了
            // 都为对象时，做 merge 操作，以保留 prev 上没有覆盖的值
            if (!override && isPlainObject(prev) && isPlainObject(val)) {
                val = merge(merge({}, prev), val);
            }
            // set finally
            now[key].value = val;
            // invoke change event
            // 初始化时对 set 的调用，不触发任何事件
            if (!this.__initializingAttrs && !isEqual(prev, val)) {
                if (silent) {
                    changed[key] = [ val, prev ];
                } else {
                    this.trigger("change:" + key, val, prev, key);
                }
            }
        }
        return this;
    };
    // Call this method to manually fire a `"change"` event for triggering
    // a `"change:attribute"` event for each changed attribute.
    exports.change = function() {
        var changed = this.__changedAttrs;
        if (changed) {
            for (var key in changed) {
                if (changed.hasOwnProperty(key)) {
                    var args = changed[key];
                    this.trigger("change:" + key, args[0], args[1], key);
                }
            }
            delete this.__changedAttrs;
        }
        return this;
    };
    // for test
    exports._isPlainObject = isPlainObject;
    // Helpers
    // -------
    var toString = Object.prototype.toString;
    var hasOwn = Object.prototype.hasOwnProperty;
    /**
   * Detect the JScript [[DontEnum]] bug:
   * In IE < 9 an objects own properties, shadowing non-enumerable ones, are
   * made non-enumerable as well.
   * https://github.com/bestiejs/lodash/blob/7520066fc916e205ef84cb97fbfe630d7c154158/lodash.js#L134-L144
   */
    /** Detect if own properties are iterated after inherited properties (IE < 9) */
    var iteratesOwnLast;
    (function() {
        var props = [];
        function Ctor() {
            this.x = 1;
        }
        Ctor.prototype = {
            valueOf: 1,
            y: 1
        };
        for (var prop in new Ctor()) {
            props.push(prop);
        }
        iteratesOwnLast = props[0] !== "x";
    })();
    var isArray = Array.isArray || function(val) {
        return toString.call(val) === "[object Array]";
    };
    function isString(val) {
        return toString.call(val) === "[object String]";
    }
    function isFunction(val) {
        return toString.call(val) === "[object Function]";
    }
    function isWindow(o) {
        return o != null && o == o.window;
    }
    function isPlainObject(o) {
        // Must be an Object.
        // Because of IE, we also have to check the presence of the constructor
        // property. Make sure that DOM nodes and window objects don't
        // pass through, as well
        if (!o || toString.call(o) !== "[object Object]" || o.nodeType || isWindow(o)) {
            return false;
        }
        try {
            // Not own constructor property must be Object
            if (o.constructor && !hasOwn.call(o, "constructor") && !hasOwn.call(o.constructor.prototype, "isPrototypeOf")) {
                return false;
            }
        } catch (e) {
            // IE8,9 Will throw exceptions on certain host objects #9897
            return false;
        }
        var key;
        // Support: IE<9
        // Handle iteration over inherited properties before own properties.
        // http://bugs.jquery.com/ticket/12199
        if (iteratesOwnLast) {
            for (key in o) {
                return hasOwn.call(o, key);
            }
        }
        // Own properties are enumerated firstly, so to speed up,
        // if last one is own, then all properties are own.
        for (key in o) {}
        return key === undefined || hasOwn.call(o, key);
    }
    function isEmptyObject(o) {
        if (!o || toString.call(o) !== "[object Object]" || o.nodeType || isWindow(o) || !o.hasOwnProperty) {
            return false;
        }
        for (var p in o) {
            if (o.hasOwnProperty(p)) return false;
        }
        return true;
    }
    function merge(receiver, supplier) {
        var key, value;
        for (key in supplier) {
            if (supplier.hasOwnProperty(key)) {
                value = supplier[key];
                // 只 clone 数组和 plain object，其他的保持不变
                if (isArray(value)) {
                    value = value.slice();
                } else if (isPlainObject(value)) {
                    var prev = receiver[key];
                    isPlainObject(prev) || (prev = {});
                    value = merge(prev, value);
                }
                receiver[key] = value;
            }
        }
        return receiver;
    }
    var keys = Object.keys;
    if (!keys) {
        keys = function(o) {
            var result = [];
            for (var name in o) {
                if (o.hasOwnProperty(name)) {
                    result.push(name);
                }
            }
            return result;
        };
    }
    function mergeInheritedAttrs(attrs, instance, specialProps) {
        var inherited = [];
        var proto = instance.constructor.prototype;
        while (proto) {
            // 不要拿到 prototype 上的
            if (!proto.hasOwnProperty("attrs")) {
                proto.attrs = {};
            }
            // 将 proto 上的特殊 properties 放到 proto.attrs 上，以便合并
            copySpecialProps(specialProps, proto.attrs, proto);
            // 为空时不添加
            if (!isEmptyObject(proto.attrs)) {
                inherited.unshift(proto.attrs);
            }
            // 向上回溯一级
            proto = proto.constructor.superclass;
        }
        // Merge and clone default values to instance.
        for (var i = 0, len = inherited.length; i < len; i++) {
            merge(attrs, normalize(inherited[i]));
        }
    }
    function mergeUserValue(attrs, config) {
        merge(attrs, normalize(config, true));
    }
    function copySpecialProps(specialProps, receiver, supplier, isAttr2Prop) {
        for (var i = 0, len = specialProps.length; i < len; i++) {
            var key = specialProps[i];
            if (supplier.hasOwnProperty(key)) {
                receiver[key] = isAttr2Prop ? receiver.get(key) : supplier[key];
            }
        }
    }
    var EVENT_PATTERN = /^(on|before|after)([A-Z].*)$/;
    var EVENT_NAME_PATTERN = /^(Change)?([A-Z])(.*)/;
    function parseEventsFromAttrs(host, attrs) {
        for (var key in attrs) {
            if (attrs.hasOwnProperty(key)) {
                var value = attrs[key].value, m;
                if (isFunction(value) && (m = key.match(EVENT_PATTERN))) {
                    host[m[1]](getEventName(m[2]), value);
                    delete attrs[key];
                }
            }
        }
    }
    // Converts `Show` to `show` and `ChangeTitle` to `change:title`
    function getEventName(name) {
        var m = name.match(EVENT_NAME_PATTERN);
        var ret = m[1] ? "change:" : "";
        ret += m[2].toLowerCase() + m[3];
        return ret;
    }
    function setSetterAttrs(host, attrs, config) {
        var options = {
            silent: true
        };
        host.__initializingAttrs = true;
        for (var key in config) {
            if (config.hasOwnProperty(key)) {
                if (attrs[key].setter) {
                    host.set(key, config[key], options);
                }
            }
        }
        delete host.__initializingAttrs;
    }
    var ATTR_SPECIAL_KEYS = [ "value", "getter", "setter", "readOnly" ];
    // normalize `attrs` to
    //
    //   {
    //      value: 'xx',
    //      getter: fn,
    //      setter: fn,
    //      readOnly: boolean
    //   }
    //
    function normalize(attrs, isUserValue) {
        var newAttrs = {};
        for (var key in attrs) {
            var attr = attrs[key];
            if (!isUserValue && isPlainObject(attr) && hasOwnProperties(attr, ATTR_SPECIAL_KEYS)) {
                newAttrs[key] = attr;
                continue;
            }
            newAttrs[key] = {
                value: attr
            };
        }
        return newAttrs;
    }
    function hasOwnProperties(object, properties) {
        for (var i = 0, len = properties.length; i < len; i++) {
            if (object.hasOwnProperty(properties[i])) {
                return true;
            }
        }
        return false;
    }
    // 对于 attrs 的 value 来说，以下值都认为是空值： null, undefined, '', [], {}
    function isEmptyAttrValue(o) {
        return o == null || // null, undefined
        (isString(o) || isArray(o)) && o.length === 0 || // '', []
        isEmptyObject(o);
    }
    // 判断属性值 a 和 b 是否相等，注意仅适用于属性值的判断，非普适的 === 或 == 判断。
    function isEqual(a, b) {
        if (a === b) return true;
        if (isEmptyAttrValue(a) && isEmptyAttrValue(b)) return true;
        // Compare `[[Class]]` names.
        var className = toString.call(a);
        if (className != toString.call(b)) return false;
        switch (className) {
          // Strings, numbers, dates, and booleans are compared by value.
            case "[object String]":
            // Primitives and their corresponding object wrappers are
            // equivalent; thus, `"5"` is equivalent to `new String("5")`.
            return a == String(b);

          case "[object Number]":
            // `NaN`s are equivalent, but non-reflexive. An `equal`
            // comparison is performed for other numeric values.
            return a != +a ? b != +b : a == 0 ? 1 / a == 1 / b : a == +b;

          case "[object Date]":
          case "[object Boolean]":
            // Coerce dates and booleans to numeric primitive values.
            // Dates are compared by their millisecond representations.
            // Note that invalid dates with millisecond representations
            // of `NaN` are not equivalent.
            return +a == +b;

          // RegExps are compared by their source patterns and flags.
            case "[object RegExp]":
            return a.source == b.source && a.global == b.global && a.multiline == b.multiline && a.ignoreCase == b.ignoreCase;

          // 简单判断数组包含的 primitive 值是否相等
            case "[object Array]":
            var aString = a.toString();
            var bString = b.toString();
            // 只要包含非 primitive 值，为了稳妥起见，都返回 false
            return aString.indexOf("[object") === -1 && bString.indexOf("[object") === -1 && aString === bString;
        }
        if (typeof a != "object" || typeof b != "object") return false;
        // 简单判断两个对象是否相等，只判断第一层
        if (isPlainObject(a) && isPlainObject(b)) {
            // 键值不相等，立刻返回 false
            if (!isEqual(keys(a), keys(b))) {
                return false;
            }
            // 键相同，但有值不等，立刻返回 false
            for (var p in a) {
                if (a[p] !== b[p]) return false;
            }
            return true;
        }
        // 其他情况返回 false, 以避免误判导致 change 事件没发生
        return false;
    }
});

define("arale/class/1.1.0/class-debug", [], function(require, exports, module) {
    // Class
    // -----------------
    // Thanks to:
    //  - http://mootools.net/docs/core/Class/Class
    //  - http://ejohn.org/blog/simple-javascript-inheritance/
    //  - https://github.com/ded/klass
    //  - http://documentcloud.github.com/backbone/#Model-extend
    //  - https://github.com/joyent/node/blob/master/lib/util.js
    //  - https://github.com/kissyteam/kissy/blob/master/src/seed/src/kissy.js
    // The base Class implementation.
    function Class(o) {
        // Convert existed function to Class.
        if (!(this instanceof Class) && isFunction(o)) {
            return classify(o);
        }
    }
    module.exports = Class;
    // Create a new Class.
    //
    //  var SuperPig = Class.create({
    //    Extends: Animal,
    //    Implements: Flyable,
    //    initialize: function() {
    //      SuperPig.superclass.initialize.apply(this, arguments)
    //    },
    //    Statics: {
    //      COLOR: 'red'
    //    }
    // })
    //
    Class.create = function(parent, properties) {
        if (!isFunction(parent)) {
            properties = parent;
            parent = null;
        }
        properties || (properties = {});
        parent || (parent = properties.Extends || Class);
        properties.Extends = parent;
        // The created class constructor
        function SubClass() {
            // Call the parent constructor.
            parent.apply(this, arguments);
            // Only call initialize in self constructor.
            if (this.constructor === SubClass && this.initialize) {
                this.initialize.apply(this, arguments);
            }
        }
        // Inherit class (static) properties from parent.
        if (parent !== Class) {
            mix(SubClass, parent, parent.StaticsWhiteList);
        }
        // Add instance properties to the subclass.
        implement.call(SubClass, properties);
        // Make subclass extendable.
        return classify(SubClass);
    };
    function implement(properties) {
        var key, value;
        for (key in properties) {
            value = properties[key];
            if (Class.Mutators.hasOwnProperty(key)) {
                Class.Mutators[key].call(this, value);
            } else {
                this.prototype[key] = value;
            }
        }
    }
    // Create a sub Class based on `Class`.
    Class.extend = function(properties) {
        properties || (properties = {});
        properties.Extends = this;
        return Class.create(properties);
    };
    function classify(cls) {
        cls.extend = Class.extend;
        cls.implement = implement;
        return cls;
    }
    // Mutators define special properties.
    Class.Mutators = {
        Extends: function(parent) {
            var existed = this.prototype;
            var proto = createProto(parent.prototype);
            // Keep existed properties.
            mix(proto, existed);
            // Enforce the constructor to be what we expect.
            proto.constructor = this;
            // Set the prototype chain to inherit from `parent`.
            this.prototype = proto;
            // Set a convenience property in case the parent's prototype is
            // needed later.
            this.superclass = parent.prototype;
        },
        Implements: function(items) {
            isArray(items) || (items = [ items ]);
            var proto = this.prototype, item;
            while (item = items.shift()) {
                mix(proto, item.prototype || item);
            }
        },
        Statics: function(staticProperties) {
            mix(this, staticProperties);
        }
    };
    // Shared empty constructor function to aid in prototype-chain creation.
    function Ctor() {}
    // See: http://jsperf.com/object-create-vs-new-ctor
    var createProto = Object.__proto__ ? function(proto) {
        return {
            __proto__: proto
        };
    } : function(proto) {
        Ctor.prototype = proto;
        return new Ctor();
    };
    // Helpers
    // ------------
    function mix(r, s, wl) {
        // Copy "all" properties including inherited ones.
        for (var p in s) {
            if (s.hasOwnProperty(p)) {
                if (wl && indexOf(wl, p) === -1) continue;
                // 在 iPhone 1 代等设备的 Safari 中，prototype 也会被枚举出来，需排除
                if (p !== "prototype") {
                    r[p] = s[p];
                }
            }
        }
    }
    var toString = Object.prototype.toString;
    var isArray = Array.isArray || function(val) {
        return toString.call(val) === "[object Array]";
    };
    var isFunction = function(val) {
        return toString.call(val) === "[object Function]";
    };
    var indexOf = Array.prototype.indexOf ? function(arr, item) {
        return arr.indexOf(item);
    } : function(arr, item) {
        for (var i = 0, len = arr.length; i < len; i++) {
            if (arr[i] === item) {
                return i;
            }
        }
        return -1;
    };
});

define("arale/events/1.1.0/events-debug", [], function() {
    // Events
    // -----------------
    // Thanks to:
    //  - https://github.com/documentcloud/backbone/blob/master/backbone.js
    //  - https://github.com/joyent/node/blob/master/lib/events.js
    // Regular expression used to split event strings
    var eventSplitter = /\s+/;
    // A module that can be mixed in to *any object* in order to provide it
    // with custom events. You may bind with `on` or remove with `off` callback
    // functions to an event; `trigger`-ing an event fires all callbacks in
    // succession.
    //
    //     var object = new Events();
    //     object.on('expand', function(){ alert('expanded'); });
    //     object.trigger('expand');
    //
    function Events() {}
    // Bind one or more space separated events, `events`, to a `callback`
    // function. Passing `"all"` will bind the callback to all events fired.
    Events.prototype.on = function(events, callback, context) {
        var cache, event, list;
        if (!callback) return this;
        cache = this.__events || (this.__events = {});
        events = events.split(eventSplitter);
        while (event = events.shift()) {
            list = cache[event] || (cache[event] = []);
            list.push(callback, context);
        }
        return this;
    };
    // Remove one or many callbacks. If `context` is null, removes all callbacks
    // with that function. If `callback` is null, removes all callbacks for the
    // event. If `events` is null, removes all bound callbacks for all events.
    Events.prototype.off = function(events, callback, context) {
        var cache, event, list, i;
        // No events, or removing *all* events.
        if (!(cache = this.__events)) return this;
        if (!(events || callback || context)) {
            delete this.__events;
            return this;
        }
        events = events ? events.split(eventSplitter) : keys(cache);
        // Loop through the callback list, splicing where appropriate.
        while (event = events.shift()) {
            list = cache[event];
            if (!list) continue;
            if (!(callback || context)) {
                delete cache[event];
                continue;
            }
            for (i = list.length - 2; i >= 0; i -= 2) {
                if (!(callback && list[i] !== callback || context && list[i + 1] !== context)) {
                    list.splice(i, 2);
                }
            }
        }
        return this;
    };
    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    Events.prototype.trigger = function(events) {
        var cache, event, all, list, i, len, rest = [], args, returned = {
            status: true
        };
        if (!(cache = this.__events)) return this;
        events = events.split(eventSplitter);
        // Fill up `rest` with the callback arguments.  Since we're only copying
        // the tail of `arguments`, a loop is much faster than Array#slice.
        for (i = 1, len = arguments.length; i < len; i++) {
            rest[i - 1] = arguments[i];
        }
        // For each event, walk through the list of callbacks twice, first to
        // trigger the event, then to trigger any `"all"` callbacks.
        while (event = events.shift()) {
            // Copy callback lists to prevent modification.
            if (all = cache.all) all = all.slice();
            if (list = cache[event]) list = list.slice();
            // Execute event callbacks.
            callEach(list, rest, this, returned);
            // Execute "all" callbacks.
            callEach(all, [ event ].concat(rest), this, returned);
        }
        return returned.status;
    };
    // Mix `Events` to object instance or Class function.
    Events.mixTo = function(receiver) {
        receiver = receiver.prototype || receiver;
        var proto = Events.prototype;
        for (var p in proto) {
            if (proto.hasOwnProperty(p)) {
                receiver[p] = proto[p];
            }
        }
    };
    // Helpers
    // -------
    var keys = Object.keys;
    if (!keys) {
        keys = function(o) {
            var result = [];
            for (var name in o) {
                if (o.hasOwnProperty(name)) {
                    result.push(name);
                }
            }
            return result;
        };
    }
    // Execute callbacks
    function callEach(list, args, context, returned) {
        var r;
        if (list) {
            for (var i = 0, len = list.length; i < len; i += 2) {
                r = list[i].apply(list[i + 1] || context, args);
                // trigger will return false if one of the callbacks return false
                r === false && returned.status && (returned.status = false);
            }
        }
    }
    return Events;
});

define("arale/overlay/1.1.4/mask-debug", [ "$-debug", "./overlay-debug", "arale/position/1.0.1/position-debug", "arale/iframe-shim/1.0.2/iframe-shim-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug" ], function(require, exports, module) {
    var $ = require("$-debug"), Overlay = require("./overlay-debug"), ua = (window.navigator.userAgent || "").toLowerCase(), isIE6 = ua.indexOf("msie 6") !== -1, body = $(document.body), doc = $(document);
    // Mask
    // ----------
    // 全屏遮罩层组件
    var Mask = Overlay.extend({
        attrs: {
            width: isIE6 ? doc.outerWidth(true) : "100%",
            height: isIE6 ? doc.outerHeight(true) : "100%",
            className: "ui-mask",
            opacity: .2,
            backgroundColor: "#000",
            style: {
                position: isIE6 ? "absolute" : "fixed",
                top: 0,
                left: 0
            },
            align: {
                // undefined 表示相对于当前可视范围定位
                baseElement: isIE6 ? body : undefined
            }
        },
        show: function() {
            if (isIE6) {
                this.set("width", doc.outerWidth(true));
                this.set("height", doc.outerHeight(true));
            }
            return Mask.superclass.show.call(this);
        },
        _onRenderBackgroundColor: function(val) {
            this.element.css("backgroundColor", val);
        },
        _onRenderOpacity: function(val) {
            this.element.css("opacity", val);
        }
    });
    // 单例
    module.exports = new Mask();
});

define("arale/overlay/1.1.4/overlay-debug", [ "$-debug", "arale/position/1.0.1/position-debug", "arale/iframe-shim/1.0.2/iframe-shim-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug" ], function(require, exports, module) {
    var $ = require("$-debug"), Position = require("arale/position/1.0.1/position-debug"), Shim = require("arale/iframe-shim/1.0.2/iframe-shim-debug"), Widget = require("arale/widget/1.1.1/widget-debug");
    // Overlay
    // -------
    // Overlay 组件的核心特点是可定位（Positionable）和可层叠（Stackable）
    // 是一切悬浮类 UI 组件的基类
    var Overlay = Widget.extend({
        attrs: {
            // 基本属性
            width: null,
            height: null,
            zIndex: 99,
            visible: false,
            // 定位配置
            align: {
                // element 的定位点，默认为左上角
                selfXY: [ 0, 0 ],
                // 基准定位元素，默认为当前可视区域
                baseElement: Position.VIEWPORT,
                // 基准定位元素的定位点，默认为左上角
                baseXY: [ 0, 0 ]
            },
            // 父元素
            parentNode: document.body
        },
        show: function() {
            // 若从未渲染，则调用 render
            if (!this.rendered) {
                this.render();
            }
            this.set("visible", true);
            return this;
        },
        hide: function() {
            this.set("visible", false);
            return this;
        },
        setup: function() {
            var that = this;
            // 加载 iframe 遮罩层并与 overlay 保持同步
            this._setupShim();
            // 窗口resize时，重新定位浮层
            this._setupResize();
            this.after("render", function() {
                var _pos = this.element.css("position");
                if (_pos === "static" || _pos === "relative") {
                    this.element.css({
                        position: "absolute",
                        left: "-9999px",
                        top: "-9999px"
                    });
                }
            });
            // 统一在显示之后重新设定位置
            this.after("show", function() {
                that._setPosition();
            });
        },
        destroy: function() {
            // 销毁两个静态数组中的实例
            erase(this, Overlay.allOverlays);
            erase(this, Overlay.blurOverlays);
            return Overlay.superclass.destroy.call(this);
        },
        // 进行定位
        _setPosition: function(align) {
            // 不在文档流中，定位无效
            if (!isInDocument(this.element[0])) return;
            align || (align = this.get("align"));
            // 如果align为空，表示不需要使用js对齐
            if (!align) return;
            var isHidden = this.element.css("display") === "none";
            // 在定位时，为避免元素高度不定，先显示出来
            if (isHidden) {
                this.element.css({
                    visibility: "hidden",
                    display: "block"
                });
            }
            Position.pin({
                element: this.element,
                x: align.selfXY[0],
                y: align.selfXY[1]
            }, {
                element: align.baseElement,
                x: align.baseXY[0],
                y: align.baseXY[1]
            });
            // 定位完成后，还原
            if (isHidden) {
                this.element.css({
                    visibility: "",
                    display: "none"
                });
            }
            return this;
        },
        // 加载 iframe 遮罩层并与 overlay 保持同步
        _setupShim: function() {
            var shim = new Shim(this.element);
            // 在隐藏和设置位置后，要重新定位
            // 显示后会设置位置，所以不用绑定 shim.sync
            this.after("hide _setPosition", shim.sync, shim);
            // 除了 parentNode 之外的其他属性发生变化时，都触发 shim 同步
            var attrs = [ "width", "height" ];
            for (var attr in attrs) {
                if (attrs.hasOwnProperty(attr)) {
                    this.on("change:" + attr, shim.sync, shim);
                }
            }
            // 在销魂自身前要销毁 shim
            this.before("destroy", shim.destroy, shim);
        },
        // resize窗口时重新定位浮层，用这个方法收集所有浮层实例
        _setupResize: function() {
            Overlay.allOverlays.push(this);
        },
        // 除了 element 和 relativeElements，点击 body 后都会隐藏 element
        _blurHide: function(arr) {
            arr = $.makeArray(arr);
            arr.push(this.element);
            this._relativeElements = arr;
            Overlay.blurOverlays.push(this);
        },
        // 用于 set 属性后的界面更新
        _onRenderWidth: function(val) {
            this.element.css("width", val);
        },
        _onRenderHeight: function(val) {
            this.element.css("height", val);
        },
        _onRenderZIndex: function(val) {
            this.element.css("zIndex", val);
        },
        _onRenderAlign: function(val) {
            this._setPosition(val);
        },
        _onRenderVisible: function(val) {
            this.element[val ? "show" : "hide"]();
        }
    });
    // 绑定 blur 隐藏事件
    Overlay.blurOverlays = [];
    $(document).on("click", function(e) {
        hideBlurOverlays(e);
    });
    // 绑定 resize 重新定位事件
    var timeout;
    var winWidth = $(window).width();
    var winHeight = $(window).height();
    Overlay.allOverlays = [];
    $(window).resize(function() {
        timeout && clearTimeout(timeout);
        timeout = setTimeout(function() {
            var winNewWidth = $(window).width();
            var winNewHeight = $(window).height();
            // IE678 莫名其妙触发 resize
            // http://stackoverflow.com/questions/1852751/window-resize-event-firing-in-internet-explorer
            if (winWidth !== winNewWidth || winHeight !== winNewHeight) {
                $(Overlay.allOverlays).each(function(i, item) {
                    // 当实例为空或隐藏时，不处理
                    if (!item || !item.get("visible")) {
                        return;
                    }
                    item._setPosition();
                });
            }
            winWidth = winNewWidth;
            winHeight = winNewHeight;
        }, 80);
    });
    module.exports = Overlay;
    // Helpers
    // -------
    function isInDocument(element) {
        return $.contains(document.documentElement, element);
    }
    function hideBlurOverlays(e) {
        $(Overlay.blurOverlays).each(function(index, item) {
            // 当实例为空或隐藏时，不处理
            if (!item || !item.get("visible")) {
                return;
            }
            // 遍历 _relativeElements ，当点击的元素落在这些元素上时，不处理
            for (var i = 0; i < item._relativeElements.length; i++) {
                var el = $(item._relativeElements[i])[0];
                if (el === e.target || $.contains(el, e.target)) {
                    return;
                }
            }
            // 到这里，判断触发了元素的 blur 事件，隐藏元素
            item.hide();
        });
    }
    // 从数组中删除对应元素
    function erase(target, array) {
        for (var i = 0; i < array.length; i++) {
            if (target === array[i]) {
                array.splice(i, 1);
                return array;
            }
        }
    }
});

define("arale/templatable/0.9.2/templatable-debug", [ "$-debug", "gallery/handlebars/1.0.2/handlebars-debug" ], function(require, exports, module) {
    var $ = require("$-debug");
    var Handlebars = require("gallery/handlebars/1.0.2/handlebars-debug");
    var compiledTemplates = {};
    // 提供 Template 模板支持，默认引擎是 Handlebars
    module.exports = {
        // Handlebars 的 helpers
        templateHelpers: null,
        // Handlebars 的 partials
        templatePartials: null,
        // template 对应的 DOM-like object
        templateObject: null,
        // 根据配置的模板和传入的数据，构建 this.element 和 templateElement
        parseElementFromTemplate: function() {
            // template 支持 id 选择器
            var t, template = this.get("template");
            if (/^#/.test(template) && (t = document.getElementById(template.substring(1)))) {
                template = t.innerHTML;
                this.set("template", template);
            }
            this.templateObject = convertTemplateToObject(template);
            this.element = $(this.compile());
        },
        // 编译模板，混入数据，返回 html 结果
        compile: function(template, model) {
            template || (template = this.get("template"));
            model || (model = this.get("model")) || (model = {});
            if (model.toJSON) {
                model = model.toJSON();
            }
            // handlebars runtime，注意 partials 也需要预编译
            if (isFunction(template)) {
                return template(model, {
                    helpers: this.templateHelpers,
                    partials: precompile(this.templatePartials)
                });
            } else {
                var helpers = this.templateHelpers;
                var partials = this.templatePartials;
                var helper, partial;
                // 注册 helpers
                if (helpers) {
                    for (helper in helpers) {
                        if (helpers.hasOwnProperty(helper)) {
                            Handlebars.registerHelper(helper, helpers[helper]);
                        }
                    }
                }
                // 注册 partials
                if (partials) {
                    for (partial in partials) {
                        if (partials.hasOwnProperty(partial)) {
                            Handlebars.registerPartial(partial, partials[partial]);
                        }
                    }
                }
                var compiledTemplate = compiledTemplates[template];
                if (!compiledTemplate) {
                    compiledTemplate = compiledTemplates[template] = Handlebars.compile(template);
                }
                // 生成 html
                var html = compiledTemplate(model);
                // 卸载 helpers
                if (helpers) {
                    for (helper in helpers) {
                        if (helpers.hasOwnProperty(helper)) {
                            delete Handlebars.helpers[helper];
                        }
                    }
                }
                // 卸载 partials
                if (partials) {
                    for (partial in partials) {
                        if (partials.hasOwnProperty(partial)) {
                            delete Handlebars.partials[partial];
                        }
                    }
                }
                return html;
            }
        },
        // 刷新 selector 指定的局部区域
        renderPartial: function(selector) {
            if (this.templateObject) {
                var template = convertObjectToTemplate(this.templateObject, selector);
                if (template) {
                    if (selector) {
                        this.$(selector).html(this.compile(template));
                    } else {
                        this.element.html(this.compile(template));
                    }
                } else {
                    this.element.html(this.compile());
                }
            } else {
                var all = $(this.compile());
                var selected = all.find(selector);
                if (selected.length) {
                    this.$(selector).html(selected.html());
                } else {
                    this.element.html(all.html());
                }
            }
            return this;
        }
    };
    // Helpers
    // -------
    var _compile = Handlebars.compile;
    Handlebars.compile = function(template) {
        return isFunction(template) ? template : _compile.call(Handlebars, template);
    };
    // 将 template 字符串转换成对应的 DOM-like object
    function convertTemplateToObject(template) {
        return isFunction(template) ? null : $(encode(template));
    }
    // 根据 selector 得到 DOM-like template object，并转换为 template 字符串
    function convertObjectToTemplate(templateObject, selector) {
        if (!templateObject) return;
        var element;
        if (selector) {
            element = templateObject.find(selector);
            if (element.length === 0) {
                throw new Error("Invalid template selector: " + selector);
            }
        } else {
            element = templateObject;
        }
        return decode(element.html());
    }
    function encode(template) {
        return template.replace(/({[^}]+}})/g, "<!--$1-->").replace(/\s(src|href)\s*=\s*(['"])(.*?\{.+?)\2/g, " data-templatable-$1=$2$3$2");
    }
    function decode(template) {
        return template.replace(/(?:<|&lt;)!--({{[^}]+}})--(?:>|&gt;)/g, "$1").replace(/data-templatable-/gi, "");
    }
    function isFunction(obj) {
        return typeof obj === "function";
    }
    function precompile(partials) {
        if (!partials) return {};
        var result = {};
        for (var name in partials) {
            var partial = partials[name];
            result[name] = isFunction(partial) ? partial : Handlebars.compile(partial);
        }
        return result;
    }
});

define("gallery/handlebars/1.0.2/handlebars-debug", [], function(require, exports, module) {
    /*

Copyright (C) 2011 by Yehuda Katz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
    // lib/handlebars/browser-prefix.js
    var Handlebars = {};
    (function(Handlebars, undefined) {
        // lib/handlebars/base.js
        Handlebars.VERSION = "1.0.0-rc.4";
        Handlebars.COMPILER_REVISION = 3;
        Handlebars.REVISION_CHANGES = {
            1: "<= 1.0.rc.2",
            // 1.0.rc.2 is actually rev2 but doesn't report it
            2: "== 1.0.0-rc.3",
            3: ">= 1.0.0-rc.4"
        };
        Handlebars.helpers = {};
        Handlebars.partials = {};
        var toString = Object.prototype.toString, functionType = "[object Function]", objectType = "[object Object]";
        Handlebars.registerHelper = function(name, fn, inverse) {
            if (toString.call(name) === objectType) {
                if (inverse || fn) {
                    throw new Handlebars.Exception("Arg not supported with multiple helpers");
                }
                Handlebars.Utils.extend(this.helpers, name);
            } else {
                if (inverse) {
                    fn.not = inverse;
                }
                this.helpers[name] = fn;
            }
        };
        Handlebars.registerPartial = function(name, str) {
            if (toString.call(name) === objectType) {
                Handlebars.Utils.extend(this.partials, name);
            } else {
                this.partials[name] = str;
            }
        };
        Handlebars.registerHelper("helperMissing", function(arg) {
            if (arguments.length === 2) {
                return undefined;
            } else {
                throw new Error("Could not find property '" + arg + "'");
            }
        });
        Handlebars.registerHelper("blockHelperMissing", function(context, options) {
            var inverse = options.inverse || function() {}, fn = options.fn;
            var type = toString.call(context);
            if (type === functionType) {
                context = context.call(this);
            }
            if (context === true) {
                return fn(this);
            } else if (context === false || context == null) {
                return inverse(this);
            } else if (type === "[object Array]") {
                if (context.length > 0) {
                    return Handlebars.helpers.each(context, options);
                } else {
                    return inverse(this);
                }
            } else {
                return fn(context);
            }
        });
        Handlebars.K = function() {};
        Handlebars.createFrame = Object.create || function(object) {
            Handlebars.K.prototype = object;
            var obj = new Handlebars.K();
            Handlebars.K.prototype = null;
            return obj;
        };
        Handlebars.logger = {
            DEBUG: 0,
            INFO: 1,
            WARN: 2,
            ERROR: 3,
            level: 3,
            methodMap: {
                0: "debug",
                1: "info",
                2: "warn",
                3: "error"
            },
            // can be overridden in the host environment
            log: function(level, obj) {
                if (Handlebars.logger.level <= level) {
                    var method = Handlebars.logger.methodMap[level];
                    if (typeof console !== "undefined" && console[method]) {
                        console[method].call(console, obj);
                    }
                }
            }
        };
        Handlebars.log = function(level, obj) {
            Handlebars.logger.log(level, obj);
        };
        Handlebars.registerHelper("each", function(context, options) {
            var fn = options.fn, inverse = options.inverse;
            var i = 0, ret = "", data;
            if (options.data) {
                data = Handlebars.createFrame(options.data);
            }
            if (context && typeof context === "object") {
                if (context instanceof Array) {
                    for (var j = context.length; i < j; i++) {
                        if (data) {
                            data.index = i;
                        }
                        ret = ret + fn(context[i], {
                            data: data
                        });
                    }
                } else {
                    for (var key in context) {
                        if (context.hasOwnProperty(key)) {
                            if (data) {
                                data.key = key;
                            }
                            ret = ret + fn(context[key], {
                                data: data
                            });
                            i++;
                        }
                    }
                }
            }
            if (i === 0) {
                ret = inverse(this);
            }
            return ret;
        });
        Handlebars.registerHelper("if", function(context, options) {
            var type = toString.call(context);
            if (type === functionType) {
                context = context.call(this);
            }
            if (!context || Handlebars.Utils.isEmpty(context)) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        });
        Handlebars.registerHelper("unless", function(context, options) {
            return Handlebars.helpers["if"].call(this, context, {
                fn: options.inverse,
                inverse: options.fn
            });
        });
        Handlebars.registerHelper("with", function(context, options) {
            if (!Handlebars.Utils.isEmpty(context)) return options.fn(context);
        });
        Handlebars.registerHelper("log", function(context, options) {
            var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
            Handlebars.log(level, context);
        });
        // lib/handlebars/compiler/parser.js
        /* Jison generated parser */
        var handlebars = function() {
            var parser = {
                trace: function trace() {},
                yy: {},
                symbols_: {
                    error: 2,
                    root: 3,
                    program: 4,
                    EOF: 5,
                    simpleInverse: 6,
                    statements: 7,
                    statement: 8,
                    openInverse: 9,
                    closeBlock: 10,
                    openBlock: 11,
                    mustache: 12,
                    partial: 13,
                    CONTENT: 14,
                    COMMENT: 15,
                    OPEN_BLOCK: 16,
                    inMustache: 17,
                    CLOSE: 18,
                    OPEN_INVERSE: 19,
                    OPEN_ENDBLOCK: 20,
                    path: 21,
                    OPEN: 22,
                    OPEN_UNESCAPED: 23,
                    OPEN_PARTIAL: 24,
                    partialName: 25,
                    params: 26,
                    hash: 27,
                    DATA: 28,
                    param: 29,
                    STRING: 30,
                    INTEGER: 31,
                    BOOLEAN: 32,
                    hashSegments: 33,
                    hashSegment: 34,
                    ID: 35,
                    EQUALS: 36,
                    PARTIAL_NAME: 37,
                    pathSegments: 38,
                    SEP: 39,
                    $accept: 0,
                    $end: 1
                },
                terminals_: {
                    2: "error",
                    5: "EOF",
                    14: "CONTENT",
                    15: "COMMENT",
                    16: "OPEN_BLOCK",
                    18: "CLOSE",
                    19: "OPEN_INVERSE",
                    20: "OPEN_ENDBLOCK",
                    22: "OPEN",
                    23: "OPEN_UNESCAPED",
                    24: "OPEN_PARTIAL",
                    28: "DATA",
                    30: "STRING",
                    31: "INTEGER",
                    32: "BOOLEAN",
                    35: "ID",
                    36: "EQUALS",
                    37: "PARTIAL_NAME",
                    39: "SEP"
                },
                productions_: [ 0, [ 3, 2 ], [ 4, 2 ], [ 4, 3 ], [ 4, 2 ], [ 4, 1 ], [ 4, 1 ], [ 4, 0 ], [ 7, 1 ], [ 7, 2 ], [ 8, 3 ], [ 8, 3 ], [ 8, 1 ], [ 8, 1 ], [ 8, 1 ], [ 8, 1 ], [ 11, 3 ], [ 9, 3 ], [ 10, 3 ], [ 12, 3 ], [ 12, 3 ], [ 13, 3 ], [ 13, 4 ], [ 6, 2 ], [ 17, 3 ], [ 17, 2 ], [ 17, 2 ], [ 17, 1 ], [ 17, 1 ], [ 26, 2 ], [ 26, 1 ], [ 29, 1 ], [ 29, 1 ], [ 29, 1 ], [ 29, 1 ], [ 29, 1 ], [ 27, 1 ], [ 33, 2 ], [ 33, 1 ], [ 34, 3 ], [ 34, 3 ], [ 34, 3 ], [ 34, 3 ], [ 34, 3 ], [ 25, 1 ], [ 21, 1 ], [ 38, 3 ], [ 38, 1 ] ],
                performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$) {
                    var $0 = $$.length - 1;
                    switch (yystate) {
                      case 1:
                        return $$[$0 - 1];
                        break;

                      case 2:
                        this.$ = new yy.ProgramNode([], $$[$0]);
                        break;

                      case 3:
                        this.$ = new yy.ProgramNode($$[$0 - 2], $$[$0]);
                        break;

                      case 4:
                        this.$ = new yy.ProgramNode($$[$0 - 1], []);
                        break;

                      case 5:
                        this.$ = new yy.ProgramNode($$[$0]);
                        break;

                      case 6:
                        this.$ = new yy.ProgramNode([], []);
                        break;

                      case 7:
                        this.$ = new yy.ProgramNode([]);
                        break;

                      case 8:
                        this.$ = [ $$[$0] ];
                        break;

                      case 9:
                        $$[$0 - 1].push($$[$0]);
                        this.$ = $$[$0 - 1];
                        break;

                      case 10:
                        this.$ = new yy.BlockNode($$[$0 - 2], $$[$0 - 1].inverse, $$[$0 - 1], $$[$0]);
                        break;

                      case 11:
                        this.$ = new yy.BlockNode($$[$0 - 2], $$[$0 - 1], $$[$0 - 1].inverse, $$[$0]);
                        break;

                      case 12:
                        this.$ = $$[$0];
                        break;

                      case 13:
                        this.$ = $$[$0];
                        break;

                      case 14:
                        this.$ = new yy.ContentNode($$[$0]);
                        break;

                      case 15:
                        this.$ = new yy.CommentNode($$[$0]);
                        break;

                      case 16:
                        this.$ = new yy.MustacheNode($$[$0 - 1][0], $$[$0 - 1][1]);
                        break;

                      case 17:
                        this.$ = new yy.MustacheNode($$[$0 - 1][0], $$[$0 - 1][1]);
                        break;

                      case 18:
                        this.$ = $$[$0 - 1];
                        break;

                      case 19:
                        this.$ = new yy.MustacheNode($$[$0 - 1][0], $$[$0 - 1][1]);
                        break;

                      case 20:
                        this.$ = new yy.MustacheNode($$[$0 - 1][0], $$[$0 - 1][1], true);
                        break;

                      case 21:
                        this.$ = new yy.PartialNode($$[$0 - 1]);
                        break;

                      case 22:
                        this.$ = new yy.PartialNode($$[$0 - 2], $$[$0 - 1]);
                        break;

                      case 23:
                        break;

                      case 24:
                        this.$ = [ [ $$[$0 - 2] ].concat($$[$0 - 1]), $$[$0] ];
                        break;

                      case 25:
                        this.$ = [ [ $$[$0 - 1] ].concat($$[$0]), null ];
                        break;

                      case 26:
                        this.$ = [ [ $$[$0 - 1] ], $$[$0] ];
                        break;

                      case 27:
                        this.$ = [ [ $$[$0] ], null ];
                        break;

                      case 28:
                        this.$ = [ [ new yy.DataNode($$[$0]) ], null ];
                        break;

                      case 29:
                        $$[$0 - 1].push($$[$0]);
                        this.$ = $$[$0 - 1];
                        break;

                      case 30:
                        this.$ = [ $$[$0] ];
                        break;

                      case 31:
                        this.$ = $$[$0];
                        break;

                      case 32:
                        this.$ = new yy.StringNode($$[$0]);
                        break;

                      case 33:
                        this.$ = new yy.IntegerNode($$[$0]);
                        break;

                      case 34:
                        this.$ = new yy.BooleanNode($$[$0]);
                        break;

                      case 35:
                        this.$ = new yy.DataNode($$[$0]);
                        break;

                      case 36:
                        this.$ = new yy.HashNode($$[$0]);
                        break;

                      case 37:
                        $$[$0 - 1].push($$[$0]);
                        this.$ = $$[$0 - 1];
                        break;

                      case 38:
                        this.$ = [ $$[$0] ];
                        break;

                      case 39:
                        this.$ = [ $$[$0 - 2], $$[$0] ];
                        break;

                      case 40:
                        this.$ = [ $$[$0 - 2], new yy.StringNode($$[$0]) ];
                        break;

                      case 41:
                        this.$ = [ $$[$0 - 2], new yy.IntegerNode($$[$0]) ];
                        break;

                      case 42:
                        this.$ = [ $$[$0 - 2], new yy.BooleanNode($$[$0]) ];
                        break;

                      case 43:
                        this.$ = [ $$[$0 - 2], new yy.DataNode($$[$0]) ];
                        break;

                      case 44:
                        this.$ = new yy.PartialNameNode($$[$0]);
                        break;

                      case 45:
                        this.$ = new yy.IdNode($$[$0]);
                        break;

                      case 46:
                        $$[$0 - 2].push($$[$0]);
                        this.$ = $$[$0 - 2];
                        break;

                      case 47:
                        this.$ = [ $$[$0] ];
                        break;
                    }
                },
                table: [ {
                    3: 1,
                    4: 2,
                    5: [ 2, 7 ],
                    6: 3,
                    7: 4,
                    8: 6,
                    9: 7,
                    11: 8,
                    12: 9,
                    13: 10,
                    14: [ 1, 11 ],
                    15: [ 1, 12 ],
                    16: [ 1, 13 ],
                    19: [ 1, 5 ],
                    22: [ 1, 14 ],
                    23: [ 1, 15 ],
                    24: [ 1, 16 ]
                }, {
                    1: [ 3 ]
                }, {
                    5: [ 1, 17 ]
                }, {
                    5: [ 2, 6 ],
                    7: 18,
                    8: 6,
                    9: 7,
                    11: 8,
                    12: 9,
                    13: 10,
                    14: [ 1, 11 ],
                    15: [ 1, 12 ],
                    16: [ 1, 13 ],
                    19: [ 1, 19 ],
                    20: [ 2, 6 ],
                    22: [ 1, 14 ],
                    23: [ 1, 15 ],
                    24: [ 1, 16 ]
                }, {
                    5: [ 2, 5 ],
                    6: 20,
                    8: 21,
                    9: 7,
                    11: 8,
                    12: 9,
                    13: 10,
                    14: [ 1, 11 ],
                    15: [ 1, 12 ],
                    16: [ 1, 13 ],
                    19: [ 1, 5 ],
                    20: [ 2, 5 ],
                    22: [ 1, 14 ],
                    23: [ 1, 15 ],
                    24: [ 1, 16 ]
                }, {
                    17: 23,
                    18: [ 1, 22 ],
                    21: 24,
                    28: [ 1, 25 ],
                    35: [ 1, 27 ],
                    38: 26
                }, {
                    5: [ 2, 8 ],
                    14: [ 2, 8 ],
                    15: [ 2, 8 ],
                    16: [ 2, 8 ],
                    19: [ 2, 8 ],
                    20: [ 2, 8 ],
                    22: [ 2, 8 ],
                    23: [ 2, 8 ],
                    24: [ 2, 8 ]
                }, {
                    4: 28,
                    6: 3,
                    7: 4,
                    8: 6,
                    9: 7,
                    11: 8,
                    12: 9,
                    13: 10,
                    14: [ 1, 11 ],
                    15: [ 1, 12 ],
                    16: [ 1, 13 ],
                    19: [ 1, 5 ],
                    20: [ 2, 7 ],
                    22: [ 1, 14 ],
                    23: [ 1, 15 ],
                    24: [ 1, 16 ]
                }, {
                    4: 29,
                    6: 3,
                    7: 4,
                    8: 6,
                    9: 7,
                    11: 8,
                    12: 9,
                    13: 10,
                    14: [ 1, 11 ],
                    15: [ 1, 12 ],
                    16: [ 1, 13 ],
                    19: [ 1, 5 ],
                    20: [ 2, 7 ],
                    22: [ 1, 14 ],
                    23: [ 1, 15 ],
                    24: [ 1, 16 ]
                }, {
                    5: [ 2, 12 ],
                    14: [ 2, 12 ],
                    15: [ 2, 12 ],
                    16: [ 2, 12 ],
                    19: [ 2, 12 ],
                    20: [ 2, 12 ],
                    22: [ 2, 12 ],
                    23: [ 2, 12 ],
                    24: [ 2, 12 ]
                }, {
                    5: [ 2, 13 ],
                    14: [ 2, 13 ],
                    15: [ 2, 13 ],
                    16: [ 2, 13 ],
                    19: [ 2, 13 ],
                    20: [ 2, 13 ],
                    22: [ 2, 13 ],
                    23: [ 2, 13 ],
                    24: [ 2, 13 ]
                }, {
                    5: [ 2, 14 ],
                    14: [ 2, 14 ],
                    15: [ 2, 14 ],
                    16: [ 2, 14 ],
                    19: [ 2, 14 ],
                    20: [ 2, 14 ],
                    22: [ 2, 14 ],
                    23: [ 2, 14 ],
                    24: [ 2, 14 ]
                }, {
                    5: [ 2, 15 ],
                    14: [ 2, 15 ],
                    15: [ 2, 15 ],
                    16: [ 2, 15 ],
                    19: [ 2, 15 ],
                    20: [ 2, 15 ],
                    22: [ 2, 15 ],
                    23: [ 2, 15 ],
                    24: [ 2, 15 ]
                }, {
                    17: 30,
                    21: 24,
                    28: [ 1, 25 ],
                    35: [ 1, 27 ],
                    38: 26
                }, {
                    17: 31,
                    21: 24,
                    28: [ 1, 25 ],
                    35: [ 1, 27 ],
                    38: 26
                }, {
                    17: 32,
                    21: 24,
                    28: [ 1, 25 ],
                    35: [ 1, 27 ],
                    38: 26
                }, {
                    25: 33,
                    37: [ 1, 34 ]
                }, {
                    1: [ 2, 1 ]
                }, {
                    5: [ 2, 2 ],
                    8: 21,
                    9: 7,
                    11: 8,
                    12: 9,
                    13: 10,
                    14: [ 1, 11 ],
                    15: [ 1, 12 ],
                    16: [ 1, 13 ],
                    19: [ 1, 19 ],
                    20: [ 2, 2 ],
                    22: [ 1, 14 ],
                    23: [ 1, 15 ],
                    24: [ 1, 16 ]
                }, {
                    17: 23,
                    21: 24,
                    28: [ 1, 25 ],
                    35: [ 1, 27 ],
                    38: 26
                }, {
                    5: [ 2, 4 ],
                    7: 35,
                    8: 6,
                    9: 7,
                    11: 8,
                    12: 9,
                    13: 10,
                    14: [ 1, 11 ],
                    15: [ 1, 12 ],
                    16: [ 1, 13 ],
                    19: [ 1, 19 ],
                    20: [ 2, 4 ],
                    22: [ 1, 14 ],
                    23: [ 1, 15 ],
                    24: [ 1, 16 ]
                }, {
                    5: [ 2, 9 ],
                    14: [ 2, 9 ],
                    15: [ 2, 9 ],
                    16: [ 2, 9 ],
                    19: [ 2, 9 ],
                    20: [ 2, 9 ],
                    22: [ 2, 9 ],
                    23: [ 2, 9 ],
                    24: [ 2, 9 ]
                }, {
                    5: [ 2, 23 ],
                    14: [ 2, 23 ],
                    15: [ 2, 23 ],
                    16: [ 2, 23 ],
                    19: [ 2, 23 ],
                    20: [ 2, 23 ],
                    22: [ 2, 23 ],
                    23: [ 2, 23 ],
                    24: [ 2, 23 ]
                }, {
                    18: [ 1, 36 ]
                }, {
                    18: [ 2, 27 ],
                    21: 41,
                    26: 37,
                    27: 38,
                    28: [ 1, 45 ],
                    29: 39,
                    30: [ 1, 42 ],
                    31: [ 1, 43 ],
                    32: [ 1, 44 ],
                    33: 40,
                    34: 46,
                    35: [ 1, 47 ],
                    38: 26
                }, {
                    18: [ 2, 28 ]
                }, {
                    18: [ 2, 45 ],
                    28: [ 2, 45 ],
                    30: [ 2, 45 ],
                    31: [ 2, 45 ],
                    32: [ 2, 45 ],
                    35: [ 2, 45 ],
                    39: [ 1, 48 ]
                }, {
                    18: [ 2, 47 ],
                    28: [ 2, 47 ],
                    30: [ 2, 47 ],
                    31: [ 2, 47 ],
                    32: [ 2, 47 ],
                    35: [ 2, 47 ],
                    39: [ 2, 47 ]
                }, {
                    10: 49,
                    20: [ 1, 50 ]
                }, {
                    10: 51,
                    20: [ 1, 50 ]
                }, {
                    18: [ 1, 52 ]
                }, {
                    18: [ 1, 53 ]
                }, {
                    18: [ 1, 54 ]
                }, {
                    18: [ 1, 55 ],
                    21: 56,
                    35: [ 1, 27 ],
                    38: 26
                }, {
                    18: [ 2, 44 ],
                    35: [ 2, 44 ]
                }, {
                    5: [ 2, 3 ],
                    8: 21,
                    9: 7,
                    11: 8,
                    12: 9,
                    13: 10,
                    14: [ 1, 11 ],
                    15: [ 1, 12 ],
                    16: [ 1, 13 ],
                    19: [ 1, 19 ],
                    20: [ 2, 3 ],
                    22: [ 1, 14 ],
                    23: [ 1, 15 ],
                    24: [ 1, 16 ]
                }, {
                    14: [ 2, 17 ],
                    15: [ 2, 17 ],
                    16: [ 2, 17 ],
                    19: [ 2, 17 ],
                    20: [ 2, 17 ],
                    22: [ 2, 17 ],
                    23: [ 2, 17 ],
                    24: [ 2, 17 ]
                }, {
                    18: [ 2, 25 ],
                    21: 41,
                    27: 57,
                    28: [ 1, 45 ],
                    29: 58,
                    30: [ 1, 42 ],
                    31: [ 1, 43 ],
                    32: [ 1, 44 ],
                    33: 40,
                    34: 46,
                    35: [ 1, 47 ],
                    38: 26
                }, {
                    18: [ 2, 26 ]
                }, {
                    18: [ 2, 30 ],
                    28: [ 2, 30 ],
                    30: [ 2, 30 ],
                    31: [ 2, 30 ],
                    32: [ 2, 30 ],
                    35: [ 2, 30 ]
                }, {
                    18: [ 2, 36 ],
                    34: 59,
                    35: [ 1, 60 ]
                }, {
                    18: [ 2, 31 ],
                    28: [ 2, 31 ],
                    30: [ 2, 31 ],
                    31: [ 2, 31 ],
                    32: [ 2, 31 ],
                    35: [ 2, 31 ]
                }, {
                    18: [ 2, 32 ],
                    28: [ 2, 32 ],
                    30: [ 2, 32 ],
                    31: [ 2, 32 ],
                    32: [ 2, 32 ],
                    35: [ 2, 32 ]
                }, {
                    18: [ 2, 33 ],
                    28: [ 2, 33 ],
                    30: [ 2, 33 ],
                    31: [ 2, 33 ],
                    32: [ 2, 33 ],
                    35: [ 2, 33 ]
                }, {
                    18: [ 2, 34 ],
                    28: [ 2, 34 ],
                    30: [ 2, 34 ],
                    31: [ 2, 34 ],
                    32: [ 2, 34 ],
                    35: [ 2, 34 ]
                }, {
                    18: [ 2, 35 ],
                    28: [ 2, 35 ],
                    30: [ 2, 35 ],
                    31: [ 2, 35 ],
                    32: [ 2, 35 ],
                    35: [ 2, 35 ]
                }, {
                    18: [ 2, 38 ],
                    35: [ 2, 38 ]
                }, {
                    18: [ 2, 47 ],
                    28: [ 2, 47 ],
                    30: [ 2, 47 ],
                    31: [ 2, 47 ],
                    32: [ 2, 47 ],
                    35: [ 2, 47 ],
                    36: [ 1, 61 ],
                    39: [ 2, 47 ]
                }, {
                    35: [ 1, 62 ]
                }, {
                    5: [ 2, 10 ],
                    14: [ 2, 10 ],
                    15: [ 2, 10 ],
                    16: [ 2, 10 ],
                    19: [ 2, 10 ],
                    20: [ 2, 10 ],
                    22: [ 2, 10 ],
                    23: [ 2, 10 ],
                    24: [ 2, 10 ]
                }, {
                    21: 63,
                    35: [ 1, 27 ],
                    38: 26
                }, {
                    5: [ 2, 11 ],
                    14: [ 2, 11 ],
                    15: [ 2, 11 ],
                    16: [ 2, 11 ],
                    19: [ 2, 11 ],
                    20: [ 2, 11 ],
                    22: [ 2, 11 ],
                    23: [ 2, 11 ],
                    24: [ 2, 11 ]
                }, {
                    14: [ 2, 16 ],
                    15: [ 2, 16 ],
                    16: [ 2, 16 ],
                    19: [ 2, 16 ],
                    20: [ 2, 16 ],
                    22: [ 2, 16 ],
                    23: [ 2, 16 ],
                    24: [ 2, 16 ]
                }, {
                    5: [ 2, 19 ],
                    14: [ 2, 19 ],
                    15: [ 2, 19 ],
                    16: [ 2, 19 ],
                    19: [ 2, 19 ],
                    20: [ 2, 19 ],
                    22: [ 2, 19 ],
                    23: [ 2, 19 ],
                    24: [ 2, 19 ]
                }, {
                    5: [ 2, 20 ],
                    14: [ 2, 20 ],
                    15: [ 2, 20 ],
                    16: [ 2, 20 ],
                    19: [ 2, 20 ],
                    20: [ 2, 20 ],
                    22: [ 2, 20 ],
                    23: [ 2, 20 ],
                    24: [ 2, 20 ]
                }, {
                    5: [ 2, 21 ],
                    14: [ 2, 21 ],
                    15: [ 2, 21 ],
                    16: [ 2, 21 ],
                    19: [ 2, 21 ],
                    20: [ 2, 21 ],
                    22: [ 2, 21 ],
                    23: [ 2, 21 ],
                    24: [ 2, 21 ]
                }, {
                    18: [ 1, 64 ]
                }, {
                    18: [ 2, 24 ]
                }, {
                    18: [ 2, 29 ],
                    28: [ 2, 29 ],
                    30: [ 2, 29 ],
                    31: [ 2, 29 ],
                    32: [ 2, 29 ],
                    35: [ 2, 29 ]
                }, {
                    18: [ 2, 37 ],
                    35: [ 2, 37 ]
                }, {
                    36: [ 1, 61 ]
                }, {
                    21: 65,
                    28: [ 1, 69 ],
                    30: [ 1, 66 ],
                    31: [ 1, 67 ],
                    32: [ 1, 68 ],
                    35: [ 1, 27 ],
                    38: 26
                }, {
                    18: [ 2, 46 ],
                    28: [ 2, 46 ],
                    30: [ 2, 46 ],
                    31: [ 2, 46 ],
                    32: [ 2, 46 ],
                    35: [ 2, 46 ],
                    39: [ 2, 46 ]
                }, {
                    18: [ 1, 70 ]
                }, {
                    5: [ 2, 22 ],
                    14: [ 2, 22 ],
                    15: [ 2, 22 ],
                    16: [ 2, 22 ],
                    19: [ 2, 22 ],
                    20: [ 2, 22 ],
                    22: [ 2, 22 ],
                    23: [ 2, 22 ],
                    24: [ 2, 22 ]
                }, {
                    18: [ 2, 39 ],
                    35: [ 2, 39 ]
                }, {
                    18: [ 2, 40 ],
                    35: [ 2, 40 ]
                }, {
                    18: [ 2, 41 ],
                    35: [ 2, 41 ]
                }, {
                    18: [ 2, 42 ],
                    35: [ 2, 42 ]
                }, {
                    18: [ 2, 43 ],
                    35: [ 2, 43 ]
                }, {
                    5: [ 2, 18 ],
                    14: [ 2, 18 ],
                    15: [ 2, 18 ],
                    16: [ 2, 18 ],
                    19: [ 2, 18 ],
                    20: [ 2, 18 ],
                    22: [ 2, 18 ],
                    23: [ 2, 18 ],
                    24: [ 2, 18 ]
                } ],
                defaultActions: {
                    17: [ 2, 1 ],
                    25: [ 2, 28 ],
                    38: [ 2, 26 ],
                    57: [ 2, 24 ]
                },
                parseError: function parseError(str, hash) {
                    throw new Error(str);
                },
                parse: function parse(input) {
                    var self = this, stack = [ 0 ], vstack = [ null ], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
                    this.lexer.setInput(input);
                    this.lexer.yy = this.yy;
                    this.yy.lexer = this.lexer;
                    this.yy.parser = this;
                    if (typeof this.lexer.yylloc == "undefined") this.lexer.yylloc = {};
                    var yyloc = this.lexer.yylloc;
                    lstack.push(yyloc);
                    var ranges = this.lexer.options && this.lexer.options.ranges;
                    if (typeof this.yy.parseError === "function") this.parseError = this.yy.parseError;
                    function popStack(n) {
                        stack.length = stack.length - 2 * n;
                        vstack.length = vstack.length - n;
                        lstack.length = lstack.length - n;
                    }
                    function lex() {
                        var token;
                        token = self.lexer.lex() || 1;
                        if (typeof token !== "number") {
                            token = self.symbols_[token] || token;
                        }
                        return token;
                    }
                    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
                    while (true) {
                        state = stack[stack.length - 1];
                        if (this.defaultActions[state]) {
                            action = this.defaultActions[state];
                        } else {
                            if (symbol === null || typeof symbol == "undefined") {
                                symbol = lex();
                            }
                            action = table[state] && table[state][symbol];
                        }
                        if (typeof action === "undefined" || !action.length || !action[0]) {
                            var errStr = "";
                            if (!recovering) {
                                expected = [];
                                for (p in table[state]) if (this.terminals_[p] && p > 2) {
                                    expected.push("'" + this.terminals_[p] + "'");
                                }
                                if (this.lexer.showPosition) {
                                    errStr = "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + (this.terminals_[symbol] || symbol) + "'";
                                } else {
                                    errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == 1 ? "end of input" : "'" + (this.terminals_[symbol] || symbol) + "'");
                                }
                                this.parseError(errStr, {
                                    text: this.lexer.match,
                                    token: this.terminals_[symbol] || symbol,
                                    line: this.lexer.yylineno,
                                    loc: yyloc,
                                    expected: expected
                                });
                            }
                        }
                        if (action[0] instanceof Array && action.length > 1) {
                            throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
                        }
                        switch (action[0]) {
                          case 1:
                            stack.push(symbol);
                            vstack.push(this.lexer.yytext);
                            lstack.push(this.lexer.yylloc);
                            stack.push(action[1]);
                            symbol = null;
                            if (!preErrorSymbol) {
                                yyleng = this.lexer.yyleng;
                                yytext = this.lexer.yytext;
                                yylineno = this.lexer.yylineno;
                                yyloc = this.lexer.yylloc;
                                if (recovering > 0) recovering--;
                            } else {
                                symbol = preErrorSymbol;
                                preErrorSymbol = null;
                            }
                            break;

                          case 2:
                            len = this.productions_[action[1]][1];
                            yyval.$ = vstack[vstack.length - len];
                            yyval._$ = {
                                first_line: lstack[lstack.length - (len || 1)].first_line,
                                last_line: lstack[lstack.length - 1].last_line,
                                first_column: lstack[lstack.length - (len || 1)].first_column,
                                last_column: lstack[lstack.length - 1].last_column
                            };
                            if (ranges) {
                                yyval._$.range = [ lstack[lstack.length - (len || 1)].range[0], lstack[lstack.length - 1].range[1] ];
                            }
                            r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
                            if (typeof r !== "undefined") {
                                return r;
                            }
                            if (len) {
                                stack = stack.slice(0, -1 * len * 2);
                                vstack = vstack.slice(0, -1 * len);
                                lstack = lstack.slice(0, -1 * len);
                            }
                            stack.push(this.productions_[action[1]][0]);
                            vstack.push(yyval.$);
                            lstack.push(yyval._$);
                            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
                            stack.push(newState);
                            break;

                          case 3:
                            return true;
                        }
                    }
                    return true;
                }
            };
            /* Jison generated lexer */
            var lexer = function() {
                var lexer = {
                    EOF: 1,
                    parseError: function parseError(str, hash) {
                        if (this.yy.parser) {
                            this.yy.parser.parseError(str, hash);
                        } else {
                            throw new Error(str);
                        }
                    },
                    setInput: function(input) {
                        this._input = input;
                        this._more = this._less = this.done = false;
                        this.yylineno = this.yyleng = 0;
                        this.yytext = this.matched = this.match = "";
                        this.conditionStack = [ "INITIAL" ];
                        this.yylloc = {
                            first_line: 1,
                            first_column: 0,
                            last_line: 1,
                            last_column: 0
                        };
                        if (this.options.ranges) this.yylloc.range = [ 0, 0 ];
                        this.offset = 0;
                        return this;
                    },
                    input: function() {
                        var ch = this._input[0];
                        this.yytext += ch;
                        this.yyleng++;
                        this.offset++;
                        this.match += ch;
                        this.matched += ch;
                        var lines = ch.match(/(?:\r\n?|\n).*/g);
                        if (lines) {
                            this.yylineno++;
                            this.yylloc.last_line++;
                        } else {
                            this.yylloc.last_column++;
                        }
                        if (this.options.ranges) this.yylloc.range[1]++;
                        this._input = this._input.slice(1);
                        return ch;
                    },
                    unput: function(ch) {
                        var len = ch.length;
                        var lines = ch.split(/(?:\r\n?|\n)/g);
                        this._input = ch + this._input;
                        this.yytext = this.yytext.substr(0, this.yytext.length - len - 1);
                        //this.yyleng -= len;
                        this.offset -= len;
                        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
                        this.match = this.match.substr(0, this.match.length - 1);
                        this.matched = this.matched.substr(0, this.matched.length - 1);
                        if (lines.length - 1) this.yylineno -= lines.length - 1;
                        var r = this.yylloc.range;
                        this.yylloc = {
                            first_line: this.yylloc.first_line,
                            last_line: this.yylineno + 1,
                            first_column: this.yylloc.first_column,
                            last_column: lines ? (lines.length === oldLines.length ? this.yylloc.first_column : 0) + oldLines[oldLines.length - lines.length].length - lines[0].length : this.yylloc.first_column - len
                        };
                        if (this.options.ranges) {
                            this.yylloc.range = [ r[0], r[0] + this.yyleng - len ];
                        }
                        return this;
                    },
                    more: function() {
                        this._more = true;
                        return this;
                    },
                    less: function(n) {
                        this.unput(this.match.slice(n));
                    },
                    pastInput: function() {
                        var past = this.matched.substr(0, this.matched.length - this.match.length);
                        return (past.length > 20 ? "..." : "") + past.substr(-20).replace(/\n/g, "");
                    },
                    upcomingInput: function() {
                        var next = this.match;
                        if (next.length < 20) {
                            next += this._input.substr(0, 20 - next.length);
                        }
                        return (next.substr(0, 20) + (next.length > 20 ? "..." : "")).replace(/\n/g, "");
                    },
                    showPosition: function() {
                        var pre = this.pastInput();
                        var c = new Array(pre.length + 1).join("-");
                        return pre + this.upcomingInput() + "\n" + c + "^";
                    },
                    next: function() {
                        if (this.done) {
                            return this.EOF;
                        }
                        if (!this._input) this.done = true;
                        var token, match, tempMatch, index, col, lines;
                        if (!this._more) {
                            this.yytext = "";
                            this.match = "";
                        }
                        var rules = this._currentRules();
                        for (var i = 0; i < rules.length; i++) {
                            tempMatch = this._input.match(this.rules[rules[i]]);
                            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                                match = tempMatch;
                                index = i;
                                if (!this.options.flex) break;
                            }
                        }
                        if (match) {
                            lines = match[0].match(/(?:\r\n?|\n).*/g);
                            if (lines) this.yylineno += lines.length;
                            this.yylloc = {
                                first_line: this.yylloc.last_line,
                                last_line: this.yylineno + 1,
                                first_column: this.yylloc.last_column,
                                last_column: lines ? lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + match[0].length
                            };
                            this.yytext += match[0];
                            this.match += match[0];
                            this.matches = match;
                            this.yyleng = this.yytext.length;
                            if (this.options.ranges) {
                                this.yylloc.range = [ this.offset, this.offset += this.yyleng ];
                            }
                            this._more = false;
                            this._input = this._input.slice(match[0].length);
                            this.matched += match[0];
                            token = this.performAction.call(this, this.yy, this, rules[index], this.conditionStack[this.conditionStack.length - 1]);
                            if (this.done && this._input) this.done = false;
                            if (token) return token; else return;
                        }
                        if (this._input === "") {
                            return this.EOF;
                        } else {
                            return this.parseError("Lexical error on line " + (this.yylineno + 1) + ". Unrecognized text.\n" + this.showPosition(), {
                                text: "",
                                token: null,
                                line: this.yylineno
                            });
                        }
                    },
                    lex: function lex() {
                        var r = this.next();
                        if (typeof r !== "undefined") {
                            return r;
                        } else {
                            return this.lex();
                        }
                    },
                    begin: function begin(condition) {
                        this.conditionStack.push(condition);
                    },
                    popState: function popState() {
                        return this.conditionStack.pop();
                    },
                    _currentRules: function _currentRules() {
                        return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
                    },
                    topState: function() {
                        return this.conditionStack[this.conditionStack.length - 2];
                    },
                    pushState: function begin(condition) {
                        this.begin(condition);
                    }
                };
                lexer.options = {};
                lexer.performAction = function anonymous(yy, yy_, $avoiding_name_collisions, YY_START) {
                    var YYSTATE = YY_START;
                    switch ($avoiding_name_collisions) {
                      case 0:
                        yy_.yytext = "\\";
                        return 14;
                        break;

                      case 1:
                        if (yy_.yytext.slice(-1) !== "\\") this.begin("mu");
                        if (yy_.yytext.slice(-1) === "\\") yy_.yytext = yy_.yytext.substr(0, yy_.yyleng - 1), 
                        this.begin("emu");
                        if (yy_.yytext) return 14;
                        break;

                      case 2:
                        return 14;
                        break;

                      case 3:
                        if (yy_.yytext.slice(-1) !== "\\") this.popState();
                        if (yy_.yytext.slice(-1) === "\\") yy_.yytext = yy_.yytext.substr(0, yy_.yyleng - 1);
                        return 14;
                        break;

                      case 4:
                        yy_.yytext = yy_.yytext.substr(0, yy_.yyleng - 4);
                        this.popState();
                        return 15;
                        break;

                      case 5:
                        this.begin("par");
                        return 24;
                        break;

                      case 6:
                        return 16;
                        break;

                      case 7:
                        return 20;
                        break;

                      case 8:
                        return 19;
                        break;

                      case 9:
                        return 19;
                        break;

                      case 10:
                        return 23;
                        break;

                      case 11:
                        return 23;
                        break;

                      case 12:
                        this.popState();
                        this.begin("com");
                        break;

                      case 13:
                        yy_.yytext = yy_.yytext.substr(3, yy_.yyleng - 5);
                        this.popState();
                        return 15;
                        break;

                      case 14:
                        return 22;
                        break;

                      case 15:
                        return 36;
                        break;

                      case 16:
                        return 35;
                        break;

                      case 17:
                        return 35;
                        break;

                      case 18:
                        return 39;
                        break;

                      case 19:
                        /*ignore whitespace*/
                        break;

                      case 20:
                        this.popState();
                        return 18;
                        break;

                      case 21:
                        this.popState();
                        return 18;
                        break;

                      case 22:
                        yy_.yytext = yy_.yytext.substr(1, yy_.yyleng - 2).replace(/\\"/g, '"');
                        return 30;
                        break;

                      case 23:
                        yy_.yytext = yy_.yytext.substr(1, yy_.yyleng - 2).replace(/\\'/g, "'");
                        return 30;
                        break;

                      case 24:
                        yy_.yytext = yy_.yytext.substr(1);
                        return 28;
                        break;

                      case 25:
                        return 32;
                        break;

                      case 26:
                        return 32;
                        break;

                      case 27:
                        return 31;
                        break;

                      case 28:
                        return 35;
                        break;

                      case 29:
                        yy_.yytext = yy_.yytext.substr(1, yy_.yyleng - 2);
                        return 35;
                        break;

                      case 30:
                        return "INVALID";
                        break;

                      case 31:
                        /*ignore whitespace*/
                        break;

                      case 32:
                        this.popState();
                        return 37;
                        break;

                      case 33:
                        return 5;
                        break;
                    }
                };
                lexer.rules = [ /^(?:\\\\(?=(\{\{)))/, /^(?:[^\x00]*?(?=(\{\{)))/, /^(?:[^\x00]+)/, /^(?:[^\x00]{2,}?(?=(\{\{|$)))/, /^(?:[\s\S]*?--\}\})/, /^(?:\{\{>)/, /^(?:\{\{#)/, /^(?:\{\{\/)/, /^(?:\{\{\^)/, /^(?:\{\{\s*else\b)/, /^(?:\{\{\{)/, /^(?:\{\{&)/, /^(?:\{\{!--)/, /^(?:\{\{![\s\S]*?\}\})/, /^(?:\{\{)/, /^(?:=)/, /^(?:\.(?=[}/ ]))/, /^(?:\.\.)/, /^(?:[\/.])/, /^(?:\s+)/, /^(?:\}\}\})/, /^(?:\}\})/, /^(?:"(\\["]|[^"])*")/, /^(?:'(\\[']|[^'])*')/, /^(?:@[a-zA-Z]+)/, /^(?:true(?=[}\s]))/, /^(?:false(?=[}\s]))/, /^(?:-?[0-9]+(?=[}\s]))/, /^(?:[a-zA-Z0-9_$:\-]+(?=[=}\s\/.]))/, /^(?:\[[^\]]*\])/, /^(?:.)/, /^(?:\s+)/, /^(?:[a-zA-Z0-9_$\-\/]+)/, /^(?:$)/ ];
                lexer.conditions = {
                    mu: {
                        rules: [ 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 33 ],
                        inclusive: false
                    },
                    emu: {
                        rules: [ 3 ],
                        inclusive: false
                    },
                    com: {
                        rules: [ 4 ],
                        inclusive: false
                    },
                    par: {
                        rules: [ 31, 32 ],
                        inclusive: false
                    },
                    INITIAL: {
                        rules: [ 0, 1, 2, 33 ],
                        inclusive: true
                    }
                };
                return lexer;
            }();
            parser.lexer = lexer;
            function Parser() {
                this.yy = {};
            }
            Parser.prototype = parser;
            parser.Parser = Parser;
            return new Parser();
        }();
        // lib/handlebars/compiler/base.js
        Handlebars.Parser = handlebars;
        Handlebars.parse = function(input) {
            // Just return if an already-compile AST was passed in.
            if (input.constructor === Handlebars.AST.ProgramNode) {
                return input;
            }
            Handlebars.Parser.yy = Handlebars.AST;
            return Handlebars.Parser.parse(input);
        };
        // lib/handlebars/compiler/ast.js
        Handlebars.AST = {};
        Handlebars.AST.ProgramNode = function(statements, inverse) {
            this.type = "program";
            this.statements = statements;
            if (inverse) {
                this.inverse = new Handlebars.AST.ProgramNode(inverse);
            }
        };
        Handlebars.AST.MustacheNode = function(rawParams, hash, unescaped) {
            this.type = "mustache";
            this.escaped = !unescaped;
            this.hash = hash;
            var id = this.id = rawParams[0];
            var params = this.params = rawParams.slice(1);
            // a mustache is an eligible helper if:
            // * its id is simple (a single part, not `this` or `..`)
            var eligibleHelper = this.eligibleHelper = id.isSimple;
            // a mustache is definitely a helper if:
            // * it is an eligible helper, and
            // * it has at least one parameter or hash segment
            this.isHelper = eligibleHelper && (params.length || hash);
        };
        Handlebars.AST.PartialNode = function(partialName, context) {
            this.type = "partial";
            this.partialName = partialName;
            this.context = context;
        };
        Handlebars.AST.BlockNode = function(mustache, program, inverse, close) {
            var verifyMatch = function(open, close) {
                if (open.original !== close.original) {
                    throw new Handlebars.Exception(open.original + " doesn't match " + close.original);
                }
            };
            verifyMatch(mustache.id, close);
            this.type = "block";
            this.mustache = mustache;
            this.program = program;
            this.inverse = inverse;
            if (this.inverse && !this.program) {
                this.isInverse = true;
            }
        };
        Handlebars.AST.ContentNode = function(string) {
            this.type = "content";
            this.string = string;
        };
        Handlebars.AST.HashNode = function(pairs) {
            this.type = "hash";
            this.pairs = pairs;
        };
        Handlebars.AST.IdNode = function(parts) {
            this.type = "ID";
            this.original = parts.join(".");
            var dig = [], depth = 0;
            for (var i = 0, l = parts.length; i < l; i++) {
                var part = parts[i];
                if (part === ".." || part === "." || part === "this") {
                    if (dig.length > 0) {
                        throw new Handlebars.Exception("Invalid path: " + this.original);
                    } else if (part === "..") {
                        depth++;
                    } else {
                        this.isScoped = true;
                    }
                } else {
                    dig.push(part);
                }
            }
            this.parts = dig;
            this.string = dig.join(".");
            this.depth = depth;
            // an ID is simple if it only has one part, and that part is not
            // `..` or `this`.
            this.isSimple = parts.length === 1 && !this.isScoped && depth === 0;
            this.stringModeValue = this.string;
        };
        Handlebars.AST.PartialNameNode = function(name) {
            this.type = "PARTIAL_NAME";
            this.name = name;
        };
        Handlebars.AST.DataNode = function(id) {
            this.type = "DATA";
            this.id = id;
        };
        Handlebars.AST.StringNode = function(string) {
            this.type = "STRING";
            this.string = string;
            this.stringModeValue = string;
        };
        Handlebars.AST.IntegerNode = function(integer) {
            this.type = "INTEGER";
            this.integer = integer;
            this.stringModeValue = Number(integer);
        };
        Handlebars.AST.BooleanNode = function(bool) {
            this.type = "BOOLEAN";
            this.bool = bool;
            this.stringModeValue = bool === "true";
        };
        Handlebars.AST.CommentNode = function(comment) {
            this.type = "comment";
            this.comment = comment;
        };
        // lib/handlebars/utils.js
        var errorProps = [ "description", "fileName", "lineNumber", "message", "name", "number", "stack" ];
        Handlebars.Exception = function(message) {
            var tmp = Error.prototype.constructor.apply(this, arguments);
            // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
            for (var idx = 0; idx < errorProps.length; idx++) {
                this[errorProps[idx]] = tmp[errorProps[idx]];
            }
        };
        Handlebars.Exception.prototype = new Error();
        // Build out our basic SafeString type
        Handlebars.SafeString = function(string) {
            this.string = string;
        };
        Handlebars.SafeString.prototype.toString = function() {
            return this.string.toString();
        };
        var escape = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#x27;",
            "`": "&#x60;"
        };
        var badChars = /[&<>"'`]/g;
        var possible = /[&<>"'`]/;
        var escapeChar = function(chr) {
            return escape[chr] || "&amp;";
        };
        Handlebars.Utils = {
            extend: function(obj, value) {
                for (var key in value) {
                    if (value.hasOwnProperty(key)) {
                        obj[key] = value[key];
                    }
                }
            },
            escapeExpression: function(string) {
                // don't escape SafeStrings, since they're already safe
                if (string instanceof Handlebars.SafeString) {
                    return string.toString();
                } else if (string == null || string === false) {
                    return "";
                }
                // Force a string conversion as this will be done by the append regardless and
                // the regex test will do this transparently behind the scenes, causing issues if
                // an object's to string has escaped characters in it.
                string = string.toString();
                if (!possible.test(string)) {
                    return string;
                }
                return string.replace(badChars, escapeChar);
            },
            isEmpty: function(value) {
                if (!value && value !== 0) {
                    return true;
                } else if (toString.call(value) === "[object Array]" && value.length === 0) {
                    return true;
                } else {
                    return false;
                }
            }
        };
        // lib/handlebars/compiler/compiler.js
        /*jshint eqnull:true*/
        var Compiler = Handlebars.Compiler = function() {};
        var JavaScriptCompiler = Handlebars.JavaScriptCompiler = function() {};
        // the foundHelper register will disambiguate helper lookup from finding a
        // function in a context. This is necessary for mustache compatibility, which
        // requires that context functions in blocks are evaluated by blockHelperMissing,
        // and then proceed as if the resulting value was provided to blockHelperMissing.
        Compiler.prototype = {
            compiler: Compiler,
            disassemble: function() {
                var opcodes = this.opcodes, opcode, out = [], params, param;
                for (var i = 0, l = opcodes.length; i < l; i++) {
                    opcode = opcodes[i];
                    if (opcode.opcode === "DECLARE") {
                        out.push("DECLARE " + opcode.name + "=" + opcode.value);
                    } else {
                        params = [];
                        for (var j = 0; j < opcode.args.length; j++) {
                            param = opcode.args[j];
                            if (typeof param === "string") {
                                param = '"' + param.replace("\n", "\\n") + '"';
                            }
                            params.push(param);
                        }
                        out.push(opcode.opcode + " " + params.join(" "));
                    }
                }
                return out.join("\n");
            },
            equals: function(other) {
                var len = this.opcodes.length;
                if (other.opcodes.length !== len) {
                    return false;
                }
                for (var i = 0; i < len; i++) {
                    var opcode = this.opcodes[i], otherOpcode = other.opcodes[i];
                    if (opcode.opcode !== otherOpcode.opcode || opcode.args.length !== otherOpcode.args.length) {
                        return false;
                    }
                    for (var j = 0; j < opcode.args.length; j++) {
                        if (opcode.args[j] !== otherOpcode.args[j]) {
                            return false;
                        }
                    }
                }
                len = this.children.length;
                if (other.children.length !== len) {
                    return false;
                }
                for (i = 0; i < len; i++) {
                    if (!this.children[i].equals(other.children[i])) {
                        return false;
                    }
                }
                return true;
            },
            guid: 0,
            compile: function(program, options) {
                this.children = [];
                this.depths = {
                    list: []
                };
                this.options = options;
                // These changes will propagate to the other compiler components
                var knownHelpers = this.options.knownHelpers;
                this.options.knownHelpers = {
                    helperMissing: true,
                    blockHelperMissing: true,
                    each: true,
                    "if": true,
                    unless: true,
                    "with": true,
                    log: true
                };
                if (knownHelpers) {
                    for (var name in knownHelpers) {
                        this.options.knownHelpers[name] = knownHelpers[name];
                    }
                }
                return this.program(program);
            },
            accept: function(node) {
                return this[node.type](node);
            },
            program: function(program) {
                var statements = program.statements, statement;
                this.opcodes = [];
                for (var i = 0, l = statements.length; i < l; i++) {
                    statement = statements[i];
                    this[statement.type](statement);
                }
                this.isSimple = l === 1;
                this.depths.list = this.depths.list.sort(function(a, b) {
                    return a - b;
                });
                return this;
            },
            compileProgram: function(program) {
                var result = new this.compiler().compile(program, this.options);
                var guid = this.guid++, depth;
                this.usePartial = this.usePartial || result.usePartial;
                this.children[guid] = result;
                for (var i = 0, l = result.depths.list.length; i < l; i++) {
                    depth = result.depths.list[i];
                    if (depth < 2) {
                        continue;
                    } else {
                        this.addDepth(depth - 1);
                    }
                }
                return guid;
            },
            block: function(block) {
                var mustache = block.mustache, program = block.program, inverse = block.inverse;
                if (program) {
                    program = this.compileProgram(program);
                }
                if (inverse) {
                    inverse = this.compileProgram(inverse);
                }
                var type = this.classifyMustache(mustache);
                if (type === "helper") {
                    this.helperMustache(mustache, program, inverse);
                } else if (type === "simple") {
                    this.simpleMustache(mustache);
                    // now that the simple mustache is resolved, we need to
                    // evaluate it by executing `blockHelperMissing`
                    this.opcode("pushProgram", program);
                    this.opcode("pushProgram", inverse);
                    this.opcode("emptyHash");
                    this.opcode("blockValue");
                } else {
                    this.ambiguousMustache(mustache, program, inverse);
                    // now that the simple mustache is resolved, we need to
                    // evaluate it by executing `blockHelperMissing`
                    this.opcode("pushProgram", program);
                    this.opcode("pushProgram", inverse);
                    this.opcode("emptyHash");
                    this.opcode("ambiguousBlockValue");
                }
                this.opcode("append");
            },
            hash: function(hash) {
                var pairs = hash.pairs, pair, val;
                this.opcode("pushHash");
                for (var i = 0, l = pairs.length; i < l; i++) {
                    pair = pairs[i];
                    val = pair[1];
                    if (this.options.stringParams) {
                        if (val.depth) {
                            this.addDepth(val.depth);
                        }
                        this.opcode("getContext", val.depth || 0);
                        this.opcode("pushStringParam", val.stringModeValue, val.type);
                    } else {
                        this.accept(val);
                    }
                    this.opcode("assignToHash", pair[0]);
                }
                this.opcode("popHash");
            },
            partial: function(partial) {
                var partialName = partial.partialName;
                this.usePartial = true;
                if (partial.context) {
                    this.ID(partial.context);
                } else {
                    this.opcode("push", "depth0");
                }
                this.opcode("invokePartial", partialName.name);
                this.opcode("append");
            },
            content: function(content) {
                this.opcode("appendContent", content.string);
            },
            mustache: function(mustache) {
                var options = this.options;
                var type = this.classifyMustache(mustache);
                if (type === "simple") {
                    this.simpleMustache(mustache);
                } else if (type === "helper") {
                    this.helperMustache(mustache);
                } else {
                    this.ambiguousMustache(mustache);
                }
                if (mustache.escaped && !options.noEscape) {
                    this.opcode("appendEscaped");
                } else {
                    this.opcode("append");
                }
            },
            ambiguousMustache: function(mustache, program, inverse) {
                var id = mustache.id, name = id.parts[0], isBlock = program != null || inverse != null;
                this.opcode("getContext", id.depth);
                this.opcode("pushProgram", program);
                this.opcode("pushProgram", inverse);
                this.opcode("invokeAmbiguous", name, isBlock);
            },
            simpleMustache: function(mustache) {
                var id = mustache.id;
                if (id.type === "DATA") {
                    this.DATA(id);
                } else if (id.parts.length) {
                    this.ID(id);
                } else {
                    // Simplified ID for `this`
                    this.addDepth(id.depth);
                    this.opcode("getContext", id.depth);
                    this.opcode("pushContext");
                }
                this.opcode("resolvePossibleLambda");
            },
            helperMustache: function(mustache, program, inverse) {
                var params = this.setupFullMustacheParams(mustache, program, inverse), name = mustache.id.parts[0];
                if (this.options.knownHelpers[name]) {
                    this.opcode("invokeKnownHelper", params.length, name);
                } else if (this.options.knownHelpersOnly) {
                    throw new Error("You specified knownHelpersOnly, but used the unknown helper " + name);
                } else {
                    this.opcode("invokeHelper", params.length, name);
                }
            },
            ID: function(id) {
                this.addDepth(id.depth);
                this.opcode("getContext", id.depth);
                var name = id.parts[0];
                if (!name) {
                    this.opcode("pushContext");
                } else {
                    this.opcode("lookupOnContext", id.parts[0]);
                }
                for (var i = 1, l = id.parts.length; i < l; i++) {
                    this.opcode("lookup", id.parts[i]);
                }
            },
            DATA: function(data) {
                this.options.data = true;
                this.opcode("lookupData", data.id);
            },
            STRING: function(string) {
                this.opcode("pushString", string.string);
            },
            INTEGER: function(integer) {
                this.opcode("pushLiteral", integer.integer);
            },
            BOOLEAN: function(bool) {
                this.opcode("pushLiteral", bool.bool);
            },
            comment: function() {},
            // HELPERS
            opcode: function(name) {
                this.opcodes.push({
                    opcode: name,
                    args: [].slice.call(arguments, 1)
                });
            },
            declare: function(name, value) {
                this.opcodes.push({
                    opcode: "DECLARE",
                    name: name,
                    value: value
                });
            },
            addDepth: function(depth) {
                if (isNaN(depth)) {
                    throw new Error("EWOT");
                }
                if (depth === 0) {
                    return;
                }
                if (!this.depths[depth]) {
                    this.depths[depth] = true;
                    this.depths.list.push(depth);
                }
            },
            classifyMustache: function(mustache) {
                var isHelper = mustache.isHelper;
                var isEligible = mustache.eligibleHelper;
                var options = this.options;
                // if ambiguous, we can possibly resolve the ambiguity now
                if (isEligible && !isHelper) {
                    var name = mustache.id.parts[0];
                    if (options.knownHelpers[name]) {
                        isHelper = true;
                    } else if (options.knownHelpersOnly) {
                        isEligible = false;
                    }
                }
                if (isHelper) {
                    return "helper";
                } else if (isEligible) {
                    return "ambiguous";
                } else {
                    return "simple";
                }
            },
            pushParams: function(params) {
                var i = params.length, param;
                while (i--) {
                    param = params[i];
                    if (this.options.stringParams) {
                        if (param.depth) {
                            this.addDepth(param.depth);
                        }
                        this.opcode("getContext", param.depth || 0);
                        this.opcode("pushStringParam", param.stringModeValue, param.type);
                    } else {
                        this[param.type](param);
                    }
                }
            },
            setupMustacheParams: function(mustache) {
                var params = mustache.params;
                this.pushParams(params);
                if (mustache.hash) {
                    this.hash(mustache.hash);
                } else {
                    this.opcode("emptyHash");
                }
                return params;
            },
            // this will replace setupMustacheParams when we're done
            setupFullMustacheParams: function(mustache, program, inverse) {
                var params = mustache.params;
                this.pushParams(params);
                this.opcode("pushProgram", program);
                this.opcode("pushProgram", inverse);
                if (mustache.hash) {
                    this.hash(mustache.hash);
                } else {
                    this.opcode("emptyHash");
                }
                return params;
            }
        };
        var Literal = function(value) {
            this.value = value;
        };
        JavaScriptCompiler.prototype = {
            // PUBLIC API: You can override these methods in a subclass to provide
            // alternative compiled forms for name lookup and buffering semantics
            nameLookup: function(parent, name) {
                if (/^[0-9]+$/.test(name)) {
                    return parent + "[" + name + "]";
                } else if (JavaScriptCompiler.isValidJavaScriptVariableName(name)) {
                    return parent + "." + name;
                } else {
                    return parent + "['" + name + "']";
                }
            },
            appendToBuffer: function(string) {
                if (this.environment.isSimple) {
                    return "return " + string + ";";
                } else {
                    return {
                        appendToBuffer: true,
                        content: string,
                        toString: function() {
                            return "buffer += " + string + ";";
                        }
                    };
                }
            },
            initializeBuffer: function() {
                return this.quotedString("");
            },
            namespace: "Handlebars",
            // END PUBLIC API
            compile: function(environment, options, context, asObject) {
                this.environment = environment;
                this.options = options || {};
                Handlebars.log(Handlebars.logger.DEBUG, this.environment.disassemble() + "\n\n");
                this.name = this.environment.name;
                this.isChild = !!context;
                this.context = context || {
                    programs: [],
                    environments: [],
                    aliases: {}
                };
                this.preamble();
                this.stackSlot = 0;
                this.stackVars = [];
                this.registers = {
                    list: []
                };
                this.compileStack = [];
                this.inlineStack = [];
                this.compileChildren(environment, options);
                var opcodes = environment.opcodes, opcode;
                this.i = 0;
                for (l = opcodes.length; this.i < l; this.i++) {
                    opcode = opcodes[this.i];
                    if (opcode.opcode === "DECLARE") {
                        this[opcode.name] = opcode.value;
                    } else {
                        this[opcode.opcode].apply(this, opcode.args);
                    }
                }
                return this.createFunctionContext(asObject);
            },
            nextOpcode: function() {
                var opcodes = this.environment.opcodes;
                return opcodes[this.i + 1];
            },
            eat: function() {
                this.i = this.i + 1;
            },
            preamble: function() {
                var out = [];
                if (!this.isChild) {
                    var namespace = this.namespace;
                    var copies = "helpers = helpers || " + namespace + ".helpers;";
                    if (this.environment.usePartial) {
                        copies = copies + " partials = partials || " + namespace + ".partials;";
                    }
                    if (this.options.data) {
                        copies = copies + " data = data || {};";
                    }
                    out.push(copies);
                } else {
                    out.push("");
                }
                if (!this.environment.isSimple) {
                    out.push(", buffer = " + this.initializeBuffer());
                } else {
                    out.push("");
                }
                // track the last context pushed into place to allow skipping the
                // getContext opcode when it would be a noop
                this.lastContext = 0;
                this.source = out;
            },
            createFunctionContext: function(asObject) {
                var locals = this.stackVars.concat(this.registers.list);
                if (locals.length > 0) {
                    this.source[1] = this.source[1] + ", " + locals.join(", ");
                }
                // Generate minimizer alias mappings
                if (!this.isChild) {
                    for (var alias in this.context.aliases) {
                        this.source[1] = this.source[1] + ", " + alias + "=" + this.context.aliases[alias];
                    }
                }
                if (this.source[1]) {
                    this.source[1] = "var " + this.source[1].substring(2) + ";";
                }
                // Merge children
                if (!this.isChild) {
                    this.source[1] += "\n" + this.context.programs.join("\n") + "\n";
                }
                if (!this.environment.isSimple) {
                    this.source.push("return buffer;");
                }
                var params = this.isChild ? [ "depth0", "data" ] : [ "Handlebars", "depth0", "helpers", "partials", "data" ];
                for (var i = 0, l = this.environment.depths.list.length; i < l; i++) {
                    params.push("depth" + this.environment.depths.list[i]);
                }
                // Perform a second pass over the output to merge content when possible
                var source = this.mergeSource();
                if (!this.isChild) {
                    var revision = Handlebars.COMPILER_REVISION, versions = Handlebars.REVISION_CHANGES[revision];
                    source = "this.compilerInfo = [" + revision + ",'" + versions + "'];\n" + source;
                }
                if (asObject) {
                    params.push(source);
                    return Function.apply(this, params);
                } else {
                    var functionSource = "function " + (this.name || "") + "(" + params.join(",") + ") {\n  " + source + "}";
                    Handlebars.log(Handlebars.logger.DEBUG, functionSource + "\n\n");
                    return functionSource;
                }
            },
            mergeSource: function() {
                // WARN: We are not handling the case where buffer is still populated as the source should
                // not have buffer append operations as their final action.
                var source = "", buffer;
                for (var i = 0, len = this.source.length; i < len; i++) {
                    var line = this.source[i];
                    if (line.appendToBuffer) {
                        if (buffer) {
                            buffer = buffer + "\n    + " + line.content;
                        } else {
                            buffer = line.content;
                        }
                    } else {
                        if (buffer) {
                            source += "buffer += " + buffer + ";\n  ";
                            buffer = undefined;
                        }
                        source += line + "\n  ";
                    }
                }
                return source;
            },
            // [blockValue]
            //
            // On stack, before: hash, inverse, program, value
            // On stack, after: return value of blockHelperMissing
            //
            // The purpose of this opcode is to take a block of the form
            // `{{#foo}}...{{/foo}}`, resolve the value of `foo`, and
            // replace it on the stack with the result of properly
            // invoking blockHelperMissing.
            blockValue: function() {
                this.context.aliases.blockHelperMissing = "helpers.blockHelperMissing";
                var params = [ "depth0" ];
                this.setupParams(0, params);
                this.replaceStack(function(current) {
                    params.splice(1, 0, current);
                    return "blockHelperMissing.call(" + params.join(", ") + ")";
                });
            },
            // [ambiguousBlockValue]
            //
            // On stack, before: hash, inverse, program, value
            // Compiler value, before: lastHelper=value of last found helper, if any
            // On stack, after, if no lastHelper: same as [blockValue]
            // On stack, after, if lastHelper: value
            ambiguousBlockValue: function() {
                this.context.aliases.blockHelperMissing = "helpers.blockHelperMissing";
                var params = [ "depth0" ];
                this.setupParams(0, params);
                var current = this.topStack();
                params.splice(1, 0, current);
                // Use the options value generated from the invocation
                params[params.length - 1] = "options";
                this.source.push("if (!" + this.lastHelper + ") { " + current + " = blockHelperMissing.call(" + params.join(", ") + "); }");
            },
            // [appendContent]
            //
            // On stack, before: ...
            // On stack, after: ...
            //
            // Appends the string value of `content` to the current buffer
            appendContent: function(content) {
                this.source.push(this.appendToBuffer(this.quotedString(content)));
            },
            // [append]
            //
            // On stack, before: value, ...
            // On stack, after: ...
            //
            // Coerces `value` to a String and appends it to the current buffer.
            //
            // If `value` is truthy, or 0, it is coerced into a string and appended
            // Otherwise, the empty string is appended
            append: function() {
                // Force anything that is inlined onto the stack so we don't have duplication
                // when we examine local
                this.flushInline();
                var local = this.popStack();
                this.source.push("if(" + local + " || " + local + " === 0) { " + this.appendToBuffer(local) + " }");
                if (this.environment.isSimple) {
                    this.source.push("else { " + this.appendToBuffer("''") + " }");
                }
            },
            // [appendEscaped]
            //
            // On stack, before: value, ...
            // On stack, after: ...
            //
            // Escape `value` and append it to the buffer
            appendEscaped: function() {
                this.context.aliases.escapeExpression = "this.escapeExpression";
                this.source.push(this.appendToBuffer("escapeExpression(" + this.popStack() + ")"));
            },
            // [getContext]
            //
            // On stack, before: ...
            // On stack, after: ...
            // Compiler value, after: lastContext=depth
            //
            // Set the value of the `lastContext` compiler value to the depth
            getContext: function(depth) {
                if (this.lastContext !== depth) {
                    this.lastContext = depth;
                }
            },
            // [lookupOnContext]
            //
            // On stack, before: ...
            // On stack, after: currentContext[name], ...
            //
            // Looks up the value of `name` on the current context and pushes
            // it onto the stack.
            lookupOnContext: function(name) {
                this.push(this.nameLookup("depth" + this.lastContext, name, "context"));
            },
            // [pushContext]
            //
            // On stack, before: ...
            // On stack, after: currentContext, ...
            //
            // Pushes the value of the current context onto the stack.
            pushContext: function() {
                this.pushStackLiteral("depth" + this.lastContext);
            },
            // [resolvePossibleLambda]
            //
            // On stack, before: value, ...
            // On stack, after: resolved value, ...
            //
            // If the `value` is a lambda, replace it on the stack by
            // the return value of the lambda
            resolvePossibleLambda: function() {
                this.context.aliases.functionType = '"function"';
                this.replaceStack(function(current) {
                    return "typeof " + current + " === functionType ? " + current + ".apply(depth0) : " + current;
                });
            },
            // [lookup]
            //
            // On stack, before: value, ...
            // On stack, after: value[name], ...
            //
            // Replace the value on the stack with the result of looking
            // up `name` on `value`
            lookup: function(name) {
                this.replaceStack(function(current) {
                    return current + " == null || " + current + " === false ? " + current + " : " + this.nameLookup(current, name, "context");
                });
            },
            // [lookupData]
            //
            // On stack, before: ...
            // On stack, after: data[id], ...
            //
            // Push the result of looking up `id` on the current data
            lookupData: function(id) {
                this.push(this.nameLookup("data", id, "data"));
            },
            // [pushStringParam]
            //
            // On stack, before: ...
            // On stack, after: string, currentContext, ...
            //
            // This opcode is designed for use in string mode, which
            // provides the string value of a parameter along with its
            // depth rather than resolving it immediately.
            pushStringParam: function(string, type) {
                this.pushStackLiteral("depth" + this.lastContext);
                this.pushString(type);
                if (typeof string === "string") {
                    this.pushString(string);
                } else {
                    this.pushStackLiteral(string);
                }
            },
            emptyHash: function() {
                this.pushStackLiteral("{}");
                if (this.options.stringParams) {
                    this.register("hashTypes", "{}");
                    this.register("hashContexts", "{}");
                }
            },
            pushHash: function() {
                this.hash = {
                    values: [],
                    types: [],
                    contexts: []
                };
            },
            popHash: function() {
                var hash = this.hash;
                this.hash = undefined;
                if (this.options.stringParams) {
                    this.register("hashContexts", "{" + hash.contexts.join(",") + "}");
                    this.register("hashTypes", "{" + hash.types.join(",") + "}");
                }
                this.push("{\n    " + hash.values.join(",\n    ") + "\n  }");
            },
            // [pushString]
            //
            // On stack, before: ...
            // On stack, after: quotedString(string), ...
            //
            // Push a quoted version of `string` onto the stack
            pushString: function(string) {
                this.pushStackLiteral(this.quotedString(string));
            },
            // [push]
            //
            // On stack, before: ...
            // On stack, after: expr, ...
            //
            // Push an expression onto the stack
            push: function(expr) {
                this.inlineStack.push(expr);
                return expr;
            },
            // [pushLiteral]
            //
            // On stack, before: ...
            // On stack, after: value, ...
            //
            // Pushes a value onto the stack. This operation prevents
            // the compiler from creating a temporary variable to hold
            // it.
            pushLiteral: function(value) {
                this.pushStackLiteral(value);
            },
            // [pushProgram]
            //
            // On stack, before: ...
            // On stack, after: program(guid), ...
            //
            // Push a program expression onto the stack. This takes
            // a compile-time guid and converts it into a runtime-accessible
            // expression.
            pushProgram: function(guid) {
                if (guid != null) {
                    this.pushStackLiteral(this.programExpression(guid));
                } else {
                    this.pushStackLiteral(null);
                }
            },
            // [invokeHelper]
            //
            // On stack, before: hash, inverse, program, params..., ...
            // On stack, after: result of helper invocation
            //
            // Pops off the helper's parameters, invokes the helper,
            // and pushes the helper's return value onto the stack.
            //
            // If the helper is not found, `helperMissing` is called.
            invokeHelper: function(paramSize, name) {
                this.context.aliases.helperMissing = "helpers.helperMissing";
                var helper = this.lastHelper = this.setupHelper(paramSize, name, true);
                this.push(helper.name);
                this.replaceStack(function(name) {
                    return name + " ? " + name + ".call(" + helper.callParams + ") " + ": helperMissing.call(" + helper.helperMissingParams + ")";
                });
            },
            // [invokeKnownHelper]
            //
            // On stack, before: hash, inverse, program, params..., ...
            // On stack, after: result of helper invocation
            //
            // This operation is used when the helper is known to exist,
            // so a `helperMissing` fallback is not required.
            invokeKnownHelper: function(paramSize, name) {
                var helper = this.setupHelper(paramSize, name);
                this.push(helper.name + ".call(" + helper.callParams + ")");
            },
            // [invokeAmbiguous]
            //
            // On stack, before: hash, inverse, program, params..., ...
            // On stack, after: result of disambiguation
            //
            // This operation is used when an expression like `{{foo}}`
            // is provided, but we don't know at compile-time whether it
            // is a helper or a path.
            //
            // This operation emits more code than the other options,
            // and can be avoided by passing the `knownHelpers` and
            // `knownHelpersOnly` flags at compile-time.
            invokeAmbiguous: function(name, helperCall) {
                this.context.aliases.functionType = '"function"';
                this.pushStackLiteral("{}");
                // Hash value
                var helper = this.setupHelper(0, name, helperCall);
                var helperName = this.lastHelper = this.nameLookup("helpers", name, "helper");
                var nonHelper = this.nameLookup("depth" + this.lastContext, name, "context");
                var nextStack = this.nextStack();
                this.source.push("if (" + nextStack + " = " + helperName + ") { " + nextStack + " = " + nextStack + ".call(" + helper.callParams + "); }");
                this.source.push("else { " + nextStack + " = " + nonHelper + "; " + nextStack + " = typeof " + nextStack + " === functionType ? " + nextStack + ".apply(depth0) : " + nextStack + "; }");
            },
            // [invokePartial]
            //
            // On stack, before: context, ...
            // On stack after: result of partial invocation
            //
            // This operation pops off a context, invokes a partial with that context,
            // and pushes the result of the invocation back.
            invokePartial: function(name) {
                var params = [ this.nameLookup("partials", name, "partial"), "'" + name + "'", this.popStack(), "helpers", "partials" ];
                if (this.options.data) {
                    params.push("data");
                }
                this.context.aliases.self = "this";
                this.push("self.invokePartial(" + params.join(", ") + ")");
            },
            // [assignToHash]
            //
            // On stack, before: value, hash, ...
            // On stack, after: hash, ...
            //
            // Pops a value and hash off the stack, assigns `hash[key] = value`
            // and pushes the hash back onto the stack.
            assignToHash: function(key) {
                var value = this.popStack(), context, type;
                if (this.options.stringParams) {
                    type = this.popStack();
                    context = this.popStack();
                }
                var hash = this.hash;
                if (context) {
                    hash.contexts.push("'" + key + "': " + context);
                }
                if (type) {
                    hash.types.push("'" + key + "': " + type);
                }
                hash.values.push("'" + key + "': (" + value + ")");
            },
            // HELPERS
            compiler: JavaScriptCompiler,
            compileChildren: function(environment, options) {
                var children = environment.children, child, compiler;
                for (var i = 0, l = children.length; i < l; i++) {
                    child = children[i];
                    compiler = new this.compiler();
                    var index = this.matchExistingProgram(child);
                    if (index == null) {
                        this.context.programs.push("");
                        // Placeholder to prevent name conflicts for nested children
                        index = this.context.programs.length;
                        child.index = index;
                        child.name = "program" + index;
                        this.context.programs[index] = compiler.compile(child, options, this.context);
                        this.context.environments[index] = child;
                    } else {
                        child.index = index;
                        child.name = "program" + index;
                    }
                }
            },
            matchExistingProgram: function(child) {
                for (var i = 0, len = this.context.environments.length; i < len; i++) {
                    var environment = this.context.environments[i];
                    if (environment && environment.equals(child)) {
                        return i;
                    }
                }
            },
            programExpression: function(guid) {
                this.context.aliases.self = "this";
                if (guid == null) {
                    return "self.noop";
                }
                var child = this.environment.children[guid], depths = child.depths.list, depth;
                var programParams = [ child.index, child.name, "data" ];
                for (var i = 0, l = depths.length; i < l; i++) {
                    depth = depths[i];
                    if (depth === 1) {
                        programParams.push("depth0");
                    } else {
                        programParams.push("depth" + (depth - 1));
                    }
                }
                return (depths.length === 0 ? "self.program(" : "self.programWithDepth(") + programParams.join(", ") + ")";
            },
            register: function(name, val) {
                this.useRegister(name);
                this.source.push(name + " = " + val + ";");
            },
            useRegister: function(name) {
                if (!this.registers[name]) {
                    this.registers[name] = true;
                    this.registers.list.push(name);
                }
            },
            pushStackLiteral: function(item) {
                return this.push(new Literal(item));
            },
            pushStack: function(item) {
                this.flushInline();
                var stack = this.incrStack();
                if (item) {
                    this.source.push(stack + " = " + item + ";");
                }
                this.compileStack.push(stack);
                return stack;
            },
            replaceStack: function(callback) {
                var prefix = "", inline = this.isInline(), stack;
                // If we are currently inline then we want to merge the inline statement into the
                // replacement statement via ','
                if (inline) {
                    var top = this.popStack(true);
                    if (top instanceof Literal) {
                        // Literals do not need to be inlined
                        stack = top.value;
                    } else {
                        // Get or create the current stack name for use by the inline
                        var name = this.stackSlot ? this.topStackName() : this.incrStack();
                        prefix = "(" + this.push(name) + " = " + top + "),";
                        stack = this.topStack();
                    }
                } else {
                    stack = this.topStack();
                }
                var item = callback.call(this, stack);
                if (inline) {
                    if (this.inlineStack.length || this.compileStack.length) {
                        this.popStack();
                    }
                    this.push("(" + prefix + item + ")");
                } else {
                    // Prevent modification of the context depth variable. Through replaceStack
                    if (!/^stack/.test(stack)) {
                        stack = this.nextStack();
                    }
                    this.source.push(stack + " = (" + prefix + item + ");");
                }
                return stack;
            },
            nextStack: function() {
                return this.pushStack();
            },
            incrStack: function() {
                this.stackSlot++;
                if (this.stackSlot > this.stackVars.length) {
                    this.stackVars.push("stack" + this.stackSlot);
                }
                return this.topStackName();
            },
            topStackName: function() {
                return "stack" + this.stackSlot;
            },
            flushInline: function() {
                var inlineStack = this.inlineStack;
                if (inlineStack.length) {
                    this.inlineStack = [];
                    for (var i = 0, len = inlineStack.length; i < len; i++) {
                        var entry = inlineStack[i];
                        if (entry instanceof Literal) {
                            this.compileStack.push(entry);
                        } else {
                            this.pushStack(entry);
                        }
                    }
                }
            },
            isInline: function() {
                return this.inlineStack.length;
            },
            popStack: function(wrapped) {
                var inline = this.isInline(), item = (inline ? this.inlineStack : this.compileStack).pop();
                if (!wrapped && item instanceof Literal) {
                    return item.value;
                } else {
                    if (!inline) {
                        this.stackSlot--;
                    }
                    return item;
                }
            },
            topStack: function(wrapped) {
                var stack = this.isInline() ? this.inlineStack : this.compileStack, item = stack[stack.length - 1];
                if (!wrapped && item instanceof Literal) {
                    return item.value;
                } else {
                    return item;
                }
            },
            quotedString: function(str) {
                return '"' + str.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029") + '"';
            },
            setupHelper: function(paramSize, name, missingParams) {
                var params = [];
                this.setupParams(paramSize, params, missingParams);
                var foundHelper = this.nameLookup("helpers", name, "helper");
                return {
                    params: params,
                    name: foundHelper,
                    callParams: [ "depth0" ].concat(params).join(", "),
                    helperMissingParams: missingParams && [ "depth0", this.quotedString(name) ].concat(params).join(", ")
                };
            },
            // the params and contexts arguments are passed in arrays
            // to fill in
            setupParams: function(paramSize, params, useRegister) {
                var options = [], contexts = [], types = [], param, inverse, program;
                options.push("hash:" + this.popStack());
                inverse = this.popStack();
                program = this.popStack();
                // Avoid setting fn and inverse if neither are set. This allows
                // helpers to do a check for `if (options.fn)`
                if (program || inverse) {
                    if (!program) {
                        this.context.aliases.self = "this";
                        program = "self.noop";
                    }
                    if (!inverse) {
                        this.context.aliases.self = "this";
                        inverse = "self.noop";
                    }
                    options.push("inverse:" + inverse);
                    options.push("fn:" + program);
                }
                for (var i = 0; i < paramSize; i++) {
                    param = this.popStack();
                    params.push(param);
                    if (this.options.stringParams) {
                        types.push(this.popStack());
                        contexts.push(this.popStack());
                    }
                }
                if (this.options.stringParams) {
                    options.push("contexts:[" + contexts.join(",") + "]");
                    options.push("types:[" + types.join(",") + "]");
                    options.push("hashContexts:hashContexts");
                    options.push("hashTypes:hashTypes");
                }
                if (this.options.data) {
                    options.push("data:data");
                }
                options = "{" + options.join(",") + "}";
                if (useRegister) {
                    this.register("options", options);
                    params.push("options");
                } else {
                    params.push(options);
                }
                return params.join(", ");
            }
        };
        var reservedWords = ("break else new var" + " case finally return void" + " catch for switch while" + " continue function this with" + " default if throw" + " delete in try" + " do instanceof typeof" + " abstract enum int short" + " boolean export interface static" + " byte extends long super" + " char final native synchronized" + " class float package throws" + " const goto private transient" + " debugger implements protected volatile" + " double import public let yield").split(" ");
        var compilerWords = JavaScriptCompiler.RESERVED_WORDS = {};
        for (var i = 0, l = reservedWords.length; i < l; i++) {
            compilerWords[reservedWords[i]] = true;
        }
        JavaScriptCompiler.isValidJavaScriptVariableName = function(name) {
            if (!JavaScriptCompiler.RESERVED_WORDS[name] && /^[a-zA-Z_$][0-9a-zA-Z_$]+$/.test(name)) {
                return true;
            }
            return false;
        };
        Handlebars.precompile = function(input, options) {
            if (input == null || typeof input !== "string" && input.constructor !== Handlebars.AST.ProgramNode) {
                throw new Handlebars.Exception("You must pass a string or Handlebars AST to Handlebars.precompile. You passed " + input);
            }
            options = options || {};
            if (!("data" in options)) {
                options.data = true;
            }
            var ast = Handlebars.parse(input);
            var environment = new Compiler().compile(ast, options);
            return new JavaScriptCompiler().compile(environment, options);
        };
        Handlebars.compile = function(input, options) {
            if (input == null || typeof input !== "string" && input.constructor !== Handlebars.AST.ProgramNode) {
                throw new Handlebars.Exception("You must pass a string or Handlebars AST to Handlebars.compile. You passed " + input);
            }
            options = options || {};
            if (!("data" in options)) {
                options.data = true;
            }
            var compiled;
            function compile() {
                var ast = Handlebars.parse(input);
                var environment = new Compiler().compile(ast, options);
                var templateSpec = new JavaScriptCompiler().compile(environment, options, undefined, true);
                return Handlebars.template(templateSpec);
            }
            // Template is only compiled on first use and cached after that point.
            return function(context, options) {
                if (!compiled) {
                    compiled = compile();
                }
                return compiled.call(this, context, options);
            };
        };
        // lib/handlebars/runtime.js
        Handlebars.VM = {
            template: function(templateSpec) {
                // Just add water
                var container = {
                    escapeExpression: Handlebars.Utils.escapeExpression,
                    invokePartial: Handlebars.VM.invokePartial,
                    programs: [],
                    program: function(i, fn, data) {
                        var programWrapper = this.programs[i];
                        if (data) {
                            programWrapper = Handlebars.VM.program(i, fn, data);
                        } else if (!programWrapper) {
                            programWrapper = this.programs[i] = Handlebars.VM.program(i, fn);
                        }
                        return programWrapper;
                    },
                    programWithDepth: Handlebars.VM.programWithDepth,
                    noop: Handlebars.VM.noop,
                    compilerInfo: null
                };
                return function(context, options) {
                    options = options || {};
                    var result = templateSpec.call(container, Handlebars, context, options.helpers, options.partials, options.data);
                    var compilerInfo = container.compilerInfo || [], compilerRevision = compilerInfo[0] || 1, currentRevision = Handlebars.COMPILER_REVISION;
                    if (compilerRevision !== currentRevision) {
                        if (compilerRevision < currentRevision) {
                            var runtimeVersions = Handlebars.REVISION_CHANGES[currentRevision], compilerVersions = Handlebars.REVISION_CHANGES[compilerRevision];
                            throw "Template was precompiled with an older version of Handlebars than the current runtime. " + "Please update your precompiler to a newer version (" + runtimeVersions + ") or downgrade your runtime to an older version (" + compilerVersions + ").";
                        } else {
                            // Use the embedded version info since the runtime doesn't know about this revision yet
                            throw "Template was precompiled with a newer version of Handlebars than the current runtime. " + "Please update your runtime to a newer version (" + compilerInfo[1] + ").";
                        }
                    }
                    return result;
                };
            },
            programWithDepth: function(i, fn, data) {
                var args = Array.prototype.slice.call(arguments, 3);
                var program = function(context, options) {
                    options = options || {};
                    return fn.apply(this, [ context, options.data || data ].concat(args));
                };
                program.program = i;
                program.depth = args.length;
                return program;
            },
            program: function(i, fn, data) {
                var program = function(context, options) {
                    options = options || {};
                    return fn(context, options.data || data);
                };
                program.program = i;
                program.depth = 0;
                return program;
            },
            noop: function() {
                return "";
            },
            invokePartial: function(partial, name, context, helpers, partials, data) {
                var options = {
                    helpers: helpers,
                    partials: partials,
                    data: data
                };
                if (partial === undefined) {
                    throw new Handlebars.Exception("The partial " + name + " could not be found");
                } else if (partial instanceof Function) {
                    return partial(context, options);
                } else if (!Handlebars.compile) {
                    throw new Handlebars.Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
                } else {
                    partials[name] = Handlebars.compile(partial, {
                        data: data !== undefined
                    });
                    return partials[name](context, options);
                }
            }
        };
        Handlebars.template = Handlebars.VM.template;
    })(Handlebars);
    module.exports = Handlebars;
});

define("gallery/handlebars/1.0.2/runtime-debug", [], function(require, exports, module) {
    /*

Copyright (C) 2011 by Yehuda Katz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
    // lib/handlebars/browser-prefix.js
    var Handlebars = {};
    (function(Handlebars, undefined) {
        // lib/handlebars/base.js
        Handlebars.VERSION = "1.0.0-rc.4";
        Handlebars.COMPILER_REVISION = 3;
        Handlebars.REVISION_CHANGES = {
            1: "<= 1.0.rc.2",
            // 1.0.rc.2 is actually rev2 but doesn't report it
            2: "== 1.0.0-rc.3",
            3: ">= 1.0.0-rc.4"
        };
        Handlebars.helpers = {};
        Handlebars.partials = {};
        var toString = Object.prototype.toString, functionType = "[object Function]", objectType = "[object Object]";
        Handlebars.registerHelper = function(name, fn, inverse) {
            if (toString.call(name) === objectType) {
                if (inverse || fn) {
                    throw new Handlebars.Exception("Arg not supported with multiple helpers");
                }
                Handlebars.Utils.extend(this.helpers, name);
            } else {
                if (inverse) {
                    fn.not = inverse;
                }
                this.helpers[name] = fn;
            }
        };
        Handlebars.registerPartial = function(name, str) {
            if (toString.call(name) === objectType) {
                Handlebars.Utils.extend(this.partials, name);
            } else {
                this.partials[name] = str;
            }
        };
        Handlebars.registerHelper("helperMissing", function(arg) {
            if (arguments.length === 2) {
                return undefined;
            } else {
                throw new Error("Could not find property '" + arg + "'");
            }
        });
        Handlebars.registerHelper("blockHelperMissing", function(context, options) {
            var inverse = options.inverse || function() {}, fn = options.fn;
            var type = toString.call(context);
            if (type === functionType) {
                context = context.call(this);
            }
            if (context === true) {
                return fn(this);
            } else if (context === false || context == null) {
                return inverse(this);
            } else if (type === "[object Array]") {
                if (context.length > 0) {
                    return Handlebars.helpers.each(context, options);
                } else {
                    return inverse(this);
                }
            } else {
                return fn(context);
            }
        });
        Handlebars.K = function() {};
        Handlebars.createFrame = Object.create || function(object) {
            Handlebars.K.prototype = object;
            var obj = new Handlebars.K();
            Handlebars.K.prototype = null;
            return obj;
        };
        Handlebars.logger = {
            DEBUG: 0,
            INFO: 1,
            WARN: 2,
            ERROR: 3,
            level: 3,
            methodMap: {
                0: "debug",
                1: "info",
                2: "warn",
                3: "error"
            },
            // can be overridden in the host environment
            log: function(level, obj) {
                if (Handlebars.logger.level <= level) {
                    var method = Handlebars.logger.methodMap[level];
                    if (typeof console !== "undefined" && console[method]) {
                        console[method].call(console, obj);
                    }
                }
            }
        };
        Handlebars.log = function(level, obj) {
            Handlebars.logger.log(level, obj);
        };
        Handlebars.registerHelper("each", function(context, options) {
            var fn = options.fn, inverse = options.inverse;
            var i = 0, ret = "", data;
            if (options.data) {
                data = Handlebars.createFrame(options.data);
            }
            if (context && typeof context === "object") {
                if (context instanceof Array) {
                    for (var j = context.length; i < j; i++) {
                        if (data) {
                            data.index = i;
                        }
                        ret = ret + fn(context[i], {
                            data: data
                        });
                    }
                } else {
                    for (var key in context) {
                        if (context.hasOwnProperty(key)) {
                            if (data) {
                                data.key = key;
                            }
                            ret = ret + fn(context[key], {
                                data: data
                            });
                            i++;
                        }
                    }
                }
            }
            if (i === 0) {
                ret = inverse(this);
            }
            return ret;
        });
        Handlebars.registerHelper("if", function(context, options) {
            var type = toString.call(context);
            if (type === functionType) {
                context = context.call(this);
            }
            if (!context || Handlebars.Utils.isEmpty(context)) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        });
        Handlebars.registerHelper("unless", function(context, options) {
            return Handlebars.helpers["if"].call(this, context, {
                fn: options.inverse,
                inverse: options.fn
            });
        });
        Handlebars.registerHelper("with", function(context, options) {
            if (!Handlebars.Utils.isEmpty(context)) return options.fn(context);
        });
        Handlebars.registerHelper("log", function(context, options) {
            var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
            Handlebars.log(level, context);
        });
        // lib/handlebars/utils.js
        var errorProps = [ "description", "fileName", "lineNumber", "message", "name", "number", "stack" ];
        Handlebars.Exception = function(message) {
            var tmp = Error.prototype.constructor.apply(this, arguments);
            // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
            for (var idx = 0; idx < errorProps.length; idx++) {
                this[errorProps[idx]] = tmp[errorProps[idx]];
            }
        };
        Handlebars.Exception.prototype = new Error();
        // Build out our basic SafeString type
        Handlebars.SafeString = function(string) {
            this.string = string;
        };
        Handlebars.SafeString.prototype.toString = function() {
            return this.string.toString();
        };
        var escape = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#x27;",
            "`": "&#x60;"
        };
        var badChars = /[&<>"'`]/g;
        var possible = /[&<>"'`]/;
        var escapeChar = function(chr) {
            return escape[chr] || "&amp;";
        };
        Handlebars.Utils = {
            extend: function(obj, value) {
                for (var key in value) {
                    if (value.hasOwnProperty(key)) {
                        obj[key] = value[key];
                    }
                }
            },
            escapeExpression: function(string) {
                // don't escape SafeStrings, since they're already safe
                if (string instanceof Handlebars.SafeString) {
                    return string.toString();
                } else if (string == null || string === false) {
                    return "";
                }
                // Force a string conversion as this will be done by the append regardless and
                // the regex test will do this transparently behind the scenes, causing issues if
                // an object's to string has escaped characters in it.
                string = string.toString();
                if (!possible.test(string)) {
                    return string;
                }
                return string.replace(badChars, escapeChar);
            },
            isEmpty: function(value) {
                if (!value && value !== 0) {
                    return true;
                } else if (toString.call(value) === "[object Array]" && value.length === 0) {
                    return true;
                } else {
                    return false;
                }
            }
        };
        // lib/handlebars/runtime.js
        Handlebars.VM = {
            template: function(templateSpec) {
                // Just add water
                var container = {
                    escapeExpression: Handlebars.Utils.escapeExpression,
                    invokePartial: Handlebars.VM.invokePartial,
                    programs: [],
                    program: function(i, fn, data) {
                        var programWrapper = this.programs[i];
                        if (data) {
                            programWrapper = Handlebars.VM.program(i, fn, data);
                        } else if (!programWrapper) {
                            programWrapper = this.programs[i] = Handlebars.VM.program(i, fn);
                        }
                        return programWrapper;
                    },
                    programWithDepth: Handlebars.VM.programWithDepth,
                    noop: Handlebars.VM.noop,
                    compilerInfo: null
                };
                return function(context, options) {
                    options = options || {};
                    var result = templateSpec.call(container, Handlebars, context, options.helpers, options.partials, options.data);
                    var compilerInfo = container.compilerInfo || [], compilerRevision = compilerInfo[0] || 1, currentRevision = Handlebars.COMPILER_REVISION;
                    if (compilerRevision !== currentRevision) {
                        if (compilerRevision < currentRevision) {
                            var runtimeVersions = Handlebars.REVISION_CHANGES[currentRevision], compilerVersions = Handlebars.REVISION_CHANGES[compilerRevision];
                            throw "Template was precompiled with an older version of Handlebars than the current runtime. " + "Please update your precompiler to a newer version (" + runtimeVersions + ") or downgrade your runtime to an older version (" + compilerVersions + ").";
                        } else {
                            // Use the embedded version info since the runtime doesn't know about this revision yet
                            throw "Template was precompiled with a newer version of Handlebars than the current runtime. " + "Please update your runtime to a newer version (" + compilerInfo[1] + ").";
                        }
                    }
                    return result;
                };
            },
            programWithDepth: function(i, fn, data) {
                var args = Array.prototype.slice.call(arguments, 3);
                var program = function(context, options) {
                    options = options || {};
                    return fn.apply(this, [ context, options.data || data ].concat(args));
                };
                program.program = i;
                program.depth = args.length;
                return program;
            },
            program: function(i, fn, data) {
                var program = function(context, options) {
                    options = options || {};
                    return fn(context, options.data || data);
                };
                program.program = i;
                program.depth = 0;
                return program;
            },
            noop: function() {
                return "";
            },
            invokePartial: function(partial, name, context, helpers, partials, data) {
                var options = {
                    helpers: helpers,
                    partials: partials,
                    data: data
                };
                if (partial === undefined) {
                    throw new Handlebars.Exception("The partial " + name + " could not be found");
                } else if (partial instanceof Function) {
                    return partial(context, options);
                } else if (!Handlebars.compile) {
                    throw new Handlebars.Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
                } else {
                    partials[name] = Handlebars.compile(partial, {
                        data: data !== undefined
                    });
                    return partials[name](context, options);
                }
            }
        };
        Handlebars.template = Handlebars.VM.template;
    })(Handlebars);
    module.exports = Handlebars;
});

define("app/common/dialog/confirmbox-debug.handlebars", [ "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.0.2/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 3, ">= 1.0.0-rc.4" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        var buffer = "", stack1, functionType = "function", escapeExpression = this.escapeExpression, self = this;
        function program1(depth0, data) {
            var buffer = "", stack1;
            buffer += '\n<div class="';
            if (stack1 = helpers.classPrefix) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.classPrefix;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '-title" data-role="title">';
            if (stack1 = helpers.title) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.title;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "</div>\n";
            return buffer;
        }
        function program3(depth0, data) {
            var buffer = "", stack1;
            if (stack1 = helpers.classPrefix) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.classPrefix;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + "-padding";
            return buffer;
        }
        function program5(depth0, data) {
            var buffer = "", stack1;
            buffer += '\n    <div class="';
            if (stack1 = helpers.classPrefix) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.classPrefix;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '-operation" data-role="foot">\n        ';
            stack1 = helpers["if"].call(depth0, depth0.confirmTpl, {
                hash: {},
                inverse: self.noop,
                fn: self.program(6, program6, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "\n        ";
            stack1 = helpers["if"].call(depth0, depth0.cancelTpl, {
                hash: {},
                inverse: self.noop,
                fn: self.program(8, program8, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "\n    </div>\n    ";
            return buffer;
        }
        function program6(depth0, data) {
            var buffer = "", stack1;
            buffer += '\n        <div class="';
            if (stack1 = helpers.classPrefix) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.classPrefix;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '-confirm" data-role="confirm">\n            ';
            if (stack1 = helpers.confirmTpl) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.confirmTpl;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "\n        </div>\n        ";
            return buffer;
        }
        function program8(depth0, data) {
            var buffer = "", stack1;
            buffer += '\n        <div class="';
            if (stack1 = helpers.classPrefix) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.classPrefix;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '-cancel" data-role="cancel">\n            ';
            if (stack1 = helpers.cancelTpl) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.cancelTpl;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "\n        </div>\n        ";
            return buffer;
        }
        stack1 = helpers["if"].call(depth0, depth0.title, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += '\n<div class="';
        if (stack1 = helpers.classPrefix) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.classPrefix;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + '-container">\n    <div class="';
        if (stack1 = helpers.classPrefix) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.classPrefix;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + "-message ";
        stack1 = helpers["if"].call(depth0, depth0.hasPadding, {
            hash: {},
            inverse: self.noop,
            fn: self.program(3, program3, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += '" data-role="message">\n        ';
        if (stack1 = helpers.message) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.message;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "\n    </div>\n    ";
        stack1 = helpers["if"].call(depth0, depth0.hasFoot, {
            hash: {},
            inverse: self.noop,
            fn: self.program(5, program5, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "\n</div>";
        return buffer;
    });
});

define("app/common/dialog/confirmbox-debug.css", [], function() {
    seajs.importStyle(".ermp-dialog{border:0;outline:0}.ermp-dialog-content{background:#fff;-webkit-border-radius:6px;-moz-border-radius:6px;border-radius:6px}:root .ermp-dialog{FILTER:none\\9}.ermp-dialog-close{position:absolute;top:-14px;right:-14px;font-size:21px;line-height:1;font-weight:400;font-family:Arial;background:#212121;color:#fff;padding:4px 8px;margin-top:0;opacity:1;filter:none;-webkit-border-radius:28px;-moz-border-radius:28px;border-radius:28px}.ermp-dialog-close:hover{background:#e22;color:#fff;text-decoration:none}.ermp-dialog-title{height:45px;font-size:16px;font-family:'微软雅黑','黑体',Arial;line-height:46px;border-bottom:1px solid #E1E1E1;color:#4d4d4d;text-indent:20px;background-color:#f9f9f9;background:-webkit-gradient(linear,left top,left bottom,from(#fcfcfc),to(#f9f9f9));background:-moz-linear-gradient(top,#fcfcfc,#f9f9f9);filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#fcfcfc', endColorstr='#f9f9f9');background:-o-linear-gradient(top,#fcfcfc,#f9f9f9);background:-ms-linear-gradient(top,#fcfcfc,#f9f9f9);background:linear-gradient(top,#fcfcfc,#f9f9f9)}.ermp-dialog-operation{text-align:center;zoom:1;padding-bottom:20px}.ermp-dialog-confirm,.ermp-dialog-cancel{display:inline}.ermp-dialog-operation .ermp-dialog-confirm{margin-right:4px}.ermp-dialog-padding{padding:20px}.ermp-dialog .checkbox-list{padding-top:9px}.ermp-confirm .ermp-dialog-message{font-size:16px;font-weight:700;text-align:center}.ermp-confirm .ermp-dialog-close{visibility:hidden}.ermp-show .ermp-dialog-message{text-align:center}.ermp-dialog .ermp-dialog-operation .btn2{border:1px solid #aeb6c5;color:#333;background:url(http://ue2.17173cdn.com/a/ermp/index/2014/images/b2.png) 0 -119px repeat-x;padding:6px 45px}.ermp-dialog .ermp-dialog-operation .btn2:hover,.btn2:active,.btn2:focus{background:url(http://ue2.17173cdn.com/a/ermp/index/2014/images/b2.png) 0 -154px repeat-x;text-decoration:none}.ermp-dialog .ermp-dialog-operation .btn-s{padding:6px 30px}");
});

define("app/common/io-debug", [ "$-debug", "app/common/util-debug", "app/common/config-debug", "app/common/dialog/confirmbox-debug", "arale/dialog/1.3.0/dialog-debug", "arale/overlay/1.1.4/overlay-debug", "arale/position/1.0.1/position-debug", "arale/iframe-shim/1.0.2/iframe-shim-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "arale/overlay/1.1.4/mask-debug", "arale/templatable/0.9.2/templatable-debug", "gallery/handlebars/1.0.2/handlebars-debug", "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
    "use strict";
    var $ = require("$-debug"), util = require("app/common/util-debug"), ConfirmBox = require("app/common/dialog/confirmbox-debug"), io = {};
    // helper
    var isArray = Array.isArray || isType("Array");
    function isType(type) {
        return function(obj) {
            return Object.prototype.toString.call(obj) === "[object " + type + "]";
        };
    }
    io.processor = function(json, callback) {
        var msg, success, error, input;
        //全局异常处理(login|error)
        /*if ( json.result == 'login' ) {
		        //登录页跳转
		        window.location.href = io.$cfg('page_login');
		    }*/
        if (json.result == "error") {
            //异常提示
            console.error(json.messages);
            return;
        }
        /**
		 * 业务相关回调,参数中包含业务的成功失败消息
		 * 1. success(message)|failure(message)
		 *
		 * 表单验证
		 * 2. input(fieldErrors)
		 */
        if ($.inArray(json.result, [ "success", "failure" ]) != -1) {
            msg = json.messages;
            if (isArray(msg)) {
                msg = msg.join("<br/>").replace("\n", "<br/>");
            }
            success = callback["success"] || callback;
            error = callback["error"] || function(msg) {
                util.showMessage(msg);
            };
            json.result == "success" ? success.call(json, msg) : error.call(json, msg);
        } else if (json.result == "input") {
            if (!$.isEmptyObject(json["fieldErrors"])) {
                $.each(json["fieldErrors"], function(field, v) {
                    msg = v.shift && v.shift() || v;
                    input = callback["input"];
                    input && input[field] && input[field].call(json, msg);
                });
            } else {
                msg = json.messages.shift() || json.messages;
                callback["input"] ? callback["input"].call(json, msg) : console.log(msg);
            }
        }
    };
    io.post = function(url, data, callback) {
        if (typeof callback == "undefined") {
            callback = data;
            data = {};
        }
        var cfg = {
            url: url,
            data: data,
            callback: callback,
            type: "post"
        };
        io.ajax(cfg);
    };
    io.syncPost = function(url, data, callback) {
        if (typeof callback == "undefined") {
            callback = data;
            data = {};
        }
        var cfg = {
            async: false,
            url: url,
            data: data,
            callback: callback,
            type: "post"
        };
        io.ajax(cfg);
    };
    io.get = function(url, data, callback) {
        if (typeof callback == "undefined") {
            callback = data;
            data = {};
        }
        var cfg = {
            url: url,
            data: data,
            callback: callback,
            type: "get"
        };
        io.ajax(cfg);
    };
    io.syncGet = function(url, data, callback) {
        if (typeof callback == "undefined") {
            callback = data;
            data = {};
        }
        var cfg = {
            async: false,
            url: url,
            data: data,
            callback: callback,
            type: "get"
        };
        io.ajax(cfg);
    };
    io.ajax = function(cfg) {
        var async = typeof cfg.async == "undefined" ? true : false;
        $.ajax({
            async: async,
            cache: false,
            url: cfg.url,
            dataType: "json",
            traditional: true,
            type: cfg.type,
            data: cfg.data,
            success: function(d) {
                //callback(d);
                d && io.processor(d, cfg.callback);
            },
            error: function() {
                console.warn("server error: " + cfg.url);
            }
        });
    };
    return io;
});

define("app/common/helpers-debug", [ "gallery/moment/2.0.0/moment-debug" ], function(require) {
    var moment = require("gallery/moment/2.0.0/moment-debug");
    return {
        fdate: function(val) {
            var ret = "";
            if (val) {
                ret = moment(val).format("YYYY-MM-DD HH:mm");
            }
            return ret;
        },
        fExactDate: function(val) {
            var ret = "";
            if (val) {
                ret = moment(val).format("YYYY-MM-DD HH:mm:ss.SSS");
            }
            return ret;
        },
        judge: function(a, b, options) {
            if (a === b) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        },
        contrast: function(a, b, options) {
            if (a > b) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        },
        getImage: function(val) {
            return attachmentCtx + val;
        },
        urlResolve: function(val) {
            return val.replace(/\[url\]\s*(((?!")[\s\S])*?)(?:"[\s\S]*?)?\s*\[\/url\]/gi, '<a href="$1" target="_blank">$1</a>').replace(/\[url\s*=\s*([^\]"]+?)(?:"[^\]]*?)?\s*\]\s*([\s\S]*?)\s*\[\/url\]/gi, '<a href="$1" target="_blank">$2</a>');
        }
    };
});

// moment.js
// version : 2.0.0
// author : Tim Wood
// license : MIT
// momentjs.com
define("gallery/moment/2.0.0/moment-debug", [], function(require, exports, module) {
    /************************************
        Constants
    ************************************/
    var moment, VERSION = "2.0.0", round = Math.round, i, // internal storage for language config files
    languages = {}, // check for nodeJS
    hasModule = typeof module !== "undefined" && module.exports, // ASP.NET json date format regex
    aspNetJsonRegex = /^\/?Date\((\-?\d+)/i, // format tokens
    formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYY|YYYY|YY|a|A|hh?|HH?|mm?|ss?|SS?S?|X|zz?|ZZ?|.)/g, localFormattingTokens = /(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g, // parsing tokens
    parseMultipleFormatChunker = /([0-9a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)/gi, // parsing token regexes
    parseTokenOneOrTwoDigits = /\d\d?/, // 0 - 99
    parseTokenOneToThreeDigits = /\d{1,3}/, // 0 - 999
    parseTokenThreeDigits = /\d{3}/, // 000 - 999
    parseTokenFourDigits = /\d{1,4}/, // 0 - 9999
    parseTokenSixDigits = /[+\-]?\d{1,6}/, // -999,999 - 999,999
    parseTokenWord = /[0-9]*[a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF]+\s*?[\u0600-\u06FF]+/i, // any word (or two) characters or numbers including two word month in arabic.
    parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/i, // +00:00 -00:00 +0000 -0000 or Z
    parseTokenT = /T/i, // T (ISO seperator)
    parseTokenTimestampMs = /[\+\-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123
    // preliminary iso regex
    // 0000-00-00 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000
    isoRegex = /^\s*\d{4}-\d\d-\d\d((T| )(\d\d(:\d\d(:\d\d(\.\d\d?\d?)?)?)?)?([\+\-]\d\d:?\d\d)?)?/, isoFormat = "YYYY-MM-DDTHH:mm:ssZ", // iso time formats and regexes
    isoTimes = [ [ "HH:mm:ss.S", /(T| )\d\d:\d\d:\d\d\.\d{1,3}/ ], [ "HH:mm:ss", /(T| )\d\d:\d\d:\d\d/ ], [ "HH:mm", /(T| )\d\d:\d\d/ ], [ "HH", /(T| )\d\d/ ] ], // timezone chunker "+10:00" > ["10", "00"] or "-1530" > ["-15", "30"]
    parseTimezoneChunker = /([\+\-]|\d\d)/gi, // getter and setter names
    proxyGettersAndSetters = "Month|Date|Hours|Minutes|Seconds|Milliseconds".split("|"), unitMillisecondFactors = {
        Milliseconds: 1,
        Seconds: 1e3,
        Minutes: 6e4,
        Hours: 36e5,
        Days: 864e5,
        Months: 2592e6,
        Years: 31536e6
    }, // format function strings
    formatFunctions = {}, // tokens to ordinalize and pad
    ordinalizeTokens = "DDD w W M D d".split(" "), paddedTokens = "M D H h m s w W".split(" "), formatTokenFunctions = {
        M: function() {
            return this.month() + 1;
        },
        MMM: function(format) {
            return this.lang().monthsShort(this, format);
        },
        MMMM: function(format) {
            return this.lang().months(this, format);
        },
        D: function() {
            return this.date();
        },
        DDD: function() {
            return this.dayOfYear();
        },
        d: function() {
            return this.day();
        },
        dd: function(format) {
            return this.lang().weekdaysMin(this, format);
        },
        ddd: function(format) {
            return this.lang().weekdaysShort(this, format);
        },
        dddd: function(format) {
            return this.lang().weekdays(this, format);
        },
        w: function() {
            return this.week();
        },
        W: function() {
            return this.isoWeek();
        },
        YY: function() {
            return leftZeroFill(this.year() % 100, 2);
        },
        YYYY: function() {
            return leftZeroFill(this.year(), 4);
        },
        YYYYY: function() {
            return leftZeroFill(this.year(), 5);
        },
        a: function() {
            return this.lang().meridiem(this.hours(), this.minutes(), true);
        },
        A: function() {
            return this.lang().meridiem(this.hours(), this.minutes(), false);
        },
        H: function() {
            return this.hours();
        },
        h: function() {
            return this.hours() % 12 || 12;
        },
        m: function() {
            return this.minutes();
        },
        s: function() {
            return this.seconds();
        },
        S: function() {
            return ~~(this.milliseconds() / 100);
        },
        SS: function() {
            return leftZeroFill(~~(this.milliseconds() / 10), 2);
        },
        SSS: function() {
            return leftZeroFill(this.milliseconds(), 3);
        },
        Z: function() {
            var a = -this.zone(), b = "+";
            if (a < 0) {
                a = -a;
                b = "-";
            }
            return b + leftZeroFill(~~(a / 60), 2) + ":" + leftZeroFill(~~a % 60, 2);
        },
        ZZ: function() {
            var a = -this.zone(), b = "+";
            if (a < 0) {
                a = -a;
                b = "-";
            }
            return b + leftZeroFill(~~(10 * a / 6), 4);
        },
        X: function() {
            return this.unix();
        }
    };
    function padToken(func, count) {
        return function(a) {
            return leftZeroFill(func.call(this, a), count);
        };
    }
    function ordinalizeToken(func) {
        return function(a) {
            return this.lang().ordinal(func.call(this, a));
        };
    }
    while (ordinalizeTokens.length) {
        i = ordinalizeTokens.pop();
        formatTokenFunctions[i + "o"] = ordinalizeToken(formatTokenFunctions[i]);
    }
    while (paddedTokens.length) {
        i = paddedTokens.pop();
        formatTokenFunctions[i + i] = padToken(formatTokenFunctions[i], 2);
    }
    formatTokenFunctions.DDDD = padToken(formatTokenFunctions.DDD, 3);
    /************************************
        Constructors
    ************************************/
    function Language() {}
    // Moment prototype object
    function Moment(config) {
        extend(this, config);
    }
    // Duration Constructor
    function Duration(duration) {
        var data = this._data = {}, years = duration.years || duration.year || duration.y || 0, months = duration.months || duration.month || duration.M || 0, weeks = duration.weeks || duration.week || duration.w || 0, days = duration.days || duration.day || duration.d || 0, hours = duration.hours || duration.hour || duration.h || 0, minutes = duration.minutes || duration.minute || duration.m || 0, seconds = duration.seconds || duration.second || duration.s || 0, milliseconds = duration.milliseconds || duration.millisecond || duration.ms || 0;
        // representation for dateAddRemove
        this._milliseconds = milliseconds + seconds * 1e3 + // 1000
        minutes * 6e4 + // 1000 * 60
        hours * 36e5;
        // 1000 * 60 * 60
        // Because of dateAddRemove treats 24 hours as different from a
        // day when working around DST, we need to store them separately
        this._days = days + weeks * 7;
        // It is impossible translate months into days without knowing
        // which months you are are talking about, so we have to store
        // it separately.
        this._months = months + years * 12;
        // The following code bubbles up values, see the tests for
        // examples of what that means.
        data.milliseconds = milliseconds % 1e3;
        seconds += absRound(milliseconds / 1e3);
        data.seconds = seconds % 60;
        minutes += absRound(seconds / 60);
        data.minutes = minutes % 60;
        hours += absRound(minutes / 60);
        data.hours = hours % 24;
        days += absRound(hours / 24);
        days += weeks * 7;
        data.days = days % 30;
        months += absRound(days / 30);
        data.months = months % 12;
        years += absRound(months / 12);
        data.years = years;
    }
    /************************************
        Helpers
    ************************************/
    function extend(a, b) {
        for (var i in b) {
            if (b.hasOwnProperty(i)) {
                a[i] = b[i];
            }
        }
        return a;
    }
    function absRound(number) {
        if (number < 0) {
            return Math.ceil(number);
        } else {
            return Math.floor(number);
        }
    }
    // left zero fill a number
    // see http://jsperf.com/left-zero-filling for performance comparison
    function leftZeroFill(number, targetLength) {
        var output = number + "";
        while (output.length < targetLength) {
            output = "0" + output;
        }
        return output;
    }
    // helper function for _.addTime and _.subtractTime
    function addOrSubtractDurationFromMoment(mom, duration, isAdding) {
        var ms = duration._milliseconds, d = duration._days, M = duration._months, currentDate;
        if (ms) {
            mom._d.setTime(+mom + ms * isAdding);
        }
        if (d) {
            mom.date(mom.date() + d * isAdding);
        }
        if (M) {
            currentDate = mom.date();
            mom.date(1).month(mom.month() + M * isAdding).date(Math.min(currentDate, mom.daysInMonth()));
        }
    }
    // check if is an array
    function isArray(input) {
        return Object.prototype.toString.call(input) === "[object Array]";
    }
    // compare two arrays, return the number of differences
    function compareArrays(array1, array2) {
        var len = Math.min(array1.length, array2.length), lengthDiff = Math.abs(array1.length - array2.length), diffs = 0, i;
        for (i = 0; i < len; i++) {
            if (~~array1[i] !== ~~array2[i]) {
                diffs++;
            }
        }
        return diffs + lengthDiff;
    }
    /************************************
        Languages
    ************************************/
    Language.prototype = {
        set: function(config) {
            var prop, i;
            for (i in config) {
                prop = config[i];
                if (typeof prop === "function") {
                    this[i] = prop;
                } else {
                    this["_" + i] = prop;
                }
            }
        },
        _months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
        months: function(m) {
            return this._months[m.month()];
        },
        _monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
        monthsShort: function(m) {
            return this._monthsShort[m.month()];
        },
        monthsParse: function(monthName) {
            var i, mom, regex, output;
            if (!this._monthsParse) {
                this._monthsParse = [];
            }
            for (i = 0; i < 12; i++) {
                // make the regex if we don't have it already
                if (!this._monthsParse[i]) {
                    mom = moment([ 2e3, i ]);
                    regex = "^" + this.months(mom, "") + "|^" + this.monthsShort(mom, "");
                    this._monthsParse[i] = new RegExp(regex.replace(".", ""), "i");
                }
                // test the regex
                if (this._monthsParse[i].test(monthName)) {
                    return i;
                }
            }
        },
        _weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
        weekdays: function(m) {
            return this._weekdays[m.day()];
        },
        _weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
        weekdaysShort: function(m) {
            return this._weekdaysShort[m.day()];
        },
        _weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
        weekdaysMin: function(m) {
            return this._weekdaysMin[m.day()];
        },
        _longDateFormat: {
            LT: "h:mm A",
            L: "MM/DD/YYYY",
            LL: "MMMM D YYYY",
            LLL: "MMMM D YYYY LT",
            LLLL: "dddd, MMMM D YYYY LT"
        },
        longDateFormat: function(key) {
            var output = this._longDateFormat[key];
            if (!output && this._longDateFormat[key.toUpperCase()]) {
                output = this._longDateFormat[key.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function(val) {
                    return val.slice(1);
                });
                this._longDateFormat[key] = output;
            }
            return output;
        },
        meridiem: function(hours, minutes, isLower) {
            if (hours > 11) {
                return isLower ? "pm" : "PM";
            } else {
                return isLower ? "am" : "AM";
            }
        },
        _calendar: {
            sameDay: "[Today at] LT",
            nextDay: "[Tomorrow at] LT",
            nextWeek: "dddd [at] LT",
            lastDay: "[Yesterday at] LT",
            lastWeek: "[last] dddd [at] LT",
            sameElse: "L"
        },
        calendar: function(key, mom) {
            var output = this._calendar[key];
            return typeof output === "function" ? output.apply(mom) : output;
        },
        _relativeTime: {
            future: "in %s",
            past: "%s ago",
            s: "a few seconds",
            m: "a minute",
            mm: "%d minutes",
            h: "an hour",
            hh: "%d hours",
            d: "a day",
            dd: "%d days",
            M: "a month",
            MM: "%d months",
            y: "a year",
            yy: "%d years"
        },
        relativeTime: function(number, withoutSuffix, string, isFuture) {
            var output = this._relativeTime[string];
            return typeof output === "function" ? output(number, withoutSuffix, string, isFuture) : output.replace(/%d/i, number);
        },
        pastFuture: function(diff, output) {
            var format = this._relativeTime[diff > 0 ? "future" : "past"];
            return typeof format === "function" ? format(output) : format.replace(/%s/i, output);
        },
        ordinal: function(number) {
            return this._ordinal.replace("%d", number);
        },
        _ordinal: "%d",
        preparse: function(string) {
            return string;
        },
        postformat: function(string) {
            return string;
        },
        week: function(mom) {
            return weekOfYear(mom, this._week.dow, this._week.doy);
        },
        _week: {
            dow: 0,
            // Sunday is the first day of the week.
            doy: 6
        }
    };
    // Loads a language definition into the `languages` cache.  The function
    // takes a key and optionally values.  If not in the browser and no values
    // are provided, it will load the language file module.  As a convenience,
    // this function also returns the language values.
    function loadLang(key, values) {
        values.abbr = key;
        if (!languages[key]) {
            languages[key] = new Language();
        }
        languages[key].set(values);
        return languages[key];
    }
    // Determines which language definition to use and returns it.
    //
    // With no parameters, it will return the global language.  If you
    // pass in a language key, such as 'en', it will return the
    // definition for 'en', so long as 'en' has already been loaded using
    // moment.lang.
    function getLangDefinition(key) {
        if (!key) {
            return moment.fn._lang;
        }
        if (!languages[key] && hasModule) {
            require("./lang/" + key);
        }
        return languages[key];
    }
    /************************************
        Formatting
    ************************************/
    function removeFormattingTokens(input) {
        if (input.match(/\[.*\]/)) {
            return input.replace(/^\[|\]$/g, "");
        }
        return input.replace(/\\/g, "");
    }
    function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;
        for (i = 0, length = array.length; i < length; i++) {
            if (formatTokenFunctions[array[i]]) {
                array[i] = formatTokenFunctions[array[i]];
            } else {
                array[i] = removeFormattingTokens(array[i]);
            }
        }
        return function(mom) {
            var output = "";
            for (i = 0; i < length; i++) {
                output += typeof array[i].call === "function" ? array[i].call(mom, format) : array[i];
            }
            return output;
        };
    }
    // format date using native date object
    function formatMoment(m, format) {
        var i = 5;
        function replaceLongDateFormatTokens(input) {
            return m.lang().longDateFormat(input) || input;
        }
        while (i-- && localFormattingTokens.test(format)) {
            format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
        }
        if (!formatFunctions[format]) {
            formatFunctions[format] = makeFormatFunction(format);
        }
        return formatFunctions[format](m);
    }
    /************************************
        Parsing
    ************************************/
    // get the regex to find the next token
    function getParseRegexForToken(token) {
        switch (token) {
          case "DDDD":
            return parseTokenThreeDigits;

          case "YYYY":
            return parseTokenFourDigits;

          case "YYYYY":
            return parseTokenSixDigits;

          case "S":
          case "SS":
          case "SSS":
          case "DDD":
            return parseTokenOneToThreeDigits;

          case "MMM":
          case "MMMM":
          case "dd":
          case "ddd":
          case "dddd":
          case "a":
          case "A":
            return parseTokenWord;

          case "X":
            return parseTokenTimestampMs;

          case "Z":
          case "ZZ":
            return parseTokenTimezone;

          case "T":
            return parseTokenT;

          case "MM":
          case "DD":
          case "YY":
          case "HH":
          case "hh":
          case "mm":
          case "ss":
          case "M":
          case "D":
          case "d":
          case "H":
          case "h":
          case "m":
          case "s":
            return parseTokenOneOrTwoDigits;

          default:
            return new RegExp(token.replace("\\", ""));
        }
    }
    // function to convert string input to date
    function addTimeToArrayFromToken(token, input, config) {
        var a, b, datePartArray = config._a;
        switch (token) {
          // MONTH
            case "M":
          // fall through to MM
            case "MM":
            datePartArray[1] = input == null ? 0 : ~~input - 1;
            break;

          case "MMM":
          // fall through to MMMM
            case "MMMM":
            a = getLangDefinition(config._l).monthsParse(input);
            // if we didn't find a month name, mark the date as invalid.
            if (a != null) {
                datePartArray[1] = a;
            } else {
                config._isValid = false;
            }
            break;

          // DAY OF MONTH
            case "D":
          // fall through to DDDD
            case "DD":
          // fall through to DDDD
            case "DDD":
          // fall through to DDDD
            case "DDDD":
            if (input != null) {
                datePartArray[2] = ~~input;
            }
            break;

          // YEAR
            case "YY":
            datePartArray[0] = ~~input + (~~input > 68 ? 1900 : 2e3);
            break;

          case "YYYY":
          case "YYYYY":
            datePartArray[0] = ~~input;
            break;

          // AM / PM
            case "a":
          // fall through to A
            case "A":
            config._isPm = (input + "").toLowerCase() === "pm";
            break;

          // 24 HOUR
            case "H":
          // fall through to hh
            case "HH":
          // fall through to hh
            case "h":
          // fall through to hh
            case "hh":
            datePartArray[3] = ~~input;
            break;

          // MINUTE
            case "m":
          // fall through to mm
            case "mm":
            datePartArray[4] = ~~input;
            break;

          // SECOND
            case "s":
          // fall through to ss
            case "ss":
            datePartArray[5] = ~~input;
            break;

          // MILLISECOND
            case "S":
          case "SS":
          case "SSS":
            datePartArray[6] = ~~(("0." + input) * 1e3);
            break;

          // UNIX TIMESTAMP WITH MS
            case "X":
            config._d = new Date(parseFloat(input) * 1e3);
            break;

          // TIMEZONE
            case "Z":
          // fall through to ZZ
            case "ZZ":
            config._useUTC = true;
            a = (input + "").match(parseTimezoneChunker);
            if (a && a[1]) {
                config._tzh = ~~a[1];
            }
            if (a && a[2]) {
                config._tzm = ~~a[2];
            }
            // reverse offsets
            if (a && a[0] === "+") {
                config._tzh = -config._tzh;
                config._tzm = -config._tzm;
            }
            break;
        }
        // if the input is null, the date is not valid
        if (input == null) {
            config._isValid = false;
        }
    }
    // convert an array to a date.
    // the array should mirror the parameters below
    // note: all values past the year are optional and will default to the lowest possible value.
    // [year, month, day , hour, minute, second, millisecond]
    function dateFromArray(config) {
        var i, date, input = [];
        if (config._d) {
            return;
        }
        for (i = 0; i < 7; i++) {
            config._a[i] = input[i] = config._a[i] == null ? i === 2 ? 1 : 0 : config._a[i];
        }
        // add the offsets to the time to be parsed so that we can have a clean array for checking isValid
        input[3] += config._tzh || 0;
        input[4] += config._tzm || 0;
        date = new Date(0);
        if (config._useUTC) {
            date.setUTCFullYear(input[0], input[1], input[2]);
            date.setUTCHours(input[3], input[4], input[5], input[6]);
        } else {
            date.setFullYear(input[0], input[1], input[2]);
            date.setHours(input[3], input[4], input[5], input[6]);
        }
        config._d = date;
    }
    // date from string and format string
    function makeDateFromStringAndFormat(config) {
        // This array is used to make a Date, either with `new Date` or `Date.UTC`
        var tokens = config._f.match(formattingTokens), string = config._i, i, parsedInput;
        config._a = [];
        for (i = 0; i < tokens.length; i++) {
            parsedInput = (getParseRegexForToken(tokens[i]).exec(string) || [])[0];
            if (parsedInput) {
                string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
            }
            // don't parse if its not a known token
            if (formatTokenFunctions[tokens[i]]) {
                addTimeToArrayFromToken(tokens[i], parsedInput, config);
            }
        }
        // handle am pm
        if (config._isPm && config._a[3] < 12) {
            config._a[3] += 12;
        }
        // if is 12 am, change hours to 0
        if (config._isPm === false && config._a[3] === 12) {
            config._a[3] = 0;
        }
        // return
        dateFromArray(config);
    }
    // date from string and array of format strings
    function makeDateFromStringAndArray(config) {
        var tempConfig, tempMoment, bestMoment, scoreToBeat = 99, i, currentDate, currentScore;
        while (config._f.length) {
            tempConfig = extend({}, config);
            tempConfig._f = config._f.pop();
            makeDateFromStringAndFormat(tempConfig);
            tempMoment = new Moment(tempConfig);
            if (tempMoment.isValid()) {
                bestMoment = tempMoment;
                break;
            }
            currentScore = compareArrays(tempConfig._a, tempMoment.toArray());
            if (currentScore < scoreToBeat) {
                scoreToBeat = currentScore;
                bestMoment = tempMoment;
            }
        }
        extend(config, bestMoment);
    }
    // date from iso format
    function makeDateFromString(config) {
        var i, string = config._i;
        if (isoRegex.exec(string)) {
            config._f = "YYYY-MM-DDT";
            for (i = 0; i < 4; i++) {
                if (isoTimes[i][1].exec(string)) {
                    config._f += isoTimes[i][0];
                    break;
                }
            }
            if (parseTokenTimezone.exec(string)) {
                config._f += " Z";
            }
            makeDateFromStringAndFormat(config);
        } else {
            config._d = new Date(string);
        }
    }
    function makeDateFromInput(config) {
        var input = config._i, matched = aspNetJsonRegex.exec(input);
        if (input === undefined) {
            config._d = new Date();
        } else if (matched) {
            config._d = new Date(+matched[1]);
        } else if (typeof input === "string") {
            makeDateFromString(config);
        } else if (isArray(input)) {
            config._a = input.slice(0);
            dateFromArray(config);
        } else {
            config._d = input instanceof Date ? new Date(+input) : new Date(input);
        }
    }
    /************************************
        Relative Time
    ************************************/
    // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
    function substituteTimeAgo(string, number, withoutSuffix, isFuture, lang) {
        return lang.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
    }
    function relativeTime(milliseconds, withoutSuffix, lang) {
        var seconds = round(Math.abs(milliseconds) / 1e3), minutes = round(seconds / 60), hours = round(minutes / 60), days = round(hours / 24), years = round(days / 365), args = seconds < 45 && [ "s", seconds ] || minutes === 1 && [ "m" ] || minutes < 45 && [ "mm", minutes ] || hours === 1 && [ "h" ] || hours < 22 && [ "hh", hours ] || days === 1 && [ "d" ] || days <= 25 && [ "dd", days ] || days <= 45 && [ "M" ] || days < 345 && [ "MM", round(days / 30) ] || years === 1 && [ "y" ] || [ "yy", years ];
        args[2] = withoutSuffix;
        args[3] = milliseconds > 0;
        args[4] = lang;
        return substituteTimeAgo.apply({}, args);
    }
    /************************************
        Week of Year
    ************************************/
    // firstDayOfWeek       0 = sun, 6 = sat
    //                      the day of the week that starts the week
    //                      (usually sunday or monday)
    // firstDayOfWeekOfYear 0 = sun, 6 = sat
    //                      the first week is the week that contains the first
    //                      of this day of the week
    //                      (eg. ISO weeks use thursday (4))
    function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
        var end = firstDayOfWeekOfYear - firstDayOfWeek, daysToDayOfWeek = firstDayOfWeekOfYear - mom.day();
        if (daysToDayOfWeek > end) {
            daysToDayOfWeek -= 7;
        }
        if (daysToDayOfWeek < end - 7) {
            daysToDayOfWeek += 7;
        }
        return Math.ceil(moment(mom).add("d", daysToDayOfWeek).dayOfYear() / 7);
    }
    /************************************
        Top Level Functions
    ************************************/
    function makeMoment(config) {
        var input = config._i, format = config._f;
        if (input === null || input === "") {
            return null;
        }
        if (typeof input === "string") {
            config._i = input = getLangDefinition().preparse(input);
        }
        if (moment.isMoment(input)) {
            config = extend({}, input);
            config._d = new Date(+input._d);
        } else if (format) {
            if (isArray(format)) {
                makeDateFromStringAndArray(config);
            } else {
                makeDateFromStringAndFormat(config);
            }
        } else {
            makeDateFromInput(config);
        }
        return new Moment(config);
    }
    moment = function(input, format, lang) {
        return makeMoment({
            _i: input,
            _f: format,
            _l: lang,
            _isUTC: false
        });
    };
    // creating with utc
    moment.utc = function(input, format, lang) {
        return makeMoment({
            _useUTC: true,
            _isUTC: true,
            _l: lang,
            _i: input,
            _f: format
        });
    };
    // creating with unix timestamp (in seconds)
    moment.unix = function(input) {
        return moment(input * 1e3);
    };
    // duration
    moment.duration = function(input, key) {
        var isDuration = moment.isDuration(input), isNumber = typeof input === "number", duration = isDuration ? input._data : isNumber ? {} : input, ret;
        if (isNumber) {
            if (key) {
                duration[key] = input;
            } else {
                duration.milliseconds = input;
            }
        }
        ret = new Duration(duration);
        if (isDuration && input.hasOwnProperty("_lang")) {
            ret._lang = input._lang;
        }
        return ret;
    };
    // version number
    moment.version = VERSION;
    // default format
    moment.defaultFormat = isoFormat;
    // This function will load languages and then set the global language.  If
    // no arguments are passed in, it will simply return the current global
    // language key.
    moment.lang = function(key, values) {
        var i;
        if (!key) {
            return moment.fn._lang._abbr;
        }
        if (values) {
            loadLang(key, values);
        } else if (!languages[key]) {
            getLangDefinition(key);
        }
        moment.duration.fn._lang = moment.fn._lang = getLangDefinition(key);
    };
    // returns language data
    moment.langData = function(key) {
        if (key && key._lang && key._lang._abbr) {
            key = key._lang._abbr;
        }
        return getLangDefinition(key);
    };
    // compare moment object
    moment.isMoment = function(obj) {
        return obj instanceof Moment;
    };
    // for typechecking Duration objects
    moment.isDuration = function(obj) {
        return obj instanceof Duration;
    };
    /************************************
        Moment Prototype
    ************************************/
    moment.fn = Moment.prototype = {
        clone: function() {
            return moment(this);
        },
        valueOf: function() {
            return +this._d;
        },
        unix: function() {
            return Math.floor(+this._d / 1e3);
        },
        toString: function() {
            return this.format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
        },
        toDate: function() {
            return this._d;
        },
        toJSON: function() {
            return moment.utc(this).format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]");
        },
        toArray: function() {
            var m = this;
            return [ m.year(), m.month(), m.date(), m.hours(), m.minutes(), m.seconds(), m.milliseconds() ];
        },
        isValid: function() {
            if (this._isValid == null) {
                if (this._a) {
                    this._isValid = !compareArrays(this._a, (this._isUTC ? moment.utc(this._a) : moment(this._a)).toArray());
                } else {
                    this._isValid = !isNaN(this._d.getTime());
                }
            }
            return !!this._isValid;
        },
        utc: function() {
            this._isUTC = true;
            return this;
        },
        local: function() {
            this._isUTC = false;
            return this;
        },
        format: function(inputString) {
            var output = formatMoment(this, inputString || moment.defaultFormat);
            return this.lang().postformat(output);
        },
        add: function(input, val) {
            var dur;
            // switch args to support add('s', 1) and add(1, 's')
            if (typeof input === "string") {
                dur = moment.duration(+val, input);
            } else {
                dur = moment.duration(input, val);
            }
            addOrSubtractDurationFromMoment(this, dur, 1);
            return this;
        },
        subtract: function(input, val) {
            var dur;
            // switch args to support subtract('s', 1) and subtract(1, 's')
            if (typeof input === "string") {
                dur = moment.duration(+val, input);
            } else {
                dur = moment.duration(input, val);
            }
            addOrSubtractDurationFromMoment(this, dur, -1);
            return this;
        },
        diff: function(input, units, asFloat) {
            var that = this._isUTC ? moment(input).utc() : moment(input).local(), zoneDiff = (this.zone() - that.zone()) * 6e4, diff, output;
            if (units) {
                // standardize on singular form
                units = units.replace(/s$/, "");
            }
            if (units === "year" || units === "month") {
                diff = (this.daysInMonth() + that.daysInMonth()) * 432e5;
                // 24 * 60 * 60 * 1000 / 2
                output = (this.year() - that.year()) * 12 + (this.month() - that.month());
                output += (this - moment(this).startOf("month") - (that - moment(that).startOf("month"))) / diff;
                if (units === "year") {
                    output = output / 12;
                }
            } else {
                diff = this - that - zoneDiff;
                output = units === "second" ? diff / 1e3 : // 1000
                units === "minute" ? diff / 6e4 : // 1000 * 60
                units === "hour" ? diff / 36e5 : // 1000 * 60 * 60
                units === "day" ? diff / 864e5 : // 1000 * 60 * 60 * 24
                units === "week" ? diff / 6048e5 : // 1000 * 60 * 60 * 24 * 7
                diff;
            }
            return asFloat ? output : absRound(output);
        },
        from: function(time, withoutSuffix) {
            return moment.duration(this.diff(time)).lang(this.lang()._abbr).humanize(!withoutSuffix);
        },
        fromNow: function(withoutSuffix) {
            return this.from(moment(), withoutSuffix);
        },
        calendar: function() {
            var diff = this.diff(moment().startOf("day"), "days", true), format = diff < -6 ? "sameElse" : diff < -1 ? "lastWeek" : diff < 0 ? "lastDay" : diff < 1 ? "sameDay" : diff < 2 ? "nextDay" : diff < 7 ? "nextWeek" : "sameElse";
            return this.format(this.lang().calendar(format, this));
        },
        isLeapYear: function() {
            var year = this.year();
            return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
        },
        isDST: function() {
            return this.zone() < moment([ this.year() ]).zone() || this.zone() < moment([ this.year(), 5 ]).zone();
        },
        day: function(input) {
            var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
            return input == null ? day : this.add({
                d: input - day
            });
        },
        startOf: function(units) {
            units = units.replace(/s$/, "");
            // the following switch intentionally omits break keywords
            // to utilize falling through the cases.
            switch (units) {
              case "year":
                this.month(0);

              /* falls through */
                case "month":
                this.date(1);

              /* falls through */
                case "week":
              case "day":
                this.hours(0);

              /* falls through */
                case "hour":
                this.minutes(0);

              /* falls through */
                case "minute":
                this.seconds(0);

              /* falls through */
                case "second":
                this.milliseconds(0);
            }
            // weeks are a special case
            if (units === "week") {
                this.day(0);
            }
            return this;
        },
        endOf: function(units) {
            return this.startOf(units).add(units.replace(/s?$/, "s"), 1).subtract("ms", 1);
        },
        isAfter: function(input, units) {
            units = typeof units !== "undefined" ? units : "millisecond";
            return +this.clone().startOf(units) > +moment(input).startOf(units);
        },
        isBefore: function(input, units) {
            units = typeof units !== "undefined" ? units : "millisecond";
            return +this.clone().startOf(units) < +moment(input).startOf(units);
        },
        isSame: function(input, units) {
            units = typeof units !== "undefined" ? units : "millisecond";
            return +this.clone().startOf(units) === +moment(input).startOf(units);
        },
        zone: function() {
            return this._isUTC ? 0 : this._d.getTimezoneOffset();
        },
        daysInMonth: function() {
            return moment.utc([ this.year(), this.month() + 1, 0 ]).date();
        },
        dayOfYear: function(input) {
            var dayOfYear = round((moment(this).startOf("day") - moment(this).startOf("year")) / 864e5) + 1;
            return input == null ? dayOfYear : this.add("d", input - dayOfYear);
        },
        isoWeek: function(input) {
            var week = weekOfYear(this, 1, 4);
            return input == null ? week : this.add("d", (input - week) * 7);
        },
        week: function(input) {
            var week = this.lang().week(this);
            return input == null ? week : this.add("d", (input - week) * 7);
        },
        // If passed a language key, it will set the language for this
        // instance.  Otherwise, it will return the language configuration
        // variables for this instance.
        lang: function(key) {
            if (key === undefined) {
                return this._lang;
            } else {
                this._lang = getLangDefinition(key);
                return this;
            }
        }
    };
    // helper for adding shortcuts
    function makeGetterAndSetter(name, key) {
        moment.fn[name] = moment.fn[name + "s"] = function(input) {
            var utc = this._isUTC ? "UTC" : "";
            if (input != null) {
                this._d["set" + utc + key](input);
                return this;
            } else {
                return this._d["get" + utc + key]();
            }
        };
    }
    // loop through and add shortcuts (Month, Date, Hours, Minutes, Seconds, Milliseconds)
    for (i = 0; i < proxyGettersAndSetters.length; i++) {
        makeGetterAndSetter(proxyGettersAndSetters[i].toLowerCase().replace(/s$/, ""), proxyGettersAndSetters[i]);
    }
    // add shortcut for year (uses different syntax than the getter/setter 'year' == 'FullYear')
    makeGetterAndSetter("year", "FullYear");
    // add plural methods
    moment.fn.days = moment.fn.day;
    moment.fn.weeks = moment.fn.week;
    moment.fn.isoWeeks = moment.fn.isoWeek;
    /************************************
        Duration Prototype
    ************************************/
    moment.duration.fn = Duration.prototype = {
        weeks: function() {
            return absRound(this.days() / 7);
        },
        valueOf: function() {
            return this._milliseconds + this._days * 864e5 + this._months * 2592e6;
        },
        humanize: function(withSuffix) {
            var difference = +this, output = relativeTime(difference, !withSuffix, this.lang());
            if (withSuffix) {
                output = this.lang().pastFuture(difference, output);
            }
            return this.lang().postformat(output);
        },
        lang: moment.fn.lang
    };
    function makeDurationGetter(name) {
        moment.duration.fn[name] = function() {
            return this._data[name];
        };
    }
    function makeDurationAsGetter(name, factor) {
        moment.duration.fn["as" + name] = function() {
            return +this / factor;
        };
    }
    for (i in unitMillisecondFactors) {
        if (unitMillisecondFactors.hasOwnProperty(i)) {
            makeDurationAsGetter(i, unitMillisecondFactors[i]);
            makeDurationGetter(i.toLowerCase());
        }
    }
    makeDurationAsGetter("Weeks", 6048e5);
    /************************************
        Default Lang
    ************************************/
    // Set default language, other languages will inherit from English.
    moment.lang("en", {
        ordinal: function(number) {
            var b = number % 10, output = ~~(number % 100 / 10) === 1 ? "th" : b === 1 ? "st" : b === 2 ? "nd" : b === 3 ? "rd" : "th";
            return number + output;
        }
    });
    /************************************
        Exposing Moment
    ************************************/
    // CommonJS module is defined
    module.exports = moment;
});

define("app/common/validator-debug", [ "arale/validator/0.9.7/validator-debug", "$-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug" ], function(require, exports, module) {
    "use strict";
    var Validator = require("arale/validator/0.9.7/validator-debug");
    module.exports = Validator.extend({
        attrs: {
            explainClass: "help-block",
            itemClass: "form-group",
            autoSubmit: false,
            itemErrorClass: "has-error",
            inputClass: "form-control",
            textareaClass: "form-control",
            showMessage: function(message, element) {
                message = '<i class="ico ico-error"></i>' + message;
                this.getExplain(element).html(message);
                this.getItem(element).addClass("has-error");
            }
        }
    });
});

define("arale/validator/0.9.7/validator-debug", [ "./core-debug", "$-debug", "./async-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "./utils-debug", "./rule-debug", "./item-debug" ], function(require, exports, module) {
    var Core = require("./core-debug"), $ = require("$-debug");
    var Validator = Core.extend({
        events: {
            "mouseenter .{{attrs.inputClass}}": "mouseenter",
            "mouseleave .{{attrs.inputClass}}": "mouseleave",
            "mouseenter .{{attrs.textareaClass}}": "mouseenter",
            "mouseleave .{{attrs.textareaClass}}": "mouseleave",
            "focus .{{attrs.itemClass}} input,textarea,select": "focus",
            "blur .{{attrs.itemClass}} input,textarea,select": "blur"
        },
        attrs: {
            explainClass: "ui-form-explain",
            itemClass: "ui-form-item",
            itemHoverClass: "ui-form-item-hover",
            itemFocusClass: "ui-form-item-focus",
            itemErrorClass: "ui-form-item-error",
            inputClass: "ui-input",
            textareaClass: "ui-textarea",
            showMessage: function(message, element) {
                this.getExplain(element).html(message);
                this.getItem(element).addClass(this.get("itemErrorClass"));
            },
            hideMessage: function(message, element) {
                this.getExplain(element).html(element.attr("data-explain") || " ");
                this.getItem(element).removeClass(this.get("itemErrorClass"));
            }
        },
        setup: function() {
            Validator.superclass.setup.call(this);
            var that = this;
            this.on("autoFocus", function(ele) {
                that.set("autoFocusEle", ele);
            });
        },
        addItem: function(cfg) {
            Validator.superclass.addItem.apply(this, [].slice.call(arguments));
            var item = this.query(cfg.element);
            if (item) {
                this._saveExplainMessage(item);
            }
            return this;
        },
        _saveExplainMessage: function(item) {
            var that = this;
            var ele = item.element;
            var explain = ele.attr("data-explain");
            // If explaining message is not specified, retrieve it from data-explain attribute of the target
            // or from DOM element with class name of the value of explainClass attr.
            // Explaining message cannot always retrieve from DOM element with class name of the value of explainClass
            // attr because the initial state of form may contain error messages from server.
            // ---
            // Also, If explaining message is under ui-form-item-error className
            // it could be considered to be a error message from server
            // that should not be put into data-explain attribute
            if (explain === undefined && !this.getItem(ele).hasClass(this.get("itemErrorClass"))) {
                ele.attr("data-explain", this.getExplain(ele).html());
            }
        },
        getExplain: function(ele) {
            var item = this.getItem(ele);
            var explain = item.find("." + this.get("explainClass"));
            if (explain.length == 0) {
                explain = $('<div class="' + this.get("explainClass") + '"></div>').appendTo(item);
            }
            return explain;
        },
        getItem: function(ele) {
            ele = $(ele);
            var item = ele.parents("." + this.get("itemClass"));
            return item;
        },
        mouseenter: function(e) {
            this.getItem(e.target).addClass(this.get("itemHoverClass"));
        },
        mouseleave: function(e) {
            this.getItem(e.target).removeClass(this.get("itemHoverClass"));
        },
        focus: function(e) {
            var target = e.target, autoFocusEle = this.get("autoFocusEle");
            if (autoFocusEle && autoFocusEle.has(target)) {
                var that = this;
                $(target).keyup(function(e) {
                    that.set("autoFocusEle", null);
                    that.focus({
                        target: target
                    });
                });
                return;
            }
            this.getItem(target).removeClass(this.get("itemErrorClass"));
            this.getItem(target).addClass(this.get("itemFocusClass"));
            this.getExplain(target).html($(target).attr("data-explain") || "");
        },
        blur: function(e) {
            this.getItem(e.target).removeClass(this.get("itemFocusClass"));
        }
    });
    module.exports = Validator;
});

define("arale/validator/0.9.7/core-debug", [ "$-debug", "arale/validator/0.9.7/async-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "arale/validator/0.9.7/utils-debug", "arale/validator/0.9.7/rule-debug", "arale/validator/0.9.7/item-debug" ], function(require, exports, module) {
    var $ = require("$-debug"), async = require("arale/validator/0.9.7/async-debug"), Widget = require("arale/widget/1.1.1/widget-debug"), utils = require("arale/validator/0.9.7/utils-debug"), Item = require("arale/validator/0.9.7/item-debug");
    var validators = [];
    var setterConfig = {
        value: $.noop,
        setter: function(val) {
            return $.isFunction(val) ? val : utils.helper(val);
        }
    };
    var Core = Widget.extend({
        attrs: {
            triggerType: "blur",
            checkOnSubmit: true,
            // 是否在表单提交前进行校验，默认进行校验。
            stopOnError: false,
            // 校验整个表单时，遇到错误时是否停止校验其他表单项。
            autoSubmit: true,
            // When all validation passed, submit the form automatically.
            checkNull: true,
            // 除提交前的校验外，input的值为空时是否校验。
            onItemValidate: setterConfig,
            onItemValidated: setterConfig,
            onFormValidate: setterConfig,
            onFormValidated: setterConfig,
            // 此函数用来定义如何自动获取校验项对应的 display 字段。
            displayHelper: function(item) {
                var labeltext, name;
                var id = item.element.attr("id");
                if (id) {
                    labeltext = $("label[for=" + id + "]").text();
                    if (labeltext) {
                        labeltext = labeltext.replace(/^[\*\s\:\：]*/, "").replace(/[\*\s\:\：]*$/, "");
                    }
                }
                name = item.element.attr("name");
                return labeltext || name;
            },
            showMessage: setterConfig,
            // specify how to display error messages
            hideMessage: setterConfig,
            // specify how to hide error messages
            autoFocus: true,
            // Automatically focus at the first element failed validation if true.
            failSilently: false,
            // If set to true and the given element passed to addItem does not exist, just ignore.
            skipHidden: false
        },
        setup: function() {
            // Validation will be executed according to configurations stored in items.
            var self = this;
            self.items = [];
            // 外层容器是否是 form 元素
            if (self.element.is("form")) {
                // 记录 form 原来的 novalidate 的值，因为初始化时需要设置 novalidate 的值，destroy 的时候需要恢复。
                self._novalidate_old = self.element.attr("novalidate");
                // disable html5 form validation
                // see: http://bugs.jquery.com/ticket/12577
                try {
                    self.element.attr("novalidate", "novalidate");
                } catch (e) {}
                //If checkOnSubmit is true, then bind submit event to execute validation.
                if (self.get("checkOnSubmit")) {
                    self.element.on("submit.validator", function(e) {
                        e.preventDefault();
                        self.execute(function(err) {
                            !err && self.get("autoSubmit") && self.element.get(0).submit();
                        });
                    });
                }
            }
            // 当每项校验之后, 根据返回的 err 状态, 显示或隐藏提示信息
            self.on("itemValidated", function(err, message, element, event) {
                this.query(element).get(err ? "showMessage" : "hideMessage").call(this, message, element, event);
            });
            validators.push(self);
        },
        Statics: $.extend({
            helper: utils.helper
        }, require("arale/validator/0.9.7/rule-debug"), {
            autoRender: function(cfg) {
                var validator = new this(cfg);
                $("input, textarea, select", validator.element).each(function(i, input) {
                    input = $(input);
                    var type = input.attr("type");
                    if (type == "button" || type == "submit" || type == "reset") {
                        return true;
                    }
                    var options = {};
                    if (type == "radio" || type == "checkbox") {
                        options.element = $("[type=" + type + "][name=" + input.attr("name") + "]", validator.element);
                    } else {
                        options.element = input;
                    }
                    if (!validator.query(options.element)) {
                        var obj = utils.parseDom(input);
                        if (!obj.rule) return true;
                        $.extend(options, obj);
                        validator.addItem(options);
                    }
                });
            },
            query: function(selector) {
                return Widget.query(selector);
            },
            // TODO 校验单项静态方法的实现需要优化
            validate: function(options) {
                var element = $(options.element);
                var validator = new Core({
                    element: element.parents()
                });
                validator.addItem(options);
                validator.query(element).execute();
                validator.destroy();
            }
        }),
        addItem: function(cfg) {
            var self = this;
            if ($.isArray(cfg)) {
                $.each(cfg, function(i, v) {
                    self.addItem(v);
                });
                return this;
            }
            cfg = $.extend({
                triggerType: self.get("triggerType"),
                checkNull: self.get("checkNull"),
                displayHelper: self.get("displayHelper"),
                showMessage: self.get("showMessage"),
                hideMessage: self.get("hideMessage"),
                failSilently: self.get("failSilently"),
                skipHidden: self.get("skipHidden")
            }, cfg);
            // 当 item 初始化的 element 为 selector 字符串时
            // 默认到 validator.element 下去找
            if (typeof cfg.element === "string") {
                cfg.element = this.$(cfg.element);
            }
            if (!$(cfg.element).length) {
                if (cfg.failSilently) {
                    return self;
                } else {
                    throw new Error("element does not exist");
                }
            }
            var item = new Item(cfg);
            self.items.push(item);
            // 关联 item 到当前 validator 对象
            item._validator = self;
            item.delegateEvents(item.get("triggerType"), function(e) {
                if (!this.get("checkNull") && !this.element.val()) return;
                this.execute(null, {
                    event: e
                });
            });
            item.on("all", function(eventName) {
                this.trigger.apply(this, [].slice.call(arguments));
            }, self);
            return self;
        },
        removeItem: function(selector) {
            var self = this, target = selector instanceof Item ? selector : self.query(selector);
            if (target) {
                target.get("hideMessage").call(self, null, target.element);
                erase(target, self.items);
                target.destroy();
            }
            return self;
        },
        execute: function(callback) {
            var self = this, results = [], hasError = false, firstElem = null;
            // 在表单校验前, 隐藏所有校验项的错误提示
            $.each(self.items, function(i, item) {
                item.get("hideMessage").call(self, null, item.element);
            });
            self.trigger("formValidate", self.element);
            async[self.get("stopOnError") ? "forEachSeries" : "forEach"](self.items, function(item, cb) {
                // iterator
                item.execute(function(err, message, ele) {
                    // 第一个校验错误的元素
                    if (err && !hasError) {
                        hasError = true;
                        firstElem = ele;
                    }
                    results.push([].slice.call(arguments, 0));
                    // Async doesn't allow any of tasks to fail, if you want the final callback executed after all tasks finished.
                    // So pass none-error value to task callback instead of the real result.
                    cb(self.get("stopOnError") ? err : null);
                });
            }, function() {
                // complete callback
                if (self.get("autoFocus") && hasError) {
                    self.trigger("autoFocus", firstElem);
                    firstElem.focus();
                }
                self.trigger("formValidated", hasError, results, self.element);
                callback && callback(hasError, results, self.element);
            });
            return self;
        },
        destroy: function() {
            var self = this, len = self.items.length;
            if (self.element.is("form")) {
                try {
                    if (self._novalidate_old == undefined) self.element.removeAttr("novalidate"); else self.element.attr("novalidate", self._novalidate_old);
                } catch (e) {}
                self.element.off("submit.validator");
            }
            for (var i = len - 1; i >= 0; i--) {
                self.removeItem(self.items[i]);
            }
            erase(self, validators);
            Core.superclass.destroy.call(this);
        },
        query: function(selector) {
            return findItemBySelector(this.$(selector), this.items);
        }
    });
    // 从数组中删除对应元素
    function erase(target, array) {
        for (var i = 0; i < array.length; i++) {
            if (target === array[i]) {
                array.splice(i, 1);
                return array;
            }
        }
    }
    function findItemBySelector(target, array) {
        var ret;
        $.each(array, function(i, item) {
            if (target.get(0) === item.element.get(0)) {
                ret = item;
                return false;
            }
        });
        return ret;
    }
    module.exports = Core;
});

// Thanks to Caolan McMahon. These codes blow come from his project Async(https://github.com/caolan/async).
define("arale/validator/0.9.7/async-debug", [], function(require, exports, module) {
    var async = {};
    module.exports = async;
    //// cross-browser compatiblity functions ////
    var _forEach = function(arr, iterator) {
        if (arr.forEach) {
            return arr.forEach(iterator);
        }
        for (var i = 0; i < arr.length; i += 1) {
            iterator(arr[i], i, arr);
        }
    };
    var _map = function(arr, iterator) {
        if (arr.map) {
            return arr.map(iterator);
        }
        var results = [];
        _forEach(arr, function(x, i, a) {
            results.push(iterator(x, i, a));
        });
        return results;
    };
    var _keys = function(obj) {
        if (Object.keys) {
            return Object.keys(obj);
        }
        var keys = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                keys.push(k);
            }
        }
        return keys;
    };
    //// exported async module functions ////
    //// nextTick implementation with browser-compatible fallback ////
    if (typeof process === "undefined" || !process.nextTick) {
        async.nextTick = function(fn) {
            setTimeout(fn, 0);
        };
    } else {
        async.nextTick = process.nextTick;
    }
    async.forEach = function(arr, iterator, callback) {
        callback = callback || function() {};
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        _forEach(arr, function(x) {
            iterator(x, function(err) {
                if (err) {
                    callback(err);
                    callback = function() {};
                } else {
                    completed += 1;
                    if (completed === arr.length) {
                        callback(null);
                    }
                }
            });
        });
    };
    async.forEachSeries = function(arr, iterator, callback) {
        callback = callback || function() {};
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        var iterate = function() {
            iterator(arr[completed], function(err) {
                if (err) {
                    callback(err);
                    callback = function() {};
                } else {
                    completed += 1;
                    if (completed === arr.length) {
                        callback(null);
                    } else {
                        iterate();
                    }
                }
            });
        };
        iterate();
    };
    var doParallel = function(fn) {
        return function() {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [ async.forEach ].concat(args));
        };
    };
    var doSeries = function(fn) {
        return function() {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [ async.forEachSeries ].concat(args));
        };
    };
    var _asyncMap = function(eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function(x, i) {
            return {
                index: i,
                value: x
            };
        });
        eachfn(arr, function(x, callback) {
            iterator(x.value, function(err, v) {
                results[x.index] = v;
                callback(err);
            });
        }, function(err) {
            callback(err, results);
        });
    };
    async.map = doParallel(_asyncMap);
    async.mapSeries = doSeries(_asyncMap);
    async.series = function(tasks, callback) {
        callback = callback || function() {};
        if (tasks.constructor === Array) {
            async.mapSeries(tasks, function(fn, callback) {
                if (fn) {
                    fn(function(err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        callback.call(null, err, args);
                    });
                }
            }, callback);
        } else {
            var results = {};
            async.forEachSeries(_keys(tasks), function(k, callback) {
                tasks[k](function(err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    callback(err);
                });
            }, function(err) {
                callback(err, results);
            });
        }
    };
});

define("arale/validator/0.9.7/utils-debug", [ "$-debug", "arale/validator/0.9.7/rule-debug" ], function(require, exports, module) {
    var $ = require("$-debug"), Rule = require("arale/validator/0.9.7/rule-debug");
    var u_count = 0;
    var helpers = {};
    function unique() {
        return "__anonymous__" + u_count++;
    }
    function parseRules(str) {
        if (!str) return null;
        return str.match(/[a-zA-Z0-9\-\_]+(\{[^\{\}]*\})?/g);
    }
    function parseDom(field) {
        var field = $(field);
        var result = {};
        var arr = [];
        //parse required attribute
        var required = field.attr("required");
        if (required) {
            arr.push("required");
            result.required = true;
        }
        //parse type attribute
        var type = field.attr("type");
        if (type && type != "submit" && type != "cancel" && type != "checkbox" && type != "radio" && type != "select" && type != "select-one" && type != "file" && type != "hidden" && type != "textarea") {
            if (!Rule.getRule(type)) {
                throw new Error('Form field with type "' + type + '" not supported!');
            }
            arr.push(type);
        }
        //parse min attribute
        var min = field.attr("min");
        if (min) {
            arr.push('min{"min":"' + min + '"}');
        }
        //parse max attribute
        var max = field.attr("max");
        if (max) {
            arr.push("max{max:" + max + "}");
        }
        //parse minlength attribute
        var minlength = field.attr("minlength");
        if (minlength) {
            arr.push("minlength{min:" + minlength + "}");
        }
        //parse maxlength attribute
        var maxlength = field.attr("maxlength");
        if (maxlength) {
            arr.push("maxlength{max:" + maxlength + "}");
        }
        //parse pattern attribute
        var pattern = field.attr("pattern");
        if (pattern) {
            var regexp = new RegExp(pattern), name = unique();
            Rule.addRule(name, regexp);
            arr.push(name);
        }
        //parse data-rule attribute to get custom rules
        var rules = field.attr("data-rule");
        rules = rules && parseRules(rules);
        if (rules) arr = arr.concat(rules);
        result.rule = arr.length == 0 ? null : arr.join(" ");
        return result;
    }
    function parseJSON(str) {
        if (!str) return null;
        var NOTICE = 'Invalid option object "' + str + '".';
        // remove braces
        str = str.slice(1, -1);
        var result = {};
        var arr = str.split(",");
        $.each(arr, function(i, v) {
            arr[i] = $.trim(v);
            if (!arr[i]) throw new Error(NOTICE);
            var arr2 = arr[i].split(":");
            var key = $.trim(arr2[0]), value = $.trim(arr2[1]);
            if (!key || !value) throw new Error(NOTICE);
            result[getValue(key)] = $.trim(getValue(value));
        });
        // 'abc' -> 'abc'  '"abc"' -> 'abc'
        function getValue(str) {
            if (str.charAt(0) == '"' && str.charAt(str.length - 1) == '"' || str.charAt(0) == "'" && str.charAt(str.length - 1) == "'") {
                return eval(str);
            }
            return str;
        }
        return result;
    }
    function isHidden(ele) {
        var w = ele[0].offsetWidth, h = ele[0].offsetHeight, force = ele.prop("tagName") === "TR";
        return w === 0 && h === 0 && !force ? true : w !== 0 && h !== 0 && !force ? false : ele.css("display") === "none";
    }
    module.exports = {
        parseRule: function(str) {
            var match = str.match(/([^{}:\s]*)(\{[^\{\}]*\})?/);
            // eg. { name: "valueBetween", param: {min: 1, max: 2} }
            return {
                name: match[1],
                param: parseJSON(match[2])
            };
        },
        parseRules: parseRules,
        parseDom: parseDom,
        isHidden: isHidden,
        helper: function(name, fn) {
            if (fn) {
                helpers[name] = fn;
                return this;
            }
            return helpers[name];
        }
    };
});

define("arale/validator/0.9.7/rule-debug", [ "$-debug" ], function(require, exports, module) {
    var $ = require("$-debug"), rules = {}, messages = {};
    function Rule(name, oper) {
        var self = this;
        self.name = name;
        if (oper instanceof RegExp) {
            self.operator = function(opts, commit) {
                var rslt = oper.test($(opts.element).val());
                commit(rslt ? null : opts.rule, _getMsg(opts, rslt));
            };
        } else if ($.isFunction(oper)) {
            self.operator = function(opts, commit) {
                var rslt = oper.call(this, opts, function(result, msg) {
                    commit(result ? null : opts.rule, msg || _getMsg(opts, result));
                });
                // 当是异步判断时, 返回 undefined, 则执行上面的 commit
                if (rslt !== undefined) {
                    commit(rslt ? null : opts.rule, _getMsg(opts, rslt));
                }
            };
        } else {
            throw new Error("The second argument must be a regexp or a function.");
        }
    }
    Rule.prototype.and = function(name, options) {
        var target = name instanceof Rule ? name : getRule(name, options);
        if (!target) {
            throw new Error('No rule with name "' + name + '" found.');
        }
        var that = this;
        var operator = function(opts, commit) {
            that.operator.call(this, opts, function(err, msg) {
                if (err) {
                    commit(err, _getMsg(opts, !err));
                } else {
                    target.operator.call(this, opts, commit);
                }
            });
        };
        return new Rule(null, operator);
    };
    Rule.prototype.or = function(name, options) {
        var target = name instanceof Rule ? name : getRule(name, options);
        if (!target) {
            throw new Error('No rule with name "' + name + '" found.');
        }
        var that = this;
        var operator = function(opts, commit) {
            that.operator.call(this, opts, function(err, msg) {
                if (err) {
                    target.operator.call(this, opts, commit);
                } else {
                    commit(null, _getMsg(opts, true));
                }
            });
        };
        return new Rule(null, operator);
    };
    Rule.prototype.not = function(options) {
        var target = getRule(this.name, options);
        var operator = function(opts, commit) {
            target.operator.call(this, opts, function(err, msg) {
                if (err) {
                    commit(null, _getMsg(opts, true));
                } else {
                    commit(true, _getMsg(opts, false));
                }
            });
        };
        return new Rule(null, operator);
    };
    function addRule(name, operator, message) {
        if ($.isPlainObject(name)) {
            $.each(name, function(i, v) {
                if ($.isArray(v)) addRule(i, v[0], v[1]); else addRule(i, v);
            });
            return this;
        }
        if (operator instanceof Rule) {
            rules[name] = new Rule(name, operator.operator);
        } else {
            rules[name] = new Rule(name, operator);
        }
        setMessage(name, message);
        return this;
    }
    function _getMsg(opts, b) {
        var ruleName = opts.rule;
        var msgtpl;
        if (opts.message) {
            // user specifies a message
            if ($.isPlainObject(opts.message)) {
                msgtpl = opts.message[b ? "success" : "failure"];
                // if user's message is undefined，use default
                typeof msgtpl === "undefined" && (msgtpl = messages[ruleName][b ? "success" : "failure"]);
            } else {
                //just string
                msgtpl = b ? "" : opts.message;
            }
        } else {
            // use default
            msgtpl = messages[ruleName][b ? "success" : "failure"];
        }
        return msgtpl ? compileTpl(opts, msgtpl) : msgtpl;
    }
    function setMessage(name, msg) {
        if ($.isPlainObject(name)) {
            $.each(name, function(i, v) {
                setMessage(i, v);
            });
            return this;
        }
        if ($.isPlainObject(msg)) {
            messages[name] = msg;
        } else {
            messages[name] = {
                failure: msg
            };
        }
        return this;
    }
    function getRule(name, opts) {
        if (opts) {
            var rule = rules[name];
            return new Rule(null, function(options, commit) {
                rule.operator($.extend(null, options, opts), commit);
            });
        } else {
            return rules[name];
        }
    }
    function compileTpl(obj, tpl) {
        var result = tpl;
        var regexp1 = /\{\{[^\{\}]*\}\}/g, regexp2 = /\{\{(.*)\}\}/;
        var arr = tpl.match(regexp1);
        arr && $.each(arr, function(i, v) {
            var key = v.match(regexp2)[1];
            var value = obj[$.trim(key)];
            result = result.replace(v, value);
        });
        return result;
    }
    addRule("required", function(options) {
        var element = $(options.element);
        var t = element.attr("type");
        switch (t) {
          case "checkbox":
          case "radio":
            var checked = false;
            element.each(function(i, item) {
                if ($(item).prop("checked")) {
                    checked = true;
                    return false;
                }
            });
            return checked;

          default:
            return Boolean($.trim(element.val()));
        }
    }, "请输入{{display}}");
    addRule("email", /^\s*([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,20})\s*$/, "{{display}}的格式不正确");
    addRule("text", /.*/);
    addRule("password", /.*/);
    addRule("radio", /.*/);
    addRule("checkbox", /.*/);
    addRule("url", /^(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/, "{{display}}的格式不正确");
    addRule("number", /^[+-]?[1-9][0-9]*(\.[0-9]+)?([eE][+-][1-9][0-9]*)?$|^[+-]?0?\.[0-9]+([eE][+-][1-9][0-9]*)?$/, "{{display}}的格式不正确");
    // 00123450 是 digits 但不是 number
    // 1.23 是 number 但不是 digits
    addRule("digits", /^\s*\d+\s*$/, "{{display}}的格式不正确");
    addRule("date", /^\d{4}\-[01]?\d\-[0-3]?\d$|^[01]\d\/[0-3]\d\/\d{4}$|^\d{4}年[01]?\d月[0-3]?\d[日号]$/, "{{display}}的格式不正确");
    addRule("min", function(options) {
        var element = options.element, min = options.min;
        return Number(element.val()) >= Number(min);
    }, "{{display}}必须大于或者等于{{min}}");
    addRule("max", function(options) {
        var element = options.element, max = options.max;
        return Number(element.val()) <= Number(max);
    }, "{{display}}必须小于或者等于{{max}}");
    addRule("minlength", function(options) {
        var element = options.element;
        var l = element.val().length;
        return l >= Number(options.min);
    }, "{{display}}的长度必须大于或等于{{min}}");
    addRule("maxlength", function(options) {
        var element = options.element;
        var l = element.val().length;
        return l <= Number(options.max);
    }, "{{display}}的长度必须小于或等于{{max}}");
    addRule("mobile", /^1\d{10}$/, "请输入正确的{{display}}");
    addRule("confirmation", function(options) {
        var element = options.element, target = $(options.target);
        return element.val() == target.val();
    }, "两次输入的{{display}}不一致，请重新输入");
    module.exports = {
        addRule: addRule,
        setMessage: setMessage,
        getMessage: function(options, isSuccess) {
            return _getMsg(options, isSuccess);
        },
        getRule: getRule,
        getOperator: function(name) {
            return rules[name].operator;
        }
    };
});

define("arale/validator/0.9.7/item-debug", [ "$-debug", "arale/validator/0.9.7/utils-debug", "arale/validator/0.9.7/rule-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "arale/validator/0.9.7/async-debug" ], function(require, exports, module) {
    var $ = require("$-debug"), utils = require("arale/validator/0.9.7/utils-debug"), Widget = require("arale/widget/1.1.1/widget-debug"), async = require("arale/validator/0.9.7/async-debug"), Rule = require("arale/validator/0.9.7/rule-debug");
    var setterConfig = {
        value: $.noop,
        setter: function(val) {
            return $.isFunction(val) ? val : utils.helper(val);
        }
    };
    var Item = Widget.extend({
        attrs: {
            rule: {
                value: "",
                getter: function(val) {
                    // 在获取的时候动态判断是否required，来追加或者删除 rule: required
                    if (this.get("required")) {
                        if (!val || val.indexOf("required") < 0) {
                            val = "required " + val;
                        }
                    } else {
                        if (val.indexOf("required") != -1) {
                            val = val.replace("required ");
                        }
                    }
                    return val;
                }
            },
            display: null,
            displayHelper: null,
            triggerType: {
                getter: function(val) {
                    if (!val) return val;
                    var element = this.element, type = element.attr("type");
                    // 将 select, radio, checkbox 的 blur 和 key 事件转成 change
                    var b = element.is("select") || type == "radio" || type == "checkbox";
                    if (b && (val.indexOf("blur") > -1 || val.indexOf("key") > -1)) return "change";
                    return val;
                }
            },
            required: {
                value: false,
                getter: function(val) {
                    return $.isFunction(val) ? val() : val;
                }
            },
            checkNull: true,
            errormessage: null,
            onItemValidate: setterConfig,
            onItemValidated: setterConfig,
            showMessage: setterConfig,
            hideMessage: setterConfig
        },
        setup: function() {
            if (!this.get("display") && $.isFunction(this.get("displayHelper"))) {
                this.set("display", this.get("displayHelper")(this));
            }
        },
        // callback 为当这个项校验完后, 通知 form 的 async.forEachSeries 此项校验结束并把结果通知到 async,
        // 通过 async.forEachSeries 的第二个参数 Fn(item, cb) 的 cb 参数
        execute: function(callback, context) {
            var self = this, elemDisabled = !!self.element.attr("disabled");
            context = context || {};
            // 如果是设置了不检查不可见元素的话, 直接 callback
            if (self.get("skipHidden") && utils.isHidden(self.element) || elemDisabled) {
                callback && callback(null, "", self.element);
                return self;
            }
            self.trigger("itemValidate", self.element, context.event);
            var rules = utils.parseRules(self.get("rule"));
            if (rules) {
                _metaValidate(self, rules, function(err, msg) {
                    self.trigger("itemValidated", err, msg, self.element, context.event);
                    callback && callback(err, msg, self.element);
                });
            } else {
                callback && callback(null, "", self.element);
            }
            return self;
        },
        getMessage: function(theRule, isSuccess, options) {
            var message = "", self = this, rules = utils.parseRules(self.get("rule"));
            isSuccess = !!isSuccess;
            $.each(rules, function(i, item) {
                var obj = utils.parseRule(item), ruleName = obj.name, param = obj.param;
                if (theRule === ruleName) {
                    message = Rule.getMessage($.extend(options || {}, getMsgOptions(param, ruleName, self)), isSuccess);
                }
            });
            return message;
        }
    });
    function getMsgOptions(param, ruleName, self) {
        var options = $.extend({}, param, {
            element: self.element,
            display: param && param.display || self.get("display"),
            rule: ruleName
        });
        var message = self.get("errormessage") || self.get("errormessage" + upperFirstLetter(ruleName));
        if (message && !options.message) {
            options.message = {
                failure: message
            };
        }
        return options;
    }
    function upperFirstLetter(str) {
        str = str + "";
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    function _metaValidate(self, rules, callback) {
        var ele = self.element;
        if (!self.get("required")) {
            var truly = false;
            var t = ele.attr("type");
            switch (t) {
              case "checkbox":
              case "radio":
                var checked = false;
                ele.each(function(i, item) {
                    if ($(item).prop("checked")) {
                        checked = true;
                        return false;
                    }
                });
                truly = checked;
                break;

              default:
                truly = !!ele.val();
            }
            // 非必要且没有值的时候, 直接 callback
            if (!truly) {
                callback && callback(null, null);
                return;
            }
        }
        if (!$.isArray(rules)) throw new Error("No validation rule specified or not specified as an array.");
        var tasks = [];
        $.each(rules, function(i, item) {
            var obj = utils.parseRule(item), ruleName = obj.name, param = obj.param;
            var ruleOperator = Rule.getOperator(ruleName);
            if (!ruleOperator) throw new Error('Validation rule with name "' + ruleName + '" cannot be found.');
            var options = getMsgOptions(param, ruleName, self);
            tasks.push(function(cb) {
                // cb 为 async.series 每个 tasks 函数 的 callback!!
                // callback(err, results)
                // self._validator 为当前 Item 对象所在的 Validator 对象
                ruleOperator.call(self._validator, options, cb);
            });
        });
        // form.execute -> 多个 item.execute -> 多个 rule.operator
        // 多个 rule 的校验是串行的, 前一个出错, 立即停止
        // async.series 的 callback fn, 在执行 tasks 结束或某个 task 出错后被调用
        // 其参数 results 为当前每个 task 执行的结果
        // 函数内的 callback 回调给项校验
        async.series(tasks, function(err, results) {
            callback && callback(err, results[results.length - 1]);
        });
    }
    module.exports = Item;
});

define("arale/upload/1.1.1/upload-debug", [ "$-debug" ], function(require, exports, module) {
    var $ = require("$-debug");
    var iframeCount = 0;
    function Uploader(options) {
        if (!(this instanceof Uploader)) {
            return new Uploader(options);
        }
        if (isString(options)) {
            options = {
                trigger: options
            };
        }
        var settings = {
            trigger: null,
            name: null,
            action: null,
            data: null,
            accept: null,
            change: null,
            error: null,
            multiple: true,
            success: null
        };
        if (options) {
            $.extend(settings, options);
        }
        var $trigger = $(settings.trigger);
        settings.action = settings.action || $trigger.data("action") || "/upload";
        settings.name = settings.name || $trigger.attr("name") || $trigger.data("name") || "file";
        settings.data = settings.data || parse($trigger.data("data"));
        settings.accept = settings.accept || $trigger.data("accept");
        settings.success = settings.success || $trigger.data("success");
        this.settings = settings;
        this.setup();
        this.bind();
    }
    // initialize
    // create input, form, iframe
    Uploader.prototype.setup = function() {
        this.form = $('<form method="post" enctype="multipart/form-data"' + 'target="" action="' + this.settings.action + '" />');
        this.iframe = newIframe();
        this.form.attr("target", this.iframe.attr("name"));
        var data = this.settings.data;
        this.form.append(createInputs(data));
        if (window.FormData) {
            this.form.append(createInputs({
                _uploader_: "formdata"
            }));
        } else {
            this.form.append(createInputs({
                _uploader_: "iframe"
            }));
        }
        var input = document.createElement("input");
        input.type = "file";
        input.name = this.settings.name;
        if (this.settings.accept) {
            input.accept = this.settings.accept;
        }
        if (this.settings.multiple) {
            input.multiple = true;
            input.setAttribute("multiple", "multiple");
        }
        this.input = $(input);
        var $trigger = $(this.settings.trigger);
        this.input.attr("hidefocus", true).css({
            position: "absolute",
            top: 0,
            right: 0,
            opacity: 0,
            outline: 0,
            cursor: "pointer",
            height: $trigger.outerHeight(),
            fontSize: Math.max(64, $trigger.outerHeight() * 5)
        });
        this.form.append(this.input);
        this.form.css({
            position: "absolute",
            top: $trigger.offset().top,
            left: $trigger.offset().left,
            overflow: "hidden",
            width: $trigger.outerWidth(),
            height: $trigger.outerHeight(),
            zIndex: findzIndex($trigger) + 10
        }).appendTo("body");
        return this;
    };
    // bind events
    Uploader.prototype.bind = function() {
        var self = this;
        var $trigger = $(self.settings.trigger);
        $trigger.mouseenter(function() {
            self.form.css({
                top: $trigger.offset().top,
                left: $trigger.offset().left,
                width: $trigger.outerWidth(),
                height: $trigger.outerHeight()
            });
        });
        self.bindInput();
    };
    Uploader.prototype.bindInput = function() {
        var self = this;
        self.input.change(function(e) {
            // ie9 don't support FileList Object
            // http://stackoverflow.com/questions/12830058/ie8-input-type-file-get-files
            self._files = this.files || [ {
                name: e.target.value
            } ];
            var file = self.input.val();
            if (self.settings.change) {
                self.settings.change.call(self, self._files);
            } else if (file) {
                return self.submit();
            }
        });
    };
    // handle submit event
    // prepare for submiting form
    Uploader.prototype.submit = function() {
        var self = this;
        if (window.FormData && self._files) {
            // build a FormData
            var form = new FormData(self.form.get(0));
            // use FormData to upload
            form.append(self.settings.name, self._files);
            var optionXhr;
            if (self.settings.progress) {
                // fix the progress target file
                var files = self._files;
                optionXhr = function() {
                    var xhr = $.ajaxSettings.xhr();
                    if (xhr.upload) {
                        xhr.upload.addEventListener("progress", function(event) {
                            var percent = 0;
                            var position = event.loaded || event.position;
                            /*event.position is deprecated*/
                            var total = event.total;
                            if (event.lengthComputable) {
                                percent = Math.ceil(position / total * 100);
                            }
                            self.settings.progress(event, position, total, percent, files);
                        }, false);
                    }
                    return xhr;
                };
            }
            $.ajax({
                url: self.settings.action,
                type: "post",
                processData: false,
                contentType: false,
                data: form,
                xhr: optionXhr,
                context: this,
                success: self.settings.success,
                error: self.settings.error
            });
            return this;
        } else {
            // iframe upload
            self.iframe = newIframe();
            self.form.attr("target", self.iframe.attr("name"));
            $("body").append(self.iframe);
            self.iframe.one("load", function() {
                // https://github.com/blueimp/jQuery-File-Upload/blob/9.5.6/js/jquery.iframe-transport.js#L102
                // Fix for IE endless progress bar activity bug
                // (happens on form submits to iframe targets):
                $('<iframe src="javascript:false;"></iframe>').appendTo(self.form).remove();
                var response = $(this).contents().find("body").html();
                $(this).remove();
                if (!response) {
                    if (self.settings.error) {
                        self.settings.error(self.input.val());
                    }
                } else {
                    if (self.settings.success) {
                        self.settings.success(response);
                    }
                }
            });
            self.form.submit();
        }
        return this;
    };
    Uploader.prototype.refreshInput = function() {
        //replace the input element, or the same file can not to be uploaded
        var newInput = this.input.clone();
        this.input.before(newInput);
        this.input.off("change");
        this.input.remove();
        this.input = newInput;
        this.bindInput();
    };
    // handle change event
    // when value in file input changed
    Uploader.prototype.change = function(callback) {
        if (!callback) {
            return this;
        }
        this.settings.change = callback;
        return this;
    };
    // handle when upload success
    Uploader.prototype.success = function(callback) {
        var me = this;
        this.settings.success = function(response) {
            me.refreshInput();
            if (callback) {
                callback(response);
            }
        };
        return this;
    };
    // handle when upload success
    Uploader.prototype.error = function(callback) {
        var me = this;
        this.settings.error = function(response) {
            if (callback) {
                me.refreshInput();
                callback(response);
            }
        };
        return this;
    };
    // enable
    Uploader.prototype.enable = function() {
        this.input.prop("disabled", false);
    };
    // disable
    Uploader.prototype.disable = function() {
        this.input.prop("disabled", true);
    };
    // Helpers
    // -------------
    function isString(val) {
        return Object.prototype.toString.call(val) === "[object String]";
    }
    function createInputs(data) {
        if (!data) return [];
        var inputs = [], i;
        for (var name in data) {
            i = document.createElement("input");
            i.type = "hidden";
            i.name = name;
            i.value = data[name];
            inputs.push(i);
        }
        return inputs;
    }
    function parse(str) {
        if (!str) return {};
        var ret = {};
        var pairs = str.split("&");
        var unescape = function(s) {
            return decodeURIComponent(s.replace(/\+/g, " "));
        };
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i].split("=");
            var key = unescape(pair[0]);
            var val = unescape(pair[1]);
            ret[key] = val;
        }
        return ret;
    }
    function findzIndex($node) {
        var parents = $node.parentsUntil("body");
        var zIndex = 0;
        for (var i = 0; i < parents.length; i++) {
            var item = parents.eq(i);
            if (item.css("position") !== "static") {
                zIndex = parseInt(item.css("zIndex"), 10) || zIndex;
            }
        }
        return zIndex;
    }
    function newIframe() {
        var iframeName = "iframe-uploader-" + iframeCount;
        var iframe = $('<iframe name="' + iframeName + '" />').hide();
        iframeCount += 1;
        return iframe;
    }
    function MultipleUploader(options) {
        if (!(this instanceof MultipleUploader)) {
            return new MultipleUploader(options);
        }
        if (isString(options)) {
            options = {
                trigger: options
            };
        }
        var $trigger = $(options.trigger);
        var uploaders = [];
        $trigger.each(function(i, item) {
            options.trigger = item;
            uploaders.push(new Uploader(options));
        });
        this._uploaders = uploaders;
    }
    MultipleUploader.prototype.submit = function() {
        $.each(this._uploaders, function(i, item) {
            item.submit();
        });
        return this;
    };
    MultipleUploader.prototype.change = function(callback) {
        $.each(this._uploaders, function(i, item) {
            item.change(callback);
        });
        return this;
    };
    MultipleUploader.prototype.success = function(callback) {
        $.each(this._uploaders, function(i, item) {
            item.success(callback);
        });
        return this;
    };
    MultipleUploader.prototype.error = function(callback) {
        $.each(this._uploaders, function(i, item) {
            item.error(callback);
        });
        return this;
    };
    MultipleUploader.prototype.enable = function() {
        $.each(this._uploaders, function(i, item) {
            item.enable();
        });
        return this;
    };
    MultipleUploader.prototype.disable = function() {
        $.each(this._uploaders, function(i, item) {
            item.disable();
        });
        return this;
    };
    MultipleUploader.Uploader = Uploader;
    module.exports = MultipleUploader;
});

define("app/admin/auction/auctionDialog-debug.handlebars", [ "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.0.2/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 3, ">= 1.0.0-rc.4" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        var buffer = "", stack1, stack2, options, self = this, functionType = "function", escapeExpression = this.escapeExpression, helperMissing = helpers.helperMissing;
        function program1(depth0, data) {
            return '\r\n                <h2 class="tit">添加拍卖</h2>\r\n            ';
        }
        function program3(depth0, data) {
            return '\r\n                <h2 class="tit">编辑拍卖</h2>\r\n            ';
        }
        function program5(depth0, data) {
            return "checked";
        }
        buffer += '<div class="modal-body">\r\n    <div class="comm-mod5 comm-mod5-ex3">\r\n        <div class="mod-hd">\r\n            ';
        stack1 = helpers["if"].call(depth0, depth0.idAdd, {
            hash: {},
            inverse: self.program(3, program3, data),
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += '\r\n        </div>\r\n        <div class="mod-bd">\r\n            <div class="comm-table2 comm-table2-ex3">\r\n                <form id="J_Dialog_Form">\r\n                <input type="hidden" name="id" value="';
        if (stack1 = helpers.id) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.id;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + '">\r\n                <table class="table">\r\n                    <tbody>\r\n                    <tr>\r\n                        <th>主题：</th>\r\n                        <td><div class="form-group form-group-inline">\r\n                            <input type="text" class="form-control form-control-w45" name="title" value="';
        if (stack1 = helpers.title) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.title;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + '" autocomplete="off" maxlength="300">\r\n                        </div></td>\r\n                    </tr>\r\n                    <tr>\r\n                        <th>详情：</th>\r\n                        <td><div class="form-group">\r\n                            <textarea class="form-control form-control-w45" rows="3" name="details" maxlength="1500">';
        if (stack1 = helpers.details) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.details;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + '</textarea>\r\n                        </div></td>\r\n                    </tr>\r\n                    <tr>\r\n                        <th>开始时间：</th>\r\n                        <td><div class="td-box">\r\n                            <div class="form-group form-group-inline">\r\n                                <input class="form-control form-control-date form-control-w16" name="startTime" id="J_Dialog_StartTime" value="';
        if (stack1 = helpers.startTime) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.startTime;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + '" readonly style="cursor: pointer;">\r\n                            </div>\r\n                            <div class="td-box-r">\r\n                                <div class="form-group form-group-inline" style="margin-right:55px;">\r\n                                    <label>竞拍模式时间：</label>\r\n                                    <input class="form-control form-control-date form-control-w16" name="auctionTime" id="J_Dialog_AuctionTime" value="';
        if (stack1 = helpers.auctionTime) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.auctionTime;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + '" readonly style="cursor: pointer;">\r\n                                </div>\r\n                            </div>\r\n                        </div></td>\r\n                    </tr>\r\n                    <tr>\r\n                        <th>场次：</th>\r\n                        <td>\r\n                            <div class="form-group form-group-inline">\r\n                                <span class="radio-s"><label class="radio-inline"><input type="radio" name="base" value="3" ';
        options = {
            hash: {},
            inverse: self.noop,
            fn: self.program(5, program5, data),
            data: data
        };
        stack2 = (stack1 = helpers.judge, stack1 ? stack1.call(depth0, depth0.base, "3", options) : helperMissing.call(depth0, "judge", depth0.base, "3", options));
        if (stack2 || stack2 === 0) {
            buffer += stack2;
        }
        buffer += '> 全部 </label></span>\r\n                                <span class="radio-s"><label class="radio-inline"><input type="radio" name="base" value="1" ';
        options = {
            hash: {},
            inverse: self.noop,
            fn: self.program(5, program5, data),
            data: data
        };
        stack2 = (stack1 = helpers.judge, stack1 ? stack1.call(depth0, depth0.base, "1", options) : helperMissing.call(depth0, "judge", depth0.base, "1", options));
        if (stack2 || stack2 === 0) {
            buffer += stack2;
        }
        buffer += '> 福州 </label></span>\r\n                                <span class="radio-s"><label class="radio-inline"><input type="radio" name="base" value="2" ';
        options = {
            hash: {},
            inverse: self.noop,
            fn: self.program(5, program5, data),
            data: data
        };
        stack2 = (stack1 = helpers.judge, stack1 ? stack1.call(depth0, depth0.base, "2", options) : helperMissing.call(depth0, "judge", depth0.base, "2", options));
        if (stack2 || stack2 === 0) {
            buffer += stack2;
        }
        buffer += '> 北京 </label></span>\r\n                            </div>\r\n                            <span class="help-block"><span class="c-red">注：结束时间会根据物品数以及竞拍模式时间自动计算</span></span>\r\n                        </td>\r\n                    </tr>\r\n                    <tr>\r\n                        <th></th>\r\n                        <td>\r\n                            <div class="form-group form-group-inline"><p class="validatorError help-block"></p></div>\r\n                        </td>\r\n                    </tr>\r\n                    </tbody>\r\n                </table>\r\n                </form>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>';
        return buffer;
    });
});

define("app/admin/auction/auctionList-debug.handlebars", [ "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.0.2/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 3, ">= 1.0.0-rc.4" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        var stack1, functionType = "function", escapeExpression = this.escapeExpression, helperMissing = helpers.helperMissing, self = this;
        function program1(depth0, data) {
            var buffer = "", stack1, stack2, options;
            buffer += '\r\n    <div class="comm-table table-operate mt20">\r\n        <table class="table table-bordered table-striped">\r\n            <tbody>\r\n            <tr>\r\n                <td><div class="text">\r\n                    <h2>';
            if (stack1 = helpers.title) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.title;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '</h2>\r\n                    <div class="tit"><span class="jp">奖品数：';
            if (stack1 = helpers.awardCount) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.awardCount;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '</span><span class="name">';
            if (stack1 = helpers.createUsername) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.createUsername;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '</span><span class="time">';
            options = {
                hash: {},
                data: data
            };
            buffer += escapeExpression((stack1 = helpers.fdate, stack1 ? stack1.call(depth0, depth0.createTime, options) : helperMissing.call(depth0, "fdate", depth0.createTime, options))) + '</span></div>\r\n                    <p class="con">';
            if (stack2 = helpers.details) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.details;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + '</p>\r\n                </div>\r\n                    <div class="control-box-c2">\r\n                        <div class="top-box-c2">\r\n                            <button class="btn btn5 btn-s ';
            options = {
                hash: {},
                data: data
            };
            buffer += escapeExpression((stack1 = helpers.getBtnStatus, stack1 ? stack1.call(depth0, depth0.auctionState, depth0.startTime, "edit", options) : helperMissing.call(depth0, "getBtnStatus", depth0.auctionState, depth0.startTime, "edit", options))) + '" data-id="';
            if (stack2 = helpers.id) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.id;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + '" data-role="edit">编辑基本信息</button>\r\n                            <button class="btn btn5 btn-s ';
            options = {
                hash: {},
                data: data
            };
            buffer += escapeExpression((stack1 = helpers.getBtnStatus, stack1 ? stack1.call(depth0, depth0.auctionState, depth0.startTime, "manage", options) : helperMissing.call(depth0, "getBtnStatus", depth0.auctionState, depth0.startTime, "manage", options))) + '" data-id="';
            if (stack2 = helpers.id) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.id;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + '" data-role="manage">管理奖品</button>\r\n                            <button class="btn btn5 btn-s ';
            options = {
                hash: {},
                data: data
            };
            buffer += escapeExpression((stack1 = helpers.getBtnStatus, stack1 ? stack1.call(depth0, depth0.auctionState, depth0.startTime, "get", options) : helperMissing.call(depth0, "getBtnStatus", depth0.auctionState, depth0.startTime, "get", options))) + '" data-id="';
            if (stack2 = helpers.id) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.id;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + '" data-role="get" >查看竞拍结果</button>\r\n                            <button class="btn btn5 btn-s ';
            options = {
                hash: {},
                data: data
            };
            buffer += escapeExpression((stack1 = helpers.getBtnStatus, stack1 ? stack1.call(depth0, depth0.auctionState, depth0.startTime, "del", options) : helperMissing.call(depth0, "getBtnStatus", depth0.auctionState, depth0.startTime, "del", options))) + '" data-id="';
            if (stack2 = helpers.id) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.id;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + '" data-role="del" >删除</button>\r\n                        </div>\r\n                    </div></td>\r\n                <td class="zhuangtai"><div>\r\n                    <p>· 状态： ';
            options = {
                hash: {},
                data: data
            };
            stack2 = (stack1 = helpers.getState, stack1 ? stack1.call(depth0, depth0.auctionState, options) : helperMissing.call(depth0, "getState", depth0.auctionState, options));
            if (stack2 || stack2 === 0) {
                buffer += stack2;
            }
            buffer += '</p>\r\n                    <p>· 开始时间： <span class="c-red">';
            options = {
                hash: {},
                data: data
            };
            buffer += escapeExpression((stack1 = helpers.fdate, stack1 ? stack1.call(depth0, depth0.startTime, options) : helperMissing.call(depth0, "fdate", depth0.startTime, options))) + '</span></p>\r\n                    <p>· 竞拍模式时间：<span class="c-red">';
            options = {
                hash: {},
                data: data
            };
            buffer += escapeExpression((stack1 = helpers.fdate, stack1 ? stack1.call(depth0, depth0.auctionTime, options) : helperMissing.call(depth0, "fdate", depth0.auctionTime, options))) + "</span></p>\r\n                    <p>· 预计结束时间：";
            options = {
                hash: {},
                data: data
            };
            buffer += escapeExpression((stack1 = helpers.fdate, stack1 ? stack1.call(depth0, depth0.endTime, options) : helperMissing.call(depth0, "fdate", depth0.endTime, options))) + "</p>\r\n                </div></td>\r\n            </tr>\r\n            </tbody>\r\n        </table>\r\n    </div>\r\n";
            return buffer;
        }
        stack1 = helpers.each.call(depth0, depth0.listData, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            return stack1;
        } else {
            return "";
        }
    });
});

define("app/admin/auction/awardForm-debug.handlebars", [ "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.0.2/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 3, ">= 1.0.0-rc.4" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        var buffer = "", stack1, functionType = "function", escapeExpression = this.escapeExpression, self = this;
        function program1(depth0, data) {
            return '\r\n        <h2 class="tit">编辑物品</h2>\r\n    ';
        }
        function program3(depth0, data) {
            return '\r\n        <h2 class="tit">添加物品</h2>\r\n    ';
        }
        function program5(depth0, data) {
            var buffer = "", stack1;
            buffer += '\r\n            <tr>\r\n                <th>物品数：</th>\r\n                <td><div class="form-group">\r\n                    <input type="text" class="form-control form-control-w12" name="awardNum" value="';
            if (stack1 = helpers.awardNum) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.awardNum;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '">\r\n                </div></td>\r\n            </tr>\r\n            ';
            return buffer;
        }
        function program7(depth0, data) {
            return '\r\n        <button type="button" class="btn btn2" id="J_AwardForm_Save">确定</button>\r\n        <button type="button" class="btn btn2" id="J_AwardForm_Cancel">取消</button>\r\n    ';
        }
        function program9(depth0, data) {
            var buffer = "", stack1;
            buffer += '\r\n        <button type="button" class="btn btn2" id="J_AwardForm_Add">添加</button>\r\n        <span class="btn btn3 control-box-c2" id="J_AwardForm_Imports" data-auctionId="';
            if (stack1 = helpers.auctionId) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.auctionId;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '">批量添加</span>\r\n    ';
            return buffer;
        }
        buffer += '<div class="mod-hd">\r\n    ';
        stack1 = helpers["if"].call(depth0, depth0.isEdit, {
            hash: {},
            inverse: self.program(3, program3, data),
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += '\r\n</div>\r\n<div class="mod-bd">\r\n    <div class="comm-table2 comm-table2-ex3">\r\n        <form id="J_AwardForm">\r\n        <table class="table">\r\n            <tbody>\r\n            <tr>\r\n                <th>名称：</th>\r\n                <td><div class="form-group form-group-inline">\r\n                    <input type="text" class="form-control form-control-w28" name="name" maxlength="300" value="';
        if (stack1 = helpers.name) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.name;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + '">\r\n                    <input type="hidden" name="auctionId" value="';
        if (stack1 = helpers.auctionId) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.auctionId;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + '">\r\n                    <input type="hidden" name="id" value="';
        if (stack1 = helpers.id) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.id;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + '">\r\n                </div></td>\r\n            </tr>\r\n            <tr>\r\n                <th>描述：</th>\r\n                <td><div class="form-group">\r\n                    <textarea class="form-control form-control-w28" rows="3" name="description" maxlength="1500">';
        if (stack1 = helpers.description) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.description;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + '</textarea>\r\n                </div></td>\r\n            </tr>\r\n            <tr>\r\n                <th>图片：</th>\r\n                <td>\r\n                    <div class="form-group form-group-inline">\r\n                        <input type="text" class="form-control form-control-w2" name="image" value="';
        if (stack1 = helpers.image) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.image;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + '" readonly>\r\n                        <button type="button" class="btn btn2 btn-s3" id="J_AwardForm_Upload">上传</button>\r\n                    </div>\r\n                    <p>图片建议尺寸308*216，最大100K</p>\r\n                </td>\r\n            </tr>\r\n            <tr>\r\n                <th>价格：</th>\r\n                <td><div class="form-group form-group-inline">\r\n                    <input type="text" class="form-control form-control-w12" name="price" value="';
        if (stack1 = helpers.price) {
            stack1 = stack1.call(depth0, {
                hash: {},
                data: data
            });
        } else {
            stack1 = depth0.price;
            stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
        }
        buffer += escapeExpression(stack1) + '"> 元\r\n                </div></td>\r\n            </tr>\r\n            ';
        stack1 = helpers.unless.call(depth0, depth0.isEdit, {
            hash: {},
            inverse: self.noop,
            fn: self.program(5, program5, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += '\r\n            <tr>\r\n                <th></th>\r\n                <td>\r\n                    <div class="form-group form-group-inline"><p class="validatorError help-block"></p></div>\r\n                </td>\r\n            </tr>\r\n            </tbody>\r\n        </table>\r\n        </form>\r\n    </div>\r\n</div>\r\n<div class="modal-footer form-group mt20">\r\n    ';
        stack1 = helpers["if"].call(depth0, depth0.isEdit, {
            hash: {},
            inverse: self.program(9, program9, data),
            fn: self.program(7, program7, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "\r\n</div>";
        return buffer;
    });
});

define("app/admin/auction/awardList-debug.handlebars", [ "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.0.2/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 3, ">= 1.0.0-rc.4" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        var buffer = "", stack1, helperMissing = helpers.helperMissing, escapeExpression = this.escapeExpression, functionType = "function", self = this;
        function program1(depth0, data) {
            var buffer = "", stack1, stack2, options;
            buffer += '\r\n                <li class="item">\r\n                    <div class="pic">\r\n                        <div class="pic"><img src="';
            options = {
                hash: {},
                data: data
            };
            buffer += escapeExpression((stack1 = helpers.getImage, stack1 ? stack1.call(depth0, depth0.image, options) : helperMissing.call(depth0, "getImage", depth0.image, options))) + '" width="120" height="120" alt=""></div>\r\n                    </div>\r\n                    <div class="text">\r\n                        <h3 class="tit">';
            if (stack2 = helpers.name) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.name;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + '<span class="money">￥';
            if (stack2 = helpers.price) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.price;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + '</span></h3>\r\n                        <p class="con">';
            if (stack2 = helpers.description) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.description;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + '</p>\r\n                    </div>\r\n                    <div class="button">\r\n                        <div class="top-box-c2">\r\n                            <button class="btn btn5 btn-s" data-role="edit" data-id="';
            if (stack2 = helpers.id) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.id;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + '">编辑</button>\r\n                        </div>\r\n                        <div class="top-box-c2 mt10">\r\n                            <button class="btn btn5 btn-s" data-role="del" data-id="';
            if (stack2 = helpers.id) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.id;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + '">删除</button>\r\n                        </div>\r\n                    </div>\r\n                </li>\r\n            ';
            return buffer;
        }
        buffer += '<div class="mod-hd">\r\n    <h2 class="tit">物品列表</h2>\r\n    <button type="button" class="btn btn2 btn-sm" id="J_Sort">排序</button>\r\n</div>\r\n<div class="mod-bd">\r\n    <div class="tab-xxgl-con">\r\n        <ul class="wuping-list">\r\n            ';
        stack1 = helpers.each.call(depth0, depth0, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "\r\n        </ul>\r\n    </div>\r\n</div>";
        return buffer;
    });
});

define("app/admin/auction/awardSort-debug.handlebars", [ "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.0.2/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 3, ">= 1.0.0-rc.4" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        var buffer = "", stack1, functionType = "function", escapeExpression = this.escapeExpression, helperMissing = helpers.helperMissing, self = this;
        function program1(depth0, data) {
            var buffer = "", stack1;
            buffer += '\r\n        <div class="area2-c1-c2 mt20">\r\n            <div class="hd"><h2 class="tit">';
            if (stack1 = helpers.title) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.title;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + ' <span class="c-gray">';
            if (stack1 = helpers.time) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.time;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '</span></h2></div>\r\n            <div class="bd">\r\n                <ul class="gb-list2 J_Sort_List" style="min-height:144px;">\r\n                    ';
            stack1 = helpers.each.call(depth0, depth0.data, {
                hash: {},
                inverse: self.noop,
                fn: self.program(2, program2, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "\r\n                </ul>\r\n            </div>\r\n        </div>\r\n    ";
            return buffer;
        }
        function program2(depth0, data) {
            var buffer = "", stack1, stack2, options;
            buffer += '\r\n                        <li class="gb-list2-item J_Sort_Item" style="display: block; float: left;" data-id="';
            if (stack1 = helpers.id) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.id;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '">\r\n                            <span class="gb-list2-con">\r\n                                <span class="gb-list2-c1"><img src="';
            options = {
                hash: {},
                data: data
            };
            buffer += escapeExpression((stack1 = helpers.getImage, stack1 ? stack1.call(depth0, depth0.image, options) : helperMissing.call(depth0, "getImage", depth0.image, options))) + '" alt="" width="120" height="120" class="avatar"></span>\r\n                                <span class="gb-list2-c2"><span class="txt">';
            if (stack2 = helpers.name) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.name;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + "</span></span>\r\n                            </span>\r\n                        </li>\r\n                    ";
            return buffer;
        }
        buffer += '<div class="mod-hd">\r\n    <h2 class="tit">物品列表</h2>\r\n    <button type="button" class="btn btn2 btn-sm" id="J_Sort_Back">返回</button>\r\n    <button type="button" class="btn btn2 btn-sm" id="J_Sort_Save">保存</button>\r\n</div>\r\n<div class="mod-bd">\r\n    ';
        stack1 = helpers.each.call(depth0, depth0, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "\r\n</div>";
        return buffer;
    });
});

define("app/admin/auction/manageDialog-debug.handlebars", [ "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.0.2/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 3, ">= 1.0.0-rc.4" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        return '<div class="clearfix" id="J_ManageDialog">\r\n    <div class="modal-content-l">\r\n        <div class="modal-body">\r\n            <div class="comm-mod5 comm-mod5-ex2" id="J_ManageDialog_Left"></div>\r\n        </div>\r\n    </div>\r\n    <div class="modal-content-r">\r\n        <div class="comm-mod4" id="J_ManageDialog_Right"></div>\r\n    </div>\r\n</div>';
    });
});

define("app/admin/auction/resultDialog-debug.handlebars", [ "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.0.2/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 3, ">= 1.0.0-rc.4" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        var buffer = "", stack1, helperMissing = helpers.helperMissing, escapeExpression = this.escapeExpression, functionType = "function", self = this;
        function program1(depth0, data) {
            var buffer = "", stack1, stack2, options;
            buffer += '\r\n                        <tr>\r\n                            <td>\r\n                                <img src="';
            options = {
                hash: {},
                data: data
            };
            buffer += escapeExpression((stack1 = helpers.getImage, stack1 ? stack1.call(depth0, depth0.image, options) : helperMissing.call(depth0, "getImage", depth0.image, options))) + '" width="120" height="120" /><br />\r\n                                ';
            if (stack2 = helpers.name) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.name;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + "\r\n                            </td>\r\n                            <td>";
            if (stack2 = helpers.description) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.description;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + "</td>\r\n                            <td>";
            if (stack2 = helpers.price) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.price;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + "</td>\r\n                            <td>";
            if (stack2 = helpers.leaderName) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.leaderName;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + " </td>\r\n                            <td>";
            if (stack2 = helpers.winScore) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.winScore;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + "</td>\r\n                        </tr>\r\n                    ";
            return buffer;
        }
        buffer += '<div class="comm-mod5 comm-mod5-ex3">\r\n    <div class="mod-hd">\r\n        <h2 class="tit">物品列表</h2>\r\n    </div>\r\n    <div class="mod-bd">\r\n        <div class="comm-table">\r\n            <table class="table table-bordered table-striped">\r\n                <thead>\r\n                <tr>\r\n                    <th>物品名称</th>\r\n                    <th>物品描述</th>\r\n                    <th>价格</th>\r\n                    <th>最终拍卖者</th>\r\n                    <th>积分</th>\r\n                </tr>\r\n                </thead>\r\n                <tbody>\r\n                    ';
        stack1 = helpers.each.call(depth0, depth0, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            buffer += stack1;
        }
        buffer += "\r\n                </tbody>\r\n            </table>\r\n        </div>\r\n    </div>\r\n</div>";
        return buffer;
    });
});

define("keenwon/jqPaginator/1.1.0/jqPaginator-debug", [ "$-debug" ], function(require) {
    var jQuery = require("$-debug");
    (function($) {
        "use strict";
        $.jqPaginator = function(el, options) {
            if (!(this instanceof $.jqPaginator)) {
                return new $.jqPaginator(el, options);
            }
            var self = this;
            self.$container = $(el);
            self.$container.data("jqPaginator", self);
            self.init = function() {
                if (options.first || options.prev || options.next || options.last || options.page) {
                    options = $.extend({}, {
                        first: "",
                        prev: "",
                        next: "",
                        last: "",
                        page: ""
                    }, options);
                }
                self.options = $.extend({}, $.jqPaginator.defaultOptions, options);
                self.verify();
                self.extendJquery();
                self.render();
                self.fireEvent(this.options.currentPage, "init");
            };
            self.verify = function() {
                var opts = self.options;
                if (!opts.totalPages && !opts.totalCounts) {
                    throw new Error("[jqPaginator] totalCounts or totalPages is required");
                }
                if (!opts.totalPages && opts.totalCounts && !opts.pageSize) {
                    throw new Error("[jqPaginator] pageSize is required");
                }
                if (opts.totalCounts && opts.pageSize) {
                    opts.totalPages = Math.ceil(opts.totalCounts / opts.pageSize);
                }
                if (opts.currentPage < 1 || opts.currentPage > opts.totalPages) {
                    throw new Error("[jqPaginator] currentPage is incorrect");
                }
                if (opts.totalPages < 1) {
                    throw new Error("[jqPaginator] totalPages cannot be less currentPage");
                }
            };
            self.extendJquery = function() {
                $.fn.jqPaginatorHTML = function(s) {
                    return s ? this.before(s).remove() : $("<p>").append(this.eq(0).clone()).html();
                };
            };
            self.render = function() {
                self.renderHtml();
                self.setStatus();
                self.bindEvents();
            };
            self.renderHtml = function() {
                var html = [];
                var pages = self.getPages();
                for (var i = 0, j = pages.length; i < j; i++) {
                    html.push(self.buildItem("page", pages[i]));
                }
                self.isEnable("prev") && html.unshift(self.buildItem("prev", self.options.currentPage - 1));
                self.isEnable("first") && html.unshift(self.buildItem("first", 1));
                self.isEnable("statistics") && html.unshift(self.buildItem("statistics"));
                self.isEnable("next") && html.push(self.buildItem("next", self.options.currentPage + 1));
                self.isEnable("last") && html.push(self.buildItem("last", self.options.totalPages));
                if (self.options.wrapper) {
                    self.$container.html($(self.options.wrapper).html(html.join("")).jqPaginatorHTML());
                } else {
                    self.$container.html(html.join(""));
                }
            };
            self.buildItem = function(type, pageData) {
                var html = self.options[type].replace(/{{page}}/g, pageData).replace(/{{totalPages}}/g, self.options.totalPages).replace(/{{totalCounts}}/g, self.options.totalCounts);
                return $(html).attr({
                    "jp-role": type,
                    "jp-data": pageData
                }).jqPaginatorHTML();
            };
            self.setStatus = function() {
                var options = self.options;
                if (!self.isEnable("first") || options.currentPage === 1) {
                    $("[jp-role=first]", self.$container).addClass(options.disableClass);
                }
                if (!self.isEnable("prev") || options.currentPage === 1) {
                    $("[jp-role=prev]", self.$container).addClass(options.disableClass);
                }
                if (!self.isEnable("next") || options.currentPage >= options.totalPages) {
                    $("[jp-role=next]", self.$container).addClass(options.disableClass);
                }
                if (!self.isEnable("last") || options.currentPage >= options.totalPages) {
                    $("[jp-role=last]", self.$container).addClass(options.disableClass);
                }
                $("[jp-role=page]", self.$container).removeClass(options.activeClass);
                $("[jp-role=page][jp-data=" + options.currentPage + "]", self.$container).addClass(options.activeClass);
            };
            self.getPages = function() {
                var pages = [], visiblePages = self.options.visiblePages, currentPage = self.options.currentPage, totalPages = self.options.totalPages;
                if (visiblePages > totalPages) {
                    visiblePages = totalPages;
                }
                var half = Math.floor(visiblePages / 2);
                var start = currentPage - half + 1 - visiblePages % 2;
                var end = currentPage + half;
                if (start < 1) {
                    start = 1;
                    end = visiblePages;
                }
                if (end > totalPages) {
                    end = totalPages;
                    start = 1 + totalPages - visiblePages;
                }
                var itPage = start;
                while (itPage <= end) {
                    pages.push(itPage);
                    itPage++;
                }
                return pages;
            };
            self.isEnable = function(type) {
                return self.options[type] && typeof self.options[type] === "string";
            };
            self.switchPage = function(pageIndex) {
                self.options.currentPage = pageIndex;
                self.render();
            };
            self.fireEvent = function(pageIndex, type) {
                return typeof self.options.onPageChange !== "function" || self.options.onPageChange(pageIndex, type) !== false;
            };
            self.callMethod = function(method, options) {
                switch (method) {
                  case "option":
                    self.options = $.extend({}, self.options, options);
                    self.verify();
                    self.render();
                    break;

                  case "destroy":
                    self.$container.empty();
                    self.$container.removeData("jqPaginator");
                    break;

                  default:
                    throw new Error('[jqPaginator] method "' + method + '" does not exist');
                }
                return self.$container;
            };
            self.bindEvents = function() {
                var opts = self.options;
                self.$container.off();
                self.$container.on("click", "[jp-role]", function() {
                    var $el = $(this);
                    if ($el.hasClass(opts.disableClass) || $el.hasClass(opts.activeClass)) {
                        return;
                    }
                    var pageIndex = +$el.attr("jp-data");
                    if (self.fireEvent(pageIndex, "change")) {
                        self.switchPage(pageIndex);
                    }
                });
            };
            self.init();
            return self.$container;
        };
        $.jqPaginator.defaultOptions = {
            wrapper: "",
            first: '<li class="first"><a href="javascript:;">First</a></li>',
            prev: '<li class="prev"><a href="javascript:;">Previous</a></li>',
            next: '<li class="next"><a href="javascript:;">Next</a></li>',
            last: '<li class="last"><a href="javascript:;">Last</a></li>',
            page: '<li class="page"><a href="javascript:;">{{page}}</a></li>',
            totalPages: 0,
            totalCounts: 0,
            pageSize: 0,
            currentPage: 1,
            visiblePages: 7,
            disableClass: "disabled",
            activeClass: "active",
            onPageChange: null
        };
        $.fn.jqPaginator = function() {
            var self = this, args = Array.prototype.slice.call(arguments);
            if (typeof args[0] === "string") {
                var $instance = $(self).data("jqPaginator");
                if (!$instance) {
                    throw new Error("[jqPaginator] the element is not instantiated");
                } else {
                    return $instance.callMethod(args[0], args[1]);
                }
            } else {
                return new $.jqPaginator(this, args[0]);
            }
        };
    })(jQuery);
});

define("keenwon/dragsort/0.5.1/dragsort-debug", [ "$" ], function(require) {
    var jQuery = require("$");
    (function($, undefined) {
        var uuid = 0, runiqueId = /^ui-id-\d+$/;
        // $.ui might exist from components with no dependencies, e.g., $.ui.position
        $.ui = $.ui || {};
        $.extend($.ui, {
            version: "1.10.4",
            keyCode: {
                BACKSPACE: 8,
                COMMA: 188,
                DELETE: 46,
                DOWN: 40,
                END: 35,
                ENTER: 13,
                ESCAPE: 27,
                HOME: 36,
                LEFT: 37,
                NUMPAD_ADD: 107,
                NUMPAD_DECIMAL: 110,
                NUMPAD_DIVIDE: 111,
                NUMPAD_ENTER: 108,
                NUMPAD_MULTIPLY: 106,
                NUMPAD_SUBTRACT: 109,
                PAGE_DOWN: 34,
                PAGE_UP: 33,
                PERIOD: 190,
                RIGHT: 39,
                SPACE: 32,
                TAB: 9,
                UP: 38
            }
        });
        // plugins
        $.fn.extend({
            focus: function(orig) {
                return function(delay, fn) {
                    return typeof delay === "number" ? this.each(function() {
                        var elem = this;
                        setTimeout(function() {
                            $(elem).focus();
                            if (fn) {
                                fn.call(elem);
                            }
                        }, delay);
                    }) : orig.apply(this, arguments);
                };
            }($.fn.focus),
            scrollParent: function() {
                var scrollParent;
                if ($.ui.ie && /(static|relative)/.test(this.css("position")) || /absolute/.test(this.css("position"))) {
                    scrollParent = this.parents().filter(function() {
                        return /(relative|absolute|fixed)/.test($.css(this, "position")) && /(auto|scroll)/.test($.css(this, "overflow") + $.css(this, "overflow-y") + $.css(this, "overflow-x"));
                    }).eq(0);
                } else {
                    scrollParent = this.parents().filter(function() {
                        return /(auto|scroll)/.test($.css(this, "overflow") + $.css(this, "overflow-y") + $.css(this, "overflow-x"));
                    }).eq(0);
                }
                return /fixed/.test(this.css("position")) || !scrollParent.length ? $(document) : scrollParent;
            },
            zIndex: function(zIndex) {
                if (zIndex !== undefined) {
                    return this.css("zIndex", zIndex);
                }
                if (this.length) {
                    var elem = $(this[0]), position, value;
                    while (elem.length && elem[0] !== document) {
                        // Ignore z-index if position is set to a value where z-index is ignored by the browser
                        // This makes behavior of this function consistent across browsers
                        // WebKit always returns auto if the element is positioned
                        position = elem.css("position");
                        if (position === "absolute" || position === "relative" || position === "fixed") {
                            // IE returns 0 when zIndex is not specified
                            // other browsers return a string
                            // we ignore the case of nested elements with an explicit value of 0
                            // <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
                            value = parseInt(elem.css("zIndex"), 10);
                            if (!isNaN(value) && value !== 0) {
                                return value;
                            }
                        }
                        elem = elem.parent();
                    }
                }
                return 0;
            },
            uniqueId: function() {
                return this.each(function() {
                    if (!this.id) {
                        this.id = "ui-id-" + ++uuid;
                    }
                });
            },
            removeUniqueId: function() {
                return this.each(function() {
                    if (runiqueId.test(this.id)) {
                        $(this).removeAttr("id");
                    }
                });
            }
        });
        // selectors
        function focusable(element, isTabIndexNotNaN) {
            var map, mapName, img, nodeName = element.nodeName.toLowerCase();
            if ("area" === nodeName) {
                map = element.parentNode;
                mapName = map.name;
                if (!element.href || !mapName || map.nodeName.toLowerCase() !== "map") {
                    return false;
                }
                img = $("img[usemap=#" + mapName + "]")[0];
                return !!img && visible(img);
            }
            return (/input|select|textarea|button|object/.test(nodeName) ? !element.disabled : "a" === nodeName ? element.href || isTabIndexNotNaN : isTabIndexNotNaN) && // the element and all of its ancestors must be visible
            visible(element);
        }
        function visible(element) {
            return $.expr.filters.visible(element) && !$(element).parents().addBack().filter(function() {
                return $.css(this, "visibility") === "hidden";
            }).length;
        }
        $.extend($.expr[":"], {
            data: $.expr.createPseudo ? $.expr.createPseudo(function(dataName) {
                return function(elem) {
                    return !!$.data(elem, dataName);
                };
            }) : // support: jQuery <1.8
            function(elem, i, match) {
                return !!$.data(elem, match[3]);
            },
            focusable: function(element) {
                return focusable(element, !isNaN($.attr(element, "tabindex")));
            },
            tabbable: function(element) {
                var tabIndex = $.attr(element, "tabindex"), isTabIndexNaN = isNaN(tabIndex);
                return (isTabIndexNaN || tabIndex >= 0) && focusable(element, !isTabIndexNaN);
            }
        });
        // support: jQuery <1.8
        if (!$("<a>").outerWidth(1).jquery) {
            $.each([ "Width", "Height" ], function(i, name) {
                var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ], type = name.toLowerCase(), orig = {
                    innerWidth: $.fn.innerWidth,
                    innerHeight: $.fn.innerHeight,
                    outerWidth: $.fn.outerWidth,
                    outerHeight: $.fn.outerHeight
                };
                function reduce(elem, size, border, margin) {
                    $.each(side, function() {
                        size -= parseFloat($.css(elem, "padding" + this)) || 0;
                        if (border) {
                            size -= parseFloat($.css(elem, "border" + this + "Width")) || 0;
                        }
                        if (margin) {
                            size -= parseFloat($.css(elem, "margin" + this)) || 0;
                        }
                    });
                    return size;
                }
                $.fn["inner" + name] = function(size) {
                    if (size === undefined) {
                        return orig["inner" + name].call(this);
                    }
                    return this.each(function() {
                        $(this).css(type, reduce(this, size) + "px");
                    });
                };
                $.fn["outer" + name] = function(size, margin) {
                    if (typeof size !== "number") {
                        return orig["outer" + name].call(this, size);
                    }
                    return this.each(function() {
                        $(this).css(type, reduce(this, size, true, margin) + "px");
                    });
                };
            });
        }
        // support: jQuery <1.8
        if (!$.fn.addBack) {
            $.fn.addBack = function(selector) {
                return this.add(selector == null ? this.prevObject : this.prevObject.filter(selector));
            };
        }
        // support: jQuery 1.6.1, 1.6.2 (http://bugs.jquery.com/ticket/9413)
        if ($("<a>").data("a-b", "a").removeData("a-b").data("a-b")) {
            $.fn.removeData = function(removeData) {
                return function(key) {
                    if (arguments.length) {
                        return removeData.call(this, $.camelCase(key));
                    } else {
                        return removeData.call(this);
                    }
                };
            }($.fn.removeData);
        }
        // deprecated
        $.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase());
        $.support.selectstart = "onselectstart" in document.createElement("div");
        $.fn.extend({
            disableSelection: function() {
                return this.bind(($.support.selectstart ? "selectstart" : "mousedown") + ".ui-disableSelection", function(event) {
                    event.preventDefault();
                });
            },
            enableSelection: function() {
                return this.unbind(".ui-disableSelection");
            }
        });
        $.extend($.ui, {
            // $.ui.plugin is deprecated. Use $.widget() extensions instead.
            plugin: {
                add: function(module, option, set) {
                    var i, proto = $.ui[module].prototype;
                    for (i in set) {
                        proto.plugins[i] = proto.plugins[i] || [];
                        proto.plugins[i].push([ option, set[i] ]);
                    }
                },
                call: function(instance, name, args) {
                    var i, set = instance.plugins[name];
                    if (!set || !instance.element[0].parentNode || instance.element[0].parentNode.nodeType === 11) {
                        return;
                    }
                    for (i = 0; i < set.length; i++) {
                        if (instance.options[set[i][0]]) {
                            set[i][1].apply(instance.element, args);
                        }
                    }
                }
            },
            // only used by resizable
            hasScroll: function(el, a) {
                //If overflow is hidden, the element might have extra content, but the user wants to hide it
                if ($(el).css("overflow") === "hidden") {
                    return false;
                }
                var scroll = a && a === "left" ? "scrollLeft" : "scrollTop", has = false;
                if (el[scroll] > 0) {
                    return true;
                }
                // TODO: determine which cases actually cause this to happen
                // if the element doesn't have the scroll set, see if it's possible to
                // set the scroll
                el[scroll] = 1;
                has = el[scroll] > 0;
                el[scroll] = 0;
                return has;
            }
        });
    })(jQuery);
    (function($, undefined) {
        var uuid = 0, slice = Array.prototype.slice, _cleanData = $.cleanData;
        $.cleanData = function(elems) {
            for (var i = 0, elem; (elem = elems[i]) != null; i++) {
                try {
                    $(elem).triggerHandler("remove");
                } catch (e) {}
            }
            _cleanData(elems);
        };
        $.widget = function(name, base, prototype) {
            var fullName, existingConstructor, constructor, basePrototype, // proxiedPrototype allows the provided prototype to remain unmodified
            // so that it can be used as a mixin for multiple widgets (#8876)
            proxiedPrototype = {}, namespace = name.split(".")[0];
            name = name.split(".")[1];
            fullName = namespace + "-" + name;
            if (!prototype) {
                prototype = base;
                base = $.Widget;
            }
            // create selector for plugin
            $.expr[":"][fullName.toLowerCase()] = function(elem) {
                return !!$.data(elem, fullName);
            };
            $[namespace] = $[namespace] || {};
            existingConstructor = $[namespace][name];
            constructor = $[namespace][name] = function(options, element) {
                // allow instantiation without "new" keyword
                if (!this._createWidget) {
                    return new constructor(options, element);
                }
                // allow instantiation without initializing for simple inheritance
                // must use "new" keyword (the code above always passes args)
                if (arguments.length) {
                    this._createWidget(options, element);
                }
            };
            // extend with the existing constructor to carry over any static properties
            $.extend(constructor, existingConstructor, {
                version: prototype.version,
                // copy the object used to create the prototype in case we need to
                // redefine the widget later
                _proto: $.extend({}, prototype),
                // track widgets that inherit from this widget in case this widget is
                // redefined after a widget inherits from it
                _childConstructors: []
            });
            basePrototype = new base();
            // we need to make the options hash a property directly on the new instance
            // otherwise we'll modify the options hash on the prototype that we're
            // inheriting from
            basePrototype.options = $.widget.extend({}, basePrototype.options);
            $.each(prototype, function(prop, value) {
                if (!$.isFunction(value)) {
                    proxiedPrototype[prop] = value;
                    return;
                }
                proxiedPrototype[prop] = function() {
                    var _super = function() {
                        return base.prototype[prop].apply(this, arguments);
                    }, _superApply = function(args) {
                        return base.prototype[prop].apply(this, args);
                    };
                    return function() {
                        var __super = this._super, __superApply = this._superApply, returnValue;
                        this._super = _super;
                        this._superApply = _superApply;
                        returnValue = value.apply(this, arguments);
                        this._super = __super;
                        this._superApply = __superApply;
                        return returnValue;
                    };
                }();
            });
            constructor.prototype = $.widget.extend(basePrototype, {
                // TODO: remove support for widgetEventPrefix
                // always use the name + a colon as the prefix, e.g., draggable:start
                // don't prefix for widgets that aren't DOM-based
                widgetEventPrefix: existingConstructor ? basePrototype.widgetEventPrefix || name : name
            }, proxiedPrototype, {
                constructor: constructor,
                namespace: namespace,
                widgetName: name,
                widgetFullName: fullName
            });
            // If this widget is being redefined then we need to find all widgets that
            // are inheriting from it and redefine all of them so that they inherit from
            // the new version of this widget. We're essentially trying to replace one
            // level in the prototype chain.
            if (existingConstructor) {
                $.each(existingConstructor._childConstructors, function(i, child) {
                    var childPrototype = child.prototype;
                    // redefine the child widget using the same prototype that was
                    // originally used, but inherit from the new version of the base
                    $.widget(childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto);
                });
                // remove the list of existing child constructors from the old constructor
                // so the old child constructors can be garbage collected
                delete existingConstructor._childConstructors;
            } else {
                base._childConstructors.push(constructor);
            }
            $.widget.bridge(name, constructor);
        };
        $.widget.extend = function(target) {
            var input = slice.call(arguments, 1), inputIndex = 0, inputLength = input.length, key, value;
            for (;inputIndex < inputLength; inputIndex++) {
                for (key in input[inputIndex]) {
                    value = input[inputIndex][key];
                    if (input[inputIndex].hasOwnProperty(key) && value !== undefined) {
                        // Clone objects
                        if ($.isPlainObject(value)) {
                            target[key] = $.isPlainObject(target[key]) ? $.widget.extend({}, target[key], value) : // Don't extend strings, arrays, etc. with objects
                            $.widget.extend({}, value);
                        } else {
                            target[key] = value;
                        }
                    }
                }
            }
            return target;
        };
        $.widget.bridge = function(name, object) {
            var fullName = object.prototype.widgetFullName || name;
            $.fn[name] = function(options) {
                var isMethodCall = typeof options === "string", args = slice.call(arguments, 1), returnValue = this;
                // allow multiple hashes to be passed on init
                options = !isMethodCall && args.length ? $.widget.extend.apply(null, [ options ].concat(args)) : options;
                if (isMethodCall) {
                    this.each(function() {
                        var methodValue, instance = $.data(this, fullName);
                        if (!instance) {
                            return $.error("cannot call methods on " + name + " prior to initialization; " + "attempted to call method '" + options + "'");
                        }
                        if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
                            return $.error("no such method '" + options + "' for " + name + " widget instance");
                        }
                        methodValue = instance[options].apply(instance, args);
                        if (methodValue !== instance && methodValue !== undefined) {
                            returnValue = methodValue && methodValue.jquery ? returnValue.pushStack(methodValue.get()) : methodValue;
                            return false;
                        }
                    });
                } else {
                    this.each(function() {
                        var instance = $.data(this, fullName);
                        if (instance) {
                            instance.option(options || {})._init();
                        } else {
                            $.data(this, fullName, new object(options, this));
                        }
                    });
                }
                return returnValue;
            };
        };
        $.Widget = function() {};
        $.Widget._childConstructors = [];
        $.Widget.prototype = {
            widgetName: "widget",
            widgetEventPrefix: "",
            defaultElement: "<div>",
            options: {
                disabled: false,
                // callbacks
                create: null
            },
            _createWidget: function(options, element) {
                element = $(element || this.defaultElement || this)[0];
                this.element = $(element);
                this.uuid = uuid++;
                this.eventNamespace = "." + this.widgetName + this.uuid;
                this.options = $.widget.extend({}, this.options, this._getCreateOptions(), options);
                this.bindings = $();
                this.hoverable = $();
                this.focusable = $();
                if (element !== this) {
                    $.data(element, this.widgetFullName, this);
                    this._on(true, this.element, {
                        remove: function(event) {
                            if (event.target === element) {
                                this.destroy();
                            }
                        }
                    });
                    this.document = $(element.style ? // element within the document
                    element.ownerDocument : // element is window or document
                    element.document || element);
                    this.window = $(this.document[0].defaultView || this.document[0].parentWindow);
                }
                this._create();
                this._trigger("create", null, this._getCreateEventData());
                this._init();
            },
            _getCreateOptions: $.noop,
            _getCreateEventData: $.noop,
            _create: $.noop,
            _init: $.noop,
            destroy: function() {
                this._destroy();
                // we can probably remove the unbind calls in 2.0
                // all event bindings should go through this._on()
                this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData($.camelCase(this.widgetFullName));
                this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName + "-disabled " + "ui-state-disabled");
                // clean up events and states
                this.bindings.unbind(this.eventNamespace);
                this.hoverable.removeClass("ui-state-hover");
                this.focusable.removeClass("ui-state-focus");
            },
            _destroy: $.noop,
            widget: function() {
                return this.element;
            },
            option: function(key, value) {
                var options = key, parts, curOption, i;
                if (arguments.length === 0) {
                    // don't return a reference to the internal hash
                    return $.widget.extend({}, this.options);
                }
                if (typeof key === "string") {
                    // handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
                    options = {};
                    parts = key.split(".");
                    key = parts.shift();
                    if (parts.length) {
                        curOption = options[key] = $.widget.extend({}, this.options[key]);
                        for (i = 0; i < parts.length - 1; i++) {
                            curOption[parts[i]] = curOption[parts[i]] || {};
                            curOption = curOption[parts[i]];
                        }
                        key = parts.pop();
                        if (arguments.length === 1) {
                            return curOption[key] === undefined ? null : curOption[key];
                        }
                        curOption[key] = value;
                    } else {
                        if (arguments.length === 1) {
                            return this.options[key] === undefined ? null : this.options[key];
                        }
                        options[key] = value;
                    }
                }
                this._setOptions(options);
                return this;
            },
            _setOptions: function(options) {
                var key;
                for (key in options) {
                    this._setOption(key, options[key]);
                }
                return this;
            },
            _setOption: function(key, value) {
                this.options[key] = value;
                if (key === "disabled") {
                    this.widget().toggleClass(this.widgetFullName + "-disabled ui-state-disabled", !!value).attr("aria-disabled", value);
                    this.hoverable.removeClass("ui-state-hover");
                    this.focusable.removeClass("ui-state-focus");
                }
                return this;
            },
            enable: function() {
                return this._setOption("disabled", false);
            },
            disable: function() {
                return this._setOption("disabled", true);
            },
            _on: function(suppressDisabledCheck, element, handlers) {
                var delegateElement, instance = this;
                // no suppressDisabledCheck flag, shuffle arguments
                if (typeof suppressDisabledCheck !== "boolean") {
                    handlers = element;
                    element = suppressDisabledCheck;
                    suppressDisabledCheck = false;
                }
                // no element argument, shuffle and use this.element
                if (!handlers) {
                    handlers = element;
                    element = this.element;
                    delegateElement = this.widget();
                } else {
                    // accept selectors, DOM elements
                    element = delegateElement = $(element);
                    this.bindings = this.bindings.add(element);
                }
                $.each(handlers, function(event, handler) {
                    function handlerProxy() {
                        // allow widgets to customize the disabled handling
                        // - disabled as an array instead of boolean
                        // - disabled class as method for disabling individual parts
                        if (!suppressDisabledCheck && (instance.options.disabled === true || $(this).hasClass("ui-state-disabled"))) {
                            return;
                        }
                        return (typeof handler === "string" ? instance[handler] : handler).apply(instance, arguments);
                    }
                    // copy the guid so direct unbinding works
                    if (typeof handler !== "string") {
                        handlerProxy.guid = handler.guid = handler.guid || handlerProxy.guid || $.guid++;
                    }
                    var match = event.match(/^(\w+)\s*(.*)$/), eventName = match[1] + instance.eventNamespace, selector = match[2];
                    if (selector) {
                        delegateElement.delegate(selector, eventName, handlerProxy);
                    } else {
                        element.bind(eventName, handlerProxy);
                    }
                });
            },
            _off: function(element, eventName) {
                eventName = (eventName || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace;
                element.unbind(eventName).undelegate(eventName);
            },
            _delay: function(handler, delay) {
                function handlerProxy() {
                    return (typeof handler === "string" ? instance[handler] : handler).apply(instance, arguments);
                }
                var instance = this;
                return setTimeout(handlerProxy, delay || 0);
            },
            _hoverable: function(element) {
                this.hoverable = this.hoverable.add(element);
                this._on(element, {
                    mouseenter: function(event) {
                        $(event.currentTarget).addClass("ui-state-hover");
                    },
                    mouseleave: function(event) {
                        $(event.currentTarget).removeClass("ui-state-hover");
                    }
                });
            },
            _focusable: function(element) {
                this.focusable = this.focusable.add(element);
                this._on(element, {
                    focusin: function(event) {
                        $(event.currentTarget).addClass("ui-state-focus");
                    },
                    focusout: function(event) {
                        $(event.currentTarget).removeClass("ui-state-focus");
                    }
                });
            },
            _trigger: function(type, event, data) {
                var prop, orig, callback = this.options[type];
                data = data || {};
                event = $.Event(event);
                event.type = (type === this.widgetEventPrefix ? type : this.widgetEventPrefix + type).toLowerCase();
                // the original event may come from any element
                // so we need to reset the target on the new event
                event.target = this.element[0];
                // copy original event properties over to the new event
                orig = event.originalEvent;
                if (orig) {
                    for (prop in orig) {
                        if (!(prop in event)) {
                            event[prop] = orig[prop];
                        }
                    }
                }
                this.element.trigger(event, data);
                return !($.isFunction(callback) && callback.apply(this.element[0], [ event ].concat(data)) === false || event.isDefaultPrevented());
            }
        };
        $.each({
            show: "fadeIn",
            hide: "fadeOut"
        }, function(method, defaultEffect) {
            $.Widget.prototype["_" + method] = function(element, options, callback) {
                if (typeof options === "string") {
                    options = {
                        effect: options
                    };
                }
                var hasOptions, effectName = !options ? method : options === true || typeof options === "number" ? defaultEffect : options.effect || defaultEffect;
                options = options || {};
                if (typeof options === "number") {
                    options = {
                        duration: options
                    };
                }
                hasOptions = !$.isEmptyObject(options);
                options.complete = callback;
                if (options.delay) {
                    element.delay(options.delay);
                }
                if (hasOptions && $.effects && $.effects.effect[effectName]) {
                    element[method](options);
                } else if (effectName !== method && element[effectName]) {
                    element[effectName](options.duration, options.easing, callback);
                } else {
                    element.queue(function(next) {
                        $(this)[method]();
                        if (callback) {
                            callback.call(element[0]);
                        }
                        next();
                    });
                }
            };
        });
    })(jQuery);
    (function($, undefined) {
        var mouseHandled = false;
        $(document).mouseup(function() {
            mouseHandled = false;
        });
        $.widget("ui.mouse", {
            version: "1.10.4",
            options: {
                cancel: "input,textarea,button,select,option",
                distance: 1,
                delay: 0
            },
            _mouseInit: function() {
                var that = this;
                this.element.bind("mousedown." + this.widgetName, function(event) {
                    return that._mouseDown(event);
                }).bind("click." + this.widgetName, function(event) {
                    if (true === $.data(event.target, that.widgetName + ".preventClickEvent")) {
                        $.removeData(event.target, that.widgetName + ".preventClickEvent");
                        event.stopImmediatePropagation();
                        return false;
                    }
                });
                this.started = false;
            },
            // TODO: make sure destroying one instance of mouse doesn't mess with
            // other instances of mouse
            _mouseDestroy: function() {
                this.element.unbind("." + this.widgetName);
                if (this._mouseMoveDelegate) {
                    $(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate);
                }
            },
            _mouseDown: function(event) {
                // don't let more than one widget handle mouseStart
                if (mouseHandled) {
                    return;
                }
                // we may have missed mouseup (out of window)
                this._mouseStarted && this._mouseUp(event);
                this._mouseDownEvent = event;
                var that = this, btnIsLeft = event.which === 1, // event.target.nodeName works around a bug in IE 8 with
                // disabled inputs (#7620)
                elIsCancel = typeof this.options.cancel === "string" && event.target.nodeName ? $(event.target).closest(this.options.cancel).length : false;
                if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
                    return true;
                }
                this.mouseDelayMet = !this.options.delay;
                if (!this.mouseDelayMet) {
                    this._mouseDelayTimer = setTimeout(function() {
                        that.mouseDelayMet = true;
                    }, this.options.delay);
                }
                if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
                    this._mouseStarted = this._mouseStart(event) !== false;
                    if (!this._mouseStarted) {
                        event.preventDefault();
                        return true;
                    }
                }
                // Click event may never have fired (Gecko & Opera)
                if (true === $.data(event.target, this.widgetName + ".preventClickEvent")) {
                    $.removeData(event.target, this.widgetName + ".preventClickEvent");
                }
                // these delegates are required to keep context
                this._mouseMoveDelegate = function(event) {
                    return that._mouseMove(event);
                };
                this._mouseUpDelegate = function(event) {
                    return that._mouseUp(event);
                };
                $(document).bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate);
                event.preventDefault();
                mouseHandled = true;
                return true;
            },
            _mouseMove: function(event) {
                // IE mouseup check - mouseup happened when mouse was out of window
                if ($.ui.ie && (!document.documentMode || document.documentMode < 9) && !event.button) {
                    return this._mouseUp(event);
                }
                if (this._mouseStarted) {
                    this._mouseDrag(event);
                    return event.preventDefault();
                }
                if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
                    this._mouseStarted = this._mouseStart(this._mouseDownEvent, event) !== false;
                    this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event);
                }
                return !this._mouseStarted;
            },
            _mouseUp: function(event) {
                $(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate);
                if (this._mouseStarted) {
                    this._mouseStarted = false;
                    if (event.target === this._mouseDownEvent.target) {
                        $.data(event.target, this.widgetName + ".preventClickEvent", true);
                    }
                    this._mouseStop(event);
                }
                return false;
            },
            _mouseDistanceMet: function(event) {
                return Math.max(Math.abs(this._mouseDownEvent.pageX - event.pageX), Math.abs(this._mouseDownEvent.pageY - event.pageY)) >= this.options.distance;
            },
            _mouseDelayMet: function() {
                return this.mouseDelayMet;
            },
            // These are placeholder methods, to be overriden by extending plugin
            _mouseStart: function() {},
            _mouseDrag: function() {},
            _mouseStop: function() {},
            _mouseCapture: function() {
                return true;
            }
        });
    })(jQuery);
    (function($, undefined) {
        function isOverAxis(x, reference, size) {
            return x > reference && x < reference + size;
        }
        function isFloating(item) {
            return /left|right/.test(item.css("float")) || /inline|table-cell/.test(item.css("display"));
        }
        $.widget("ui.sortable", $.ui.mouse, {
            version: "1.10.4",
            widgetEventPrefix: "sort",
            ready: false,
            options: {
                appendTo: "parent",
                axis: false,
                connectWith: false,
                containment: false,
                cursor: "auto",
                cursorAt: false,
                dropOnEmpty: true,
                forcePlaceholderSize: false,
                forceHelperSize: false,
                grid: false,
                handle: false,
                helper: "original",
                items: "> *",
                opacity: false,
                placeholder: false,
                revert: false,
                scroll: true,
                scrollSensitivity: 20,
                scrollSpeed: 20,
                scope: "default",
                tolerance: "intersect",
                zIndex: 1e3,
                // callbacks
                activate: null,
                beforeStop: null,
                change: null,
                deactivate: null,
                out: null,
                over: null,
                receive: null,
                remove: null,
                sort: null,
                start: null,
                stop: null,
                update: null
            },
            _create: function() {
                var o = this.options;
                this.containerCache = {};
                this.element.addClass("ui-sortable");
                //Get the items
                this.refresh();
                //Let's determine if the items are being displayed horizontally
                this.floating = this.items.length ? o.axis === "x" || isFloating(this.items[0].item) : false;
                //Let's determine the parent's offset
                this.offset = this.element.offset();
                //Initialize mouse events for interaction
                this._mouseInit();
                //We're ready to go
                this.ready = true;
            },
            _destroy: function() {
                this.element.removeClass("ui-sortable ui-sortable-disabled");
                this._mouseDestroy();
                for (var i = this.items.length - 1; i >= 0; i--) {
                    this.items[i].item.removeData(this.widgetName + "-item");
                }
                return this;
            },
            _setOption: function(key, value) {
                if (key === "disabled") {
                    this.options[key] = value;
                    this.widget().toggleClass("ui-sortable-disabled", !!value);
                } else {
                    // Don't call widget base _setOption for disable as it adds ui-state-disabled class
                    $.Widget.prototype._setOption.apply(this, arguments);
                }
            },
            _mouseCapture: function(event, overrideHandle) {
                var currentItem = null, validHandle = false, that = this;
                if (this.reverting) {
                    return false;
                }
                if (this.options.disabled || this.options.type === "static") {
                    return false;
                }
                //We have to refresh the items data once first
                this._refreshItems(event);
                //Find out if the clicked node (or one of its parents) is a actual item in this.items
                $(event.target).parents().each(function() {
                    if ($.data(this, that.widgetName + "-item") === that) {
                        currentItem = $(this);
                        return false;
                    }
                });
                if ($.data(event.target, that.widgetName + "-item") === that) {
                    currentItem = $(event.target);
                }
                if (!currentItem) {
                    return false;
                }
                if (this.options.handle && !overrideHandle) {
                    $(this.options.handle, currentItem).find("*").addBack().each(function() {
                        if (this === event.target) {
                            validHandle = true;
                        }
                    });
                    if (!validHandle) {
                        return false;
                    }
                }
                this.currentItem = currentItem;
                this._removeCurrentsFromItems();
                return true;
            },
            _mouseStart: function(event, overrideHandle, noActivation) {
                var i, body, o = this.options;
                this.currentContainer = this;
                //We only need to call refreshPositions, because the refreshItems call has been moved to mouseCapture
                this.refreshPositions();
                //Create and append the visible helper
                this.helper = this._createHelper(event);
                //Cache the helper size
                this._cacheHelperProportions();
                /*
                 * - Position generation -
                 * This block generates everything position related - it's the core of draggables.
                 */
                //Cache the margins of the original element
                this._cacheMargins();
                //Get the next scrolling parent
                this.scrollParent = this.helper.scrollParent();
                //The element's absolute position on the page minus margins
                this.offset = this.currentItem.offset();
                this.offset = {
                    top: this.offset.top - this.margins.top,
                    left: this.offset.left - this.margins.left
                };
                $.extend(this.offset, {
                    click: {
                        //Where the click happened, relative to the element
                        left: event.pageX - this.offset.left,
                        top: event.pageY - this.offset.top
                    },
                    parent: this._getParentOffset(),
                    relative: this._getRelativeOffset()
                });
                // Only after we got the offset, we can change the helper's position to absolute
                // TODO: Still need to figure out a way to make relative sorting possible
                this.helper.css("position", "absolute");
                this.cssPosition = this.helper.css("position");
                //Generate the original position
                this.originalPosition = this._generatePosition(event);
                this.originalPageX = event.pageX;
                this.originalPageY = event.pageY;
                //Adjust the mouse offset relative to the helper if "cursorAt" is supplied
                o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt);
                //Cache the former DOM position
                this.domPosition = {
                    prev: this.currentItem.prev()[0],
                    parent: this.currentItem.parent()[0]
                };
                //If the helper is not the original, hide the original so it's not playing any role during the drag, won't cause anything bad this way
                if (this.helper[0] !== this.currentItem[0]) {
                    this.currentItem.hide();
                }
                //Create the placeholder
                this._createPlaceholder();
                //Set a containment if given in the options
                if (o.containment) {
                    this._setContainment();
                }
                if (o.cursor && o.cursor !== "auto") {
                    // cursor option
                    body = this.document.find("body");
                    // support: IE
                    this.storedCursor = body.css("cursor");
                    body.css("cursor", o.cursor);
                    this.storedStylesheet = $("<style>*{ cursor: " + o.cursor + " !important; }</style>").appendTo(body);
                }
                if (o.opacity) {
                    // opacity option
                    if (this.helper.css("opacity")) {
                        this._storedOpacity = this.helper.css("opacity");
                    }
                    this.helper.css("opacity", o.opacity);
                }
                if (o.zIndex) {
                    // zIndex option
                    if (this.helper.css("zIndex")) {
                        this._storedZIndex = this.helper.css("zIndex");
                    }
                    this.helper.css("zIndex", o.zIndex);
                }
                //Prepare scrolling
                if (this.scrollParent[0] !== document && this.scrollParent[0].tagName !== "HTML") {
                    this.overflowOffset = this.scrollParent.offset();
                }
                //Call callbacks
                this._trigger("start", event, this._uiHash());
                //Recache the helper size
                if (!this._preserveHelperProportions) {
                    this._cacheHelperProportions();
                }
                //Post "activate" events to possible containers
                if (!noActivation) {
                    for (i = this.containers.length - 1; i >= 0; i--) {
                        this.containers[i]._trigger("activate", event, this._uiHash(this));
                    }
                }
                //Prepare possible droppables
                if ($.ui.ddmanager) {
                    $.ui.ddmanager.current = this;
                }
                if ($.ui.ddmanager && !o.dropBehaviour) {
                    $.ui.ddmanager.prepareOffsets(this, event);
                }
                this.dragging = true;
                this.helper.addClass("ui-sortable-helper");
                this._mouseDrag(event);
                //Execute the drag once - this causes the helper not to be visible before getting its correct position
                return true;
            },
            _mouseDrag: function(event) {
                var i, item, itemElement, intersection, o = this.options, scrolled = false;
                //Compute the helpers position
                this.position = this._generatePosition(event);
                this.positionAbs = this._convertPositionTo("absolute");
                if (!this.lastPositionAbs) {
                    this.lastPositionAbs = this.positionAbs;
                }
                //Do scrolling
                if (this.options.scroll) {
                    if (this.scrollParent[0] !== document && this.scrollParent[0].tagName !== "HTML") {
                        if (this.overflowOffset.top + this.scrollParent[0].offsetHeight - event.pageY < o.scrollSensitivity) {
                            this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop + o.scrollSpeed;
                        } else if (event.pageY - this.overflowOffset.top < o.scrollSensitivity) {
                            this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop - o.scrollSpeed;
                        }
                        if (this.overflowOffset.left + this.scrollParent[0].offsetWidth - event.pageX < o.scrollSensitivity) {
                            this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft + o.scrollSpeed;
                        } else if (event.pageX - this.overflowOffset.left < o.scrollSensitivity) {
                            this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft - o.scrollSpeed;
                        }
                    } else {
                        if (event.pageY - $(document).scrollTop() < o.scrollSensitivity) {
                            scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
                        } else if ($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity) {
                            scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);
                        }
                        if (event.pageX - $(document).scrollLeft() < o.scrollSensitivity) {
                            scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
                        } else if ($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity) {
                            scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);
                        }
                    }
                    if (scrolled !== false && $.ui.ddmanager && !o.dropBehaviour) {
                        $.ui.ddmanager.prepareOffsets(this, event);
                    }
                }
                //Regenerate the absolute position used for position checks
                this.positionAbs = this._convertPositionTo("absolute");
                //Set the helper position
                if (!this.options.axis || this.options.axis !== "y") {
                    this.helper[0].style.left = this.position.left + "px";
                }
                if (!this.options.axis || this.options.axis !== "x") {
                    this.helper[0].style.top = this.position.top + "px";
                }
                //Rearrange
                for (i = this.items.length - 1; i >= 0; i--) {
                    //Cache variables and intersection, continue if no intersection
                    item = this.items[i];
                    itemElement = item.item[0];
                    intersection = this._intersectsWithPointer(item);
                    if (!intersection) {
                        continue;
                    }
                    // Only put the placeholder inside the current Container, skip all
                    // items from other containers. This works because when moving
                    // an item from one container to another the
                    // currentContainer is switched before the placeholder is moved.
                    //
                    // Without this, moving items in "sub-sortables" can cause
                    // the placeholder to jitter beetween the outer and inner container.
                    if (item.instance !== this.currentContainer) {
                        continue;
                    }
                    // cannot intersect with itself
                    // no useless actions that have been done before
                    // no action if the item moved is the parent of the item checked
                    if (itemElement !== this.currentItem[0] && this.placeholder[intersection === 1 ? "next" : "prev"]()[0] !== itemElement && !$.contains(this.placeholder[0], itemElement) && (this.options.type === "semi-dynamic" ? !$.contains(this.element[0], itemElement) : true)) {
                        this.direction = intersection === 1 ? "down" : "up";
                        if (this.options.tolerance === "pointer" || this._intersectsWithSides(item)) {
                            this._rearrange(event, item);
                        } else {
                            break;
                        }
                        this._trigger("change", event, this._uiHash());
                        break;
                    }
                }
                //Post events to containers
                this._contactContainers(event);
                //Interconnect with droppables
                if ($.ui.ddmanager) {
                    $.ui.ddmanager.drag(this, event);
                }
                //Call callbacks
                this._trigger("sort", event, this._uiHash());
                this.lastPositionAbs = this.positionAbs;
                return false;
            },
            _mouseStop: function(event, noPropagation) {
                if (!event) {
                    return;
                }
                //If we are using droppables, inform the manager about the drop
                if ($.ui.ddmanager && !this.options.dropBehaviour) {
                    $.ui.ddmanager.drop(this, event);
                }
                if (this.options.revert) {
                    var that = this, cur = this.placeholder.offset(), axis = this.options.axis, animation = {};
                    if (!axis || axis === "x") {
                        animation.left = cur.left - this.offset.parent.left - this.margins.left + (this.offsetParent[0] === document.body ? 0 : this.offsetParent[0].scrollLeft);
                    }
                    if (!axis || axis === "y") {
                        animation.top = cur.top - this.offset.parent.top - this.margins.top + (this.offsetParent[0] === document.body ? 0 : this.offsetParent[0].scrollTop);
                    }
                    this.reverting = true;
                    $(this.helper).animate(animation, parseInt(this.options.revert, 10) || 500, function() {
                        that._clear(event);
                    });
                } else {
                    this._clear(event, noPropagation);
                }
                return false;
            },
            cancel: function() {
                if (this.dragging) {
                    this._mouseUp({
                        target: null
                    });
                    if (this.options.helper === "original") {
                        this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
                    } else {
                        this.currentItem.show();
                    }
                    //Post deactivating events to containers
                    for (var i = this.containers.length - 1; i >= 0; i--) {
                        this.containers[i]._trigger("deactivate", null, this._uiHash(this));
                        if (this.containers[i].containerCache.over) {
                            this.containers[i]._trigger("out", null, this._uiHash(this));
                            this.containers[i].containerCache.over = 0;
                        }
                    }
                }
                if (this.placeholder) {
                    //$(this.placeholder[0]).remove(); would have been the jQuery way - unfortunately, it unbinds ALL events from the original node!
                    if (this.placeholder[0].parentNode) {
                        this.placeholder[0].parentNode.removeChild(this.placeholder[0]);
                    }
                    if (this.options.helper !== "original" && this.helper && this.helper[0].parentNode) {
                        this.helper.remove();
                    }
                    $.extend(this, {
                        helper: null,
                        dragging: false,
                        reverting: false,
                        _noFinalSort: null
                    });
                    if (this.domPosition.prev) {
                        $(this.domPosition.prev).after(this.currentItem);
                    } else {
                        $(this.domPosition.parent).prepend(this.currentItem);
                    }
                }
                return this;
            },
            serialize: function(o) {
                var items = this._getItemsAsjQuery(o && o.connected), str = [];
                o = o || {};
                $(items).each(function() {
                    var res = ($(o.item || this).attr(o.attribute || "id") || "").match(o.expression || /(.+)[\-=_](.+)/);
                    if (res) {
                        str.push((o.key || res[1] + "[]") + "=" + (o.key && o.expression ? res[1] : res[2]));
                    }
                });
                if (!str.length && o.key) {
                    str.push(o.key + "=");
                }
                return str.join("&");
            },
            toArray: function(o) {
                var items = this._getItemsAsjQuery(o && o.connected), ret = [];
                o = o || {};
                items.each(function() {
                    ret.push($(o.item || this).attr(o.attribute || "id") || "");
                });
                return ret;
            },
            /* Be careful with the following core functions */
            _intersectsWith: function(item) {
                var x1 = this.positionAbs.left, x2 = x1 + this.helperProportions.width, y1 = this.positionAbs.top, y2 = y1 + this.helperProportions.height, l = item.left, r = l + item.width, t = item.top, b = t + item.height, dyClick = this.offset.click.top, dxClick = this.offset.click.left, isOverElementHeight = this.options.axis === "x" || y1 + dyClick > t && y1 + dyClick < b, isOverElementWidth = this.options.axis === "y" || x1 + dxClick > l && x1 + dxClick < r, isOverElement = isOverElementHeight && isOverElementWidth;
                if (this.options.tolerance === "pointer" || this.options.forcePointerForContainers || this.options.tolerance !== "pointer" && this.helperProportions[this.floating ? "width" : "height"] > item[this.floating ? "width" : "height"]) {
                    return isOverElement;
                } else {
                    return l < x1 + this.helperProportions.width / 2 && // Right Half
                    x2 - this.helperProportions.width / 2 < r && // Left Half
                    t < y1 + this.helperProportions.height / 2 && // Bottom Half
                    y2 - this.helperProportions.height / 2 < b;
                }
            },
            _intersectsWithPointer: function(item) {
                var isOverElementHeight = this.options.axis === "x" || isOverAxis(this.positionAbs.top + this.offset.click.top, item.top, item.height), isOverElementWidth = this.options.axis === "y" || isOverAxis(this.positionAbs.left + this.offset.click.left, item.left, item.width), isOverElement = isOverElementHeight && isOverElementWidth, verticalDirection = this._getDragVerticalDirection(), horizontalDirection = this._getDragHorizontalDirection();
                if (!isOverElement) {
                    return false;
                }
                return this.floating ? horizontalDirection && horizontalDirection === "right" || verticalDirection === "down" ? 2 : 1 : verticalDirection && (verticalDirection === "down" ? 2 : 1);
            },
            _intersectsWithSides: function(item) {
                var isOverBottomHalf = isOverAxis(this.positionAbs.top + this.offset.click.top, item.top + item.height / 2, item.height), isOverRightHalf = isOverAxis(this.positionAbs.left + this.offset.click.left, item.left + item.width / 2, item.width), verticalDirection = this._getDragVerticalDirection(), horizontalDirection = this._getDragHorizontalDirection();
                if (this.floating && horizontalDirection) {
                    return horizontalDirection === "right" && isOverRightHalf || horizontalDirection === "left" && !isOverRightHalf;
                } else {
                    return verticalDirection && (verticalDirection === "down" && isOverBottomHalf || verticalDirection === "up" && !isOverBottomHalf);
                }
            },
            _getDragVerticalDirection: function() {
                var delta = this.positionAbs.top - this.lastPositionAbs.top;
                return delta !== 0 && (delta > 0 ? "down" : "up");
            },
            _getDragHorizontalDirection: function() {
                var delta = this.positionAbs.left - this.lastPositionAbs.left;
                return delta !== 0 && (delta > 0 ? "right" : "left");
            },
            refresh: function(event) {
                this._refreshItems(event);
                this.refreshPositions();
                return this;
            },
            _connectWith: function() {
                var options = this.options;
                return options.connectWith.constructor === String ? [ options.connectWith ] : options.connectWith;
            },
            _getItemsAsjQuery: function(connected) {
                var i, j, cur, inst, items = [], queries = [], connectWith = this._connectWith();
                if (connectWith && connected) {
                    for (i = connectWith.length - 1; i >= 0; i--) {
                        cur = $(connectWith[i]);
                        for (j = cur.length - 1; j >= 0; j--) {
                            inst = $.data(cur[j], this.widgetFullName);
                            if (inst && inst !== this && !inst.options.disabled) {
                                queries.push([ $.isFunction(inst.options.items) ? inst.options.items.call(inst.element) : $(inst.options.items, inst.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), inst ]);
                            }
                        }
                    }
                }
                queries.push([ $.isFunction(this.options.items) ? this.options.items.call(this.element, null, {
                    options: this.options,
                    item: this.currentItem
                }) : $(this.options.items, this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), this ]);
                function addItems() {
                    items.push(this);
                }
                for (i = queries.length - 1; i >= 0; i--) {
                    queries[i][0].each(addItems);
                }
                return $(items);
            },
            _removeCurrentsFromItems: function() {
                var list = this.currentItem.find(":data(" + this.widgetName + "-item)");
                this.items = $.grep(this.items, function(item) {
                    for (var j = 0; j < list.length; j++) {
                        if (list[j] === item.item[0]) {
                            return false;
                        }
                    }
                    return true;
                });
            },
            _refreshItems: function(event) {
                this.items = [];
                this.containers = [ this ];
                var i, j, cur, inst, targetData, _queries, item, queriesLength, items = this.items, queries = [ [ $.isFunction(this.options.items) ? this.options.items.call(this.element[0], event, {
                    item: this.currentItem
                }) : $(this.options.items, this.element), this ] ], connectWith = this._connectWith();
                if (connectWith && this.ready) {
                    //Shouldn't be run the first time through due to massive slow-down
                    for (i = connectWith.length - 1; i >= 0; i--) {
                        cur = $(connectWith[i]);
                        for (j = cur.length - 1; j >= 0; j--) {
                            inst = $.data(cur[j], this.widgetFullName);
                            if (inst && inst !== this && !inst.options.disabled) {
                                queries.push([ $.isFunction(inst.options.items) ? inst.options.items.call(inst.element[0], event, {
                                    item: this.currentItem
                                }) : $(inst.options.items, inst.element), inst ]);
                                this.containers.push(inst);
                            }
                        }
                    }
                }
                for (i = queries.length - 1; i >= 0; i--) {
                    targetData = queries[i][1];
                    _queries = queries[i][0];
                    for (j = 0, queriesLength = _queries.length; j < queriesLength; j++) {
                        item = $(_queries[j]);
                        item.data(this.widgetName + "-item", targetData);
                        // Data for target checking (mouse manager)
                        items.push({
                            item: item,
                            instance: targetData,
                            width: 0,
                            height: 0,
                            left: 0,
                            top: 0
                        });
                    }
                }
            },
            refreshPositions: function(fast) {
                //This has to be redone because due to the item being moved out/into the offsetParent, the offsetParent's position will change
                if (this.offsetParent && this.helper) {
                    this.offset.parent = this._getParentOffset();
                }
                var i, item, t, p;
                for (i = this.items.length - 1; i >= 0; i--) {
                    item = this.items[i];
                    //We ignore calculating positions of all connected containers when we're not over them
                    if (item.instance !== this.currentContainer && this.currentContainer && item.item[0] !== this.currentItem[0]) {
                        continue;
                    }
                    t = this.options.toleranceElement ? $(this.options.toleranceElement, item.item) : item.item;
                    if (!fast) {
                        item.width = t.outerWidth();
                        item.height = t.outerHeight();
                    }
                    p = t.offset();
                    item.left = p.left;
                    item.top = p.top;
                }
                if (this.options.custom && this.options.custom.refreshContainers) {
                    this.options.custom.refreshContainers.call(this);
                } else {
                    for (i = this.containers.length - 1; i >= 0; i--) {
                        p = this.containers[i].element.offset();
                        this.containers[i].containerCache.left = p.left;
                        this.containers[i].containerCache.top = p.top;
                        this.containers[i].containerCache.width = this.containers[i].element.outerWidth();
                        this.containers[i].containerCache.height = this.containers[i].element.outerHeight();
                    }
                }
                return this;
            },
            _createPlaceholder: function(that) {
                that = that || this;
                var className, o = that.options;
                if (!o.placeholder || o.placeholder.constructor === String) {
                    className = o.placeholder;
                    o.placeholder = {
                        element: function() {
                            var nodeName = that.currentItem[0].nodeName.toLowerCase(), element = $("<" + nodeName + ">", that.document[0]).addClass(className || that.currentItem[0].className + " ui-sortable-placeholder").removeClass("ui-sortable-helper");
                            if (nodeName === "tr") {
                                that.currentItem.children().each(function() {
                                    $("<td>&#160;</td>", that.document[0]).attr("colspan", $(this).attr("colspan") || 1).appendTo(element);
                                });
                            } else if (nodeName === "img") {
                                element.attr("src", that.currentItem.attr("src"));
                            }
                            if (!className) {
                                element.css("visibility", "hidden");
                            }
                            return element;
                        },
                        update: function(container, p) {
                            // 1. If a className is set as 'placeholder option, we don't force sizes - the class is responsible for that
                            // 2. The option 'forcePlaceholderSize can be enabled to force it even if a class name is specified
                            if (className && !o.forcePlaceholderSize) {
                                return;
                            }
                            //If the element doesn't have a actual height by itself (without styles coming from a stylesheet), it receives the inline height from the dragged item
                            if (!p.height()) {
                                p.height(that.currentItem.innerHeight() - parseInt(that.currentItem.css("paddingTop") || 0, 10) - parseInt(that.currentItem.css("paddingBottom") || 0, 10));
                            }
                            if (!p.width()) {
                                p.width(that.currentItem.innerWidth() - parseInt(that.currentItem.css("paddingLeft") || 0, 10) - parseInt(that.currentItem.css("paddingRight") || 0, 10));
                            }
                        }
                    };
                }
                //Create the placeholder
                that.placeholder = $(o.placeholder.element.call(that.element, that.currentItem));
                //Append it after the actual current item
                that.currentItem.after(that.placeholder);
                //Update the size of the placeholder (TODO: Logic to fuzzy, see line 316/317)
                o.placeholder.update(that, that.placeholder);
            },
            _contactContainers: function(event) {
                var i, j, dist, itemWithLeastDistance, posProperty, sizeProperty, base, cur, nearBottom, floating, innermostContainer = null, innermostIndex = null;
                // get innermost container that intersects with item
                for (i = this.containers.length - 1; i >= 0; i--) {
                    // never consider a container that's located within the item itself
                    if ($.contains(this.currentItem[0], this.containers[i].element[0])) {
                        continue;
                    }
                    if (this._intersectsWith(this.containers[i].containerCache)) {
                        // if we've already found a container and it's more "inner" than this, then continue
                        if (innermostContainer && $.contains(this.containers[i].element[0], innermostContainer.element[0])) {
                            continue;
                        }
                        innermostContainer = this.containers[i];
                        innermostIndex = i;
                    } else {
                        // container doesn't intersect. trigger "out" event if necessary
                        if (this.containers[i].containerCache.over) {
                            this.containers[i]._trigger("out", event, this._uiHash(this));
                            this.containers[i].containerCache.over = 0;
                        }
                    }
                }
                // if no intersecting containers found, return
                if (!innermostContainer) {
                    return;
                }
                // move the item into the container if it's not there already
                if (this.containers.length === 1) {
                    if (!this.containers[innermostIndex].containerCache.over) {
                        this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));
                        this.containers[innermostIndex].containerCache.over = 1;
                    }
                } else {
                    //When entering a new container, we will find the item with the least distance and append our item near it
                    dist = 1e4;
                    itemWithLeastDistance = null;
                    floating = innermostContainer.floating || isFloating(this.currentItem);
                    posProperty = floating ? "left" : "top";
                    sizeProperty = floating ? "width" : "height";
                    base = this.positionAbs[posProperty] + this.offset.click[posProperty];
                    for (j = this.items.length - 1; j >= 0; j--) {
                        if (!$.contains(this.containers[innermostIndex].element[0], this.items[j].item[0])) {
                            continue;
                        }
                        if (this.items[j].item[0] === this.currentItem[0]) {
                            continue;
                        }
                        if (floating && !isOverAxis(this.positionAbs.top + this.offset.click.top, this.items[j].top, this.items[j].height)) {
                            continue;
                        }
                        cur = this.items[j].item.offset()[posProperty];
                        nearBottom = false;
                        if (Math.abs(cur - base) > Math.abs(cur + this.items[j][sizeProperty] - base)) {
                            nearBottom = true;
                            cur += this.items[j][sizeProperty];
                        }
                        if (Math.abs(cur - base) < dist) {
                            dist = Math.abs(cur - base);
                            itemWithLeastDistance = this.items[j];
                            this.direction = nearBottom ? "up" : "down";
                        }
                    }
                    //Check if dropOnEmpty is enabled
                    if (!itemWithLeastDistance && !this.options.dropOnEmpty) {
                        return;
                    }
                    if (this.currentContainer === this.containers[innermostIndex]) {
                        return;
                    }
                    itemWithLeastDistance ? this._rearrange(event, itemWithLeastDistance, null, true) : this._rearrange(event, null, this.containers[innermostIndex].element, true);
                    this._trigger("change", event, this._uiHash());
                    this.containers[innermostIndex]._trigger("change", event, this._uiHash(this));
                    this.currentContainer = this.containers[innermostIndex];
                    //Update the placeholder
                    this.options.placeholder.update(this.currentContainer, this.placeholder);
                    this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));
                    this.containers[innermostIndex].containerCache.over = 1;
                }
            },
            _createHelper: function(event) {
                var o = this.options, helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [ event, this.currentItem ])) : o.helper === "clone" ? this.currentItem.clone() : this.currentItem;
                //Add the helper to the DOM if that didn't happen already
                if (!helper.parents("body").length) {
                    $(o.appendTo !== "parent" ? o.appendTo : this.currentItem[0].parentNode)[0].appendChild(helper[0]);
                }
                if (helper[0] === this.currentItem[0]) {
                    this._storedCSS = {
                        width: this.currentItem[0].style.width,
                        height: this.currentItem[0].style.height,
                        position: this.currentItem.css("position"),
                        top: this.currentItem.css("top"),
                        left: this.currentItem.css("left")
                    };
                }
                if (!helper[0].style.width || o.forceHelperSize) {
                    helper.width(this.currentItem.width());
                }
                if (!helper[0].style.height || o.forceHelperSize) {
                    helper.height(this.currentItem.height());
                }
                return helper;
            },
            _adjustOffsetFromHelper: function(obj) {
                if (typeof obj === "string") {
                    obj = obj.split(" ");
                }
                if ($.isArray(obj)) {
                    obj = {
                        left: +obj[0],
                        top: +obj[1] || 0
                    };
                }
                if ("left" in obj) {
                    this.offset.click.left = obj.left + this.margins.left;
                }
                if ("right" in obj) {
                    this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
                }
                if ("top" in obj) {
                    this.offset.click.top = obj.top + this.margins.top;
                }
                if ("bottom" in obj) {
                    this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
                }
            },
            _getParentOffset: function() {
                //Get the offsetParent and cache its position
                this.offsetParent = this.helper.offsetParent();
                var po = this.offsetParent.offset();
                // This is a special case where we need to modify a offset calculated on start, since the following happened:
                // 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
                // 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
                //    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
                if (this.cssPosition === "absolute" && this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0])) {
                    po.left += this.scrollParent.scrollLeft();
                    po.top += this.scrollParent.scrollTop();
                }
                // This needs to be actually done for all browsers, since pageX/pageY includes this information
                // with an ugly IE fix
                if (this.offsetParent[0] === document.body || this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() === "html" && $.ui.ie) {
                    po = {
                        top: 0,
                        left: 0
                    };
                }
                return {
                    top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
                    left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
                };
            },
            _getRelativeOffset: function() {
                if (this.cssPosition === "relative") {
                    var p = this.currentItem.position();
                    return {
                        top: p.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(),
                        left: p.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()
                    };
                } else {
                    return {
                        top: 0,
                        left: 0
                    };
                }
            },
            _cacheMargins: function() {
                this.margins = {
                    left: parseInt(this.currentItem.css("marginLeft"), 10) || 0,
                    top: parseInt(this.currentItem.css("marginTop"), 10) || 0
                };
            },
            _cacheHelperProportions: function() {
                this.helperProportions = {
                    width: this.helper.outerWidth(),
                    height: this.helper.outerHeight()
                };
            },
            _setContainment: function() {
                var ce, co, over, o = this.options;
                if (o.containment === "parent") {
                    o.containment = this.helper[0].parentNode;
                }
                if (o.containment === "document" || o.containment === "window") {
                    this.containment = [ 0 - this.offset.relative.left - this.offset.parent.left, 0 - this.offset.relative.top - this.offset.parent.top, $(o.containment === "document" ? document : window).width() - this.helperProportions.width - this.margins.left, ($(o.containment === "document" ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top ];
                }
                if (!/^(document|window|parent)$/.test(o.containment)) {
                    ce = $(o.containment)[0];
                    co = $(o.containment).offset();
                    over = $(ce).css("overflow") !== "hidden";
                    this.containment = [ co.left + (parseInt($(ce).css("borderLeftWidth"), 10) || 0) + (parseInt($(ce).css("paddingLeft"), 10) || 0) - this.margins.left, co.top + (parseInt($(ce).css("borderTopWidth"), 10) || 0) + (parseInt($(ce).css("paddingTop"), 10) || 0) - this.margins.top, co.left + (over ? Math.max(ce.scrollWidth, ce.offsetWidth) : ce.offsetWidth) - (parseInt($(ce).css("borderLeftWidth"), 10) || 0) - (parseInt($(ce).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left, co.top + (over ? Math.max(ce.scrollHeight, ce.offsetHeight) : ce.offsetHeight) - (parseInt($(ce).css("borderTopWidth"), 10) || 0) - (parseInt($(ce).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top ];
                }
            },
            _convertPositionTo: function(d, pos) {
                if (!pos) {
                    pos = this.position;
                }
                var mod = d === "absolute" ? 1 : -1, scroll = this.cssPosition === "absolute" && !(this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = /(html|body)/i.test(scroll[0].tagName);
                return {
                    top: pos.top + // The absolute mouse position
                    this.offset.relative.top * mod + // Only for relative positioned nodes: Relative offset from element to offset parent
                    this.offset.parent.top * mod - // The offsetParent's offset without borders (offset + border)
                    (this.cssPosition === "fixed" ? -this.scrollParent.scrollTop() : scrollIsRootNode ? 0 : scroll.scrollTop()) * mod,
                    left: pos.left + // The absolute mouse position
                    this.offset.relative.left * mod + // Only for relative positioned nodes: Relative offset from element to offset parent
                    this.offset.parent.left * mod - // The offsetParent's offset without borders (offset + border)
                    (this.cssPosition === "fixed" ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft()) * mod
                };
            },
            _generatePosition: function(event) {
                var top, left, o = this.options, pageX = event.pageX, pageY = event.pageY, scroll = this.cssPosition === "absolute" && !(this.scrollParent[0] !== document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = /(html|body)/i.test(scroll[0].tagName);
                // This is another very weird special case that only happens for relative elements:
                // 1. If the css position is relative
                // 2. and the scroll parent is the document or similar to the offset parent
                // we have to refresh the relative offset during the scroll so there are no jumps
                if (this.cssPosition === "relative" && !(this.scrollParent[0] !== document && this.scrollParent[0] !== this.offsetParent[0])) {
                    this.offset.relative = this._getRelativeOffset();
                }
                /*
                 * - Position constraining -
                 * Constrain the position to a mix of grid, containment.
                 */
                if (this.originalPosition) {
                    //If we are not dragging yet, we won't check for options
                    if (this.containment) {
                        if (event.pageX - this.offset.click.left < this.containment[0]) {
                            pageX = this.containment[0] + this.offset.click.left;
                        }
                        if (event.pageY - this.offset.click.top < this.containment[1]) {
                            pageY = this.containment[1] + this.offset.click.top;
                        }
                        if (event.pageX - this.offset.click.left > this.containment[2]) {
                            pageX = this.containment[2] + this.offset.click.left;
                        }
                        if (event.pageY - this.offset.click.top > this.containment[3]) {
                            pageY = this.containment[3] + this.offset.click.top;
                        }
                    }
                    if (o.grid) {
                        top = this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1];
                        pageY = this.containment ? top - this.offset.click.top >= this.containment[1] && top - this.offset.click.top <= this.containment[3] ? top : top - this.offset.click.top >= this.containment[1] ? top - o.grid[1] : top + o.grid[1] : top;
                        left = this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0];
                        pageX = this.containment ? left - this.offset.click.left >= this.containment[0] && left - this.offset.click.left <= this.containment[2] ? left : left - this.offset.click.left >= this.containment[0] ? left - o.grid[0] : left + o.grid[0] : left;
                    }
                }
                return {
                    top: pageY - // The absolute mouse position
                    this.offset.click.top - // Click offset (relative to the element)
                    this.offset.relative.top - // Only for relative positioned nodes: Relative offset from element to offset parent
                    this.offset.parent.top + (// The offsetParent's offset without borders (offset + border)
                    this.cssPosition === "fixed" ? -this.scrollParent.scrollTop() : scrollIsRootNode ? 0 : scroll.scrollTop()),
                    left: pageX - // The absolute mouse position
                    this.offset.click.left - // Click offset (relative to the element)
                    this.offset.relative.left - // Only for relative positioned nodes: Relative offset from element to offset parent
                    this.offset.parent.left + (// The offsetParent's offset without borders (offset + border)
                    this.cssPosition === "fixed" ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft())
                };
            },
            _rearrange: function(event, i, a, hardRefresh) {
                a ? a[0].appendChild(this.placeholder[0]) : i.item[0].parentNode.insertBefore(this.placeholder[0], this.direction === "down" ? i.item[0] : i.item[0].nextSibling);
                //Various things done here to improve the performance:
                // 1. we create a setTimeout, that calls refreshPositions
                // 2. on the instance, we have a counter variable, that get's higher after every append
                // 3. on the local scope, we copy the counter variable, and check in the timeout, if it's still the same
                // 4. this lets only the last addition to the timeout stack through
                this.counter = this.counter ? ++this.counter : 1;
                var counter = this.counter;
                this._delay(function() {
                    if (counter === this.counter) {
                        this.refreshPositions(!hardRefresh);
                    }
                });
            },
            _clear: function(event, noPropagation) {
                this.reverting = false;
                // We delay all events that have to be triggered to after the point where the placeholder has been removed and
                // everything else normalized again
                var i, delayedTriggers = [];
                // We first have to update the dom position of the actual currentItem
                // Note: don't do it if the current item is already removed (by a user), or it gets reappended (see #4088)
                if (!this._noFinalSort && this.currentItem.parent().length) {
                    this.placeholder.before(this.currentItem);
                }
                this._noFinalSort = null;
                if (this.helper[0] === this.currentItem[0]) {
                    for (i in this._storedCSS) {
                        if (this._storedCSS[i] === "auto" || this._storedCSS[i] === "static") {
                            this._storedCSS[i] = "";
                        }
                    }
                    this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
                } else {
                    this.currentItem.show();
                }
                if (this.fromOutside && !noPropagation) {
                    delayedTriggers.push(function(event) {
                        this._trigger("receive", event, this._uiHash(this.fromOutside));
                    });
                }
                if ((this.fromOutside || this.domPosition.prev !== this.currentItem.prev().not(".ui-sortable-helper")[0] || this.domPosition.parent !== this.currentItem.parent()[0]) && !noPropagation) {
                    delayedTriggers.push(function(event) {
                        this._trigger("update", event, this._uiHash());
                    });
                }
                // Check if the items Container has Changed and trigger appropriate
                // events.
                if (this !== this.currentContainer) {
                    if (!noPropagation) {
                        delayedTriggers.push(function(event) {
                            this._trigger("remove", event, this._uiHash());
                        });
                        delayedTriggers.push(function(c) {
                            return function(event) {
                                c._trigger("receive", event, this._uiHash(this));
                            };
                        }.call(this, this.currentContainer));
                        delayedTriggers.push(function(c) {
                            return function(event) {
                                c._trigger("update", event, this._uiHash(this));
                            };
                        }.call(this, this.currentContainer));
                    }
                }
                //Post events to containers
                function delayEvent(type, instance, container) {
                    return function(event) {
                        container._trigger(type, event, instance._uiHash(instance));
                    };
                }
                for (i = this.containers.length - 1; i >= 0; i--) {
                    if (!noPropagation) {
                        delayedTriggers.push(delayEvent("deactivate", this, this.containers[i]));
                    }
                    if (this.containers[i].containerCache.over) {
                        delayedTriggers.push(delayEvent("out", this, this.containers[i]));
                        this.containers[i].containerCache.over = 0;
                    }
                }
                //Do what was originally in plugins
                if (this.storedCursor) {
                    this.document.find("body").css("cursor", this.storedCursor);
                    this.storedStylesheet.remove();
                }
                if (this._storedOpacity) {
                    this.helper.css("opacity", this._storedOpacity);
                }
                if (this._storedZIndex) {
                    this.helper.css("zIndex", this._storedZIndex === "auto" ? "" : this._storedZIndex);
                }
                this.dragging = false;
                if (this.cancelHelperRemoval) {
                    if (!noPropagation) {
                        this._trigger("beforeStop", event, this._uiHash());
                        for (i = 0; i < delayedTriggers.length; i++) {
                            delayedTriggers[i].call(this, event);
                        }
                        //Trigger all delayed events
                        this._trigger("stop", event, this._uiHash());
                    }
                    this.fromOutside = false;
                    return false;
                }
                if (!noPropagation) {
                    this._trigger("beforeStop", event, this._uiHash());
                }
                //$(this.placeholder[0]).remove(); would have been the jQuery way - unfortunately, it unbinds ALL events from the original node!
                this.placeholder[0].parentNode.removeChild(this.placeholder[0]);
                if (this.helper[0] !== this.currentItem[0]) {
                    this.helper.remove();
                }
                this.helper = null;
                if (!noPropagation) {
                    for (i = 0; i < delayedTriggers.length; i++) {
                        delayedTriggers[i].call(this, event);
                    }
                    //Trigger all delayed events
                    this._trigger("stop", event, this._uiHash());
                }
                this.fromOutside = false;
                return true;
            },
            _trigger: function() {
                if ($.Widget.prototype._trigger.apply(this, arguments) === false) {
                    this.cancel();
                }
            },
            _uiHash: function(_inst) {
                var inst = _inst || this;
                return {
                    helper: inst.helper,
                    placeholder: inst.placeholder || $([]),
                    position: inst.position,
                    originalPosition: inst.originalPosition,
                    offset: inst.positionAbs,
                    item: inst.currentItem,
                    sender: _inst ? _inst.element : null
                };
            }
        });
    })(jQuery);
});

define("fiftyk/bootstrap-datetimepicker/1.0.0/bootstrap-datetimepicker-debug", [ "$-debug" ], function(require, exports, module) {
    var $ = require("$-debug");
    /* =========================================================
 * bootstrap-datetimepicker.js
 * =========================================================
 * Copyright 2012 Stefan Petre
 * Improvements by Andrew Rowls
 * Improvements by Sébastien Malot
 * Improvements by Yun Lai
 * Project URL : http://www.malot.fr/bootstrap-datetimepicker
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */
    /*
 * Improvement by CuGBabyBeaR @ 2013-09-12
 * 
 * Make it work in bootstrap v3
 */
    !function($) {
        function UTCDate() {
            return new Date(Date.UTC.apply(Date, arguments));
        }
        function UTCToday() {
            var today = new Date();
            return UTCDate(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), today.getUTCHours(), today.getUTCMinutes(), today.getUTCSeconds(), 0);
        }
        // Picker object
        var Datetimepicker = function(element, options) {
            var that = this;
            this.element = $(element);
            this.language = options.language || this.element.data("date-language") || "en";
            this.language = this.language in dates ? this.language : "en";
            this.isRTL = dates[this.language].rtl || false;
            this.formatType = options.formatType || this.element.data("format-type") || "standard";
            this.format = DPGlobal.parseFormat(options.format || this.element.data("date-format") || dates[this.language].format || DPGlobal.getDefaultFormat(this.formatType, "input"), this.formatType);
            this.isInline = false;
            this.isVisible = false;
            this.isInput = this.element.is("input");
            this.bootcssVer = this.isInput ? this.element.is(".form-control") ? 3 : 2 : this.bootcssVer = this.element.is(".input-group") ? 3 : 2;
            this.component = this.element.is(".date") ? this.bootcssVer == 3 ? this.element.find(".input-group-addon .glyphicon-th, .input-group-addon .glyphicon-time, .input-group-addon .glyphicon-calendar").parent() : this.element.find(".add-on .icon-th, .add-on .icon-time, .add-on .icon-calendar").parent() : false;
            this.componentReset = this.element.is(".date") ? this.bootcssVer == 3 ? this.element.find(".input-group-addon .glyphicon-remove").parent() : this.element.find(".add-on .icon-remove").parent() : false;
            this.hasInput = this.component && this.element.find("input").length;
            if (this.component && this.component.length === 0) {
                this.component = false;
            }
            this.linkField = options.linkField || this.element.data("link-field") || false;
            this.linkFormat = DPGlobal.parseFormat(options.linkFormat || this.element.data("link-format") || DPGlobal.getDefaultFormat(this.formatType, "link"), this.formatType);
            this.minuteStep = options.minuteStep || this.element.data("minute-step") || 5;
            this.pickerPosition = options.pickerPosition || this.element.data("picker-position") || "bottom-right";
            this.showMeridian = options.showMeridian || this.element.data("show-meridian") || false;
            this.initialDate = options.initialDate || new Date();
            this._attachEvents();
            this.formatViewType = "datetime";
            if ("formatViewType" in options) {
                this.formatViewType = options.formatViewType;
            } else if ("formatViewType" in this.element.data()) {
                this.formatViewType = this.element.data("formatViewType");
            }
            this.minView = 0;
            if ("minView" in options) {
                this.minView = options.minView;
            } else if ("minView" in this.element.data()) {
                this.minView = this.element.data("min-view");
            }
            this.minView = DPGlobal.convertViewMode(this.minView);
            this.maxView = DPGlobal.modes.length - 1;
            if ("maxView" in options) {
                this.maxView = options.maxView;
            } else if ("maxView" in this.element.data()) {
                this.maxView = this.element.data("max-view");
            }
            this.maxView = DPGlobal.convertViewMode(this.maxView);
            this.wheelViewModeNavigation = false;
            if ("wheelViewModeNavigation" in options) {
                this.wheelViewModeNavigation = options.wheelViewModeNavigation;
            } else if ("wheelViewModeNavigation" in this.element.data()) {
                this.wheelViewModeNavigation = this.element.data("view-mode-wheel-navigation");
            }
            this.wheelViewModeNavigationInverseDirection = false;
            if ("wheelViewModeNavigationInverseDirection" in options) {
                this.wheelViewModeNavigationInverseDirection = options.wheelViewModeNavigationInverseDirection;
            } else if ("wheelViewModeNavigationInverseDirection" in this.element.data()) {
                this.wheelViewModeNavigationInverseDirection = this.element.data("view-mode-wheel-navigation-inverse-dir");
            }
            this.wheelViewModeNavigationDelay = 100;
            if ("wheelViewModeNavigationDelay" in options) {
                this.wheelViewModeNavigationDelay = options.wheelViewModeNavigationDelay;
            } else if ("wheelViewModeNavigationDelay" in this.element.data()) {
                this.wheelViewModeNavigationDelay = this.element.data("view-mode-wheel-navigation-delay");
            }
            this.startViewMode = 2;
            if ("startView" in options) {
                this.startViewMode = options.startView;
            } else if ("startView" in this.element.data()) {
                this.startViewMode = this.element.data("start-view");
            }
            this.startViewMode = DPGlobal.convertViewMode(this.startViewMode);
            this.viewMode = this.startViewMode;
            this.viewSelect = this.minView;
            if ("viewSelect" in options) {
                this.viewSelect = options.viewSelect;
            } else if ("viewSelect" in this.element.data()) {
                this.viewSelect = this.element.data("view-select");
            }
            this.viewSelect = DPGlobal.convertViewMode(this.viewSelect);
            this.forceParse = true;
            if ("forceParse" in options) {
                this.forceParse = options.forceParse;
            } else if ("dateForceParse" in this.element.data()) {
                this.forceParse = this.element.data("date-force-parse");
            }
            this.picker = $(this.bootcssVer == 3 ? DPGlobal.templateV3 : DPGlobal.template).appendTo(this.isInline ? this.element : "body").on({
                click: $.proxy(this.click, this),
                mousedown: $.proxy(this.mousedown, this)
            });
            if (this.wheelViewModeNavigation) {
                if ($.fn.mousewheel) {
                    this.picker.on({
                        mousewheel: $.proxy(this.mousewheel, this)
                    });
                } else {
                    console.log("Mouse Wheel event is not supported. Please include the jQuery Mouse Wheel plugin before enabling this option");
                }
            }
            if (this.isInline) {
                this.picker.addClass("datetimepicker-inline");
            } else {
                this.picker.addClass("datetimepicker-dropdown-" + this.pickerPosition + " dropdown-menu");
            }
            if (this.isRTL) {
                this.picker.addClass("datetimepicker-rtl");
                if (this.bootcssVer == 3) {
                    this.picker.find(".prev span, .next span").toggleClass("glyphicon-arrow-left glyphicon-arrow-right");
                } else {
                    this.picker.find(".prev i, .next i").toggleClass("icon-arrow-left icon-arrow-right");
                }
            }
            $(document).on("mousedown", function(e) {
                // Clicked outside the datetimepicker, hide it
                if ($(e.target).closest(".datetimepicker").length === 0) {
                    that.hide();
                }
            });
            this.autoclose = false;
            if ("autoclose" in options) {
                this.autoclose = options.autoclose;
            } else if ("dateAutoclose" in this.element.data()) {
                this.autoclose = this.element.data("date-autoclose");
            }
            this.keyboardNavigation = true;
            if ("keyboardNavigation" in options) {
                this.keyboardNavigation = options.keyboardNavigation;
            } else if ("dateKeyboardNavigation" in this.element.data()) {
                this.keyboardNavigation = this.element.data("date-keyboard-navigation");
            }
            this.todayBtn = options.todayBtn || this.element.data("date-today-btn") || false;
            this.todayHighlight = options.todayHighlight || this.element.data("date-today-highlight") || false;
            this.weekStart = (options.weekStart || this.element.data("date-weekstart") || dates[this.language].weekStart || 0) % 7;
            this.weekEnd = (this.weekStart + 6) % 7;
            this.startDate = -Infinity;
            this.endDate = Infinity;
            this.daysOfWeekDisabled = [];
            this.setStartDate(options.startDate || this.element.data("date-startdate"));
            this.setEndDate(options.endDate || this.element.data("date-enddate"));
            this.setDaysOfWeekDisabled(options.daysOfWeekDisabled || this.element.data("date-days-of-week-disabled"));
            this.fillDow();
            this.fillMonths();
            this.update();
            this.showMode();
            if (this.isInline) {
                this.show();
            }
        };
        Datetimepicker.prototype = {
            constructor: Datetimepicker,
            _events: [],
            _attachEvents: function() {
                this._detachEvents();
                if (this.isInput) {
                    // single input
                    this._events = [ [ this.element, {
                        focus: $.proxy(this.show, this),
                        keyup: $.proxy(this.update, this),
                        keydown: $.proxy(this.keydown, this)
                    } ] ];
                } else if (this.component && this.hasInput) {
                    // component: input + button
                    this._events = [ // For components that are not readonly, allow keyboard nav
                    [ this.element.find("input"), {
                        focus: $.proxy(this.show, this),
                        keyup: $.proxy(this.update, this),
                        keydown: $.proxy(this.keydown, this)
                    } ], [ this.component, {
                        click: $.proxy(this.show, this)
                    } ] ];
                    if (this.componentReset) {
                        this._events.push([ this.componentReset, {
                            click: $.proxy(this.reset, this)
                        } ]);
                    }
                } else if (this.element.is("div")) {
                    // inline datetimepicker
                    this.isInline = true;
                } else {
                    this._events = [ [ this.element, {
                        click: $.proxy(this.show, this)
                    } ] ];
                }
                for (var i = 0, el, ev; i < this._events.length; i++) {
                    el = this._events[i][0];
                    ev = this._events[i][1];
                    el.on(ev);
                }
            },
            _detachEvents: function() {
                for (var i = 0, el, ev; i < this._events.length; i++) {
                    el = this._events[i][0];
                    ev = this._events[i][1];
                    el.off(ev);
                }
                this._events = [];
            },
            show: function(e) {
                this.picker.show();
                this.height = this.component ? this.component.outerHeight() : this.element.outerHeight();
                if (this.forceParse) {
                    this.update();
                }
                this.place();
                $(window).on("resize", $.proxy(this.place, this));
                if (e) {
                    e.stopPropagation();
                    e.preventDefault();
                }
                this.isVisible = true;
                this.element.trigger({
                    type: "show",
                    date: this.date
                });
            },
            hide: function(e) {
                if (!this.isVisible) return;
                if (this.isInline) return;
                this.picker.hide();
                $(window).off("resize", this.place);
                this.viewMode = this.startViewMode;
                this.showMode();
                if (!this.isInput) {
                    $(document).off("mousedown", this.hide);
                }
                if (this.forceParse && (this.isInput && this.element.val() || this.hasInput && this.element.find("input").val())) this.setValue();
                this.isVisible = false;
                this.element.trigger({
                    type: "hide",
                    date: this.date
                });
            },
            remove: function() {
                this._detachEvents();
                this.picker.remove();
                delete this.picker;
                delete this.element.data().datetimepicker;
            },
            getDate: function() {
                var d = this.getUTCDate();
                return new Date(d.getTime() + d.getTimezoneOffset() * 6e4);
            },
            getUTCDate: function() {
                return this.date;
            },
            setDate: function(d) {
                this.setUTCDate(new Date(d.getTime() - d.getTimezoneOffset() * 6e4));
            },
            setUTCDate: function(d) {
                if (d >= this.startDate && d <= this.endDate) {
                    this.date = d;
                    this.setValue();
                    this.viewDate = this.date;
                    this.fill();
                } else {
                    this.element.trigger({
                        type: "outOfRange",
                        date: d,
                        startDate: this.startDate,
                        endDate: this.endDate
                    });
                }
            },
            setFormat: function(format) {
                this.format = DPGlobal.parseFormat(format, this.formatType);
                var element;
                if (this.isInput) {
                    element = this.element;
                } else if (this.component) {
                    element = this.element.find("input");
                }
                if (element && element.val()) {
                    this.setValue();
                }
            },
            setValue: function() {
                var formatted = this.getFormattedDate();
                if (!this.isInput) {
                    if (this.component) {
                        this.element.find("input").val(formatted);
                    }
                    this.element.data("date", formatted);
                } else {
                    this.element.val(formatted);
                }
                if (this.linkField) {
                    $("#" + this.linkField).val(this.getFormattedDate(this.linkFormat));
                }
            },
            getFormattedDate: function(format) {
                if (format == undefined) format = this.format;
                return DPGlobal.formatDate(this.date, format, this.language, this.formatType);
            },
            setStartDate: function(startDate) {
                this.startDate = startDate || -Infinity;
                if (this.startDate !== -Infinity) {
                    this.startDate = DPGlobal.parseDate(this.startDate, this.format, this.language, this.formatType);
                }
                this.update();
                this.updateNavArrows();
            },
            setEndDate: function(endDate) {
                this.endDate = endDate || Infinity;
                if (this.endDate !== Infinity) {
                    this.endDate = DPGlobal.parseDate(this.endDate, this.format, this.language, this.formatType);
                }
                this.update();
                this.updateNavArrows();
            },
            setDaysOfWeekDisabled: function(daysOfWeekDisabled) {
                this.daysOfWeekDisabled = daysOfWeekDisabled || [];
                if (!$.isArray(this.daysOfWeekDisabled)) {
                    this.daysOfWeekDisabled = this.daysOfWeekDisabled.split(/,\s*/);
                }
                this.daysOfWeekDisabled = $.map(this.daysOfWeekDisabled, function(d) {
                    return parseInt(d, 10);
                });
                this.update();
                this.updateNavArrows();
            },
            place: function() {
                if (this.isInline) return;
                var index_highest = 0;
                $("div").each(function() {
                    var index_current = parseInt($(this).css("zIndex"), 10);
                    if (index_current > index_highest) {
                        index_highest = index_current;
                    }
                });
                var zIndex = index_highest + 10;
                var offset, top, left;
                if (this.component) {
                    offset = this.component.offset();
                    left = offset.left;
                    if (this.pickerPosition == "bottom-left" || this.pickerPosition == "top-left") {
                        left += this.component.outerWidth() - this.picker.outerWidth();
                    }
                } else {
                    offset = this.element.offset();
                    left = offset.left;
                }
                if (this.pickerPosition == "top-left" || this.pickerPosition == "top-right") {
                    top = offset.top - this.picker.outerHeight();
                } else {
                    top = offset.top + this.height;
                }
                this.picker.css({
                    top: top,
                    left: left,
                    zIndex: zIndex
                });
            },
            update: function() {
                var date, fromArgs = false;
                if (arguments && arguments.length && (typeof arguments[0] === "string" || arguments[0] instanceof Date)) {
                    date = arguments[0];
                    fromArgs = true;
                } else {
                    date = this.element.data("date") || (this.isInput ? this.element.val() : this.element.find("input").val()) || this.initialDate;
                    if (typeof date == "string" || date instanceof String) {
                        date = date.replace(/^\s+|\s+$/g, "");
                    }
                }
                if (!date) {
                    date = new Date();
                    fromArgs = false;
                }
                this.date = DPGlobal.parseDate(date, this.format, this.language, this.formatType);
                if (fromArgs) this.setValue();
                if (this.date < this.startDate) {
                    this.viewDate = new Date(this.startDate);
                } else if (this.date > this.endDate) {
                    this.viewDate = new Date(this.endDate);
                } else {
                    this.viewDate = new Date(this.date);
                }
                this.fill();
            },
            fillDow: function() {
                var dowCnt = this.weekStart, html = "<tr>";
                while (dowCnt < this.weekStart + 7) {
                    html += '<th class="dow">' + dates[this.language].daysMin[dowCnt++ % 7] + "</th>";
                }
                html += "</tr>";
                this.picker.find(".datetimepicker-days thead").append(html);
            },
            fillMonths: function() {
                var html = "", i = 0;
                while (i < 12) {
                    html += '<span class="month">' + dates[this.language].monthsShort[i++] + "</span>";
                }
                this.picker.find(".datetimepicker-months td").html(html);
            },
            fill: function() {
                if (this.date == null || this.viewDate == null) {
                    return;
                }
                var d = new Date(this.viewDate), year = d.getUTCFullYear(), month = d.getUTCMonth(), dayMonth = d.getUTCDate(), hours = d.getUTCHours(), minutes = d.getUTCMinutes(), startYear = this.startDate !== -Infinity ? this.startDate.getUTCFullYear() : -Infinity, startMonth = this.startDate !== -Infinity ? this.startDate.getUTCMonth() : -Infinity, endYear = this.endDate !== Infinity ? this.endDate.getUTCFullYear() : Infinity, endMonth = this.endDate !== Infinity ? this.endDate.getUTCMonth() : Infinity, currentDate = new UTCDate(this.date.getUTCFullYear(), this.date.getUTCMonth(), this.date.getUTCDate()).valueOf(), today = new Date();
                this.picker.find(".datetimepicker-days thead th:eq(1)").text(dates[this.language].months[month] + " " + year);
                if (this.formatViewType == "time") {
                    var hourConverted = hours % 12 ? hours % 12 : 12;
                    var hoursDisplay = (hourConverted < 10 ? "0" : "") + hourConverted;
                    var minutesDisplay = (minutes < 10 ? "0" : "") + minutes;
                    var meridianDisplay = dates[this.language].meridiem[hours < 12 ? 0 : 1];
                    this.picker.find(".datetimepicker-hours thead th:eq(1)").text(hoursDisplay + ":" + minutesDisplay + " " + meridianDisplay.toUpperCase());
                    this.picker.find(".datetimepicker-minutes thead th:eq(1)").text(hoursDisplay + ":" + minutesDisplay + " " + meridianDisplay.toUpperCase());
                } else {
                    this.picker.find(".datetimepicker-hours thead th:eq(1)").text(dayMonth + " " + dates[this.language].months[month] + " " + year);
                    this.picker.find(".datetimepicker-minutes thead th:eq(1)").text(dayMonth + " " + dates[this.language].months[month] + " " + year);
                }
                this.picker.find("tfoot th.today").text(dates[this.language].today).toggle(this.todayBtn !== false);
                this.updateNavArrows();
                this.fillMonths();
                /*var prevMonth = UTCDate(year, month, 0,0,0,0,0);
			 prevMonth.setUTCDate(prevMonth.getDate() - (prevMonth.getUTCDay() - this.weekStart + 7)%7);*/
                var prevMonth = UTCDate(year, month - 1, 28, 0, 0, 0, 0), day = DPGlobal.getDaysInMonth(prevMonth.getUTCFullYear(), prevMonth.getUTCMonth());
                prevMonth.setUTCDate(day);
                prevMonth.setUTCDate(day - (prevMonth.getUTCDay() - this.weekStart + 7) % 7);
                var nextMonth = new Date(prevMonth);
                nextMonth.setUTCDate(nextMonth.getUTCDate() + 42);
                nextMonth = nextMonth.valueOf();
                var html = [];
                var clsName;
                while (prevMonth.valueOf() < nextMonth) {
                    if (prevMonth.getUTCDay() == this.weekStart) {
                        html.push("<tr>");
                    }
                    clsName = "";
                    if (prevMonth.getUTCFullYear() < year || prevMonth.getUTCFullYear() == year && prevMonth.getUTCMonth() < month) {
                        clsName += " old";
                    } else if (prevMonth.getUTCFullYear() > year || prevMonth.getUTCFullYear() == year && prevMonth.getUTCMonth() > month) {
                        clsName += " new";
                    }
                    // Compare internal UTC date with local today, not UTC today
                    if (this.todayHighlight && prevMonth.getUTCFullYear() == today.getFullYear() && prevMonth.getUTCMonth() == today.getMonth() && prevMonth.getUTCDate() == today.getDate()) {
                        clsName += " today";
                    }
                    if (prevMonth.valueOf() == currentDate) {
                        clsName += " active";
                    }
                    if (prevMonth.valueOf() + 864e5 <= this.startDate || prevMonth.valueOf() > this.endDate || $.inArray(prevMonth.getUTCDay(), this.daysOfWeekDisabled) !== -1) {
                        clsName += " disabled";
                    }
                    html.push('<td class="day' + clsName + '">' + prevMonth.getUTCDate() + "</td>");
                    if (prevMonth.getUTCDay() == this.weekEnd) {
                        html.push("</tr>");
                    }
                    prevMonth.setUTCDate(prevMonth.getUTCDate() + 1);
                }
                this.picker.find(".datetimepicker-days tbody").empty().append(html.join(""));
                html = [];
                var txt = "", meridian = "", meridianOld = "";
                for (var i = 0; i < 24; i++) {
                    var actual = UTCDate(year, month, dayMonth, i);
                    clsName = "";
                    // We want the previous hour for the startDate
                    if (actual.valueOf() + 36e5 <= this.startDate || actual.valueOf() > this.endDate) {
                        clsName += " disabled";
                    } else if (hours == i) {
                        clsName += " active";
                    }
                    if (this.showMeridian && dates[this.language].meridiem.length == 2) {
                        meridian = i < 12 ? dates[this.language].meridiem[0] : dates[this.language].meridiem[1];
                        if (meridian != meridianOld) {
                            if (meridianOld != "") {
                                html.push("</fieldset>");
                            }
                            html.push('<fieldset class="hour"><legend>' + meridian.toUpperCase() + "</legend>");
                        }
                        meridianOld = meridian;
                        txt = i % 12 ? i % 12 : 12;
                        html.push('<span class="hour' + clsName + " hour_" + (i < 12 ? "am" : "pm") + '">' + txt + "</span>");
                        if (i == 23) {
                            html.push("</fieldset>");
                        }
                    } else {
                        txt = i + ":00";
                        html.push('<span class="hour' + clsName + '">' + txt + "</span>");
                    }
                }
                this.picker.find(".datetimepicker-hours td").html(html.join(""));
                html = [];
                txt = "", meridian = "", meridianOld = "";
                for (var i = 0; i < 60; i += this.minuteStep) {
                    var actual = UTCDate(year, month, dayMonth, hours, i, 0);
                    clsName = "";
                    if (actual.valueOf() < this.startDate || actual.valueOf() > this.endDate) {
                        clsName += " disabled";
                    } else if (Math.floor(minutes / this.minuteStep) == Math.floor(i / this.minuteStep)) {
                        clsName += " active";
                    }
                    if (this.showMeridian && dates[this.language].meridiem.length == 2) {
                        meridian = hours < 12 ? dates[this.language].meridiem[0] : dates[this.language].meridiem[1];
                        if (meridian != meridianOld) {
                            if (meridianOld != "") {
                                html.push("</fieldset>");
                            }
                            html.push('<fieldset class="minute"><legend>' + meridian.toUpperCase() + "</legend>");
                        }
                        meridianOld = meridian;
                        txt = hours % 12 ? hours % 12 : 12;
                        //html.push('<span class="minute'+clsName+' minute_'+(hours<12?'am':'pm')+'">'+txt+'</span>');
                        html.push('<span class="minute' + clsName + '">' + txt + ":" + (i < 10 ? "0" + i : i) + "</span>");
                        if (i == 59) {
                            html.push("</fieldset>");
                        }
                    } else {
                        txt = i + ":00";
                        //html.push('<span class="hour'+clsName+'">'+txt+'</span>');
                        html.push('<span class="minute' + clsName + '">' + hours + ":" + (i < 10 ? "0" + i : i) + "</span>");
                    }
                }
                this.picker.find(".datetimepicker-minutes td").html(html.join(""));
                var currentYear = this.date.getUTCFullYear();
                var months = this.picker.find(".datetimepicker-months").find("th:eq(1)").text(year).end().find("span").removeClass("active");
                if (currentYear == year) {
                    months.eq(this.date.getUTCMonth()).addClass("active");
                }
                if (year < startYear || year > endYear) {
                    months.addClass("disabled");
                }
                if (year == startYear) {
                    months.slice(0, startMonth).addClass("disabled");
                }
                if (year == endYear) {
                    months.slice(endMonth + 1).addClass("disabled");
                }
                html = "";
                year = parseInt(year / 10, 10) * 10;
                var yearCont = this.picker.find(".datetimepicker-years").find("th:eq(1)").text(year + "-" + (year + 9)).end().find("td");
                year -= 1;
                for (var i = -1; i < 11; i++) {
                    html += '<span class="year' + (i == -1 || i == 10 ? " old" : "") + (currentYear == year ? " active" : "") + (year < startYear || year > endYear ? " disabled" : "") + '">' + year + "</span>";
                    year += 1;
                }
                yearCont.html(html);
                this.place();
            },
            updateNavArrows: function() {
                var d = new Date(this.viewDate), year = d.getUTCFullYear(), month = d.getUTCMonth(), day = d.getUTCDate(), hour = d.getUTCHours();
                switch (this.viewMode) {
                  case 0:
                    if (this.startDate !== -Infinity && year <= this.startDate.getUTCFullYear() && month <= this.startDate.getUTCMonth() && day <= this.startDate.getUTCDate() && hour <= this.startDate.getUTCHours()) {
                        this.picker.find(".prev").css({
                            visibility: "hidden"
                        });
                    } else {
                        this.picker.find(".prev").css({
                            visibility: "visible"
                        });
                    }
                    if (this.endDate !== Infinity && year >= this.endDate.getUTCFullYear() && month >= this.endDate.getUTCMonth() && day >= this.endDate.getUTCDate() && hour >= this.endDate.getUTCHours()) {
                        this.picker.find(".next").css({
                            visibility: "hidden"
                        });
                    } else {
                        this.picker.find(".next").css({
                            visibility: "visible"
                        });
                    }
                    break;

                  case 1:
                    if (this.startDate !== -Infinity && year <= this.startDate.getUTCFullYear() && month <= this.startDate.getUTCMonth() && day <= this.startDate.getUTCDate()) {
                        this.picker.find(".prev").css({
                            visibility: "hidden"
                        });
                    } else {
                        this.picker.find(".prev").css({
                            visibility: "visible"
                        });
                    }
                    if (this.endDate !== Infinity && year >= this.endDate.getUTCFullYear() && month >= this.endDate.getUTCMonth() && day >= this.endDate.getUTCDate()) {
                        this.picker.find(".next").css({
                            visibility: "hidden"
                        });
                    } else {
                        this.picker.find(".next").css({
                            visibility: "visible"
                        });
                    }
                    break;

                  case 2:
                    if (this.startDate !== -Infinity && year <= this.startDate.getUTCFullYear() && month <= this.startDate.getUTCMonth()) {
                        this.picker.find(".prev").css({
                            visibility: "hidden"
                        });
                    } else {
                        this.picker.find(".prev").css({
                            visibility: "visible"
                        });
                    }
                    if (this.endDate !== Infinity && year >= this.endDate.getUTCFullYear() && month >= this.endDate.getUTCMonth()) {
                        this.picker.find(".next").css({
                            visibility: "hidden"
                        });
                    } else {
                        this.picker.find(".next").css({
                            visibility: "visible"
                        });
                    }
                    break;

                  case 3:
                  case 4:
                    if (this.startDate !== -Infinity && year <= this.startDate.getUTCFullYear()) {
                        this.picker.find(".prev").css({
                            visibility: "hidden"
                        });
                    } else {
                        this.picker.find(".prev").css({
                            visibility: "visible"
                        });
                    }
                    if (this.endDate !== Infinity && year >= this.endDate.getUTCFullYear()) {
                        this.picker.find(".next").css({
                            visibility: "hidden"
                        });
                    } else {
                        this.picker.find(".next").css({
                            visibility: "visible"
                        });
                    }
                    break;
                }
            },
            mousewheel: function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (this.wheelPause) {
                    return;
                }
                this.wheelPause = true;
                var originalEvent = e.originalEvent;
                var delta = originalEvent.wheelDelta;
                var mode = delta > 0 ? 1 : delta === 0 ? 0 : -1;
                if (this.wheelViewModeNavigationInverseDirection) {
                    mode = -mode;
                }
                this.showMode(mode);
                setTimeout($.proxy(function() {
                    this.wheelPause = false;
                }, this), this.wheelViewModeNavigationDelay);
            },
            click: function(e) {
                e.stopPropagation();
                e.preventDefault();
                var target = $(e.target).closest("span, td, th, legend");
                if (target.length == 1) {
                    if (target.is(".disabled")) {
                        this.element.trigger({
                            type: "outOfRange",
                            date: this.viewDate,
                            startDate: this.startDate,
                            endDate: this.endDate
                        });
                        return;
                    }
                    switch (target[0].nodeName.toLowerCase()) {
                      case "th":
                        switch (target[0].className) {
                          case "switch":
                            this.showMode(1);
                            break;

                          case "prev":
                          case "next":
                            var dir = DPGlobal.modes[this.viewMode].navStep * (target[0].className == "prev" ? -1 : 1);
                            switch (this.viewMode) {
                              case 0:
                                this.viewDate = this.moveHour(this.viewDate, dir);
                                break;

                              case 1:
                                this.viewDate = this.moveDate(this.viewDate, dir);
                                break;

                              case 2:
                                this.viewDate = this.moveMonth(this.viewDate, dir);
                                break;

                              case 3:
                              case 4:
                                this.viewDate = this.moveYear(this.viewDate, dir);
                                break;
                            }
                            this.fill();
                            break;

                          case "today":
                            var date = new Date();
                            date = UTCDate(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), 0);
                            // Respect startDate and endDate.
                            if (date < this.startDate) date = this.startDate; else if (date > this.endDate) date = this.endDate;
                            this.viewMode = this.startViewMode;
                            this.showMode(0);
                            this._setDate(date);
                            this.fill();
                            if (this.autoclose) {
                                this.hide();
                            }
                            break;
                        }
                        break;

                      case "span":
                        if (!target.is(".disabled")) {
                            var year = this.viewDate.getUTCFullYear(), month = this.viewDate.getUTCMonth(), day = this.viewDate.getUTCDate(), hours = this.viewDate.getUTCHours(), minutes = this.viewDate.getUTCMinutes(), seconds = this.viewDate.getUTCSeconds();
                            if (target.is(".month")) {
                                this.viewDate.setUTCDate(1);
                                month = target.parent().find("span").index(target);
                                day = this.viewDate.getUTCDate();
                                this.viewDate.setUTCMonth(month);
                                this.element.trigger({
                                    type: "changeMonth",
                                    date: this.viewDate
                                });
                                if (this.viewSelect >= 3) {
                                    this._setDate(UTCDate(year, month, day, hours, minutes, seconds, 0));
                                }
                            } else if (target.is(".year")) {
                                this.viewDate.setUTCDate(1);
                                year = parseInt(target.text(), 10) || 0;
                                this.viewDate.setUTCFullYear(year);
                                this.element.trigger({
                                    type: "changeYear",
                                    date: this.viewDate
                                });
                                if (this.viewSelect >= 4) {
                                    this._setDate(UTCDate(year, month, day, hours, minutes, seconds, 0));
                                }
                            } else if (target.is(".hour")) {
                                hours = parseInt(target.text(), 10) || 0;
                                if (target.hasClass("hour_am") || target.hasClass("hour_pm")) {
                                    if (hours == 12 && target.hasClass("hour_am")) {
                                        hours = 0;
                                    } else if (hours != 12 && target.hasClass("hour_pm")) {
                                        hours += 12;
                                    }
                                }
                                this.viewDate.setUTCHours(hours);
                                this.element.trigger({
                                    type: "changeHour",
                                    date: this.viewDate
                                });
                                if (this.viewSelect >= 1) {
                                    this._setDate(UTCDate(year, month, day, hours, minutes, seconds, 0));
                                }
                            } else if (target.is(".minute")) {
                                minutes = parseInt(target.text().substr(target.text().indexOf(":") + 1), 10) || 0;
                                this.viewDate.setUTCMinutes(minutes);
                                this.element.trigger({
                                    type: "changeMinute",
                                    date: this.viewDate
                                });
                                if (this.viewSelect >= 0) {
                                    this._setDate(UTCDate(year, month, day, hours, minutes, seconds, 0));
                                }
                            }
                            if (this.viewMode != 0) {
                                var oldViewMode = this.viewMode;
                                this.showMode(-1);
                                this.fill();
                                if (oldViewMode == this.viewMode && this.autoclose) {
                                    this.hide();
                                }
                            } else {
                                this.fill();
                                if (this.autoclose) {
                                    this.hide();
                                }
                            }
                        }
                        break;

                      case "td":
                        if (target.is(".day") && !target.is(".disabled")) {
                            var day = parseInt(target.text(), 10) || 1;
                            var year = this.viewDate.getUTCFullYear(), month = this.viewDate.getUTCMonth(), hours = this.viewDate.getUTCHours(), minutes = this.viewDate.getUTCMinutes(), seconds = this.viewDate.getUTCSeconds();
                            if (target.is(".old")) {
                                if (month === 0) {
                                    month = 11;
                                    year -= 1;
                                } else {
                                    month -= 1;
                                }
                            } else if (target.is(".new")) {
                                if (month == 11) {
                                    month = 0;
                                    year += 1;
                                } else {
                                    month += 1;
                                }
                            }
                            this.viewDate.setUTCFullYear(year);
                            this.viewDate.setUTCMonth(month);
                            this.viewDate.setUTCDate(day);
                            this.element.trigger({
                                type: "changeDay",
                                date: this.viewDate
                            });
                            if (this.viewSelect >= 2) {
                                this._setDate(UTCDate(year, month, day, hours, minutes, seconds, 0));
                            }
                        }
                        var oldViewMode = this.viewMode;
                        this.showMode(-1);
                        this.fill();
                        if (oldViewMode == this.viewMode && this.autoclose) {
                            this.hide();
                        }
                        break;
                    }
                }
            },
            _setDate: function(date, which) {
                if (!which || which == "date") this.date = date;
                if (!which || which == "view") this.viewDate = date;
                this.fill();
                this.setValue();
                var element;
                if (this.isInput) {
                    element = this.element;
                } else if (this.component) {
                    element = this.element.find("input");
                }
                if (element) {
                    element.change();
                    if (this.autoclose && (!which || which == "date")) {}
                }
                this.element.trigger({
                    type: "changeDate",
                    date: this.date
                });
            },
            moveMinute: function(date, dir) {
                if (!dir) return date;
                var new_date = new Date(date.valueOf());
                //dir = dir > 0 ? 1 : -1;
                new_date.setUTCMinutes(new_date.getUTCMinutes() + dir * this.minuteStep);
                return new_date;
            },
            moveHour: function(date, dir) {
                if (!dir) return date;
                var new_date = new Date(date.valueOf());
                //dir = dir > 0 ? 1 : -1;
                new_date.setUTCHours(new_date.getUTCHours() + dir);
                return new_date;
            },
            moveDate: function(date, dir) {
                if (!dir) return date;
                var new_date = new Date(date.valueOf());
                //dir = dir > 0 ? 1 : -1;
                new_date.setUTCDate(new_date.getUTCDate() + dir);
                return new_date;
            },
            moveMonth: function(date, dir) {
                if (!dir) return date;
                var new_date = new Date(date.valueOf()), day = new_date.getUTCDate(), month = new_date.getUTCMonth(), mag = Math.abs(dir), new_month, test;
                dir = dir > 0 ? 1 : -1;
                if (mag == 1) {
                    test = dir == -1 ? function() {
                        return new_date.getUTCMonth() == month;
                    } : function() {
                        return new_date.getUTCMonth() != new_month;
                    };
                    new_month = month + dir;
                    new_date.setUTCMonth(new_month);
                    // Dec -> Jan (12) or Jan -> Dec (-1) -- limit expected date to 0-11
                    if (new_month < 0 || new_month > 11) new_month = (new_month + 12) % 12;
                } else {
                    // For magnitudes >1, move one month at a time...
                    for (var i = 0; i < mag; i++) // ...which might decrease the day (eg, Jan 31 to Feb 28, etc)...
                    new_date = this.moveMonth(new_date, dir);
                    // ...then reset the day, keeping it in the new month
                    new_month = new_date.getUTCMonth();
                    new_date.setUTCDate(day);
                    test = function() {
                        return new_month != new_date.getUTCMonth();
                    };
                }
                // Common date-resetting loop -- if date is beyond end of month, make it
                // end of month
                while (test()) {
                    new_date.setUTCDate(--day);
                    new_date.setUTCMonth(new_month);
                }
                return new_date;
            },
            moveYear: function(date, dir) {
                return this.moveMonth(date, dir * 12);
            },
            dateWithinRange: function(date) {
                return date >= this.startDate && date <= this.endDate;
            },
            keydown: function(e) {
                if (this.picker.is(":not(:visible)")) {
                    if (e.keyCode == 27) // allow escape to hide and re-show picker
                    this.show();
                    return;
                }
                var dateChanged = false, dir, day, month, newDate, newViewDate;
                switch (e.keyCode) {
                  case 27:
                    // escape
                    this.hide();
                    e.preventDefault();
                    break;

                  case 37:
                  // left
                    case 39:
                    // right
                    if (!this.keyboardNavigation) break;
                    dir = e.keyCode == 37 ? -1 : 1;
                    viewMode = this.viewMode;
                    if (e.ctrlKey) {
                        viewMode += 2;
                    } else if (e.shiftKey) {
                        viewMode += 1;
                    }
                    if (viewMode == 4) {
                        newDate = this.moveYear(this.date, dir);
                        newViewDate = this.moveYear(this.viewDate, dir);
                    } else if (viewMode == 3) {
                        newDate = this.moveMonth(this.date, dir);
                        newViewDate = this.moveMonth(this.viewDate, dir);
                    } else if (viewMode == 2) {
                        newDate = this.moveDate(this.date, dir);
                        newViewDate = this.moveDate(this.viewDate, dir);
                    } else if (viewMode == 1) {
                        newDate = this.moveHour(this.date, dir);
                        newViewDate = this.moveHour(this.viewDate, dir);
                    } else if (viewMode == 0) {
                        newDate = this.moveMinute(this.date, dir);
                        newViewDate = this.moveMinute(this.viewDate, dir);
                    }
                    if (this.dateWithinRange(newDate)) {
                        this.date = newDate;
                        this.viewDate = newViewDate;
                        this.setValue();
                        this.update();
                        e.preventDefault();
                        dateChanged = true;
                    }
                    break;

                  case 38:
                  // up
                    case 40:
                    // down
                    if (!this.keyboardNavigation) break;
                    dir = e.keyCode == 38 ? -1 : 1;
                    viewMode = this.viewMode;
                    if (e.ctrlKey) {
                        viewMode += 2;
                    } else if (e.shiftKey) {
                        viewMode += 1;
                    }
                    if (viewMode == 4) {
                        newDate = this.moveYear(this.date, dir);
                        newViewDate = this.moveYear(this.viewDate, dir);
                    } else if (viewMode == 3) {
                        newDate = this.moveMonth(this.date, dir);
                        newViewDate = this.moveMonth(this.viewDate, dir);
                    } else if (viewMode == 2) {
                        newDate = this.moveDate(this.date, dir * 7);
                        newViewDate = this.moveDate(this.viewDate, dir * 7);
                    } else if (viewMode == 1) {
                        if (this.showMeridian) {
                            newDate = this.moveHour(this.date, dir * 6);
                            newViewDate = this.moveHour(this.viewDate, dir * 6);
                        } else {
                            newDate = this.moveHour(this.date, dir * 4);
                            newViewDate = this.moveHour(this.viewDate, dir * 4);
                        }
                    } else if (viewMode == 0) {
                        newDate = this.moveMinute(this.date, dir * 4);
                        newViewDate = this.moveMinute(this.viewDate, dir * 4);
                    }
                    if (this.dateWithinRange(newDate)) {
                        this.date = newDate;
                        this.viewDate = newViewDate;
                        this.setValue();
                        this.update();
                        e.preventDefault();
                        dateChanged = true;
                    }
                    break;

                  case 13:
                    // enter
                    if (this.viewMode != 0) {
                        var oldViewMode = this.viewMode;
                        this.showMode(-1);
                        this.fill();
                        if (oldViewMode == this.viewMode && this.autoclose) {
                            this.hide();
                        }
                    } else {
                        this.fill();
                        if (this.autoclose) {
                            this.hide();
                        }
                    }
                    e.preventDefault();
                    break;

                  case 9:
                    // tab
                    this.hide();
                    break;
                }
                if (dateChanged) {
                    var element;
                    if (this.isInput) {
                        element = this.element;
                    } else if (this.component) {
                        element = this.element.find("input");
                    }
                    if (element) {
                        element.change();
                    }
                    this.element.trigger({
                        type: "changeDate",
                        date: this.date
                    });
                }
            },
            showMode: function(dir) {
                if (dir) {
                    var newViewMode = Math.max(0, Math.min(DPGlobal.modes.length - 1, this.viewMode + dir));
                    if (newViewMode >= this.minView && newViewMode <= this.maxView) {
                        this.element.trigger({
                            type: "changeMode",
                            date: this.viewDate,
                            oldViewMode: this.viewMode,
                            newViewMode: newViewMode
                        });
                        this.viewMode = newViewMode;
                    }
                }
                /*
			 vitalets: fixing bug of very special conditions:
			 jquery 1.7.1 + webkit + show inline datetimepicker in bootstrap popover.
			 Method show() does not set display css correctly and datetimepicker is not shown.
			 Changed to .css('display', 'block') solve the problem.
			 See https://github.com/vitalets/x-editable/issues/37

			 In jquery 1.7.2+ everything works fine.
			 */
                //this.picker.find('>div').hide().filter('.datetimepicker-'+DPGlobal.modes[this.viewMode].clsName).show();
                this.picker.find(">div").hide().filter(".datetimepicker-" + DPGlobal.modes[this.viewMode].clsName).css("display", "block");
                this.updateNavArrows();
            },
            reset: function(e) {
                this._setDate(null, "date");
            }
        };
        $.fn.datetimepicker = function(option) {
            var args = Array.apply(null, arguments);
            args.shift();
            return this.each(function() {
                var $this = $(this), data = $this.data("datetimepicker"), options = typeof option == "object" && option;
                if (!data) {
                    $this.data("datetimepicker", data = new Datetimepicker(this, $.extend({}, $.fn.datetimepicker.defaults, options)));
                }
                if (typeof option == "string" && typeof data[option] == "function") {
                    data[option].apply(data, args);
                }
            });
        };
        $.fn.datetimepicker.defaults = {};
        $.fn.datetimepicker.Constructor = Datetimepicker;
        var dates = $.fn.datetimepicker.dates = {
            en: {
                days: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday" ],
                daysShort: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" ],
                daysMin: [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su" ],
                months: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
                monthsShort: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
                meridiem: [ "am", "pm" ],
                suffix: [ "st", "nd", "rd", "th" ],
                today: "Today"
            }
        };
        var DPGlobal = {
            modes: [ {
                clsName: "minutes",
                navFnc: "Hours",
                navStep: 1
            }, {
                clsName: "hours",
                navFnc: "Date",
                navStep: 1
            }, {
                clsName: "days",
                navFnc: "Month",
                navStep: 1
            }, {
                clsName: "months",
                navFnc: "FullYear",
                navStep: 1
            }, {
                clsName: "years",
                navFnc: "FullYear",
                navStep: 10
            } ],
            isLeapYear: function(year) {
                return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
            },
            getDaysInMonth: function(year, month) {
                return [ 31, DPGlobal.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ][month];
            },
            getDefaultFormat: function(type, field) {
                if (type == "standard") {
                    if (field == "input") return "yyyy-mm-dd hh:ii"; else return "yyyy-mm-dd hh:ii:ss";
                } else if (type == "php") {
                    if (field == "input") return "Y-m-d H:i"; else return "Y-m-d H:i:s";
                } else {
                    throw new Error("Invalid format type.");
                }
            },
            validParts: function(type) {
                if (type == "standard") {
                    return /hh?|HH?|p|P|ii?|ss?|dd?|DD?|mm?|MM?|yy(?:yy)?/g;
                } else if (type == "php") {
                    return /[dDjlNwzFmMnStyYaABgGhHis]/g;
                } else {
                    throw new Error("Invalid format type.");
                }
            },
            nonpunctuation: /[^ -\/:-@\[-`{-~\t\n\rTZ]+/g,
            parseFormat: function(format, type) {
                // IE treats \0 as a string end in inputs (truncating the value),
                // so it's a bad format delimiter, anyway
                var separators = format.replace(this.validParts(type), "\0").split("\0"), parts = format.match(this.validParts(type));
                if (!separators || !separators.length || !parts || parts.length == 0) {
                    throw new Error("Invalid date format.");
                }
                return {
                    separators: separators,
                    parts: parts
                };
            },
            parseDate: function(date, format, language, type) {
                if (date instanceof Date) {
                    var dateUTC = new Date(date.valueOf() - date.getTimezoneOffset() * 6e4);
                    dateUTC.setMilliseconds(0);
                    return dateUTC;
                }
                if (/^\d{4}\-\d{1,2}\-\d{1,2}$/.test(date)) {
                    format = this.parseFormat("yyyy-mm-dd", type);
                }
                if (/^\d{4}\-\d{1,2}\-\d{1,2}[T ]\d{1,2}\:\d{1,2}$/.test(date)) {
                    format = this.parseFormat("yyyy-mm-dd hh:ii", type);
                }
                if (/^\d{4}\-\d{1,2}\-\d{1,2}[T ]\d{1,2}\:\d{1,2}\:\d{1,2}[Z]{0,1}$/.test(date)) {
                    format = this.parseFormat("yyyy-mm-dd hh:ii:ss", type);
                }
                if (/^[-+]\d+[dmwy]([\s,]+[-+]\d+[dmwy])*$/.test(date)) {
                    var part_re = /([-+]\d+)([dmwy])/, parts = date.match(/([-+]\d+)([dmwy])/g), part, dir;
                    date = new Date();
                    for (var i = 0; i < parts.length; i++) {
                        part = part_re.exec(parts[i]);
                        dir = parseInt(part[1]);
                        switch (part[2]) {
                          case "d":
                            date.setUTCDate(date.getUTCDate() + dir);
                            break;

                          case "m":
                            date = Datetimepicker.prototype.moveMonth.call(Datetimepicker.prototype, date, dir);
                            break;

                          case "w":
                            date.setUTCDate(date.getUTCDate() + dir * 7);
                            break;

                          case "y":
                            date = Datetimepicker.prototype.moveYear.call(Datetimepicker.prototype, date, dir);
                            break;
                        }
                    }
                    return UTCDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), 0);
                }
                var parts = date && date.match(this.nonpunctuation) || [], date = new Date(0, 0, 0, 0, 0, 0, 0), parsed = {}, setters_order = [ "hh", "h", "ii", "i", "ss", "s", "yyyy", "yy", "M", "MM", "m", "mm", "D", "DD", "d", "dd", "H", "HH", "p", "P" ], setters_map = {
                    hh: function(d, v) {
                        return d.setUTCHours(v);
                    },
                    h: function(d, v) {
                        return d.setUTCHours(v);
                    },
                    HH: function(d, v) {
                        return d.setUTCHours(v == 12 ? 0 : v);
                    },
                    H: function(d, v) {
                        return d.setUTCHours(v == 12 ? 0 : v);
                    },
                    ii: function(d, v) {
                        return d.setUTCMinutes(v);
                    },
                    i: function(d, v) {
                        return d.setUTCMinutes(v);
                    },
                    ss: function(d, v) {
                        return d.setUTCSeconds(v);
                    },
                    s: function(d, v) {
                        return d.setUTCSeconds(v);
                    },
                    yyyy: function(d, v) {
                        return d.setUTCFullYear(v);
                    },
                    yy: function(d, v) {
                        return d.setUTCFullYear(2e3 + v);
                    },
                    m: function(d, v) {
                        v -= 1;
                        while (v < 0) v += 12;
                        v %= 12;
                        d.setUTCMonth(v);
                        while (d.getUTCMonth() != v) d.setUTCDate(d.getUTCDate() - 1);
                        return d;
                    },
                    d: function(d, v) {
                        return d.setUTCDate(v);
                    },
                    p: function(d, v) {
                        return d.setUTCHours(v == 1 ? d.getUTCHours() + 12 : d.getUTCHours());
                    }
                }, val, filtered, part;
                setters_map["M"] = setters_map["MM"] = setters_map["mm"] = setters_map["m"];
                setters_map["dd"] = setters_map["d"];
                setters_map["P"] = setters_map["p"];
                date = UTCDate(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
                if (parts.length == format.parts.length) {
                    for (var i = 0, cnt = format.parts.length; i < cnt; i++) {
                        val = parseInt(parts[i], 10);
                        part = format.parts[i];
                        if (isNaN(val)) {
                            switch (part) {
                              case "MM":
                                filtered = $(dates[language].months).filter(function() {
                                    var m = this.slice(0, parts[i].length), p = parts[i].slice(0, m.length);
                                    return m == p;
                                });
                                val = $.inArray(filtered[0], dates[language].months) + 1;
                                break;

                              case "M":
                                filtered = $(dates[language].monthsShort).filter(function() {
                                    var m = this.slice(0, parts[i].length), p = parts[i].slice(0, m.length);
                                    return m == p;
                                });
                                val = $.inArray(filtered[0], dates[language].monthsShort) + 1;
                                break;

                              case "p":
                              case "P":
                                val = $.inArray(parts[i].toLowerCase(), dates[language].meridiem);
                                break;
                            }
                        }
                        parsed[part] = val;
                    }
                    for (var i = 0, s; i < setters_order.length; i++) {
                        s = setters_order[i];
                        if (s in parsed && !isNaN(parsed[s])) setters_map[s](date, parsed[s]);
                    }
                }
                return date;
            },
            formatDate: function(date, format, language, type) {
                if (date == null) {
                    return "";
                }
                var val;
                if (type == "standard") {
                    val = {
                        // year
                        yy: date.getUTCFullYear().toString().substring(2),
                        yyyy: date.getUTCFullYear(),
                        // month
                        m: date.getUTCMonth() + 1,
                        M: dates[language].monthsShort[date.getUTCMonth()],
                        MM: dates[language].months[date.getUTCMonth()],
                        // day
                        d: date.getUTCDate(),
                        D: dates[language].daysShort[date.getUTCDay()],
                        DD: dates[language].days[date.getUTCDay()],
                        p: dates[language].meridiem.length == 2 ? dates[language].meridiem[date.getUTCHours() < 12 ? 0 : 1] : "",
                        // hour
                        h: date.getUTCHours(),
                        // minute
                        i: date.getUTCMinutes(),
                        // second
                        s: date.getUTCSeconds()
                    };
                    if (dates[language].meridiem.length == 2) {
                        val.H = val.h % 12 == 0 ? 12 : val.h % 12;
                    } else {
                        val.H = val.h;
                    }
                    val.HH = (val.H < 10 ? "0" : "") + val.H;
                    val.P = val.p.toUpperCase();
                    val.hh = (val.h < 10 ? "0" : "") + val.h;
                    val.ii = (val.i < 10 ? "0" : "") + val.i;
                    val.ss = (val.s < 10 ? "0" : "") + val.s;
                    val.dd = (val.d < 10 ? "0" : "") + val.d;
                    val.mm = (val.m < 10 ? "0" : "") + val.m;
                } else if (type == "php") {
                    // php format
                    val = {
                        // year
                        y: date.getUTCFullYear().toString().substring(2),
                        Y: date.getUTCFullYear(),
                        // month
                        F: dates[language].months[date.getUTCMonth()],
                        M: dates[language].monthsShort[date.getUTCMonth()],
                        n: date.getUTCMonth() + 1,
                        t: DPGlobal.getDaysInMonth(date.getUTCFullYear(), date.getUTCMonth()),
                        // day
                        j: date.getUTCDate(),
                        l: dates[language].days[date.getUTCDay()],
                        D: dates[language].daysShort[date.getUTCDay()],
                        w: date.getUTCDay(),
                        // 0 -> 6
                        N: date.getUTCDay() == 0 ? 7 : date.getUTCDay(),
                        // 1 -> 7
                        S: date.getUTCDate() % 10 <= dates[language].suffix.length ? dates[language].suffix[date.getUTCDate() % 10 - 1] : "",
                        // hour
                        a: dates[language].meridiem.length == 2 ? dates[language].meridiem[date.getUTCHours() < 12 ? 0 : 1] : "",
                        g: date.getUTCHours() % 12 == 0 ? 12 : date.getUTCHours() % 12,
                        G: date.getUTCHours(),
                        // minute
                        i: date.getUTCMinutes(),
                        // second
                        s: date.getUTCSeconds()
                    };
                    val.m = (val.n < 10 ? "0" : "") + val.n;
                    val.d = (val.j < 10 ? "0" : "") + val.j;
                    val.A = val.a.toString().toUpperCase();
                    val.h = (val.g < 10 ? "0" : "") + val.g;
                    val.H = (val.G < 10 ? "0" : "") + val.G;
                    val.i = (val.i < 10 ? "0" : "") + val.i;
                    val.s = (val.s < 10 ? "0" : "") + val.s;
                } else {
                    throw new Error("Invalid format type.");
                }
                var date = [], seps = $.extend([], format.separators);
                for (var i = 0, cnt = format.parts.length; i < cnt; i++) {
                    if (seps.length) {
                        date.push(seps.shift());
                    }
                    date.push(val[format.parts[i]]);
                }
                if (seps.length) {
                    date.push(seps.shift());
                }
                return date.join("");
            },
            convertViewMode: function(viewMode) {
                switch (viewMode) {
                  case 4:
                  case "decade":
                    viewMode = 4;
                    break;

                  case 3:
                  case "year":
                    viewMode = 3;
                    break;

                  case 2:
                  case "month":
                    viewMode = 2;
                    break;

                  case 1:
                  case "day":
                    viewMode = 1;
                    break;

                  case 0:
                  case "hour":
                    viewMode = 0;
                    break;
                }
                return viewMode;
            },
            headTemplate: "<thead>" + "<tr>" + '<th class="prev"><i class="icon-arrow-left"/></th>' + '<th colspan="5" class="switch"></th>' + '<th class="next"><i class="icon-arrow-right"/></th>' + "</tr>" + "</thead>",
            headTemplateV3: "<thead>" + "<tr>" + '<th class="prev"><i class="glyphicon glyphicon-arrow-left"></i> </th>' + '<th colspan="5" class="switch"></th>' + '<th class="next"><i class="glyphicon glyphicon-arrow-right"></i> </th>' + "</tr>" + "</thead>",
            contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>',
            footTemplate: '<tfoot><tr><th colspan="7" class="today"></th></tr></tfoot>'
        };
        DPGlobal.template = '<div class="datetimepicker">' + '<div class="datetimepicker-minutes">' + '<table class=" table-condensed">' + DPGlobal.headTemplate + DPGlobal.contTemplate + DPGlobal.footTemplate + "</table>" + "</div>" + '<div class="datetimepicker-hours">' + '<table class=" table-condensed">' + DPGlobal.headTemplate + DPGlobal.contTemplate + DPGlobal.footTemplate + "</table>" + "</div>" + '<div class="datetimepicker-days">' + '<table class=" table-condensed">' + DPGlobal.headTemplate + "<tbody></tbody>" + DPGlobal.footTemplate + "</table>" + "</div>" + '<div class="datetimepicker-months">' + '<table class="table-condensed">' + DPGlobal.headTemplate + DPGlobal.contTemplate + DPGlobal.footTemplate + "</table>" + "</div>" + '<div class="datetimepicker-years">' + '<table class="table-condensed">' + DPGlobal.headTemplate + DPGlobal.contTemplate + DPGlobal.footTemplate + "</table>" + "</div>" + "</div>";
        DPGlobal.templateV3 = '<div class="datetimepicker">' + '<div class="datetimepicker-minutes">' + '<table class=" table-condensed">' + DPGlobal.headTemplateV3 + DPGlobal.contTemplate + DPGlobal.footTemplate + "</table>" + "</div>" + '<div class="datetimepicker-hours">' + '<table class=" table-condensed">' + DPGlobal.headTemplateV3 + DPGlobal.contTemplate + DPGlobal.footTemplate + "</table>" + "</div>" + '<div class="datetimepicker-days">' + '<table class=" table-condensed">' + DPGlobal.headTemplateV3 + "<tbody></tbody>" + DPGlobal.footTemplate + "</table>" + "</div>" + '<div class="datetimepicker-months">' + '<table class="table-condensed">' + DPGlobal.headTemplateV3 + DPGlobal.contTemplate + DPGlobal.footTemplate + "</table>" + "</div>" + '<div class="datetimepicker-years">' + '<table class="table-condensed">' + DPGlobal.headTemplateV3 + DPGlobal.contTemplate + DPGlobal.footTemplate + "</table>" + "</div>" + "</div>";
        $.fn.datetimepicker.DPGlobal = DPGlobal;
        /* DATETIMEPICKER NO CONFLICT
	 * =================== */
        $.fn.datetimepicker.noConflict = function() {
            $.fn.datetimepicker = old;
            return this;
        };
        /* DATETIMEPICKER DATA-API
	 * ================== */
        $(document).on("focus.datetimepicker.data-api click.datetimepicker.data-api", '[data-provide="datetimepicker"]', function(e) {
            var $this = $(this);
            if ($this.data("datetimepicker")) return;
            e.preventDefault();
            // component click requires us to explicitly show it
            $this.datetimepicker("show");
        });
        $(function() {
            $('[data-provide="datetimepicker-inline"]').datetimepicker();
        });
    }($);
});

define("fiftyk/bootstrap-datetimepicker/1.0.0/bootstrap-datetimepicker-debug.css", [], function() {
    seajs.importStyle(".datetimepicker{padding:4px;margin-top:1px;-webkit-border-radius:4px;-moz-border-radius:4px;border-radius:4px;direction:ltr}.datetimepicker-inline{width:220px}.datetimepicker.datetimepicker-rtl{direction:rtl}.datetimepicker.datetimepicker-rtl table tr td span{float:right}.datetimepicker-dropdown,.datetimepicker-dropdown-left{top:0;left:0}[class*=\" datetimepicker-dropdown\"]:before{content:'';display:inline-block;border-left:7px solid transparent;border-right:7px solid transparent;border-bottom:7px solid #ccc;border-bottom-color:rgba(0,0,0,.2);position:absolute}[class*=\" datetimepicker-dropdown\"]:after{content:'';display:inline-block;border-left:6px solid transparent;border-right:6px solid transparent;border-bottom:6px solid #fff;position:absolute}[class*=\" datetimepicker-dropdown-top\"]:before{content:'';display:inline-block;border-left:7px solid transparent;border-right:7px solid transparent;border-top:7px solid #ccc;border-top-color:rgba(0,0,0,.2);border-bottom:0}[class*=\" datetimepicker-dropdown-top\"]:after{content:'';display:inline-block;border-left:6px solid transparent;border-right:6px solid transparent;border-top:6px solid #fff;border-bottom:0}.datetimepicker-dropdown-bottom-left:before{top:-7px;right:6px}.datetimepicker-dropdown-bottom-left:after{top:-6px;right:7px}.datetimepicker-dropdown-bottom-right:before{top:-7px;left:6px}.datetimepicker-dropdown-bottom-right:after{top:-6px;left:7px}.datetimepicker-dropdown-top-left:before{bottom:-7px;right:6px}.datetimepicker-dropdown-top-left:after{bottom:-6px;right:7px}.datetimepicker-dropdown-top-right:before{bottom:-7px;left:6px}.datetimepicker-dropdown-top-right:after{bottom:-6px;left:7px}.datetimepicker>div{display:none}.datetimepicker.minutes div.datetimepicker-minutes{display:block}.datetimepicker.hours div.datetimepicker-hours{display:block}.datetimepicker.days div.datetimepicker-days{display:block}.datetimepicker.months div.datetimepicker-months{display:block}.datetimepicker.years div.datetimepicker-years{display:block}.datetimepicker table{margin:0}.datetimepicker td,.datetimepicker th{text-align:center;width:20px;height:20px;-webkit-border-radius:4px;-moz-border-radius:4px;border-radius:4px;border:0}.table-striped .datetimepicker table tr td,.table-striped .datetimepicker table tr th{background-color:transparent}.datetimepicker table tr td.minute:hover{background:#eee;cursor:pointer}.datetimepicker table tr td.hour:hover{background:#eee;cursor:pointer}.datetimepicker table tr td.day:hover{background:#eee;cursor:pointer}.datetimepicker table tr td.old,.datetimepicker table tr td.new{color:#999}.datetimepicker table tr td.disabled,.datetimepicker table tr td.disabled:hover{background:0;color:#999;cursor:default}.datetimepicker table tr td.today,.datetimepicker table tr td.today:hover,.datetimepicker table tr td.today.disabled,.datetimepicker table tr td.today.disabled:hover{background-color:#fde19a;background-image:-moz-linear-gradient(top,#fdd49a,#fdf59a);background-image:-ms-linear-gradient(top,#fdd49a,#fdf59a);background-image:-webkit-gradient(linear,0 0,0 100%,from(#fdd49a),to(#fdf59a));background-image:-webkit-linear-gradient(top,#fdd49a,#fdf59a);background-image:-o-linear-gradient(top,#fdd49a,#fdf59a);background-image:linear-gradient(top,#fdd49a,#fdf59a);background-repeat:repeat-x;filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#fdd49a', endColorstr='#fdf59a', GradientType=0);border-color:#fdf59a #fdf59a #fbed50;border-color:rgba(0,0,0,.1) rgba(0,0,0,.1) rgba(0,0,0,.25);filter:progid:DXImageTransform.Microsoft.gradient(enabled=false)}.datetimepicker table tr td.today:hover,.datetimepicker table tr td.today:hover:hover,.datetimepicker table tr td.today.disabled:hover,.datetimepicker table tr td.today.disabled:hover:hover,.datetimepicker table tr td.today:active,.datetimepicker table tr td.today:hover:active,.datetimepicker table tr td.today.disabled:active,.datetimepicker table tr td.today.disabled:hover:active,.datetimepicker table tr td.today.active,.datetimepicker table tr td.today:hover.active,.datetimepicker table tr td.today.disabled.active,.datetimepicker table tr td.today.disabled:hover.active,.datetimepicker table tr td.today.disabled,.datetimepicker table tr td.today:hover.disabled,.datetimepicker table tr td.today.disabled.disabled,.datetimepicker table tr td.today.disabled:hover.disabled,.datetimepicker table tr td.today[disabled],.datetimepicker table tr td.today:hover[disabled],.datetimepicker table tr td.today.disabled[disabled],.datetimepicker table tr td.today.disabled:hover[disabled]{background-color:#fdf59a}.datetimepicker table tr td.today:active,.datetimepicker table tr td.today:hover:active,.datetimepicker table tr td.today.disabled:active,.datetimepicker table tr td.today.disabled:hover:active,.datetimepicker table tr td.today.active,.datetimepicker table tr td.today:hover.active,.datetimepicker table tr td.today.disabled.active,.datetimepicker table tr td.today.disabled:hover.active{background-color:#fbf069}.datetimepicker table tr td.active,.datetimepicker table tr td.active:hover,.datetimepicker table tr td.active.disabled,.datetimepicker table tr td.active.disabled:hover{background-color:#006dcc;background-image:-moz-linear-gradient(top,#08c,#04c);background-image:-ms-linear-gradient(top,#08c,#04c);background-image:-webkit-gradient(linear,0 0,0 100%,from(#08c),to(#04c));background-image:-webkit-linear-gradient(top,#08c,#04c);background-image:-o-linear-gradient(top,#08c,#04c);background-image:linear-gradient(top,#08c,#04c);background-repeat:repeat-x;filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#0088cc', endColorstr='#0044cc', GradientType=0);border-color:#04c #04c #002a80;border-color:rgba(0,0,0,.1) rgba(0,0,0,.1) rgba(0,0,0,.25);filter:progid:DXImageTransform.Microsoft.gradient(enabled=false);color:#fff;text-shadow:0 -1px 0 rgba(0,0,0,.25)}.datetimepicker table tr td.active:hover,.datetimepicker table tr td.active:hover:hover,.datetimepicker table tr td.active.disabled:hover,.datetimepicker table tr td.active.disabled:hover:hover,.datetimepicker table tr td.active:active,.datetimepicker table tr td.active:hover:active,.datetimepicker table tr td.active.disabled:active,.datetimepicker table tr td.active.disabled:hover:active,.datetimepicker table tr td.active.active,.datetimepicker table tr td.active:hover.active,.datetimepicker table tr td.active.disabled.active,.datetimepicker table tr td.active.disabled:hover.active,.datetimepicker table tr td.active.disabled,.datetimepicker table tr td.active:hover.disabled,.datetimepicker table tr td.active.disabled.disabled,.datetimepicker table tr td.active.disabled:hover.disabled,.datetimepicker table tr td.active[disabled],.datetimepicker table tr td.active:hover[disabled],.datetimepicker table tr td.active.disabled[disabled],.datetimepicker table tr td.active.disabled:hover[disabled]{background-color:#04c}.datetimepicker table tr td.active:active,.datetimepicker table tr td.active:hover:active,.datetimepicker table tr td.active.disabled:active,.datetimepicker table tr td.active.disabled:hover:active,.datetimepicker table tr td.active.active,.datetimepicker table tr td.active:hover.active,.datetimepicker table tr td.active.disabled.active,.datetimepicker table tr td.active.disabled:hover.active{background-color:#039}.datetimepicker table tr td span{display:block;width:23%;height:54px;line-height:54px;float:left;margin:1%;cursor:pointer;-webkit-border-radius:4px;-moz-border-radius:4px;border-radius:4px}.datetimepicker .datetimepicker-hours span{height:26px;line-height:26px}.datetimepicker .datetimepicker-hours table tr td span.hour_am,.datetimepicker .datetimepicker-hours table tr td span.hour_pm{width:14.6%}.datetimepicker .datetimepicker-hours fieldset legend,.datetimepicker .datetimepicker-minutes fieldset legend{margin-bottom:inherit;line-height:30px}.datetimepicker .datetimepicker-minutes span{height:26px;line-height:26px}.datetimepicker table tr td span:hover{background:#eee}.datetimepicker table tr td span.disabled,.datetimepicker table tr td span.disabled:hover{background:0;color:#999;cursor:default}.datetimepicker table tr td span.active,.datetimepicker table tr td span.active:hover,.datetimepicker table tr td span.active.disabled,.datetimepicker table tr td span.active.disabled:hover{background-color:#006dcc;background-image:-moz-linear-gradient(top,#08c,#04c);background-image:-ms-linear-gradient(top,#08c,#04c);background-image:-webkit-gradient(linear,0 0,0 100%,from(#08c),to(#04c));background-image:-webkit-linear-gradient(top,#08c,#04c);background-image:-o-linear-gradient(top,#08c,#04c);background-image:linear-gradient(top,#08c,#04c);background-repeat:repeat-x;filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#0088cc', endColorstr='#0044cc', GradientType=0);border-color:#04c #04c #002a80;border-color:rgba(0,0,0,.1) rgba(0,0,0,.1) rgba(0,0,0,.25);filter:progid:DXImageTransform.Microsoft.gradient(enabled=false);color:#fff;text-shadow:0 -1px 0 rgba(0,0,0,.25)}.datetimepicker table tr td span.active:hover,.datetimepicker table tr td span.active:hover:hover,.datetimepicker table tr td span.active.disabled:hover,.datetimepicker table tr td span.active.disabled:hover:hover,.datetimepicker table tr td span.active:active,.datetimepicker table tr td span.active:hover:active,.datetimepicker table tr td span.active.disabled:active,.datetimepicker table tr td span.active.disabled:hover:active,.datetimepicker table tr td span.active.active,.datetimepicker table tr td span.active:hover.active,.datetimepicker table tr td span.active.disabled.active,.datetimepicker table tr td span.active.disabled:hover.active,.datetimepicker table tr td span.active.disabled,.datetimepicker table tr td span.active:hover.disabled,.datetimepicker table tr td span.active.disabled.disabled,.datetimepicker table tr td span.active.disabled:hover.disabled,.datetimepicker table tr td span.active[disabled],.datetimepicker table tr td span.active:hover[disabled],.datetimepicker table tr td span.active.disabled[disabled],.datetimepicker table tr td span.active.disabled:hover[disabled]{background-color:#04c}.datetimepicker table tr td span.active:active,.datetimepicker table tr td span.active:hover:active,.datetimepicker table tr td span.active.disabled:active,.datetimepicker table tr td span.active.disabled:hover:active,.datetimepicker table tr td span.active.active,.datetimepicker table tr td span.active:hover.active,.datetimepicker table tr td span.active.disabled.active,.datetimepicker table tr td span.active.disabled:hover.active{background-color:#039}.datetimepicker table tr td span.old{color:#999}.datetimepicker th.switch{width:145px}.datetimepicker thead tr:first-child th,.datetimepicker tfoot tr:first-child th{cursor:pointer}.datetimepicker thead tr:first-child th:hover,.datetimepicker tfoot tr:first-child th:hover{background:#eee}.input-append.date .add-on i,.input-prepend.date .add-on i,.input-group.date .input-group-addon span{cursor:pointer;width:14px;height:14px}");
});

define("app/common/initDatetimepicker-debug", [ "$-debug" ], function(require) {
    var $ = require("$-debug");
    $.fn.datetimepicker.dates["en"] = {
        days: [ "星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日" ],
        daysShort: [ "周日", "周一", "周二", "周三", "周四", "周五", "周六", "周日" ],
        daysMin: [ "日", "一", "二", "三", "四", "五", "六", "日" ],
        months: [ "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月" ],
        monthsShort: [ "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月" ],
        today: "今日",
        suffix: [],
        meridiem: [ "上午", "下午" ]
    };
});
