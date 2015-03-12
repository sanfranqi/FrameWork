package com.greenleaf.common.security3;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint;

import com.greenleaf.common.file.IOUtil;
import com.greenleaf.common.response.Response;
import com.greenleaf.common.utils.Jackson2Util;
import com.greenleaf.common.utils.WebUtil;

/**
 * security认证入口点,如果认证失败将执行commence, MultiRequestAuthenticationEntryPoint支持ajax.
 * 
 * @author QiSF 2015-03-11
 */
@SuppressWarnings("deprecation")
public class MultiRequestAuthenticationEntryPoint extends LoginUrlAuthenticationEntryPoint {

	private static final Log logger = LogFactory.getLog(MultiRequestAuthenticationEntryPoint.class);

	private RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();

	public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
		String redirectUrl = null;
		String url = request.getRequestURI();
		if (logger.isDebugEnabled()) {
			logger.debug("url:" + url);
		}
		if (!WebUtil.isAjaxRequest(request)) {// 非ajax请求
			if (this.isUseForward()) {
				if (this.isForceHttps() && "http".equals(request.getScheme())) {
					// First redirect the current request to HTTPS.
					// When that request is received, the forward to the login
					// page will be used.
					redirectUrl = buildHttpsRedirectUrlForRequest(request);
				}
				if (redirectUrl == null) {
					String loginForm = determineUrlToUseForThisRequest(request, response, authException);

					if (logger.isDebugEnabled()) {
						logger.debug("Server side forward to: " + loginForm);
					}
					RequestDispatcher dispatcher = request.getRequestDispatcher(loginForm);
					dispatcher.forward(request, response);
					return;
				}
			} else {
				// redirect to login page. Use https if forceHttps true
				redirectUrl = buildRedirectUrlToLoginPage(request, response, authException);
			}
			redirectStrategy.sendRedirect(request, response, redirectUrl);
		} else {// ajax请求
			Response<Boolean> responseData = new Response<Boolean>();
			responseData.setResult(Response.RESULT_LOGIN); // 访问被拒绝,请求登录.
			responseData.setMessage("request refused, no login.");
			PrintWriter writer = response.getWriter();
			try {
				writer.write(Jackson2Util.toJson(responseData));
			} finally {
				IOUtil.close(writer);
			}
		}
	}

}