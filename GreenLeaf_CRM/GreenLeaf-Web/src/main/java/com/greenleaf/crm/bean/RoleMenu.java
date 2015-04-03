package com.greenleaf.crm.bean;

import com.greenleaf.common.mybatis.annotation.Id;
import com.greenleaf.common.mybatis.annotation.Table;

@Table("ROLE_MENU")
public class RoleMenu {
	@Id
	private Integer id;

	private Integer roleId;

	private Integer menuId;

	private String funbit;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getRoleId() {
		return roleId;
	}

	public void setRoleId(Integer roleId) {
		this.roleId = roleId;
	}

	public Integer getMenuId() {
		return menuId;
	}

	public void setMenuId(Integer menuId) {
		this.menuId = menuId;
	}

	public String getFunbit() {
		return funbit;
	}

	public void setFunbit(String funbit) {
		this.funbit = funbit == null ? null : funbit.trim();
	}

	@Override
	public String toString() {
		return "RoleMenu [id=" + id + ", roleId=" + roleId + ", menuId=" + menuId + ", funbit=" + funbit + "]";
	}

}