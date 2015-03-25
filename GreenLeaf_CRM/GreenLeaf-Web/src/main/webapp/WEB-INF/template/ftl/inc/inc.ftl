<#include 'global.ftl'>

<#macro header title>
<!DOCTYPE HTML>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>${title!''} - 自管理 · 服务号平台</title>

    <#-- CSS -->
    <link type="text/css" rel="stylesheet" href="${ctx}/fed/css/common.min.css" />
    <link type="text/css" rel="stylesheet" href="${ctx}/fed/css/open.min.css" />

    <script type="text/javascript">
        var ctx = '${ctx!''}';
        var version = '${version}';
        var root = '${jsRoot + '/'}';
        var imageURL = '${imageURL!''}';
        var userImagePath = '${userImagePath!''}';
        var rewardDomainUrl = '${rewardDomainUrl!''}';
        <#if userInfo??>
            var userId = '${userInfo.id?c}';
        </#if>
        <#if simpleServiceTagVo??>
            var serviceTagId = '${simpleServiceTagVo.id?c}';
        </#if>
    </script>

    <#nested>
</head>
</#macro>

<#macro body cls>
<body class="${cls!''}">
    <div class="header">
        <div class="header-in">
            <a href="javascript:;" class="logo"><img src="${ctx}/images/logo.png" class="logo-pic" alt="服务号平台"><span class="title">自管理 · 服务号平台</span></a>
            <#if user??>
                <div class="user">${userInfo.userName} / <a id="J_Logout" href="javascript:;"  class="link">退出</a></div>
            </#if>
        </div>
    </div>

    <#nested>

    <div class="footer">
    	<div>Copyright &copy;<span class="year">${.now?string("yyyy")}</span> 2035创新社区 游戏化管理</div>
    	<div>All Rights Reserved.</div>
    </div>

    <div class="pop" id="J_Message" style="position:fixed; top:-80px; left:50%; margin-left:-300px;">
        <div class="pop-main">
            <div class="pop-in">
                <span class="tit"></span>
                <button type="button" class="pop-close">×</button>
            </div>
        </div>
    </div>

    <div id="J_Loading" style="display:none;">
        <div class="dialog" style="width:300px;top:100px;left:50%;margin-left:-150px;z-index:1501;">
        	<div class="dialog-main">
        		<div class="dialog-con">
        			<div class="dialog-loading">
        				<img src="${ctx}/images/loading.gif" alt="提交中" width="64" height="64">
        				<div class="tit">卖力加载中...</div>
        			</div>
        		</div>
        	</div>
        </div>
        <div class="dialog-mask" style="position:fixed;top:0;bottom:0;left:0;width:100%;z-index:1500;"></div>
    </div>
</#macro>

<#macro footer>
    <#-- Javascript -->
    <script type="text/javascript" src="${jsRoot}/jquery/1.10.1/jquery.js?v=${version}"></script>
    <script type="text/javascript" src="${seaRoot}/seajs/seajs/2.2.1/sea.js?v=${version}"></script>
    <script type="text/javascript" src="${seaRoot}/seajs/seajs-style/1.0.2/seajs-style.js?v=${version}"></script>
    <script type="text/javascript" src="${seaRoot}/seajs/seajs-text/1.0.2/seajs-text.js?v=${version}"></script>
    <script type="text/javascript" src="${jsRoot}/sea-config.js?v=${version}"></script>
    <#nested>
</body>
</html>
</#macro>