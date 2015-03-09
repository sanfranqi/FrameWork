<#include 'inc-global.ftl'>

<#global urlManage = ctx + '/admin/manage.htm'>
<#global urlLog = ctx + '/admin/log.htm'>
<#global urlAuction = ctx + '/admin/auction.htm'>

<#macro header title>
<!DOCTYPE HTML>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>${title!''}</title>
    <#-- CSS -->
    <link type="text/css" rel="stylesheet" href="http://ue.17173cdn.com/a/ermp/index/2014/css/page-error.css" />
    <#nested>
</head>
</#macro>

<#macro body cls>
<body class="page-error ${cls!''}">
    <div class="content">
    	<div class="content-in">
    		<h1><a href="#" target="_blank" class="logo"><img src="http://ue2.17173cdn.com/a/ermp/index/2014/images/logo.png" alt=""></a></h1>
    		<div class="error-info-box">
                <#nested>
    		</div>
    	</div>
    </div>
    <div class="footer">
    	<div class="copyright">Copyright &copy;<span class="year">${.now?string("yyyy")}</span> 17173. All rights reserved.</div>
    </div>
</#macro>

<#macro footer>
    <#-- Javascript -->
    <script type="text/javascript" src="${jsRoot}/jquery/1.10.1/jquery.js?v=${version}"></script>
    <#nested>
</#macro>
</body>
</html>