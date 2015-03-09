define(function(require, exports, module) {
    'use strict';

	var $ = require('$'),
        util = require('./util'),
        ConfirmBox = require('./dialog/confirmbox'),
        io = {};

    // helper
    var isArray = Array.isArray || isType('Array');
    function isType(type) {
        return function(obj) {
            return Object.prototype.toString.call(obj) === '[object ' + type + ']';
        };
    }

	io.processor = function(json, callback) {

		var msg,
			success,
			error,
			input;

		//全局异常处理(login|error)
		/*if ( json.result == 'login' ) {
		        //登录页跳转
		        window.location.href = io.$cfg('page_login');
		    }*/
		if (json.result == 'error') {
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
		if ($.inArray(json.result, ['success', 'failure']) != -1) {
			msg = json.messages;
			if (isArray(msg)) {
				msg = msg.join('<br/>').replace('\n', '<br/>');
			}
			success = callback['success'] || callback;
			error = callback['error'] ||
				function(msg) {
                    util.showMessage(msg);
			    };

			(json.result == 'success') ? success.call(json, msg) : error.call(json, msg);

		} else if (json.result == 'input') {

			if (!$.isEmptyObject(json['fieldErrors'])) {

				$.each(json['fieldErrors'], function(field, v) {

					msg = (v.shift && v.shift()) || v;

					input = callback['input'];

					input && input[field] && input[field].call(json, msg);
				});

			} else {

				msg = json.messages.shift() || json.messages;

				callback['input'] ? (callback['input'].call(json, msg))
				//: ($.message(msg).modal());
				: console.log(msg);
			}
		}
	};

	io.post = function(url, data, callback) {
		if (typeof callback == 'undefined') {
			callback = data;
			data = {};
		}
		var cfg = {
			url: url,
			data: data,
			callback: callback,
			type: 'post'
		};
		io.ajax(cfg);
	};

	io.syncPost = function(url, data, callback) {
		if (typeof callback == 'undefined') {
			callback = data;
			data = {};
		}
		var cfg = {
			async: false,
			url: url,
			data: data,
			callback: callback,
			type: 'post'
		};
		io.ajax(cfg);
	};

	io.get = function(url, data, callback) {
		if (typeof callback == 'undefined') {
			callback = data;
			data = {};
		}
		var cfg = {
			url: url,
			data: data,
			callback: callback,
			type: 'get'
		};
		io.ajax(cfg);
	};

	io.syncGet = function(url, data, callback) {
		if (typeof callback == 'undefined') {
			callback = data;
			data = {};
		}
		var cfg = {
			async: false,
			url: url,
			data: data,
			callback: callback,
			type: 'get'
		};
		io.ajax(cfg);
	};

	io.ajax = function(cfg) {
		var async = typeof cfg.async == 'undefined' ? true : false;

		$.ajax({
			async: async,
            cache: false,
			url: cfg.url,
			dataType: 'json',
			traditional: true,
			type: cfg.type,
			data: cfg.data,
			success: function(d) {
				//callback(d);
				d && io.processor(d, cfg.callback);
			},
			error: function() {
				console.warn('server error: ' + cfg.url);
			}
		});
	};

	return io;
});