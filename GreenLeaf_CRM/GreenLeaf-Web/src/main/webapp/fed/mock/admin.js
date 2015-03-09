var common = require('./common');
var store = common.store;
var getFile = common.getFile;
module.exports = {
    "get /admin/manage.htm": function(req, res) {
        this.render.ftl(getFile("admin/manage"), store);
    },
    "get /admin/log.htm": function(req, res) {
        this.render.ftl(getFile("admin/log"), store);
    },
    "get /admin/auction.htm": function(req, res) {
        this.render.ftl(getFile("admin/auction"), store);
    }
};