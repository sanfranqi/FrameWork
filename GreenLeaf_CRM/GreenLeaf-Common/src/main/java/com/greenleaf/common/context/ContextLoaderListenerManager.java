package com.greenleaf.common.context;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.springframework.web.context.ContextLoaderListener;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

/**
 * 初始化上下文.
 * 
 * @author QiSF 2015-03-11
 */
public class ContextLoaderListenerManager extends ContextLoaderListener implements ServletContextListener {
	private ServletContext servetContext;
	private WebApplicationContext webApplicationContext;
	private final static String APPLICATIONCONTEXTUTIL = "applicationContextUtil";

	public void contextInitialized(ServletContextEvent event) {
		super.contextInitialized(event);

		this.servetContext = event.getServletContext();
		this.webApplicationContext = WebApplicationContextUtils.getRequiredWebApplicationContext(servetContext);
		this.servetContext.setAttribute("WEBAPPLICATIONCONTEXT", webApplicationContext);
		WebApplicationContext webApplicationContext = (WebApplicationContext) this.servetContext.getAttribute("WEBAPPLICATIONCONTEXT");
		ApplicationContextUtil aplicationContextUtil = (ApplicationContextUtil) webApplicationContext.getBean(APPLICATIONCONTEXTUTIL);
	}
}
