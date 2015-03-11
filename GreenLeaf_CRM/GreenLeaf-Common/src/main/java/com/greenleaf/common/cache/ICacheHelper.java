package com.greenleaf.common.cache;

/**
 * Cache 部分工具类.
 * 
 * @author QiSF 2015-03-11
 */
public class ICacheHelper {

	/**
	 * 一分钟的毫秒数
	 */
	private final static int ONE_MINUTE = 60 * 1000;
	/**
	 * 一天的毫秒数
	 */
	private final static int ONE_HOUR = ONE_MINUTE * 1000;

	/**
	 * 一天的毫秒数
	 */
	private final static int ONE_DAY = ONE_HOUR * 24;

	private final static String DOT = ".";

	/**
	 * 用 “.” 连接每个key.
	 */
	public static String combineKeys(String... names) {
		StringBuilder sb = new StringBuilder();
		for (String name : names) {
			sb.append(name).append(DOT);
		}
		String key = sb.toString();
		return key.substring(0, key.length() - 1);
	}

	/**
	 * 根据分钟计算缓存时间.
	 */
	public static int getCacheMinute(int minute) {
		return ONE_MINUTE * minute;
	}

	/**
	 * 根据小时计算缓存时间.
	 */
	public static int getCacheHours(int hour) {
		return ONE_HOUR * hour;
	}

	/**
	 * 根据天计算缓存时间.
	 */
	public static int getCacheDays(int day) {
		return ONE_DAY * day;
	}

}
