/**
 * 我的奖品
 *
 * @module my
 */
define(function (require) {
    'use strict';

    var $ = require('$'),
        util = require('../common/util'),
        io = require('../common/io'),
        helpers = require('../common/helpers'),
        ConfirmBox = require('../common/dialog/confirmbox'),
        listTemplate = require('./list.handlebars'),
        dialogListTemplate = require('./dialogList.handlebars'),
        dialogTemplate = require('./dialog.handlebars'),
        hintTemplate = require('./hint.handlebars');

    require('handlebars');
    require('jqPaginator');
    require('runtime');

    /**
     * 我的奖品
     *
     * @class my
     */
    var app = {

        /**
         * 分页查询对象
         *
         * @property model
         */
        model: {
            userno: userno,
            awardState: 4,
            pageNo: 1,
            pageSize: 6
        },

        /**
         * 奖品详情的分页查询对象
         *
         * @property detailModel
         */
        detailModel: {
            awardId: 0,
            pageNo: 1,
            pageSize: 5
        },

        /**
         * 奖品hash
         *
         * @property awardHash
         */
        awardHash: {},

        /**
         * 初始化
         *
         * @method init
         */
        init: function () {
            var self = this;

            self.cacheElements();
            self.getList();
            self.bindEvents();
        },

        /**
         * 缓存jQuery对象
         *
         * @method cacheElements
         */
        cacheElements: function () {
            var self = this;

            self.$main = $('#J_Main');
        },

        /**
         * 获取奖品列表
         *
         * @method getList
         */
        getList: function () {
            var self = this;

            io.get(util.getUrl('myAward'), self.model, function () {
                var result = this.data,
                    currentPage = result.pageNo,
                    pageSize = result.pageSize,
                    totalCounts = result.totalHit;

                if (totalCounts > 0) {
                    var item = null;
                    self.awardHash = {};
                    for (var i = 0, j = result.listData.length; i < j; i++) {
                        item = result.listData[i];
                        self.awardHash[item.id] = item;
                    }
                    self.$main.html(listTemplate(result, {helpers: helpers}));
                    self.paginator({
                        el: '#J_Page',
                        currentPage: currentPage,
                        pageSize: pageSize,
                        totalCounts: totalCounts,
                        callback: function (num, type) {
                            if (type === 'change' && self.model.pageNo != num) {
                                self.model.pageNo = num;
                                self.getList();
                            }
                            return false;
                        }
                    });
                } else {
                    self.$main.html(hintTemplate({}));
                }
            });
        },

        /**
         * 打开详情
         *
         * @method getDetail
         * @param awardid {Number} 奖品ID
         */
        getDetail: function (awardid) {
            var self = this,
                item = self.awardHash[awardid];

            if (!item) {
                return;
            }

            var name = item.name,
                price = item.price,
                image = item.image,
                description = item.description;

            self.detailModel.awardId = awardid;
            self.detailModel.pageNo = 1;

            var cb = new ConfirmBox({
                align: {
                    selfXY: ['50%', '-65px'],
                    baseXY: ['50%', 0]
                },
                width: 658,
                zIndex: 888,
                message: dialogTemplate({name: name, price: price, image: image, description: description}, {helpers: helpers}),
                confirmTpl: '',
                cancelTpl: ''
            }).after('show', function () {
                self.getDetailList();
            }).before('hide',function () {
                var $page = $('#J_Dialog_Page');
                $page.data('jqPaginator') && $page.jqPaginator('destroy');
            }).after('hide',function () {
                cb.destroy();
            }).show();
        },

        /**
         * 奖品的竞拍详情
         *
         * @method getDetailList
         */
        getDetailList: function () {
            var self = this;

            io.get(util.getUrl('historyDetail'), self.detailModel, function () {
                var result = this.data,
                    currentPage = result.pageNo,
                    pageSize = result.pageSize,
                    totalCounts = result.totalHit,
                    dialogHtml = dialogListTemplate(result, {helpers: helpers});

                $('#J_Dialog_List').html(dialogHtml);
                self.paginator({
                    el: '#J_Dialog_Page',
                    currentPage: currentPage,
                    pageSize: pageSize,
                    totalCounts: totalCounts,
                    callback: function (num, type) {
                        if (type === 'change' && self.detailModel.pageNo != num) {
                            self.detailModel.pageNo = num;
                            self.getDetailList();
                        }
                        return false;
                    }
                });
            });
        },

        /**
         * 分页
         *
         * @method paginator
         * @param options {Object} 分页对象
         */
        paginator: function (options) {
            var $page = $(options.el);

            if (options.totalCounts <= options.pageSize) {
                $page.data('jqPaginator') && $page.jqPaginator('destroy');
                return;
            }

            $page.jqPaginator({
                totalCounts: options.totalCounts,
                pageSize: options.pageSize,
                visiblePages: 5,
                currentPage: options.currentPage,

                first: '<li><a href="javascript:;">首页</a></li>',
                prev: '<li><a href="javascript:;"><i class="ico-arrow ico-arrow2"></i>上一页</a></li>',
                next: '<li><a href="javascript:;">下一页<i class="ico-arrow ico-arrow3"></i></a></li>',
                last: '<li><a href="javascript:;">末页</a></li>',
                page: '<li><a href="javascript:;">{{page}}</a></li>',
                onPageChange:options.callback
            });
        },

        /**
         * 绑定事件
         *
         * @method bindEvents
         */
        bindEvents: function () {
            var self = this;

            self.$main.on('click', '#J_Show', function () {
                $('#J_Hint').toggle();
            });
            self.$main.on('click', '[data-role=get]', function () {
                self.getDetail($(this).closest('li').data('awardid'));
            });
        }
    };

    app.init();
});