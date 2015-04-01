/**
 * Core script to handle the io
 */
var io = function() {
	var io = {};
	
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
		var async = typeof cfg.async === 'undefined';

		$.ajax({
			async: async,
            cache: false,
			url: cfg.url,
			dataType: 'json',
			traditional: true,
			type: cfg.type,
			data: cfg.data,
			success: function(returnJson) {
				returnJson && io.processor(returnJson, cfg.callback);
			},
			error: function() {
				console.warn('server error: ' + cfg.url);
			}
		});
	};
	
	io.processor = function(json, callback) {
		var result = json.result;
		var msg = json.messages;
		if(result=="success"){
			callback(json);
		}
		if(result=="failure"){
			 bootbox.alert(msg);
			 return;
		}
	};

	return io;

}();