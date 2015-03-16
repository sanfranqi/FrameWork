package com.greenleaf.crm.utils.context;

import java.net.URLEncoder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * web上下文.
 * 
 * @author QiSF 2015-03-13
 */
public class WebContext {
	private static Logger logger = LoggerFactory.getLogger(WebContext.class);

	private static ThreadLocal<HttpServletRequest> request = new ThreadLocal<HttpServletRequest>();
	private static ThreadLocal<HttpServletResponse> response = new ThreadLocal<HttpServletResponse>();

	/**
	 * 放入web请求
	 *
	 * @param r
	 */
	public static void setRequest(HttpServletRequest r) {
		request.set(r);
	}

	/**
	 * 获取当前request
	 *
	 * @return
	 */
	public static HttpServletRequest getRequest() {
		return request.get();
	}

	/**
	 * 得到当前线程response
	 *
	 * @return
	 */
	public static HttpServletResponse getResponse() {
		if (null == response.get()) {
			return null;
		}
		return response.get();
	}

	/**
	 * 放入当前线程response
	 *
	 * @param r
	 */
	public static void setResponse(HttpServletResponse r) {
		response.set(r);
	}

	/**
	 * 删除web请求
	 */
	public static void remove() {
		request.remove();
		response.remove();
	}

	/**
	 * 传入文件名,获取导出excel的response.
	 * 
	 * @param filename
	 *            文件名
	 * @return response
	 */
	public static HttpServletResponse getExcelResponse(String filename) {
		HttpServletResponse res = response.get();
		res.setContentType("application/x-xls");
		res.setCharacterEncoding("gbk");// excel必须是这样.
		res.setHeader("Content-disposition", "attachment;filename=" + URLEncoder.encode(filename) + ".xls");
		return res;
	}
}
