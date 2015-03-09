<#import '/WEB-INF/template/ftl/inc/inc.ftl' as inc />

<@inc.header '积分系统 - 历史拍卖'>
</@inc.header>

<@inc.body 'page-history'>
    <!-- 历史拍卖 开始-->
    <div class="sell-history">
        <ul class="clearfix" id="J_List"></ul>
    </div>
    <!-- 历史拍卖 结束-->
    <!-- 历史拍卖暂无 开始-->
    <div class="sell-zw-box" id="J_None" style='display:none;'>
        <div class="sell-zw-hd">
            <h2 class="tit">暂无历史拍卖</h2>
        </div>
    </div>
    <!-- 历史拍卖暂无 结束-->
    <!-- 分页 开始 -->
    <ul class="pagination" id="J_Page">
    </ul>
    <!-- 分页 结束 -->
</@inc.body>
<@inc.footer>
    <script type="text/javascript">
        seajs.use('${jsRoot}/app/history/index/main.js');
    </script>
</@inc.footer>