package com.greenleaf.common.file;

import com.greenleaf.common.utils.PropertiesUtil;

/**
 * 文件上传配置.
 *
 * @author linhao
 * @date 2014-5-20 上午10:40:31
 */
public class FileConfig {

	/**
	 * 临时文件位置.
	 */
	public static String tempPath;

	/**
	 * 文件大小.
	 */
	public static Integer fileSize;

	public String getTempPath() {
		PropertiesUtil p = new PropertiesUtil();
		return p.getProperties("file.tempPath");
	}

	public Integer getFileSize() {
		PropertiesUtil p = new PropertiesUtil();
		return Integer.parseInt(p.getProperties("file.fileSize"));
	}
}
