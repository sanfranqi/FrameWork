package com.greenleaf.common.springmvc;

/**
 * springMVC时间类型的输出格式.
 * 
 * @author QiSF 2015-03-11
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
