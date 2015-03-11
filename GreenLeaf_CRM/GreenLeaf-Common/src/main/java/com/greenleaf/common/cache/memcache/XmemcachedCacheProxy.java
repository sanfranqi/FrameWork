package com.greenleaf.common.cache.memcache;

import net.rubyeye.xmemcached.MemcachedClient;
import net.rubyeye.xmemcached.XMemcachedClientBuilder;

import com.greenleaf.common.cache.ISimpleCacheProxy;
import com.greenleaf.common.exception.UnCaughtException;

/**
 * Xmemcached缓存实现.
 *
 * @author QISF 2015-03-10
 */
public class XmemcachedCacheProxy implements ISimpleCacheProxy {

	private MemcachedClient client;
	/**
	 * 服务器地址列表,用空格隔开.
	 */
	private String addressList;
	/**
	 * 连接池大小.
	 */
	private int connectionPoolSize = 1;

	@Override
	public void destroy() {
		try {
			client.shutdown();
		} catch (Exception e) {
			throw new UnCaughtException(e);
		}
	}

	@Override
	public Object get(String key) {
		try {
			return client.get(key);
		} catch (Exception e) {
			return null;
		}
	}

	@Override
	public boolean add(String key, Object value) {
		try {
			return client.add(key, 0, value);
		} catch (Exception e) {
			throw new UnCaughtException(e);
		}
	}

	@Override
	public boolean set(String key, Object value) {
		try {
			return client.set(key, 0, value);
		} catch (Exception e) {
			throw new UnCaughtException(e);
		}
	}

	@Override
	public boolean delete(String key) {
		try {
			return client.delete(key);
		} catch (Exception e) {
			throw new UnCaughtException(e);
		}
	}

	@Override
	public long count(String key, int amount) {
		try {
			return client.incr(key, amount);
		} catch (Exception e) {
			throw new UnCaughtException(e);
		}
	}

	@Override
	public long count(String key) {
		try {
			return client.getCounter(key).get();
		} catch (Exception e) {
			throw new UnCaughtException(e);
		}
	}

	@Override
	public boolean add(String key, Object value, int timeOut) {
		try {
			return client.add(key, timeOut, value);
		} catch (Exception e) {
			throw new UnCaughtException(e);
		}
	}

	@Override
	public boolean set(String key, Object value, int timeOut) {
		try {
			return client.set(key, timeOut, value);
		} catch (Exception e) {
			throw new UnCaughtException(e);
		}
	}

	@Override
	public void afterPropertiesSet() throws Exception {
		try {
			XMemcachedClientBuilder builder = new XMemcachedClientBuilder(addressList);
			builder.setConnectionPoolSize(connectionPoolSize);
			client = builder.build();
		} catch (Exception e) {
			throw new UnCaughtException(e);
		}
	}

	public String getAddressList() {
		return addressList;
	}

	public void setAddressList(String addressList) {
		this.addressList = addressList;
	}

	public int getConnectionPoolSize() {
		return connectionPoolSize;
	}

	public void setConnectionPoolSize(int connectionPoolSize) {
		this.connectionPoolSize = connectionPoolSize;
	}

}
