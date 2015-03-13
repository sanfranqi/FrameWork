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
			WebContext.setRequest((HttpServletRequest) request);
			WebContext.setResponse((HttpServletResponse) response);
			WebContext.getResponse().setContentType("text/html;charset=UTF-8");
			// String url = httpRequest.getServletPath();
			// if (url.startsWith("/admin") && !url.startsWith("/admin/login"))
			// {
			// String returnUrl = "/admin/login.do";
			// httpResponse.sendRedirect(returnUrl);
			// }
			// TODO 修改拦截
			chain.doFilter(request, response);
		} catch (Exception e) {
			throw new UnCaughtException(e);
		} finally {
			WebContext.remove();
		}
	}

	@Override
	public void destroy() {
	}

}
