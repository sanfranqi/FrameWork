<#import '/WEB-INF/template/ftl/inc/inc.ftl' as inc />

<@inc.header '积分系统 - 正在拍卖'>
</@inc.header>

<@inc.body 'page-sell' 'auctionCrazy'>
    <!-- 个人信息 浮窗 开始 -->
    <div class="per-info-fix" id="J_UserInfo" style="display: none; z-index:100;">
        <div class="comm-mod per-info-box">
            <div class="detail-box">
                <div class="pic-box">
                    <#assign userAvatar = userInfo.avatar>
                    <#if userAvatar = "">
                        <#if userInfo.gender='1'>
                            <#assign userAvatar = avatarMale>
                        <#else>
                            <#assign userAvatar = avatarFemale>
                        </#if>
                    <#else>
                        <#assign userAvatar = avatarURL + userInfo.avatar>
                    </#if>
                    <img src="${userAvatar}" alt="" class="pic" width="90" height="90">
                </div>
                <div class="detail">
                    <div class="info">
                        <div class="per-name">${userInfo.name}</div>
                        <#if userInfo.gender='1'>
                            <i class="ico ico-male"></i>
                        <#else>
                            <i class="ico ico-female"></i>
                        </#if>
                        <a href="javascript:;" class="btn-logout" id="J_Logout">[注销]</a>
                    </div>
                    <p class="txt department" title="${userInfo.department}">${userInfo.department}</p>
                    <p class="txt">${userInfo.position}</p>
                </div>
            </div>
            <div class="message-box">
                <div class="message">
                    <div class="ico-box" title="可用积分">
                        <i class="ico ico-star"></i>
                    </div>
                    <p class="txt" title="${userInfo.score}">${userInfo.score}</p>
                </div>
                <div class="message">
                    <div class="ico-box" title="消费积分">
                        <i class="ico ico-money"></i>
                    </div>
                    <p class="txt" title="${userInfo.usedScore}">${userInfo.usedScore}</p>
                </div>
                <div class="message">
                    <div class="ico-box" title="荣誉积分">
                        <i class="ico ico-jf"></i>
                    </div>
                    <p class="txt" title="${userInfo.totalScore}">${userInfo.totalScore}</p>
                </div>
            </div>
        </div>
    </div>
    <!-- 个人信息 浮窗 结束 -->

    <div class="jinpai" id="J_SlideBtn">
        <a href="javascript:;" class="pre" data-role="prev"></a>
        <a href="javascript:;" class="now" data-role="now"></a>
        <a href="javascript:;" class="next" data-role="next"></a>
        <div class="tooltip fade right in" style="top: 0px; left: 50px; display: none;" id="J_Slide_Tip"><div class="tooltip-arrow"></div><div class="tooltip-inner" id="J_Slide_TipContent"></div></div>
    </div>

    <!-- 左侧内容 开始 -->
    <div class="sell-crazy clearfix">
        <div class="sell-crazy-c" id="J_Slide">
            <p style="width:970px;height:300px;line-height:300px;text-align:center;">加载中...</p>
        </div>
    </div>
    <!-- 左侧内容 结束 -->

</@inc.body>
<@inc.footer true>
    <script type="text/javascript">
        window.userScore = ${userInfo.score?c!0};
        seajs.use('${jsRoot}/app/auction/crazy/main.js');
    </script>
</@inc.footer>