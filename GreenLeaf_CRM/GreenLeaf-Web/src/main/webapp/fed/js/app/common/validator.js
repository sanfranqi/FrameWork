define(function(require, exports, module) {
    'use strict';
    
    var Validator = require('validator');

    module.exports = Validator.extend({
        attrs: {
            explainClass: 'help-block',
            itemClass: 'form-group',
            autoSubmit: false,
            itemErrorClass: 'has-error',
            inputClass: 'form-control',
            textareaClass: 'form-control',
            showMessage: function(message, element) {
                message = '<i class="ico ico-error"></i>' + message;

                this.getExplain(element).html(message);
                this.getItem(element).addClass('has-error');
            }
        }
    });
});
