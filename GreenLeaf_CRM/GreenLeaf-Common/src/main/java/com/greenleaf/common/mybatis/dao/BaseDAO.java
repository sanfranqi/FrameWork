package com.greenleaf.common.mybatis.dao;

import java.util.List;
import java.util.Map;

import com.greenleaf.common.mybatis.bean.Query;

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
 *
 */
public interface BaseDAO<T> {

	public void insert(T obj);

	public void update(T obj);

	/**
	 * 如果是update时候会清掉原有对象的id.
	 */
	public void save(T obj);

	public void delete(T obj);

	/**
	 * 删除操作
	 */
	public void deleteByQuery(Query<T> query);

	/**
	 * 构造Query进行查询,返回值可以用ObjectUtil.toBeanList 转成List<T>
	 */
	public List<Map<String, Object>> findByQuery(Query<T> query);

	/**
	 * 用于统计和分页
	 */
	public int count(Query<T> query);
}
