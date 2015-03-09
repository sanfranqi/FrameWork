<#import '/WEB-INF/template/ftl/inc/exception.ftl' as inc />

<@inc.header '积分系统 - 404'>
</@inc.header>

<@inc.body 'page-error1'>
    <span class="info"><span id="J_Countdown" class="num">5</span>秒后自动返回首页</span><a href="/" class="link">立即返回首页</a>
</@inc.body>
<@inc.footer>
    <script type="text/javascript" src="${jsRoot}/404.js"></script>
</@inc.footer>