define(function () {
    'use strict';

    (function () {
        var tictac = {

            //当前时间
            _currentTime: 0,

            //上次执行callback的时间
            _lastTimeForCallback: 0,

            //上次setInterval的时间
            _lastTimeForInterval: 0,

            //setInterval
            _timer: null,

            //create的倒计时列表
            _instanceHash: {},

            //执行callback的时间间隔
            _callbackInterval: 0,

            //Tictac setInterval的间隔
            _timerInterval: 300,

            //执行callback的倒计时
            _callbackCountDown: 0,

            //定时执行的回调
            _callback: null,

            init: function (options) {
                var self = this;

                self._currentTime = options.currentTime;
                self._lastTimeForCallback = options.currentTime;
                self._lastTimeForInterval = +new Date();
                self._callback = options.callback;
                self._callbackInterval = options.interval;
                self._callbackCountDown = 0;

                self._run();
            },

            _run: function () {
                var self = this;

                self._timer = setInterval(function () {
                    self._currentTime += +new Date() - self._lastTimeForInterval;
                    self._lastTimeForInterval = +new Date();

                    self._check();
                }, self._timerInterval);
            },

            _check: function () {
                var self = this;

                for (var i in self._instanceHash) {
                    if (!self._instanceHash.hasOwnProperty(i)) {
                        continue;
                    }
                    //同步所有的倒计时显示
                    self._sync(i);
                }

                //判断是否执行callback
                if (self._callbackCountDown >= self._callbackInterval) {
                    self._callbackCountDown -= self._callbackInterval;
                    self._lastTimeForCallback = self._currentTime - self._callbackCountDown;

                    self._callback();
                } else {
                    self._callbackCountDown = self._currentTime - self._lastTimeForCallback;
                }
            },

            execute: function () {
                var self = this;

                self._lastTimeForCallback = self._currentTime;
                self._callbackCountDown = 0;
                self._callback();
            },

            _sync: function (key) {
                var self = this,
                    item = self._instanceHash[key],
                    span = item.expires <= self._currentTime ? 0 : item.expires - self._currentTime;

                //是否过期
                if (span === 0) {
                    self.remove(key);//先remove，在执行回调，不然后面执行顺序会有错
                    typeof item.timeout === 'function' && item.timeout();
                } else {
                    if (typeof item.targetId === 'string') {
                        var $targetObj = document.getElementById(item.targetId);
                        if ($targetObj) {
                            $targetObj.innerHTML = self.util.format(span, item.format, item.formatIgnore);
                        }
                    }
                }
            },

            create: function (id, options) {
                var self = this;

                if (self._instanceHash.hasOwnProperty(id)) {
                    return;
                }

                self._instanceHash[id] = options;
            },

            reset: function (id, options) {
                var self = this;

                if (!self._instanceHash.hasOwnProperty(id)) {
                    return;
                }

                self._instanceHash[id] = tictac.util.extend(self._instanceHash[id], options);
            },

            remove: function (id) {
                var self = this;

                if (!self._instanceHash.hasOwnProperty(id)) {
                    return;
                }

                if (self._instanceHash[id].targetId) {
                    document.getElementById(self._instanceHash[id].targetId).innerHTML = '';
                }

                delete self._instanceHash[id];
            },

            getCurrentTime: function () {
                return this._currentTime;
            },

            regulate: function (currentTime) {
                var self = this;

                self._currentTime = currentTime;
                self._lastTimeForCallback = currentTime;
                self._lastTimeForInterval = +new Date();
                self._callbackCountDown = 0;

                clearInterval(self._timer);
                self._run();
            },

            destroy: function () {
                clearInterval(this._timer);
                this._timer = null;
                for (var i in this._instanceHash) {
                    this.remove(i);
                }
                this._instanceHash = {};
            }
        };

        tictac.util = {
            format: function (timestamp, format, ignore) {
                var result = '';
                if (timestamp < 0 || typeof format !== 'object') {
                    return result;
                }

                if (Object.prototype.toString.call(ignore) !== '[object Boolean]') {
                    ignore = true;
                }

                var timestampObject = {
                    days: Math.floor(timestamp / 86400000),
                    hours: Math.floor((timestamp % 86400000) / 3600000),
                    minutes: Math.floor((timestamp % 3600000) / 60000),
                    seconds: Math.floor((timestamp % 60000) / 1000)
                };

                for (var i in format) {
                    if (!format.hasOwnProperty(i)) {
                        continue;
                    }
                    var value = timestampObject[i];
                    if (value === 0 && result === '' && ignore && i !== 'seconds') {
                        continue;
                    }
                    result += format[i].replace(REGEX[i], function () {
                        if (value < 10 && arguments[0].length > 3) {
                            value = '0' + value;
                        }
                        return value;
                    });
                }

                return result;
            },
            extend: function () {
                var dest = arguments[0];
                for (var i = 1; i < arguments.length; i++) {
                    var src = arguments[i];
                    if (src) {
                        for (var k in src) {
                            dest[k] = src[k];
                        }
                    }
                }
                return dest;
            }
        };

        var REGEX = {
            days: /{[Dd]}/g,
            hours: /{[Hh]{2}}|{[Hh]}/g,
            minutes: /{[Mm]{2}}|{[Mm]}/g,
            seconds: /{[Ss]{2}}|{[Ss]}/g
        };

        if (!window.Tictac) {
            window.Tictac = tictac;
        }
    })();
});