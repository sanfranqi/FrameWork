package com.greenleaf.crm.config;

import org.springframework.stereotype.Component;

@Component
public class SystemConfig {

	/**
	 * 临时文件位置.
	 */
	public static String TEMP_PATH;

	public static String getTEMP_PATH() {
		return TEMP_PATH;
	}

	public static void setTEMP_PATH(String tEMP_PATH) {
		TEMP_PATH = tEMP_PATH;
	}
}
