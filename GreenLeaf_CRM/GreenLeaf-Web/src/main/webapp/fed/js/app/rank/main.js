/**
 * 排行榜
 *
 * @module rank
 */
define(function (require) {
    'use strict';

    var $ = require('$'),
        util = require('../common/util'),
        io = require('../common/io'),
        helpers = require('../common/helpers'),
        listTemplate = require('./list.handlebars');

    require('handlebars');
    require('runtime');
    require('jqPaginator');

    helpers = $.extend({}, helpers, {
        getClass: function (index, isMy) {
            var classStr = '';
            if (index === 0) {
                classStr += ' border-none ';
            }
            if (isMy) {
                classStr += ' my ';
            }
            return classStr;
        }
    });

    /**
     * 排行榜
     *
     * @class rank
     */
    var app = {

        /**
         * 分页查询对象
         *
         * @property model
         */
        model: {
            sort: 'totalScore',
            loadMyLocation: false,
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
            self.getList();
            self.bindEvents();
            self.routing();
        },

        /**
         * 缓存jQuery对象
         *
         * @method cacheElements
         */
        cacheElement: function () {
            var self = this;

            self.$tab = $('#J_Rank_Tab');
            self.$list = $('#J_List');
            self.$my = $('#J_My');
            self.$page = $('#J_Page');
        },

        /**
         * 获取排行榜列表
         *
         * @method getList
         */
        getList: function () {
            var self = this;

            io.get(util.getUrl('rankList'), self.model, function () {
                var result = this.data.listData,
                    currentPage = this.data.pageNo,
                    pageSize = this.data.pageSize,
                    totalCounts = this.data.totalHit;

                //format data
                for (var i = 0, j = result.length; i < j; i++) {
                    result[i].my = result[i].userno == userno;
                    result[i].scoreForShow = result[i][self.model.sort];
                }

                var listHtml = listTemplate(result, {helpers: helpers});

                self.$list.html(listHtml);
                self.model.pageNo = currentPage;//防止“我的排名刷新两次”
                self.paginator(currentPage, pageSize, totalCounts);
                self.model.loadMyLocation = false;
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
                visiblePages: 5,
                currentPage: currentPage,

                first: '<li><a href="javascript:;">首页</a></li>',
                prev: '<li><a href="javascript:;"><i class="ico-arrow ico-arrow2"></i>上一页</a></li>',
                next: '<li><a href="javascript:;">下一页<i class="ico-arrow ico-arrow3"></i></a></li>',
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
         * 定位我的排名
         *
         * @method my
         */
        my: function () {
            var self = this;

            self.model.loadMyLocation = true;
            self.getList();
        },

        /**
         * tab切换
         *
         * @method switching
         * @param type {String} tab类型
         */
        switching: function (type) {
            var self = this;
            self.model.loadMyLocation = false;
            self.model.sort = type;
            self.model.pageNo = 1;
            self.getList();
        },

        /**
         * 事件绑定
         *
         * @method bindEvents
         */
        bindEvents: function () {
            var self = this;

            self.$tab.on('click', 'li', function () {
                var $t = $(this);
                if ($t.hasClass('active')) {
                    return;
                }
                $(this).siblings('li').removeClass('active');
                $(this).addClass('active');
                self.switching($t.data('sort'));
                window.location.hash = $t.data('sort');
            });

            self.$my.on('click', $.proxy(self.my, self));
        },

        /**
         * 简单的路由控制
         *
         * @method routing
         */
        routing: function () {
            var self = this,
                type = window.location.hash.substr(1);

            if (!type || ( type !== 'totalScore' && type !== 'usedScore' && type !== 'score')) {
                window.location.hash = 'totalScore';
                return;
            }

            self.$tab.children('li').removeClass('active');
            self.$tab.children('[data-sort=' + type + ']').addClass('active');
            self.switching(type);

            window.location.hash = type;
        }
    };

    app.init();
});