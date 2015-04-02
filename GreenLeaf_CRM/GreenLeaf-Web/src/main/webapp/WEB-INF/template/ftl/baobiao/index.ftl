<#import '/WEB-INF/template/ftl/inc/inc.ftl' as inc />
<#import '/WEB-INF/template/ftl/inc/sidebar.ftl' as sidebar />

<@inc.header '报表'>
</@inc.header>

<@inc.body 'page-open page-manage-question'>

        <#-- 左侧导航 开始 -->
        <@sidebar.nav 'survey'></@sidebar.nav>
        <#-- 左侧导航 结束 -->

        <#-- 右侧内容 开始 -->
        <@inc.pageContent '报表'>
				
		</@inc.pageContent>
        <#-- 右侧内容 结束 -->

</@inc.body>

<@inc.footer>
	<script>
		jQuery(document).ready(function() {    
		   SideBar.init("menu_baobiao");
		});
	</script>
</@inc.footer>