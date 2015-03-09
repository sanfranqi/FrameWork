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
    <#if DEBUG?? && DEBUG>
        <link type="text/css" rel="stylesheet" href="${cssRoot}/bootstrap.css" />
        <link type="text/css" rel="stylesheet" href="${cssRoot}/common.css" />
        <link type="text/css" rel="stylesheet" href="${cssRoot}/jifen-ht.css" />
        <link type="text/css" rel="stylesheet" href="${cssRoot}/selectize.bootstrap3.css" />
        <link type="text/css" rel="stylesheet" href="${cssRoot}/dialog.css" />
    <#else>
        <link type="text/css" rel="stylesheet" href="${cssRoot}/jifen-ht.min.css" />
    </#if>

    <script>
        window.ctx = '${ctx!''}';
        window.avatarCtx = '${avatarURL!''}';
        window.attachmentCtx = '${imageURL!''}';
        window.domain = '${domain}';
        window.userno = '${userInfo.userno}';
    </script>
    <#nested>
</head>
</#macro>

<#macro body cls>
<body class="page-jifen-ht page-project ${cls!''}">
    <!-- 头部 开始 -->
    <div class="header">
        <!-- logo 开始 -->
        <a href="javascript:;" class="logo"><img src="http://ue1.17173cdn.com/a/ermp/index/2014/images/logo.png" alt=""></a>
        <!-- logo 结束 -->
        <!-- 主导航 开始 -->
        <div class="nav-box">
            <ul class="nav-box-in clearfix">
                <li class="nav-item nav-item1">
                    <a href="javascript:;" class="nav-con">拍卖管理<b class="mask"></b></a>
                </li>
            </ul>
        </div>
        <!-- 主导航 结束 -->
        <!-- 消息中心 开始 -->
        <div class="message-center-box" id="J_MessageBox">
            <i class="ico ico-message"></i>
            <i class="ico ico-message-hint"></i>
            <b class="mask"></b>
        </div>
        <!-- 消息中心 结束 -->
        <!-- 登录 开始 -->
        <div class="login-info-box">
            当前登录：<span class="name">${userInfo.name}</span>
        </div>
        <!-- 登录 结束 -->
        <!-- 退出 开始 -->
        <a href="javascript:;" class="btn-logout" id="J_Logout"><i class="ico ico-logout"></i>退出<b class="mask"></b></a>
        <!-- 退出 结束 -->
    </div>
    <!-- 头部 结束 -->
    <!-- 主体内容 开始 -->
    <div class="content">
    	<div class="content-in">
    	    <#nested>
    	</div>
    </div>
    <!-- 主体内容 结束 -->
    <!-- 左侧导航 开始 -->
    <div class="side">
    	<ul class="side-nav">
    	    <#if allowURL?? && allowURL?index_of('/admin/manage.htm')!=-1>
                <li class="side-nav-item side-nav-item1">
                    <a href="${urlManage}" class="side-nav-con"><i class="ico ico-project1"></i>积分列表管理</a>
                    <b class="mask"></b>
                </li>
    		</#if>
    		<#if allowURL?? && allowURL?index_of('/admin/log.htm')!=-1>
                <li class="side-nav-item side-nav-item2">
                    <a href="${urlLog}" class="side-nav-con"><i class="ico ico-change1"></i>积分变更日志</a>
                    <b class="mask"></b>
                </li>
    		</#if>
    		<#if allowURL?? && allowURL?index_of('/admin/auction.htm')!=-1>
                <li class="side-nav-item side-nav-item3">
                    <a href="${urlAuction}" class="side-nav-con"><i class="ico ico-change2"></i>拍卖管理</a>
                    <b class="mask"></b>
                </li>
    		</#if>
    	</ul>
    </div>
    <!-- 左侧导航 结束 -->
    <div class="bg-top"><b class="bg-pic"></b></div>
    <div class="bg-bottom"><b class="bg-pic"></b></div>

    <div class="alert-messages" id="J_Message">
        <div class="alert-message ">
            <div class="alert-message-inside">
                <span class="alert-message-text"></span>
                <button type="button" class="close">x</button>
            </div>
        </div>
    </div>
</#macro>

<#macro footer>
    <#-- Javascript -->
    <script type="text/javascript" src="${jsRoot}/jquery/1.10.1/jquery.js?v=${version}"></script>
    <script type="text/javascript" src="${seaRoot}/seajs/seajs/2.2.1/sea.js?v=${version}"></script>
    <script type="text/javascript" src="${seaRoot}/seajs/seajs-style/1.0.2/seajs-style.js?v=${version}"></script>
    <script type="text/javascript" src="${seaRoot}/seajs/seajs-text/1.0.2/seajs-text.js?v=${version}"></script>
    <script type="text/javascript" src="${jsRoot}/sea-config.js?v=${version}"></script>
    <script type="text/javascript" src="http://ue.17173cdn.com/a/lib/ermpdock-1.0/ermpdock-1.0.min.js?v=${version}"></script>
    <script type="text/javascript" src="http://ue.17173cdn.com/a/lib/ermpmessage-1.0/ermpmessage-1.0.min.js?v=${version}"></script>
    <script type="text/javascript" src="${jsRoot}/admin.js?v=${version}"></script>
    <#nested>
</#macro>
</body>
</html>