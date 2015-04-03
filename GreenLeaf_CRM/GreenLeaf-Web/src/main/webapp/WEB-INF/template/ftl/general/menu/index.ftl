<#import '/WEB-INF/template/ftl/inc/inc.ftl' as inc />
<#import '/WEB-INF/template/ftl/inc/sidebar.ftl' as sidebar />

<@inc.header '行政管理'>
</@inc.header>

<@inc.body 'page-open page-manage-question'>

        <#-- 左侧导航 开始 -->
        <@sidebar.nav 'survey'></@sidebar.nav>
        <#-- 左侧导航 结束 -->

        <#-- 右侧内容 开始 -->
		<@inc.pageContent '行政管理' '系统菜单管理'>
				
		</@inc.pageContent>
</@inc.body>

<@inc.footer>
	<script>
		jQuery(document).ready(function() {    
		   SideBar.init("menu_menu");
		});
	</script>
</@inc.footer>