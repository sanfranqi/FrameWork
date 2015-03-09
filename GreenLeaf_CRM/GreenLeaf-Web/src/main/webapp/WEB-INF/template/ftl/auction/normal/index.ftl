<#import '/WEB-INF/template/ftl/inc/inc.ftl' as inc />

<@inc.header '积分系统 - 正在拍卖'>
</@inc.header>

<@inc.body 'page-sell' 'auctionNormal'>
<div class="sell-box mod-tab">
    <div class="hd">
        <ul class="nav nav-tabs" id="J_AuctionTabs">
            <li class="nav-item active" data-role="all"><a href="javascript:;">全部奖品</a></li>
            <li class="nav-item" data-role="follow"><a href="javascript:;">我的关注</a></li>
            <li class="nav-item" data-role="able"><a href="javascript:;">我可竞拍的</a></li>
        </ul>
    </div>
    <div class="bd tab-content clearfix">
        <ul class="sell-goods-item" id="J_List"></ul>
    </div>
</div>
</@inc.body>
<@inc.footer>
    <script type="text/javascript">
        <#if auction??>
            window.auctionId = ${auction.id!0};
            window.auctionTime = ${auction.auctionTime?c!0};
        </#if>
        seajs.use('${jsRoot}/app/auction/normal/main.js');
    </script>
</@inc.footer>