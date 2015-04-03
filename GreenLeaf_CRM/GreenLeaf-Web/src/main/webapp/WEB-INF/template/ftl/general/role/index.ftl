<#import '/WEB-INF/template/ftl/inc/inc.ftl' as inc />
<#import '/WEB-INF/template/ftl/inc/sidebar.ftl' as sidebar />

<@inc.header '行政管理'>
</@inc.header>

<@inc.body 'page-open page-manage-question'>

        <#-- 左侧导航 开始 -->
        <@sidebar.nav 'survey'></@sidebar.nav>
        <#-- 左侧导航 结束 -->

        <#-- 右侧内容 开始 -->
		<@inc.pageContent '行政管理' '系统角色管理'>
			<div class="row">
				<div class="col-md-12">
					<!-- BEGIN EXAMPLE TABLE PORTLET-->
					<div class="portlet box light-grey">
						<div class="portlet-title">
							<div class="caption"><i class="fa fa-globe"></i>Role Table</div>
							<div class="tools">
								<#--<a href="javascript:;" class="collapse"></a>
								<a href="#portlet-config" data-toggle="modal" class="config"></a>-->
								<a href="javascript:;" class="reload"></a>
								<#--<a href="javascript:;" class="remove"></a>-->
							</div>
						</div>
						<div class="portlet-body">
							<div class="table-toolbar">
								<div class="btn-group">
									<button id="sample_editable_1_new" class="btn green">
									Add <i class="fa fa-plus"></i>
									</button>
								</div>
								<div class="btn-group pull-right">
									<button class="btn dropdown-toggle" data-toggle="dropdown">Tools <i class="fa fa-angle-down"></i>
									</button>
									<ul class="dropdown-menu pull-right">
										<li><a href="#">Print</a></li>
										<li><a href="#">Save as PDF</a></li>
										<li><a href="#">Export to Excel</a></li>
									</ul>
								</div>
							</div>
							<table class="table table-striped table-bordered table-hover" id="sample_1">
								<thead>
									<tr>
										<th class="table-checkbox"><input type="checkbox" class="group-checkable" data-set="#sample_1 .checkboxes" /></th>
										<th>角色名称</th>
										<th>备&nbsp;&nbsp;注</th>
										<th>操&nbsp;&nbsp;作</th>
									</tr>
								</thead>
								<tbody>
									<tr class="odd gradeX">
										<td><input type="checkbox" class="checkboxes" value="1" /></td>
										<td>shuxer</td>
										<td><a href="mailto:shuxer@gmail.com">shuxer@gmail.com</a></td>
										<td><a href="mailto:shuxer@gmail.com">shuxer@gmail.com</a></td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
					<!-- END EXAMPLE TABLE PORTLET-->
				</div>
			</div>				
		</@inc.pageContent>
</@inc.body>

<@inc.footer>
	<!-- BEGIN CORE PLUGINS -->   
	<script src="/fed/plugins/jquery-1.10.2.min.js" type="text/javascript"></script>
	<script src="/fed/plugins/jquery-migrate-1.2.1.min.js" type="text/javascript"></script>    
	<script src="/fed/plugins/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
	<script src="/fed/plugins/bootstrap-hover-dropdown/twitter-bootstrap-hover-dropdown.min.js" type="text/javascript" ></script>
	<script src="/fed/plugins/jquery-slimscroll/jquery.slimscroll.min.js" type="text/javascript"></script>
	<script src="/fed/plugins/jquery.blockui.min.js" type="text/javascript"></script>  
	<script src="/fed/plugins/jquery.cookie.min.js" type="text/javascript"></script>
	<script src="/fed/plugins/uniform/jquery.uniform.min.js" type="text/javascript" ></script>
	<!-- END CORE PLUGINS -->
	<!-- BEGIN PAGE LEVEL PLUGINS -->
	<script type="text/javascript" src="/fed/plugins/select2/select2.min.js"></script>
	<script type="text/javascript" src="/fed/plugins/data-tables/jquery.dataTables.js"></script>
	<script type="text/javascript" src="/fed/plugins/data-tables/DT_bootstrap.js"></script>
	<!-- END PAGE LEVEL PLUGINS -->
	<!-- BEGIN PAGE LEVEL SCRIPTS -->
	<script src="/fed/app/general/role/role.js"></script> 
	<script>
		jQuery(document).ready(function() {    
		   SideBar.init("menu_role");
		   Role.init();
		});
	</script>
	<!-- END PAGE LEVEL SCRIPTS -->
</@inc.footer>