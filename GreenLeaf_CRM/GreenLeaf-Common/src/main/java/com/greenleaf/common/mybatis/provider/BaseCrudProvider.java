package com.greenleaf.common.mybatis.provider;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.ibatis.jdbc.SQL;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.greenleaf.common.mybatis.annotation.Column;
import com.greenleaf.common.mybatis.annotation.Id;
import com.greenleaf.common.mybatis.annotation.SortColumn;
import com.greenleaf.common.mybatis.annotation.Table;
import com.greenleaf.common.mybatis.annotation.UnColumn;
import com.greenleaf.common.mybatis.bean.Query;
import com.greenleaf.common.utils.ClassUtil;
import com.greenleaf.common.utils.ObjectUtil;
import com.greenleaf.common.utils.StringUtil;

public abstract class BaseCrudProvider<T> {
	private static final Logger logger = LoggerFactory.getLogger(BaseCrudProvider.class);

	/**
	 * 执行查询
	 *
	 * @param query
	 * @return
	 * @throws Exception
	 */
	public String findByQuery(Query<T> query) throws Exception {
		T obj = ObjectUtil.mapToBean(query.getType(), query.getParams());
		ObjectUtil.mapAddToBean(obj, query.getType(), query.getParamLikes());
		ObjectUtil.mapAddToBean(obj, query.getType(), query.getLtParams());
		ObjectUtil.mapAddToBean(obj, query.getType(), query.getGtParams());
		return findPageByObject(obj, query);
	}

	/**
	 * 执行删除操作
	 */
	public String deleteByQuery(Query<T> query) throws Exception {
		T obj = ObjectUtil.mapToBean(query.getType(), query.getParams());
		ObjectUtil.mapAddToBean(obj, query.getType(), query.getParamLikes());
		ObjectUtil.mapAddToBean(obj, query.getType(), query.getLtParams());
		ObjectUtil.mapAddToBean(obj, query.getType(), query.getGtParams());

		SQL sql = new SQL();
		sql.DELETE_FROM(obtainTableName(obj.getClass()));

		List<String> whereConditions = buildWhereCommands(obj, query);
		if (whereConditions.size() == 0) {
			throw new RuntimeException("condition is empty,can't delete");
		}

		for (String str : whereConditions) {
			sql.WHERE(str);
		}
		if (logger.isDebugEnabled()) {
			logger.debug("sql is:" + sql.toString());
		}
		return sql.toString();
	}

	/**
	 * 执行统计,用于分页
	 *
	 * @param query
	 * @return
	 * @throws Exception
	 */
	public String count(Query<T> query) throws Exception {
		T obj = ObjectUtil.mapToBean(query.getType(), query.getParams());
		ObjectUtil.mapAddToBean(obj, query.getType(), query.getParamLikes());
		ObjectUtil.mapAddToBean(obj, query.getType(), query.getLtParams());
		ObjectUtil.mapAddToBean(obj, query.getType(), query.getGtParams());

		return count(obj, query);

	}

	protected String buildColumnCommand(Query query, Field field) {
		String expression = query.getExpression(field.getName());
		String objPrefix = query.getExpressionParam(field.getName());
		if (objPrefix == null) {
			return (getColumnName(field) + expression + "#{" + field.getName() + "}");
		} else {
			return (getColumnName(field) + expression + "#{" + objPrefix + "." + field.getName() + "}");
		}
	}

	protected List<String> buildInCommands(Query<T> query) {
		List<String> list = new ArrayList<String>();

		for (String fieldName : query.getInArrayParams().keySet()) {
			if (ObjectUtil.isEmpty(query.getInArrayParams().get(fieldName))) {
				continue;
			}

			StringBuilder sb = new StringBuilder();
			sb.append(getColName(query.getType(), fieldName));
			sb.append(" in (");

			StringBuilder innerStr = new StringBuilder();
			for (int i = 0; i < query.getInArrayParams().get(fieldName).size(); i++) {
				innerStr.append("#{").append("inArrayParams.").append(fieldName).append("[").append(i).append("]}").append(",");
			}
			sb.append(innerStr.substring(0, innerStr.length() - 1)).append(")");
			list.add(sb.toString());
		}

		return list;
	}

	protected List<String> buildBetweenCommands(Query<T> query) {
		List<String> list = new ArrayList<String>();

		for (String fieldName : query.getBetweens().keySet()) {
			if (query.getBetweens().get(fieldName).getBegin() == null || query.getBetweens().get(fieldName).getEnd() == null) {
				continue;
			}

			StringBuilder sb = new StringBuilder();
			sb.append(getColName(query.getType(), fieldName));
			sb.append(" between ");
			sb.append(" #{").append("betweens.").append(fieldName).append(".begin}");
			sb.append(" and ");
			sb.append(" #{").append("betweens.").append(fieldName).append(".end}");
			list.add(sb.toString());
		}

		return list;
	}

	protected List<String> buildWhereCommands(T obj, Query<T> query) throws Exception {
		List<String> list = new ArrayList<String>();
		list.addAll(buildBetweenCommands(query));
		list.addAll(buildInCommands(query));

		if (obj == null) {
			return list;
		}

		for (Field field : obj.getClass().getDeclaredFields()) {
			if (skipField(obj, field)) {
				continue;
			}
			String columnCommand = buildColumnCommand(query, field);
			if (StringUtil.isNotEmpty(columnCommand)) {
				list.add(buildColumnCommand(query, field));
			}
		}
		return list;
	}

	public String count(T obj, Query<T> query) throws Exception {
		SQL sql = new SQL();

		sql.SELECT("count(1)");
		sql.FROM(obtainTableName(obj.getClass()));

		for (String str : buildWhereCommands(obj, query)) {
			sql.WHERE(str);
		}

		if (logger.isDebugEnabled()) {
			logger.debug(sql.toString());
		}
		return sql.toString();
	}

	/**
	 * 查询对象
	 *
	 * @param obj
	 * @return
	 * @throws Exception
	 */
	public abstract String findPageByObject(T obj, Query<T> query) throws Exception;

	/**
	 * 删除对象
	 *
	 * @param obj
	 * @return
	 */
	public String delete(T obj) {
		Field idName = obtainIdName(obj.getClass());
		SQL sql = new SQL();
		sql.DELETE_FROM(obtainTableName(obj.getClass()));
		sql.WHERE(idName.getAnnotation(Id.class).value() + "=#{" + idName.getName() + "}");
		return sql.toString();
	}

	/**
	 * 获取单个对象
	 */
	public String get(T obj) {
		Field idName = obtainIdName(obj.getClass());
		SQL sql = new SQL();
		sql.SELECT(getColumns(obj.getClass()));
		sql.FROM(obtainTableName(obj.getClass()));
		sql.WHERE(idName.getAnnotation(Id.class).value() + "=#{" + idName.getName() + "}");
		return sql.toString();
	}

	protected String getColumns(Class clz) {
		StringBuilder cols = new StringBuilder();
		for (Field field : clz.getDeclaredFields()) {
			String columnName = getColumnName(field);
			cols.append(columnName + ",");
		}

		return cols.toString().substring(0, cols.length() - 1);
	}

	/**
	 * 保存对象
	 *
	 * @param obj
	 * @return
	 * @throws Exception
	 */
	public String save(T obj) throws Exception {
		String sql;
		if (!isIdExist(obj)) {
			sql = insert(obj);
		} else {
			sql = update(obj);
		}
		return sql;
	}

	/**
	 * 更新对象
	 *
	 * @param obj
	 * @return
	 * @throws Exception
	 */
	public String update(T obj) throws Exception {
		SQL sql = new SQL();
		sql.UPDATE(obtainTableName(obj.getClass()));

		String idName = "";
		String idFieldName = "";

		for (Field field : obj.getClass().getDeclaredFields()) {
			Id idField = field.getAnnotation(Id.class);
			if (idField != null) {
				idName = idField.value();
				idFieldName = field.getName();
				continue;
			}
			if (skipField(obj, field)) {
				continue;
			}

			sql.SET(getColumnName(field) + "=#{" + field.getName() + "}");
		}

		sql.WHERE(idName + "=#{" + idFieldName + "}");

		if (logger.isDebugEnabled()) {
			logger.debug(sql.toString());
		}
		return sql.toString();
	}

	/**
	 * 删除对象
	 *
	 * @param obj
	 * @return
	 * @throws Exception
	 */
	public String insert(T obj) throws Exception {
		SQL sql = new SQL();
		sql.INSERT_INTO(obtainTableName(obj.getClass()));
		StringBuilder cols = new StringBuilder();
		StringBuilder values = new StringBuilder();
		for (Field field : obj.getClass().getDeclaredFields()) {
			if (skipField(obj, field)) {
				continue;
			}

			values.append("#{" + field.getName() + "},");
			cols.append(getColumnName(field) + ",");
		}

		sql.VALUES(cols.toString().substring(0, cols.length() - 1), values.toString().substring(0, values.length() - 1));
		if (logger.isDebugEnabled()) {
			logger.debug(sql.toString());
		}
		return sql.toString();
	}

	public <M> String getColName(Class<M> clazz, String fieldName) {
		for (Field field : clazz.getDeclaredFields()) {
			String columnName = getColumnName(field);
			if (fieldName == field.getName()) {
				return columnName;
			}
		}
		throw new RuntimeException("fieldName :" + fieldName + " not find ");
	}

	protected String getColumnName(Field field) {
		Column column = field.getAnnotation(Column.class);
		SortColumn sortColumn = field.getAnnotation(SortColumn.class);
		Id idField = field.getAnnotation(Id.class);
		if (column != null && !StringUtils.isEmpty(column.value())) {
			return column.value();
		}
		if (sortColumn != null && !StringUtils.isEmpty(sortColumn.value())) {
			return sortColumn.value();
		} else if (idField != null && !StringUtils.isEmpty(idField.value())) {
			return idField.value();
		} else {
			// 约定：sysId > SYS_ID
			String propName = field.getName();
			StringBuilder builder = new StringBuilder();
			for (int i = 0; i < propName.length(); i++) {
				char c = propName.charAt(i);
				if (Character.isUpperCase(c)) {
					builder.append('_').append(c);
				} else {
					builder.append(Character.toUpperCase(c));
				}
			}
			return builder.toString();
		}
	}

	protected String getSortColumnName(Field field) {
		SortColumn sortColumn = field.getAnnotation(SortColumn.class);
		if (sortColumn != null) {
			if (StringUtils.isEmpty(sortColumn.value())) {
				return field.getName();
			} else {
				return sortColumn.value();
			}
		}
		return null;
	}

	private boolean isIdExist(T obj) {
		for (Field field : obj.getClass().getDeclaredFields()) {
			Id idField = field.getAnnotation(Id.class);
			if (idField != null) {
				try {
					String value = BeanUtils.getProperty(obj, field.getName());
					if (value != null) {
						return true;
					}
				} catch (Exception e) {
					logger.error("get id prop error!", e);
				}
			}
		}
		return false;
	}

	public String obtainTableName(Class<?> clazz) {
		Table table = clazz.getAnnotation(Table.class);
		if (table != null)
			return table.value();
		else
			throw new RuntimeException("undefine POJO @Table, need Tablename(@Table)");
	}

	/**
	 * 获取POJO对应的主键名称 需要POJO中的属性定义@Id
	 *
	 * @return
	 */
	public Field obtainIdName(Class<?> clazz) {
		for (Field field : clazz.getDeclaredFields()) {
			if (field.isAnnotationPresent(Id.class))
				return field;
		}
		return null;
	}

	protected boolean skipField(T obj, Field field) {
		try {
			UnColumn unColumn = field.getAnnotation(UnColumn.class);
			if (unColumn != null) {
				return true;
			}

			if (!ClassUtil.isProperty(obj.getClass(), field.getName())) {
				return true;
			}

			String value = BeanUtils.getProperty(obj, field.getName());
			if (value == null) {
				return true;
			}

		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}

}
