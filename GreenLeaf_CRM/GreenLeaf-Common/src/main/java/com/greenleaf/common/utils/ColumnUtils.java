package com.greenleaf.common.utils;

import java.lang.reflect.Field;

import com.greenleaf.common.mybatis.annotation.Id;
import com.greenleaf.common.mybatis.annotation.Table;

/**
 * 字段操作类.
 * 
 * @author QiSF 2015-03-12
 */
public class ColumnUtils {

	/**
	 * 获取表名.
	 * 
	 * @author QiSF 2015-03-12
	 */
	public final static <M> String getTableName(Class<M> clazz) {
		try {
			Table table = clazz.getAnnotation(Table.class);
			return table.value();
		} catch (Exception e) {
			e.printStackTrace();
		}
		throw new RuntimeException("table name not set!");
	}

	/**
	 * 获取标记了id注解的属性名称
	 * 
	 * @param clazz
	 * @param <M>
	 * @return
	 */
	public final static <M> String getIdFieldName(Class<M> clazz) {
		for (Field field : clazz.getDeclaredFields()) {
			Id idField = field.getAnnotation(Id.class);
			if (idField == null) {
				continue;
			}
			return field.getName();
		}
		throw new RuntimeException("@id field not find ");
	}

}
