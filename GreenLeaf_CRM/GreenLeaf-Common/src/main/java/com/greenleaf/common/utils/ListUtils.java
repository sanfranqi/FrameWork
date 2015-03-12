package com.greenleaf.common.utils;

import java.util.ArrayList;
import java.util.List;

/**
 * ListUtils.
 * 
 * @author QiSF 2015-03-12
 */
public class ListUtils {

	/**
	 * 获取list里面单个对象的单个属性重新组装成一个list
	 *
	 * @param list
	 * @param columnName
	 * @param columnType
	 * @param <T>
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public static <T> List<T> getListItemsSingleColumnList(List<?> list, String columnName, Class<T> columnType) {
		List<T> returnList = new ArrayList<T>();
		if (!ObjectUtil.isEmpty(list)) {
			for (Object object : list) {
				Object columnObject = ClassUtil.readProperty(object, columnName);
				if (columnObject != null) {
					returnList.add((T) columnObject);
				}
			}
		}
		return returnList;
	}
}
