<div class="side">
    <!-- 个人信息 开始 -->
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
                    <#if userInfo.gender="1">
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
    <!-- 个人信息 结束 -->
    <!-- 积分排行 开始 -->
    <div class="comm-mod mod-rank mod-tab">
        <ul class="nav nav-tabs" id="J_Tab">
            <#if costScoreOrder?? && (costScoreOrder?size>0)>
                <li class="nav-item active"><a href="javascript:void(0);">消费排行榜</a></li>
                <li class="nav-item"><a href="javascript:void(0);">荣誉排行榜</a></li>
            <#else>
                <li class="nav-item active" style="width:100%;"><a href="javascript:void(0);">荣誉排行榜</a></li>
            </#if>
        </ul>
        <div class="tab-content" id="J_TabContent">
            <#if costScoreOrder?? && (costScoreOrder?size>0)>
                <!-- 消费排行榜  开始 -->
                <div class="tab-pane active">
                    <ul class="list-rank js-rank">
                        <#assign costScoreOrderIndex = 1>
                        <#list costScoreOrder as item>
                            <#if costScoreOrderIndex <= 3 >
                                <#if costScoreOrderIndex = 1 >
                                    <#assign costScoreOrderAvatar = item.avatar>
                                    <#if costScoreOrderAvatar = "">
                                        <#if item.gender='1'>
                                            <#assign costScoreOrderAvatar = avatarMale>
                                        <#else>
                                            <#assign costScoreOrderAvatar = avatarFemale>
                                        </#if>
                                    <#else>
                                        <#assign costScoreOrderAvatar = avatarURL + item.avatar>
                                    </#if>
                                    <li class="item top3 top even">
                                        <div class="rank-c1"><em class="num ico-num1"></em></div>
                                        <div class="rank-c2">
                                            <div class="pic"><a href="javascript:;"><img src="${costScoreOrderAvatar}" alt="" class="pic-tx" data-toggle="ermpcard" data-cyuserno="${item.userno}"></a></div>
                                            <div class="info">
                                                <h3 class="title2 js-ui-card-name" data-toggle="ermpcard" data-cyuserno="${item.userno}">${item.name}</h3>
                                                <p class="txt department" title="${item.department}">${item.department}</p>
                                                <p class="txt txt-c1">${item.usedScore}</p>
                                            </div>
                                        </div>
                                    </li>
                                <#else>
                                    <#if costScoreOrderIndex%2=1>
                                        <li class="item top3 even">
                                    <#else>
                                        <li class="item top3">
                                    </#if>
                                        <div class="rank-c1"><em class="num ico-num${costScoreOrderIndex}"></em></div>
                                        <div class="rank-c2">
                                            <div class="message">${item.usedScore}</div>
                                            <div class="title js-ui-card-name" data-toggle="ermpcard" data-cyuserno="${item.userno}">${item.name}</div>
                                        </div>
                                    </li>
                                </#if>
                            <#else>
                                <#if costScoreOrderIndex%2=1>
                                    <li class="item even">
                                <#else>
                                    <li class="item">
                                </#if>
                                    <div class="rank-c1"><em class="num">${costScoreOrderIndex}</em></div>
                                    <div class="rank-c2">
                                        <div class="message">${item.usedScore}</div>
                                        <div class="title js-ui-card-name" data-toggle="ermpcard" data-cyuserno="${item.userno}">${item.name}</div>
                                    </div>
                                </li>
                            </#if>
                            <#assign costScoreOrderIndex = costScoreOrderIndex + 1 >
                        </#list>
                    </ul>
                    <div class="more"><a href="${urlRank}#usedScore" target="_blank">+更多</a></div>
                </div>
                <!-- 消费排行榜  结束 -->
                <!-- 荣誉排行榜  开始 -->
                <div class="tab-pane">
                    <ul class="list-rank js-rank">
                        <#assign scoreOrderIndex = 1>
                        <#list scoreOrder as item>
                            <#if scoreOrderIndex <= 3 >
                                <#if scoreOrderIndex = 1 >
                                    <#assign scoreOrderAvatar = item.avatar>
                                    <#if scoreOrderAvatar = "">
                                        <#if item.gender='1'>
                                            <#assign scoreOrderAvatar = avatarMale>
                                        <#else>
                                            <#assign scoreOrderAvatar = avatarFemale>
                                        </#if>
                                    <#else>
                                        <#assign scoreOrderAvatar = avatarURL + item.avatar>
                                    </#if>
                                    <li class="item top3 top even">
                                        <div class="rank-c1"><em class="num ico-num1"></em></div>
                                        <div class="rank-c2">
                                            <div class="pic"><a href="javascript:;"><img src="${scoreOrderAvatar}" alt="" class="pic-tx" data-toggle="ermpcard" data-cyuserno="${item.userno}"></a></div>
                                            <div class="info">
                                                <h3 class="title2 js-ui-card-name" data-toggle="ermpcard" data-cyuserno="${item.userno}">${item.name}</h3>
                                                <p class="txt department" title="${item.department}">${item.department}</p>
                                                <p class="txt txt-c1">${item.totalScore}</p>
                                            </div>
                                        </div>
                                    </li>
                                <#else>
                                    <#if scoreOrderIndex%2=1>
                                        <li class="item top3 even">
                                    <#else>
                                        <li class="item top3">
                                    </#if>
                                        <div class="rank-c1"><em class="num ico-num${scoreOrderIndex}"></em></div>
                                        <div class="rank-c2">
                                            <div class="message">${item.totalScore}</div>
                                            <div class="title js-ui-card-name" data-toggle="ermpcard" data-cyuserno="${item.userno}">${item.name}</div>
                                        </div>
                                    </li>
                                </#if>
                            <#else>
                                <#if scoreOrderIndex%2=1>
                                    <li class="item even">
                                <#else>
                                    <li class="item">
                                </#if>
                                    <div class="rank-c1"><em class="num">${scoreOrderIndex}</em></div>
                                    <div class="rank-c2">
                                        <div class="message">${item.totalScore}</div>
                                        <div class="title js-ui-card-name" data-toggle="ermpcard" data-cyuserno="${item.userno}">${item.name}</div>
                                    </div>
                                </li>
                            </#if>
                            <#assign scoreOrderIndex = scoreOrderIndex + 1 >
                        </#list>
                    </ul>
                    <div class="more"><a href="${urlRank}#totalScore" target="_blank">+更多</a></div>
                </div>
                <!-- 荣誉排行榜  结束-->
            <#else>
                <!-- 荣誉排行榜  开始 -->
                <div class="tab-pane active">
                    <ul class="list-rank js-rank">
                        <#assign scoreOrderIndex = 1>
                        <#list scoreOrder as item>
                            <#if scoreOrderIndex <= 3 >
                                <#if scoreOrderIndex = 1 >
                                    <#assign scoreOrderAvatar = item.avatar>
                                    <#if scoreOrderAvatar = "">
                                        <#if item.gender='1'>
                                            <#assign scoreOrderAvatar = avatarMale>
                                        <#else>
                                            <#assign scoreOrderAvatar = avatarFemale>
                                        </#if>
                                    <#else>
                                        <#assign scoreOrderAvatar = avatarURL + item.avatar>
                                    </#if>
                                    <li class="item top3 top even">
                                        <div class="rank-c1"><em class="num ico-num1"></em></div>
                                        <div class="rank-c2">
                                            <div class="pic"><a href="javascript:;"><img src="${scoreOrderAvatar}" alt="" class="pic-tx" data-toggle="ermpcard" data-cyuserno="${item.userno}"></a></div>
                                            <div class="info">
                                                <h3 class="title2 js-ui-card-name" data-toggle="ermpcard" data-cyuserno="${item.userno}">${item.name}</h3>
                                                <p class="txt department" title="${item.department}">${item.department}</p>
                                                <p class="txt txt-c1">${item.totalScore}</p>
                                            </div>
                                        </div>
                                    </li>
                                <#else>
                                    <#if scoreOrderIndex%2=1>
                                        <li class="item top3 even">
                                    <#else>
                                        <li class="item top3">
                                    </#if>
                                        <div class="rank-c1"><em class="num ico-num${scoreOrderIndex}"></em></div>
                                        <div class="rank-c2">
                                            <div class="message">${item.totalScore}</div>
                                            <div class="title js-ui-card-name" data-toggle="ermpcard" data-cyuserno="${item.userno}">${item.name}</div>
                                        </div>
                                    </li>
                                </#if>
                            <#else>
                                <#if scoreOrderIndex%2=1>
                                    <li class="item even">
                                <#else>
                                    <li class="item">
                                </#if>
                                    <div class="rank-c1"><em class="num">${scoreOrderIndex}</em></div>
                                    <div class="rank-c2">
                                        <div class="message">${item.totalScore}</div>
                                        <div class="title js-ui-card-name" data-toggle="ermpcard" data-cyuserno="${item.userno}">${item.name}</div>
                                    </div>
                                </li>
                            </#if>
                            <#assign scoreOrderIndex = scoreOrderIndex + 1 >
                        </#list>
                    </ul>
                    <div class="more"><a href="${urlRank}#totalScore" target="_blank">+更多</a></div>
                </div>
                <!-- 荣誉排行榜  结束-->
            </#if>
        </div>
    </div>
    <!-- 积分排行 结束 -->
</div>