define(function (require) {
    var moment = require('moment');

    return {
        fdate: function (val) {
            var ret = '';
            if (val) {
                ret = moment(val).format('YYYY-MM-DD HH:mm');
            }
            return ret;
        },
        fExactDate: function (val) {
            var ret = '';
            if (val) {
                ret = moment(val).format('YYYY-MM-DD HH:mm:ss.SSS');
            }
            return ret;
        },
        judge: function (a, b, options) {
            if (a === b) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        },
        contrast: function (a, b, options) {
            if (a > b) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        },
        getImage: function (val) {
            return attachmentCtx + val;
        },
        urlResolve: function (val) {
            return val.replace(/\[url\]\s*(((?!")[\s\S])*?)(?:"[\s\S]*?)?\s*\[\/url\]/ig, '<a href="$1" target="_blank">$1</a>')
                .replace(/\[url\s*=\s*([^\]"]+?)(?:"[^\]]*?)?\s*\]\s*([\s\S]*?)\s*\[\/url\]/ig, '<a href="$1" target="_blank">$2</a>')
        }
    };
});