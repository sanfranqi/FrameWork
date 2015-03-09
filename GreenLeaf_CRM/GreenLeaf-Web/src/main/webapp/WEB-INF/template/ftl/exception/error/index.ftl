<#import '/WEB-INF/template/ftl/inc/exception.ftl' as inc />

<@inc.header '积分系统 - Error'>
</@inc.header>

<@inc.body 'page-error2'>
    <div class="info">${message!'对不起，服务器异常！'}</div>
    <a href="/" class="link">返回首页</a>
</@inc.body>
<@inc.footer>
    <script type="text/javascript" src="${jsRoot}/404.js"></script>
</@inc.footer>