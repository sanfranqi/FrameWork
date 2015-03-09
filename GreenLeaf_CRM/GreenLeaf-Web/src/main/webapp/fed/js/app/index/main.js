/**
 * 首页
 *
 * @module index
 */
define(function (require, exports, module) {
    'use strict';

    var $ = require('$'),
        util = require('../common/util'),
        io = require('../common/io'),
        Calendar = require('calendar'),
        moment = require('moment'),
        helpers = require('../common/helpers'),
        userInfoTemplate = require('./userinfo.handlebars'),
        listTemplate = require('./list.handlebars');

    require('handlebars');
    require('jqPaginator');
    require('calendar.css');
    require('runtime');
    require('../common/autorender');

    helpers = $.extend({}, helpers, {
        getAvatar: function (val, gender) {
            if (val) {
                return avatarCtx + val;
            } else {
                return gender === '1' ?
                    'http://ue.17173cdn.com/a/ermp/index/2014/images/pic-male.jpg' :
                    'http://ue.17173cdn.com/a/ermp/index/2014/images/pic-female.jpg';
            }
        }
    });

    /**
     * 首页
     *
     * @class index
     */
    var app = {

        /**
         * 分页对象
         *
         * @property model
         */
        model: {
            pageNo: 1,
            pageSize: 15,
            userno: userno,
            startTime: '',
            endTime: '',
            operateType: ''
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
         * @method cacheElements
         */
        cacheElement: function () {
            var self = this;

            self.$userInfo = $('#J_UserInfo');
            self.$list = $('#J_List');
            self.$openSearch = $('#J_OpenSearch');
            self.$closeSearch = $('#J_CloseSearch');
            self.$tab = $('#J_Index_Tab');
            self.$page = $('#J_Page');
            self.$time = $('#J_Time');
            self.$form = $('#J_Form');
        },

        /**
         * 初始化日期组件
         *
         * @method initCalendar
         */
        initCalendar: function () {
            var self = this;
            self.calendarStartTime = new Calendar({
                trigger: '#J_Form_StartTime'
            });
            self.calendarEndTime = new Calendar({
                trigger: '#J_Form_EndTime'
            });
        },

        /**
         * 校验查询数据
         *
         * @mothed proof
         */
        proof: function () {
            var self = this;

            var data = util.packForm(self.$form);
            if (!data.userno) {
                data.userno = userno;
            }
            data.pageNo = 1;

            self.model = $.extend({}, self.model, data);

            if (!self.verify()) {
                return;
            }

            self.showTime();
            self.getUserInfo();
            self.search();
            self.$closeSearch.trigger('click');
        },

        /**
         * 验证日期格式
         *
         * @method verify
         * @returns {boolean} 日期格式是否合法
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

            if (startTime && endTime && startTime >= endTime) {
                util.showMessage('开始时间必须小于结束时间!');
                return false;
            }

            self.model.startTime = startTime;
            self.model.endTime = endTime;

            return true;
        },

        /**
         * 获取用户信息
         *
         * @method getUserInfo
         */
        getUserInfo: function () {
            var self = this;

            io.get(util.getUrl('indexUser'), {userno: self.model.userno}, function () {
                var userInfoHtml = userInfoTemplate(this.data, {helpers: helpers});
                self.$userInfo.html(userInfoHtml);
            });
        },

        /**
         * 查询
         *
         * @method search
         */
        search: function () {
            var self = this;

            io.get(util.getUrl('indexList'), self.model, function () {
                var result = this.data,
                    listHtml = listTemplate(result, {helpers: helpers});

                self.$list.html(listHtml);
                self.paginator(result.pageNo, result.pageSize, result.totalHit);
            });
        },

        /**
         * tab切换
         *
         * @method switching
         * @param operateType {String} 要切换到的类型
         */
        switching: function (operateType) {
            var self = this;

            self.model.operateType = operateType;
            self.model.pageNo = 1;
            self.search();
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
                prev: '<li><a href="javascript:;"><i class="ico-arrow ico-arrow2"></i>上一页</a></li>',
                next: '<li><a href="javascript:;">下一页<i class="ico-arrow ico-arrow3"></i></a></li>',
                last: '<li><a href="javascript:;">末页</a></li>',
                page: '<li><a href="javascript:;">{{page}}</a></li>',
                onPageChange: function (num, type) {
                    if (type === 'change' && self.model.pageNo != num) {
                        self.model.pageNo = num;
                        self.search();
                    }
                    return false;
                }
            });
        },

        /**
         * 显示查询的时间段
         *
         * @method showTime
         */
        showTime: function () {
            var self = this,
                startStr = self.model.startTime ? moment(self.model.startTime).format('YYYY.MM.DD') : '',
                endStr = self.model.endTime ? moment(self.model.endTime).format('YYYY.MM.DD') : '';

            if (!startStr && !endStr) {
                self.$time.text('');
            }else{
                self.$time.text('(' + startStr + ' - ' + endStr + ')');
            }
        },

        /**
         * 事件绑定
         *
         * @method bindEvents
         */
        bindEvents: function () {
            var self = this;

            self.$openSearch.on('click', function () {
                $('.user-info').hide();
                $('.user-search').show();
            });
            self.$closeSearch.on('click', function () {
                $('.user-info').show();
                $('.user-search').hide();
            });
            self.$form.on('click', '#J_Form_Btn', $.proxy(self.proof, self));
            self.$tab.on('click', 'li', function () {
                var $t = $(this);
                if ($t.hasClass('active')) {
                    return;
                }
                self.switching($t.data('operatetype'));
                $(this).siblings('li').removeClass('active');
                $(this).addClass('active');
            });
        }
    };

    app.init();
});