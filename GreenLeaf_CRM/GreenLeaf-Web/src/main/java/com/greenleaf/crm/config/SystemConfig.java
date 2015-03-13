package com.greenleaf.crm.config;

import org.springframework.stereotype.Component;

import com.greenleaf.common.utils.PropertiesUtil;

@Component
public class SystemConfig {

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
		// TODO 设置属性文件路径
		PropertiesUtil p = new PropertiesUtil("");
		TEMP_PATH = p.getProperties("file.tempPath");
		FILE_SIZE = Integer.parseInt(p.getProperties("file.fileSize"));
	}

}
