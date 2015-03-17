package com.greenleaf.crm.dao;

import org.springframework.stereotype.Repository;

import com.greenleaf.common.mybatis.dao.MysqlBaseDAO;
import com.greenleaf.crm.bean.User;

/**
 * @author QiSF 2015-03-17
 */
@Repository
public interface UserDAO extends MysqlBaseDAO<User> {

}
