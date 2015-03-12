package com.greenleaf.common.utils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 集合工具类.
 * 
 * @author QiSF 2015-03-12
 */
public class CollectionUtil {
	/**
	 * 数组转列表ArrayList.<br>
	 * 主要因为Array.asList()是不可修改集合.
	 * 
	 * @param array
	 * @return
	 */
	public static <T> List<T> asList(T... array) {
		List<T> result = new ArrayList<T>();
		for (T t : array) {
			result.add(t);
		}
		return result;
	}

	/**
	 * 空map.
	 * 
	 * @return
	 */
	public static <K, V> Map<K, V> emptyMap() {
		return new HashMap<K, V>();
	}

	/**
	 * 空list.
	 * 
	 * @return
	 */
	public static <T> List<T> emptyList() {
		return new ArrayList<T>();
	}

	/**
	 * 判断list是否为空.
	 * 
	 * @param list
	 * @return
	 */
	public static boolean isEmpty(List list) {
		if (list != null && list.size() != 0) {
			return false;
		}
		return true;
	}
}
