package com.greenleaf.crm.action;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.greenleaf.common.bean.PageQueryParam;
import com.greenleaf.common.mybatis.bean.Paged;
import com.greenleaf.common.response.Response;
import com.greenleaf.crm.service.RoleService;
import com.greenleaf.crm.vo.RoleVo;

/**
 * @author QiSF 2015-04-03
 */
@Controller
@RequestMapping("/role")
public class RoleController {

	@Autowired
	private RoleService roleService;

	/**
	 * query page Role list.
	 * 
	 * @author QiSF 2015-03-17
	 */
	@ResponseBody
	@RequestMapping(value = "/queryPageRoleList", produces = MediaType.APPLICATION_JSON_VALUE)
	public Response<Paged<RoleVo>> queryPageRoleList(PageQueryParam param, String userName) {
		try {
			return Response.getSuccessResponse(roleService.queryRoleVoList(param, userName));
		} catch (Exception e) {
			e.printStackTrace();
			return Response.getFailedResponse(e.getMessage());
		}
	}

	/**
	 * query Role list.
	 * 
	 * @author QiSF 2015-03-17
	 */
	@ResponseBody
	@RequestMapping(value = "/queryRoleList", produces = MediaType.APPLICATION_JSON_VALUE)
	public Response<List<RoleVo>> queryRoleList(PageQueryParam param) {
		try {
			return Response.getSuccessResponse(roleService.queryRoleVoList(param, "").getListData());
		} catch (Exception e) {
			e.printStackTrace();
			return Response.getFailedResponse(e.getMessage());
		}
	}

}
