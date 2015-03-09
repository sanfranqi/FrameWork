<#import '/WEB-INF/template/ftl/inc/inc.ftl' as inc />

<@inc.header '积分系统 - 我的奖品'>
</@inc.header>

<@inc.body 'page-mygift'>
    <div id="J_Main"></div>
</@inc.body>
<@inc.footer>
    <script type="text/javascript">
        seajs.use('${jsRoot}/app/my/main.js');
    </script>
</@inc.footer>