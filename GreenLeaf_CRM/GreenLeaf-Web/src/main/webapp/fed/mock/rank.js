var common = require('./common');
var store = common.store;
var getFile = common.getFile;
module.exports = {
    "get /rank.htm": function (req, res) {
        this.render.ftl(getFile("rank"), store);
    },
    "get /score/userScoreList.do": function (req, res) {
        var pageNo = req.param("pageNo"),
            pageSize = req.param("pageSize"),
            sort = req.param("sort"),
            loadMyLocation = req.param("loadMyLocation");

        res.send({
            "data": {
                "pageNo": loadMyLocation === "true" ? 10 : +pageNo,
                "pageSize": +pageSize,
                "totalHit": sort === "usedScore" ? [] : 0,
                "listData": sort === "usedScore" ? [] : [
                    {
                        userName: "齐善锋",
                        score: 1100,
                        userno: (loadMyLocation === "true" || +pageNo === 10) ? "CY7539" : "CY6033",
                        department: "技术中心" + Math.random(),
                        totalScore: 1200,
                        rank: 1,
                        usedScore: 100
                    },
                    {
                        userName: "小辉",
                        score: 120,
                        userno: "CY1111",
                        department: "技术中心",
                        totalScore: 220,
                        rank: 2,
                        usedScore: 100
                    },
                    {
                        userName: "林浩",
                        score: 115,
                        userno: "CY6734",
                        department: "技术中心",
                        totalScore: 215,
                        rank: 3,
                        usedScore: 100
                    }
                ]
            },
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": []
        });
    }
};