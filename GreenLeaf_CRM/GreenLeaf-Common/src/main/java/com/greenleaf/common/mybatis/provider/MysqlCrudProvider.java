package com.greenleaf.common.mybatis.provider;

import java.lang.reflect.Field;

import org.apache.ibatis.jdbc.SQL;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.greenleaf.common.mybatis.annotation.UnColumn;
import com.greenleaf.common.mybatis.bean.Query;
import com.greenleaf.common.utils.ClassUtil;

public class MysqlCrudProvider<T> extends BaseCrudProvider<T> {
	private static final Logger logger = LoggerFactory.getLogger(MysqlCrudProvider.class);

	/**
	 * 查询对象
	 * 
	 * @param obj
	 * @return
	 * @throws Exception
	 */
	public String findPageByObject(T obj, Query<T> query) throws Exception {
		SQL sql = new SQL();

		StringBuilder cols = new StringBuilder();
		for (Field field : obj.getClass().getDeclaredFields()) {
			if (!ClassUtil.isProperty(obj.getClass(), field.getName())) {
				continue;
			}

			if (field.getAnnotation(UnColumn.class) != null) {
				continue;
			}

			if (!query.hasOrder()) {
				String sortField = getSortColumnName(field);
				if (sortField != null) {
					sql.ORDER_BY(sortField + " DESC");
				}
			} else {
				Query.DBOrder dbOrder = query.getOrders().get(field.getName());
				if (dbOrder != null) {
					sql.ORDER_BY(getColumnName(field) + " " + dbOrder.getName());
				}
			}

			if (query.isSearchAllField() || query.isFieldSearch(field.getName())) {
				String columnName = getColumnName(field);
				cols.append(columnName + " as " + field.getName() + ",");
			}

		}

		sql.SELECT(cols.toString().substring(0, cols.length() - 1));
		sql.FROM(obtainTableName(obj.getClass()));

		for (String str : buildWhereCommands(obj, query)) {
			sql.WHERE(str);
		}

		String sqlCommand;
		if (query.getOffset() >= 0) {
			sqlCommand = sql.toString() + " limit #{offset},#{pageSize}";
		} else {
			sqlCommand = sql.toString();
		}
		if (logger.isDebugEnabled()) {
			logger.debug(sqlCommand);
		}
		return sqlCommand;
	}

}
