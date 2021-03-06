package com.greenleaf.common.utils;

import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;
import java.math.BigDecimal;
import java.security.MessageDigest;
import java.sql.Blob;
import java.sql.SQLException;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.StringTokenizer;
import java.util.Vector;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * String工具.
 * 
 * @author QiSF 2015-03-13
 */
public class StringUtil extends StringUtils {

	/**
	 * Log log.
	 */
	private static final Log log = LogFactory.getLog(StringUtil.class);

	/**
	 * 构造函数.
	 */
	protected StringUtil() {

	}

	/**
	 * 将GBK码转换为Unicode码.
	 */
	public static String gbkToUnicode(final String strIn) {
		String strOut = null;

		if (strIn == null || (strIn.trim()).equals("")) {
			return strIn;
		}
		try {
			final byte[] b = strIn.getBytes("GBK");
			strOut = new String(b, "ISO8859_1");
		} catch (final Exception e) {
		}
		return strOut;
	}

	/**
	 * 将Unicode码字符串转为为GBK码.
	 */
	public static String unicodeToGBK(final String strIn) {
		String strOut = null;

		if (strIn == null || (strIn.trim()).equals("")) {
			return strIn;
		}
		try {
			final byte[] b = strIn.getBytes("ISO8859_1");
			strOut = new String(b, "GBK");
		} catch (final Exception e) {
		}
		return strOut;
	}

	/**
	 * 字符串编码类型转换.
	 */
	public static String encode(final String str, final String oldCharset, final String newCharset) {
		if (str == null) {
			return str;
		}
		String newStr = null;
		try {
			newStr = new String(str.getBytes(oldCharset), newCharset);
		} catch (final Exception e) {
		}
		return newStr;

	}

	/**
	 * 将以sgn为分隔符的字符串转化为数组.
	 */
	public static String[] split(String str, final String sgn) {
		String[] returnValue = null;
		if (!StringUtil.strnull(str).equals("")) {
			final Vector vectors = new Vector();
			int i = str.indexOf(sgn);
			String tempStr = "";
			for (; i >= 0; i = str.indexOf(sgn)) {
				tempStr = str.substring(0, i);
				str = str.substring(i + sgn.length());
				vectors.addElement(tempStr);
			}
			if (!str.equalsIgnoreCase("")) {
				vectors.addElement(str);
			}
			returnValue = new String[vectors.size()];
			for (i = 0; i < vectors.size(); i++) {
				returnValue[i] = (String) vectors.get(i);
				returnValue[i] = returnValue[i].trim();
			}
		}
		return returnValue;
	}

	/**
	 * 把数组转化为字符串.
	 */
	public static String arrayToStr(final String[] array, final String split) {
		if (array == null || array.length < 1) {
			return null;
		}
		final StringBuffer sb = new StringBuffer();
		for (int i = 0; i < array.length; i++) {
			if (i > 0) {
				sb.append(split);
			}
			sb.append(StringUtil.strnull(array[i]));
		}
		return sb.toString();

	}

	/**
	 * @param array
	 *            String[]
	 * @param split
	 *            String
	 */
	public static String arrayToStrWithStr(final String[] array, final String split) {
		return StringUtil.arrayToStrWithStr(array, split, "0");

	}

	/**
     */
	public static String arrayToStrWithStr(final String[] array, final String split, final String optType) {
		if (array == null || array.length < 1) {
			return null;
		}
		final StringBuffer sb = new StringBuffer();

		for (int i = 0; i < array.length; i++) {
			if (i > 0) {
				sb.append(",");
			}
			sb.append("'");
			if (optType.equals("1")) {
				final String temp = StringUtil.strnull(array[i]);
				sb.append(temp.substring(1, temp.length()));
			} else {
				sb.append(StringUtil.strnull(array[i]));
			}
			sb.append("'");

		}
		return sb.toString();

	}

	/**
	 * 将以sgn为分隔符的字符串转化为数组.
	 */
	public static String[] strConvertoArray(final String str, final String sgn) {
		final StringTokenizer st = new StringTokenizer(str, sgn);
		final String[] retstr = new String[st.countTokens()];
		for (int i = 0; st.hasMoreTokens(); i++) {
			retstr[i] = st.nextToken();
		}
		return retstr;
	}

	/**
	 * 将以sgn为分隔符的字符串转化为List链表.
	 */
	public static List strConvertoList(final String str, final String sgn) {
		final StringTokenizer st = new StringTokenizer(str, sgn);
		final List result = new LinkedList();

		for (int i = 0; st.hasMoreTokens(); i++) {
			result.add(st.nextToken());
		}
		return result;
	}

	/**
	 * 1 --> 00001将整数转化为指定长度字符串(lpMaxLength为5).
	 */
	public static String intToStr(final int lpInt, final int lpMaxLength) {
		int length, i;
		String returnValue = "";

		length = Integer.toString(lpInt).length();
		if (length < lpMaxLength) {
			i = lpMaxLength - length;
			while (i > 0) {
				returnValue = returnValue + "0";
				i--;
			}
			returnValue = returnValue + Integer.toString(lpInt);
		} else {
			returnValue = Integer.toString(lpInt);
		}
		return returnValue;
	}

	/**
	 * 将字符集转换成整型.
	 */
	public static int toInt(final String source) {
		try {
			return Integer.parseInt(source);
		} catch (final NumberFormatException notint) {
			return 0;
		}
	}

	/**
	 * 取路径后的文件名，也就是路径字串最后一个斜杠后的字串.
	 */
	public static String getPathFile(final String path) {
		String substr = "";
		try {
			if (path != null && !path.equals("")) {
				final int i = path.lastIndexOf("/");
				substr = path.substring(i + 1).trim();
			}
		} catch (final Exception ex) {
			System.err.println(ex);
		}
		return substr;
	}

	/**
	 * 取小数点后的字串，也就是小数点后的字串.
	 */
	public static String getLastTwo(final String str) {
		String substr = "";
		try {
			if (str != null && !str.equals("")) {
				final int i = str.lastIndexOf(".");
				substr = str.substring(i + 1).trim();
			}
		} catch (final Exception ex) {
			System.err.println(ex);
		}
		return substr;
	}

	/**
	 * 取得文件名的文件类型(如2003001.doc-->doc).
	 */
	public static String getFileType(final String lpFileName) {
		String lpReturnValue = "";

		if (lpFileName != null && !lpFileName.equals("")) {
			final int i = lpFileName.lastIndexOf(".");
			lpReturnValue = lpFileName.substring(i, lpFileName.length());
		}
		return lpReturnValue;
	}

	/**
	 * 返回位于 String 对象中指定位置的子字符串.
	 */
	public static String getSubString(String str, final int beginIndex, final int endIndex) {
		String str1 = "";

		if (str == null) {
			str = "";
		}
		if (str.length() >= beginIndex && str.length() >= endIndex) {
			str1 = str.substring(beginIndex, endIndex);
		} else {
			str1 = str;
		}
		return str1;
	}

	/**
	 * 如果入参是null或者"",用另一入参rpt替代入参返回，否则返回入参的trim().
	 */
	public static String strnull(final String str, final String rpt) {
		if (str == null || str.equals("null") || str.equals("") || str.trim() == null) {
			return rpt;
		} else {
			return str.trim();
		}
	}

	/**
	 * 为检查null值，如果为null，将返回""，不为空时将替换其非html符号.
	 */
	public static String strnull(final String strn) {
		return StringUtil.strnull(strn, "");
	}

	/**
	 * 为检查null值，如果为null，将返回""，不为空时将替换其非html符号.
	 */
	public static String strnull(final Object str) {
		String result = "";
		if (str == null) {
			result = "";
		} else {
			result = str.toString();
		}
		return result;
	}

	/**
	 * 适用于web层 为检查null值，如果为null，将返回"&nbsp;"，不为空时将替换其非html符号.
	 */
	public static String repnull(final String strn) {
		return StringUtil.strnull(strn, "&nbsp;");
	}

	/**
	 * 把Date的转化为字符串，为空时将为"0000-00-00 00:00:00".
	 */
	public static String strnull(final Date strn) {
		String str = "";

		if (strn == null) {
			str = "0000-00-00 00:00:00";
		} else {
			str = strn.toString();
		}
		return (str);
	}

	/**
	 * 把BigDecimal的转换为字符串，为空将返回0.
	 */
	public static String strnull(final BigDecimal strn) {
		String str = "";

		if (strn == null) {
			str = "0";
		} else {
			str = strn.toString();
		}
		return (str);
	}

	/**
	 * 把int的转换为字符串(不为空，只起转换作用).
	 */
	public static String strnull(final int strn) {
		final String str = String.valueOf(strn);
		return (str);
	}

	/**
	 * 把float的转换为字符串(不为空，只起转换作用).
	 */
	public static String strnull(final float strn) {
		final String str = String.valueOf(strn);
		return (str);
	}

	/**
	 * 把long的转换为字符串(不为空，只起转换作用).
	 * 
	 * @param strn
	 *            float
	 * @return String
	 */
	public static String strnull(final long strn) {
		final String str = String.valueOf(strn);
		return (str);
	}

	/**
	 * 把double的转换为字符串(不为空，只起转换作用).
	 */
	public static String strnull(final double strn) {
		final String str = String.valueOf(strn);
		return (str);
	}

	/**
	 * 0-15转化为0-F.
	 */
	public static char hex(final int bin) {
		char retval;
		if (bin >= 0 && bin <= 9) {
			retval = (char) ('0' + bin);
		} else if (bin >= 10 && bin <= 15) {
			retval = (char) ('A' + bin - 10);
		} else {
			retval = '0';
		}
		return retval;
	}

	/**
	 * 字符串替换.
	 */
	public static String replace(final String content, final String oldString, final String newString) {
		if (content == null || oldString == null) {
			return content;
		}
		if (content.equals("") || oldString.equals("")) {
			return content;
		}

		String resultString = "";
		int stringAtLocal = content.indexOf(oldString);
		int startLocal = 0;
		while (stringAtLocal >= 0) {
			resultString = resultString + content.substring(startLocal, stringAtLocal) + newString;
			startLocal = stringAtLocal + oldString.length();
			stringAtLocal = content.indexOf(oldString, startLocal);
		}

		resultString = resultString + content.substring(startLocal, content.length());
		return resultString;
	}

	/**
	 * 替换字符串内容.
	 */
	public static String replaceStr(String strSource, final String strFrom, final String strTo) {
		if (strFrom == null || strFrom.equals("")) {
			return strSource;
		}
		String strDest = "";
		final int intFromLen = strFrom.length();
		int intPos;
		while ((intPos = strSource.indexOf(strFrom)) != -1) {
			strDest = strDest + strSource.substring(0, intPos);
			strDest = strDest + strTo;
			strSource = strSource.substring(intPos + intFromLen);
		}
		strDest = strDest + strSource;
		return strDest;
	}

	/**
     */
	public static String formatToHTML(final String strn) {
		final StringBuffer dest = new StringBuffer();
		if (StringUtil.strnull(strn).equals("")) {
			dest.append("&nbsp;");
		} else {
			for (int i = 0; strn != null && i < strn.length(); i++) {
				final char c = strn.charAt(i);
				if (c == '\n') {
					dest.append("<br>");
				} else if (c == '\'') {
					dest.append("&#39;");
				} else if (c == '\"') {
					dest.append("&#34;");
				} else if (c == '<') {
					dest.append("&lt;");
				} else if (c == '>') {
					dest.append("&gt;");
				} else if (c == '&') {
					dest.append("&amp;");
				} else if (c == 0x20) {
					dest.append("&nbsp;");
				} else {
					dest.append(c);
				}
			}
		}
		return (dest.toString());
	}

	/**
     */
	public static String formatToHTML(final String strn, final int length) {
		int m = 0;
		final StringBuffer dest = new StringBuffer();
		if (StringUtil.strnull(strn).equals("")) {
			dest.append("&nbsp;");
		} else {
			for (int i = 0; strn != null && i < strn.length(); i++) {
				m++;
				if (m == length) {
					dest.append("...");
					break;
				}
				final char c = strn.charAt(i);
				if (c == '\n') {
					dest.append("<br>");
				} else if (c == '\'') {
					dest.append("&#39;");
				} else if (c == '\"') {
					dest.append("&#34;");
				} else if (c == '<') {
					dest.append("&lt;");
				} else if (c == '>') {
					dest.append("&gt;");
				} else if (c == '&') {
					dest.append("&amp;");
				} else if (c == 0x20) {
					dest.append("&nbsp;");
				} else {
					dest.append(c);
				}
			}
		}
		return (dest.toString());
	}

	/**
     */
	public static String formatToHTML(final BigDecimal strb) {
		String strn = "";
		if (strb == null) {
			strn = "&nbsp;";
		} else {
			strn = StringUtil.strnull(strb);
		}
		return strn;
	}

	/**
	 * 将多行字符串转为有带有回车、换行的HTML格式.
	 */
	public static String nl2Br(final String source) {
		if (StringUtil.strnull(source).equals("")) {
			return "&nbsp;";
		}
		final StringBuffer dest = new StringBuffer(source.length());
		for (int i = 0; i < source.length(); i++) {
			char c;
			c = source.charAt(i);
			if (c == '\n') {
				dest.append("<br>");
			} else if (c == 0x20) {
				dest.append("&nbsp;");
			} else {
				dest.append(c);
			}
		}
		return dest.toString();
	}

	/**
     */
	public static boolean findString(final String sourceStr, final String fieldStr) {
		boolean strExist = false;
		if (sourceStr.length() == 0) {
			return strExist;
		}
		if (sourceStr.indexOf(fieldStr) >= 0) {
			strExist = true;
		}
		return strExist;
	}

	/**
     */
	public static String getStackTrace(final Throwable exception) {
		final StringWriter sw = new StringWriter();
		return sw.toString();
	}

	/**
	 * 给字符串数组排序.
	 * 
	 * @param arr
	 *            String[] 要进行排序的字符串数组
	 * @return String[] 排序后的字符串数组
	 */
	public static String[] bubbleSort(final String[] arr) {
		int tag = 1;
		for (int i = 1; i < arr.length && tag == 1; i++) {
			tag = 0;
			for (int j = 0; j < arr.length - i; j++) {
				if (arr[j].compareTo(arr[j + 1]) > 0) {
					final String temp = arr[j];
					arr[j] = arr[j + 1];
					arr[j + 1] = temp;
					tag = 1;
				}
			}
		}
		return arr;
	}

	/**
	 * 依据ValueArr数组的排序，为ContentArr排序.
	 */
	public static String[] bubbleSort(final String[] valueArr, final String[] contentArr) {
		int tag = 1;
		for (int i = 1; i < valueArr.length && tag == 1; i++) {
			tag = 0;
			for (int j = 0; j < valueArr.length - i; j++) {
				if (valueArr[j].compareTo(valueArr[j + 1]) > 0) {
					final String temp1 = valueArr[j];
					final String temp2 = contentArr[j];
					valueArr[j] = valueArr[j + 1];
					contentArr[j] = contentArr[j + 1];
					valueArr[j + 1] = temp1;
					contentArr[j + 1] = temp2;
					tag = 1;
				}
			}
		}
		return valueArr;
	}

	/**
	 * 冒泡排序.
	 */
	public static int[] bubbleSort(final int[] arr) {
		int tag = 1;
		for (int i = 1; i < arr.length && tag == 1; i++) {
			tag = 0;
			for (int j = 0; j < arr.length - i; j++) {
				if (arr[j] > arr[j + 1]) {
					final int temp = arr[j];
					arr[j] = arr[j + 1];
					arr[j + 1] = temp;
					tag = 1;
				}
			}
		}
		return arr;
	}

	/**
	 * 将空字符串转为"0"字符串.
	 */
	public static String nullToZero(String str) {
		if (str == null || str.equals("")) {
			str = "0";
		}
		return str;
	}

	/**
	 * request中获取long类型的参数值.
	 */
	public static long getlongParameter(final HttpServletRequest request, final String paraName) {
		final long value = new Long(StringUtil.nullToZero(request.getParameter(paraName))).longValue();
		return value;
	}

	/**
	 * 从request中获取long类型的参数值.
	 */
	public static Long getLongParameter(final HttpServletRequest request, final String paraName) {
		final Long value = new Long(StringUtil.nullToZero(request.getParameter(paraName)));

		return value;
	}

	/**
	 * 从request中获取int类型的参数值.
	 */
	public static int getIntParameter(final HttpServletRequest request, final String paraName) {
		final int value = Integer.parseInt(StringUtil.nullToZero(request.getParameter(paraName)));
		return value;
	}

	/**
	 * 从request中获取String类型的参数值.
	 */
	public static String getStringParameter(final HttpServletRequest request, final String paraName) {
		final String value = StringUtil.strnull(request.getParameter(paraName));
		return value;
	}

	/**
	 * 返回字段的PO名.
	 */
	public static String getPOFieldName(final String obName) {
		String aFieldName = obName;
		if (aFieldName == null) {
			return null;
		}
		aFieldName = aFieldName.toLowerCase();
		while (aFieldName.indexOf("_") >= 0) {
			if (aFieldName.indexOf("_") >= 0) {
				final int pos = aFieldName.indexOf("_");
				final String low = aFieldName.substring(0, pos);
				final String midd = aFieldName.substring(pos + 1, pos + 2).toUpperCase();
				final String end = aFieldName.substring(pos + 2, aFieldName.length());
				aFieldName = low + midd + end;
			}
		} // end while
		return aFieldName;
	}

	/**
	 * 返回表的PO名.
	 */
	public static String getPOTableName(final String obName) {
		String aTableName = obName;
		if (aTableName == null) {
			return null;
		}
		aTableName = aTableName.toLowerCase();
		while (aTableName.indexOf("_") >= 0) {
			if (aTableName.indexOf("_") >= 0) {
				final int pos = aTableName.indexOf("_");
				final String low = aTableName.substring(0, pos);
				final String midd = aTableName.substring(pos + 1, pos + 2).toUpperCase();
				final String end = aTableName.substring(pos + 2, aTableName.length());
				aTableName = low + midd + end;
			}
		} // end while
		aTableName = aTableName.substring(0, 1).toUpperCase() + aTableName.substring(1, aTableName.length());
		return aTableName;
	}

	/**
	 * Encode a string using algorithm specified in web.xml and return the
	 * resulting encrypted password. If exception, the plain credentials string
	 * is returned
	 * 
	 * @param password
	 *            Password or other credentials to use in authenticating this
	 *            username
	 * @param algorithm
	 *            Algorithm used to do the digest
	 * @return encypted password based on the algorithm.
	 */
	public static String encodePassword(final String password, final String algorithm) {
		final byte[] unencodedPassword = password.getBytes();

		MessageDigest md = null;

		try {
			// first create an instance, given the provider
			md = MessageDigest.getInstance(algorithm);
		} catch (final Exception e) {
			StringUtil.log.error("Exception: " + e);

			return password;
		}

		md.reset();

		// call the update method one or more times
		// (useful when you don't know the size of your data, eg. stream)
		md.update(unencodedPassword);

		// now calculate the hash
		final byte[] encodedPassword = md.digest();

		final StringBuffer buf = new StringBuffer();

		for (final byte element : encodedPassword) {
			if ((element & 0xff) < 0x10) {
				buf.append("0");
			}

			buf.append(Long.toString(element & 0xff, 16));
		}

		return buf.toString();
	}

	/**
	 * 在右边填充字符串.
	 */
	public static String padTrailing(final String rString, final int rLength, final String rPad) {
		String lTmpPad = "";

		final String lTmpStr = StringUtil.strnull(rString);

		if (lTmpStr.length() >= rLength) {
			return lTmpStr.substring(0, lTmpStr.length());
		} else {
			for (int gCnt = 1; gCnt <= rLength - lTmpStr.length(); gCnt++) {
				lTmpPad = rPad + lTmpPad;
			}
		}
		return lTmpStr + lTmpPad;
	}

	/**
	 * 在左边填充字符串.
	 */
	public static String padLeading(final String rString, final int rLength, final String rPad) {
		String lTmpPad = "";

		final String lTmpStr = StringUtil.strnull(rString);

		if (lTmpStr.length() >= rLength) {
			return lTmpStr.substring(0, lTmpStr.length());
		} else {
			for (int gCnt = 1; gCnt <= rLength - lTmpStr.length(); gCnt++) {
				lTmpPad = lTmpPad + rPad;
			}
		}
		return lTmpPad + lTmpStr;
	}

	/**
     */
	public static int contains(final String[] source, final String subStr) {
		for (int i = 0; i < source.length; i++) {
			if (source[i].equals(subStr)) {
				return i;
			}
		}
		return -1;
	}

	/**
	 * 方法功能: 判断一个对象或者是字符串是否为空
	 */
	public static boolean isNullOrEmpty(final Object str) {
		boolean result = false;
		if (str == null || "null".equals(str) || "".equals(str.toString().trim())) {
			result = true;
		}
		return result;
	}

	/**
	 * getLength.
	 */
	public static final int getLength(String str) {
		return str == null ? 0 : str.length();
	}

	/**
	 * 判断是否包括中文字符串.
	 */
	public static boolean isContainChnStr(String str) {
		for (int i = 0; i < str.length(); i++) {
			if (str.substring(i, i + 1).matches("[\\u4e00-\\u9fbb]+")) {
				return true;
			}
		}
		return false;
	}

	/**
	 * 将HTML编码转换成普通字符串
	 */
	public static String strConverFromHtml(String src) {
		StringBuffer sb = new StringBuffer();
		java.util.regex.Pattern p = java.util.regex.Pattern.compile("&[a-zA-Z]*;");
		Matcher m = p.matcher(src);
		int pos1 = 0;
		while (m.find(pos1)) {
			int pos2 = m.start();
			sb.append(src.substring(pos1, pos2));
			String entity = m.group().toLowerCase();
			if ("&#39;".equals(entity)) {
				sb.append("\'");
			} else if ("&#34;".equals(entity)) {
				sb.append("\"");
			} else if ("&lt;".equals(entity)) {
				sb.append("<");
			} else if ("&gt;".equals(entity)) {
				sb.append(">");
			} else if ("&nbsp;".equals(entity)) {
				sb.append(" ");
			} else if ("&amp;".equals(entity)) {
				sb.append("&");
			} else {
				sb.append("[UNKNOWN] ");
			}
			pos1 = m.end();
		}
		sb.append(src.substring(pos1));
		return sb.toString();
	}

	/**
	 * 方法功能: 获取下级的列表格式.
	 */
	public static List<String> getSubXmlList(String inXml, String maskStartStr, String maskEndStr) {

		String tmp = inXml.replace(maskEndStr, maskStartStr);
		tmp += " ";
		String[] list = tmp.split(maskStartStr);
		List ret = new ArrayList<String>();
		for (int i = 0; i < list.length; i++) {
			if (i != 0 && i != list.length - 1 && !list[i].trim().equals("")) {
				ret.add(list[i]);
			}
		}
		return ret;
	}

	/**
	 * 
	 * 方法功能: 去除字符串头尾的空格.
	 */
	public static String strTrim(String source) {
		if (source == null) {
			return null;
		}
		String str = source.trim();
		return str;
	}

	/**
	 * 
	 * 方法功能: . 去除字符之间的空格
	 */
	public static String removeSpace(String str) {
		if (isNullOrEmpty(str)) {
			return "";
		}
		return str.replaceAll(" ", "");
	}

	public static String blob2string(Blob blob) {
		InputStream ins = null;
		String contentString = "";
		try {
			ins = blob.getBinaryStream();
			byte[] c = new byte[(int) blob.length()];
			ins.read(c);
			contentString = new String(c);

		} catch (SQLException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			try {
				if (ins != null) {
					ins.close();
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
			return contentString;
		}

	}

	public static String WORD_SEPARATE = "-";

	/**
	 * 字符串是否存在中文
	 * 
	 * @param str
	 * @return
	 * @author yangz
	 * @date 2012-9-21 下午03:24:33
	 */
	public static boolean isExistZH(String str) {
		String regEx = "[\\u4e00-\\u9fa5]";
		Pattern p = Pattern.compile(regEx);
		Matcher m = p.matcher(str);
		while (m.find()) {
			return true;
		}
		return false;
	}

	public static boolean isAllZH(String str) {
		String regEx = "^[\\u4e00-\\u9fa5]+$";
		Pattern p = Pattern.compile(regEx);
		Matcher m = p.matcher(str);
		return m.matches();
	}

	/**
	 * 字符串第一个字母大写
	 * 
	 * @param s
	 * @return
	 */
	public static String upperFirstChar(String s) {
		if (!isEmpty(s)) {
			return String.valueOf(s.charAt(0)).toUpperCase() + s.substring(1);
		} else {
			return s;
		}
	}

	/**
	 * 字符串第一个字母小写
	 * 
	 * @param s
	 * @return
	 */
	public static String lowerFirstChar(String s) {
		if (!isEmpty(s)) {
			return String.valueOf(s.charAt(0)).toLowerCase() + s.substring(1);
		} else {
			return s;
		}
	}

	/**
	 * 获取第一个大写字母
	 * 
	 * @param s
	 * @return
	 */
	public static String getUpperFirstChar(String s) {
		if (!isEmpty(s)) {
			return String.valueOf(s.charAt(0)).toUpperCase();
		} else {
			return s;
		}
	}

	/**
	 * 四舍五入并去掉科学计数法, 默认小数点2位
	 * 
	 * @param value
	 *            String, double, Double, BigDecimal
	 * @return
	 */
	public static String toNuSicen(Object value) {
		return toNuSicen(value, 2);
	}

	/**
	 * 四舍五入并去掉科学计数法
	 * 
	 * @param value
	 *            String, double, Double, BigDecimal
	 * @param precision
	 *            保留几位小数
	 * @return
	 * @author yangz
	 * @date 2012-7-28 下午03:47:25
	 */
	public static String toNuSicen(Object value, int precision) {
		Object result = "";
		DecimalFormat df = new DecimalFormat();
		df.setMinimumFractionDigits(precision);
		df.setMaximumFractionDigits(precision);
		df.setGroupingUsed(false);
		if (value instanceof BigDecimal) {
			result = value;
		} else if (value instanceof String) {
			result = new BigDecimal(String.valueOf(value));
		} else if (value instanceof Number) {
			result = ValueUtil.getDouble(value);
		} else {
			throw new RuntimeException(value + "need extends Number or String");
		}
		return df.format(result);
	}

	/**
	 * 获取不区分大小写正则Pattern
	 * 
	 * @param value
	 * @return
	 * @author yangz
	 * @date 2012-10-9 下午03:32:33
	 */
	public static Pattern getInsensitivePattern(String value) {
		return Pattern.compile(ValueUtil.getString(value).replaceAll("([\\+\\-\\&\\.\\|\\!\\(\\)\\{\\}\\[\\]\\^\\\"\\~\\*\\?\\:])", "\\\\$1"), Pattern.CASE_INSENSITIVE + Pattern.DOTALL);
		// if(v.matches("[\\u4e00-\\u9fa5|\\w\\s]*")){
		// return Pattern.compile(v, Pattern.CASE_INSENSITIVE + Pattern.DOTALL);
		// }else{
		// return Pattern.compile(UUID.generate(), Pattern.CASE_INSENSITIVE +
		// Pattern.DOTALL); //忽略特殊字符查询
		// }
	}

	/**
	 * 获取指定位数的随机数窜
	 * 
	 * @author jianchen 2013-4-8
	 */
	public static String getRandomAsString(int max, int min) {
		return String.valueOf(Math.round(Math.random() * (max - min) + min));
	}

	/**
	 * 判断字符串数组中是否存在为null or “” 情况
	 * 
	 * @param strs
	 * @return
	 */
	public static boolean hasEmptyStr(String... strs) {
		for (String str : strs) {
			if (isEmpty(str)) {
				return true;
			}
		}
		return false;
	}

	public static boolean allEmptyStr(String... strs) {
		for (String str : strs) {
			if (!isEmpty(str)) {
				return false;
			}
		}
		return true;
	}

	/**
	 * 数组转字符串并用','分隔
	 * 
	 * @param strs
	 * @return
	 */
	public static String arrayToString(String[] strs) {
		if (strs == null || strs.length == 0) {
			return "";
		}

		StringBuilder sb = new StringBuilder();
		for (String str : strs) {
			sb.append(str).append(",");
		}
		return sb.toString().substring(0, sb.toString().length() - 1);
	}
}
