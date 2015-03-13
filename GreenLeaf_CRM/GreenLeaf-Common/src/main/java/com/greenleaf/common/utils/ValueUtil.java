package com.greenleaf.common.utils;

import java.math.BigDecimal;

import org.apache.log4j.Logger;

/**
 * 数据类型工具类.
 * 
 * @author QiSF 2015-03-13
 */
public class ValueUtil {
	private static final Logger log = Logger.getLogger(ValueUtil.class);

	/**
	 * 值对象 --> String
	 * 
	 * @param value
	 * @return
	 */
	public static String getString(Object value) {
		String result = "";
		if (!ObjectUtil.isEmpty(value)) {
			String sValue = value.toString().trim();
			if (value instanceof Number) {
				if (value instanceof Double || value instanceof BigDecimal) {
					if (!"Infinity".equals(sValue) && !"NaN".equals(sValue)) {
						result = StringUtil.toNuSicen(value);
					} else {
						result = "0";
					}
				} else {
					result = sValue;
				}
			} else {
				result = sValue;
			}
		}
		return result.trim();
	}

	/**
	 * 值对象 --> long
	 * 
	 * @param value
	 * @return
	 */
	public static long getLong(Object value) {
		try {
			return Long.parseLong(getString(value));
		} catch (Exception e) {
			return 0L;
		}
	}

	/**
	 * 值对象 --> double
	 * 
	 * @param value
	 * @return
	 */
	public static double getDouble(Object value) {
		try {
			return Double.parseDouble(getString(value));
		} catch (Exception e) {
			return 0.0;
		}
	}

	/**
	 * 值对象 --> int
	 * 
	 * @param value
	 * @return
	 */
	public static int getInt(Object value) {
		try {
			return Integer.parseInt(getString(value));
		} catch (Exception e) {
			return 0;
		}
	}

	/**
	 * 值对象 --> boolean
	 * 
	 * @param value
	 * @return
	 */
	public static boolean getBoolean(Object value) {
		try {
			String v = getString(value);
			if ("1".equals(v)) {
				return true;
			} else if ("0".equals(v)) {
				return false;
			} else if ("Y".equals(v)) {
				return true;
			} else if ("N".equals(v)) {
				return false;
			} else {
				return Boolean.parseBoolean(v);
			}
		} catch (Exception e) {
			return false;
		}
	}

	/**
	 * 值对象 --> BigDecimal.
	 * 
	 * @param value
	 * @return
	 */
	public static BigDecimal getBigDecimal(Object value) {
		return new BigDecimal(getString(value));
	}

	/**
	 * 判断值是否是0 null 或者其他
	 * 
	 * @param value
	 * @return boolean
	 */
	public static boolean isNullOrZero(Integer value) {
		try {
			String v = getString(value);
			if ("0".equals(v)) {
				return true;
			} else if ("null".equals(v)) {
				return true;
			} else {
				return false;
			}
		} catch (Exception e) {
			return false;
		}
	}
}
