(function ($) {
    var app = {

        logoutApi: domain.indexOf('local.17173.com') > -1 ?
            'http://ermp.local.17173.com/sso/logonOut.do' :
            'http://ermp.test.17173.com/manager/sso/logonOut.do',

        init: function () {
            var self = this;

            self.cacheElement();
            self.timer();
            self.bindEvents();
            self.logout();
        },

        cacheElement: function () {
            var self = this;

            self.$backToTop = $('#J_BackToTop');
            self.$tab = $('#J_Tab');
            self.$tabContent = $('#J_TabContent');
            self.$nav = $('#J_Nav');
            self.$logout = $('#J_Logout');
            self.$user = $('#J_User');
            self.$userInfo = $('#J_UserInfo');
        },

        timer: function () {
            var self = this;

            setInterval(function () {
                var top = $(window).scrollTop();

                top > 100 ? self.$backToTop.show() : self.$backToTop.hide();

                if (self.$nav.length > 0) {
                    top > 110 ? self.$nav.addClass('fixed') : self.$nav.removeClass('fixed');
                }

                if (self.$user.length > 0 && self.$userInfo.length > 0) {
                    top > 110 ?
                        self.$userInfo.css({'position': 'fixed', 'top': '38px'}) :
                        self.$userInfo.css({'position': 'absolute', 'top': '147px'});
                }
            }, 200);
        },

        bindEvents: function () {
            var self = this;

            self.$backToTop.on('click', function () {
                $(window).scrollTop(0);
                $(this).hide();
            });

            self.$tab.on('click', '.nav-item', function () {
                var $t = $(this);
                if ($t.hasClass('active')) {
                    return;
                }
                var index = $t.index(),
                    $tabContents = self.$tabContent.children('.tab-pane'),
                    $tabs = self.$tab.children('.nav-item');

                $tabs.removeClass('active');
                $t.addClass('active');
                $tabContents.removeClass('active');
                $tabContents.eq(index).addClass('active');
            });
        },

        logout: function () {
            var self = this;

            self.$logout.on('click', function () {
                $.ajax({
                    url: self.logoutApi,
                    data:{
                        ticket: self.getCookie('ErmpTicket'),
                        token: self.getCookie('ErmpToken')
                    },
                    dataType: 'jsonp',
                    success: function (res) {
                        if (res.data) {
                            self.removeCookie('ErmpTicket');
                            self.removeCookie('ErmpToken');
                            window.location.href = '/';
                        }
                    }
                });
            });
        },

        removeCookie: function (name) {
            var date = new Date(1990, 6, 19),
                expires = '; expires=' + date.toUTCString();

            document.cookie = name + '=""' + expires + '; path=/; domain=' + domain;
        },

        getCookie: function (name) {
            if (document.cookie.length > 0) {
                var start = document.cookie.indexOf(name + '=');
                if (start != -1) {
                    start = start + name.length + 1;
                    var end = document.cookie.indexOf(';', start);
                    if (end == -1) {
                        end = document.cookie.length;
                    }
                    return decodeURIComponent(document.cookie.substring(start, end));
                }
            }
            return '';
        }
    };

    app.init();
})(jQuery);