package com.greenleaf.crm.action;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.greenleaf.common.bean.PageQueryParam;
import com.greenleaf.common.mybatis.bean.Paged;
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
	 * query menu list.
	 * 
	 * @author QiSF 2015-03-17
	 */
	@ResponseBody
	@RequestMapping(value = "/queryMenuList", produces = MediaType.APPLICATION_JSON_VALUE)
	public Response<Paged<Menu>> queryMenuList(PageQueryParam param) {
		try {
			return Response.getSuccessResponse(menuService.queryMenuList(param));
		} catch (Exception e) {
			e.printStackTrace();
			return Response.getFailedResponse(e.getMessage());
		}
	}

}
