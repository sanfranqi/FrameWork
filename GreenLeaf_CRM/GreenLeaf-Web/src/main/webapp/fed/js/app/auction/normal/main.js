/**
 * 拍卖
 *
 * @module auction
 */
define(function (require) {
    'use strict';

    var $ = require('$'),
        util = require('../../common/util'),
        io = require('../../common/io'),
        helpers = require('../../common/helpers'),
        ConfirmBox = require('../../common/dialog/confirmbox'),
        listTemplate = require('./list.handlebars'),
        infoTemplate = require('./info.handlebars'),
        dialogTemplate = require('./dialog.handlebars'),
        dialogCtrlTemplate = require('./dialogCtrl.handlebars'),
        dialogListTemplate = require('./dialogList.handlebars');

    require('../../common/tictac');
    require('handlebars');
    require('runtime');
    require('jqPaginator');

    /**
     * 普通模式
     *
     * @class auction.normal
     */
    var app = {

        /**
         * 竞拍详情的分页对象
         *
         * @property detailModel
         */
        detailModel: {
            pageNo: 1,
            pageSize: 5
        },

        /**
         * 用户积分
         *
         * @property userScore
         */
        userScore: 0,

        /**
         * 奖品hash
         *
         * @property awardHash
         */
        awardHash: {},

        /**
         * tab类型
         *
         * @property type
         */
        type: 'all',

        /**
         * 获取全部奖品的接口地址
         *
         * @property url
         */
        url: util.getUrl('normalQueryAll'),

        /**
         * 刷新奖品领拍信息的接口地址
         *
         * @property refreshUrl
         */
        refreshUrl: util.getUrl('normalQueryAllRefresh'),

        /**
         * 出价之后，置灰一秒
         *
         * @property canSubmit
         */
        canSubmit: true,

        /**
         * 初始化
         *
         * @method init
         */
        init: function () {
            var self = this;

            self.initTimer();
            self.cacheElements();
            self.getList();
            self.bindEvents();
        },

        /**
         * 初始化倒计时
         *
         * @method initTimer
         */
        initTimer: function () {
            var self = this;

            Tictac.init({
                currentTime: self.proofTime(),
                interval: 10000,
                callback: function () {
                    self.refreshList();
                }
            });

            Tictac.create('J_CountDown', {
                targetId: 'J_CountDown',
                expires: auctionTime,
                format: {
                    days: ' <span class="num">{d}</span> 天',
                    hours: ' <span class="num">{h}</span> 小时',
                    minutes: ' <span class="num">{mm}</span> 分',
                    seconds: ' <span class="num">{ss}</span> 秒'
                },
                timeout: function () {
                    self.goToCrazy();
                }
            });
        },

        /**
         * 获取服务器时间
         *
         * @mehtod proofTime
         * @returns {number} 服务当前时间的时间戳
         */
        proofTime: function () {
            var timestamp = 0,
                localTime1 = +new Date(),
                localTime2 = 0;

            io.syncGet(util.getUrl('systemTime'), {}, function () {
                localTime2 = +new Date();
                timestamp = this.data + (localTime2 - localTime1) / 2;
            });

            return timestamp;
        },

        /**
         * 缓存jQuery对象
         *
         * @method cacheElements
         */
        cacheElements: function () {
            var self = this;

            self.$countDown = $('#J_CountDown');
            self.$refresh = $('#J_Refresh');
            self.$list = $('#J_List');
            self.$tabs = $('#J_AuctionTabs');
        },

        /**
         * 立即执行Tictac的定时操作
         *
         * @mehtod execute
         */
        execute: function () {
            Tictac.execute();
        },

        /**
         * 获取奖品列表
         *
         * @method getList
         */
        getList: function () {
            var self = this;

            io.get(self.url, {auctionId: auctionId}, function () {
                var html = listTemplate(this.data, {helpers: helpers});
                self.$list.html(html);

                //更新缓存hash
                self.awardHash = {};
                for (var i = 0, j = this.data.length; i < j; i++) {
                    self.awardHash[this.data[i].id] = this.data[i];
                }
            });
        },

        /**
         * 刷新奖品的领拍者信息
         *
         * @method refreshList
         */
        refreshList: function () {
            var self = this,
                awardHash = self.awardHash,
                item = null,
                $item = null,
                $dialogItem = null;

            io.get(self.refreshUrl, {auctionId: auctionId}, function () {
                for (var i = 0, j = this.data.length; i < j; i++) {
                    item = this.data[i];
                    $item = $('#' + item.id);
                    $dialogItem = $('#J_dialog_' + item.id);

                    if (!awardHash[item.id]) {
                        return;
                    }
                    if (awardHash[item.id].leaderScore !== item.leaderScore) {
                        //更新hash
                        awardHash[item.id] = $.extend({}, awardHash[item.id], item);

                        //执行动画
                        self.animation(item.id);

                        //更新列表项
                        $('.J_Info', $item).html(infoTemplate(item));

                        //刷新弹窗
                        if ($dialogItem.length > 0) {
                            $('#J_Dialog_Input').trigger('change');
                            //领拍积分高于用户积分，禁用
                            item.leaderScore > self.userScore && self.refreshDialogCtrl(item.id, item.leaderScore);
                            self.getDetailList();
                        }
                    }
                }
            });
        },

        /**
         * 刷新弹窗内，奖品是否可以出价
         *
         * @method refreshDialogCtrl
         * @param awardId {Number} 奖品ID
         * @param leaderScore {Number} 领拍积分
         * @param isOK {Boolean} 是否可以出价
         * @param isLeader {Boolean} 是否领拍
         */
        refreshDialogCtrl: function (awardId, leaderScore, isOK, isLeader) {
            $('#J_dialog_' + awardId).html(dialogCtrlTemplate({
                awardId: awardId,
                auctionId: auctionId,
                leaderScore: leaderScore,
                score: this.userScore,
                isOK: isOK,
                isLeader: isLeader
            }, {helpers: helpers}));
        },

        /**
         * 执行动画
         *
         * @method animation
         * @param id
         */
        animation: function (id) {
            var $item = $('#' + id),
                i = 1,
                timer = null;

            timer = setInterval(function () {
                if (i === 4) {
                    clearInterval(timer);
                    timer = null;
                }
                i % 2 !== 0 ? $item.addClass('goods-refresh') : $item.removeClass('goods-refresh');
                i++;
            }, 180);
        },

        /**
         * 切换标签页
         *
         * @method onSwitch
         * @param type
         */
        onSwitch: function (type) {
            var self = this;
            switch (type) {
                case 'able':
                    self.type = 'able';
                    self.url = util.getUrl('normalQueryAble');
                    self.refreshUrl = util.getUrl('normalQueryAbleRefresh');
                    break;
                case 'follow':
                    self.type = 'follow';
                    self.url = util.getUrl('normalQueryFollow');
                    self.refreshUrl = util.getUrl('normalQueryFollowRefresh');
                    break;
                default :
                    self.type = 'all';
                    self.url = util.getUrl('normalQueryAll');
                    self.refreshUrl = util.getUrl('normalQueryAllRefresh');
                    break;
            }
            self.getList();
        },

        /**
         * 奖品详情弹窗
         *
         * @method getDetail
         * @param awardId {Number} 奖品ID
         */
        getDetail: function (awardId) {
            var self = this,
                isOK = false,
                isLeader = false;

            if(!self.awardHash[awardId]){
                return;
            }

            var name = self.awardHash[awardId].name,
                price = self.awardHash[awardId].price,
                image = self.awardHash[awardId].image,
                leaderScore = self.awardHash[awardId].leaderScore,
                description = self.awardHash[awardId].description;

            self.detailModel.awardId = awardId;
            self.detailModel.pageNo = 1;

            io.get(util.getUrl('queryMyScore'), {auctionId: auctionId, awardId: awardId}, function () {
                //更新用户可用积分
                self.userScore = this.data.score;
                isOK = this.data.isOK;
                isLeader = this.data.isLeader;

                var cb = new ConfirmBox({
                    align: {
                        selfXY: ['50%', '-65px'],
                        baseXY: ['50%', 0]
                    },
                    width: 658,
                    zIndex: 888,
                    message: dialogTemplate({
                        awardId: awardId,
                        name: name,
                        price: price,
                        image: image,
                        leaderScore: leaderScore,
                        description: description,
                        score: self.userScore
                    }, { helpers: helpers }),
                    confirmTpl: '',
                    cancelTpl: ''
                }).after('show',function () {
                    self.refreshDialogCtrl(awardId, leaderScore, isOK, isLeader);
                    self.bindInputEvevt(awardId); //绑定事件
                    self.getDetailList(); //获取拍卖详情列表
                }).before('hide',function () {
                    self.removeInputEvent(); //移除事件
                    var $page = $('#J_Dialog_Page');
                    $page.data('jqPaginator') && $page.jqPaginator('destroy'); //destroy分页
                }).after('hide',function () {
                    cb.destroy(); //destroy弹窗
                }).show();
            });
        },

        /**
         * 绑定弹窗的input事件
         *
         * @method bindInputEvevt
         * @param awardId {Number} 奖品ID
         */
        bindInputEvevt: function (awardId) {
            var self = this,
                $input = $('#J_Dialog_Input'),
                $saveBtn = $('#J_Dialog_Save'),
                $allinBtn = $('#J_Dialog_Allin');

            //自定义change事件
            $input.on('change', function () {
                var value = $input.val();

                if (/^\d+$/g.test(value) &&
                    +value <= self.userScore &&
                    +value > self.awardHash[awardId].leaderScore &&
                    self.canSubmit) {
                    $saveBtn.prop('disabled', false);
                } else {
                    $saveBtn.prop('disabled', true);
                }
            });

            $input.on('keyup', function (e) {
                $input.trigger('change');
                //响应回车事件
                var currKey = e.keyCode || e.which || e.charCode;
                if (currKey === 13 && !$saveBtn.prop('disabled')) {
                    $saveBtn.trigger('click');
                }
            });

            $allinBtn.on('click', function () {
                $input.val(self.userScore);
                $input.trigger('change');
            });

            $saveBtn.on('click', function () {
                var data = util.packForm('#J_Form');
                //self.userScore -= data.score;

                //出价之后，置灰一秒
                self.canSubmit = false;
                setTimeout(function () {
                    self.canSubmit = true;
                    $input.trigger('change');
                }, 1000);

                io.post(util.getUrl('auction'), data, function () {
                    $input.val('');
                    //修改领拍价格
                    self.awardHash[awardId].leaderScore = data.score;
                    //$('#J_Score').text(self.userScore);
                    //self.refreshDialogCtrl(awardId, data.score);

                    $input.trigger('change');

                    self.getDetailList();

                    if (self.type === 'able') {
                        self.getList();
                    } else {
                        self.execute();
                    }
                });
            });
        },

        /**
         * 移除弹窗内的input绑定
         *
         * @method removeInputEvent
         */
        removeInputEvent: function () {
            $('#J_Dialog_Input').off();
            $('#J_Dialog_Save').off();
            $('#J_Dialog_Allin').off();
        },

        /**
         * 获取竞拍详情列表
         *
         * @method getDetailList
         */
        getDetailList: function () {
            var self = this;

            io.get(util.getUrl('historyDetail'), self.detailModel, function () {
                var result = this.data,
                    currentPage = this.data.pageNo,
                    pageSize = this.data.pageSize,
                    totalCounts = this.data.totalHit,
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
                onPageChange: options.callback
            });
        },

        /**
         * 关注奖品
         *
         * @method follow
         * @param id {Number} 奖品ID
         */
        follow: function (id) {
            io.post(util.getUrl('normalFollow'), {awardId: id, auctionId: auctionId}, function () {
            });
        },

        /**
         * 取消奖品关注
         *
         * @method unfollow
         * @param id {Number} 奖品ID
         */
        unfollow: function (id) {
            var self = this;
            io.post(util.getUrl('normalUnfollow'), {awardId: id, auctionId: auctionId}, function () {
                if (self.type === 'follow') {
                    self.getList();
                }
            });
        },

        /**
         * 跳转到疯狂模式
         *
         * @method goToCrazy
         */
        goToCrazy: function () {
            new ConfirmBox({
                message: '<p style="text-align: center;">普通模式已结束，正在切换竞拍模式......</p>',
                width: '300px',
                effect: 'fade',
                confirmTpl: '',
                cancelTpl: '',
                closeTpl: ''
            }).after('show',function(){
                window.setTimeout(function () {
                    window.location.reload();
                }, 3000);
            }).show();
        },

        /**
         * 事件绑定
         *
         * @method bindEvents
         */
        bindEvents: function () {
            var self = this;

            self.$refresh.on('click', self.execute);

            self.$tabs.on('click', 'li', function () {
                var $t = $(this);
                if ($t.hasClass('active')) {
                    return;
                }
                //切换active状态
                $t.siblings('li').removeClass('active');
                $t.addClass('active');

                self.onSwitch($t.data('role'));
            });

            self.$list.on('click', '[data-role=follow]', function () {
                var $t = $(this),
                    action = $t.data('action'),
                    id = $t.closest('li').data('awardid');

                $t.siblings('[data-role=follow]').show();
                $t.hide();

                action === 'on' ? self.follow(id) : self.unfollow(id);
            });

            self.$list.on('click', '[data-role=get]', function () {
                self.getDetail($(this).closest('li').data('awardid'));
            });
        }
    };

    app.init();
});