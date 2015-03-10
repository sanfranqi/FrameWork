package com.greenleaf.common.springmvc;

/**
 * springMVC时间类型的输出格式.
 * 
 * @author qingwu
 * @date 2014-2-25 上午10:48:05
 */
public class JsonDateFormat {

	public static String formatString = "yyyy-MM-dd HH:mm:ss";

	/**
	 * @return the formatString
	 */
	public String getFormatString() {
		return formatString;
	}

	/**
	 * @param formatString
	 *            the formatString to set
	 */
	@SuppressWarnings("static-access")
	public void setFormatString(String formatString) {
		this.formatString = formatString;
	}

}
