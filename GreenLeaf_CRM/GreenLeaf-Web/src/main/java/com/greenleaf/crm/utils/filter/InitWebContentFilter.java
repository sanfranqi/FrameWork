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
