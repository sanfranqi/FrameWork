var common = require('../common');
var store = common.store;
var getFile = common.getFile;
module.exports = {
    "get /auction/crazy/refresh.do": function (req, res) {
        var data = [],
        	auctionBatch = 2;
		for (var i = (auctionBatch - 1) * 6; i < auctionBatch * 6; i++) {
            data.push({
                id: i,
                countDownTime: +new Date() + 1800000 + 180000,
                awardState: i === 6 ? (Math.random() > 0.5 ? '4' : '5') : '3',
                awardLeaderUserno: 'CY1234',
                awardLeaderName: '小林',
                awardLeaderDepartment: '技术中心',
                awardLeaderScore: Math.ceil(5000 * Math.random()),
                batch: 2
            });
        }

        res.send({
            "data": {
                awardForeRefreshVos: data,
                auctionId: 1,
                auctionBatch: auctionBatch,
                crazyBatchStartTime: +new Date() + 1800000,
                crazyBatchEndTime: +new Date() + 1800000 + 11 * 60 * 1000,
                nextBatchAwardNames: 'iPhone 5s，iPad， iPod nano7，土豪金，斯伯丁篮球...',
                leaderInAuction: Math.random() > 0.5
            },
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": []
        });
    },
    "get /auction/crazy/refreshAll.do": function (req, res) {
        var auctionBatchVosData = [];
        for (var i = 0; i < 10; i++) {
            var awardData = [];
            for (var j = i * 6; j < i * 6 + 6; j++) {
                var auctionState = '';
                if (j < 6) {
                    auctionState = Math.random() > 0.5 ? '4' : '5';
                } else {
                    auctionState = '3';
                }
                awardData.push({
                    id: j,
                    name: "iPhone" + j,
                    description: "iPad mini 2是ipad mini的升级版，正式名称为“配备视网膜显示屏的iPad mini”。",
                    price: 5000,
                    image: 'img.jpg',
                    countDownTime: +new Date() + 1800000 + Math.ceil(80000 * Math.random() + 100000),
                    awardState: auctionState,
                    awardLeaderUserno: j === 9 ? null : 'CY1234',
                    awardLeaderName: '小林',
                    awardLeaderDepartment: '技术中心',
                    awardLeaderScore: Math.ceil(5000 * Math.random()),
					batch: i + 1
                });
            }
            auctionBatchVosData.push({
                awardForeVos: awardData,
                auctionId: 1,
				auctionBatch: i + 1,
                crazyBatchStartTime: +new Date() + 1800000,
                crazyBatchEndTime: +new Date() + 1800000 + 100000,
                nextBatchAwardNames: 'iPhone 5s，iPad， iPod nano7，土豪金，斯伯丁篮球...'
            });
        }

        res.send({
            "data": {
                leaderInAuction: false,
				currentBatch: 2,
                auctionBatchVos: auctionBatchVosData
            },
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": []
        });
    }
};