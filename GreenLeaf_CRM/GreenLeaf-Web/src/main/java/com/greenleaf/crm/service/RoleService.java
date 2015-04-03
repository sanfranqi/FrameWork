package com.greenleaf.crm.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.greenleaf.common.bean.PageQueryParam;
import com.greenleaf.common.mybatis.bean.Paged;
import com.greenleaf.common.mybatis.bean.Query;
import com.greenleaf.common.mybatis.bean.Query.DBOrder;
import com.greenleaf.common.mybatis.service.MysqlBaseService;
import com.greenleaf.common.utils.ObjectUtil;
import com.greenleaf.crm.bean.Role;
import com.greenleaf.crm.config.SystemConstants;
import com.greenleaf.crm.vo.RoleVo;

/**
 * @author QiSF 2015-04-03
 */
@Service
public class RoleService extends MysqlBaseService<Role> {

	/**
	 * query Role list.
	 * 
	 * @author QiSF 2015-04-03
	 */
	public Paged<Role> queryRoleList(PageQueryParam param, String roleName) {
		Paged<Role> paged = new Paged<Role>();
		Query<Role> query = Query.build(Role.class);
		query.addEq("ableFlag", SystemConstants.ENABLE);
		query.addEq("deleteFlag", SystemConstants.NO_DELETE);
		query.addOrder("id", DBOrder.DESC);
		query.addLike("roleName", roleName);
		if (!ObjectUtil.isEmpty(param) && param.isPaged()) {
			query.setPaged(param.getPageNo(), param.getPageSize());
			paged.setCurrentPage(param.getPageNo());
			paged.setPageSize(param.getPageSize());
		}
		paged.setTotalHit(this.count(query));
		paged.setListData(this.findByQuery(query));
		return paged;
	}

	/**
	 * query RoleVo list.
	 * 
	 * @author QiSF 2015-04-03
	 */
	public Paged<RoleVo> queryRoleVoList(PageQueryParam param, String roleName) {
		Paged<Role> rolePage = this.queryRoleList(param, roleName);
		List<Role> roleList = rolePage.getListData();
		List<RoleVo> roleVoList = ObjectUtil.copyList(roleList, RoleVo.class);
		Paged<RoleVo> paged = new Paged<RoleVo>();
		if (!ObjectUtil.isEmpty(param) && param.isPaged()) {
			paged.setCurrentPage(param.getPageNo());
			paged.setPageSize(param.getPageSize());
		}
		paged.setTotalHit(paged.getTotalHit());
		paged.setListData(roleVoList);
		return paged;
	}

}
