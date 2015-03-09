<div class="header">
	<div class="header-in">
		<h1 class="logo-box"><a href="${urlIndex}" class="logo" title=""><img src="http://ue2.17173cdn.com/a/jifen/index/2014/img/logo.png" alt=""></a></h1>
		<div class="sys-name">
			积分系统
		</div>	
		<#-- 主导航 开始 -->
		<div class="nav-box">
			<ul class="nav nav-pills">
				<li class="nav-item nav-item1"><a href="${urlIndex}" class="nav-con">首页<i class="ico"></i></a><span class="sep">|</span></li>
				<li class="nav-item nav-item2"><a href="${urlAuction}" class="nav-con">正在拍卖<i class="ico"></i></a><span class="sep">|</span></li>
				<li class="nav-item nav-item3"><a href="${urlHistory}" class="nav-con">历史拍卖<i class="ico"></i></a><span class="sep">|</span></li>
				<li class="nav-item nav-item4"><a href="${urlRank}" class="nav-con">排行榜<i class="ico"></i></a><span class="sep">|</span></li>
				<li class="nav-item nav-item5">
				    <a href="${urlMy}" class="nav-con">我的奖品<i class="ico"></i></a>
				    <#if allowURL?? && allowURL!="">
				        <span class="sep">|</span>
                    </#if>
                </li>
                <#if allowURL?? && allowURL!="">
                    <#assign adminUrl = allowURL>
                    <#if allowURL?index_of(",")!=-1>
                        <#assign adminUrl = allowURL?substring(0,allowURL?index_of(","))>
                    </#if>
				    <li class="nav-item nav-item6"><a href="${adminUrl}" target="_blank" class="nav-con">后台管理<i class="ico"></i></a></li>
				</#if>
			</ul>
		</div>
		<#-- 主导航 结束 -->
	</div>	
</div>