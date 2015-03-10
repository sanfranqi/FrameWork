package com.greenleaf.common.mybatis.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContextAware;

public class MysqlBaseService<T> extends BaseService<T> implements ApplicationContextAware {

	private final static Logger logger = LoggerFactory.getLogger(MysqlBaseService.class);

	public MysqlBaseService() {
		super();
	}
}
