package com.greenleaf.common.utils;

import java.beans.BeanInfo;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.Dictionary;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.BeansException;

/**
 * 对象工具类.
 * 
 * @author qingwu
 * @date 2014-1-16 下午6:41:57
 */
public class ObjectUtil {

	/**
	 * 字符串转对象.
	 * 
	 * @param str
	 * @param c
	 * @return
	 * @author qingwu
	 * @date 2014-1-16 下午6:49:33
	 */
	public static Object strToObj(String str, Class<?> rClass) {
		String rType = rClass.getName();
		if ("java.lang.String".equals(rType)) {// 字符串类 型
			return str;
		} else if ("java.lang.Integer".equals(rType) || "int".equals(rType)) {// 整形
			return Integer.parseInt(str);
		} else if ("java.lang.Float".equals(rType) || "float".equals(rType)) {// 浮点型
			return Float.parseFloat(rType);
		} else if ("java.lang.Double".equals(rType) || "double".equals(rType)) {// 双精度
			return Double.parseDouble(str);
		} else if ("java.lang.Boolean".equals(rType) || "boolean".equals(rType)) {// 布尔型
			return Boolean.parseBoolean(str);
		} else if ("java.lang.Long".equals(rType) || "long".equals(rType)) {// Long类型
			return Long.parseLong(str);
		} else if ("java.lang.Short".equals(rType) || "short".equals(rType)) {// Short类型
			return Short.parseShort(str);
		}
		return str;
	}

	/**
	 * One of the following conditions isEmpty = true, else = false :
	 * 满足下列一个条件则为空<br>
	 * 1. null : 空<br>
	 * 2. "" or " " : 空串<br>
	 * 3. no item in [] or all item in [] are null : 数组中没有元素, 数组中所有元素为空<br>
	 * 4. no item in (Collection, Map, Dictionary) : 集合中没有元素<br>
	 * 
	 * @param value
	 * @return
	 * @author qingwu
	 * @date 2014-1-16 下午6:49:33
	 */
	public static boolean isEmpty(Object value) {
		if (value == null) {
			return true;
		}
		if ((value instanceof String)
				&& ((((String) value).trim().length() <= 0) || "null"
						.equalsIgnoreCase((String) value))) {
			return true;
		}
		if ((value instanceof Object[]) && (((Object[]) value).length <= 0)) {
			return true;
		}
		if (value instanceof Object[]) { // all item in [] are null :
			// 数组中所有元素为空
			Object[] t = (Object[]) value;
			for (int i = 0; i < t.length; i++) {
				if (t[i] != null) {
					if (t[i] instanceof String) {
						if (((String) t[i]).trim().length() > 0
								|| "null".equalsIgnoreCase((String) t[i])) {
							return false;
						}
					} else {
						return false;
					}
				}
			}
			return true;
		}
		if ((value instanceof Collection)
				&& ((Collection<?>) value).size() <= 0) {
			return true;
		}
		if ((value instanceof Dictionary)
				&& ((Dictionary<?, ?>) value).size() <= 0) {
			return true;
		}
		if ((value instanceof Map) && ((Map<?, ?>) value).size() <= 0) {
			return true;
		}
		return false;
	}

	/**
	 * list<String>判空
	 * 
	 * @author wangj
	 * @param list
	 * @return
	 */
	public static boolean isEmpty(List<String> list) {
		if (list == null) {
			return true;
		}
		if (list.size() == 0) {
			return true;
		}
		List<String> newStrs = new ArrayList<String>();
		for (String str : list) {
			if (!StringUtils.isEmpty(str)) {
				newStrs.add(str);
			}
		}
		if (newStrs.size() > 0) {
			return false;
		}
		return true;
	}

	/***
	 * Bean的copy方法，使用Spring-BeanUtils.copyProperties方法
	 * 若出现转换异常则抛出CommonRuntimeException
	 * 
	 * @author jianchen 2013-6-13
	 */
	public static Object copyPorperties(Object source, Object target) {
		try {
			BeanUtils.copyProperties(source, target);
		} catch (BeansException e) {
			throw new RuntimeException(
					"ObjectUtil copyProperties bad for src :"
							+ source.toString() + " dest: " + target.toString());
		}
		return target;
	}

	/**
	 * 对象那个转换啊 例如:Game -> simpleGame
	 * 
	 * @param obj
	 * @param clazz
	 * @return
	 */
	public static <M, T> T convertObj(M obj, Class<T> clazz) {
		try {
			T instance = clazz.newInstance();
			ObjectUtil.copyPorperties(obj, instance);
			return instance;
		} catch (InstantiationException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		}
		throw new RuntimeException("convert obj error! source class :"
				+ obj.getClass() + ",target :" + clazz);
	}

	public static <M, T> List<T> convertList(List<M> objList, Class<T> clazz) {
		List<T> list = new ArrayList<T>();
		for (M m : objList) {
			list.add(convertObj(m, clazz));
		}
		return list;
	}

	public static <M, T> List<T> convertList(List<M> objList,
			Converter<M, T> converter) {
		List<T> list = new ArrayList<T>();
		for (M m : objList) {
			list.add(converter.convert(m));
		}
		return list;
	}

	public static interface Converter<H, Q> {
		public Q convert(H h);
	}

	/**
	 * 转换成实体
	 * 
	 * @param clazz
	 * @param mapList
	 * @param <M>
	 * @return
	 */
	public static <M> List<M> toBeanList(Class<M> clazz,
			List<Map<String, Object>> mapList) {
		List<M> objectList = new ArrayList<M>();
		for (Map<String, Object> map : mapList) {
			objectList.add(toBean(clazz, map));
		}
		return objectList;
	}

	/**
	 * 将map值转化成对象, 无递归嵌套
	 * 
	 * @param type
	 * @param map
	 * @return
	 * @author yangz
	 * @date 2012-9-26 下午03:39:54
	 */
	public static <M> M toBean(Class<M> type, Map<String, Object> map) {
		M obj = null;
		try {
			BeanInfo beanInfo = Introspector.getBeanInfo(type); // 获取类属性
			obj = type.newInstance();
			PropertyDescriptor[] propertyDescriptors = beanInfo
					.getPropertyDescriptors();
			for (int i = 0; i < propertyDescriptors.length; i++) {
				PropertyDescriptor descriptor = propertyDescriptors[i];
				String propertyName = descriptor.getName();
				if (map.containsKey(propertyName)) {
					Object value = map.get(propertyName);
					Object[] args = new Object[1];
					args[0] = value;
					descriptor.getWriteMethod().invoke(obj, args);
				}
			}
		} catch (Exception e) {
			RuntimeException ex = new RuntimeException(
					"convent map to object error");
			ex.initCause(e);
			throw ex;
		}
		return obj;
	}

	/**
	 * 将map值转化成对象, 无递归嵌套
	 * 
	 * @param type
	 * @param map
	 * @return
	 * @author yangz
	 * @date 2012-9-26 下午03:39:54
	 */
	public static <M> M addToBean(M obj, Class<M> type, Map<String, Object> map) {
		try {
			BeanInfo beanInfo = Introspector.getBeanInfo(type);
			PropertyDescriptor[] propertyDescriptors = beanInfo
					.getPropertyDescriptors();
			for (int i = 0; i < propertyDescriptors.length; i++) {
				PropertyDescriptor descriptor = propertyDescriptors[i];
				String propertyName = descriptor.getName();
				if (map.containsKey(propertyName)) {
					Object value = map.get(propertyName);
					Object[] args = new Object[1];
					args[0] = value;
					descriptor.getWriteMethod().invoke(obj, args);
				}
			}
		} catch (Exception e) {
			RuntimeException ex = new RuntimeException(
					"convent map to object error");
			ex.initCause(e);
			throw ex;
		}
		return obj;
	}

	/**
	 * 将一个 JavaBean 对象转化为一个 Map.
	 * 
	 * @param bean
	 * @return
	 * @author qingwu
	 * @date 2012-9-26 下午03:40:56
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public static Map<String, Object> toMap(Object bean) {
		Map<String, Object> returnMap;
		try {
			Class<?> type = bean.getClass();
			returnMap = new HashMap<String, Object>();
			BeanInfo beanInfo = Introspector.getBeanInfo(type);
			PropertyDescriptor[] propertyDescriptors = beanInfo
					.getPropertyDescriptors();
			for (int i = 0; i < propertyDescriptors.length; i++) {
				PropertyDescriptor descriptor = propertyDescriptors[i];
				String propertyName = descriptor.getName();
				if (propertyName.equals("serialVersionUID")) {
					continue;
				}
				if (propertyName.equals("class")) {
					continue;
				}
				if (!propertyName.equals(Object.class.getName())) {
					Method readMethod = descriptor.getReadMethod();
					Object result = readMethod.invoke(bean, new Object[0]);
					if (ObjectUtil.isValueType(result)) {
						returnMap.put(propertyName, result);
					} else if (ObjectUtil.isCollection(result)) {
						Collection<?> collectionResult = (Collection<?>) result;
						Collection collection = (Collection) result.getClass()
								.newInstance();
						for (Object o : collectionResult) {
							if (ObjectUtil.isValueType(o)) {
								collection.add(o);
							} else {
								collection.add(toMap(o));
							}
						}
						returnMap.put(propertyName, collection);
					} else if (result.getClass().isArray()) {
						// 不做处理
						// throw new UnCaughtException(
						// "bean property can't be array");
					} else { // 自定义对象
						returnMap.put(propertyName, toMap(result));
					}
				}
			}
		} catch (Exception e) {
			throw new UnCaughtException(e);
		}
		return returnMap;
	}

	/**
	 * 对象是否是值类型.
	 * 
	 * @param obj
	 * @return
	 * @author qingwu
	 * @date 2013-7-9 下午03:01:44
	 */
	@SuppressWarnings("rawtypes")
	public static boolean isValueType(Class rClass) {
		String rType = rClass.getName();
		if ("java.lang.String".equals(rType)) {// 字符串类 型
			return true;
		} else if ("java.lang.Integer".equals(rType) || "int".equals(rType)) {// 整形
			return true;
		} else if ("java.lang.Float".equals(rType) || "float".equals(rType)) {// 浮点型
			return true;
		} else if ("java.lang.Double".equals(rType) || "double".equals(rType)) {// 双精度
			return true;
		} else if ("java.lang.Boolean".equals(rType) || "boolean".equals(rType)) {// 布尔型
			return true;
		} else if ("java.lang.Long".equals(rType) || "long".equals(rType)) {// Long类型
			return true;
		} else if ("java.lang.Short".equals(rType) || "short".equals(rType)) {// Short类型
			return true;
		} else if ("java.sql.Timestamp".equals(rType)) { // Timestamp类型
			return true;
		} else if ("java.util.Date".equals(rType)) { // Date类型
			return true;
		}
		return false;
	}

	/**
	 * 对象是否是值类型.
	 * 
	 * @param obj
	 * @return
	 * @author qingwu
	 * @date 2013-7-9 下午03:01:44
	 */
	@SuppressWarnings("rawtypes")
	public static boolean isValueTypeWithoutDate(Class rClass) {
		String rType = rClass.getName();
		if ("java.lang.String".equals(rType)) {// 字符串类 型
			return true;
		} else if ("java.lang.Integer".equals(rType) || "int".equals(rType)) {// 整形
			return true;
		} else if ("java.lang.Float".equals(rType) || "float".equals(rType)) {// 浮点型
			return true;
		} else if ("java.lang.Double".equals(rType) || "double".equals(rType)) {// 双精度
			return true;
		} else if ("java.lang.Boolean".equals(rType) || "boolean".equals(rType)) {// 布尔型
			return true;
		} else if ("java.lang.Long".equals(rType) || "long".equals(rType)) {// Long类型
			return true;
		} else if ("java.lang.Short".equals(rType) || "short".equals(rType)) {// Short类型
			return true;
		}
		return false;
	}

	/**
	 * 是否是集合.
	 * 
	 * @param obj
	 * @return
	 * @author qingwu
	 * @date 2012-9-26 下午03:50:55
	 */
	public static boolean isCollection(Object obj) {
		if (obj instanceof Collection<?>) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * 对象是否是值类型.
	 * 
	 * @param obj
	 * @return
	 * @author qingwu
	 * @date 2012-9-26 下午03:01:44
	 */
	public static boolean isValueType(Object obj) {
		if (obj == null || obj instanceof String || obj instanceof Number
				|| obj instanceof Boolean || obj instanceof Character
				|| obj instanceof Date) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * 执行set方法.
	 * 
	 * @param obj
	 *            注入bean
	 * @param fieldName
	 *            字段名称
	 * @param value
	 *            值
	 * @author qingwu
	 * @date 2014-1-26 上午9:52:52
	 */
	public static void setField(Object obj, String fieldName, Object value) {
		String setterName = "set" + StringUtils.capitalize(fieldName);
		Method setter;
		try {
			setter = obj.getClass().getMethod(setterName, value.getClass());
			setter.invoke(obj, value);
		} catch (SecurityException e) {
			throw new UnCaughtException(e);
		} catch (NoSuchMethodException e) {
			throw new UnCaughtException(e);
		} catch (IllegalArgumentException e) {
			throw new UnCaughtException(e);
		} catch (IllegalAccessException e) {
			throw new UnCaughtException(e);
		} catch (InvocationTargetException e) {
			throw new UnCaughtException(e);
		}
	}

	/**
	 * 复制list.
	 * 
	 * @param sourceList
	 *            源list
	 * @param targetClass
	 *            目标类型
	 * @return
	 * @author qingwu
	 * @date 2014-2-12 下午4:51:24
	 */
	@SuppressWarnings("rawtypes")
	public static <T> List<T> copyList(List sourceList, Class<T> targetClass) {
		List<T> list = new ArrayList<T>();
		try {
			for (int i = 0; i < sourceList.size(); i++) {
				T o = targetClass.newInstance();
				BeanUtils.copyProperties(sourceList.get(i), o);
				list.add(o);
			}
		} catch (BeansException e) {
			throw new UnCaughtException(e);
		} catch (InstantiationException e) {
			throw new UnCaughtException(e);
		} catch (IllegalAccessException e) {
			throw new UnCaughtException(e);
		}
		return list;
	}

	/**
	 * 获得成员值.
	 * 
	 * @param obj
	 *            对象
	 * @param fieldName
	 *            字段名称
	 * @return
	 * @throws Exception
	 * @author qingwu
	 * @date 2014-2-19 下午1:28:14
	 */
	public static Object getFieldValue(Object obj, String fieldName)
			throws Exception {
		String methodName = "get"
				+ String.valueOf(fieldName.charAt(0)).toUpperCase()
				+ fieldName.substring(1);
		return invokeMethod(obj, methodName, new Object[] {});
	}

	/**
	 * 执行某个对象的方法.
	 * 
	 * @param owner
	 *            对象
	 * @param methodName
	 *            方面名称
	 * @param args
	 *            方法参数
	 * @return
	 * @throws Exception
	 * @author qingwu
	 * @date 2014-2-19 下午1:28:14
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public static Object invokeMethod(Object owner, String methodName,
			Object[] args) throws Exception {
		Class ownerClass = owner.getClass();
		Class[] argsClass = new Class[args.length];
		for (int i = 0, j = args.length; i < j; i++) {
			argsClass[i] = args[i].getClass();
		}
		Method method = ownerClass.getMethod(methodName, argsClass);
		return method.invoke(owner, args);
	}

	/**
	 * 执行某个类的静态方法.
	 * 
	 * @param className
	 *            类型
	 * @param methodName
	 *            方法名称
	 * @param args
	 *            方法参数
	 * @return
	 * @throws Exception
	 * @author qingwu
	 * @date 2014-2-19 下午1:28:14
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public static Object invokeStaticMethod(Class ownerClass,
			String methodName, Object[] args) throws Exception {
		Class[] argsClass = new Class[args.length];
		for (int i = 0, j = args.length; i < j; i++) {
			argsClass[i] = args[i].getClass();
		}
		Method method = ownerClass.getMethod(methodName, argsClass);
		return method.invoke(null, args);
	}
}
