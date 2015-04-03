package com.greenleaf.crm.bean;

import com.greenleaf.common.mybatis.annotation.Id;
import com.greenleaf.common.mybatis.annotation.Table;

@Table("ROLE")
public class Role {
	@Id
	private Integer id;

	private String roleName;

	private String comments;

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

	public String getRoleName() {
		return roleName;
	}

	public void setRoleName(String roleName) {
		this.roleName = roleName == null ? null : roleName.trim();
	}

	public String getComments() {
		return comments;
	}

	public void setComments(String comments) {
		this.comments = comments == null ? null : comments.trim();
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
		return "Role [id=" + id + ", roleName=" + roleName + ", comments=" + comments + ", addUser=" + addUser + ", addTime=" + addTime + ", updateUser=" + updateUser + ", updateTime=" + updateTime
				+ ", ableFlag=" + ableFlag + ", deleteFlag=" + deleteFlag + "]";
	}

}