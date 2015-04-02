<#import '/WEB-INF/template/ftl/inc/exception.ftl' as inc />

<@inc.header '404'>
</@inc.header>

<@inc.body 'page-open page-error'>
    <div class="content">
    	<div class="content-in">
    		<a href="#" class="logo">
    		    <img src="http://ue1.17173cdn.com/a/2035/open/2014/img/logo.png" class="logo-pic" alt="服务号平台">
    		    <span class="title">自管理 · 服务号平台</span>
            </a>
    		<div class="error-box error-box2">
    			<div class="error-info">
    				<h1 class="tit">SORRY 网络开小差了，稍后再试试吧...</h1>
    				<div class="countdown"><div class="num" id="J_Countdown">5</div><div class="txt">秒后自动返回首页</div></div>
    				<a href="/index.html" class="link">立即返回首页</a>
    			</div>
    		</div>
    	</div>
    </div>

    <div class="footer">
        <div>Copyright &copy;<span class="year">${.now?string("yyyy")}</span> 2035创新社区 游戏化管理</div>
        <div>All Rights Reserved.</div>
    </div>
</@inc.body>
<@inc.footer>
	<script src="/fed/plugins/jquery-1.10.2.min.js" type="text/javascript"></script>
    <script type="text/javascript" src="/fed/app/common/error.js"></script>
</@inc.footer>