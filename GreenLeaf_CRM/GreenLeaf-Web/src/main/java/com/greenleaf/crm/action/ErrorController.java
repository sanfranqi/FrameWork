package com.greenleaf.crm.action;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import com.greenleaf.common.exception.GlobalExceptionHandler;

/**
 * 主要用于处理产生404的错误，因为GlobalExceptionHandler无法捕获到不存在的RequestMapping 404的错误.
 * 
 * @author QiSF 2015-03-18
 */
@Controller
@RequestMapping("/error")
public class ErrorController {

	/**
	 * 日志.
	 */
	private static final Logger logger = LoggerFactory.getLogger(ErrorController.class);

	/**
	 * 处理发生错误时的跳转.
	 * 
	 * @author QiSF 2015-03-18
	 */
	@RequestMapping("/error")
	public String errorHandle(HttpServletRequest request) {
		String resultView = GlobalExceptionHandler.ERROR_PAGE;
		String forntOrAdmin = "前台";
		// 获取异常信息 一般是ServletException
		Exception e = (Exception) request.getAttribute("javax.servlet.error.exception");
		if (e != null) {
			// 异常原因
			Throwable t = e.getCause();
			if (t != null) {
				if (t.getMessage().contains(GlobalExceptionHandler.ADMIN_REQUEST_URL)) { // 区分前后台
					forntOrAdmin = "后台";
				}
			} else {
				if (e.getMessage().contains(GlobalExceptionHandler.FRONT_REQUEST_URL)) { // 区分前后台
					forntOrAdmin = "前台";
				}
			}
			logger.error("{}发生错误http错误码为 : {}", forntOrAdmin, request.getAttribute("javax.servlet.error.status_code"));
		}
		return resultView;
	}

	/**
	 * 处理发生错误时的跳转.
	 * 
	 * @author QiSF 2015-03-18
	 */
	@RequestMapping("/404")
	public String notFound(HttpServletRequest request) {
		String resultView = GlobalExceptionHandler.NOTFOUND_PAGE;
		return resultView;
	}

}
