<#import '/WEB-INF/template/ftl/inc/inc.ftl' as inc />

<@inc.header '积分系统 - 排行榜'>
</@inc.header>

<@inc.body 'page-rank'>

<!-- 积分排行榜  开始 -->
<div class="jfxfmx jfrank">
    <div class="hd">
        <h2 class="tit">积分排行榜</h2>
        <ul class="jfxfmx-nav jfrank-nav" id="J_Rank_Tab">
            <li class="item active" data-sort="totalScore"><a href="javascript:;"><i class="ico ico-jfry"></i><i class="arr"></i>荣誉积分</a></li>
            <li class="item" data-sort="usedScore"><a href="javascript:;"><i class="ico ico-jfxf"></i><i class="arr"></i>消费积分</a></li>
            <li class="item" data-sort="score"><a href="javascript:;"><i class="ico ico-jfky"></i><i class="arr"></i>可用积分</a></li>
        </ul>
        <div class="myrank">
            <a href="javascript:;" id="J_My">我的排名</a>
        </div>
    </div>
    <div class="bd tab-content tab-rank">
        <table class="table jfxfmx-list">
            <thead>
                <tr class="border-none">
                    <th style="width:90px;">排名</th>
                    <th style="width:120px;">姓名</th>
                    <th>所属部门</th>
                    <th style="width:100px;">积分</th>
                </tr>
            </thead>
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
        seajs.use('${jsRoot}/app/rank/main.js');
    </script>
</@inc.footer>