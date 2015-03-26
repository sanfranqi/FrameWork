package com.greenleaf.crm.action;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.greenleaf.common.email.MailEngine;
import com.greenleaf.common.response.Response;
import com.greenleaf.common.utils.ObjectUtil;
import com.greenleaf.crm.bean.User;
import com.greenleaf.crm.config.SystemConstants;
import com.greenleaf.crm.utils.context.WebContext;

/**
 * 登入.
 * 
 * @author QiSF 2015-03-25
 */
@Controller
public class LoginController {

	private static final Logger logger = LoggerFactory.getLogger(MailEngine.class);

	/**
	 * login.
	 * 
	 * @author QiSF 2015-03-17
	 */
	@ResponseBody
	@RequestMapping(value = "/login", produces = MediaType.APPLICATION_JSON_VALUE)
	public Response<String> login(String userName, String password) {
		if (ObjectUtil.isEmpty(userName))
			return Response.getFailedResponse("name不能为空!");
		try {
			if (userName.equals("test")) {
				User user = new User();
				user.setName(userName);
				WebContext.setLoginSession(user);
				return Response.getSuccessResponse();
			} else {
				return Response.getFailedResponse("用户不存在！");
			}
		} catch (Exception e) {
			e.printStackTrace();
			return Response.getFailedResponse(e.getMessage());
		}
	}

	/**
	 * logout.
	 * 
	 * @author QiSF 2015-03-17
	 */
	@ResponseBody
	@RequestMapping(value = "/logout", produces = MediaType.APPLICATION_JSON_VALUE)
	public Response<Boolean> logout() {
		try {
			WebContext.removeLoginSession();
			WebContext.remove();
			return Response.getSuccessResponse(true);
		} catch (Exception e) {
			e.printStackTrace();
			return Response.getFailedResponse(e.getMessage());
		}
	}

	@ResponseBody
	@RequestMapping(value = "/index.htm")
	public ModelAndView serviceTagIndex(HttpServletRequest request, HttpServletResponse httpResponse) {
		ModelAndView modelAndView = new ModelAndView();
		String viewName = "";
		if (WebContext.getLoginUser() != null) {
			viewName = SystemConstants.INDEX_URL;
		} else {
			WebContext.remove();
			viewName = SystemConstants.LOGIN_URL;
		}
		modelAndView.setViewName(viewName);
		return modelAndView;
	}

}
