var common = require('./common');
var store = common.store;
var getFile = common.getFile;
module.exports = {
    "get /": function(req, res) {
        this.render.ftl(getFile("index"), store);
    },
    "get /index.htm": function(req, res) {
        this.render.ftl(getFile("index"), store);
    },
    "get /scoreRecord/queryFrontScoreRecordList.do": function (req, res) {
        var userno = req.param("userno"),
            operateType = req.param("operateType"),
            startTime = req.param("startTime"),
            pageSize = req.param("pageSize"),
            pageNo = req.param("pageNo"),
            endTime = req.param("endTime");

        res.send({
            "data": {
                "pageNo": +pageNo,
                "pageSize": +pageSize,
                "totalHit": operateType === "1" ? 0 : 1000,
                "listData": operateType === "1" ? []: [
                    {
                        "createTime": 1399514514233,
                        "score": 999,
                        "operateType": "2",
                        "comments": "授予积[url]http://baidu.com[/url]分" + Math.random(),
                        "systemCode": "1001",
                        "userno": "CY6734",
                        "operateUserno": "CY1111"
                    },
                    {
                        "createTime": 1399514564662,
                        "score": 999,
                        "operateType": "1",
                        "comments": "支出积分",
                        "systemCode": "1001",
                        "userno": "CY6734",
                        "operateUserno": "CY1111"
                    },
                    {
                        "createTime": 1399514578722,
                        "score": 999,
                        "operateType": "2",
                        "comments": "授予积分",
                        "systemCode": "1001",
                        "userno": "CY6734",
                        "operateUserno": "CY1111"
                    }
                ]
            },
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": []
        });
    },
    "get /score/queryUserScore.do": function (req, res) {
        var userno = req.param("userno");

        res.send({
            "data": {
                "name": "小张",
                "position": "JAVA开发工程师",
                "score": 666,
                "totalScore": 888,
                "userno": userno,
                "usedScore": 222,
                "gender": "1",
                "department": "技术中心",
                "avatar": "CY7539/medium.jpg"
            },
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": []
        });
    }
};