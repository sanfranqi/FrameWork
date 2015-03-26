package com.greenleaf.common.utils;

import java.beans.BeanInfo;
import java.beans.IntrospectionException;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.lang.reflect.Field;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.apache.log4j.Logger;

import com.greenleaf.common.exception.UnCaughtException;

/**
 * Class工具类.
 * 
 * @author QiSF 2015-03-12
 */
public class ClassUtil {

	private static final Logger log = Logger.getLogger(ClassUtil.class);

	/**
	 * 是否是值类型
	 * 
	 * @param clz
	 * @return
	 */
	public static boolean isValueType(Class<?> clz) {
		try {
			if (clz != null) {
				if (clz.isPrimitive() || Number.class.isAssignableFrom(clz) || Character.class.isAssignableFrom(clz) || String.class.isAssignableFrom(clz) || Date.class.isAssignableFrom(clz)
						|| Boolean.class.isAssignableFrom(clz)) {
					return true;
				} else {
					return false;
				}
			} else {
				throw new RuntimeException("Class can't be null");
			}
		} catch (Exception e) {
			log.error("在判断是否是值类型的时候出现了异常：", e);
			return false;
		}
	}

	/**
	 * 实例化
	 * 
	 * @param className
	 * @return
	 */
	public static Object newInstance(String className) {
		Object result = null;
		try {
			result = newInstance(Class.forName(className));
		} catch (Exception e) {
			RuntimeException ex = new RuntimeException();
			ex.initCause(e);
			throw ex;
		}
		return result;
	}

	/**
	 * 实例化
	 * 
	 * @param c
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	public static Object newInstance(Class c) {
		Object result = null;
		try {
			result = c.newInstance();
		} catch (Exception e) {
			RuntimeException ex = new RuntimeException();
			ex.initCause(e);
			throw ex;
		}
		return result;
	}

	/**
	 * 获取字段, 找不到字段抛异常
	 * 
	 * @param clz
	 * @param fieldName
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	public static Field getField(Class clz, String fieldName) {
		return getField(clz, fieldName, true);
	}

	/**
	 * 缓存Field
	 */
	private final static Map<String, Field> fieldCache = new ConcurrentHashMap<String, Field>();

	/**
	 * 获取字段, 找不到字段可返回null exception=false时
	 * 
	 * @param clz
	 * @param fieldName
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	public static Field getField(Class clz, String fieldName, boolean exception) {
		String key = clz.getName() + " - " + fieldName;
		Field f = fieldCache.get(key);
		if (f != null) {
			return f;
		}

		for (; clz != Object.class; clz = clz.getSuperclass()) {
			try {
				if (!Object.class.getName().equals(clz.getName())) {
					Field field = clz.getDeclaredField(fieldName);
					fieldCache.put(key, field);
					return field;
				}
			} catch (NoSuchFieldException e) {
				// DO NOTHING
			}
		}

		if (exception) {
			throw new RuntimeException("no such field in " + clz.getName());
		}
		return null;
	}

	/**
	 * 取泛型类型
	 * 
	 * @param type
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	public static Type[] getActualTypes(Type type) {
		if (type instanceof ParameterizedType) {
			ParameterizedType t = (ParameterizedType) type;
			Type[] types = t.getActualTypeArguments();
			if (ObjectUtil.isEmpty(types)) {
				throw new RuntimeException(((Class) type).getName() + " not have ActualType.");
			}
			return types;
		} else if (type instanceof Class) {
			Type[] types = null;
			if (isCGLibProxy((Class) type)) {// 是否是CGLib代理对象
				Class proxyType = (Class) ((Class) type).getGenericSuperclass(); // 代理类
				types = ((ParameterizedType) proxyType.getGenericSuperclass()).getActualTypeArguments();
			} else {
				types = ((ParameterizedType) ((Class) type).getGenericSuperclass()).getActualTypeArguments();
			}
			if (ObjectUtil.isEmpty(types)) {
				throw new RuntimeException(((Class) type).getName() + " not have ActualType.");
			}
			return types;
		} else {
			throw new RuntimeException("type error.");
		}
	}

	/**
	 * 是否是cglib代理类
	 * 
	 * @param type
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	public static boolean isCGLibProxy(Class type) {
		return type.getName().contains("EnhancerByCGLIB");
	}

	/**
	 * 取泛型类型
	 * 
	 * @param type
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public static <T> Class<T> getActualType(Type type) {
		return (Class<T>) getActualTypes(type)[0];
	}

	/**
	 * 泛型对象中是否有指定属性
	 * 
	 * @param clz
	 * @param propertyName
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	public static boolean actualTypeHasProperty(Class clz, String propertyName) {
		try {
			Field field = getField(getActualType(clz), propertyName, false);
			if (field != null) {
				return true;
			}
		} catch (Exception e) {
			log.error("在泛型对象中是否有指定属性的方法中出现了异常：", e);
		}
		return false;
	}

	/**
	 * 是否有指定属性
	 * 
	 * @param clz
	 * @param propertyName
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	public static boolean hasProperty(Class clz, String propertyName) {
		try {
			Field f = getField(clz, propertyName, false);
			if (f != null) {
				return true;
			}
		} catch (Exception e) {
			log.error("在是否有指定属性的方法中出现了异常：", e);

		}
		return false;
	}

	public static boolean isProperty(Class clz, String property) {
		try {
			PropertyDescriptor descriptor = getProperty(Introspector.getBeanInfo(clz), property);
			if (descriptor != null) {
				return true;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}

	/**
	 * 获取属性类型
	 * 
	 * @param beanInfo
	 * @param property
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	public static Class getPropertyType(BeanInfo beanInfo, String property) {
		return getProperty(beanInfo, property).getPropertyType();
	}

	/**
	 * 获取属性字段
	 * 
	 * @param beanInfo
	 * @param property
	 * @return
	 */
	public static PropertyDescriptor getProperty(BeanInfo beanInfo, String property) {
		PropertyDescriptor[] propertys = beanInfo.getPropertyDescriptors();
		for (PropertyDescriptor propertyDescriptor : propertys) {
			if (propertyDescriptor.getName().equals(property) && !"class".equals(property)) {
				return propertyDescriptor;
			}
		}
		return null;
	}

	/**
	 * 获取属性字段
	 * 
	 * @param beanClass
	 * @param property
	 * @return
	 */
	public static PropertyDescriptor getProperty(Class<?> beanClass, String property) {
		try {
			return getProperty(Introspector.getBeanInfo(beanClass), property);
		} catch (IntrospectionException e) {
			throw new RuntimeException(e);
		}
	}

	/**
	 * 读取属性值
	 * 
	 * @param property
	 * @return
	 */
	public static Object readProperty(Object obj, String property) {
		try {
			return getProperty(obj.getClass(), property).getReadMethod().invoke(obj);
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	/**
	 * 强行值类型转换.
	 * 
	 * @param value
	 * @param type
	 * @return
	 */
	public static Object castValue(Object value, Class<?> type) {
		if (int.class.isAssignableFrom(type) || Integer.class.isAssignableFrom(type)) {
			return ValueUtil.getInt(value);
		} else if (long.class.isAssignableFrom(type) || Long.class.isAssignableFrom(type)) {
			return ValueUtil.getLong(value);
		} else if (double.class.isAssignableFrom(type) || Double.class.isAssignableFrom(type)) {
			return ValueUtil.getDouble(value);
		} else if (boolean.class.isAssignableFrom(type) || Boolean.class.isAssignableFrom(type)) {
			return ValueUtil.getBoolean(value);
		} else if (String.class.isAssignableFrom(type)) {
			return ValueUtil.getString(value);
		} else if (Date.class.isAssignableFrom(type)) {
			return value instanceof Date ? value : DateUtil.parseDate(ValueUtil.getString(value), "yyyy-MM-dd HH:mm:ss");
		} else if (char.class.isAssignableFrom(type) || Character.class.isAssignableFrom(type)) {
			return (char) ValueUtil.getInt(value);
		} else {
			throw new UnCaughtException("unknow value type:" + type);
		}
	}

}
