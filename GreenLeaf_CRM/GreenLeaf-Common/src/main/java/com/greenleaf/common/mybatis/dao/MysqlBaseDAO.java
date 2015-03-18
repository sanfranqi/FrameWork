package com.greenleaf.common.mybatis.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.DeleteProvider;
import org.apache.ibatis.annotations.InsertProvider;
import org.apache.ibatis.annotations.SelectKey;
import org.apache.ibatis.annotations.SelectProvider;
import org.apache.ibatis.annotations.UpdateProvider;
import org.apache.ibatis.mapping.StatementType;

import com.greenleaf.common.mybatis.bean.Query;
import com.greenleaf.common.mybatis.provider.MysqlCrudProvider;

/**
 * 用于对象的一些基本操作 使用方法: 1.在Bean上添加相应注解 对象上添加
 * 
 * @Table 设置查询的表名
 *
 *        字段上添加
 * @Id 用于设置主键
 * @Column 用于设置字段
 * @SortColumn 用于设置排序的字段,默认为降序
 *
 *             2.继承接口BaseDAO
 *
 *             其他用法: 在子类中可以直接使用
 * @SelectProvider(type = CrudProvider.class,method = "findByQuery")
 *                      构造select语句,并添加@resultType 就可以完成对象封装
 *                      具体查看SysRoleDAO.findRole方法
 *
 */
public interface MysqlBaseDAO<T> extends BaseDAO<T> {

	@InsertProvider(type = MysqlCrudProvider.class, method = "insert")
	@SelectKey(before = false, keyProperty = "id", resultType = Integer.class, statementType = StatementType.STATEMENT, statement = "SELECT LAST_INSERT_ID() AS id")
	public void insert(T obj);

	@UpdateProvider(type = MysqlCrudProvider.class, method = "update")
	public void update(T obj);

	/**
	 * 如果是update时候会清掉原有对象的id.
	 */
	@InsertProvider(type = MysqlCrudProvider.class, method = "save")
	@SelectKey(before = false, keyProperty = "id", resultType = Integer.class, statementType = StatementType.STATEMENT, statement = "SELECT LAST_INSERT_ID() AS id")
	public void save(T obj);

	@DeleteProvider(type = MysqlCrudProvider.class, method = "delete")
	public void delete(T obj);

	/**
	 * 删除操作
	 */
	@SelectProvider(type = MysqlCrudProvider.class, method = "deleteByQuery")
	public void deleteByQuery(Query<T> query);

	/**
	 * 构造Query进行查询,返回值可以用ObjectUtil.toBeanList 转成List<T>
	 */
	@SelectProvider(type = MysqlCrudProvider.class, method = "findByQuery")
	public List<Map<String, Object>> findByQuery(Query<T> query);

	/**
	 * 用于统计和分页
	 */
	@SelectProvider(type = MysqlCrudProvider.class, method = "count")
	public int count(Query<T> query);
}
