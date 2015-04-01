package com.greenleaf.common.mybatis.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContextAware;

import com.greenleaf.common.mybatis.dao.BaseDAO;
import com.greenleaf.common.mybatis.dao.MysqlBaseDAO;

public class MysqlBaseService<T> extends BaseService<T> implements ApplicationContextAware {

	private final static Logger logger = LoggerFactory.getLogger(MysqlBaseService.class);

	public MysqlBaseService() {
		super();
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
