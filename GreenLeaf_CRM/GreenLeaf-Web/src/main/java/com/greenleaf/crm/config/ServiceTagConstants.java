package com.greenleaf.crm.config;


import com.greenleaf.common.context.ApplicationContextUtil;

public class ServiceTagConstants {

	/**
	 * 用户组类型：好友组
	 */
	public static String GROUP_TYPE_FRIEND = "10";
	/**
	 * 用户组类型：黑名单
	 */
	public static String GROUP_TYPE_BLACKLIST = "11";
	/**
	 * 用户组类型：自定义
	 */
	public static String GROUP_TYPE_CUSTOM = "12";

    public static String DOMAIN_URL= ApplicationContextUtil.getBean(SystemConfig.class).getDomainUrl();

    public static String ADMINUSERIDS = ApplicationContextUtil.getBean(SystemConfig.class).getAdmins();

    public static String MATRIXURL = ApplicationContextUtil.getBean(SystemConfig.class).getMartixUrl();

    public static String REWARD_URL = ApplicationContextUtil.getBean(SystemConfig.class).getRewardUrl();

    public static String FILE_IMAGEPATH = ApplicationContextUtil.getBean(SystemConfig.class).getFileImagePath();

    public final static String DEFAULT_LOGIN_TYPE = "2";

    public final static String GROUP_FRIEND_NAME = "好友分组";

    public final static String GROUP_BLACK_NAME = "黑名单";

    // 服务号头像类型
    public static String AVATAR_LARGE = "big.jpg";// 大头像
    public static String AVATAR_MEDIUM = "middle.jpg";// 中等头像
    public static String AVATAR_SMALL = "small.jpg";// 小头像
    public static String AVATAR_MIN = "min.jpg";// 小头像
    public static Integer AVATAR_LARGE_SIZE = 180;// 大头像
    public static Integer AVATAR_MEDIUM_SIZE = 128;// 中等头像
    public static Integer AVATAR_SMALL_SIZE = 50;// 小头像
    public static Integer AVATAR_MINI_SIZE = 30;// 迷你头像

}
