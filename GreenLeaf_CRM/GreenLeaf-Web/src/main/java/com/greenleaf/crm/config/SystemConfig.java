package com.greenleaf.crm.config;

import com.greenleaf.common.utils.PropertiesUtil;

public class SystemConfig {

	/**
	 * 临时文件位置.
	 */
	public static String TEMP_PATH;

	public SystemConfig() {
		init();
	}

	public void init() {
		PropertiesUtil p = new PropertiesUtil("/conf/server_cfg.properties");
		TEMP_PATH = p.getProperties("file.tempPath");
	}
}
