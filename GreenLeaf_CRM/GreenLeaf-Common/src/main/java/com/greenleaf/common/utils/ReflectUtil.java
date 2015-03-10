package com.greenleaf.common.utils;

import java.lang.reflect.Field;

/**
 * 反射工具.
 * 
 * @author zhufu
 * @version 2013-7-16 下午2:47:54
 */
public class ReflectUtil {

	/**
	 * 获取obj对象fieldName的Field.
	 * 
	 * @param obj
	 *            对象
	 * @param fieldName
	 *            字段名
	 * @return
	 * @author zhufu
	 * @version 2013-7-16 下午2:47:43
	 */
	public static Field getFieldByFieldName(Object obj, String fieldName) {
		for (Class<?> superClass = obj.getClass(); superClass != Object.class; superClass = superClass
				.getSuperclass()) {
			try {
				return superClass.getDeclaredField(fieldName);
			} catch (NoSuchFieldException e) {
			}
		}
		return null;
	}

	/**
	 * 获取obj对象fieldName的属性值.
	 * 
	 * @param obj
	 *            对象
	 * @param fieldName
	 *            字段名
	 * @return 对象
	 * @throws SecurityException
	 *             SecurityException
	 * @throws NoSuchFieldException
	 *             NoSuchFieldException
	 * @throws IllegalArgumentException
	 *             IllegalArgumentException
	 * @throws IllegalAccessException
	 *             IllegalAccessException
	 * @author zhufu
	 * @version 2013-7-16 下午2:47:05
	 */
	public static Object getValueByFieldName(Object obj, String fieldName)
			throws SecurityException, NoSuchFieldException,
			IllegalArgumentException, IllegalAccessException {
		Field field = getFieldByFieldName(obj, fieldName);
		Object value = null;
		if (field != null) {
			if (field.isAccessible()) {
				value = field.get(obj);
			} else {
				field.setAccessible(true);
				value = field.get(obj);
				field.setAccessible(false);
			}
		}
		return value;
	}

	/**
	 * 设置obj对象fieldName的属性值
	 * 
	 * @param obj
	 * @param fieldName
	 * @param value
	 * @throws SecurityException
	 * @throws NoSuchFieldException
	 * @throws IllegalArgumentException
	 * @throws IllegalAccessException
	 */
	public static void setValueByFieldName(Object obj, String fieldName,
			Object value) throws SecurityException, NoSuchFieldException,
			IllegalArgumentException, IllegalAccessException {
		Field field = getFieldByFieldName(obj, fieldName);
		if (field.isAccessible()) {
			field.set(obj, value);
		} else {
			field.setAccessible(true);
			field.set(obj, value);
			field.setAccessible(false);
		}
	}

}