;(function () {

    var METHODS = ["warn", "log", "error", "table"];
    if (!window.console) {
        window.console = {};
        for (var i = 0, method, l = METHODS.length; i < l; i++) {
            method = METHODS[i];
            console[method] = function () {
            };
        }
    }

    var ROOT = 'http://ue.17173cdn.com/a/jifen/index/2014/js/';
    var DEBUG = ctx.indexOf('localhost') > -1;
    var BASE = DEBUG ? (ctx + '/sea-modules/') : ROOT;

    var version = '20140515140200';
    var RULES = [
        [ROOT + 'jquery/jquery/1.10.1/jquery.js', ROOT + 'jquery/1.10.1/jquery.js?v=' + version],
        ['/sea-modules/jquery/jquery/1.10.1/jquery.js', '/js/jquery/1.10.1/jquery.js?v=' + version],
        ['.js', '.js?v=' + version]
    ];

    var MODULE = {
        '$': 'jquery/jquery/1.10.1/jquery',
        '$-debug': 'jquery/jquery/1.10.1/jquery-debug',
        'calendar.css': 'arale/calendar/1.0.0/calendar.css',
        'calendar': 'arale/calendar/1.0.0/calendar',
        'datetimepicker': 'fiftyk/bootstrap-datetimepicker/1.0.0/bootstrap-datetimepicker',
        'datetimepicker.css': 'fiftyk/bootstrap-datetimepicker/1.0.0/bootstrap-datetimepicker.css',
        'validator': 'arale/validator/0.9.7/validator',
        'upload':'arale/upload/1.1.1/upload',
        'dialog': 'arale/dialog/1.3.0/dialog',
        'handlebars': 'gallery/handlebars/1.0.2/handlebars',
        'runtime': 'gallery/handlebars/1.0.2/runtime',
        'jqPaginator': 'keenwon/jqPaginator/1.1.0/jqPaginator',
        'dragsort': 'keenwon/dragsort/0.5.1/dragsort',
        'moment': 'gallery/moment/2.0.0/moment',
        'selectize': 'jquery/selectize/0.6.13/selectize.js'
    };

    seajs.config({
        base: BASE,
        debug: DEBUG,
        map: RULES,
        alias: MODULE
    });
})();