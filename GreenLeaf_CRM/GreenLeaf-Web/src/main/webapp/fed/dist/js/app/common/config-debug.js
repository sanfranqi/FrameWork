define("app/common/config-debug", [], {
    //首页
    indexList: "scoreRecord/queryFrontScoreRecordList.do",
    indexUser: "score/queryUserScore.do",
    //历史拍卖
    historyList: "auction/query.do",
    historyDetail: "auctionRecord/queryByAwardId.do",
    //排行榜
    rankList: "score/userScoreList.do",
    //我的奖品
    myAward: "award/queryAwardPage.do",
    //拍卖
    systemTime: "auction/systemTime.do",
    auction: "auctionRecord/bidAward.do",
    //拍卖-普通模式
    queryMyScore: "auctionRecord/currentScore.do",
    normalQueryAll: "award/queryAwardNormalState.do",
    normalQueryAble: "award/queryAwardAble.do",
    normalQueryFollow: "award/queryFocusAward.do",
    normalQueryAllRefresh: "awardLeader/queryAwardLeaderByAuction.do",
    normalQueryAbleRefresh: "awardLeader/getMyLeaderInfoList.do",
    normalQueryFollowRefresh: "awardLeader/getFocusLeaderInfoList.do",
    normalFollow: "awardFocus/add.do",
    normalUnfollow: "awardFocus/delete.do",
    //拍卖-疯狂模式
    crazyQuery: "auction/crazy/refreshAll.do",
    crazyRefresh: "auction/crazy/refresh.do",
    //后台-下拉
    selectUsers: "select/users.do",
    selectSystems: "select/systems.do",
    //后台-积分列表管理
    adminScoreQuery: "score/query.do",
    adminScoreAdd: "score/increase.do",
    adminScoreImport: "score/importScoreList.do",
    adminScoreDeduct: "score/decrease.do",
    //后台-积分变更日志
    logQuery: "scoreRecord/query.do",
    //后台-拍卖管理
    auctionQuery: "auction/query.do",
    auctionDelete: "auction/delete.do",
    auctionAdd: "auction/add.do",
    auctionUpdate: "auction/update.do",
    auctionGet: "auction/get.do",
    auctionAwardResult: "award/queryAwardResult.do",
    auctionAwardGet: "award/get.do",
    auctionAwardQuery: "award/queryAwardResult.do",
    auctionAwardAdd: "award/add.do",
    auctionAwardUpdate: "award/update.do",
    auctionAwardDelete: "award/delete.do",
    auctionAwardUploadImage: "award/uploadImage.do",
    auctionAwardImports: "award/addByFile.do",
    auctionAwardSort: "award/sort.do"
});
