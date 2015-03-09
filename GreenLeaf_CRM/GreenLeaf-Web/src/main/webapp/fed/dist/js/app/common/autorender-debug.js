define("app/common/autorender-debug", [ "$-debug", "./util-debug", "./config-debug", "./dialog/confirmbox-debug", "arale/dialog/1.3.0/dialog-debug", "arale/overlay/1.1.4/overlay-debug", "arale/position/1.0.1/position-debug", "arale/iframe-shim/1.0.2/iframe-shim-debug", "arale/widget/1.1.1/widget-debug", "arale/base/1.1.1/base-debug", "arale/class/1.1.0/class-debug", "arale/events/1.1.0/events-debug", "arale/overlay/1.1.4/mask-debug", "arale/templatable/0.9.2/templatable-debug", "gallery/handlebars/1.0.2/handlebars-debug", "gallery/handlebars/1.0.2/runtime-debug", "./dialog/confirmbox-debug.handlebars", "./dialog/confirmbox-debug.css", "./io-debug", "keenwon/select2/3.4.8/select2-debug" ], function(require, exports, module) {
    "use strict";
    var $ = require("$-debug");
    var util = require("./util-debug");
    var io = require("./io-debug");
    require("keenwon/select2/3.4.8/select2-debug");
    var autoRender = {
        init: function() {
            this.$select = $("[data-widget=select]");
            if (!this.$select) {
                return;
            }
            this.renderSelect();
        },
        renderSelect: function() {
            this.$select.each(function() {
                var $select = $(this);
                var url = $select.data("url");
                var isUser = $select.data("select") === "user";
                io.get(util.getUrl(url), function() {
                    var data = this.data;
                    if (isUser) {
                        $.each(data, function(i, n) {
                            data[i].text = n.text + "(" + n.id + ")";
                        });
                    }
                    $select.select2({
                        data: data,
                        allowClear: true
                    });
                });
                $select.data("selectize", $select[0].selectize);
            });
        }
    };
    autoRender.init();
    return autoRender;
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

/*
Copyright 2012 Igor Vaynberg

Version: @@ver@@ Timestamp: @@timestamp@@

This software is licensed under the Apache License, Version 2.0 (the "Apache License") or the GNU
General Public License version 2 (the "GPL License"). You may choose either license to govern your
use of this software only upon the condition that you accept all of the terms of either the Apache
License or the GPL License.

You may obtain a copy of the Apache License and the GPL License at:

    http://www.apache.org/licenses/LICENSE-2.0
    http://www.gnu.org/licenses/gpl-2.0.html

Unless required by applicable law or agreed to in writing, software distributed under the
Apache License or the GPL License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. See the Apache License and the GPL License for
the specific language governing permissions and limitations under the Apache License and the GPL License.
*/
define("keenwon/select2/3.4.8/select2-debug", [ "$" ], function(require) {
    var jQuery = require("$");
    require("./select2.css");
    (function($) {
        if (typeof $.fn.each2 == "undefined") {
            $.extend($.fn, {
                /*
                * 4-10 times faster .each replacement
                * use it carefully, as it overrides jQuery context of element on each iteration
                */
                each2: function(c) {
                    var j = $([ 0 ]), i = -1, l = this.length;
                    while (++i < l && (j.context = j[0] = this[i]) && c.call(j[0], i, j) !== false) ;
                    return this;
                }
            });
        }
    })(jQuery);
    (function($, undefined) {
        "use strict";
        /*global document, window, jQuery, console */
        if (window.Select2 !== undefined) {
            return;
        }
        var KEY, AbstractSelect2, SingleSelect2, MultiSelect2, nextUid, sizer, lastMousePosition = {
            x: 0,
            y: 0
        }, $document, scrollBarDimensions, KEY = {
            TAB: 9,
            ENTER: 13,
            ESC: 27,
            SPACE: 32,
            LEFT: 37,
            UP: 38,
            RIGHT: 39,
            DOWN: 40,
            SHIFT: 16,
            CTRL: 17,
            ALT: 18,
            PAGE_UP: 33,
            PAGE_DOWN: 34,
            HOME: 36,
            END: 35,
            BACKSPACE: 8,
            DELETE: 46,
            isArrow: function(k) {
                k = k.which ? k.which : k;
                switch (k) {
                  case KEY.LEFT:
                  case KEY.RIGHT:
                  case KEY.UP:
                  case KEY.DOWN:
                    return true;
                }
                return false;
            },
            isControl: function(e) {
                var k = e.which;
                switch (k) {
                  case KEY.SHIFT:
                  case KEY.CTRL:
                  case KEY.ALT:
                    return true;
                }
                if (e.metaKey) return true;
                return false;
            },
            isFunctionKey: function(k) {
                k = k.which ? k.which : k;
                return k >= 112 && k <= 123;
            }
        }, MEASURE_SCROLLBAR_TEMPLATE = "<div class='select2-measure-scrollbar'></div>", DIACRITICS = {
            "Ⓐ": "A",
            "Ａ": "A",
            "À": "A",
            "Á": "A",
            "Â": "A",
            "Ầ": "A",
            "Ấ": "A",
            "Ẫ": "A",
            "Ẩ": "A",
            "Ã": "A",
            "Ā": "A",
            "Ă": "A",
            "Ằ": "A",
            "Ắ": "A",
            "Ẵ": "A",
            "Ẳ": "A",
            "Ȧ": "A",
            "Ǡ": "A",
            "Ä": "A",
            "Ǟ": "A",
            "Ả": "A",
            "Å": "A",
            "Ǻ": "A",
            "Ǎ": "A",
            "Ȁ": "A",
            "Ȃ": "A",
            "Ạ": "A",
            "Ậ": "A",
            "Ặ": "A",
            "Ḁ": "A",
            "Ą": "A",
            "Ⱥ": "A",
            "Ɐ": "A",
            "Ꜳ": "AA",
            "Æ": "AE",
            "Ǽ": "AE",
            "Ǣ": "AE",
            "Ꜵ": "AO",
            "Ꜷ": "AU",
            "Ꜹ": "AV",
            "Ꜻ": "AV",
            "Ꜽ": "AY",
            "Ⓑ": "B",
            "Ｂ": "B",
            "Ḃ": "B",
            "Ḅ": "B",
            "Ḇ": "B",
            "Ƀ": "B",
            "Ƃ": "B",
            "Ɓ": "B",
            "Ⓒ": "C",
            "Ｃ": "C",
            "Ć": "C",
            "Ĉ": "C",
            "Ċ": "C",
            "Č": "C",
            "Ç": "C",
            "Ḉ": "C",
            "Ƈ": "C",
            "Ȼ": "C",
            "Ꜿ": "C",
            "Ⓓ": "D",
            "Ｄ": "D",
            "Ḋ": "D",
            "Ď": "D",
            "Ḍ": "D",
            "Ḑ": "D",
            "Ḓ": "D",
            "Ḏ": "D",
            "Đ": "D",
            "Ƌ": "D",
            "Ɗ": "D",
            "Ɖ": "D",
            "Ꝺ": "D",
            "Ǳ": "DZ",
            "Ǆ": "DZ",
            "ǲ": "Dz",
            "ǅ": "Dz",
            "Ⓔ": "E",
            "Ｅ": "E",
            "È": "E",
            "É": "E",
            "Ê": "E",
            "Ề": "E",
            "Ế": "E",
            "Ễ": "E",
            "Ể": "E",
            "Ẽ": "E",
            "Ē": "E",
            "Ḕ": "E",
            "Ḗ": "E",
            "Ĕ": "E",
            "Ė": "E",
            "Ë": "E",
            "Ẻ": "E",
            "Ě": "E",
            "Ȅ": "E",
            "Ȇ": "E",
            "Ẹ": "E",
            "Ệ": "E",
            "Ȩ": "E",
            "Ḝ": "E",
            "Ę": "E",
            "Ḙ": "E",
            "Ḛ": "E",
            "Ɛ": "E",
            "Ǝ": "E",
            "Ⓕ": "F",
            "Ｆ": "F",
            "Ḟ": "F",
            "Ƒ": "F",
            "Ꝼ": "F",
            "Ⓖ": "G",
            "Ｇ": "G",
            "Ǵ": "G",
            "Ĝ": "G",
            "Ḡ": "G",
            "Ğ": "G",
            "Ġ": "G",
            "Ǧ": "G",
            "Ģ": "G",
            "Ǥ": "G",
            "Ɠ": "G",
            "Ꞡ": "G",
            "Ᵹ": "G",
            "Ꝿ": "G",
            "Ⓗ": "H",
            "Ｈ": "H",
            "Ĥ": "H",
            "Ḣ": "H",
            "Ḧ": "H",
            "Ȟ": "H",
            "Ḥ": "H",
            "Ḩ": "H",
            "Ḫ": "H",
            "Ħ": "H",
            "Ⱨ": "H",
            "Ⱶ": "H",
            "Ɥ": "H",
            "Ⓘ": "I",
            "Ｉ": "I",
            "Ì": "I",
            "Í": "I",
            "Î": "I",
            "Ĩ": "I",
            "Ī": "I",
            "Ĭ": "I",
            "İ": "I",
            "Ï": "I",
            "Ḯ": "I",
            "Ỉ": "I",
            "Ǐ": "I",
            "Ȉ": "I",
            "Ȋ": "I",
            "Ị": "I",
            "Į": "I",
            "Ḭ": "I",
            "Ɨ": "I",
            "Ⓙ": "J",
            "Ｊ": "J",
            "Ĵ": "J",
            "Ɉ": "J",
            "Ⓚ": "K",
            "Ｋ": "K",
            "Ḱ": "K",
            "Ǩ": "K",
            "Ḳ": "K",
            "Ķ": "K",
            "Ḵ": "K",
            "Ƙ": "K",
            "Ⱪ": "K",
            "Ꝁ": "K",
            "Ꝃ": "K",
            "Ꝅ": "K",
            "Ꞣ": "K",
            "Ⓛ": "L",
            "Ｌ": "L",
            "Ŀ": "L",
            "Ĺ": "L",
            "Ľ": "L",
            "Ḷ": "L",
            "Ḹ": "L",
            "Ļ": "L",
            "Ḽ": "L",
            "Ḻ": "L",
            "Ł": "L",
            "Ƚ": "L",
            "Ɫ": "L",
            "Ⱡ": "L",
            "Ꝉ": "L",
            "Ꝇ": "L",
            "Ꞁ": "L",
            "Ǉ": "LJ",
            "ǈ": "Lj",
            "Ⓜ": "M",
            "Ｍ": "M",
            "Ḿ": "M",
            "Ṁ": "M",
            "Ṃ": "M",
            "Ɱ": "M",
            "Ɯ": "M",
            "Ⓝ": "N",
            "Ｎ": "N",
            "Ǹ": "N",
            "Ń": "N",
            "Ñ": "N",
            "Ṅ": "N",
            "Ň": "N",
            "Ṇ": "N",
            "Ņ": "N",
            "Ṋ": "N",
            "Ṉ": "N",
            "Ƞ": "N",
            "Ɲ": "N",
            "Ꞑ": "N",
            "Ꞥ": "N",
            "Ǌ": "NJ",
            "ǋ": "Nj",
            "Ⓞ": "O",
            "Ｏ": "O",
            "Ò": "O",
            "Ó": "O",
            "Ô": "O",
            "Ồ": "O",
            "Ố": "O",
            "Ỗ": "O",
            "Ổ": "O",
            "Õ": "O",
            "Ṍ": "O",
            "Ȭ": "O",
            "Ṏ": "O",
            "Ō": "O",
            "Ṑ": "O",
            "Ṓ": "O",
            "Ŏ": "O",
            "Ȯ": "O",
            "Ȱ": "O",
            "Ö": "O",
            "Ȫ": "O",
            "Ỏ": "O",
            "Ő": "O",
            "Ǒ": "O",
            "Ȍ": "O",
            "Ȏ": "O",
            "Ơ": "O",
            "Ờ": "O",
            "Ớ": "O",
            "Ỡ": "O",
            "Ở": "O",
            "Ợ": "O",
            "Ọ": "O",
            "Ộ": "O",
            "Ǫ": "O",
            "Ǭ": "O",
            "Ø": "O",
            "Ǿ": "O",
            "Ɔ": "O",
            "Ɵ": "O",
            "Ꝋ": "O",
            "Ꝍ": "O",
            "Ƣ": "OI",
            "Ꝏ": "OO",
            "Ȣ": "OU",
            "Ⓟ": "P",
            "Ｐ": "P",
            "Ṕ": "P",
            "Ṗ": "P",
            "Ƥ": "P",
            "Ᵽ": "P",
            "Ꝑ": "P",
            "Ꝓ": "P",
            "Ꝕ": "P",
            "Ⓠ": "Q",
            "Ｑ": "Q",
            "Ꝗ": "Q",
            "Ꝙ": "Q",
            "Ɋ": "Q",
            "Ⓡ": "R",
            "Ｒ": "R",
            "Ŕ": "R",
            "Ṙ": "R",
            "Ř": "R",
            "Ȑ": "R",
            "Ȓ": "R",
            "Ṛ": "R",
            "Ṝ": "R",
            "Ŗ": "R",
            "Ṟ": "R",
            "Ɍ": "R",
            "Ɽ": "R",
            "Ꝛ": "R",
            "Ꞧ": "R",
            "Ꞃ": "R",
            "Ⓢ": "S",
            "Ｓ": "S",
            "ẞ": "S",
            "Ś": "S",
            "Ṥ": "S",
            "Ŝ": "S",
            "Ṡ": "S",
            "Š": "S",
            "Ṧ": "S",
            "Ṣ": "S",
            "Ṩ": "S",
            "Ș": "S",
            "Ş": "S",
            "Ȿ": "S",
            "Ꞩ": "S",
            "Ꞅ": "S",
            "Ⓣ": "T",
            "Ｔ": "T",
            "Ṫ": "T",
            "Ť": "T",
            "Ṭ": "T",
            "Ț": "T",
            "Ţ": "T",
            "Ṱ": "T",
            "Ṯ": "T",
            "Ŧ": "T",
            "Ƭ": "T",
            "Ʈ": "T",
            "Ⱦ": "T",
            "Ꞇ": "T",
            "Ꜩ": "TZ",
            "Ⓤ": "U",
            "Ｕ": "U",
            "Ù": "U",
            "Ú": "U",
            "Û": "U",
            "Ũ": "U",
            "Ṹ": "U",
            "Ū": "U",
            "Ṻ": "U",
            "Ŭ": "U",
            "Ü": "U",
            "Ǜ": "U",
            "Ǘ": "U",
            "Ǖ": "U",
            "Ǚ": "U",
            "Ủ": "U",
            "Ů": "U",
            "Ű": "U",
            "Ǔ": "U",
            "Ȕ": "U",
            "Ȗ": "U",
            "Ư": "U",
            "Ừ": "U",
            "Ứ": "U",
            "Ữ": "U",
            "Ử": "U",
            "Ự": "U",
            "Ụ": "U",
            "Ṳ": "U",
            "Ų": "U",
            "Ṷ": "U",
            "Ṵ": "U",
            "Ʉ": "U",
            "Ⓥ": "V",
            "Ｖ": "V",
            "Ṽ": "V",
            "Ṿ": "V",
            "Ʋ": "V",
            "Ꝟ": "V",
            "Ʌ": "V",
            "Ꝡ": "VY",
            "Ⓦ": "W",
            "Ｗ": "W",
            "Ẁ": "W",
            "Ẃ": "W",
            "Ŵ": "W",
            "Ẇ": "W",
            "Ẅ": "W",
            "Ẉ": "W",
            "Ⱳ": "W",
            "Ⓧ": "X",
            "Ｘ": "X",
            "Ẋ": "X",
            "Ẍ": "X",
            "Ⓨ": "Y",
            "Ｙ": "Y",
            "Ỳ": "Y",
            "Ý": "Y",
            "Ŷ": "Y",
            "Ỹ": "Y",
            "Ȳ": "Y",
            "Ẏ": "Y",
            "Ÿ": "Y",
            "Ỷ": "Y",
            "Ỵ": "Y",
            "Ƴ": "Y",
            "Ɏ": "Y",
            "Ỿ": "Y",
            "Ⓩ": "Z",
            "Ｚ": "Z",
            "Ź": "Z",
            "Ẑ": "Z",
            "Ż": "Z",
            "Ž": "Z",
            "Ẓ": "Z",
            "Ẕ": "Z",
            "Ƶ": "Z",
            "Ȥ": "Z",
            "Ɀ": "Z",
            "Ⱬ": "Z",
            "Ꝣ": "Z",
            "ⓐ": "a",
            "ａ": "a",
            "ẚ": "a",
            "à": "a",
            "á": "a",
            "â": "a",
            "ầ": "a",
            "ấ": "a",
            "ẫ": "a",
            "ẩ": "a",
            "ã": "a",
            "ā": "a",
            "ă": "a",
            "ằ": "a",
            "ắ": "a",
            "ẵ": "a",
            "ẳ": "a",
            "ȧ": "a",
            "ǡ": "a",
            "ä": "a",
            "ǟ": "a",
            "ả": "a",
            "å": "a",
            "ǻ": "a",
            "ǎ": "a",
            "ȁ": "a",
            "ȃ": "a",
            "ạ": "a",
            "ậ": "a",
            "ặ": "a",
            "ḁ": "a",
            "ą": "a",
            "ⱥ": "a",
            "ɐ": "a",
            "ꜳ": "aa",
            "æ": "ae",
            "ǽ": "ae",
            "ǣ": "ae",
            "ꜵ": "ao",
            "ꜷ": "au",
            "ꜹ": "av",
            "ꜻ": "av",
            "ꜽ": "ay",
            "ⓑ": "b",
            "ｂ": "b",
            "ḃ": "b",
            "ḅ": "b",
            "ḇ": "b",
            "ƀ": "b",
            "ƃ": "b",
            "ɓ": "b",
            "ⓒ": "c",
            "ｃ": "c",
            "ć": "c",
            "ĉ": "c",
            "ċ": "c",
            "č": "c",
            "ç": "c",
            "ḉ": "c",
            "ƈ": "c",
            "ȼ": "c",
            "ꜿ": "c",
            "ↄ": "c",
            "ⓓ": "d",
            "ｄ": "d",
            "ḋ": "d",
            "ď": "d",
            "ḍ": "d",
            "ḑ": "d",
            "ḓ": "d",
            "ḏ": "d",
            "đ": "d",
            "ƌ": "d",
            "ɖ": "d",
            "ɗ": "d",
            "ꝺ": "d",
            "ǳ": "dz",
            "ǆ": "dz",
            "ⓔ": "e",
            "ｅ": "e",
            "è": "e",
            "é": "e",
            "ê": "e",
            "ề": "e",
            "ế": "e",
            "ễ": "e",
            "ể": "e",
            "ẽ": "e",
            "ē": "e",
            "ḕ": "e",
            "ḗ": "e",
            "ĕ": "e",
            "ė": "e",
            "ë": "e",
            "ẻ": "e",
            "ě": "e",
            "ȅ": "e",
            "ȇ": "e",
            "ẹ": "e",
            "ệ": "e",
            "ȩ": "e",
            "ḝ": "e",
            "ę": "e",
            "ḙ": "e",
            "ḛ": "e",
            "ɇ": "e",
            "ɛ": "e",
            "ǝ": "e",
            "ⓕ": "f",
            "ｆ": "f",
            "ḟ": "f",
            "ƒ": "f",
            "ꝼ": "f",
            "ⓖ": "g",
            "ｇ": "g",
            "ǵ": "g",
            "ĝ": "g",
            "ḡ": "g",
            "ğ": "g",
            "ġ": "g",
            "ǧ": "g",
            "ģ": "g",
            "ǥ": "g",
            "ɠ": "g",
            "ꞡ": "g",
            "ᵹ": "g",
            "ꝿ": "g",
            "ⓗ": "h",
            "ｈ": "h",
            "ĥ": "h",
            "ḣ": "h",
            "ḧ": "h",
            "ȟ": "h",
            "ḥ": "h",
            "ḩ": "h",
            "ḫ": "h",
            "ẖ": "h",
            "ħ": "h",
            "ⱨ": "h",
            "ⱶ": "h",
            "ɥ": "h",
            "ƕ": "hv",
            "ⓘ": "i",
            "ｉ": "i",
            "ì": "i",
            "í": "i",
            "î": "i",
            "ĩ": "i",
            "ī": "i",
            "ĭ": "i",
            "ï": "i",
            "ḯ": "i",
            "ỉ": "i",
            "ǐ": "i",
            "ȉ": "i",
            "ȋ": "i",
            "ị": "i",
            "į": "i",
            "ḭ": "i",
            "ɨ": "i",
            "ı": "i",
            "ⓙ": "j",
            "ｊ": "j",
            "ĵ": "j",
            "ǰ": "j",
            "ɉ": "j",
            "ⓚ": "k",
            "ｋ": "k",
            "ḱ": "k",
            "ǩ": "k",
            "ḳ": "k",
            "ķ": "k",
            "ḵ": "k",
            "ƙ": "k",
            "ⱪ": "k",
            "ꝁ": "k",
            "ꝃ": "k",
            "ꝅ": "k",
            "ꞣ": "k",
            "ⓛ": "l",
            "ｌ": "l",
            "ŀ": "l",
            "ĺ": "l",
            "ľ": "l",
            "ḷ": "l",
            "ḹ": "l",
            "ļ": "l",
            "ḽ": "l",
            "ḻ": "l",
            "ſ": "l",
            "ł": "l",
            "ƚ": "l",
            "ɫ": "l",
            "ⱡ": "l",
            "ꝉ": "l",
            "ꞁ": "l",
            "ꝇ": "l",
            "ǉ": "lj",
            "ⓜ": "m",
            "ｍ": "m",
            "ḿ": "m",
            "ṁ": "m",
            "ṃ": "m",
            "ɱ": "m",
            "ɯ": "m",
            "ⓝ": "n",
            "ｎ": "n",
            "ǹ": "n",
            "ń": "n",
            "ñ": "n",
            "ṅ": "n",
            "ň": "n",
            "ṇ": "n",
            "ņ": "n",
            "ṋ": "n",
            "ṉ": "n",
            "ƞ": "n",
            "ɲ": "n",
            "ŉ": "n",
            "ꞑ": "n",
            "ꞥ": "n",
            "ǌ": "nj",
            "ⓞ": "o",
            "ｏ": "o",
            "ò": "o",
            "ó": "o",
            "ô": "o",
            "ồ": "o",
            "ố": "o",
            "ỗ": "o",
            "ổ": "o",
            "õ": "o",
            "ṍ": "o",
            "ȭ": "o",
            "ṏ": "o",
            "ō": "o",
            "ṑ": "o",
            "ṓ": "o",
            "ŏ": "o",
            "ȯ": "o",
            "ȱ": "o",
            "ö": "o",
            "ȫ": "o",
            "ỏ": "o",
            "ő": "o",
            "ǒ": "o",
            "ȍ": "o",
            "ȏ": "o",
            "ơ": "o",
            "ờ": "o",
            "ớ": "o",
            "ỡ": "o",
            "ở": "o",
            "ợ": "o",
            "ọ": "o",
            "ộ": "o",
            "ǫ": "o",
            "ǭ": "o",
            "ø": "o",
            "ǿ": "o",
            "ɔ": "o",
            "ꝋ": "o",
            "ꝍ": "o",
            "ɵ": "o",
            "ƣ": "oi",
            "ȣ": "ou",
            "ꝏ": "oo",
            "ⓟ": "p",
            "ｐ": "p",
            "ṕ": "p",
            "ṗ": "p",
            "ƥ": "p",
            "ᵽ": "p",
            "ꝑ": "p",
            "ꝓ": "p",
            "ꝕ": "p",
            "ⓠ": "q",
            "ｑ": "q",
            "ɋ": "q",
            "ꝗ": "q",
            "ꝙ": "q",
            "ⓡ": "r",
            "ｒ": "r",
            "ŕ": "r",
            "ṙ": "r",
            "ř": "r",
            "ȑ": "r",
            "ȓ": "r",
            "ṛ": "r",
            "ṝ": "r",
            "ŗ": "r",
            "ṟ": "r",
            "ɍ": "r",
            "ɽ": "r",
            "ꝛ": "r",
            "ꞧ": "r",
            "ꞃ": "r",
            "ⓢ": "s",
            "ｓ": "s",
            "ß": "s",
            "ś": "s",
            "ṥ": "s",
            "ŝ": "s",
            "ṡ": "s",
            "š": "s",
            "ṧ": "s",
            "ṣ": "s",
            "ṩ": "s",
            "ș": "s",
            "ş": "s",
            "ȿ": "s",
            "ꞩ": "s",
            "ꞅ": "s",
            "ẛ": "s",
            "ⓣ": "t",
            "ｔ": "t",
            "ṫ": "t",
            "ẗ": "t",
            "ť": "t",
            "ṭ": "t",
            "ț": "t",
            "ţ": "t",
            "ṱ": "t",
            "ṯ": "t",
            "ŧ": "t",
            "ƭ": "t",
            "ʈ": "t",
            "ⱦ": "t",
            "ꞇ": "t",
            "ꜩ": "tz",
            "ⓤ": "u",
            "ｕ": "u",
            "ù": "u",
            "ú": "u",
            "û": "u",
            "ũ": "u",
            "ṹ": "u",
            "ū": "u",
            "ṻ": "u",
            "ŭ": "u",
            "ü": "u",
            "ǜ": "u",
            "ǘ": "u",
            "ǖ": "u",
            "ǚ": "u",
            "ủ": "u",
            "ů": "u",
            "ű": "u",
            "ǔ": "u",
            "ȕ": "u",
            "ȗ": "u",
            "ư": "u",
            "ừ": "u",
            "ứ": "u",
            "ữ": "u",
            "ử": "u",
            "ự": "u",
            "ụ": "u",
            "ṳ": "u",
            "ų": "u",
            "ṷ": "u",
            "ṵ": "u",
            "ʉ": "u",
            "ⓥ": "v",
            "ｖ": "v",
            "ṽ": "v",
            "ṿ": "v",
            "ʋ": "v",
            "ꝟ": "v",
            "ʌ": "v",
            "ꝡ": "vy",
            "ⓦ": "w",
            "ｗ": "w",
            "ẁ": "w",
            "ẃ": "w",
            "ŵ": "w",
            "ẇ": "w",
            "ẅ": "w",
            "ẘ": "w",
            "ẉ": "w",
            "ⱳ": "w",
            "ⓧ": "x",
            "ｘ": "x",
            "ẋ": "x",
            "ẍ": "x",
            "ⓨ": "y",
            "ｙ": "y",
            "ỳ": "y",
            "ý": "y",
            "ŷ": "y",
            "ỹ": "y",
            "ȳ": "y",
            "ẏ": "y",
            "ÿ": "y",
            "ỷ": "y",
            "ẙ": "y",
            "ỵ": "y",
            "ƴ": "y",
            "ɏ": "y",
            "ỿ": "y",
            "ⓩ": "z",
            "ｚ": "z",
            "ź": "z",
            "ẑ": "z",
            "ż": "z",
            "ž": "z",
            "ẓ": "z",
            "ẕ": "z",
            "ƶ": "z",
            "ȥ": "z",
            "ɀ": "z",
            "ⱬ": "z",
            "ꝣ": "z",
            "Ά": "Α",
            "Έ": "Ε",
            "Ή": "Η",
            "Ί": "Ι",
            "Ϊ": "Ι",
            "Ό": "Ο",
            "Ύ": "Υ",
            "Ϋ": "Υ",
            "Ώ": "Ω",
            "ά": "α",
            "έ": "ε",
            "ή": "η",
            "ί": "ι",
            "ϊ": "ι",
            "ΐ": "ι",
            "ό": "ο",
            "ύ": "υ",
            "ϋ": "υ",
            "ΰ": "υ",
            "ω": "ω",
            "ς": "σ"
        };
        $document = $(document);
        nextUid = function() {
            var counter = 1;
            return function() {
                return counter++;
            };
        }();
        function reinsertElement(element) {
            var placeholder = $(document.createTextNode(""));
            element.before(placeholder);
            placeholder.before(element);
            placeholder.remove();
        }
        function stripDiacritics(str) {
            // Used 'uni range + named function' from http://jsperf.com/diacritics/18
            function match(a) {
                return DIACRITICS[a] || a;
            }
            return str.replace(/[^\u0000-\u007E]/g, match);
        }
        function indexOf(value, array) {
            var i = 0, l = array.length;
            for (;i < l; i = i + 1) {
                if (equal(value, array[i])) return i;
            }
            return -1;
        }
        function measureScrollbar() {
            var $template = $(MEASURE_SCROLLBAR_TEMPLATE);
            $template.appendTo("body");
            var dim = {
                width: $template.width() - $template[0].clientWidth,
                height: $template.height() - $template[0].clientHeight
            };
            $template.remove();
            return dim;
        }
        /**
         * Compares equality of a and b
         * @param a
         * @param b
         */
        function equal(a, b) {
            if (a === b) return true;
            if (a === undefined || b === undefined) return false;
            if (a === null || b === null) return false;
            // Check whether 'a' or 'b' is a string (primitive or object).
            // The concatenation of an empty string (+'') converts its argument to a string's primitive.
            if (a.constructor === String) return a + "" === b + "";
            // a+'' - in case 'a' is a String object
            if (b.constructor === String) return b + "" === a + "";
            // b+'' - in case 'b' is a String object
            return false;
        }
        /**
         * Splits the string into an array of values, trimming each value. An empty array is returned for nulls or empty
         * strings
         * @param string
         * @param separator
         */
        function splitVal(string, separator) {
            var val, i, l;
            if (string === null || string.length < 1) return [];
            val = string.split(separator);
            for (i = 0, l = val.length; i < l; i = i + 1) val[i] = $.trim(val[i]);
            return val;
        }
        function getSideBorderPadding(element) {
            return element.outerWidth(false) - element.width();
        }
        function installKeyUpChangeEvent(element) {
            var key = "keyup-change-value";
            element.on("keydown", function() {
                if ($.data(element, key) === undefined) {
                    $.data(element, key, element.val());
                }
            });
            element.on("keyup", function() {
                var val = $.data(element, key);
                if (val !== undefined && element.val() !== val) {
                    $.removeData(element, key);
                    element.trigger("keyup-change");
                }
            });
        }
        /**
         * filters mouse events so an event is fired only if the mouse moved.
         *
         * filters out mouse events that occur when mouse is stationary but
         * the elements under the pointer are scrolled.
         */
        function installFilteredMouseMove(element) {
            element.on("mousemove", function(e) {
                var lastpos = lastMousePosition;
                if (lastpos === undefined || lastpos.x !== e.pageX || lastpos.y !== e.pageY) {
                    $(e.target).trigger("mousemove-filtered", e);
                }
            });
        }
        /**
         * Debounces a function. Returns a function that calls the original fn function only if no invocations have been made
         * within the last quietMillis milliseconds.
         *
         * @param quietMillis number of milliseconds to wait before invoking fn
         * @param fn function to be debounced
         * @param ctx object to be used as this reference within fn
         * @return debounced version of fn
         */
        function debounce(quietMillis, fn, ctx) {
            ctx = ctx || undefined;
            var timeout;
            return function() {
                var args = arguments;
                window.clearTimeout(timeout);
                timeout = window.setTimeout(function() {
                    fn.apply(ctx, args);
                }, quietMillis);
            };
        }
        function installDebouncedScroll(threshold, element) {
            var notify = debounce(threshold, function(e) {
                element.trigger("scroll-debounced", e);
            });
            element.on("scroll", function(e) {
                if (indexOf(e.target, element.get()) >= 0) notify(e);
            });
        }
        function focus($el) {
            if ($el[0] === document.activeElement) return;
            /* set the focus in a 0 timeout - that way the focus is set after the processing
                of the current event has finished - which seems like the only reliable way
                to set focus */
            window.setTimeout(function() {
                var el = $el[0], pos = $el.val().length, range;
                $el.focus();
                /* make sure el received focus so we do not error out when trying to manipulate the caret.
                    sometimes modals or others listeners may steal it after its set */
                var isVisible = el.offsetWidth > 0 || el.offsetHeight > 0;
                if (isVisible && el === document.activeElement) {
                    /* after the focus is set move the caret to the end, necessary when we val()
                        just before setting focus */
                    if (el.setSelectionRange) {
                        el.setSelectionRange(pos, pos);
                    } else if (el.createTextRange) {
                        range = el.createTextRange();
                        range.collapse(false);
                        range.select();
                    }
                }
            }, 0);
        }
        function getCursorInfo(el) {
            el = $(el)[0];
            var offset = 0;
            var length = 0;
            if ("selectionStart" in el) {
                offset = el.selectionStart;
                length = el.selectionEnd - offset;
            } else if ("selection" in document) {
                el.focus();
                var sel = document.selection.createRange();
                length = document.selection.createRange().text.length;
                sel.moveStart("character", -el.value.length);
                offset = sel.text.length - length;
            }
            return {
                offset: offset,
                length: length
            };
        }
        function killEvent(event) {
            event.preventDefault();
            event.stopPropagation();
        }
        function killEventImmediately(event) {
            event.preventDefault();
            event.stopImmediatePropagation();
        }
        function measureTextWidth(e) {
            if (!sizer) {
                var style = e[0].currentStyle || window.getComputedStyle(e[0], null);
                sizer = $(document.createElement("div")).css({
                    position: "absolute",
                    left: "-10000px",
                    top: "-10000px",
                    display: "none",
                    fontSize: style.fontSize,
                    fontFamily: style.fontFamily,
                    fontStyle: style.fontStyle,
                    fontWeight: style.fontWeight,
                    letterSpacing: style.letterSpacing,
                    textTransform: style.textTransform,
                    whiteSpace: "nowrap"
                });
                sizer.attr("class", "select2-sizer");
                $("body").append(sizer);
            }
            sizer.text(e.val());
            return sizer.width();
        }
        function syncCssClasses(dest, src, adapter) {
            var classes, replacements = [], adapted;
            classes = dest.attr("class");
            if (classes) {
                classes = "" + classes;
                // for IE which returns object
                $(classes.split(" ")).each2(function() {
                    if (this.indexOf("select2-") === 0) {
                        replacements.push(this);
                    }
                });
            }
            classes = src.attr("class");
            if (classes) {
                classes = "" + classes;
                // for IE which returns object
                $(classes.split(" ")).each2(function() {
                    if (this.indexOf("select2-") !== 0) {
                        adapted = adapter(this);
                        if (adapted) {
                            replacements.push(adapted);
                        }
                    }
                });
            }
            dest.attr("class", replacements.join(" "));
        }
        function markMatch(text, term, markup, escapeMarkup) {
            var match = stripDiacritics(text.toUpperCase()).indexOf(stripDiacritics(term.toUpperCase())), tl = term.length;
            if (match < 0) {
                markup.push(escapeMarkup(text));
                return;
            }
            markup.push(escapeMarkup(text.substring(0, match)));
            markup.push("<span class='select2-match'>");
            markup.push(escapeMarkup(text.substring(match, match + tl)));
            markup.push("</span>");
            markup.push(escapeMarkup(text.substring(match + tl, text.length)));
        }
        function defaultEscapeMarkup(markup) {
            var replace_map = {
                "\\": "&#92;",
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;",
                "/": "&#47;"
            };
            return String(markup).replace(/[&<>"'\/\\]/g, function(match) {
                return replace_map[match];
            });
        }
        /**
         * Produces an ajax-based query function
         *
         * @param options object containing configuration parameters
         * @param options.params parameter map for the transport ajax call, can contain such options as cache, jsonpCallback, etc. see $.ajax
         * @param options.transport function that will be used to execute the ajax request. must be compatible with parameters supported by $.ajax
         * @param options.url url for the data
         * @param options.data a function(searchTerm, pageNumber, context) that should return an object containing query string parameters for the above url.
         * @param options.dataType request data type: ajax, jsonp, other datatypes supported by jQuery's $.ajax function or the transport function if specified
         * @param options.quietMillis (optional) milliseconds to wait before making the ajaxRequest, helps debounce the ajax function if invoked too often
         * @param options.results a function(remoteData, pageNumber, query) that converts data returned form the remote request to the format expected by Select2.
         *      The expected format is an object containing the following keys:
         *      results array of objects that will be used as choices
         *      more (optional) boolean indicating whether there are more results available
         *      Example: {results:[{id:1, text:'Red'},{id:2, text:'Blue'}], more:true}
         */
        function ajax(options) {
            var timeout, // current scheduled but not yet executed request
            handler = null, quietMillis = options.quietMillis || 100, ajaxUrl = options.url, self = this;
            return function(query) {
                window.clearTimeout(timeout);
                timeout = window.setTimeout(function() {
                    var data = options.data, // ajax data function
                    url = ajaxUrl, // ajax url string or function
                    transport = options.transport || $.fn.select2.ajaxDefaults.transport, // deprecated - to be removed in 4.0  - use params instead
                    deprecated = {
                        type: options.type || "GET",
                        // set type of request (GET or POST)
                        cache: options.cache || false,
                        jsonpCallback: options.jsonpCallback || undefined,
                        dataType: options.dataType || "json"
                    }, params = $.extend({}, $.fn.select2.ajaxDefaults.params, deprecated);
                    data = data ? data.call(self, query.term, query.page, query.context) : null;
                    url = typeof url === "function" ? url.call(self, query.term, query.page, query.context) : url;
                    if (handler && typeof handler.abort === "function") {
                        handler.abort();
                    }
                    if (options.params) {
                        if ($.isFunction(options.params)) {
                            $.extend(params, options.params.call(self));
                        } else {
                            $.extend(params, options.params);
                        }
                    }
                    $.extend(params, {
                        url: url,
                        dataType: options.dataType,
                        data: data,
                        success: function(data) {
                            // TODO - replace query.page with query so users have access to term, page, etc.
                            // added query as third paramter to keep backwards compatibility
                            var results = options.results(data, query.page, query);
                            query.callback(results);
                        }
                    });
                    handler = transport.call(self, params);
                }, quietMillis);
            };
        }
        /**
         * Produces a query function that works with a local array
         *
         * @param options object containing configuration parameters. The options parameter can either be an array or an
         * object.
         *
         * If the array form is used it is assumed that it contains objects with 'id' and 'text' keys.
         *
         * If the object form is used it is assumed that it contains 'data' and 'text' keys. The 'data' key should contain
         * an array of objects that will be used as choices. These objects must contain at least an 'id' key. The 'text'
         * key can either be a String in which case it is expected that each element in the 'data' array has a key with the
         * value of 'text' which will be used to match choices. Alternatively, text can be a function(item) that can extract
         * the text.
         */
        function local(options) {
            var data = options, // data elements
            dataText, tmp, text = function(item) {
                return "" + item.text;
            };
            // function used to retrieve the text portion of a data item that is matched against the search
            if ($.isArray(data)) {
                tmp = data;
                data = {
                    results: tmp
                };
            }
            if ($.isFunction(data) === false) {
                tmp = data;
                data = function() {
                    return tmp;
                };
            }
            var dataItem = data();
            if (dataItem.text) {
                text = dataItem.text;
                // if text is not a function we assume it to be a key name
                if (!$.isFunction(text)) {
                    dataText = dataItem.text;
                    // we need to store this in a separate variable because in the next step data gets reset and data.text is no longer available
                    text = function(item) {
                        return item[dataText];
                    };
                }
            }
            return function(query) {
                var t = query.term, filtered = {
                    results: []
                }, process;
                if (t === "") {
                    query.callback(data());
                    return;
                }
                process = function(datum, collection) {
                    var group, attr;
                    datum = datum[0];
                    if (datum.children) {
                        group = {};
                        for (attr in datum) {
                            if (datum.hasOwnProperty(attr)) group[attr] = datum[attr];
                        }
                        group.children = [];
                        $(datum.children).each2(function(i, childDatum) {
                            process(childDatum, group.children);
                        });
                        if (group.children.length || query.matcher(t, text(group), datum)) {
                            collection.push(group);
                        }
                    } else {
                        if (query.matcher(t, text(datum), datum)) {
                            collection.push(datum);
                        }
                    }
                };
                $(data().results).each2(function(i, datum) {
                    process(datum, filtered.results);
                });
                query.callback(filtered);
            };
        }
        // TODO javadoc
        function tags(data) {
            var isFunc = $.isFunction(data);
            return function(query) {
                var t = query.term, filtered = {
                    results: []
                };
                var result = isFunc ? data(query) : data;
                if ($.isArray(result)) {
                    $(result).each(function() {
                        var isObject = this.text !== undefined, text = isObject ? this.text : this;
                        if (t === "" || query.matcher(t, text)) {
                            filtered.results.push(isObject ? this : {
                                id: this,
                                text: this
                            });
                        }
                    });
                    query.callback(filtered);
                }
            };
        }
        /**
         * Checks if the formatter function should be used.
         *
         * Throws an error if it is not a function. Returns true if it should be used,
         * false if no formatting should be performed.
         *
         * @param formatter
         */
        function checkFormatter(formatter, formatterName) {
            if ($.isFunction(formatter)) return true;
            if (!formatter) return false;
            if (typeof formatter === "string") return true;
            throw new Error(formatterName + " must be a string, function, or falsy value");
        }
        /**
       * Returns a given value
       * If given a function, returns its output
       *
       * @param val string|function
       * @param context value of "this" to be passed to function
       * @returns {*}
       */
        function evaluate(val, context) {
            if ($.isFunction(val)) {
                var args = Array.prototype.slice.call(arguments, 2);
                return val.apply(context, args);
            }
            return val;
        }
        function countResults(results) {
            var count = 0;
            $.each(results, function(i, item) {
                if (item.children) {
                    count += countResults(item.children);
                } else {
                    count++;
                }
            });
            return count;
        }
        /**
         * Default tokenizer. This function uses breaks the input on substring match of any string from the
         * opts.tokenSeparators array and uses opts.createSearchChoice to create the choice object. Both of those
         * two options have to be defined in order for the tokenizer to work.
         *
         * @param input text user has typed so far or pasted into the search field
         * @param selection currently selected choices
         * @param selectCallback function(choice) callback tho add the choice to selection
         * @param opts select2's opts
         * @return undefined/null to leave the current input unchanged, or a string to change the input to the returned value
         */
        function defaultTokenizer(input, selection, selectCallback, opts) {
            var original = input, // store the original so we can compare and know if we need to tell the search to update its text
            dupe = false, // check for whether a token we extracted represents a duplicate selected choice
            token, // token
            index, // position at which the separator was found
            i, l, // looping variables
            separator;
            // the matched separator
            if (!opts.createSearchChoice || !opts.tokenSeparators || opts.tokenSeparators.length < 1) return undefined;
            while (true) {
                index = -1;
                for (i = 0, l = opts.tokenSeparators.length; i < l; i++) {
                    separator = opts.tokenSeparators[i];
                    index = input.indexOf(separator);
                    if (index >= 0) break;
                }
                if (index < 0) break;
                // did not find any token separator in the input string, bail
                token = input.substring(0, index);
                input = input.substring(index + separator.length);
                if (token.length > 0) {
                    token = opts.createSearchChoice.call(this, token, selection);
                    if (token !== undefined && token !== null && opts.id(token) !== undefined && opts.id(token) !== null) {
                        dupe = false;
                        for (i = 0, l = selection.length; i < l; i++) {
                            if (equal(opts.id(token), opts.id(selection[i]))) {
                                dupe = true;
                                break;
                            }
                        }
                        if (!dupe) selectCallback(token);
                    }
                }
            }
            if (original !== input) return input;
        }
        function cleanupJQueryElements() {
            var self = this;
            $.each(arguments, function(i, element) {
                self[element].remove();
                self[element] = null;
            });
        }
        /**
         * Creates a new class
         *
         * @param superClass
         * @param methods
         */
        function clazz(SuperClass, methods) {
            var constructor = function() {};
            constructor.prototype = new SuperClass();
            constructor.prototype.constructor = constructor;
            constructor.prototype.parent = SuperClass.prototype;
            constructor.prototype = $.extend(constructor.prototype, methods);
            return constructor;
        }
        AbstractSelect2 = clazz(Object, {
            // abstract
            bind: function(func) {
                var self = this;
                return function() {
                    func.apply(self, arguments);
                };
            },
            // abstract
            init: function(opts) {
                var results, search, resultsSelector = ".select2-results";
                // prepare options
                this.opts = opts = this.prepareOpts(opts);
                this.id = opts.id;
                // destroy if called on an existing component
                if (opts.element.data("select2") !== undefined && opts.element.data("select2") !== null) {
                    opts.element.data("select2").destroy();
                }
                this.container = this.createContainer();
                this.liveRegion = $("<span>", {
                    role: "status",
                    "aria-live": "polite"
                }).addClass("select2-hidden-accessible").appendTo(document.body);
                this.containerId = "s2id_" + (opts.element.attr("id") || "autogen" + nextUid());
                this.containerEventName = this.containerId.replace(/([.])/g, "_").replace(/([;&,\-\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g, "\\$1");
                this.container.attr("id", this.containerId);
                this.container.attr("title", opts.element.attr("title"));
                this.body = $("body");
                syncCssClasses(this.container, this.opts.element, this.opts.adaptContainerCssClass);
                this.container.attr("style", opts.element.attr("style"));
                this.container.css(evaluate(opts.containerCss, this.opts.element));
                this.container.addClass(evaluate(opts.containerCssClass, this.opts.element));
                this.elementTabIndex = this.opts.element.attr("tabindex");
                // swap container for the element
                this.opts.element.data("select2", this).attr("tabindex", "-1").before(this.container).on("click.select2", killEvent);
                // do not leak click events
                this.container.data("select2", this);
                this.dropdown = this.container.find(".select2-drop");
                syncCssClasses(this.dropdown, this.opts.element, this.opts.adaptDropdownCssClass);
                this.dropdown.addClass(evaluate(opts.dropdownCssClass, this.opts.element));
                this.dropdown.data("select2", this);
                this.dropdown.on("click", killEvent);
                this.results = results = this.container.find(resultsSelector);
                this.search = search = this.container.find("input.select2-input");
                this.queryCount = 0;
                this.resultsPage = 0;
                this.context = null;
                // initialize the container
                this.initContainer();
                this.container.on("click", killEvent);
                installFilteredMouseMove(this.results);
                this.dropdown.on("mousemove-filtered", resultsSelector, this.bind(this.highlightUnderEvent));
                this.dropdown.on("touchstart touchmove touchend", resultsSelector, this.bind(function(event) {
                    this._touchEvent = true;
                    this.highlightUnderEvent(event);
                }));
                this.dropdown.on("touchmove", resultsSelector, this.bind(this.touchMoved));
                this.dropdown.on("touchstart touchend", resultsSelector, this.bind(this.clearTouchMoved));
                // Waiting for a click event on touch devices to select option and hide dropdown
                // otherwise click will be triggered on an underlying element
                this.dropdown.on("click", this.bind(function(event) {
                    if (this._touchEvent) {
                        this._touchEvent = false;
                        this.selectHighlighted();
                    }
                }));
                installDebouncedScroll(80, this.results);
                this.dropdown.on("scroll-debounced", resultsSelector, this.bind(this.loadMoreIfNeeded));
                // do not propagate change event from the search field out of the component
                $(this.container).on("change", ".select2-input", function(e) {
                    e.stopPropagation();
                });
                $(this.dropdown).on("change", ".select2-input", function(e) {
                    e.stopPropagation();
                });
                // if jquery.mousewheel plugin is installed we can prevent out-of-bounds scrolling of results via mousewheel
                if ($.fn.mousewheel) {
                    results.mousewheel(function(e, delta, deltaX, deltaY) {
                        var top = results.scrollTop();
                        if (deltaY > 0 && top - deltaY <= 0) {
                            results.scrollTop(0);
                            killEvent(e);
                        } else if (deltaY < 0 && results.get(0).scrollHeight - results.scrollTop() + deltaY <= results.height()) {
                            results.scrollTop(results.get(0).scrollHeight - results.height());
                            killEvent(e);
                        }
                    });
                }
                installKeyUpChangeEvent(search);
                search.on("keyup-change input paste", this.bind(this.updateResults));
                search.on("focus", function() {
                    search.addClass("select2-focused");
                });
                search.on("blur", function() {
                    search.removeClass("select2-focused");
                });
                this.dropdown.on("mouseup", resultsSelector, this.bind(function(e) {
                    if ($(e.target).closest(".select2-result-selectable").length > 0) {
                        this.highlightUnderEvent(e);
                        this.selectHighlighted(e);
                    }
                }));
                // trap all mouse events from leaving the dropdown. sometimes there may be a modal that is listening
                // for mouse events outside of itself so it can close itself. since the dropdown is now outside the select2's
                // dom it will trigger the popup close, which is not what we want
                // focusin can cause focus wars between modals and select2 since the dropdown is outside the modal.
                this.dropdown.on("click mouseup mousedown touchstart touchend focusin", function(e) {
                    e.stopPropagation();
                });
                this.nextSearchTerm = undefined;
                if ($.isFunction(this.opts.initSelection)) {
                    // initialize selection based on the current value of the source element
                    this.initSelection();
                    // if the user has provided a function that can set selection based on the value of the source element
                    // we monitor the change event on the element and trigger it, allowing for two way synchronization
                    this.monitorSource();
                }
                if (opts.maximumInputLength !== null) {
                    this.search.attr("maxlength", opts.maximumInputLength);
                }
                var disabled = opts.element.prop("disabled");
                if (disabled === undefined) disabled = false;
                this.enable(!disabled);
                var readonly = opts.element.prop("readonly");
                if (readonly === undefined) readonly = false;
                this.readonly(readonly);
                // Calculate size of scrollbar
                scrollBarDimensions = scrollBarDimensions || measureScrollbar();
                this.autofocus = opts.element.prop("autofocus");
                opts.element.prop("autofocus", false);
                if (this.autofocus) this.focus();
                this.search.attr("placeholder", opts.searchInputPlaceholder);
            },
            // abstract
            destroy: function() {
                var element = this.opts.element, select2 = element.data("select2");
                this.close();
                if (element.length && element[0].detachEvent) {
                    element.each(function() {
                        this.detachEvent("onpropertychange", this._sync);
                    });
                }
                if (this.propertyObserver) {
                    this.propertyObserver.disconnect();
                    this.propertyObserver = null;
                }
                this._sync = null;
                if (select2 !== undefined) {
                    select2.container.remove();
                    select2.liveRegion.remove();
                    select2.dropdown.remove();
                    element.removeClass("select2-offscreen").removeData("select2").off(".select2").prop("autofocus", this.autofocus || false);
                    if (this.elementTabIndex) {
                        element.attr({
                            tabindex: this.elementTabIndex
                        });
                    } else {
                        element.removeAttr("tabindex");
                    }
                    element.show();
                }
                cleanupJQueryElements.call(this, "container", "liveRegion", "dropdown", "results", "search");
            },
            // abstract
            optionToData: function(element) {
                if (element.is("option")) {
                    return {
                        id: element.prop("value"),
                        text: element.text(),
                        element: element.get(),
                        css: element.attr("class"),
                        disabled: element.prop("disabled"),
                        locked: equal(element.attr("locked"), "locked") || equal(element.data("locked"), true)
                    };
                } else if (element.is("optgroup")) {
                    return {
                        text: element.attr("label"),
                        children: [],
                        element: element.get(),
                        css: element.attr("class")
                    };
                }
            },
            // abstract
            prepareOpts: function(opts) {
                var element, select, idKey, ajaxUrl, self = this;
                element = opts.element;
                if (element.get(0).tagName.toLowerCase() === "select") {
                    this.select = select = opts.element;
                }
                if (select) {
                    // these options are not allowed when attached to a select because they are picked up off the element itself
                    $.each([ "id", "multiple", "ajax", "query", "createSearchChoice", "initSelection", "data", "tags" ], function() {
                        if (this in opts) {
                            throw new Error("Option '" + this + "' is not allowed for Select2 when attached to a <select> element.");
                        }
                    });
                }
                opts = $.extend({}, {
                    populateResults: function(container, results, query) {
                        var populate, id = this.opts.id, liveRegion = this.liveRegion;
                        populate = function(results, container, depth) {
                            var i, l, result, selectable, disabled, compound, node, label, innerContainer, formatted;
                            results = opts.sortResults(results, container, query);
                            // collect the created nodes for bulk append
                            var nodes = [];
                            for (i = 0, l = results.length; i < l; i = i + 1) {
                                result = results[i];
                                disabled = result.disabled === true;
                                selectable = !disabled && id(result) !== undefined;
                                compound = result.children && result.children.length > 0;
                                node = $("<li></li>");
                                node.addClass("select2-results-dept-" + depth);
                                node.addClass("select2-result");
                                node.addClass(selectable ? "select2-result-selectable" : "select2-result-unselectable");
                                if (disabled) {
                                    node.addClass("select2-disabled");
                                }
                                if (compound) {
                                    node.addClass("select2-result-with-children");
                                }
                                node.addClass(self.opts.formatResultCssClass(result));
                                node.attr("role", "presentation");
                                label = $(document.createElement("div"));
                                label.addClass("select2-result-label");
                                label.attr("id", "select2-result-label-" + nextUid());
                                label.attr("role", "option");
                                formatted = opts.formatResult(result, label, query, self.opts.escapeMarkup);
                                if (formatted !== undefined) {
                                    label.html(formatted);
                                    node.append(label);
                                }
                                if (compound) {
                                    innerContainer = $("<ul></ul>");
                                    innerContainer.addClass("select2-result-sub");
                                    populate(result.children, innerContainer, depth + 1);
                                    node.append(innerContainer);
                                }
                                node.data("select2-data", result);
                                nodes.push(node[0]);
                            }
                            // bulk append the created nodes
                            container.append(nodes);
                            liveRegion.text(opts.formatMatches(results.length));
                        };
                        populate(results, container, 0);
                    }
                }, $.fn.select2.defaults, opts);
                if (typeof opts.id !== "function") {
                    idKey = opts.id;
                    opts.id = function(e) {
                        return e[idKey];
                    };
                }
                if ($.isArray(opts.element.data("select2Tags"))) {
                    if ("tags" in opts) {
                        throw "tags specified as both an attribute 'data-select2-tags' and in options of Select2 " + opts.element.attr("id");
                    }
                    opts.tags = opts.element.data("select2Tags");
                }
                if (select) {
                    opts.query = this.bind(function(query) {
                        var data = {
                            results: [],
                            more: false
                        }, term = query.term, children, placeholderOption, process;
                        process = function(element, collection) {
                            var group;
                            if (element.is("option")) {
                                if (query.matcher(term, element.text(), element)) {
                                    collection.push(self.optionToData(element));
                                }
                            } else if (element.is("optgroup")) {
                                group = self.optionToData(element);
                                element.children().each2(function(i, elm) {
                                    process(elm, group.children);
                                });
                                if (group.children.length > 0) {
                                    collection.push(group);
                                }
                            }
                        };
                        children = element.children();
                        // ignore the placeholder option if there is one
                        if (this.getPlaceholder() !== undefined && children.length > 0) {
                            placeholderOption = this.getPlaceholderOption();
                            if (placeholderOption) {
                                children = children.not(placeholderOption);
                            }
                        }
                        children.each2(function(i, elm) {
                            process(elm, data.results);
                        });
                        query.callback(data);
                    });
                    // this is needed because inside val() we construct choices from options and there id is hardcoded
                    opts.id = function(e) {
                        return e.id;
                    };
                } else {
                    if (!("query" in opts)) {
                        if ("ajax" in opts) {
                            ajaxUrl = opts.element.data("ajax-url");
                            if (ajaxUrl && ajaxUrl.length > 0) {
                                opts.ajax.url = ajaxUrl;
                            }
                            opts.query = ajax.call(opts.element, opts.ajax);
                        } else if ("data" in opts) {
                            opts.query = local(opts.data);
                        } else if ("tags" in opts) {
                            opts.query = tags(opts.tags);
                            if (opts.createSearchChoice === undefined) {
                                opts.createSearchChoice = function(term) {
                                    return {
                                        id: $.trim(term),
                                        text: $.trim(term)
                                    };
                                };
                            }
                            if (opts.initSelection === undefined) {
                                opts.initSelection = function(element, callback) {
                                    var data = [];
                                    $(splitVal(element.val(), opts.separator)).each(function() {
                                        var obj = {
                                            id: this,
                                            text: this
                                        }, tags = opts.tags;
                                        if ($.isFunction(tags)) tags = tags();
                                        $(tags).each(function() {
                                            if (equal(this.id, obj.id)) {
                                                obj = this;
                                                return false;
                                            }
                                        });
                                        data.push(obj);
                                    });
                                    callback(data);
                                };
                            }
                        }
                    }
                }
                if (typeof opts.query !== "function") {
                    throw "query function not defined for Select2 " + opts.element.attr("id");
                }
                if (opts.createSearchChoicePosition === "top") {
                    opts.createSearchChoicePosition = function(list, item) {
                        list.unshift(item);
                    };
                } else if (opts.createSearchChoicePosition === "bottom") {
                    opts.createSearchChoicePosition = function(list, item) {
                        list.push(item);
                    };
                } else if (typeof opts.createSearchChoicePosition !== "function") {
                    throw "invalid createSearchChoicePosition option must be 'top', 'bottom' or a custom function";
                }
                return opts;
            },
            /**
             * Monitor the original element for changes and update select2 accordingly
             */
            // abstract
            monitorSource: function() {
                var el = this.opts.element, observer, self = this;
                el.on("change.select2", this.bind(function(e) {
                    if (this.opts.element.data("select2-change-triggered") !== true) {
                        this.initSelection();
                    }
                }));
                this._sync = this.bind(function() {
                    // sync enabled state
                    var disabled = el.prop("disabled");
                    if (disabled === undefined) disabled = false;
                    this.enable(!disabled);
                    var readonly = el.prop("readonly");
                    if (readonly === undefined) readonly = false;
                    this.readonly(readonly);
                    syncCssClasses(this.container, this.opts.element, this.opts.adaptContainerCssClass);
                    this.container.addClass(evaluate(this.opts.containerCssClass, this.opts.element));
                    syncCssClasses(this.dropdown, this.opts.element, this.opts.adaptDropdownCssClass);
                    this.dropdown.addClass(evaluate(this.opts.dropdownCssClass, this.opts.element));
                });
                // IE8-10 (IE9/10 won't fire propertyChange via attachEventListener)
                if (el.length && el[0].attachEvent) {
                    el.each(function() {
                        this.attachEvent("onpropertychange", self._sync);
                    });
                }
                // safari, chrome, firefox, IE11
                observer = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
                if (observer !== undefined) {
                    if (this.propertyObserver) {
                        delete this.propertyObserver;
                        this.propertyObserver = null;
                    }
                    this.propertyObserver = new observer(function(mutations) {
                        $.each(mutations, self._sync);
                    });
                    this.propertyObserver.observe(el.get(0), {
                        attributes: true,
                        subtree: false
                    });
                }
            },
            // abstract
            triggerSelect: function(data) {
                var evt = $.Event("select2-selecting", {
                    val: this.id(data),
                    object: data
                });
                this.opts.element.trigger(evt);
                return !evt.isDefaultPrevented();
            },
            /**
             * Triggers the change event on the source element
             */
            // abstract
            triggerChange: function(details) {
                details = details || {};
                details = $.extend({}, details, {
                    type: "change",
                    val: this.val()
                });
                // prevents recursive triggering
                this.opts.element.data("select2-change-triggered", true);
                this.opts.element.trigger(details);
                this.opts.element.data("select2-change-triggered", false);
                // some validation frameworks ignore the change event and listen instead to keyup, click for selects
                // so here we trigger the click event manually
                this.opts.element.click();
                // ValidationEngine ignores the change event and listens instead to blur
                // so here we trigger the blur event manually if so desired
                if (this.opts.blurOnChange) this.opts.element.blur();
            },
            //abstract
            isInterfaceEnabled: function() {
                return this.enabledInterface === true;
            },
            // abstract
            enableInterface: function() {
                var enabled = this._enabled && !this._readonly, disabled = !enabled;
                if (enabled === this.enabledInterface) return false;
                this.container.toggleClass("select2-container-disabled", disabled);
                this.close();
                this.enabledInterface = enabled;
                return true;
            },
            // abstract
            enable: function(enabled) {
                if (enabled === undefined) enabled = true;
                if (this._enabled === enabled) return;
                this._enabled = enabled;
                this.opts.element.prop("disabled", !enabled);
                this.enableInterface();
            },
            // abstract
            disable: function() {
                this.enable(false);
            },
            // abstract
            readonly: function(enabled) {
                if (enabled === undefined) enabled = false;
                if (this._readonly === enabled) return;
                this._readonly = enabled;
                this.opts.element.prop("readonly", enabled);
                this.enableInterface();
            },
            // abstract
            opened: function() {
                return this.container ? this.container.hasClass("select2-dropdown-open") : false;
            },
            // abstract
            positionDropdown: function() {
                var $dropdown = this.dropdown, offset = this.container.offset(), height = this.container.outerHeight(false), width = this.container.outerWidth(false), dropHeight = $dropdown.outerHeight(false), $window = $(window), windowWidth = $window.width(), windowHeight = $window.height(), viewPortRight = $window.scrollLeft() + windowWidth, viewportBottom = $window.scrollTop() + windowHeight, dropTop = offset.top + height, dropLeft = offset.left, enoughRoomBelow = dropTop + dropHeight <= viewportBottom, enoughRoomAbove = offset.top - dropHeight >= $window.scrollTop(), dropWidth = $dropdown.outerWidth(false), enoughRoomOnRight = dropLeft + dropWidth <= viewPortRight, aboveNow = $dropdown.hasClass("select2-drop-above"), bodyOffset, above, changeDirection, css, resultsListNode;
                // always prefer the current above/below alignment, unless there is not enough room
                if (aboveNow) {
                    above = true;
                    if (!enoughRoomAbove && enoughRoomBelow) {
                        changeDirection = true;
                        above = false;
                    }
                } else {
                    above = false;
                    if (!enoughRoomBelow && enoughRoomAbove) {
                        changeDirection = true;
                        above = true;
                    }
                }
                //if we are changing direction we need to get positions when dropdown is hidden;
                if (changeDirection) {
                    $dropdown.hide();
                    offset = this.container.offset();
                    height = this.container.outerHeight(false);
                    width = this.container.outerWidth(false);
                    dropHeight = $dropdown.outerHeight(false);
                    viewPortRight = $window.scrollLeft() + windowWidth;
                    viewportBottom = $window.scrollTop() + windowHeight;
                    dropTop = offset.top + height;
                    dropLeft = offset.left;
                    dropWidth = $dropdown.outerWidth(false);
                    enoughRoomOnRight = dropLeft + dropWidth <= viewPortRight;
                    $dropdown.show();
                    // fix so the cursor does not move to the left within the search-textbox in IE
                    this.focusSearch();
                }
                if (this.opts.dropdownAutoWidth) {
                    resultsListNode = $(".select2-results", $dropdown)[0];
                    $dropdown.addClass("select2-drop-auto-width");
                    $dropdown.css("width", "");
                    // Add scrollbar width to dropdown if vertical scrollbar is present
                    dropWidth = $dropdown.outerWidth(false) + (resultsListNode.scrollHeight === resultsListNode.clientHeight ? 0 : scrollBarDimensions.width);
                    dropWidth > width ? width = dropWidth : dropWidth = width;
                    dropHeight = $dropdown.outerHeight(false);
                    enoughRoomOnRight = dropLeft + dropWidth <= viewPortRight;
                } else {
                    this.container.removeClass("select2-drop-auto-width");
                }
                //console.log("below/ droptop:", dropTop, "dropHeight", dropHeight, "sum", (dropTop+dropHeight)+" viewport bottom", viewportBottom, "enough?", enoughRoomBelow);
                //console.log("above/ offset.top", offset.top, "dropHeight", dropHeight, "top", (offset.top-dropHeight), "scrollTop", this.body.scrollTop(), "enough?", enoughRoomAbove);
                // fix positioning when body has an offset and is not position: static
                if (this.body.css("position") !== "static") {
                    bodyOffset = this.body.offset();
                    dropTop -= bodyOffset.top;
                    dropLeft -= bodyOffset.left;
                }
                if (!enoughRoomOnRight) {
                    dropLeft = offset.left + this.container.outerWidth(false) - dropWidth;
                }
                css = {
                    left: dropLeft,
                    width: width
                };
                if (above) {
                    css.top = offset.top - dropHeight;
                    css.bottom = "auto";
                    this.container.addClass("select2-drop-above");
                    $dropdown.addClass("select2-drop-above");
                } else {
                    css.top = dropTop;
                    css.bottom = "auto";
                    this.container.removeClass("select2-drop-above");
                    $dropdown.removeClass("select2-drop-above");
                }
                css = $.extend(css, evaluate(this.opts.dropdownCss, this.opts.element));
                $dropdown.css(css);
            },
            // abstract
            shouldOpen: function() {
                var event;
                if (this.opened()) return false;
                if (this._enabled === false || this._readonly === true) return false;
                event = $.Event("select2-opening");
                this.opts.element.trigger(event);
                return !event.isDefaultPrevented();
            },
            // abstract
            clearDropdownAlignmentPreference: function() {
                // clear the classes used to figure out the preference of where the dropdown should be opened
                this.container.removeClass("select2-drop-above");
                this.dropdown.removeClass("select2-drop-above");
            },
            /**
             * Opens the dropdown
             *
             * @return {Boolean} whether or not dropdown was opened. This method will return false if, for example,
             * the dropdown is already open, or if the 'open' event listener on the element called preventDefault().
             */
            // abstract
            open: function() {
                if (!this.shouldOpen()) return false;
                this.opening();
                // Only bind the document mousemove when the dropdown is visible
                $document.on("mousemove.select2Event", function(e) {
                    lastMousePosition.x = e.pageX;
                    lastMousePosition.y = e.pageY;
                });
                return true;
            },
            /**
             * Performs the opening of the dropdown
             */
            // abstract
            opening: function() {
                var cid = this.containerEventName, scroll = "scroll." + cid, resize = "resize." + cid, orient = "orientationchange." + cid, mask;
                this.container.addClass("select2-dropdown-open").addClass("select2-container-active");
                this.clearDropdownAlignmentPreference();
                if (this.dropdown[0] !== this.body.children().last()[0]) {
                    this.dropdown.detach().appendTo(this.body);
                }
                // create the dropdown mask if doesn't already exist
                mask = $("#select2-drop-mask");
                if (mask.length == 0) {
                    mask = $(document.createElement("div"));
                    mask.attr("id", "select2-drop-mask").attr("class", "select2-drop-mask");
                    mask.hide();
                    mask.appendTo(this.body);
                    mask.on("mousedown touchstart click", function(e) {
                        // Prevent IE from generating a click event on the body
                        reinsertElement(mask);
                        var dropdown = $("#select2-drop"), self;
                        if (dropdown.length > 0) {
                            self = dropdown.data("select2");
                            if (self.opts.selectOnBlur) {
                                self.selectHighlighted({
                                    noFocus: true
                                });
                            }
                            self.close();
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    });
                }
                // ensure the mask is always right before the dropdown
                if (this.dropdown.prev()[0] !== mask[0]) {
                    this.dropdown.before(mask);
                }
                // move the global id to the correct dropdown
                $("#select2-drop").removeAttr("id");
                this.dropdown.attr("id", "select2-drop");
                // show the elements
                mask.show();
                this.positionDropdown();
                this.dropdown.show();
                this.positionDropdown();
                this.dropdown.addClass("select2-drop-active");
                // attach listeners to events that can change the position of the container and thus require
                // the position of the dropdown to be updated as well so it does not come unglued from the container
                var that = this;
                this.container.parents().add(window).each(function() {
                    $(this).on(resize + " " + scroll + " " + orient, function(e) {
                        if (that.opened()) that.positionDropdown();
                    });
                });
            },
            // abstract
            close: function() {
                if (!this.opened()) return;
                var cid = this.containerEventName, scroll = "scroll." + cid, resize = "resize." + cid, orient = "orientationchange." + cid;
                // unbind event listeners
                this.container.parents().add(window).each(function() {
                    $(this).off(scroll).off(resize).off(orient);
                });
                this.clearDropdownAlignmentPreference();
                $("#select2-drop-mask").hide();
                this.dropdown.removeAttr("id");
                // only the active dropdown has the select2-drop id
                this.dropdown.hide();
                this.container.removeClass("select2-dropdown-open").removeClass("select2-container-active");
                this.results.empty();
                // Now that the dropdown is closed, unbind the global document mousemove event
                $document.off("mousemove.select2Event");
                this.clearSearch();
                this.search.removeClass("select2-active");
                this.opts.element.trigger($.Event("select2-close"));
            },
            /**
             * Opens control, sets input value, and updates results.
             */
            // abstract
            externalSearch: function(term) {
                this.open();
                this.search.val(term);
                this.updateResults(false);
            },
            // abstract
            clearSearch: function() {},
            //abstract
            getMaximumSelectionSize: function() {
                return evaluate(this.opts.maximumSelectionSize, this.opts.element);
            },
            // abstract
            ensureHighlightVisible: function() {
                var results = this.results, children, index, child, hb, rb, y, more;
                index = this.highlight();
                if (index < 0) return;
                if (index == 0) {
                    // if the first element is highlighted scroll all the way to the top,
                    // that way any unselectable headers above it will also be scrolled
                    // into view
                    results.scrollTop(0);
                    return;
                }
                children = this.findHighlightableChoices().find(".select2-result-label");
                child = $(children[index]);
                hb = child.offset().top + child.outerHeight(true);
                // if this is the last child lets also make sure select2-more-results is visible
                if (index === children.length - 1) {
                    more = results.find("li.select2-more-results");
                    if (more.length > 0) {
                        hb = more.offset().top + more.outerHeight(true);
                    }
                }
                rb = results.offset().top + results.outerHeight(true);
                if (hb > rb) {
                    results.scrollTop(results.scrollTop() + (hb - rb));
                }
                y = child.offset().top - results.offset().top;
                // make sure the top of the element is visible
                if (y < 0 && child.css("display") != "none") {
                    results.scrollTop(results.scrollTop() + y);
                }
            },
            // abstract
            findHighlightableChoices: function() {
                return this.results.find(".select2-result-selectable:not(.select2-disabled):not(.select2-selected)");
            },
            // abstract
            moveHighlight: function(delta) {
                var choices = this.findHighlightableChoices(), index = this.highlight();
                while (index > -1 && index < choices.length) {
                    index += delta;
                    var choice = $(choices[index]);
                    if (choice.hasClass("select2-result-selectable") && !choice.hasClass("select2-disabled") && !choice.hasClass("select2-selected")) {
                        this.highlight(index);
                        break;
                    }
                }
            },
            // abstract
            highlight: function(index) {
                var choices = this.findHighlightableChoices(), choice, data;
                if (arguments.length === 0) {
                    return indexOf(choices.filter(".select2-highlighted")[0], choices.get());
                }
                if (index >= choices.length) index = choices.length - 1;
                if (index < 0) index = 0;
                this.removeHighlight();
                choice = $(choices[index]);
                choice.addClass("select2-highlighted");
                // ensure assistive technology can determine the active choice
                this.search.attr("aria-activedescendant", choice.find(".select2-result-label").attr("id"));
                this.ensureHighlightVisible();
                this.liveRegion.text(choice.text());
                data = choice.data("select2-data");
                if (data) {
                    this.opts.element.trigger({
                        type: "select2-highlight",
                        val: this.id(data),
                        choice: data
                    });
                }
            },
            removeHighlight: function() {
                this.results.find(".select2-highlighted").removeClass("select2-highlighted");
            },
            touchMoved: function() {
                this._touchMoved = true;
            },
            clearTouchMoved: function() {
                this._touchMoved = false;
            },
            // abstract
            countSelectableResults: function() {
                return this.findHighlightableChoices().length;
            },
            // abstract
            highlightUnderEvent: function(event) {
                var el = $(event.target).closest(".select2-result-selectable");
                if (el.length > 0 && !el.is(".select2-highlighted")) {
                    var choices = this.findHighlightableChoices();
                    this.highlight(choices.index(el));
                } else if (el.length == 0) {
                    // if we are over an unselectable item remove all highlights
                    this.removeHighlight();
                }
            },
            // abstract
            loadMoreIfNeeded: function() {
                var results = this.results, more = results.find("li.select2-more-results"), below, // pixels the element is below the scroll fold, below==0 is when the element is starting to be visible
                page = this.resultsPage + 1, self = this, term = this.search.val(), context = this.context;
                if (more.length === 0) return;
                below = more.offset().top - results.offset().top - results.height();
                if (below <= this.opts.loadMorePadding) {
                    more.addClass("select2-active");
                    this.opts.query({
                        element: this.opts.element,
                        term: term,
                        page: page,
                        context: context,
                        matcher: this.opts.matcher,
                        callback: this.bind(function(data) {
                            // ignore a response if the select2 has been closed before it was received
                            if (!self.opened()) return;
                            self.opts.populateResults.call(this, results, data.results, {
                                term: term,
                                page: page,
                                context: context
                            });
                            self.postprocessResults(data, false, false);
                            if (data.more === true) {
                                more.detach().appendTo(results).text(evaluate(self.opts.formatLoadMore, self.opts.element, page + 1));
                                window.setTimeout(function() {
                                    self.loadMoreIfNeeded();
                                }, 10);
                            } else {
                                more.remove();
                            }
                            self.positionDropdown();
                            self.resultsPage = page;
                            self.context = data.context;
                            this.opts.element.trigger({
                                type: "select2-loaded",
                                items: data
                            });
                        })
                    });
                }
            },
            /**
             * Default tokenizer function which does nothing
             */
            tokenize: function() {},
            /**
             * @param initial whether or not this is the call to this method right after the dropdown has been opened
             */
            // abstract
            updateResults: function(initial) {
                var search = this.search, results = this.results, opts = this.opts, data, self = this, input, term = search.val(), lastTerm = $.data(this.container, "select2-last-term"), // sequence number used to drop out-of-order responses
                queryNumber;
                // prevent duplicate queries against the same term
                if (initial !== true && lastTerm && equal(term, lastTerm)) return;
                $.data(this.container, "select2-last-term", term);
                // if the search is currently hidden we do not alter the results
                if (initial !== true && (this.showSearchInput === false || !this.opened())) {
                    return;
                }
                function postRender() {
                    search.removeClass("select2-active");
                    self.positionDropdown();
                    if (results.find(".select2-no-results,.select2-selection-limit,.select2-searching").length) {
                        self.liveRegion.text(results.text());
                    } else {
                        self.liveRegion.text(self.opts.formatMatches(results.find(".select2-result-selectable").length));
                    }
                }
                function render(html) {
                    results.html(html);
                    postRender();
                }
                queryNumber = ++this.queryCount;
                var maxSelSize = this.getMaximumSelectionSize();
                if (maxSelSize >= 1) {
                    data = this.data();
                    if ($.isArray(data) && data.length >= maxSelSize && checkFormatter(opts.formatSelectionTooBig, "formatSelectionTooBig")) {
                        render("<li class='select2-selection-limit'>" + evaluate(opts.formatSelectionTooBig, opts.element, maxSelSize) + "</li>");
                        return;
                    }
                }
                if (search.val().length < opts.minimumInputLength) {
                    if (checkFormatter(opts.formatInputTooShort, "formatInputTooShort")) {
                        render("<li class='select2-no-results'>" + evaluate(opts.formatInputTooShort, opts.element, search.val(), opts.minimumInputLength) + "</li>");
                    } else {
                        render("");
                    }
                    if (initial && this.showSearch) this.showSearch(true);
                    return;
                }
                if (opts.maximumInputLength && search.val().length > opts.maximumInputLength) {
                    if (checkFormatter(opts.formatInputTooLong, "formatInputTooLong")) {
                        render("<li class='select2-no-results'>" + evaluate(opts.formatInputTooLong, opts.element, search.val(), opts.maximumInputLength) + "</li>");
                    } else {
                        render("");
                    }
                    return;
                }
                if (opts.formatSearching && this.findHighlightableChoices().length === 0) {
                    render("<li class='select2-searching'>" + evaluate(opts.formatSearching, opts.element) + "</li>");
                }
                search.addClass("select2-active");
                this.removeHighlight();
                // give the tokenizer a chance to pre-process the input
                input = this.tokenize();
                if (input != undefined && input != null) {
                    search.val(input);
                }
                this.resultsPage = 1;
                opts.query({
                    element: opts.element,
                    term: search.val(),
                    page: this.resultsPage,
                    context: null,
                    matcher: opts.matcher,
                    callback: this.bind(function(data) {
                        var def;
                        // default choice
                        // ignore old responses
                        if (queryNumber != this.queryCount) {
                            return;
                        }
                        // ignore a response if the select2 has been closed before it was received
                        if (!this.opened()) {
                            this.search.removeClass("select2-active");
                            return;
                        }
                        // save context, if any
                        this.context = data.context === undefined ? null : data.context;
                        // create a default choice and prepend it to the list
                        if (this.opts.createSearchChoice && search.val() !== "") {
                            def = this.opts.createSearchChoice.call(self, search.val(), data.results);
                            if (def !== undefined && def !== null && self.id(def) !== undefined && self.id(def) !== null) {
                                if ($(data.results).filter(function() {
                                    return equal(self.id(this), self.id(def));
                                }).length === 0) {
                                    this.opts.createSearchChoicePosition(data.results, def);
                                }
                            }
                        }
                        if (data.results.length === 0 && checkFormatter(opts.formatNoMatches, "formatNoMatches")) {
                            render("<li class='select2-no-results'>" + evaluate(opts.formatNoMatches, opts.element, search.val()) + "</li>");
                            return;
                        }
                        results.empty();
                        self.opts.populateResults.call(this, results, data.results, {
                            term: search.val(),
                            page: this.resultsPage,
                            context: null
                        });
                        if (data.more === true && checkFormatter(opts.formatLoadMore, "formatLoadMore")) {
                            results.append("<li class='select2-more-results'>" + opts.escapeMarkup(evaluate(opts.formatLoadMore, opts.element, this.resultsPage)) + "</li>");
                            window.setTimeout(function() {
                                self.loadMoreIfNeeded();
                            }, 10);
                        }
                        this.postprocessResults(data, initial);
                        postRender();
                        this.opts.element.trigger({
                            type: "select2-loaded",
                            items: data
                        });
                    })
                });
            },
            // abstract
            cancel: function() {
                this.close();
            },
            // abstract
            blur: function() {
                // if selectOnBlur == true, select the currently highlighted option
                if (this.opts.selectOnBlur) this.selectHighlighted({
                    noFocus: true
                });
                this.close();
                this.container.removeClass("select2-container-active");
                // synonymous to .is(':focus'), which is available in jquery >= 1.6
                if (this.search[0] === document.activeElement) {
                    this.search.blur();
                }
                this.clearSearch();
                this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
            },
            // abstract
            focusSearch: function() {
                focus(this.search);
            },
            // abstract
            selectHighlighted: function(options) {
                if (this._touchMoved) {
                    this.clearTouchMoved();
                    return;
                }
                var index = this.highlight(), highlighted = this.results.find(".select2-highlighted"), data = highlighted.closest(".select2-result").data("select2-data");
                if (data) {
                    this.highlight(index);
                    this.onSelect(data, options);
                } else if (options && options.noFocus) {
                    this.close();
                }
            },
            // abstract
            getPlaceholder: function() {
                var placeholderOption;
                return this.opts.element.attr("placeholder") || this.opts.element.attr("data-placeholder") || // jquery 1.4 compat
                this.opts.element.data("placeholder") || this.opts.placeholder || ((placeholderOption = this.getPlaceholderOption()) !== undefined ? placeholderOption.text() : undefined);
            },
            // abstract
            getPlaceholderOption: function() {
                if (this.select) {
                    var firstOption = this.select.children("option").first();
                    if (this.opts.placeholderOption !== undefined) {
                        //Determine the placeholder option based on the specified placeholderOption setting
                        return this.opts.placeholderOption === "first" && firstOption || typeof this.opts.placeholderOption === "function" && this.opts.placeholderOption(this.select);
                    } else if ($.trim(firstOption.text()) === "" && firstOption.val() === "") {
                        //No explicit placeholder option specified, use the first if it's blank
                        return firstOption;
                    }
                }
            },
            /**
             * Get the desired width for the container element.  This is
             * derived first from option `width` passed to select2, then
             * the inline 'style' on the original element, and finally
             * falls back to the jQuery calculated element width.
             */
            // abstract
            initContainerWidth: function() {
                function resolveContainerWidth() {
                    var style, attrs, matches, i, l, attr;
                    if (this.opts.width === "off") {
                        return null;
                    } else if (this.opts.width === "element") {
                        return this.opts.element.outerWidth(false) === 0 ? "auto" : this.opts.element.outerWidth(false) + "px";
                    } else if (this.opts.width === "copy" || this.opts.width === "resolve") {
                        // check if there is inline style on the element that contains width
                        style = this.opts.element.attr("style");
                        if (style !== undefined) {
                            attrs = style.split(";");
                            for (i = 0, l = attrs.length; i < l; i = i + 1) {
                                attr = attrs[i].replace(/\s/g, "");
                                matches = attr.match(/^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i);
                                if (matches !== null && matches.length >= 1) return matches[1];
                            }
                        }
                        if (this.opts.width === "resolve") {
                            // next check if css('width') can resolve a width that is percent based, this is sometimes possible
                            // when attached to input type=hidden or elements hidden via css
                            style = this.opts.element.css("width");
                            if (style.indexOf("%") > 0) return style;
                            // finally, fallback on the calculated width of the element
                            return this.opts.element.outerWidth(false) === 0 ? "auto" : this.opts.element.outerWidth(false) + "px";
                        }
                        return null;
                    } else if ($.isFunction(this.opts.width)) {
                        return this.opts.width();
                    } else {
                        return this.opts.width;
                    }
                }
                var width = resolveContainerWidth.call(this);
                if (width !== null) {
                    this.container.css("width", width);
                }
            }
        });
        SingleSelect2 = clazz(AbstractSelect2, {
            // single
            createContainer: function() {
                var container = $(document.createElement("div")).attr({
                    "class": "select2-container"
                }).html([ "<a href='javascript:void(0)' class='select2-choice' tabindex='-1'>", "   <span class='select2-chosen'>&#160;</span><abbr class='select2-search-choice-close'></abbr>", "   <span class='select2-arrow' role='presentation'><b role='presentation'></b></span>", "</a>", "<label for='' class='select2-offscreen'></label>", "<input class='select2-focusser select2-offscreen' type='text' aria-haspopup='true' role='button' />", "<div class='select2-drop select2-display-none'>", "   <div class='select2-search'>", "       <label for='' class='select2-offscreen'></label>", "       <input type='text' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' class='select2-input' role='combobox' aria-expanded='true'", "       aria-autocomplete='list' />", "   </div>", "   <ul class='select2-results' role='listbox'>", "   </ul>", "</div>" ].join(""));
                return container;
            },
            // single
            enableInterface: function() {
                if (this.parent.enableInterface.apply(this, arguments)) {
                    this.focusser.prop("disabled", !this.isInterfaceEnabled());
                }
            },
            // single
            opening: function() {
                var el, range, len;
                if (this.opts.minimumResultsForSearch >= 0) {
                    this.showSearch(true);
                }
                this.parent.opening.apply(this, arguments);
                if (this.showSearchInput !== false) {
                    // IE appends focusser.val() at the end of field :/ so we manually insert it at the beginning using a range
                    // all other browsers handle this just fine
                    this.search.val(this.focusser.val());
                }
                if (this.opts.shouldFocusInput(this)) {
                    this.search.focus();
                    // move the cursor to the end after focussing, otherwise it will be at the beginning and
                    // new text will appear *before* focusser.val()
                    el = this.search.get(0);
                    if (el.createTextRange) {
                        range = el.createTextRange();
                        range.collapse(false);
                        range.select();
                    } else if (el.setSelectionRange) {
                        len = this.search.val().length;
                        el.setSelectionRange(len, len);
                    }
                }
                // initializes search's value with nextSearchTerm (if defined by user)
                // ignore nextSearchTerm if the dropdown is opened by the user pressing a letter
                if (this.search.val() === "") {
                    if (this.nextSearchTerm != undefined) {
                        this.search.val(this.nextSearchTerm);
                        this.search.select();
                    }
                }
                this.focusser.prop("disabled", true).val("");
                this.updateResults(true);
                this.opts.element.trigger($.Event("select2-open"));
            },
            // single
            close: function() {
                if (!this.opened()) return;
                this.parent.close.apply(this, arguments);
                this.focusser.prop("disabled", false);
                if (this.opts.shouldFocusInput(this)) {
                    this.focusser.focus();
                }
            },
            // single
            focus: function() {
                if (this.opened()) {
                    this.close();
                } else {
                    this.focusser.prop("disabled", false);
                    if (this.opts.shouldFocusInput(this)) {
                        this.focusser.focus();
                    }
                }
            },
            // single
            isFocused: function() {
                return this.container.hasClass("select2-container-active");
            },
            // single
            cancel: function() {
                this.parent.cancel.apply(this, arguments);
                this.focusser.prop("disabled", false);
                if (this.opts.shouldFocusInput(this)) {
                    this.focusser.focus();
                }
            },
            // single
            destroy: function() {
                $("label[for='" + this.focusser.attr("id") + "']").attr("for", this.opts.element.attr("id"));
                this.parent.destroy.apply(this, arguments);
                cleanupJQueryElements.call(this, "selection", "focusser");
            },
            // single
            initContainer: function() {
                var selection, container = this.container, dropdown = this.dropdown, idSuffix = nextUid(), elementLabel;
                if (this.opts.minimumResultsForSearch < 0) {
                    this.showSearch(false);
                } else {
                    this.showSearch(true);
                }
                this.selection = selection = container.find(".select2-choice");
                this.focusser = container.find(".select2-focusser");
                // add aria associations
                selection.find(".select2-chosen").attr("id", "select2-chosen-" + idSuffix);
                this.focusser.attr("aria-labelledby", "select2-chosen-" + idSuffix);
                this.results.attr("id", "select2-results-" + idSuffix);
                this.search.attr("aria-owns", "select2-results-" + idSuffix);
                // rewrite labels from original element to focusser
                this.focusser.attr("id", "s2id_autogen" + idSuffix);
                elementLabel = $("label[for='" + this.opts.element.attr("id") + "']");
                this.focusser.prev().text(elementLabel.text()).attr("for", this.focusser.attr("id"));
                // Ensure the original element retains an accessible name
                var originalTitle = this.opts.element.attr("title");
                this.opts.element.attr("title", originalTitle || elementLabel.text());
                this.focusser.attr("tabindex", this.elementTabIndex);
                // write label for search field using the label from the focusser element
                this.search.attr("id", this.focusser.attr("id") + "_search");
                this.search.prev().text($("label[for='" + this.focusser.attr("id") + "']").text()).attr("for", this.search.attr("id"));
                this.search.on("keydown", this.bind(function(e) {
                    if (!this.isInterfaceEnabled()) return;
                    if (e.which === KEY.PAGE_UP || e.which === KEY.PAGE_DOWN) {
                        // prevent the page from scrolling
                        killEvent(e);
                        return;
                    }
                    switch (e.which) {
                      case KEY.UP:
                      case KEY.DOWN:
                        this.moveHighlight(e.which === KEY.UP ? -1 : 1);
                        killEvent(e);
                        return;

                      case KEY.ENTER:
                        this.selectHighlighted();
                        killEvent(e);
                        return;

                      case KEY.TAB:
                        this.selectHighlighted({
                            noFocus: true
                        });
                        return;

                      case KEY.ESC:
                        this.cancel(e);
                        killEvent(e);
                        return;
                    }
                }));
                this.search.on("blur", this.bind(function(e) {
                    // a workaround for chrome to keep the search field focussed when the scroll bar is used to scroll the dropdown.
                    // without this the search field loses focus which is annoying
                    if (document.activeElement === this.body.get(0)) {
                        window.setTimeout(this.bind(function() {
                            if (this.opened()) {
                                this.search.focus();
                            }
                        }), 0);
                    }
                }));
                this.focusser.on("keydown", this.bind(function(e) {
                    if (!this.isInterfaceEnabled()) return;
                    if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.ESC) {
                        return;
                    }
                    if (this.opts.openOnEnter === false && e.which === KEY.ENTER) {
                        killEvent(e);
                        return;
                    }
                    if (e.which == KEY.DOWN || e.which == KEY.UP || e.which == KEY.ENTER && this.opts.openOnEnter) {
                        if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) return;
                        this.open();
                        killEvent(e);
                        return;
                    }
                    if (e.which == KEY.DELETE || e.which == KEY.BACKSPACE) {
                        if (this.opts.allowClear) {
                            this.clear();
                        }
                        killEvent(e);
                        return;
                    }
                }));
                installKeyUpChangeEvent(this.focusser);
                this.focusser.on("keyup-change input", this.bind(function(e) {
                    if (this.opts.minimumResultsForSearch >= 0) {
                        e.stopPropagation();
                        if (this.opened()) return;
                        this.open();
                    }
                }));
                selection.on("mousedown touchstart", "abbr", this.bind(function(e) {
                    if (!this.isInterfaceEnabled()) return;
                    this.clear();
                    killEventImmediately(e);
                    this.close();
                    this.selection.focus();
                }));
                selection.on("mousedown touchstart", this.bind(function(e) {
                    // Prevent IE from generating a click event on the body
                    reinsertElement(selection);
                    if (!this.container.hasClass("select2-container-active")) {
                        this.opts.element.trigger($.Event("select2-focus"));
                    }
                    if (this.opened()) {
                        this.close();
                    } else if (this.isInterfaceEnabled()) {
                        this.open();
                    }
                    killEvent(e);
                }));
                dropdown.on("mousedown touchstart", this.bind(function() {
                    if (this.opts.shouldFocusInput(this)) {
                        this.search.focus();
                    }
                }));
                selection.on("focus", this.bind(function(e) {
                    killEvent(e);
                }));
                this.focusser.on("focus", this.bind(function() {
                    if (!this.container.hasClass("select2-container-active")) {
                        this.opts.element.trigger($.Event("select2-focus"));
                    }
                    this.container.addClass("select2-container-active");
                })).on("blur", this.bind(function() {
                    if (!this.opened()) {
                        this.container.removeClass("select2-container-active");
                        this.opts.element.trigger($.Event("select2-blur"));
                    }
                }));
                this.search.on("focus", this.bind(function() {
                    if (!this.container.hasClass("select2-container-active")) {
                        this.opts.element.trigger($.Event("select2-focus"));
                    }
                    this.container.addClass("select2-container-active");
                }));
                this.initContainerWidth();
                this.opts.element.addClass("select2-offscreen");
                this.setPlaceholder();
            },
            // single
            clear: function(triggerChange) {
                var data = this.selection.data("select2-data");
                if (data) {
                    // guard against queued quick consecutive clicks
                    var evt = $.Event("select2-clearing");
                    this.opts.element.trigger(evt);
                    if (evt.isDefaultPrevented()) {
                        return;
                    }
                    var placeholderOption = this.getPlaceholderOption();
                    this.opts.element.val(placeholderOption ? placeholderOption.val() : "");
                    this.selection.find(".select2-chosen").empty();
                    this.selection.removeData("select2-data");
                    this.setPlaceholder();
                    if (triggerChange !== false) {
                        this.opts.element.trigger({
                            type: "select2-removed",
                            val: this.id(data),
                            choice: data
                        });
                        this.triggerChange({
                            removed: data
                        });
                    }
                }
            },
            /**
             * Sets selection based on source element's value
             */
            // single
            initSelection: function() {
                var selected;
                if (this.isPlaceholderOptionSelected()) {
                    this.updateSelection(null);
                    this.close();
                    this.setPlaceholder();
                } else {
                    var self = this;
                    this.opts.initSelection.call(null, this.opts.element, function(selected) {
                        if (selected !== undefined && selected !== null) {
                            self.updateSelection(selected);
                            self.close();
                            self.setPlaceholder();
                            self.nextSearchTerm = self.opts.nextSearchTerm(selected, self.search.val());
                        }
                    });
                }
            },
            isPlaceholderOptionSelected: function() {
                var placeholderOption;
                if (this.getPlaceholder() === undefined) return false;
                // no placeholder specified so no option should be considered
                return (placeholderOption = this.getPlaceholderOption()) !== undefined && placeholderOption.prop("selected") || this.opts.element.val() === "" || this.opts.element.val() === undefined || this.opts.element.val() === null;
            },
            // single
            prepareOpts: function() {
                var opts = this.parent.prepareOpts.apply(this, arguments), self = this;
                if (opts.element.get(0).tagName.toLowerCase() === "select") {
                    // install the selection initializer
                    opts.initSelection = function(element, callback) {
                        var selected = element.find("option").filter(function() {
                            return this.selected && !this.disabled;
                        });
                        // a single select box always has a value, no need to null check 'selected'
                        callback(self.optionToData(selected));
                    };
                } else if ("data" in opts) {
                    // install default initSelection when applied to hidden input and data is local
                    opts.initSelection = opts.initSelection || function(element, callback) {
                        var id = element.val();
                        //search in data by id, storing the actual matching item
                        var match = null;
                        opts.query({
                            matcher: function(term, text, el) {
                                var is_match = equal(id, opts.id(el));
                                if (is_match) {
                                    match = el;
                                }
                                return is_match;
                            },
                            callback: !$.isFunction(callback) ? $.noop : function() {
                                callback(match);
                            }
                        });
                    };
                }
                return opts;
            },
            // single
            getPlaceholder: function() {
                // if a placeholder is specified on a single select without a valid placeholder option ignore it
                if (this.select) {
                    if (this.getPlaceholderOption() === undefined) {
                        return undefined;
                    }
                }
                return this.parent.getPlaceholder.apply(this, arguments);
            },
            // single
            setPlaceholder: function() {
                var placeholder = this.getPlaceholder();
                if (this.isPlaceholderOptionSelected() && placeholder !== undefined) {
                    // check for a placeholder option if attached to a select
                    if (this.select && this.getPlaceholderOption() === undefined) return;
                    this.selection.find(".select2-chosen").html(this.opts.escapeMarkup(placeholder));
                    this.selection.addClass("select2-default");
                    this.container.removeClass("select2-allowclear");
                }
            },
            // single
            postprocessResults: function(data, initial, noHighlightUpdate) {
                var selected = 0, self = this, showSearchInput = true;
                // find the selected element in the result list
                this.findHighlightableChoices().each2(function(i, elm) {
                    if (equal(self.id(elm.data("select2-data")), self.opts.element.val())) {
                        selected = i;
                        return false;
                    }
                });
                // and highlight it
                if (noHighlightUpdate !== false) {
                    if (initial === true && selected >= 0) {
                        this.highlight(selected);
                    } else {
                        this.highlight(0);
                    }
                }
                // hide the search box if this is the first we got the results and there are enough of them for search
                if (initial === true) {
                    var min = this.opts.minimumResultsForSearch;
                    if (min >= 0) {
                        this.showSearch(countResults(data.results) >= min);
                    }
                }
            },
            // single
            showSearch: function(showSearchInput) {
                if (this.showSearchInput === showSearchInput) return;
                this.showSearchInput = showSearchInput;
                this.dropdown.find(".select2-search").toggleClass("select2-search-hidden", !showSearchInput);
                this.dropdown.find(".select2-search").toggleClass("select2-offscreen", !showSearchInput);
                //add "select2-with-searchbox" to the container if search box is shown
                $(this.dropdown, this.container).toggleClass("select2-with-searchbox", showSearchInput);
            },
            // single
            onSelect: function(data, options) {
                if (!this.triggerSelect(data)) {
                    return;
                }
                var old = this.opts.element.val(), oldData = this.data();
                this.opts.element.val(this.id(data));
                this.updateSelection(data);
                this.opts.element.trigger({
                    type: "select2-selected",
                    val: this.id(data),
                    choice: data
                });
                this.nextSearchTerm = this.opts.nextSearchTerm(data, this.search.val());
                this.close();
                if ((!options || !options.noFocus) && this.opts.shouldFocusInput(this)) {
                    this.focusser.focus();
                }
                if (!equal(old, this.id(data))) {
                    this.triggerChange({
                        added: data,
                        removed: oldData
                    });
                }
            },
            // single
            updateSelection: function(data) {
                var container = this.selection.find(".select2-chosen"), formatted, cssClass;
                this.selection.data("select2-data", data);
                container.empty();
                if (data !== null) {
                    formatted = this.opts.formatSelection(data, container, this.opts.escapeMarkup);
                }
                if (formatted !== undefined) {
                    container.append(formatted);
                }
                cssClass = this.opts.formatSelectionCssClass(data, container);
                if (cssClass !== undefined) {
                    container.addClass(cssClass);
                }
                this.selection.removeClass("select2-default");
                if (this.opts.allowClear && this.getPlaceholder() !== undefined) {
                    this.container.addClass("select2-allowclear");
                }
            },
            // single
            val: function() {
                var val, triggerChange = false, data = null, self = this, oldData = this.data();
                if (arguments.length === 0) {
                    return this.opts.element.val();
                }
                val = arguments[0];
                if (arguments.length > 1) {
                    triggerChange = arguments[1];
                }
                if (this.select) {
                    this.select.val(val).find("option").filter(function() {
                        return this.selected;
                    }).each2(function(i, elm) {
                        data = self.optionToData(elm);
                        return false;
                    });
                    this.updateSelection(data);
                    this.setPlaceholder();
                    if (triggerChange) {
                        this.triggerChange({
                            added: data,
                            removed: oldData
                        });
                    }
                } else {
                    // val is an id. !val is true for [undefined,null,'',0] - 0 is legal
                    if (!val && val !== 0) {
                        this.clear(triggerChange);
                        return;
                    }
                    if (this.opts.initSelection === undefined) {
                        throw new Error("cannot call val() if initSelection() is not defined");
                    }
                    this.opts.element.val(val);
                    this.opts.initSelection(this.opts.element, function(data) {
                        self.opts.element.val(!data ? "" : self.id(data));
                        self.updateSelection(data);
                        self.setPlaceholder();
                        if (triggerChange) {
                            self.triggerChange({
                                added: data,
                                removed: oldData
                            });
                        }
                    });
                }
            },
            // single
            clearSearch: function() {
                this.search.val("");
                this.focusser.val("");
            },
            // single
            data: function(value) {
                var data, triggerChange = false;
                if (arguments.length === 0) {
                    data = this.selection.data("select2-data");
                    if (data == undefined) data = null;
                    return data;
                } else {
                    if (arguments.length > 1) {
                        triggerChange = arguments[1];
                    }
                    if (!value) {
                        this.clear(triggerChange);
                    } else {
                        data = this.data();
                        this.opts.element.val(!value ? "" : this.id(value));
                        this.updateSelection(value);
                        if (triggerChange) {
                            this.triggerChange({
                                added: value,
                                removed: data
                            });
                        }
                    }
                }
            }
        });
        MultiSelect2 = clazz(AbstractSelect2, {
            // multi
            createContainer: function() {
                var container = $(document.createElement("div")).attr({
                    "class": "select2-container select2-container-multi"
                }).html([ "<ul class='select2-choices'>", "  <li class='select2-search-field'>", "    <label for='' class='select2-offscreen'></label>", "    <input type='text' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' class='select2-input'>", "  </li>", "</ul>", "<div class='select2-drop select2-drop-multi select2-display-none'>", "   <ul class='select2-results'>", "   </ul>", "</div>" ].join(""));
                return container;
            },
            // multi
            prepareOpts: function() {
                var opts = this.parent.prepareOpts.apply(this, arguments), self = this;
                // TODO validate placeholder is a string if specified
                if (opts.element.get(0).tagName.toLowerCase() === "select") {
                    // install the selection initializer
                    opts.initSelection = function(element, callback) {
                        var data = [];
                        element.find("option").filter(function() {
                            return this.selected && !this.disabled;
                        }).each2(function(i, elm) {
                            data.push(self.optionToData(elm));
                        });
                        callback(data);
                    };
                } else if ("data" in opts) {
                    // install default initSelection when applied to hidden input and data is local
                    opts.initSelection = opts.initSelection || function(element, callback) {
                        var ids = splitVal(element.val(), opts.separator);
                        //search in data by array of ids, storing matching items in a list
                        var matches = [];
                        opts.query({
                            matcher: function(term, text, el) {
                                var is_match = $.grep(ids, function(id) {
                                    return equal(id, opts.id(el));
                                }).length;
                                if (is_match) {
                                    matches.push(el);
                                }
                                return is_match;
                            },
                            callback: !$.isFunction(callback) ? $.noop : function() {
                                // reorder matches based on the order they appear in the ids array because right now
                                // they are in the order in which they appear in data array
                                var ordered = [];
                                for (var i = 0; i < ids.length; i++) {
                                    var id = ids[i];
                                    for (var j = 0; j < matches.length; j++) {
                                        var match = matches[j];
                                        if (equal(id, opts.id(match))) {
                                            ordered.push(match);
                                            matches.splice(j, 1);
                                            break;
                                        }
                                    }
                                }
                                callback(ordered);
                            }
                        });
                    };
                }
                return opts;
            },
            // multi
            selectChoice: function(choice) {
                var selected = this.container.find(".select2-search-choice-focus");
                if (selected.length && choice && choice[0] == selected[0]) {} else {
                    if (selected.length) {
                        this.opts.element.trigger("choice-deselected", selected);
                    }
                    selected.removeClass("select2-search-choice-focus");
                    if (choice && choice.length) {
                        this.close();
                        choice.addClass("select2-search-choice-focus");
                        this.opts.element.trigger("choice-selected", choice);
                    }
                }
            },
            // multi
            destroy: function() {
                $("label[for='" + this.search.attr("id") + "']").attr("for", this.opts.element.attr("id"));
                this.parent.destroy.apply(this, arguments);
                cleanupJQueryElements.call(this, "searchContainer", "selection");
            },
            // multi
            initContainer: function() {
                var selector = ".select2-choices", selection;
                this.searchContainer = this.container.find(".select2-search-field");
                this.selection = selection = this.container.find(selector);
                var _this = this;
                this.selection.on("click", ".select2-search-choice:not(.select2-locked)", function(e) {
                    //killEvent(e);
                    _this.search[0].focus();
                    _this.selectChoice($(this));
                });
                // rewrite labels from original element to focusser
                this.search.attr("id", "s2id_autogen" + nextUid());
                this.search.prev().text($("label[for='" + this.opts.element.attr("id") + "']").text()).attr("for", this.search.attr("id"));
                this.search.on("input paste", this.bind(function() {
                    if (this.search.attr("placeholder") && this.search.val().length == 0) return;
                    if (!this.isInterfaceEnabled()) return;
                    if (!this.opened()) {
                        this.open();
                    }
                }));
                this.search.attr("tabindex", this.elementTabIndex);
                this.keydowns = 0;
                this.search.on("keydown", this.bind(function(e) {
                    if (!this.isInterfaceEnabled()) return;
                    ++this.keydowns;
                    var selected = selection.find(".select2-search-choice-focus");
                    var prev = selected.prev(".select2-search-choice:not(.select2-locked)");
                    var next = selected.next(".select2-search-choice:not(.select2-locked)");
                    var pos = getCursorInfo(this.search);
                    if (selected.length && (e.which == KEY.LEFT || e.which == KEY.RIGHT || e.which == KEY.BACKSPACE || e.which == KEY.DELETE || e.which == KEY.ENTER)) {
                        var selectedChoice = selected;
                        if (e.which == KEY.LEFT && prev.length) {
                            selectedChoice = prev;
                        } else if (e.which == KEY.RIGHT) {
                            selectedChoice = next.length ? next : null;
                        } else if (e.which === KEY.BACKSPACE) {
                            if (this.unselect(selected.first())) {
                                this.search.width(10);
                                selectedChoice = prev.length ? prev : next;
                            }
                        } else if (e.which == KEY.DELETE) {
                            if (this.unselect(selected.first())) {
                                this.search.width(10);
                                selectedChoice = next.length ? next : null;
                            }
                        } else if (e.which == KEY.ENTER) {
                            selectedChoice = null;
                        }
                        this.selectChoice(selectedChoice);
                        killEvent(e);
                        if (!selectedChoice || !selectedChoice.length) {
                            this.open();
                        }
                        return;
                    } else if ((e.which === KEY.BACKSPACE && this.keydowns == 1 || e.which == KEY.LEFT) && pos.offset == 0 && !pos.length) {
                        this.selectChoice(selection.find(".select2-search-choice:not(.select2-locked)").last());
                        killEvent(e);
                        return;
                    } else {
                        this.selectChoice(null);
                    }
                    if (this.opened()) {
                        switch (e.which) {
                          case KEY.UP:
                          case KEY.DOWN:
                            this.moveHighlight(e.which === KEY.UP ? -1 : 1);
                            killEvent(e);
                            return;

                          case KEY.ENTER:
                            this.selectHighlighted();
                            killEvent(e);
                            return;

                          case KEY.TAB:
                            this.selectHighlighted({
                                noFocus: true
                            });
                            this.close();
                            return;

                          case KEY.ESC:
                            this.cancel(e);
                            killEvent(e);
                            return;
                        }
                    }
                    if (e.which === KEY.TAB || KEY.isControl(e) || KEY.isFunctionKey(e) || e.which === KEY.BACKSPACE || e.which === KEY.ESC) {
                        return;
                    }
                    if (e.which === KEY.ENTER) {
                        if (this.opts.openOnEnter === false) {
                            return;
                        } else if (e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) {
                            return;
                        }
                    }
                    this.open();
                    if (e.which === KEY.PAGE_UP || e.which === KEY.PAGE_DOWN) {
                        // prevent the page from scrolling
                        killEvent(e);
                    }
                    if (e.which === KEY.ENTER) {
                        // prevent form from being submitted
                        killEvent(e);
                    }
                }));
                this.search.on("keyup", this.bind(function(e) {
                    this.keydowns = 0;
                    this.resizeSearch();
                }));
                this.search.on("blur", this.bind(function(e) {
                    this.container.removeClass("select2-container-active");
                    this.search.removeClass("select2-focused");
                    this.selectChoice(null);
                    if (!this.opened()) this.clearSearch();
                    e.stopImmediatePropagation();
                    this.opts.element.trigger($.Event("select2-blur"));
                }));
                this.container.on("click", selector, this.bind(function(e) {
                    if (!this.isInterfaceEnabled()) return;
                    if ($(e.target).closest(".select2-search-choice").length > 0) {
                        // clicked inside a select2 search choice, do not open
                        return;
                    }
                    this.selectChoice(null);
                    this.clearPlaceholder();
                    if (!this.container.hasClass("select2-container-active")) {
                        this.opts.element.trigger($.Event("select2-focus"));
                    }
                    this.open();
                    this.focusSearch();
                    e.preventDefault();
                }));
                this.container.on("focus", selector, this.bind(function() {
                    if (!this.isInterfaceEnabled()) return;
                    if (!this.container.hasClass("select2-container-active")) {
                        this.opts.element.trigger($.Event("select2-focus"));
                    }
                    this.container.addClass("select2-container-active");
                    this.dropdown.addClass("select2-drop-active");
                    this.clearPlaceholder();
                }));
                this.initContainerWidth();
                this.opts.element.addClass("select2-offscreen");
                // set the placeholder if necessary
                this.clearSearch();
            },
            // multi
            enableInterface: function() {
                if (this.parent.enableInterface.apply(this, arguments)) {
                    this.search.prop("disabled", !this.isInterfaceEnabled());
                }
            },
            // multi
            initSelection: function() {
                var data;
                if (this.opts.element.val() === "" && this.opts.element.text() === "") {
                    this.updateSelection([]);
                    this.close();
                    // set the placeholder if necessary
                    this.clearSearch();
                }
                if (this.select || this.opts.element.val() !== "") {
                    var self = this;
                    this.opts.initSelection.call(null, this.opts.element, function(data) {
                        if (data !== undefined && data !== null) {
                            self.updateSelection(data);
                            self.close();
                            // set the placeholder if necessary
                            self.clearSearch();
                        }
                    });
                }
            },
            // multi
            clearSearch: function() {
                var placeholder = this.getPlaceholder(), maxWidth = this.getMaxSearchWidth();
                if (placeholder !== undefined && this.getVal().length === 0 && this.search.hasClass("select2-focused") === false) {
                    this.search.val(placeholder).addClass("select2-default");
                    // stretch the search box to full width of the container so as much of the placeholder is visible as possible
                    // we could call this.resizeSearch(), but we do not because that requires a sizer and we do not want to create one so early because of a firefox bug, see #944
                    this.search.width(maxWidth > 0 ? maxWidth : this.container.css("width"));
                } else {
                    this.search.val("").width(10);
                }
            },
            // multi
            clearPlaceholder: function() {
                if (this.search.hasClass("select2-default")) {
                    this.search.val("").removeClass("select2-default");
                }
            },
            // multi
            opening: function() {
                this.clearPlaceholder();
                // should be done before super so placeholder is not used to search
                this.resizeSearch();
                this.parent.opening.apply(this, arguments);
                this.focusSearch();
                // initializes search's value with nextSearchTerm (if defined by user)
                // ignore nextSearchTerm if the dropdown is opened by the user pressing a letter
                if (this.search.val() === "") {
                    if (this.nextSearchTerm != undefined) {
                        this.search.val(this.nextSearchTerm);
                        this.search.select();
                    }
                }
                this.updateResults(true);
                if (this.opts.shouldFocusInput(this)) {
                    this.search.focus();
                }
                this.opts.element.trigger($.Event("select2-open"));
            },
            // multi
            close: function() {
                if (!this.opened()) return;
                this.parent.close.apply(this, arguments);
            },
            // multi
            focus: function() {
                this.close();
                this.search.focus();
            },
            // multi
            isFocused: function() {
                return this.search.hasClass("select2-focused");
            },
            // multi
            updateSelection: function(data) {
                var ids = [], filtered = [], self = this;
                // filter out duplicates
                $(data).each(function() {
                    if (indexOf(self.id(this), ids) < 0) {
                        ids.push(self.id(this));
                        filtered.push(this);
                    }
                });
                data = filtered;
                this.selection.find(".select2-search-choice").remove();
                $(data).each(function() {
                    self.addSelectedChoice(this);
                });
                self.postprocessResults();
            },
            // multi
            tokenize: function() {
                var input = this.search.val();
                input = this.opts.tokenizer.call(this, input, this.data(), this.bind(this.onSelect), this.opts);
                if (input != null && input != undefined) {
                    this.search.val(input);
                    if (input.length > 0) {
                        this.open();
                    }
                }
            },
            // multi
            onSelect: function(data, options) {
                if (!this.triggerSelect(data)) {
                    return;
                }
                this.addSelectedChoice(data);
                this.opts.element.trigger({
                    type: "selected",
                    val: this.id(data),
                    choice: data
                });
                // keep track of the search's value before it gets cleared
                this.nextSearchTerm = this.opts.nextSearchTerm(data, this.search.val());
                this.clearSearch();
                this.updateResults();
                if (this.select || !this.opts.closeOnSelect) this.postprocessResults(data, false, this.opts.closeOnSelect === true);
                if (this.opts.closeOnSelect) {
                    this.close();
                    this.search.width(10);
                } else {
                    if (this.countSelectableResults() > 0) {
                        this.search.width(10);
                        this.resizeSearch();
                        if (this.getMaximumSelectionSize() > 0 && this.val().length >= this.getMaximumSelectionSize()) {
                            // if we reached max selection size repaint the results so choices
                            // are replaced with the max selection reached message
                            this.updateResults(true);
                        } else {
                            // initializes search's value with nextSearchTerm and update search result
                            if (this.nextSearchTerm != undefined) {
                                this.search.val(this.nextSearchTerm);
                                this.updateResults();
                                this.search.select();
                            }
                        }
                        this.positionDropdown();
                    } else {
                        // if nothing left to select close
                        this.close();
                        this.search.width(10);
                    }
                }
                // since its not possible to select an element that has already been
                // added we do not need to check if this is a new element before firing change
                this.triggerChange({
                    added: data
                });
                if (!options || !options.noFocus) this.focusSearch();
            },
            // multi
            cancel: function() {
                this.close();
                this.focusSearch();
            },
            addSelectedChoice: function(data) {
                var enableChoice = !data.locked, enabledItem = $("<li class='select2-search-choice'>" + "    <div></div>" + "    <a href='#' class='select2-search-choice-close' tabindex='-1'></a>" + "</li>"), disabledItem = $("<li class='select2-search-choice select2-locked'>" + "<div></div>" + "</li>");
                var choice = enableChoice ? enabledItem : disabledItem, id = this.id(data), val = this.getVal(), formatted, cssClass;
                formatted = this.opts.formatSelection(data, choice.find("div"), this.opts.escapeMarkup);
                if (formatted != undefined) {
                    choice.find("div").replaceWith("<div>" + formatted + "</div>");
                }
                cssClass = this.opts.formatSelectionCssClass(data, choice.find("div"));
                if (cssClass != undefined) {
                    choice.addClass(cssClass);
                }
                if (enableChoice) {
                    choice.find(".select2-search-choice-close").on("mousedown", killEvent).on("click dblclick", this.bind(function(e) {
                        if (!this.isInterfaceEnabled()) return;
                        this.unselect($(e.target));
                        this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus");
                        killEvent(e);
                        this.close();
                        this.focusSearch();
                    })).on("focus", this.bind(function() {
                        if (!this.isInterfaceEnabled()) return;
                        this.container.addClass("select2-container-active");
                        this.dropdown.addClass("select2-drop-active");
                    }));
                }
                choice.data("select2-data", data);
                choice.insertBefore(this.searchContainer);
                val.push(id);
                this.setVal(val);
            },
            // multi
            unselect: function(selected) {
                var val = this.getVal(), data, index;
                selected = selected.closest(".select2-search-choice");
                if (selected.length === 0) {
                    throw "Invalid argument: " + selected + ". Must be .select2-search-choice";
                }
                data = selected.data("select2-data");
                if (!data) {
                    // prevent a race condition when the 'x' is clicked really fast repeatedly the event can be queued
                    // and invoked on an element already removed
                    return;
                }
                var evt = $.Event("select2-removing");
                evt.val = this.id(data);
                evt.choice = data;
                this.opts.element.trigger(evt);
                if (evt.isDefaultPrevented()) {
                    return false;
                }
                while ((index = indexOf(this.id(data), val)) >= 0) {
                    val.splice(index, 1);
                    this.setVal(val);
                    if (this.select) this.postprocessResults();
                }
                selected.remove();
                this.opts.element.trigger({
                    type: "select2-removed",
                    val: this.id(data),
                    choice: data
                });
                this.triggerChange({
                    removed: data
                });
                return true;
            },
            // multi
            postprocessResults: function(data, initial, noHighlightUpdate) {
                var val = this.getVal(), choices = this.results.find(".select2-result"), compound = this.results.find(".select2-result-with-children"), self = this;
                choices.each2(function(i, choice) {
                    var id = self.id(choice.data("select2-data"));
                    if (indexOf(id, val) >= 0) {
                        choice.addClass("select2-selected");
                        // mark all children of the selected parent as selected
                        choice.find(".select2-result-selectable").addClass("select2-selected");
                    }
                });
                compound.each2(function(i, choice) {
                    // hide an optgroup if it doesn't have any selectable children
                    if (!choice.is(".select2-result-selectable") && choice.find(".select2-result-selectable:not(.select2-selected)").length === 0) {
                        choice.addClass("select2-selected");
                    }
                });
                if (this.highlight() == -1 && noHighlightUpdate !== false) {
                    self.highlight(0);
                }
                //If all results are chosen render formatNoMatches
                if (!this.opts.createSearchChoice && !choices.filter(".select2-result:not(.select2-selected)").length > 0) {
                    if (!data || data && !data.more && this.results.find(".select2-no-results").length === 0) {
                        if (checkFormatter(self.opts.formatNoMatches, "formatNoMatches")) {
                            this.results.append("<li class='select2-no-results'>" + evaluate(self.opts.formatNoMatches, self.opts.element, self.search.val()) + "</li>");
                        }
                    }
                }
            },
            // multi
            getMaxSearchWidth: function() {
                return this.selection.width() - getSideBorderPadding(this.search);
            },
            // multi
            resizeSearch: function() {
                var minimumWidth, left, maxWidth, containerLeft, searchWidth, sideBorderPadding = getSideBorderPadding(this.search);
                minimumWidth = measureTextWidth(this.search) + 10;
                left = this.search.offset().left;
                maxWidth = this.selection.width();
                containerLeft = this.selection.offset().left;
                searchWidth = maxWidth - (left - containerLeft) - sideBorderPadding;
                if (searchWidth < minimumWidth) {
                    searchWidth = maxWidth - sideBorderPadding;
                }
                if (searchWidth < 40) {
                    searchWidth = maxWidth - sideBorderPadding;
                }
                if (searchWidth <= 0) {
                    searchWidth = minimumWidth;
                }
                this.search.width(Math.floor(searchWidth));
            },
            // multi
            getVal: function() {
                var val;
                if (this.select) {
                    val = this.select.val();
                    return val === null ? [] : val;
                } else {
                    val = this.opts.element.val();
                    return splitVal(val, this.opts.separator);
                }
            },
            // multi
            setVal: function(val) {
                var unique;
                if (this.select) {
                    this.select.val(val);
                } else {
                    unique = [];
                    // filter out duplicates
                    $(val).each(function() {
                        if (indexOf(this, unique) < 0) unique.push(this);
                    });
                    this.opts.element.val(unique.length === 0 ? "" : unique.join(this.opts.separator));
                }
            },
            // multi
            buildChangeDetails: function(old, current) {
                var current = current.slice(0), old = old.slice(0);
                // remove intersection from each array
                for (var i = 0; i < current.length; i++) {
                    for (var j = 0; j < old.length; j++) {
                        if (equal(this.opts.id(current[i]), this.opts.id(old[j]))) {
                            current.splice(i, 1);
                            if (i > 0) {
                                i--;
                            }
                            old.splice(j, 1);
                            j--;
                        }
                    }
                }
                return {
                    added: current,
                    removed: old
                };
            },
            // multi
            val: function(val, triggerChange) {
                var oldData, self = this;
                if (arguments.length === 0) {
                    return this.getVal();
                }
                oldData = this.data();
                if (!oldData.length) oldData = [];
                // val is an id. !val is true for [undefined,null,'',0] - 0 is legal
                if (!val && val !== 0) {
                    this.opts.element.val("");
                    this.updateSelection([]);
                    this.clearSearch();
                    if (triggerChange) {
                        this.triggerChange({
                            added: this.data(),
                            removed: oldData
                        });
                    }
                    return;
                }
                // val is a list of ids
                this.setVal(val);
                if (this.select) {
                    this.opts.initSelection(this.select, this.bind(this.updateSelection));
                    if (triggerChange) {
                        this.triggerChange(this.buildChangeDetails(oldData, this.data()));
                    }
                } else {
                    if (this.opts.initSelection === undefined) {
                        throw new Error("val() cannot be called if initSelection() is not defined");
                    }
                    this.opts.initSelection(this.opts.element, function(data) {
                        var ids = $.map(data, self.id);
                        self.setVal(ids);
                        self.updateSelection(data);
                        self.clearSearch();
                        if (triggerChange) {
                            self.triggerChange(self.buildChangeDetails(oldData, self.data()));
                        }
                    });
                }
                this.clearSearch();
            },
            // multi
            onSortStart: function() {
                if (this.select) {
                    throw new Error("Sorting of elements is not supported when attached to <select>. Attach to <input type='hidden'/> instead.");
                }
                // collapse search field into 0 width so its container can be collapsed as well
                this.search.width(0);
                // hide the container
                this.searchContainer.hide();
            },
            // multi
            onSortEnd: function() {
                var val = [], self = this;
                // show search and move it to the end of the list
                this.searchContainer.show();
                // make sure the search container is the last item in the list
                this.searchContainer.appendTo(this.searchContainer.parent());
                // since we collapsed the width in dragStarted, we resize it here
                this.resizeSearch();
                // update selection
                this.selection.find(".select2-search-choice").each(function() {
                    val.push(self.opts.id($(this).data("select2-data")));
                });
                this.setVal(val);
                this.triggerChange();
            },
            // multi
            data: function(values, triggerChange) {
                var self = this, ids, old;
                if (arguments.length === 0) {
                    return this.selection.children(".select2-search-choice").map(function() {
                        return $(this).data("select2-data");
                    }).get();
                } else {
                    old = this.data();
                    if (!values) {
                        values = [];
                    }
                    ids = $.map(values, function(e) {
                        return self.opts.id(e);
                    });
                    this.setVal(ids);
                    this.updateSelection(values);
                    this.clearSearch();
                    if (triggerChange) {
                        this.triggerChange(this.buildChangeDetails(old, this.data()));
                    }
                }
            }
        });
        $.fn.select2 = function() {
            var args = Array.prototype.slice.call(arguments, 0), opts, select2, method, value, multiple, allowedMethods = [ "val", "destroy", "opened", "open", "close", "focus", "isFocused", "container", "dropdown", "onSortStart", "onSortEnd", "enable", "disable", "readonly", "positionDropdown", "data", "search" ], valueMethods = [ "opened", "isFocused", "container", "dropdown" ], propertyMethods = [ "val", "data" ], methodsMap = {
                search: "externalSearch"
            };
            this.each(function() {
                if (args.length === 0 || typeof args[0] === "object") {
                    opts = args.length === 0 ? {} : $.extend({}, args[0]);
                    opts.element = $(this);
                    if (opts.element.get(0).tagName.toLowerCase() === "select") {
                        multiple = opts.element.prop("multiple");
                    } else {
                        multiple = opts.multiple || false;
                        if ("tags" in opts) {
                            opts.multiple = multiple = true;
                        }
                    }
                    select2 = multiple ? new window.Select2["class"].multi() : new window.Select2["class"].single();
                    select2.init(opts);
                } else if (typeof args[0] === "string") {
                    if (indexOf(args[0], allowedMethods) < 0) {
                        throw "Unknown method: " + args[0];
                    }
                    value = undefined;
                    select2 = $(this).data("select2");
                    if (select2 === undefined) return;
                    method = args[0];
                    if (method === "container") {
                        value = select2.container;
                    } else if (method === "dropdown") {
                        value = select2.dropdown;
                    } else {
                        if (methodsMap[method]) method = methodsMap[method];
                        value = select2[method].apply(select2, args.slice(1));
                    }
                    if (indexOf(args[0], valueMethods) >= 0 || indexOf(args[0], propertyMethods) >= 0 && args.length == 1) {
                        return false;
                    }
                } else {
                    throw "Invalid arguments to select2 plugin: " + args;
                }
            });
            return value === undefined ? this : value;
        };
        // plugin defaults, accessible to users
        $.fn.select2.defaults = {
            width: "copy",
            loadMorePadding: 0,
            closeOnSelect: true,
            openOnEnter: true,
            containerCss: {},
            dropdownCss: {},
            containerCssClass: "",
            dropdownCssClass: "",
            formatResult: function(result, container, query, escapeMarkup) {
                var markup = [];
                markMatch(result.text, query.term, markup, escapeMarkup);
                return markup.join("");
            },
            formatSelection: function(data, container, escapeMarkup) {
                return data ? escapeMarkup(data.text) : undefined;
            },
            sortResults: function(results, container, query) {
                return results;
            },
            formatResultCssClass: function(data) {
                return data.css;
            },
            formatSelectionCssClass: function(data, container) {
                return undefined;
            },
            formatMatches: function(matches) {
                return matches + " results are available, use up and down arrow keys to navigate.";
            },
            formatNoMatches: function() {
                return "No matches found";
            },
            formatInputTooShort: function(input, min) {
                var n = min - input.length;
                return "Please enter " + n + " or more character" + (n == 1 ? "" : "s");
            },
            formatInputTooLong: function(input, max) {
                var n = input.length - max;
                return "Please delete " + n + " character" + (n == 1 ? "" : "s");
            },
            formatSelectionTooBig: function(limit) {
                return "You can only select " + limit + " item" + (limit == 1 ? "" : "s");
            },
            formatLoadMore: function(pageNumber) {
                return "Loading more results…";
            },
            formatSearching: function() {
                return "Searching…";
            },
            minimumResultsForSearch: 0,
            minimumInputLength: 0,
            maximumInputLength: null,
            maximumSelectionSize: 0,
            id: function(e) {
                return e == undefined ? null : e.id;
            },
            matcher: function(term, text) {
                return stripDiacritics("" + text).toUpperCase().indexOf(stripDiacritics("" + term).toUpperCase()) >= 0;
            },
            separator: ",",
            tokenSeparators: [],
            tokenizer: defaultTokenizer,
            escapeMarkup: defaultEscapeMarkup,
            blurOnChange: false,
            selectOnBlur: false,
            adaptContainerCssClass: function(c) {
                return c;
            },
            adaptDropdownCssClass: function(c) {
                return null;
            },
            nextSearchTerm: function(selectedObject, currentSearchTerm) {
                return undefined;
            },
            searchInputPlaceholder: "",
            createSearchChoicePosition: "top",
            shouldFocusInput: function(instance) {
                // Attempt to detect touch devices
                var supportsTouchEvents = "ontouchstart" in window || navigator.msMaxTouchPoints > 0;
                // Only devices which support touch events should be special cased
                if (!supportsTouchEvents) {
                    return true;
                }
                // Never focus the input if search is disabled
                if (instance.opts.minimumResultsForSearch < 0) {
                    return false;
                }
                return true;
            }
        };
        $.fn.select2.ajaxDefaults = {
            transport: $.ajax,
            params: {
                type: "GET",
                cache: false,
                dataType: "json"
            }
        };
        // exports
        window.Select2 = {
            query: {
                ajax: ajax,
                local: local,
                tags: tags
            },
            util: {
                debounce: debounce,
                markMatch: markMatch,
                escapeMarkup: defaultEscapeMarkup,
                stripDiacritics: stripDiacritics
            },
            "class": {
                "abstract": AbstractSelect2,
                single: SingleSelect2,
                multi: MultiSelect2
            }
        };
    })(jQuery);
    (function($) {
        "use strict";
        $.extend($.fn.select2.defaults, {
            formatNoMatches: function() {
                return "没有找到匹配项";
            },
            formatInputTooShort: function(input, min) {
                var n = min - input.length;
                return "请再输入" + n + "个字符";
            },
            formatInputTooLong: function(input, max) {
                var n = input.length - max;
                return "请删掉" + n + "个字符";
            },
            formatSelectionTooBig: function(limit) {
                return "你只能选择最多" + limit + "项";
            },
            formatLoadMore: function(pageNumber) {
                return "加载结果中…";
            },
            formatSearching: function() {
                return "搜索中…";
            }
        });
    })(jQuery);
});
