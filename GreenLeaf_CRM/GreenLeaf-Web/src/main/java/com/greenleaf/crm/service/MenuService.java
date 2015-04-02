package com.greenleaf.crm.service;

import org.springframework.stereotype.Service;

import com.greenleaf.common.bean.PageQueryParam;
import com.greenleaf.common.mybatis.bean.Paged;
import com.greenleaf.common.mybatis.bean.Query;
import com.greenleaf.common.mybatis.bean.Query.DBOrder;
import com.greenleaf.common.mybatis.service.MysqlBaseService;
import com.greenleaf.common.utils.ObjectUtil;
import com.greenleaf.crm.bean.Menu;
import com.greenleaf.crm.config.SystemConstants;

/**
 * @author QiSF 2015-04-01
 */
@Service
public class MenuService extends MysqlBaseService<Menu> {

	/**
	 * query menu list.
	 * 
	 * @author QiSF 2015-04-02
	 */
	public Paged<Menu> queryMenuList(PageQueryParam param) {
		Paged<Menu> paged = new Paged<Menu>();
		Query<Menu> query = Query.build(Menu.class);
		query.addEq("ableFlag", SystemConstants.ENABLE);
		query.addEq("deleteFlag", SystemConstants.NO_DELETE);
		query.addOrder("sort", DBOrder.ASC);
		if (!ObjectUtil.isEmpty(param) && param.isPaged()) {
			query.setPaged(param.getPageNo(), param.getPageSize());
			paged.setCurrentPage(param.getPageNo());
			paged.setPageSize(param.getPageSize());
		}
		paged.setTotalHit(this.count(query));
		paged.setListData(this.findByQuery(query));
		return paged;
	}
}
