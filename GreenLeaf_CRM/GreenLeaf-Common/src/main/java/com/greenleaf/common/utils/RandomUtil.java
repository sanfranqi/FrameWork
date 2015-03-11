package com.greenleaf.common.utils;

import java.util.Random;

import org.apache.commons.lang.ArrayUtils;

/**
 * <p>
 * Description:随机数工具类.
 * </p>
 * <p>
 * Company:cyou
 * </p>
 * 
 * @author shanfengqi
 * @date 2013-8-28
 * @version V1.0
 */
public class RandomUtil {

	/**
	 * 小写英文字母数组
	 */
	private static final String[] RANDOM_LOWER_ALPHABET = { "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z" };
	/**
	 * 大写英文字母数组
	 */
	private static final String[] RANDOM_UPPER_ALPHABET = { "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" };
	/**
	 * 数字数组
	 */
	private static final String[] RANDOM_NUMBER = { "0", "1", "2", "3", "4", "5", "6", "7", "8", "9" };
	/**
	 * 大小写英文字母数组
	 */
	private static final String[] RANDOM_ALPHABET = (String[]) ArrayUtils.addAll(RANDOM_LOWER_ALPHABET, RANDOM_UPPER_ALPHABET);
	/**
	 * 大小写英文字母和数字数组
	 */
	private static final String[] RANDOM_ALPHABET_NUMBER = (String[]) ArrayUtils.addAll(RANDOM_ALPHABET, RANDOM_NUMBER);

	/**
	 * 随机获英文字母字符串.
	 * 
	 * @param randomLength
	 *            字符串长度
	 * @return 随机英文字母字符串.
	 * @author shanfengqi
	 * @date 2013-8-28 上午11:28:28
	 */
	public static String getRandomAlphabet(int randomLength) {
		return getRandom(randomLength, RANDOM_ALPHABET);
	}

	/**
	 * 随机获取小写英文字母字符串.
	 * 
	 * @param randomLength
	 *            字符串长度
	 * @return 随机小写英文字母字符串.
	 * @author shanfengqi
	 * @date 2013-8-28 上午11:28:28
	 */
	public static String getRandomLowerAlphabet(int randomLength) {
		return getRandom(randomLength, RANDOM_LOWER_ALPHABET);
	}

	/**
	 * 随机获取大写英文字母字符串.
	 * 
	 * @param randomLength
	 *            字符串长度
	 * @return 随机大写英文字母字符串.
	 * @author shanfengqi
	 * @date 2013-8-28 上午11:28:28
	 */
	public static String getRandomUpperAlphabet(int randomLength) {
		return getRandom(randomLength, RANDOM_UPPER_ALPHABET);
	}

	/**
	 * 随机获取数字字符串.
	 * 
	 * @param randomLength
	 *            字符串长度
	 * @return 随机数字字符串.
	 * @author shanfengqi
	 * @date 2013-8-28 上午11:28:28
	 */
	public static String getRandomNumber(int randomLength) {
		return getRandom(randomLength, RANDOM_NUMBER);
	}

	/**
	 * 随机获取字母数字字符串.
	 * 
	 * @param randomLength
	 *            字符串长度
	 * @return 随机字母数字字符串.
	 * @author shanfengqi
	 * @date 2013-8-28 上午11:28:28
	 */
	public static String getRandomAlphabetNumber(int randomLength) {
		return getRandom(randomLength, RANDOM_ALPHABET_NUMBER);
	}

	/**
	 * 随机获取字符串.
	 * 
	 * @param randomLength
	 *            字符串长度
	 * @param arr
	 *            字符串数组
	 * @return 随机字符串.
	 * @author shanfengqi
	 * @date 2013-8-28 上午11:58:25
	 */
	private static String getRandom(int randomLength, String[] arr) {
		String str = "";
		for (int i = 0; i < randomLength; i++) {
			Random rd = new Random();
			str = str + arr[rd.nextInt(arr.length - 1)];
		}
		return str;
	}
}
