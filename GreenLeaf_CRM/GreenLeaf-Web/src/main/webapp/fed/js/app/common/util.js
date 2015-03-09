define(function(require, exports, module) {
    'use strict';

    var util = {};
    var config = require('./config');
    var ConfirmBox = require('./dialog/confirmbox');
    var $ = require('$');
    var $message = $('#J_Message');
    var win = window;

    util.urlParams = function() {
        return util.queryToJson( window.location.search.replace(/^\?/, '') );
    };

    util.packForm = function(form, escape) {
        var $form = typeof form === 'string' ? $(form) : form;
        var a = $form.serializeArray();
        var o = {};

        escape = (typeof escape == 'undefined') ? true : false;

        $.each(a, function() {
            var value = this.value;

            this.value = value === 'null'?null:this.value;

            if (typeof o[this.name] !== 'undefined') {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(escape ? util.escape(this.value) : $.trim(this.value));
            } else {
                o[this.name] = (escape) ? util.escape(this.value) : $.trim(this.value);
            }
        });
        return o;
    };

    util.escape = function(str) {
        return $.trim(str)
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    };

    util.getUrl = function(k) {
        var base = ctx ? (ctx + '/') : '/';
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
        cfg || (cfg = {isError: true, top: '0'});

        $message.find('.alert-message-text').html(msg);

        var isError = false;
        var top = '60px';

        if (cfg) {
            isError = cfg.isError;
            top = cfg.top;
        }
        $message.animate({
            top: top
        });
        if (isError) {
            $message.addClass('alert-error').find('.close').off('click').on('click', function() {
                $message.removeClass('alert-error').animate({
                    top: '-80px'
                });
            });
        } else {
            win.setTimeout(function() {
                $message.animate({
                    top: '-60px'
                });
            }, 3000);
        }
    };

    return util;
});