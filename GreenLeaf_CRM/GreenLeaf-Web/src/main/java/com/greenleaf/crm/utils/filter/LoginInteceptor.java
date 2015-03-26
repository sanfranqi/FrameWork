package com.greenleaf.crm.utils.filter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import com.greenleaf.common.response.ResponseFactory;
import com.greenleaf.common.utils.DateUtil;
import com.greenleaf.common.utils.Jackson2Util;
import com.greenleaf.common.utils.WebUtil;
import com.greenleaf.crm.utils.context.WebContext;

/**
 * 登入拦截器.(不用)
 * 
 * @author QiSF 2015-03-25
 */
@Deprecated
public class LoginInteceptor extends HandlerInterceptorAdapter {

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
		if (handler instanceof HandlerMethod) {
			String url = request.getRequestURI();
			System.out.println("LoginInteceptor begin" + DateUtil.getDateTime());
			if (!url.startsWith("/login") && !url.startsWith("/")) {
				boolean isLogin = false;
				if (WebContext.getLoginUser() == null) {
					isLogin = false;
				}
				if (!isLogin) {
					if (WebUtil.isAjaxRequest(request)) {
						Jackson2Util.writeJson(response, ResponseFactory.getDefaultFailureResponse("未登入！"));
						return false;
					} else {
						response.sendRedirect("/");
						return false;
					}
				}
			}
		}
		return true;
	}
}