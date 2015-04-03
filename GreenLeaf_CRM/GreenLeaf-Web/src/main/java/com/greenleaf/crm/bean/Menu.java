package com.greenleaf.crm.bean;

import com.greenleaf.common.mybatis.annotation.Id;
import com.greenleaf.common.mybatis.annotation.Table;

@Table("MENU")
public class Menu {
	@Id
	private Integer id;

	private String menuName;

	private Integer parentId;

	private Integer sort;

	private String icon;

	private String method;

	private String keyName;

	private Integer addUser;

	private Long addTime;

	private Integer updateUser;

	private Long updateTime;

	private String ableFlag;

	private String deleteFlag;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getMenuName() {
		return menuName;
	}

	public void setMenuName(String menuName) {
		this.menuName = menuName == null ? null : menuName.trim();
	}

	public Integer getParentId() {
		return parentId;
	}

	public void setParentId(Integer parentId) {
		this.parentId = parentId;
	}

	public Integer getSort() {
		return sort;
	}

	public void setSort(Integer sort) {
		this.sort = sort;
	}

	public String getIcon() {
		return icon;
	}

	public void setIcon(String icon) {
		this.icon = icon == null ? null : icon.trim();
	}

	public String getMethod() {
		return method;
	}

	public void setMethod(String method) {
		this.method = method == null ? null : method.trim();
	}

	public String getKeyName() {
		return keyName;
	}

	public void setKeyName(String keyName) {
		this.keyName = keyName == null ? null : keyName.trim();
	}

	public Integer getAddUser() {
		return addUser;
	}

	public void setAddUser(Integer addUser) {
		this.addUser = addUser;
	}

	public Long getAddTime() {
		return addTime;
	}

	public void setAddTime(Long addTime) {
		this.addTime = addTime;
	}

	public Integer getUpdateUser() {
		return updateUser;
	}

	public void setUpdateUser(Integer updateUser) {
		this.updateUser = updateUser;
	}

	public Long getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Long updateTime) {
		this.updateTime = updateTime;
	}

	public String getAbleFlag() {
		return ableFlag;
	}

	public void setAbleFlag(String ableFlag) {
		this.ableFlag = ableFlag == null ? null : ableFlag.trim();
	}

	public String getDeleteFlag() {
		return deleteFlag;
	}

	public void setDeleteFlag(String deleteFlag) {
		this.deleteFlag = deleteFlag == null ? null : deleteFlag.trim();
	}

	@Override
	public String toString() {
		return "Menu [id=" + id + ", menuName=" + menuName + ", parentId=" + parentId + ", sort=" + sort + ", icon=" + icon + ", method=" + method + ", keyName=" + keyName + ", addUser=" + addUser
				+ ", addTime=" + addTime + ", updateUser=" + updateUser + ", updateTime=" + updateTime + ", ableFlag=" + ableFlag + ", deleteFlag=" + deleteFlag + "]";
	}
}