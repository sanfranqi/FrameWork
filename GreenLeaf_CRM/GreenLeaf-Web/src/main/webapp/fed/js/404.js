(function ($) {
    'use strict';

    var $time = $('#J_Countdown'),
        num = 5;

    var timer = setInterval(function () {
        if (num <= 0) {
            clearInterval(timer);
            window.location.href = '/';
            return;
        }
        num -= 1;
        $time.text(num);
    }, 1000);
    
})(jQuery);