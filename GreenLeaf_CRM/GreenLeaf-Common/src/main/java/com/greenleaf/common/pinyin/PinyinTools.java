package com.greenleaf.common.pinyin;

import net.sourceforge.pinyin4j.PinyinHelper;
import net.sourceforge.pinyin4j.format.HanyuPinyinCaseType;
import net.sourceforge.pinyin4j.format.HanyuPinyinOutputFormat;
import net.sourceforge.pinyin4j.format.HanyuPinyinToneType;
import net.sourceforge.pinyin4j.format.HanyuPinyinVCharType;

/**
 * 拼音工具.
 * 
 * @author QiSF 2015-03-11
 */
public class PinyinTools {

	/**
	 * 获取拼音首字母
	 * 
	 * @param ch
	 * @return
	 */
	public static String getPinyinHeads(char ch) {
		if (!String.valueOf(ch).matches("[\\u4E00-\\u9FA5]+")) {
			return String.valueOf(ch);
		}

		String[] pinyin = PinyinHelper.toHanyuPinyinStringArray(ch);
		if (pinyin.length > 0 && pinyin[0].length() > 0) {
			return String.valueOf(pinyin[0].charAt(0));
		}
		return String.valueOf(ch);
	}

	/**
	 * 获取拼音,无音调
	 */
	public static String getPinyin(char ch) {
		if (!String.valueOf(ch).matches("[\\u4E00-\\u9FA5]+")) {
			return String.valueOf(ch);
		}

		// 汉语拼音格式输出类
		HanyuPinyinOutputFormat hanYuPinOutputFormat = new HanyuPinyinOutputFormat();

		// 输出设置，大小写，音标方式等
		hanYuPinOutputFormat.setCaseType(HanyuPinyinCaseType.LOWERCASE);
		hanYuPinOutputFormat.setToneType(HanyuPinyinToneType.WITHOUT_TONE);
		hanYuPinOutputFormat.setVCharType(HanyuPinyinVCharType.WITH_V);

		try {
			String[] pinyin = PinyinHelper.toHanyuPinyinStringArray(ch, hanYuPinOutputFormat);
			if (pinyin.length > 0) {
				return pinyin[0];
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return String.valueOf(ch);
	}

}
