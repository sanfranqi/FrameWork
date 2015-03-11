package com.greenleaf.common.cache;

import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.InitializingBean;

/**
 * 简单的分布式缓存代理工具类.
 * 
 * @author QiSF 2015-03-11
 */
public interface ISimpleCacheProxy extends DisposableBean, InitializingBean {

	/**
	 * 释放缓存代理
	 */
	public void destroy();

	/**
	 * 取值
	 * 
	 * @param key
	 * @return
	 */
	public Object get(String key);

	/**
	 * 存值（存在，不覆盖）
	 * 
	 * @param key
	 * @param value
	 * @return
	 */
	public boolean add(String key, Object value);

	/**
	 * 存值（存在，覆盖）
	 * 
	 * @param key
	 * @param value
	 * @return
	 */
	public boolean set(String key, Object value);

	/**
	 * 存值（存在，不覆盖）
	 * 
	 * @param key
	 * @param value
	 * @param timeOut
	 *            过期时间, 秒单位
	 * @return
	 */
	public boolean add(String key, Object value, int timeOut);

	/**
	 * 存值（存在，覆盖）
	 * 
	 * @param key
	 * @param value
	 * @param timeOut
	 *            过期时间, 秒单位
	 * @return
	 */
	public boolean set(String key, Object value, int timeOut);

	/**
	 * 删除
	 * 
	 * @param key
	 * @return
	 */
	public boolean delete(String key);

	/**
	 * 计数（累加）
	 * 
	 * @param key
	 * @param amount
	 *            可以为负数
	 * @return
	 */
	public long count(String key, int amount);

	/**
	 * 获取当前key的计数值
	 * 
	 * @param key
	 * @return
	 */
	public long count(String key);

}
