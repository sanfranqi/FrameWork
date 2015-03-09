<#import '/WEB-INF/template/ftl/inc/inc.ftl' as inc />

<@inc.header '积分系统 - 历史拍卖'>
</@inc.header>

<@inc.body 'page-history'>
    <div class="sell-history-xq">
        <div class="his-text">
            <h2 class="tit">${auctionVo.title}<span class="jfs"><i class="ico ico-lh"></i>${auctionVo.awardCount}</span></h2>
            <p class="p1">${auctionVo.details}</p>
            <p class="p2">开始时间：${auctionVo.startTime?number_to_datetime?string('yyyy-MM-dd HH:mm')} | 竞拍时间：${auctionVo.auctionTime?number_to_datetime?string('yyyy-MM-dd HH:mm')} | 结束时间：${auctionVo.endTime?number_to_datetime?string('yyyy-MM-dd HH:mm')}</p>
        </div>
        <ul class="sell-goods-item clearfix" id="J_List">
            <#list awardVos as item>
                <#if item.awardState = "4">
                    <li class="goods-item" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}" data-description="${item.description}" data-image="${item.image}">
                        <a href="javascript:;" class="pic" data-role="get">
                            <span class="pic-c1">
                                <img src="${imageURL}${item.image}" width="217" height="153" alt="${item.name}">
                            </span>
                            <span class="pic-c2">
                                <span class="clearfix">
                                    <span class="name" title="${item.name}">${item.name}</span>
                                    <span class="jiage">￥ ${item.price}</span>
                                </span>
                                <b class="mask"></b>
                            </span>
                        </a>
                        <div class="text">
                            <div class="text-c1">${item.description}</div>
                            <div class="text-c2">
                                <span class="ico ico-cj"></span>
                                <span class="tt">
                                    <span class="tt-c" title="${item.leaderName!""} [${item.leaderDepartment!""}]">${item.leaderName!""} [${item.leaderDepartment!""}]</span>
                                    <span class="tt-c">出价：${item.leaderScore!""}</span>
                                </span>
                            </div>
                        </div>
                        <div class="gz-xq">
                            <div class="gz-xq-in">
                                <a href="javascript:;" data-role="get">竞拍详情</a>
                            </div>
                        </div>
                    </li>
                <#else>
                    <li class="goods-item">
                        <span class="pic">
                            <span class="pic-c1">
                                <img src="${imageURL}${item.image}" width="217" height="153" alt="${item.name}">
                            </span>
                            <span class="pic-c2">
                                <span class="clearfix">
                                    <span class="name" title="${item.name}">${item.name}</span>
                                    <span class="jiage">￥ ${item.price}</span>
                                </span>
                                <b class="mask"></b>
                            </span>
                        </span>
                        <div class="text">
                            <div class="text-c1">${item.description}</div>
                            <div class="text-c2">该物品流拍</div>
                        </div>
                        <div class="gz-xq">
                            <div class="gz-xq-in">
                                <span class="nob">竞拍详情</span>
                            </div>
                        </div>
                    </li>
                </#if>
            </#list>
        </ul>
    </div>
</@inc.body>
<@inc.footer>
    <script type="text/javascript">
        seajs.use('${jsRoot}/app/history/detail/main.js');
    </script>
</@inc.footer>