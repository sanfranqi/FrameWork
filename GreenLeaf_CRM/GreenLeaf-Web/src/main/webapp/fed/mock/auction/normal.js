var common = require('../common');
var store = common.store;
var getFile = common.getFile;
module.exports = {
    //获取所有奖品列表
    "get /award/queryAwardNormalState.do": function (req, res) {
        var data = [];
        for (var i = 0; i < 30; i++) {
            data.push({
                "name": "iPhone" + i,
                "id": i,
                "description": "iPad mini 2是ipad mini的升级版，正式名称为“配备视网膜显示屏的iPad mini”。",
                "createTime": 1399866263820,
                "sort": 8,
                "createUserno": "CY6733",
                "deleteFlag": false,
                "auctionId": 18,
                "awardState": "2",
                "batch": 2,
                "price": 1003,
                "updateTime": 1399879767728,
                "image": "img.jpg",
                "userNo": null,
                "winTime": null,
                "winScore": null,
                "updateUserNo": "CY6033",
                "leaderUserno": i % 5 === 0 ? null : "CY6734",
                "leaderScore": i % 5 === 0 ? null : Math.ceil(5000 * Math.random()),
                "leaderName": "小王",
                "leaderDepartment": "技术中心",
                "focusNum": i * 100,
                "focusId": i % 4 === 0 ? 4 : 0
            });
        }
        res.send({
            "data": data,
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": []
        });
    },
    //刷新所有奖品
    "get /awardLeader/queryAwardLeaderByAuction.do": function (req, res) {
        var data = [];
        for (var i = 0; i < 30; i++) {
            data.push({
                "id": i,
                "leaderScore": Math.ceil(5000 * Math.random()),
                "leaderName": "小王",
                "leaderDepartment": "技术中心"
            });
        }
        res.send({
            "data": data,
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": []
        });
    },
    //我能竞拍的奖品列表
    "get /award/queryAwardAble.do": function (req, res) {
        var data = [];
        for (var i = 0; i < 10; i++) {
            data.push({
                "name": "iPhone" + i,
                "id": i,
                "description": "iPad mini 2是ipad mini的升级版，正式名称为“配备视网膜显示屏的iPad mini”。",
                "createTime": 1399866263820,
                "sort": 8,
                "createUserno": "CY6733",
                "deleteFlag": false,
                "auctionId": 18,
                "awardState": "2",
                "batch": 2,
                "price": 1003,
                "updateTime": 1399879767728,
                "image": "img.jpg",
                "userNo": null,
                "winTime": null,
                "winScore": null,
                "updateUserNo": "CY6033",
                "leaderUserno": i % 5 === 0 ? null : "CY6734",
                "leaderScore": Math.ceil(5000 * Math.random()),
                "leaderName": "小王",
                "leaderDepartment": "技术中心",
                "focusNum": i * 100,
                "focusId": 4
            });
        }
        res.send({
            "data": data,
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": []
        });
    },
    //刷新我能竞拍的奖品
    "get /awardLeader/getMyLeaderInfoList.do": function (req, res) {
        var data = [];
        for (var i = 0; i < 10; i++) {
            data.push({
                "id": i,
                "leaderScore": Math.ceil(5000 * Math.random()),
                "leaderName": "小王",
                "leaderDepartment": "技术中心"
            });
        }
        res.send({
            "data": data,
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": []
        });
    },
    //获取关注奖品列表
    "get /award/queryFocusAward.do": function (req, res) {
        var data = [];
        for (var i = 0; i < 10; i++) {
            data.push({
                "name": "iPhone" + i,
                "id": i,
                "description": "iPad mini 2是ipad mini的升级版，正式名称为“配备视网膜显示屏的iPad mini”。",
                "createTime": 1399866263820,
                "sort": 8,
                "createUserno": "CY6733",
                "deleteFlag": false,
                "auctionId": 18,
                "awardState": "2",
                "batch": 2,
                "price": 1003,
                "updateTime": 1399879767728,
                "image": "img.jpg",
                "userNo": null,
                "winTime": null,
                "winScore": null,
                "updateUserNo": "CY6033",
                "leaderUserno": i % 5 === 0 ? null : "CY6734",
                "leaderScore": Math.ceil(5000 * Math.random()),
                "leaderName": "小王",
                "leaderDepartment": "技术中心",
                "focusNum": i * 100,
                "focusId": 4
            });
        }
        res.send({
            "data": Math.random() > 0.5 ? [] : data,
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": []
        });
    },
    //刷新我关注的奖品
    "get /awardLeader/getFocusLeaderInfoList.do": function (req, res) {
        var data = [];
        for (var i = 0; i < 10; i++) {
            data.push({
                "id": i,
                "leaderScore": Math.ceil(5000 * Math.random()),
                "leaderName": "小王",
                "leaderDepartment": "技术中心"
            });
        }
        res.send({
            "data": data,
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": []
        });
    },
    //关注
    "post /awardFocus/add.do": function (req, res) {
        res.send({
            "data": null,
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": []
        });
    },
    //取消关注
    "post /awardFocus/delete.do": function (req, res) {
        res.send({
            "data": null,
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": []
        });
    },
    //出价竞拍
    "post /auctionrecord/bidAward.do": function (req, res) {
        res.send({
            "data": null,
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": []
        });
    },
    //获取可用积分、判断能否竞拍奖品
    "get /auctionRecord/currentScore.do": function (req, res) {
        res.send({
            "data": {
                "score": 9999,
                "isOK": true,
                "isLeader": true
            },
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": []
        });
    }
};