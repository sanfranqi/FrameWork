<#import '/WEB-INF/template/ftl/inc/admin.ftl' as inc />

<@inc.header '积分系统 - 拍卖管理'>
    <style type="text/css">
        .dragsort { display: block; float: left; width: 16.6%; height: 144px; background-color: #EDEDED; }
    </style>
</@inc.header>

<@inc.body 'page-manage-auction'>
    <div class="comm-pn pn-project-list">
        <div class="pn-hd">
            <h1 class="tit">拍卖管理</h1>
        </div>
        <div class="pn-bd">
            <form class="form-inline" id="J_Form">
                <div class="control-box">
                    <div class="control-box-c1">
                        <div class="form-group">
                            <label class="control-label">状态：</label>
                            <select class="form-control form-control-w1" name="auctionState">
                                <option value="">全部</option>
                                <option value="1" selected="selected">未开始</option>
                                <option value="2">普通模式</option>
                                <option value="3">竞拍模式</option>
                                <option value="4">结束</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="control-label">主题：</label>
                            <input class="form-control form-control-w15" name="title">
                        </div>
                        <div class="form-group">
                            <label class="control-label">时间段：</label>
                            <input class="form-control form-control-date form-control-w15" name="startTimeStart" id="J_Form_StartTime">
                        </div>
                        <div class="form-group"><span class="henggang">-</span></div>
                        <div class="form-group">
                            <input class="form-control form-control-date form-control-w15" name="endTimeEnd" id="J_Form_EndTime">
                        </div>
                        <div class="form-group">
                            <button type="button" class="btn btn2 btn-s" id="J_Search">查询</button>
                        </div>
                    </div>
                    <div class="btn btn3 btn-s control-box-c2" id="J_Add">添加拍卖</div>
                </div>
            </form>
            <div id="J_List"></div>
            <!-- 分页 开始 -->
            <ul class="pagination" id="J_Page"></ul>
            <!-- 分页 结束 -->
        </div>
    </div>
</@inc.body>
<@inc.footer>
    <script type="text/javascript">
        seajs.use('${jsRoot}/app/admin/auction/main.js');
    </script>
</@inc.footer>