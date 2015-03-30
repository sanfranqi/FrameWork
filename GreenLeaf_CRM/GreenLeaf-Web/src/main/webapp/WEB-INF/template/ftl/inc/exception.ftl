<#include 'global.ftl'>

<#macro header title>
<!DOCTYPE HTML>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>${title!''} - 智管理 · 服务号平台</title>

    <#-- CSS -->
    <#if DEBUG?? && DEBUG>
        <link type="text/css" rel="stylesheet" href="http://ue.17173cdn.com/a/2035/open/2014/css/common.css" />
        <link type="text/css" rel="stylesheet" href="http://ue.17173cdn.com/a/2035/open/2014/css/open.css" />
    <#else>
        <link type="text/css" rel="stylesheet" href="http://ue.17173cdn.com/a/2035/open/2014/css/common.min.css" />
        <link type="text/css" rel="stylesheet" href="http://ue.17173cdn.com/a/2035/open/2014/css/open.min.css" />
    </#if>

    <script type="text/javascript">
        var ctx = '${ctx!''}';
    </script>
    <#nested>
</head>
</#macro>

<#macro body cls>
<body class="${cls!''}">
    <#nested>
</#macro>

<#macro footer>
    <#-- Javascript -->
    <#nested>
</body>
</html>
</#macro>