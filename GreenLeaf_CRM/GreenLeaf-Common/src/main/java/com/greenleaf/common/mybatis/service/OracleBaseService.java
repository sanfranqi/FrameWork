package com.greenleaf.common.mybatis.service;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContextAware;

import com.greenleaf.common.mybatis.bean.Query;
import com.greenleaf.common.utils.ColumnUtils;

public class OracleBaseService<T> extends BaseService<T> implements ApplicationContextAware {

	private final static Logger logger = LoggerFactory.getLogger(OracleBaseService.class);

	public OracleBaseService() {
		super();
	}

	/**
	 * 插入对象
	 * 
	 * @param obj
	 * @return
	 */
	public T insert(T obj) {
		try {
			getDAO().insert(obj);
			obj = attachIdForObject(obj);
			return obj;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 获取单个
	 * 
	 * @param id
	 * @return
	 */
	public T get(Integer id) {
		if (id == null) {
			return null;
		}

		try {
			Query query = Query.build(t);
			query.addEq(ColumnUtils.getIdFieldName(t), new BigDecimal(id));
			List<T> objects = findByQuery(query);
			if (objects.size() > 0) {
				return objects.get(0);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		return null;
	}

	public void delete(Integer id) {
		try {
			Query query = Query.build(t);
			query.addEq(ColumnUtils.getIdFieldName(t), new BigDecimal(id));
			getDAO().deleteByQuery(query);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	private T attachIdForObject(T object) {
		Field[] fields = object.getClass().getDeclaredFields();
		Query<T> query = Query.build(object.getClass());
		if (fields != null && fields.length > 0) {
			for (Field field : fields) {
				Method m = null;
				try {
					m = (Method) object.getClass().getMethod("get" + getMethodName(field.getName()));
					Object val = (Object) m.invoke(object);
					query.addEq(field.getName(), val);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}
		List<T> objects = this.findByQuery(query);
		if (objects != null && objects.size() > 0) {
			return objects.get(0);
		}
		return object;
	}

	/**
	 * 获取get名称第一个字符变大写。 Title: getMethodName Description:
	 *
	 * @param fildeName
	 * @return
	 * @throws Exception
	 *             String
	 * @author LittleHui
	 * @date 2013-12-9
	 */
	private String getMethodName(String fildeName) throws Exception {
		byte[] items = fildeName.getBytes();
		items[0] = (byte) ((char) items[0] - 'a' + 'A');
		return new String(items);
	}
}
