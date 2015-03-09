<#import '/WEB-INF/template/ftl/inc/admin.ftl' as inc />

<@inc.header '积分系统 - 积分变更日志'>
</@inc.header>

<@inc.body 'page-change-log'>
    <div class="comm-pn pn-project-list">
        <div class="pn-hd">
            <h1 class="tit">积分变更日志</h1>
        </div>
        <div class="pn-bd">
            <form class="form-inline" id="J_Form">
                <div class="top-box" style="overflow:visible;">
                    <div class="form-group">
                        <label class="control-label">类型：</label>
                        <select class="form-control form-control-w15" name="operateType">
                            <option value="">全部</option>
                            <option value="1">扣除</option>
                            <option value="2">授予</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="control-label">时间段：</label>
                        <input class="form-control form-control-date form-control-w15" id="J_Form_StartTime" name="startTime">
                    </div>
                    <div class="form-group"><span class="henggang">-</span></div>
                    <div class="form-group">
                        <input class="form-control form-control-date form-control-w15" id="J_Form_EndTime" name="endTime">
                    </div>
                    <div class="form-group">
                        <label class="control-label">备注信息：</label>
                        <input class="form-control form-control-w15" name="comments">
                    </div>
                    <div class="form-group">
                        <label class="control-label">系统：</label>
                        <input data-widget="select" data-url="selectSystems" class="form-control form-control-w15" name="systemCode" placeholder="请选择系统">
                    </div>
                    <div class="form-group">
                        <label class="control-label">操作者：</label>
                        <input data-widget="select" data-url="selectUsers" data-select="user" class="form-control form-control-w18" name="operateUserno" placeholder="请选择操作者">
                    </div>
                    <div class="form-group">
                        <label class="control-label">操作对象：</label>
                        <input data-widget="select" data-url="selectUsers" data-select="user" class="form-control form-control-w18" name="userno" placeholder="请选择操作对象">
                    </div>
                    <div class="form-group">
                        <button type="button" class="btn btn2 btn-s" id="J_Search">查询</button>
                    </div>
                </div>
                <div class="comm-table table-operate">
                    <table class="table table-bordered table-striped table-hover">
                        <thead>
                        <tr>
                            <th style="width:170px;">时间</th>
                            <th style="width:120px;">系统</th>
                            <th style="width:150px;">操作者</th>
                            <th style="width:150px;">操作对象</th>
                            <th style="width:100px;">操作类型</th>
                            <th style="width:120px;">积分</th>
                            <th>备注</th>
                        </tr>
                        </thead>
                        <tbody id="J_List"></tbody>
                    </table>
                </div>
            </form>
            <!-- 分页 开始 -->
            <ul class="pagination" id="J_Page"></ul>
            <!-- 分页 结束 -->
        </div>
    </div>
</@inc.body>
<@inc.footer>
    <script type="text/javascript">
        seajs.use('${jsRoot}/app/admin/log/main.js');
    </script>
</@inc.footer>