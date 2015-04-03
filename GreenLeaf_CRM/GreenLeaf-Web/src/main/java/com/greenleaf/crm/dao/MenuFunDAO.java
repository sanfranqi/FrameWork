package com.greenleaf.crm.dao;

import com.greenleaf.crm.bean.MenuFun;

public interface MenuFunDAO {
    int deleteByPrimaryKey(Integer id);

    int insert(MenuFun record);

    int insertSelective(MenuFun record);

    MenuFun selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(MenuFun record);

    int updateByPrimaryKey(MenuFun record);
}