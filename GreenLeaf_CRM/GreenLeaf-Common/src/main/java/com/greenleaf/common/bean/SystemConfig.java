package com.greenleaf.common.bean;

import org.springframework.stereotype.Component;

import com.greenleaf.common.utils.PropertiesUtil;

/**
 * 系统常量.
 * 
 * @author QiSF 2015-03-11
 */
@Component
public class SystemConfig {

	/**
	 * 资源文件路径.
	 */
	private String propertyPath;

	/**
	 * 临时文件位置.
	 */
	public static String TEMP_PATH;

	/**
	 * 文件大小.
	 */
	public static Integer FILE_SIZE;

	static {
		new SystemConfig().init();
	}

	public void init() {
		PropertiesUtil p = new PropertiesUtil(propertyPath);
		TEMP_PATH = p.getProperties("file.tempPath");
		FILE_SIZE = Integer.parseInt(p.getProperties("file.fileSize"));
	}

	public String getPropertyPath() {
		return propertyPath;
	}

	public void setPropertyPath(String propertyPath) {
		this.propertyPath = propertyPath;
	}
}
