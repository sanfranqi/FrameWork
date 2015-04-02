package com.greenleaf.common.mybatis.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.greenleaf.common.mybatis.dao.BaseDAO;
import com.greenleaf.common.mybatis.dao.MysqlBaseDAO;
import com.greenleaf.common.utils.ClassUtil;

public class MysqlBaseService<T> extends BaseService<T> {

	private final static Logger logger = LoggerFactory.getLogger(MysqlBaseService.class);

	public MysqlBaseService() {
		System.out.println("||" + this.getClass());
		System.out.println("||" + ClassUtil.getActualType(this.getClass()));
		Class<T> type = ClassUtil.getActualType(this.getClass());
		if (type == null) {
			throw new RuntimeException("继承类没有加泛型!");
		}

		this.t = type;
	}

	@Override
	protected BaseDAO<T> getDAO() {
		String daoName = lowerTop(t.getSimpleName()) + "DAO";
		if (getApplicationContext().containsBean(daoName)) {
			Object dao = getApplicationContext().getBean(daoName);
			if (dao != null) {
				return (MysqlBaseDAO<T>) dao;
			} else {
				logger.error("bean not exist by name:" + daoName);
			}

		} else {
			logger.error("bean not exist by name:" + daoName);
		}
		return null;
	}
}
