package com.greenleaf.crm.bean;

import com.greenleaf.common.mybatis.annotation.Id;
import com.greenleaf.common.mybatis.annotation.Table;

/**
 * @author QiSF 2015-04-02
 */
@Table("menu")
public class Menu {
	@Id
	private Integer id;

	private String menuName;

	private Integer parentId;

	private Integer sort;

	private String icon;

	private String method;

	private String keyName;

	private Integer groupId;
	/**
	 * 0:disable;1:enable
	 */
	private String ableFlag;
	/**
	 * 0:deleted;1:normal
	 */
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
		this.keyName = keyName;
	}

	public Integer getGroupId() {
		return groupId;
	}

	public void setGroupId(Integer groupId) {
		this.groupId = groupId;
	}

	public String getAbleFlag() {
		return ableFlag;
	}

	public void setAbleFlag(String ableFlag) {
		this.ableFlag = ableFlag;
	}

	public String getDeleteFlag() {
		return deleteFlag;
	}

	public void setDeleteFlag(String deleteFlag) {
		this.deleteFlag = deleteFlag;
	}

	@Override
	public String toString() {
		return "Menu [id=" + id + ", menuName=" + menuName + ", parentId=" + parentId + ", sort=" + sort + ", icon=" + icon + ", method=" + method + ", keyName=" + keyName + ", groupId=" + groupId
				+ ", ableFlag=" + ableFlag + ", deleteFlag=" + deleteFlag + "]";
	}
}