<#import '/WEB-INF/template/ftl/inc/admin.ftl' as inc />

<@inc.header '积分系统 - 积分列表管理'>
</@inc.header>

<@inc.body 'page-manage-list'>
    <div class="comm-pn pn-project-list">
        <div class="pn-hd">
            <h1 class="tit">积分列表管理</h1>
        </div>
        <div class="pn-bd">
            <form class="form-inline" id="J_SearchForm">
                <div class="control-box">
                    <div class="control-box-c1">
                        <div class="form-group">
                            <label class="control-label">员工：</label>
                            <input data-widget="select" data-url="selectUsers" data-select="user" name="userno" class="form-control form-control-w2" placeholder="请选择员工">
                        </div>
                        <div class="form-group">
                            <button type="button" class="btn btn2 btn-s" id="J_Search">查询</button>
                        </div>
                    </div>
                    <div class="control-box-c2">
                        <div class="top-box-c2">
                            <button type="button" class="btn btn5 btn-s" id="J_Adds">批量授予</button>
                        </div>
                    </div>
                </div>
            </form>
            <div class="comm-table table-operate">
                <table class="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th style="width:100px;">姓名</th>
                            <th style="width:90px;">工号</th>
                            <th style="width:70px;">性别</th>
                            <th>所属部门</th>
                            <th>职位</th>
                            <th style="width:90px;" class="hand" data-sort="total_score">荣誉积分<i class="btn-up1"></i></th>
                            <th style="width:90px;" class="hand" data-sort="score">可用积分<i class="btn-up"></i></th>
                            <th style="width:90px;" class="hand" data-sort="used_score">已消费积分<i class="btn-up"></i></th>
                            <th style="width:120px;">操作</th>
                        </tr>
                    </thead>
                    <tbody id="J_List"></tbody>
                </table>
            </div>
            <!-- 分页 开始 -->
            <ul class="pagination" id="J_Page"></ul>
            <!-- 分页 结束 -->
        </div>
    </div>
</@inc.body>
<@inc.footer>
    <script type="text/javascript">
        seajs.use('${jsRoot}/app/admin/manage/main.js');
    </script>
</@inc.footer>