var common = require('./common');
var store = common.store;
var getFile = common.getFile;
module.exports = {
    "get /my.htm": function (req, res) {
        this.render.ftl(getFile("my"), store);
    },
    "get /award/queryAwardPage.do": function (req, res) {
        var pageNo = req.param("pageNo"),
            pageSize = req.param("pageSize");

        var listData = [];

        for (var i = 0; i < 6; i++) {
            listData.push({
                name: "iPhone" + i,
                id: i,
                description: "iPhone1代" + Math.random(),
                createTime: 1399866253309,
                sort: 7,
                batch: 2,
                createUserno: "CY6734",
                deleteFlag: false,
                auctionId: 18,
                userno: "CY6034",
                awardState: "1",
                price: 1000,//价格
                updateTime: 1399866253309,
                image: 'img.jpg',
                winTime: null,
                winScore: null,//消费积分
                updateUserNo: "CY6734",
                leaderUserno: null,
                leaderScore: null,
                leaderName: null,
                leaderDepartment: null,
                focusNum: null,
                focusId: null,
                auctionName: "中秋节拍卖"//所属拍卖
            });
        }

        res.send({
            "data": {
                "pageNo": +pageNo,
                "pageSize": +pageSize,
                "totalHit": +pageNo == 2 ? 0 : 1000,
                "listData": listData
            },
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": []
        });
    }
};