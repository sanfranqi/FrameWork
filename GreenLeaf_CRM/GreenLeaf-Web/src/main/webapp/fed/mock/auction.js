var common = require('./common');
var store = common.store;
var getFile = common.getFile;
module.exports = {
    //暂无拍卖
    "get /auction.htm": function (req, res) {
        store.auction = {
            id: 1,
            title: '测试',
            startTime: +new Date() + 1800000,
            auctionTime: +new Date() + 1800000
        };
        this.render.ftl(getFile("auction/index"), store);
    },
    //暂无拍卖
    "get /auction/index.htm": function (req, res) {
        store.auction = {
            id: 1,
            title: '测试',
            startTime: +new Date() + 1800000,
            auctionTime: +new Date() + 1800000
        };
        this.render.ftl(getFile("auction/index"), store);
    },
    //普通模式
    "get /auction/normal.htm": function (req, res) {
        store.auction = {
            id: 1,
            title: '测试',
            startTime: +new Date() + 1800000,
            auctionTime: +new Date('2015-01-02 12:22:22')
        };
        this.render.ftl(getFile("auction/normal"), store);
    },
    //疯狂模式
    "get /auction/crazy.htm": function (req, res) {
        this.render.ftl(getFile("auction/crazy"), store);
    },
    //获取服务器时间
    "get /auction/systemTime.do": function (req, res) {
        res.send({
            "data": +new Date() + 1800000,
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": []
        });
    }
};