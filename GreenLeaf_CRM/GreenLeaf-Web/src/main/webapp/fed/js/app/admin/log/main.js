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
        listTemplate = require('./list.handlebars');

    require('handlebars');
    require('jqPaginator');
    require('runtime');
    require('datetimepicker');
    require('datetimepicker.css');
    require('../../common/initDatetimepicker');
    require('../../common/autorender');

    /**
     * 日志管理
     *
     * @class admin.log
     */
    var app = {

        /**
         * 分页查询对象
         *
         * @property model
         */
        model: {
            operateType: '',
            startTime: '',
            endTime: '',
            comments: '',
            systemCode: '',
            operateUserno: '',
            userno: '',
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

            self.cacheElements();
            self.initCalendar();
            self.proof();
            self.bindEvents();
        },

        /**
         * 缓存jQuery对象
         *
         * @method cacheElements
         */
        cacheElements: function () {
            var self = this;

            self.$list = $('#J_List');
            self.$page = $('#J_Page');
            self.$search = $('#J_Search');
            self.$form = $('#J_Form');
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

            var data = util.packForm(self.$form);
            self.model = $.extend({}, self.model, data);

            self.model.pageNo = 1;

            if (!self.verify()) {
                return;
            }

            self.search();
        },

        /**
         * 验证日期
         *
         * @method verify
         * @returns {boolean} 日期是否合法
         */
        verify: function () {
            var self = this,
                startTime = self.model.startTime,
                endTime = self.model.endTime,
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

            self.model.startTime = startTime;
            self.model.endTime = endTime;

            return true;
        },

        /**
         * 查询
         *
         * @method search
         */
        search: function () {
            var self = this;

            io.post(util.getUrl('logQuery'), self.model, function () {
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
                        self.search();
                    }
                }
            });
        },

        /**
         * 绑定事件
         *
         * @method bindEvents
         */
        bindEvents:function(){
            var self = this;

            self.$search.on('click', $.proxy(self.proof, self));
        }
    };

    app.init();
});