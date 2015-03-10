package com.greenleaf.common.upload;

import java.io.File;
import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import com.greenleaf.common.bean.ResultVO;
import com.greenleaf.common.bean.SystemConfig;
import com.greenleaf.common.exception.UnCaughtException;

/**
 * 文件上传抽象类.
 * 
 * @author qingwu
 * @date 2014-1-22 下午3:09:09
 */
public abstract class AbstractFileUpload {

	/**
	 * http请求.
	 */
	private HttpServletRequest request;

	/**
	 * 上传文件列表.
	 */
	private List<FileItem> fileList;

	public AbstractFileUpload(HttpServletRequest request) {
		this.request = request;
		init();
	}

	/**
	 * 初始化上传文件列表(未存放到服务器).
	 * 
	 * @author qingwu
	 * @date 2014-1-22 下午3:11:39
	 */
	public void init() {
		DiskFileItemFactory factory = new DiskFileItemFactory();
		String path = SystemConfig.TEMP_PATH;
		factory.setRepository(new File(path));
		factory.setSizeThreshold(SystemConfig.FILE_SIZE);
		ServletFileUpload upload = new ServletFileUpload(factory);
		try {
			this.fileList = (List<FileItem>) upload.parseRequest(request);
		} catch (FileUploadException e) {
			throw new UnCaughtException(e);
		}
	}

	/**
	 * 获得上传的文件列表.
	 * 
	 * @return
	 * @author qingwu
	 * @date 2014-1-22 下午3:11:12
	 */
	public List<FileItem> getFileList() {
		return this.fileList;
	}

	/**
	 * 关闭上传文件流.
	 * 
	 * @author qingwu
	 * @date 2014-1-22 下午4:00:00
	 */
	public void close() {
		for (FileItem file : fileList) {
			try {
				file.getInputStream().close();
			} catch (IOException e) {
				throw new UnCaughtException(e);
			}
		}
	}

	/**
	 * 文件验证.
	 * 
	 * @return
	 * @author qingwu
	 * @date 2014-1-22 下午4:07:53
	 */
	public abstract ResultVO fileCheck();
}
