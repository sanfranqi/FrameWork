<#import '/WEB-INF/template/ftl/inc/inc.ftl' as inc />

<@inc.header '积分系统 - 首页'>
</@inc.header>

<@inc.body 'page-index'>
    <div class="user-box">
        <div class="user-info clearfix">
            <div class="user-detail" id="J_UserInfo"></div>
            <a href="javascript:;" class="zk-search" id="J_OpenSearch"></a>
        </div>
        <div class="user-search">
            <div class="user-search-in">
                <form class="form-inline" role="form" id="J_Form">
                    <div class="form-group">
                        <label>姓名：</label>
                        <input class="form-control form-control-w15" name="userno" id="J_Form_Userno" data-widget="select" data-url="selectUsers" data-select="user" data-placeholder="请选择人员">
                    </div>
                    <div class="form-group">
                        <label>时间段：</label>
                        <input type="text" class="form-control form-control-w2" name="startTime" id="J_Form_StartTime">
                        <span>-</span>
                        <input type="text" class="form-control form-control-w2" name="endTime" id="J_Form_EndTime">
                    </div>
                    <button type="button" class="btn btn-default" id="J_Form_Btn">查询</button>
                    <a href="javascript:;" class="ico ico-change" id="J_CloseSearch"></a>
                </form>
            </div>
        </div>
    </div>
    <!-- end.user-box -->
    <!-- 积分消费明细 开始 -->
    <div class="jfxfmx">
        <div class="hd">
            <h2 class="tit">积分消费明细<span class="time" id="J_Time"></span></h2>
            <ul class="jfxfmx-nav" id="J_Index_Tab">
                <li class="item active" data-operateType=""><a href="javascript:;" data-toggle="tab"><i class="ico ico-jfall"></i><i class="arr"></i>全部</a></li>
                <li class="item" data-operateType="2"><a href="javascript:;" data-toggle="tab"><i class="ico ico-jfsr"></i><i class="arr"></i>收入</a></li>
                <li class="item" data-operateType="1"><a href="javascript:;" data-toggle="tab"><i class="ico ico-jfzc"></i><i class="arr"></i>支出</a></li>
            </ul>
        </div>
        <div class="bd tab-content">
            <table class="table jfxfmx-list">
                <tbody id="J_List"></tbody>
            </table>
        </div>
    </div>
    <!-- 积分消费明细 结束 -->
    <!-- 分页 开始 -->
    <ul class="pagination" id="J_Page"></ul>
    <!-- 分页 结束 -->
</@inc.body>

<@inc.footer>
    <script type="text/javascript">
        seajs.use('${jsRoot}/app/index/main.js');
    </script>
</@inc.footer>