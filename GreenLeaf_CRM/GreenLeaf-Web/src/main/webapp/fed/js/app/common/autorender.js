define(function(require, exports, module) {
    'use strict';

    var $ = require('$');
    var util = require('./util');
    var io = require('./io');

    require('keenwon/select2/3.4.8/select2');

    var autoRender = {
        init: function() {
            this.$select = $('[data-widget=select]');
            if (!this.$select) {
                return;
            }
            this.renderSelect();
        },

        renderSelect: function() {
            this.$select.each(function() {
                var $select = $(this);
                var url = $select.data('url');
                var isUser = $select.data('select') === 'user';

                io.get(util.getUrl(url), function() {
                    var data = this.data;
                    if (isUser) {
                        $.each(data, function (i, n) {
                            data[i].text = n.text + '(' + n.id + ')';
                        });
                    }
                    $select.select2({
                        data: data,
                        allowClear: true
                    });
                });
                $select.data('selectize', $select[0].selectize);
            });
        }
    };

    autoRender.init();

    return autoRender;
});
