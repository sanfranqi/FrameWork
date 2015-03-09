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
        ctrlTemplate = require('./ctrl.handlebars'),
        infoTemplate = require('./info.handlebars'),
        dialogTemplate = require('./dialog.handlebars'),
        dialogListTemplate = require('./dialogList.handlebars');

    /**
     * 当前批次
     *
     * @property auctionBatch
     */
    var auctionBatch;

    /**
     * 是否领拍
     *
     * @property leaderInAuction
     */
    var leaderInAuction;

    /**
     * 竞拍ID
     *
     * @property auctionId
     */
    var auctionId;

    /**
     * 批次结束时间
     *
     * @property crazyBatchEndTime
     */
    var crazyBatchEndTime;

    require('../../common/tictac');
    require('handlebars');
    require('runtime');
    require('jqPaginator');

    helpers = $.extend({}, helpers, {
        soonBegin: function (batch, options) {
            if (batch > auctionBatch) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        },
        isSuccess: function (awardState, options) {
            if (awardState === '4') {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        },
        isCurrent: function (batch, awardState, options) {
            if (batch === auctionBatch && awardState === '3') {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        }
    });

    /**
     * 疯狂模式
     *
     * @class auction.crazy
     */
    var app = {

        /**
         * 奖品hash
         *
         * @property awardHash
         */
        awardHash: {},

        /**
         * 当前批次的奖品hash
         *
         * @property currentAwardHash
         */
        currentAwardHash: {},

        /**
         * 竞拍详情的分页对象
         *
         * @property detailModel
         */
        detailModel: {
            awardId: 0,
            pageNo: 1,
            pageSize: 5
        },

        /**
         * 总批次数
         *
         * @property batchNum
         */
        batchNum: 0,

        /**
         * 出价之后，置灰一秒
         *
         * @property canSubmit
         */
        canSubmit: true,

        /**
         * 奖品状态
         *
         * @property AWARDSTATUS
         */
        CTRLSTATUS: {
            //流拍
            LIUPAI: 1,

            //成功
            OVER: 2,

            //积分不足
            CANNOT: 3,

            //可以拍卖
            CAN: 4,

            //已领拍，无法参与
            ISLEADER: 5,

            //已经all in
            ALLIN: 6
        },

        /**
         * 初始化
         *
         * @method init
         */
        init: function () {
            var self = this;

            self.cacheElements();
            self.initSlide();

            self.getList();
            self.initTimer();
            //延迟执行动画
            setTimeout(function () {
                self.switchSlide(auctionBatch);
            }, 500);
            self.bindEvents();
        },

        /**
         * 缓存jQuery对象
         *
         * @method cacheElements
         */
        cacheElements: function () {
            var self = this;

            self.$countDown = $('#J_CountDown');
            self.$slide = $('#J_Slide');
            self.$slideBtn = $('#J_SlideBtn');
            self.$tip = $('#J_Slide_Tip');
            self.$tipContent = $('#J_Slide_TipContent');
            self.$user = $('#J_User');
            self.$userInfo = $('#J_UserInfo');
            self.$awardNames = $('#J_NextBatchAwardNames');
        },

        /**
         * 获取拍卖信息
         *
         * @method getList
         */
        getList: function () {
            var self = this;

            //同步
            io.syncGet(util.getUrl('crazyQuery'), {}, function () {
                var result = this.data,
                    nextBatchAwardNames = '',
                    batchItem = null,
                    awardItem = null,
                    tips = '';

                auctionBatch = result.currentBatch;
                leaderInAuction = result.leaderInAuction;
                self.batchNum = result.auctionBatchVos.length;

                //填充模板
                self.$slide.html(listTemplate(result, {helpers: helpers}));

                //更新缓存hash
                self.awardHash = {};
                self.currentAwardHash = {};
                for (var i = 0, j = result.auctionBatchVos.length; i < j; i++) {
                    batchItem = result.auctionBatchVos[i];
                    //设置当前批次的信息
                    if (batchItem.auctionBatch === auctionBatch) {
                        //全局变量
                        auctionId = batchItem.auctionId;
                        crazyBatchEndTime = batchItem.crazyBatchEndTime;
                        nextBatchAwardNames = batchItem.nextBatchAwardNames;
                    }
                    for (var t = 0, s = batchItem.awardForeVos.length; t < s; t++) {
                        awardItem = batchItem.awardForeVos[t];

                        self.awardHash[awardItem.id] = awardItem;
                        if (batchItem.auctionBatch === auctionBatch) {
                            self.currentAwardHash[awardItem.id] = awardItem;

                            //刷新ctrl
                            self.refreshCtrl(awardItem.id);
                        }
                    }
                }

                tips = nextBatchAwardNames ? '下一批次物品：' + nextBatchAwardNames : '';
                self.$awardNames.text(tips).attr('title', tips);
            });
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
                interval: 2000,
                callback: function () {
                    self.refreshList();
                }
            });

            //批次计时
            Tictac.create('J_CountDown', {
                targetId: 'J_CountDown',
                expires: crazyBatchEndTime,
                format: {
                    minutes: '{mm}\'',
                    seconds: '{ss}"'
                },
                timeout: function () {
                    self.finish();
                }
            });

            //单个奖品计时
            var item = null,
                id = '',
                format = {
                    minutes: '{mm}:',
                    seconds: '{ss}'
                };
            for (var i in self.currentAwardHash) {
                if (!self.currentAwardHash.hasOwnProperty(i) || self.currentAwardHash[i].awardState !== '3') {
                    continue;
                }
                item = self.currentAwardHash[i];
                id = 'J_CountDown_' + item.id;
                Tictac.create(id, {
                    targetId: id,
                    expires: item.countDownTime,
                    formatIgnore: false,
                    format: format,
                    timeout: function () {
                        self.execute();
                    }
                });
            }
        },

        /**
         * 刷新当前批次的领拍信息
         *
         * @method refreshList
         */
        refreshList: function () {
            var self = this,
                currentAwardHash = self.currentAwardHash,
                item = null,
                tictacId = '',
                $item = null,
                $itemDialog = null,
                $itemCtrl = null,
                result = null,
                isRefreshAll = false;

            io.get(util.getUrl('crazyRefresh'), {}, function () {
                result = this.data;
                if (leaderInAuction !== result.leaderInAuction) {
                    leaderInAuction = result.leaderInAuction;
                    //领拍信息变化，刷新全部正在竞拍的物品
                    isRefreshAll = true;
                }
                for (var i = 0, j = result.awardForeRefreshVos.length; i < j; i++) {
                    item = result.awardForeRefreshVos[i];
                    tictacId = 'J_CountDown_' + item.id;
                    $item = $('#' + item.id);
                    $itemDialog = $('#J_Dialog_' + item.id);
                    $itemCtrl = $('#J_Ctrl_' + item.id);

                    if (!currentAwardHash[item.id]) {
                        return;
                    }
                    /**
                     * 以下几种情况刷新物品：
                     * 1、物品处于正在竞拍的状态，且用户领拍信息变化（更新控制区）
                     * 2、物品状态发生变化，例如由“正在竞拍”->“已结束”
                     * 3、领拍价格更新
                     */

                    if ((isRefreshAll && item.awardState === '3') ||
                        currentAwardHash[item.id].awardState !== item.awardState ||
                        currentAwardHash[item.id].awardLeaderScore !== item.awardLeaderScore) {
                        //更新hash
                        currentAwardHash[item.id] = $.extend({}, currentAwardHash[item.id], item);

                        switch (item.awardState) {
                            case '3':
                                self.animation(item.id);
                                Tictac.reset(tictacId, {expires: item.countDownTime});
                                break;
                            case '4':
                                self.animation(item.id);
                                Tictac.remove(tictacId);
                                $item.addClass('over').find('.bq-time-c').text('已结束');
                                break;
                            default :
                                Tictac.remove(tictacId);
                                $item.addClass('liupai').find('.bq-time-c').text('流拍');
                                break;
                        }

                        //更新领拍信息
                        $('.J_Info', $item).html(infoTemplate(item, {helpers: helpers}));

                        //更新控制区
                        self.refreshCtrl(item.id);

                        //刷新弹窗
                        if ($itemDialog.length > 0) {
                            self.getDetailList();
                        }
                    }
                }
            });
        },

        /**
         * 刷新奖品是否可操作
         *
         * @method refreshCtrl
         * @param id {Number} 奖品ID
         */
        refreshCtrl: function (id) {
            var self = this;
            if (!self.currentAwardHash.hasOwnProperty(id) || self.currentAwardHash[id].isOver) {
                return;
            }

            self.getAwardStatus(id);
            var item = self.currentAwardHash[id];

            if (item.oldCtrlState === item.ctrlState) {
                return;
            }

            if (item.ctrlState === self.CTRLSTATUS.OVER ||
                item.ctrlState === self.CTRLSTATUS.LIUPAI ||
                item.ctrlState === self.CTRLSTATUS.CANNOT) {
                item.isOver = true;
            }

            $('#J_Ctrl_' + id).html(ctrlTemplate({
                ctrlState: item.ctrlState,
                awardLeaderName: item.awardLeaderName,
                awardId: item.id,
                auctionId: auctionId
            }, { helpers: helpers }));
        },

        /**
         * 获取物品状态
         *
         * @method getAwardStatus
         * @param id
         */
        getAwardStatus: function (id) {
            var self = this,
                item = self.currentAwardHash[id];

            item.oldCtrlState = item.ctrlState;
            if (item.awardState === '4') {
                //成功
                item.ctrlState = self.CTRLSTATUS.OVER;
            } else if (item.awardState === '5') {
                //流拍
                item.ctrlState = self.CTRLSTATUS.LIUPAI;
            } else if (item.awardLeaderScore >= userScore) {
                //正在竞拍，积分不足
                if (leaderInAuction) {
                    //领拍
                    item.ctrlState = self.CTRLSTATUS.ALLIN;
                } else {
                    //未领拍
                    item.ctrlState = self.CTRLSTATUS.CANNOT;
                }
            } else {
                //正在竞拍，积分足
                if (leaderInAuction && item.awardLeaderUserno !== userno) {
                    item.ctrlState = self.CTRLSTATUS.ISLEADER;
                } else {
                    item.ctrlState = self.CTRLSTATUS.CAN;
                }
            }
        },

        /**
         * 奖品的详情弹窗
         *
         * @method getDetail
         * @param awardId {Number} 奖品ID
         */
        getDetail: function (awardId) {
            var self = this,
                name = self.awardHash[awardId].name,
                price = self.awardHash[awardId].price,
                image = self.awardHash[awardId].image,
                leaderScore = self.awardHash[awardId].leaderScore,
                description = self.awardHash[awardId].description;

            self.detailModel.awardId = awardId;
            self.detailModel.pageNo = 1;

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
                    image: image,
                    price: price,
                    leaderScore: leaderScore,
                    description: description,
                    score: userScore
                }, { helpers: helpers }),
                confirmTpl: '',
                cancelTpl: ''
            }).after('show',function () {
                self.getDetailList(); //获取拍卖详情列表
            }).before('hide',function () {
                var $page = $('#J_Dialog_Page');
                $page.data('jqPaginator') && $page.jqPaginator('destroy'); //destroy分页
            }).after('hide',function () {
                cb.destroy(); //destroy弹窗
            }).show();
        },

        /**
         * 获取奖品的拍卖记录
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
                self.paginator(currentPage, pageSize, totalCounts);
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
                $page = $('#J_Dialog_Page');

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
                    if (type === 'change' && self.detailModel.pageNo != num) {
                        self.detailModel.pageNo = num;
                        self.getDetailList();
                    }
                    return false;
                }
            });
        },

        /**
         * 执行动画，闪烁
         *
         * @method animation
         * @param id {Number} 奖品ID
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
         * 立即执行Tictac的定时操作
         *
         * @mehtod execute
         */
        execute: function () {
            Tictac.execute();
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
         * 初始化切换
         *
         * @method initSlide
         */
        initSlide: function () {
            var self = this;

            self.$slideBtn.off();
            self.$slideBtn.on('mouseover', 'a',function () {
                var $t = $(this),
                    type = $t.data('role'),
                    top = ($t.index() * 55) + 'px';

                switch (type) {
                    case 'prev':
                        self.$tipContent.text('上一批次');
                        break;
                    case 'now':
                        self.$tipContent.text('正在竞拍');
                        break;
                    case 'next':
                        self.$tipContent.text('下一批次');
                        break;
                }
                self.$tip.css('top', top);
                self.$tip.show();
            }).on('mouseout', 'a',function () {
                self.$tip.hide();
            }).on('click', 'a', function () {
                self.switchSlide($(this).data('index'));
            });
        },

        /**
         * 执行切换
         *
         * @method switchSlide
         * @param index
         */
        switchSlide: function (index) {
            var self = this,
                HEIGHT = 806,
                DEFAULTTOP = 20,
                $prev = self.$slideBtn.find('[data-role=prev]'),
                $next = self.$slideBtn.find('[data-role=next]'),
                $now = self.$slideBtn.find('[data-role=now]');

            self.$slide.animate({top: DEFAULTTOP - (index - 1) * HEIGHT + 'px'});

            index === 1 ? $prev.css('visibility', 'hidden') :
                $prev.css('visibility', 'visible').data('index', index - 1);
            index === self.batchNum ? $next.css('visibility', 'hidden') :
                $next.css('visibility', 'visible').data('index', index + 1);

            $now.data('index', auctionBatch);
        },

        /**
         * 出价
         *
         * @method auction
         * @param data {Object} 表单对象
         */
        auction: function (data) {
            var self = this;

            //出价之后置灰一秒
            self.canSubmit = false;
            $('.J_Save').prop('disabled', true);
            $('.J_AllIn').prop('disabled', true);
            setTimeout(function () {
                self.canSubmit = true;
                $('.J_Input').trigger('change');
                $('.J_AllIn').prop('disabled', false);
            }, 1200);

            io.post(util.getUrl('auction'), data, function () {
                self.execute();
            });
        },

        /**
         * 当前批次结束
         *
         * @method finish
         */
        finish: function () {
            var self = this;
            Tictac.destroy();
            if (auctionBatch < self.batchNum) {
                var cb = new ConfirmBox({
                    message: '<p style="text-align: center;">正在进入下一批次......</p>',
                    width: '300px',
                    effect: 'fade',
                    confirmTpl: '',
                    cancelTpl: '',
                    closeTpl: ''
                }).after('show',function(){
                    window.setTimeout(function () {
                        cb.hide();
                    }, 2000);
                }).after('hide',function(){
                    cb.destroy();
                    self.getList();
                    self.initTimer();
                    self.switchSlide(auctionBatch);
                }).show();
            } else {
                new ConfirmBox({
                    message: '<p style="text-align: center;">竞拍结束，结果统计中......</p>',
                    width: '300px',
                    effect: 'fade',
                    confirmTpl: '',
                    cancelTpl: '',
                    closeTpl: ''
                }).after('show',function(){
                    window.setTimeout(function () {
                        window.location.href = '/history/detail/' + auctionId + '.htm';
                    }, 5000);
                }).show();
            }
        },

        /**
         * 绑定事件
         *
         * @method bindEvents
         */
        bindEvents: function () {
            var self = this;

            //个人信息
            self.$user.on('click', function () {
                var right = ($(window).innerWidth() - 1000) / 2;
                if (right > 260) {
                    self.$userInfo.css('right', right - 260 + 'px');
                } else {
                    self.$userInfo.css('right', right + 'px');
                }
                self.$user.children('i').toggleClass('ico-reduce');
                self.$userInfo.toggle();
            });

            //出价相关操作
            //-------
            self.$slide.on('change', '.J_Input', function () {
                var $input = $(this),
                    $form = $input.closest('form'),
                    $saveBtn = $('.J_Save', $form),
                    awardId = $form.data('awardid'),
                    value = $.trim($input.val());

                if (/^\d+$/g.test(value) &&
                    +value <= userScore &&
                    +value > self.currentAwardHash[awardId].awardLeaderScore &&
                    self.canSubmit) {
                    $saveBtn.prop('disabled', false);
                } else {
                    $saveBtn.prop('disabled', true);
                }
            });

            self.$slide.on('keyup', '.J_Input', function (e) {
                var $input = $(this),
                    $saveBtn = $input.closest('form').find('.J_Save');

                $input.trigger('change');

                //响应回车事件
                var currKey = e.keyCode || e.which || e.charCode;
                if (currKey === 13 && !$saveBtn.prop('disabled')) {
                    $saveBtn.trigger('click');
                }
            });

            self.$slide.on('click', '.J_Save', function () {
                if (!self.canSubmit) {
                    return;
                }
                var $form = $(this).closest('form'),
                    $input = $form.find('.J_Input'),
                    data = util.packForm($form);

                $input.val('');
                self.auction(data);
            });

            self.$slide.on('click', '.J_AllIn', function () {
                var data = util.packForm($(this).prev('form'));

                data.score = userScore;
                self.auction(data);
            });

            //竞拍详情
            self.$slide.on('click', '[data-role=get]', function () {
                self.getDetail($(this).closest('li').data('awardid'));
            });
        }
    };

    app.init();
});