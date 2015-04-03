package com.greenleaf.crm.vo;


public class RoleVo {
	private Integer id;

	private String roleName;

	private String comments;

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

	@Override
	public String toString() {
		return "RoleVo [id=" + id + ", roleName=" + roleName + ", comments=" + comments + "]";
	}
}