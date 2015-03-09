var common = require('./common');
var store = common.store;
var getFile = common.getFile;
module.exports = {
    "get /history/index.htm": function (req, res) {
        this.render.ftl(getFile("history/index"), store);
    },

    "get /history/detail/*": function (req, res) {
        store.auctionVo = {
            title: '端午节拍卖活动',
            startTime: 1401106727767,
            auctionTime: 1401146733213,
            endTime: 1401126733213,
            awardCount: 200,
            details: '端午节拍卖活动有好多好多的礼品'
        };
        store.awardVos = [
            {
                id: 1,
                name: 'iPad mini1',
                description: 'iPad mini 2是ipad mini的升级版，正式名称为“配备视网膜显示屏的iPad mini”。',
                price: 3245,
                awardState: "4",
                image: 'img.jpg',
                leaderName: '李莎莎',
                leaderScore: '8888',
                leaderDepartment: '技术中心'
            },
            {
                id: 2,
                name: 'iPad mini2',
                description: 'iPad mini 2是ipad mini的升级版，正式名称为“配备视网膜显示屏的iPad mini”。',
                price: 3465,
                awardState: "5",
                image: 'img.jpg',
                leaderName: '李莎莎',
                leaderScore: '7777',
                leaderDepartment: '技术中心'
            },
            {
                id: 3,
                name: 'iPad mini3',
                description: 'iPad mini 2是ipad mini的升级版，正式名称为“配备视网膜显示屏的iPad mini”。',
                price: 5678,
                awardState: "4",
                image: 'img.jpg',
                leaderName: '李莎莎',
                leaderScore: '666',
                leaderDepartment: '技术中心'
            },
            {
                id: 4,
                name: 'iPad mini4',
                description: 'iPad mini 2是ipad mini的升级版，正式名称为“配备视网膜显示屏的iPad mini”。',
                price: 7890,
                awardState: "4",
                image: 'img.jpg',
                leaderName: '李莎莎',
                leaderScore: '234',
                leaderDepartment: '技术中心'
            },
            {
                id: 5,
                name: 'iPad mini5',
                description: 'iPad mini 2是ipad mini的升级版，正式名称为“配备视网膜显示屏的iPad mini”。',
                price: 9890,
                awardState: "4",
                image: 'img.jpg',
                leaderName: '李莎莎',
                leaderScore: '234234',
                leaderDepartment: '技术中心'
            }
        ];
        this.render.ftl(getFile("history/detail"), store);
    },

    "get /auction/query.do": function (req, res) {
        var pageNo = req.param("pageNo"),
            pageSize = req.param("pageSize");

        res.send({
            "data": {
                "pageNo": +pageNo,
                "pageSize": +pageSize,
                "totalHit": 1000,
                "listData": [
                    {
                        "id": 10,
                        "startTime": 1499960181000,
                        "endTime": 1499990181000,
                        "createTime": 1399860364017,
                        "title": "端午节拍卖活动" + Math.random(),
                        "auctionState": "4",
                        "base": "3",
                        "auctionTime": 1499990181000,
                        "createUserNo": "CY6734",
                        "updateUserNo": "CY6734",
                        "deleteFlag": false,
                        "details": "端午节拍卖活动有好多好多的礼品",
                        "updateTime": 1399860364017,
                        "awardCount": 342,
                        "pic": "img.jpg"
                    },
                    {
                        "id": 10,
                        "startTime": 1499960181000,
                        "endTime": 1499990181000,
                        "createTime": 1399860364017,
                        "title": "端午节拍卖活动",
                        "auctionState": "4",
                        "base": "3",
                        "auctionTime": 1499990181000,
                        "createUserNo": "CY6734",
                        "updateUserNo": "CY6734",
                        "deleteFlag": false,
                        "details": "端午节拍卖活动有好多好多的礼品",
                        "updateTime": 1399860364017,
                        "awardCount": 44,
                        "pic": "img.jpg"
                    },
                    {
                        "id": 10,
                        "startTime": 1499960181000,
                        "endTime": 1499990181000,
                        "createTime": 1399860364017,
                        "title": "端午节拍卖活动",
                        "auctionState": "4",
                        "base": "3",
                        "auctionTime": 1499990181000,
                        "createUserNo": "CY6734",
                        "updateUserNo": "CY6734",
                        "deleteFlag": false,
                        "details": "端午节拍卖活动有好多好多的礼品",
                        "updateTime": 1399860364017,
                        "awardCount": 55,
                        "pic": "img.jpg"
                    },
                    {
                        "id": 10,
                        "startTime": 1499960181000,
                        "endTime": 1499990181000,
                        "createTime": 1399860364017,
                        "title": "端午节拍卖活动",
                        "auctionState": "4",
                        "base": "3",
                        "auctionTime": 1499990181000,
                        "createUserNo": "CY6734",
                        "updateUserNo": "CY6734",
                        "deleteFlag": false,
                        "details": "端午节拍卖活动有好多好多的礼品",
                        "updateTime": 1399860364017,
                        "awardCount": 2,
                        "pic": "img.jpg"
                    },
                    {
                        "id": 10,
                        "startTime": 1499960181000,
                        "endTime": 1499990181000,
                        "createTime": 1399860364017,
                        "title": "端午节拍卖活动",
                        "auctionState": "4",
                        "base": "3",
                        "auctionTime": 1499990181000,
                        "createUserNo": "CY6734",
                        "updateUserNo": "CY6734",
                        "deleteFlag": false,
                        "details": "端午节拍卖活动有好多好多的礼品",
                        "updateTime": 1399860364017,
                        "awardCount": 1234,
                        "pic": "img.jpg"
                    }
                ]
            },
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": []
        });
    },

    //竞拍记录
    "get /auctionRecord/queryByAwardId.do": function (req, res) {
        var pageNo = req.param("pageNo"),
            pageSize = req.param("pageSize");

        res.send({
            "data": {
                "pageNo": +pageNo,
                "pageSize": +pageSize,
                "totalHit": 1000,
                "listData": [
                    {
                        "name": "小陈",
                        "id": 1,
                        "createTime": 1499960181000,
                        "userno": "CY6134",
                        "awardId": 2,
                        "score": 1000,
                        "department": "技术中心",
                        "userScore": 2000
                    },
                    {
                        "name": "小陈",
                        "id": 1,
                        "createTime": 1499960181000,
                        "userno": "CY6134",
                        "awardId": 2,
                        "score": 1000,
                        "department": "技术中心",
                        "userScore": 2000
                    },
                    {
                        "name": "小陈",
                        "id": 1,
                        "createTime": 1499960181000,
                        "userno": "CY6134",
                        "awardId": 2,
                        "score": 1000,
                        "department": "技术中心",
                        "userScore": 2000
                    },
                    {
                        "name": "小陈",
                        "id": 1,
                        "createTime": 1499960181000,
                        "userno": "CY6134",
                        "awardId": 2,
                        "score": 1000,
                        "department": "技术中心",
                        "userScore": 2000
                    },
                    {
                        "name": "小陈",
                        "id": 1,
                        "createTime": 1499960181000,
                        "userno": "CY6134",
                        "awardId": 2,
                        "score": 1000,
                        "department": "技术中心",
                        "userScore": 2000
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