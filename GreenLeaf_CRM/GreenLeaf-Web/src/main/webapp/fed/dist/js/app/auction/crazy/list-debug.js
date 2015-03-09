define("app/auction/crazy/list-debug.handlebars", [ "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.0.2/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 3, ">= 1.0.0-rc.4" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        var stack1, functionType = "function", escapeExpression = this.escapeExpression, helperMissing = helpers.helperMissing, self = this;
        function program1(depth0, data) {
            var buffer = "", stack1;
            buffer += '\r\n    <ul class="sell-goods-list clearfix" data-batch="';
            if (stack1 = helpers.auctionBatch) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.auctionBatch;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '">\r\n        ';
            stack1 = helpers.each.call(depth0, depth0.awardForeVos, {
                hash: {},
                inverse: self.noop,
                fn: self.program(2, program2, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "\r\n    </ul>\r\n";
            return buffer;
        }
        function program2(depth0, data) {
            var buffer = "", stack1, stack2, options;
            buffer += "\r\n            ";
            options = {
                hash: {},
                inverse: self.program(8, program8, data),
                fn: self.program(3, program3, data),
                data: data
            };
            stack2 = (stack1 = helpers.soonBegin, stack1 ? stack1.call(depth0, depth0.batch, options) : helperMissing.call(depth0, "soonBegin", depth0.batch, options));
            if (stack2 || stack2 === 0) {
                buffer += stack2;
            }
            buffer += "\r\n        ";
            return buffer;
        }
        function program3(depth0, data) {
            var buffer = "", stack1, stack2, options;
            buffer += "\r\n                " + '\r\n                <li class="goods-item begin">\r\n                <span class="pic">\r\n                    <span class="pic-c1">\r\n                        <img src="';
            options = {
                hash: {},
                data: data
            };
            buffer += escapeExpression((stack1 = helpers.getImage, stack1 ? stack1.call(depth0, depth0.image, options) : helperMissing.call(depth0, "getImage", depth0.image, options))) + '" width="308" height="216" alt="">\r\n                    </span>\r\n                    <span class="pic-c2">\r\n                        <span class="clearfix">\r\n                            <span class="name" title="';
            if (stack2 = helpers.name) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.name;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + '">';
            if (stack2 = helpers.name) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.name;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + '</span>\r\n                            <span class="jiage">￥';
            if (stack2 = helpers.price) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.price;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + '</span>\r\n                        </span>\r\n                        <b class="mask"></b>\r\n                    </span>\r\n                    <span class="bq-time">\r\n                        <span class="bq-time-c J_List_CountDown"></span>\r\n                    </span>\r\n                </span>\r\n                    <div class="text">\r\n                        <div class="text-c1" title="';
            if (stack2 = helpers.description) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.description;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + '">';
            if (stack2 = helpers.description) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.description;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + '</div>\r\n                        <div class="text-c2">\r\n                            ';
            stack2 = helpers["if"].call(depth0, depth0.awardLeaderUserno, {
                hash: {},
                inverse: self.program(6, program6, data),
                fn: self.program(4, program4, data),
                data: data
            });
            if (stack2 || stack2 === 0) {
                buffer += stack2;
            }
            buffer += '\r\n                        </div>\r\n                    </div>\r\n                    <div class="gz-xq"><div class="gz-xq-in">即将开始</div></div>\r\n                </li>\r\n            ';
            return buffer;
        }
        function program4(depth0, data) {
            var buffer = "", stack1;
            buffer += '\r\n                                <span>\r\n                                    <span class="ico ico-cj"></span>\r\n                                    <span class="tt">\r\n                                        <span class="tt-c" title="';
            if (stack1 = helpers.awardLeaderName) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.awardLeaderName;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + " [";
            if (stack1 = helpers.awardLeaderDepartment) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.awardLeaderDepartment;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + ']">';
            if (stack1 = helpers.awardLeaderName) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.awardLeaderName;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + " [";
            if (stack1 = helpers.awardLeaderDepartment) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.awardLeaderDepartment;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + ']</span>\r\n                                        <span class="tt-c"> 出价：';
            if (stack1 = helpers.awardLeaderScore) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.awardLeaderScore;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + "</span>\r\n                                    </span>\r\n                                </span>\r\n                            ";
            return buffer;
        }
        function program6(depth0, data) {
            return "\r\n                                暂无人问津\r\n                            ";
        }
        function program8(depth0, data) {
            var buffer = "", stack1, stack2, options;
            buffer += "\r\n                ";
            options = {
                hash: {},
                inverse: self.program(11, program11, data),
                fn: self.program(9, program9, data),
                data: data
            };
            stack2 = (stack1 = helpers.isSuccess, stack1 ? stack1.call(depth0, depth0.awardState, options) : helperMissing.call(depth0, "isSuccess", depth0.awardState, options));
            if (stack2 || stack2 === 0) {
                buffer += stack2;
            }
            buffer += "\r\n            ";
            return buffer;
        }
        function program9(depth0, data) {
            var buffer = "", stack1, stack2, options;
            buffer += "\r\n                    " + '\r\n                    <li class="goods-item over" data-awardid="';
            if (stack1 = helpers.id) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.id;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '">\r\n                        <a href="javascript:;" class="pic" data-role="get">\r\n                            <span class="pic-c1">\r\n                                <img src="';
            options = {
                hash: {},
                data: data
            };
            buffer += escapeExpression((stack1 = helpers.getImage, stack1 ? stack1.call(depth0, depth0.image, options) : helperMissing.call(depth0, "getImage", depth0.image, options))) + '" width="308" height="216" alt="">\r\n                            </span>\r\n                            <span class="pic-c2">\r\n                                <span class="clearfix">\r\n                                    <span class="name" title="';
            if (stack2 = helpers.name) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.name;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + '">';
            if (stack2 = helpers.name) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.name;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + '</span>\r\n                                    <span class="jiage">￥';
            if (stack2 = helpers.price) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.price;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + '</span>\r\n                                </span>\r\n                                <b class="mask"></b>\r\n                            </span>\r\n                            <span class="bq-time">\r\n                                <span class="bq-time-c">已结束</span>\r\n                            </span>\r\n                        </a>\r\n                        <div class="text">\r\n                            <div class="text-c1" title="';
            if (stack2 = helpers.description) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.description;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + '">';
            if (stack2 = helpers.description) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.description;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + '</div>\r\n                            <div class="text-c2">\r\n                                <span class="J_Info">\r\n                                    <span class="ico ico-cj"></span>\r\n                                    <span class="tt">\r\n                                        <span class="tt-c" title="';
            if (stack2 = helpers.awardLeaderName) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.awardLeaderName;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + " [";
            if (stack2 = helpers.awardLeaderDepartment) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.awardLeaderDepartment;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + ']">';
            if (stack2 = helpers.awardLeaderName) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.awardLeaderName;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + " [";
            if (stack2 = helpers.awardLeaderDepartment) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.awardLeaderDepartment;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + ']</span>\r\n                                        <span class="tt-c"> 出价：';
            if (stack2 = helpers.awardLeaderScore) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.awardLeaderScore;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + '</span>\r\n                                    </span>\r\n                                </span>\r\n                                <a href="javascript:;" class="jpxq" data-role="get">竞拍详情</a>\r\n                            </div>\r\n                        </div>\r\n                        <div class="gz-xq">\r\n                            <div class="gz-xq-in">物品由<strong>';
            if (stack2 = helpers.awardLeaderName) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.awardLeaderName;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + "</strong>竞拍成功^_^</div>\r\n                        </div>\r\n                    </li>\r\n                ";
            return buffer;
        }
        function program11(depth0, data) {
            var buffer = "", stack1, stack2, options;
            buffer += "\r\n                    ";
            options = {
                hash: {},
                inverse: self.program(17, program17, data),
                fn: self.program(12, program12, data),
                data: data
            };
            stack2 = (stack1 = helpers.isCurrent, stack1 ? stack1.call(depth0, depth0.batch, depth0.awardState, options) : helperMissing.call(depth0, "isCurrent", depth0.batch, depth0.awardState, options));
            if (stack2 || stack2 === 0) {
                buffer += stack2;
            }
            buffer += "\r\n                ";
            return buffer;
        }
        function program12(depth0, data) {
            var buffer = "", stack1, stack2, options;
            buffer += "\r\n                        " + '\r\n                        <li class="goods-item" id="';
            if (stack1 = helpers.id) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.id;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '" data-awardid="';
            if (stack1 = helpers.id) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.id;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '">\r\n                            <a href="javascript:;" class="pic" data-role="get">\r\n                                <span class="pic-c1">\r\n                                    <img src="';
            options = {
                hash: {},
                data: data
            };
            buffer += escapeExpression((stack1 = helpers.getImage, stack1 ? stack1.call(depth0, depth0.image, options) : helperMissing.call(depth0, "getImage", depth0.image, options))) + '" width="308" height="216" alt="">\r\n                                </span>\r\n                                <span class="pic-c2">\r\n                                    <span class="clearfix">\r\n                                        <span class="name" title="';
            if (stack2 = helpers.name) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.name;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + '">';
            if (stack2 = helpers.name) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.name;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + '</span>\r\n                                        <span class="jiage">￥';
            if (stack2 = helpers.price) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.price;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + '</span>\r\n                                    </span>\r\n                                    <b class="mask"></b>\r\n                                </span>\r\n                                <span class="bq-time">\r\n                                    <span class="bq-time-c" id="J_CountDown_';
            if (stack2 = helpers.id) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.id;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + '"></span>\r\n                                </span>\r\n                            </a>\r\n                            <div class="text">\r\n                                <div class="text-c1" title="';
            if (stack2 = helpers.description) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.description;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + '">';
            if (stack2 = helpers.description) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.description;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + '</div>\r\n                                <div class="text-c2 J_Info">\r\n                                    ';
            stack2 = helpers["if"].call(depth0, depth0.awardLeaderUserno, {
                hash: {},
                inverse: self.program(15, program15, data),
                fn: self.program(13, program13, data),
                data: data
            });
            if (stack2 || stack2 === 0) {
                buffer += stack2;
            }
            buffer += '\r\n                                </div>\r\n                            </div>\r\n                            <div id="J_Ctrl_';
            if (stack2 = helpers.id) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.id;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + '" style="width:308px;height:48px;"></div>\r\n                        </li>\r\n                    ';
            return buffer;
        }
        function program13(depth0, data) {
            var buffer = "", stack1;
            buffer += '\r\n                                        <span>\r\n                                            <span class="ico ico-cj"></span>\r\n                                            <span class="tt">\r\n                                                <span class="tt-c" title="';
            if (stack1 = helpers.awardLeaderName) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.awardLeaderName;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + " [";
            if (stack1 = helpers.awardLeaderDepartment) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.awardLeaderDepartment;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + ']">';
            if (stack1 = helpers.awardLeaderName) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.awardLeaderName;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + " [";
            if (stack1 = helpers.awardLeaderDepartment) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.awardLeaderDepartment;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + ']</span>\r\n                                                <span class="tt-c"> 出价：';
            if (stack1 = helpers.awardLeaderScore) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.awardLeaderScore;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '</span>\r\n                                            </span>\r\n                                        </span>\r\n                                        <a href="javascript:;" class="jpxq" data-role="get">竞拍详情</a>\r\n                                    ';
            return buffer;
        }
        function program15(depth0, data) {
            return "\r\n                                        暂无人问津\r\n                                    ";
        }
        function program17(depth0, data) {
            var buffer = "", stack1, stack2, options;
            buffer += "\r\n                        " + '\r\n                        <li class="goods-item liupai">\r\n                            <span href="javascript:;" class="pic">\r\n                                <span class="pic-c1">\r\n                                    <img src="';
            options = {
                hash: {},
                data: data
            };
            buffer += escapeExpression((stack1 = helpers.getImage, stack1 ? stack1.call(depth0, depth0.image, options) : helperMissing.call(depth0, "getImage", depth0.image, options))) + '" width="308" height="216" alt="">\r\n                                </span>\r\n                                <span class="pic-c2">\r\n                                    <span class="clearfix">\r\n                                        <span class="name" title="';
            if (stack2 = helpers.name) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.name;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + '">';
            if (stack2 = helpers.name) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.name;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + '</span>\r\n                                        <span class="jiage">￥';
            if (stack2 = helpers.price) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.price;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + '</span>\r\n                                    </span>\r\n                                    <b class="mask"></b>\r\n                                </span>\r\n                                <span class="bq-time">\r\n                                    <span class="bq-time-c">流拍</span>\r\n                                </span>\r\n                            </span>\r\n                            <div class="text">\r\n                                <div class="text-c1" title="';
            if (stack2 = helpers.description) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.description;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + '">';
            if (stack2 = helpers.description) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.description;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + '</div>\r\n                                <div class="text-c2"></div>\r\n                            </div>\r\n                            <div class="gz-xq">\r\n                                <div class="gz-xq-in">该物品流拍</div>\r\n                            </div>\r\n                        </li>\r\n                    ';
            return buffer;
        }
        stack1 = helpers.each.call(depth0, depth0.auctionBatchVos, {
            hash: {},
            inverse: self.noop,
            fn: self.program(1, program1, data),
            data: data
        });
        if (stack1 || stack1 === 0) {
            return stack1;
        } else {
            return "";
        }
    });
});

define("gallery/handlebars/1.0.2/runtime-debug", [], function(require, exports, module) {
    /*

Copyright (C) 2011 by Yehuda Katz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
    // lib/handlebars/browser-prefix.js
    var Handlebars = {};
    (function(Handlebars, undefined) {
        // lib/handlebars/base.js
        Handlebars.VERSION = "1.0.0-rc.4";
        Handlebars.COMPILER_REVISION = 3;
        Handlebars.REVISION_CHANGES = {
            1: "<= 1.0.rc.2",
            // 1.0.rc.2 is actually rev2 but doesn't report it
            2: "== 1.0.0-rc.3",
            3: ">= 1.0.0-rc.4"
        };
        Handlebars.helpers = {};
        Handlebars.partials = {};
        var toString = Object.prototype.toString, functionType = "[object Function]", objectType = "[object Object]";
        Handlebars.registerHelper = function(name, fn, inverse) {
            if (toString.call(name) === objectType) {
                if (inverse || fn) {
                    throw new Handlebars.Exception("Arg not supported with multiple helpers");
                }
                Handlebars.Utils.extend(this.helpers, name);
            } else {
                if (inverse) {
                    fn.not = inverse;
                }
                this.helpers[name] = fn;
            }
        };
        Handlebars.registerPartial = function(name, str) {
            if (toString.call(name) === objectType) {
                Handlebars.Utils.extend(this.partials, name);
            } else {
                this.partials[name] = str;
            }
        };
        Handlebars.registerHelper("helperMissing", function(arg) {
            if (arguments.length === 2) {
                return undefined;
            } else {
                throw new Error("Could not find property '" + arg + "'");
            }
        });
        Handlebars.registerHelper("blockHelperMissing", function(context, options) {
            var inverse = options.inverse || function() {}, fn = options.fn;
            var type = toString.call(context);
            if (type === functionType) {
                context = context.call(this);
            }
            if (context === true) {
                return fn(this);
            } else if (context === false || context == null) {
                return inverse(this);
            } else if (type === "[object Array]") {
                if (context.length > 0) {
                    return Handlebars.helpers.each(context, options);
                } else {
                    return inverse(this);
                }
            } else {
                return fn(context);
            }
        });
        Handlebars.K = function() {};
        Handlebars.createFrame = Object.create || function(object) {
            Handlebars.K.prototype = object;
            var obj = new Handlebars.K();
            Handlebars.K.prototype = null;
            return obj;
        };
        Handlebars.logger = {
            DEBUG: 0,
            INFO: 1,
            WARN: 2,
            ERROR: 3,
            level: 3,
            methodMap: {
                0: "debug",
                1: "info",
                2: "warn",
                3: "error"
            },
            // can be overridden in the host environment
            log: function(level, obj) {
                if (Handlebars.logger.level <= level) {
                    var method = Handlebars.logger.methodMap[level];
                    if (typeof console !== "undefined" && console[method]) {
                        console[method].call(console, obj);
                    }
                }
            }
        };
        Handlebars.log = function(level, obj) {
            Handlebars.logger.log(level, obj);
        };
        Handlebars.registerHelper("each", function(context, options) {
            var fn = options.fn, inverse = options.inverse;
            var i = 0, ret = "", data;
            if (options.data) {
                data = Handlebars.createFrame(options.data);
            }
            if (context && typeof context === "object") {
                if (context instanceof Array) {
                    for (var j = context.length; i < j; i++) {
                        if (data) {
                            data.index = i;
                        }
                        ret = ret + fn(context[i], {
                            data: data
                        });
                    }
                } else {
                    for (var key in context) {
                        if (context.hasOwnProperty(key)) {
                            if (data) {
                                data.key = key;
                            }
                            ret = ret + fn(context[key], {
                                data: data
                            });
                            i++;
                        }
                    }
                }
            }
            if (i === 0) {
                ret = inverse(this);
            }
            return ret;
        });
        Handlebars.registerHelper("if", function(context, options) {
            var type = toString.call(context);
            if (type === functionType) {
                context = context.call(this);
            }
            if (!context || Handlebars.Utils.isEmpty(context)) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        });
        Handlebars.registerHelper("unless", function(context, options) {
            return Handlebars.helpers["if"].call(this, context, {
                fn: options.inverse,
                inverse: options.fn
            });
        });
        Handlebars.registerHelper("with", function(context, options) {
            if (!Handlebars.Utils.isEmpty(context)) return options.fn(context);
        });
        Handlebars.registerHelper("log", function(context, options) {
            var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
            Handlebars.log(level, context);
        });
        // lib/handlebars/utils.js
        var errorProps = [ "description", "fileName", "lineNumber", "message", "name", "number", "stack" ];
        Handlebars.Exception = function(message) {
            var tmp = Error.prototype.constructor.apply(this, arguments);
            // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
            for (var idx = 0; idx < errorProps.length; idx++) {
                this[errorProps[idx]] = tmp[errorProps[idx]];
            }
        };
        Handlebars.Exception.prototype = new Error();
        // Build out our basic SafeString type
        Handlebars.SafeString = function(string) {
            this.string = string;
        };
        Handlebars.SafeString.prototype.toString = function() {
            return this.string.toString();
        };
        var escape = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#x27;",
            "`": "&#x60;"
        };
        var badChars = /[&<>"'`]/g;
        var possible = /[&<>"'`]/;
        var escapeChar = function(chr) {
            return escape[chr] || "&amp;";
        };
        Handlebars.Utils = {
            extend: function(obj, value) {
                for (var key in value) {
                    if (value.hasOwnProperty(key)) {
                        obj[key] = value[key];
                    }
                }
            },
            escapeExpression: function(string) {
                // don't escape SafeStrings, since they're already safe
                if (string instanceof Handlebars.SafeString) {
                    return string.toString();
                } else if (string == null || string === false) {
                    return "";
                }
                // Force a string conversion as this will be done by the append regardless and
                // the regex test will do this transparently behind the scenes, causing issues if
                // an object's to string has escaped characters in it.
                string = string.toString();
                if (!possible.test(string)) {
                    return string;
                }
                return string.replace(badChars, escapeChar);
            },
            isEmpty: function(value) {
                if (!value && value !== 0) {
                    return true;
                } else if (toString.call(value) === "[object Array]" && value.length === 0) {
                    return true;
                } else {
                    return false;
                }
            }
        };
        // lib/handlebars/runtime.js
        Handlebars.VM = {
            template: function(templateSpec) {
                // Just add water
                var container = {
                    escapeExpression: Handlebars.Utils.escapeExpression,
                    invokePartial: Handlebars.VM.invokePartial,
                    programs: [],
                    program: function(i, fn, data) {
                        var programWrapper = this.programs[i];
                        if (data) {
                            programWrapper = Handlebars.VM.program(i, fn, data);
                        } else if (!programWrapper) {
                            programWrapper = this.programs[i] = Handlebars.VM.program(i, fn);
                        }
                        return programWrapper;
                    },
                    programWithDepth: Handlebars.VM.programWithDepth,
                    noop: Handlebars.VM.noop,
                    compilerInfo: null
                };
                return function(context, options) {
                    options = options || {};
                    var result = templateSpec.call(container, Handlebars, context, options.helpers, options.partials, options.data);
                    var compilerInfo = container.compilerInfo || [], compilerRevision = compilerInfo[0] || 1, currentRevision = Handlebars.COMPILER_REVISION;
                    if (compilerRevision !== currentRevision) {
                        if (compilerRevision < currentRevision) {
                            var runtimeVersions = Handlebars.REVISION_CHANGES[currentRevision], compilerVersions = Handlebars.REVISION_CHANGES[compilerRevision];
                            throw "Template was precompiled with an older version of Handlebars than the current runtime. " + "Please update your precompiler to a newer version (" + runtimeVersions + ") or downgrade your runtime to an older version (" + compilerVersions + ").";
                        } else {
                            // Use the embedded version info since the runtime doesn't know about this revision yet
                            throw "Template was precompiled with a newer version of Handlebars than the current runtime. " + "Please update your runtime to a newer version (" + compilerInfo[1] + ").";
                        }
                    }
                    return result;
                };
            },
            programWithDepth: function(i, fn, data) {
                var args = Array.prototype.slice.call(arguments, 3);
                var program = function(context, options) {
                    options = options || {};
                    return fn.apply(this, [ context, options.data || data ].concat(args));
                };
                program.program = i;
                program.depth = args.length;
                return program;
            },
            program: function(i, fn, data) {
                var program = function(context, options) {
                    options = options || {};
                    return fn(context, options.data || data);
                };
                program.program = i;
                program.depth = 0;
                return program;
            },
            noop: function() {
                return "";
            },
            invokePartial: function(partial, name, context, helpers, partials, data) {
                var options = {
                    helpers: helpers,
                    partials: partials,
                    data: data
                };
                if (partial === undefined) {
                    throw new Handlebars.Exception("The partial " + name + " could not be found");
                } else if (partial instanceof Function) {
                    return partial(context, options);
                } else if (!Handlebars.compile) {
                    throw new Handlebars.Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
                } else {
                    partials[name] = Handlebars.compile(partial, {
                        data: data !== undefined
                    });
                    return partials[name](context, options);
                }
            }
        };
        Handlebars.template = Handlebars.VM.template;
    })(Handlebars);
    module.exports = Handlebars;
});
