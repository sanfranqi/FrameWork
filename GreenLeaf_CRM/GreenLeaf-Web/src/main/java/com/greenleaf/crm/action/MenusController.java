package com.greenleaf.crm.action;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.greenleaf.common.response.Response;
import com.greenleaf.crm.bean.Menu;
import com.greenleaf.crm.service.MenuService;

/**
 * @author QiSF 2015-04-01
 */
@Controller
@RequestMapping("/menu")
public class MenusController {

	@Autowired
	private MenuService menuService;

	/**
	 * query user list.
	 * 
	 * @author QiSF 2015-03-17
	 */
	@ResponseBody
	@RequestMapping(value = "/queryMenuList", produces = MediaType.APPLICATION_JSON_VALUE)
	public Response<List<Menu>> queryMenuList() {
		try {
			return Response.getSuccessResponse(menuService.findAll());
			// return Response.getFailedResponse("byebye");
		} catch (Exception e) {
			e.printStackTrace();
			return Response.getFailedResponse(e.getMessage());
		}
	}

}
