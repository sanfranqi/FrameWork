package com.greenleaf.common.springmvc;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import com.greenleaf.common.utils.ObjectUtil;

public class JSONPInterceptor implements HandlerInterceptor {

	public static final String DEFAULT_CALLBACK = "callback";

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
		return true;
	}

	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
		boolean isJSONP = !ObjectUtil.isEmpty(request.getParameter(DEFAULT_CALLBACK));
		if (isJSONP) {
			response.setContentType("application/x-javascript");
		}
	}

	@Override
	public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {

	}

}
