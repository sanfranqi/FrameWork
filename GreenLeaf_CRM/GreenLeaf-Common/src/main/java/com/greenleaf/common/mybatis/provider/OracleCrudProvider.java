package com.greenleaf.common.mybatis.provider;

import java.lang.reflect.Field;

import org.apache.ibatis.jdbc.SQL;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.greenleaf.common.mybatis.annotation.UnColumn;
import com.greenleaf.common.mybatis.bean.Query;
import com.greenleaf.common.utils.ClassUtil;

public class OracleCrudProvider<T> extends BaseCrudProvider<T> {
	private static final Logger logger = LoggerFactory.getLogger(OracleCrudProvider.class);

	/**
	 * 查询对象
	 *
	 * @param obj
	 * @return
	 * @throws Exception
	 */
	public String findPageByObject(T obj, Query<T> query) throws Exception {
		SQL sql = new SQL();
		String pageSqlStart = "SELECT * FROM (";
		String pageSqlEnd = ")WHERE RN BETWEEN #{rowStart} AND #{rowEnd}";
		StringBuilder cols = new StringBuilder();
		SQL innerSql = new SQL();
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
					innerSql.ORDER_BY(sortField + " DESC");
				}
			} else {
				Query.DBOrder dbOrder = query.getOrders().get(field.getName());
				if (dbOrder != null) {
					sql.ORDER_BY(getColumnName(field) + " " + dbOrder.getName());
					innerSql.ORDER_BY(getColumnName(field) + " " + dbOrder.getName());
				}
			}
			if (query.isSearchAllField() || query.isFieldSearch(field.getName())) {
				String columnName = getColumnName(field);
				cols.append(columnName + " as " + field.getName() + ",");
			}
		}
		if (query.getOffset() >= 0) {
			cols.append(" ROWNUM RN,");
		}
		sql.SELECT(cols.toString().substring(0, cols.length() - 1));
		System.out.print(innerSql.toString());
		innerSql.SELECT(" * ");
		innerSql.FROM(obtainTableName(obj.getClass()));
		sql.FROM("(" + innerSql.toString() + ")");
		for (String str : buildWhereCommands(obj, query)) {
			sql.WHERE(str);
		}

		String sqlCommand;
		if (query.getOffset() >= 0) {
			// 进行分页拼装
			sqlCommand = pageSqlStart + sql.toString() + pageSqlEnd;
		} else {
			sqlCommand = sql.toString();
		}
		if (logger.isDebugEnabled()) {
			logger.debug(sqlCommand);
		}
		return sqlCommand;
	}

}
