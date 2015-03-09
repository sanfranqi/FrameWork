define(function(require, exports, module) {
    'use strict';

    var $ = require('$');
    var Dialog = require('arale/dialog/1.3.0/dialog');
    var template = require('./confirmbox.handlebars');
    require('./confirmbox.css');
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
            title: '',
            classPrefix: 'ermp-dialog',
            width: '900px',
            hasPadding: true,
            confirmTpl: '<a class="btn btn2" href="javascript:;">确定</a>',
            cancelTpl: '<a class="btn btn2" href="javascript:;">取消</a>',
            message: '默认内容'
        },
        setup: function() {
            ConfirmBox.superclass.setup.call(this);
            var model = {
                classPrefix: this.get('classPrefix'),
                message: this.get('message'),
                title: this.get('title'),
                confirmTpl: this.get('confirmTpl'),
                cancelTpl: this.get('cancelTpl'),
                hasPadding: this.get('hasPadding'),
                hasFoot: this.get('confirmTpl') || this.get('cancelTpl')
            };
            this.set('content', template(model));
        },
        events: {
            'click [data-role=confirm]': function(e) {
                e.preventDefault();
                this.trigger('confirm');
            },
            'click [data-role=cancel]': function(e) {
                e.preventDefault();
                this.trigger('cancel');
                this.hide();
            }
        },
        _onChangeMessage: function(val) {
            this.$('[data-role=message]').html(val);
        },
        _onChangeTitle: function(val) {
            this.$('[data-role=title]').html(val);
        },
        _onChangeConfirmTpl: function(val) {
            this.$('[data-role=confirm]').html(val);
        },
        _onChangeCancelTpl: function(val) {
            this.$('[data-role=cancel]').html(val);
        }
    });
    ConfirmBox.alert = function(message, callback, options) {
        message = '<div style="padding:10px">' + message + '</div>';
        var defaults = {
            message: message,
            width: '500px',
            onConfirm: function() {
                typeof callback == 'function' && callback();
                this.hide();
            }
        };
        new ConfirmBox($.extend(null, defaults, options)).show().after('hide', function() {
            this.destroy();
        });
    };
    ConfirmBox.confirm = function(message, onConfirm, onCancel, options) {
        // support confirm(message, title, onConfirm, options)
        if (typeof onCancel === 'object' && !options) {
            options = onCancel;
        }
        var defaults = {
            message: message,
            className: 'ermp-confirm',
            width: '250px',
            confirmTpl: '<a class="btn btn2 btn-s" href="javascript:;">确定</a>',
            cancelTpl: '<a class="btn btn2 btn-s" href="javascript:;">取消</a>',
            onConfirm: function() {
                onConfirm && onConfirm();
                this.hide();
            },
            onCancel: function() {
                typeof onCancel == 'function' && onCancel();
                this.hide();
            },
            align: {
                selfXY: ['50%', '-100px'],
                baseXY: ['50%', 0]
            }
        };
        new ConfirmBox($.extend(null, defaults, options)).show().after('hide', function() {
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
            title: '',
            confirmTpl: false,
            cancelTpl: false
        };
        new ConfirmBox($.extend(null, defaults, options)).after('show', function() {
            callback && callback();
        }).show().after('hide', function() {
            this.destroy();
        });
    };
    module.exports = ConfirmBox;
    module.exports.outerBoxClass = 'arale-dialog-1_2_5';
    
    
});
