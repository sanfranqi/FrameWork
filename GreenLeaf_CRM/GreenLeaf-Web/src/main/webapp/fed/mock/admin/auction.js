var common = require('../common');
var store = common.store;
var getFile = common.getFile;
module.exports = {
    "post /auction/query.do": function (req, res) {
        var pageNo = +req.param('pageNo'),
            pageSize = +req.param('pageSize');

        res.send({
            "data": {
                "pageNo": pageNo,
                "pageSize": pageSize,
                "totalHit": 300,
                "listData": [
                    {
                        "id": 9,
                        "startTime": +new Date() + 1000000,
                        "endTime": 1499990181000,
                        "createTime": 1399860364017,
                        "auctionTime": 1499990181000,
                        "title": "端午节拍卖活动" + Math.random(),
                        "auctionState": "1",
                        "base": "3",
                        "createUserno": "CY6734",
                        "deleteFlag": false,
                        "details": "端午节拍卖活动有好多好多的礼品端午节拍卖活动有好多好多的礼品端午节拍卖活动有好多好多的礼品端午节拍卖活动有好多好多的礼品端午节拍卖活动有好多好多的礼品",
                        "updateTime": 1399860364017,
                        "updateUserNo": "CY6734",
                        "createUsername": "林浩",
                        "awardCount": 50,
                        "auctioningBatch": null,
                        "auctioningBatchEndTime": null,
                        "auctionTotalBatch": null
                    },
                    {
                        "id": 10,
                        "startTime": +new Date() + 1200000,
                        "endTime": 1499990181000,
                        "createTime": 1399860364017,
                        "auctionTime": 1499990181000,
                        "title": "端午节拍卖活动" + Math.random(),
                        "auctionState": "1",
                        "base": "3",
                        "createUserno": "CY6734",
                        "deleteFlag": false,
                        "details": "端午节拍卖活动有好多好多的礼品端午节拍卖活动有好多好多的礼品端午节拍卖活动有好多好多的礼品端午节拍卖活动有好多好多的礼品端午节拍卖活动有好多好多的礼品",
                        "updateTime": 1399860364017,
                        "updateUserNo": "CY6734",
                        "createUsername": "林浩",
                        "awardCount": 50,
                        "auctioningBatch": null,
                        "auctioningBatchEndTime": null,
                        "auctionTotalBatch": null
                    },
                    {
                        "id": 10,
                        "startTime": +new Date(),
                        "endTime": 1499990181000,
                        "createTime": 1399860364017,
                        "auctionTime": 1499990181000,
                        "title": "端午节拍卖活动" + Math.random(),
                        "auctionState": "1",
                        "base": "3",
                        "createUserno": "CY6734",
                        "deleteFlag": false,
                        "details": "端午节拍卖活动有好多好多的礼品",
                        "updateTime": 1399860364017,
                        "createUsername": "林浩1",
                        "updateUserNo": "CY6734",
                        "awardCount": 50,
                        "auctioningBatch": null,
                        "auctioningBatchEndTime": null,
                        "auctionTotalBatch": null
                    },
                    {
                        "id": 10,
                        "startTime": 1499960181000,
                        "endTime": 1499990181000,
                        "createTime": 1399860364017,
                        "auctionTime": 1499990181000,
                        "title": "端午节拍卖活动",
                        "auctionState": "3",
                        "base": "3",
                        "createUserno": "CY6734",
                        "deleteFlag": false,
                        "createUsername": "林浩2",
                        "details": "端午节拍卖活动有好多好多的礼品",
                        "updateTime": 1399860364017,
                        "updateUserNo": "CY6734",
                        "awardCount": 60,
                        "auctioningBatch": null,
                        "auctioningBatchEndTime": null,
                        "auctionTotalBatch": null
                    },
                    {
                        "id": 10,
                        "startTime": 1499960181000,
                        "endTime": 1499990181000,
                        "createTime": 1399860364017,
                        "auctionTime": 1499990181000,
                        "title": "端午节拍卖活动",
                        "auctionState": "4",
                        "base": "3",
                        "createUserno": "CY6734",
                        "deleteFlag": false,
                        "details": "端午节拍卖活动有好多好多的礼品",
                        "updateTime": 1399860364017,
                        "createUsername": "林浩3",
                        "updateUserNo": "CY6734",
                        "awardCount": 10,
                        "auctioningBatch": null,
                        "auctioningBatchEndTime": null,
                        "auctionTotalBatch": null
                    }
                ]
            },
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": []
        });
    },
    "post /auction/delete.do": function (req, res) {
        res.send({
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": [],
            "data": null
        });
    },
    "post /auction/add.do": function (req, res) {
        res.send({
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": [],
            "data": null
        });
    },
    "post /auction/update.do": function (req, res) {
        res.send({
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": [],
            "data": null
        });
    },
    "get /auction/get.do": function (req, res) {
        res.send({
            "data": {
                "id": 10,
                "startTime": +new Date() + 1000000,
                "endTime": 1499990181000,
                "createTime": 1399860364017,
                "auctionTime": 1499990181000,
                "title": "端午节拍卖活动" + Math.random(),
                "auctionState": "1",
                "base": "3",
                "createUserno": "CY6734",
                "deleteFlag": false,
                "details": "端午节拍卖活动有好多好多的礼品端午节拍卖活动有好多好多的礼品端午节拍卖活动有好多好多的礼品端午节拍卖活动有好多好多的礼品端午节拍卖活动有好多好多的礼品",
                "updateTime": 1399860364017,
                "updateUserNo": "CY6734",
                "createUsername": "林浩",
                "awardCount": 50,
                "auctioningBatch": null,
                "auctioningBatchEndTime": null,
                "auctionTotalBatch": null
            },
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": []
        });
    },
    'post /award/add.do': function (req, res) {
        res.send({
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": [],
            "data": [128, 129]
        });
    },
    'post /award/update.do': function (req, res) {
        res.send({
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": [],
            "data": [128, 129]
        });
    },
    'post /award/delete.do': function (req, res) {
        res.send({
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": [],
            "data": null
        });
    },
    'get /award/get.do': function (req, res) {
        res.send({
            "data": {
                "name": "iPhone1",
                "id": 12,
                "description": "iPhone1代",
                "createTime": 1399866253309,
                "sort": 7,
                "batch": 2,
                "createUserno": "CY6734",
                "updateUserNo": "CY6734",
                "deleteFlag": false,
                "auctionId": 18,
                "userno": "CY6034",
                "awardState": "1",
                "leaderUserno": null,
                "leaderScore": null,
                "price": 1000,
                "updateTime": 1399866253309,
                "image": 'img.jpg',
                "winTime": null,
                "winScore": null,
                "leaderName": null,
                "leaderDepartment": null,
                "focusNum": null,
                "focusId": null,
                "auctionName": null
            },
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": []
        });
    },
    'post /award/uploadImage.do': function (req, res) {
        res.send({
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": [],
            "data": "img.jpg"
        });
    },
    'post /award/addByFile.do': function (req, res) {
        res.send({
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": [],
            "data": [136, 137, 138]
        });
    },
    'post /award/sort.do': function (req, res) {
        res.send({
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": [],
            "data": null
        });
    },
    'get /award/queryAwardResult.do': function (req, res) {
        var data = [];
        for (var i = 0; i < 40; i++) {
            data.push({
                "name": "iPhone"+i,
                "id": i,
                "description": "iPhone1代",
                "createTime": 1401093319526,
                "sort": 7,
                "batch": 2,
                "createUserno": "CY6734",
                "updateUserNo": "CY6734",
                "deleteFlag": false,
                "auctionId": 18,
                "userno": "CY6034",
                "awardState": "1",
                "leaderUserno": null,
                "leaderScore": null,
                "price": 1000,
                "updateTime": 1399866253309,
                "image": 'img.jpg',
                "winTime": null,
                "winScore": null,
                "leaderName": null,
                "leaderDepartment": null,
                "focusNum": null,
                "focusId": null,
                "auctionName": null
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
    'get /award/queryAwardResult.do': function (req, res) {
        var data = [];
        for (var i = 0; i < 40; i++) {
            data.push({
                "name": "iPhone"+i,
                "id": 1,
                "description": "iPhone1代",
                "createTime": 1399866253309,
                "sort": 7,
                "batch": 2,
                "createUserno": "CY6734",
                "updateUserNo": "CY6734",
                "deleteFlag": false,
                "auctionId": 18,
                "userno": "CY6034",
                "awardState": "1",
                "leaderUserno": null,
                "leaderScore": null,
                "price": 1000,
                "updateTime": 1399866253309,
                "image": 'img.jpg',
                "winTime": null,
                "winScore": null,
                "leaderName": "小辉",
                "leaderDepartment": null,
                "focusNum": null,
                "focusId": null,
                "auctionName": null
            });
        }
        res.send({
            "data": data,
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": []
        });
    }
};