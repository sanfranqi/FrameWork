package com.greenleaf.crm.utils.web;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

/**
 * spring mvc 默认地址匹配.
 * 
 * @author QiSF 2015-03-11
 */
@Controller
public class WildcardMVCController {

	/**
	 * 默认匹配所有地址.
	 *
	 * @return
	 */
	@RequestMapping("/**/*.htm")
	public ModelAndView htmMapping(HttpServletRequest request, HttpServletResponse response) {
		String url = request.getServletPath();
		ModelAndView view = new ModelAndView();
		view.setViewName(getViewName(url, ".htm"));
		return view;
	}

	/**
	 * 默认匹配所有地址.
	 *
	 * @return
	 */
	@RequestMapping("/**/*.html")
	public ModelAndView htmlMapping(HttpServletRequest request, HttpServletResponse response) {
		String url = request.getServletPath();
		ModelAndView view = new ModelAndView();
		view.setViewName(getViewName(url, ".html"));
		return view;
	}

	/**
	 * 获得视图路径.
	 *
	 * @param requestURI
	 * @param suffix
	 * @return
	 */
	public String getViewName(String requestURI, String suffix) {
		String viewName = requestURI;
		viewName = viewName.substring(0, viewName.length() - suffix.length());
		return viewName;
	}

}
