var common = require('../common');
var store = common.store;
var getFile = common.getFile;
module.exports = {
    "post /scoreRecord/query.do": function(req, res) {
        var pageNo = +req.param('pageNo'),
            pageSize = +req.param('pageSize');

        res.send({
            "data": {
                "pageNo": pageNo,
                "pageSize": pageSize,
                "totalHit": 300,
                "listData": [
                    {
                        "createTime": 1399514514233,
                        "score": 999,
                        "userno": "CY6734",
                        "operateType": "2",
                        "comments": "&lt;&gt;&lt;&gt;[url]http://baidu.com[/url]授予积分",
                        "systemCode": "1001",
                        "operateUserno": "CY1111"
                    },
                    {
                        "createTime": 1399514564662,
                        "score": 999,
                        "userno": "CY6734",
                        "operateType": "2",
                        "comments": "授予积分",
                        "systemCode": "1001",
                        "operateUserno": "CY1111"
                    },
                    {
                        "createTime": 1399514578722,
                        "score": 999,
                        "userno": "CY6734",
                        "operateType": "2",
                        "comments": "授予积分",
                        "systemCode": "1001",
                        "operateUserno": "CY1111"
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