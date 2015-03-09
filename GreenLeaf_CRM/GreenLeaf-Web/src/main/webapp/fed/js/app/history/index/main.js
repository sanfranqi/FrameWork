/**
 * 历史拍卖
 *
 * @module history
 */
define(function (require, exports, module) {
    'use strict';

    var $ = require('$'),
        util = require('../../common/util'),
        io = require('../../common/io'),
        helpers = require('../../common/helpers'),
        listTemplate = require('./list.handlebars');

    require('handlebars');
    require('jqPaginator');
    require('runtime');

    helpers = $.extend({}, helpers, {
        getBase: function (val) {
            var result = '';
            switch (val) {
                case '1':
                    result = '福州';
                    break;
                case '2':
                    result = '北京';
                    break;
                default :
                    result = '全部';
                    break;
            }
            return result;
        }
    });

    /**
     * 历史拍卖列表
     *
     * @class history.index
     */
    var app = {

        /**
         * 当前页
         *
         * @property pageNo
         */
        pageNo: 1,

        /**
         * 每页条数
         *
         * @property pageSize
         */
        pageSize: 5,

        /**
         * 初始化
         *
         * @method init
         */
        init: function () {
            var self = this;

            self.cacheElement();
            self.getList();
        },

        /**
         * 缓存jQuery对象
         *
         * @method cacheElements
         */
        cacheElement: function () {
            var self = this;

            self.$list = $('#J_List');
            self.$page = $('#J_Page');
            self.$none = $('#J_None');
        },

        /**
         * 获取历史拍卖列表
         *
         * @method getList
         */
        getList: function () {
            var self = this;

            io.get(util.getUrl('historyList'), {auctionState: 4, pageNo: self.pageNo, pageSize: self.pageSize}, function () {
                var result = this.data;

                if (result.totalHit > 0) {
                    var list = listTemplate(result, {helpers: helpers});
                    self.$list.html(list);
                    self.paginator(result.pageNo, result.pageSize, result.totalHit);
                } else {
                    self.$list.parent().hide();
                    self.$none.show();
                }
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
                prev: '<li><a href="javascript:;"><i class="ico-arrow ico-arrow2"></i>上一页</a></li>',
                next: '<li><a href="javascript:;">下一页<i class="ico-arrow ico-arrow3"></i></a></li>',
                last: '<li><a href="javascript:;">末页</a></li>',
                page: '<li><a href="javascript:;">{{page}}</a></li>',
                onPageChange: function (num, type) {
                    if (type === 'change' && self.pageNo != num) {
                        self.pageNo = num;
                        self.getList();
                    }
                    return false;
                }
            });
        }
    };

    app.init();
});