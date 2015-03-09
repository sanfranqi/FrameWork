<#import '/WEB-INF/template/ftl/inc/inc.ftl' as inc />

<@inc.header '积分系统 - 正在拍卖'>
</@inc.header>

<@inc.body 'page-sell'>
    <div class="sell-zw-box">
        <div class="sell-zw-hd">
            <h2 class="tit">当前暂无拍卖</h2>
            <div class="link">
                <a href="/history/index.htm" target="_blank">查看历史拍卖结果</a>
                <span class="sep">|</span>
                <a href="/my.htm" target="_blank">查看我的拍卖纪录</a>
            </div>
        </div>
        <#if auction??>
            <div class="sell-zw-bd">
                <div class="next-jinpai-info">
                    <h3 class="tit">下一场竞拍：${auction.title}</h3>
                    <p>开始: ${auction.startTime?number_to_datetime?string('yyyy-MM-dd HH:mm')}</p>
                    <p>竞拍模式时间：${auction.auctionTime?number_to_datetime?string('yyyy-MM-dd HH:mm')}</p>
                </div>
            </div>
        </#if>
    </div>
</@inc.body>
<@inc.footer>
</@inc.footer>