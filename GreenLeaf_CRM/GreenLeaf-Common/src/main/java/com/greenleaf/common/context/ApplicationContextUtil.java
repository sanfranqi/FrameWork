package com.greenleaf.common.context;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

/**
 * web上下文.
 * 
 * @author QiSF 2015-03-11
 */
public class ApplicationContextUtil implements ApplicationContextAware {
	private static ApplicationContext context;

	@Override
	public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
		this.context = applicationContext;
	}

	public static ApplicationContext getContext() {
		return context;
	}

	public static <T> T getBean(String beanId) {
		return (T) context.getBean(beanId);
	}

	public static <T> T getBean(String beanId, Object[] args) {
		return (T) context.getBean(beanId, args);
	}

	public static <T> T getBeanRmiLoc(String beanRmiId, String beanLocId) {
		return (T) context.getBean(beanRmiId);
	}

	public static <T> T getBean(Class<T> clazz) {
		return context.getBean(clazz);
	}

}
