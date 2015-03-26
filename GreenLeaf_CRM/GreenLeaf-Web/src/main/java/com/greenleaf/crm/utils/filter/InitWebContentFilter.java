package com.greenleaf.crm.utils.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.greenleaf.common.exception.UnCaughtException;
import com.greenleaf.common.response.ResponseFactory;
import com.greenleaf.common.utils.Jackson2Util;
import com.greenleaf.common.utils.WebUtil;
import com.greenleaf.crm.utils.context.WebContext;

/**
 * 初始化web请求容器过滤器.
 */
public class InitWebContentFilter implements Filter {

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		try {
			HttpServletRequest httpRequest = (HttpServletRequest) request;
			HttpServletResponse httpResponse = (HttpServletResponse) response;
			WebContext.setRequest(httpRequest);
			WebContext.setResponse(httpResponse);
			WebContext.getResponse().setContentType("text/html;charset=UTF-8");
			String url = httpRequest.getRequestURI();
			if (url.indexOf("/login") < 0 && url.indexOf("/index") < 0) {
				// FIXME 暂时放开index
				boolean isLogin = false;
				if (WebContext.getLoginUser() != null) {
					isLogin = true;
				}
				if (!isLogin) {
					if (WebUtil.isAjaxRequest(httpRequest)) {
						Jackson2Util.writeJson(httpResponse, ResponseFactory.getDefaultFailureResponse("未登入！"));
						return;
					} else {
						httpResponse.sendRedirect("/login.htm");
						return;
					}
				}
			}
			chain.doFilter(request, response);
		} catch (Exception e) {
			WebContext.remove();
			throw new UnCaughtException(e);
		}
	}

	@Override
	public void destroy() {
	}

}
