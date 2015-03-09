(function ($) {
    var app = {
        logoutApi: domain.indexOf('local.17173.com') > -1 ?
            'http://ermp.local.17173.com/sso/logonOut.do' :
            'http://ermp.test.17173.com/manager/sso/logonOut.do',

        init: function () {
            var self = this;

            self.cacheElement();
            self.logout();
            self.ininMessage();

            Ermpdock.init();
        },
        cacheElement: function () {
            var self = this;

            self.$logout = $('#J_Logout');
            self.$btn = $('#J_MessageBox');
        },
        ininMessage: function () {
            var self = this;

            if (!Ermpmessage) {
                return;
            }

            Ermpmessage.init({
                position: 'fixed',
                top: 60,
                right: 35,
                onStatusChange: function (n) {
                    self.popStatuChange.call(self, n);
                }
            });

            self.getUnreadCount();
        },
        getUnreadCount: function () {
            var self = this;

            Ermpmessage.getUnreadCount(function (n) {
                self.popStatuChange.call(self, n);
            });
        },
        popStatuChange: function (n) {
            var self = this;
            if (n && n > 0) {
                self.enablePop();
            } else {
                self.unablePop();
            }
        },
        enablePop: function () {
            var self = this;

            self.$btn.addClass('message-center-box-hint');
            self.$btn.unbind('click').bind('click', function () {
                Ermpmessage.show();
            });
        },
        unablePop: function () {
            var self = this;

            self.$btn.removeClass('message-center-box-hint');
            self.$btn.unbind('click').bind('click', function () {
                window.location.href = 'http://ermp.local.17173.com/mycenter/message.htm';
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