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
        ConfirmBox = require('../../common/dialog/confirmbox'),
        helpers = require('../../common/helpers'),
        dialogTemplate = require('./dialog.handlebars'),
        listTemplate = require('./list.handlebars');

    require('handlebars');
    require('runtime');
    require('jqPaginator');

    /**
     * 历史拍卖详情
     *
     * @class history.detail
     */
    var app = {

        /**
         * 分页对象
         *
         * @property model
         */
        model: {
            awardId: 0,
            pageNo: 1,
            pageSize: 5
        },

        /**
         * 初始化
         *
         * @method init
         */
        init: function () {
            var self = this;

            self.cacheElement();
            self.bindEvents();
        },

        /**
         * 缓存jQuery对象
         *
         * @method cacheElements
         */
        cacheElement: function () {
            var self = this;

            self.$list = $('#J_List');
        },

        /**
         * 参看详情
         *
         * @method get
         * @param $element
         */
        get: function ($element) {
            var self = this,
                name = $element.data('name'),
                price = $element.data('price'),
                description = $element.data('description'),
                image = $element.data('image');

            self.model.awardId = $element.data('id');
            self.model.pageNo = 1;

            var cb = new ConfirmBox({
                align: {
                    selfXY: ['50%', '-65px'],
                    baseXY: ['50%', 0]
                },
                width: 658,
                zIndex: 888,
                message: dialogTemplate({name: name, image: image, price: price, description: description}, {helpers: helpers}),
                confirmTpl: '',
                cancelTpl: ''
            }).after('show', function () {
                self.getList();
            }).after('hide',function () {
                cb.destroy();
            }).show();
        },

        /**
         * 竞拍详情列表
         *
         * @method getList
         */
        getList: function () {
            var self = this;

            io.get(util.getUrl('historyDetail'), self.model, function () {
                var result = this.data,
                    dialogHtml = listTemplate(result, {helpers: helpers});

                $('#J_Dialog_List').html(dialogHtml);
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
            var self = this,
                $page = $('#J_Page');

            if (totalCounts <= pageSize) {
                $page.data('jqPaginator') && $page.jqPaginator('destroy');
                return;
            }

            $page.jqPaginator({
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
         * 事件绑定
         *
         * @method bindEvents
         */
        bindEvents: function () {
            var self = this;

            self.$list.on('click', '[data-role=get]', function () {
                self.get($(this).closest('li'));
            });
        }
    };

    app.init();
});