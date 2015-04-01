package com.greenleaf.crm.dao;

import org.springframework.stereotype.Repository;

import com.greenleaf.common.mybatis.dao.MysqlBaseDAO;
import com.greenleaf.crm.bean.Menu;

/**
 * @author QiSF 2015-04-01
 */
@Repository
public interface MenuDAO extends MysqlBaseDAO<Menu> {
}