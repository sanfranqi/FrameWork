package com.greenleaf.crm.action;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.greenleaf.common.response.Response;
import com.greenleaf.common.utils.ObjectUtil;
import com.greenleaf.crm.bean.User;
import com.greenleaf.crm.service.UserService;

/**
 * @author QiSF 2015-03-17
 */
@Controller
@RequestMapping("/user")
public class UserController {

	@Autowired
	private UserService userService;

	/**
	 * add user.
	 * 
	 * @author QiSF 2015-03-17
	 */
	@ResponseBody
	@RequestMapping(value = "/addUser", produces = MediaType.APPLICATION_JSON_VALUE)
	public Response<User> addUser(String name) {
		if (ObjectUtil.isEmpty(name))
			return Response.getFailedResponse("name不能为空!");
		try {
			User user = new User();
			user.setName(name);
			return Response.getSuccessResponse(userService.insert(user));
		} catch (Exception e) {
			e.printStackTrace();
			return Response.getFailedResponse(e.getMessage());
		}
	}

	/**
	 * query user list.
	 * 
	 * @author QiSF 2015-03-17
	 */
	@ResponseBody
	@RequestMapping(value = "/queryUserList", produces = MediaType.APPLICATION_JSON_VALUE)
	public Response<List<User>> queryUserList() {
		try {
			return Response.getSuccessResponse(userService.findAll());
		} catch (Exception e) {
			e.printStackTrace();
			return Response.getFailedResponse(e.getMessage());
		}
	}
}
