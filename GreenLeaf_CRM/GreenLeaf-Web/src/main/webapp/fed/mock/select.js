module.exports = {
    "get /select/users.do": function (req, res) {
        var listData = [],
            str = '';

        for (var i = 0; i < 90; i++) {
            str = i < 10 ? '0' + i : i;
            listData.push({
                "id": "CY10" + str,
                "text": "张三丰"
            });
        }

        res.send({
            "data": listData,
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": []
        });
    },
    "get /select/systems.do": function (req, res) {
        var listData = [];

        for (var i = 0; i < 10; i++) {
            listData.push({
                "id": "100" + i,
                "text": "积分系统" + i
            });
        }

        res.send({
            "data": listData,
            "result": "success",
            "messages": [],
            "fieldErrors": {},
            "errors": []
        });
    }
};