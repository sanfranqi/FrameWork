var common = require('../common');
var store = common.store;
var getFile = common.getFile;
module.exports = {
    "get /score/query.do": function (req, res) {
        var userno = req.param('userno'),
            pageNo = +req.param('pageNo'),
            pageSize = +req.param('pageSize');

        res.send({
            "data": {
                "pageNo": pageNo,
                "pageSize": pageSize,
                "totalHit": userno === "" ? 300 : 0,
                "listData": userno === "" ? [
                    {
                        "name": "齐善锋",
                        "position": "JAVA开发工程师",
                        "score": 0,
                        "userno": "CY6033",
                        "department": "技术中心",
                        "totalScore": 1200,
                        "usedScore": 100,
                        "avatar": null,
                        "gender": "1"
                    },
                    {
                        "name": "小辉",
                        "position": "JAVA开发工程师",
                        "score": 120,
                        "userno": "CY1111",
                        "department": "技术中心",
                        "totalScore": 220,
                        "usedScore": 100,
                        "avatar": null,
                        "gender": "1"
                    },
                    {
                        "name": "林浩",
                        "position": "JAVA开发工程师",
                        "score": 115,
                        "userno": "CY6734",
                        "department": "技术中心",
                        "totalScore": 215,
                        "usedScore": 100,
                        "avatar": null,
                        "gender": "1"
                    }
                ] : []
            },
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": []
        });
    },
    "post /score/increase.do": function (req, res) {
        res.send({
            "data": null,
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": []
        });
    },
    "post /score/importScoreList.do": function (req, res) {
        res.send({
            "data": null,
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": []
        });
    },
    "post /score/decrease.do": function (req, res) {
        res.send({
            "result": "failure",
            "messages": [
                "用户ID错误!"
            ],
            "fieldErrors": {},
            "errors": [],
            "data": null
        });
    }
};