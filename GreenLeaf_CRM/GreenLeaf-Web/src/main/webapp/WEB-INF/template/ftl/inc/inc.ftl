<#include 'inc-global.ftl'>

<#global urlIndex = ctx + '/'>
<#global urlAuction = ctx + '/auction.htm'>
<#global urlHistory = ctx + '/history/index.htm'>
<#global urlMy = ctx + '/my.htm'>
<#global urlRank = ctx + '/rank.htm'>

<#global avatarMale = 'http://ue.17173cdn.com/a/ermp/index/2014/images/pic-male.jpg'>
<#global avatarFemale = 'http://ue.17173cdn.com/a/ermp/index/2014/images/pic-female.jpg'>

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
        <link type="text/css" rel="stylesheet" href="${cssRoot}/common2.css" />
        <link type="text/css" rel="stylesheet" href="${cssRoot}/jifen-ly.css" />
        <link type="text/css" rel="stylesheet" href="${cssRoot}/dialog.css" />
    <#else>
        <link type="text/css" rel="stylesheet" href="${cssRoot}/jifen.min.css" />
    </#if>
    <#nested>
</head>
</#macro>

<#macro body cls pageMode='page'>
<body class="page-jifen ${cls!''}">
    <#-- 引入header -->
    <#include 'header.ftl'>

    <!-- 黑色时间导航条 开始 -->
    <#if pageMode="auctionNormal">
        <div class="fix-time-box">
            <div class="fix-time" id="J_Nav">
                <div class="fix-time-in">
                    <div class="sytime">距离竞拍模式还有：<span id="J_CountDown"></span></div>
                    <div class="quick-refresh mr282"><a href="javascript:;" id="J_Refresh"><i class="ico ico-refresh"></i>快速刷新</a></div>
                </div>
            </div>
        </div>
    <#elseif pageMode="auctionCrazy">
        <div class="fix-time-box">
            <div class="fix-time" id="J_Nav">
                <div class="fix-time-in">
                    <div class="sytime">距离本批次结束还有：<span id="J_CountDown" class="num"></span></div>
                    <div class="next-goods" id="J_NextBatchAwardNames"></div>
                    <div class="person-ico">
                        <a href="javascript:;" id="J_User"><i class="ico ico-plubs"></i></a>
                    </div>
                    <#--<div class="quick-refresh"><a href="javascript:;" id="J_Refresh"><i class="ico ico-refresh"></i>快速刷新</a></div>-->
                </div>
            </div>
        </div>
    </#if>
    <!-- 黑色时间导航条 开始 -->

    <div class="content">
        <div class="content-in">
            <#if pageMode="auctionCrazy">
                <#nested>
            <#else>
                <div class="main">
                    <#nested>
                </div>
                <#-- 引入menu -->
                <#include 'menu.ftl'>
            </#if>
        </div>
    </div>

    <#-- 引入footer -->
    <#include 'footer.ftl'>

    <#-- 返回顶部 -->
    <a href="javascript:;" class="btn-gotop" id="J_BackToTop" style="display: none;"><span><b class="ico ico-jt"></b>返回顶部</span></a>

    <div class="alert-messages" id="J_Message">
        <div class="alert-message ">
            <div class="alert-message-inside">
                <span class="alert-message-text"></span>
                <button type="button" class="close">x</button>
            </div>
        </div>
    </div>
</#macro>

<#macro footer isCrazy=false>
    <script>
        window.ctx = '${ctx!''}';
        window.avatarCtx = '${avatarURL!''}';
        window.attachmentCtx = '${imageURL!''}';
        window.domain = '${domain!''}';
        window.userno = '${userInfo.userno!''}';
    </script>
    <#-- Javascript -->
    <script type="text/javascript" src="${jsRoot}/jquery/1.10.1/jquery.js?v=${version}"></script>
    <script type="text/javascript" src="${seaRoot}/seajs/seajs/2.2.1/sea.js?v=${version}"></script>
    <script type="text/javascript" src="${seaRoot}/seajs/seajs-style/1.0.2/seajs-style.js?v=${version}"></script>
    <script type="text/javascript" src="${seaRoot}/seajs/seajs-text/1.0.2/seajs-text.js?v=${version}"></script>
    <script type="text/javascript" src="${jsRoot}/sea-config.js?v=${version}"></script>
    <script type="text/javascript" src="${jsRoot}/common.js?v=${version}"></script>
    <#if !isCrazy>
        <script type="text/javascript" src="http://ue.17173cdn.com/a/lib/ermpcard-1.0/ermpcard-1.0.min.js" data-currentSystem="jifen"></script>
    </#if>
    <#nested>
</#macro>
</body>
</html>
