package com.greenleaf.common.utils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 集合工具类.
 * @author yangz
 * @date 2013-5-6 上午12:46:48
 */
public class CollectionUtil {
	/**
	 * 数组转列表ArrayList.<br>
	 * 主要因为Array.asList()是不可修改集合.
	 * @param array
	 * @return
	 * @author yangz
	 * @date 2013-5-6 上午12:48:07
	 */
	public static <T> List<T> asList(T... array){
		List<T> result = new ArrayList<T>();
		for (T t : array) {
			result.add(t);
		}
		return result;
	}
	/**
	 * 空map.
	 * @return
	 * @author yangz
	 * @date 2013-6-4 上午10:17:59
	 */
	public static <K, V> Map<K, V> emptyMap(){
		return new HashMap<K, V>();
	}
	/**
	 * 空list.
	 * @return
	 * @author yangz
	 * @date 2013-6-4 上午10:17:51
	 */
	public static <T> List<T> emptyList(){
		return new ArrayList<T>();
	}
	
	/**
	 * 判断list是否为空.
	 * @param list
	 * @return
	 * @author ChenST
	 * @date 2014年4月16日 下午9:13:44
	 */
	public static boolean isEmpty(List list) {
		if (list != null && list.size() != 0) {
			return false;
		}
		return true;
	}
}
