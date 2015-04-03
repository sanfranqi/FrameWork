package com.greenleaf.crm.bean;

import com.greenleaf.common.mybatis.annotation.Id;
import com.greenleaf.common.mybatis.annotation.Table;

@Table("USER")
public class User {
	@Id
	private Integer id;

	private String userNo;

	private String company;

	private String fullName;

	private String nameCode;

	private String userPwd;

	private String identification;

	private String email;

	private String mobile;

	private String telephone;

	private String marryFlag;

	private String qq;

	private Integer position;

	private Integer userRank;

	private Long joinDate;

	private Long regularizeDate;

	private Long contrBeginDate;

	private Long contrEndDate;

	private String gender;

	private String userRegion;

	private String occupState;

	private Integer depart;

	private String workPlace;

	private String avatar;

	private Long birthday;

	private Long pwdLastSet;

	private String comments;

	private Integer addUser;

	private Long addTime;

	private Integer updateUser;

	private Long updateTime;

	private String enableFlag;

	private String deleteFlag;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getUserNo() {
		return userNo;
	}

	public void setUserNo(String userNo) {
		this.userNo = userNo == null ? null : userNo.trim();
	}

	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company == null ? null : company.trim();
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName == null ? null : fullName.trim();
	}

	public String getNameCode() {
		return nameCode;
	}

	public void setNameCode(String nameCode) {
		this.nameCode = nameCode == null ? null : nameCode.trim();
	}

	public String getUserPwd() {
		return userPwd;
	}

	public void setUserPwd(String userPwd) {
		this.userPwd = userPwd == null ? null : userPwd.trim();
	}

	public String getIdentification() {
		return identification;
	}

	public void setIdentification(String identification) {
		this.identification = identification == null ? null : identification.trim();
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email == null ? null : email.trim();
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile == null ? null : mobile.trim();
	}

	public String getTelephone() {
		return telephone;
	}

	public void setTelephone(String telephone) {
		this.telephone = telephone == null ? null : telephone.trim();
	}

	public String getMarryFlag() {
		return marryFlag;
	}

	public void setMarryFlag(String marryFlag) {
		this.marryFlag = marryFlag == null ? null : marryFlag.trim();
	}

	public String getQq() {
		return qq;
	}

	public void setQq(String qq) {
		this.qq = qq == null ? null : qq.trim();
	}

	public Integer getPosition() {
		return position;
	}

	public void setPosition(Integer position) {
		this.position = position;
	}

	public Integer getUserRank() {
		return userRank;
	}

	public void setUserRank(Integer userRank) {
		this.userRank = userRank;
	}

	public Long getJoinDate() {
		return joinDate;
	}

	public void setJoinDate(Long joinDate) {
		this.joinDate = joinDate;
	}

	public Long getRegularizeDate() {
		return regularizeDate;
	}

	public void setRegularizeDate(Long regularizeDate) {
		this.regularizeDate = regularizeDate;
	}

	public Long getContrBeginDate() {
		return contrBeginDate;
	}

	public void setContrBeginDate(Long contrBeginDate) {
		this.contrBeginDate = contrBeginDate;
	}

	public Long getContrEndDate() {
		return contrEndDate;
	}

	public void setContrEndDate(Long contrEndDate) {
		this.contrEndDate = contrEndDate;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender == null ? null : gender.trim();
	}

	public String getUserRegion() {
		return userRegion;
	}

	public void setUserRegion(String userRegion) {
		this.userRegion = userRegion == null ? null : userRegion.trim();
	}

	public String getOccupState() {
		return occupState;
	}

	public void setOccupState(String occupState) {
		this.occupState = occupState == null ? null : occupState.trim();
	}

	public Integer getDepart() {
		return depart;
	}

	public void setDepart(Integer depart) {
		this.depart = depart;
	}

	public String getWorkPlace() {
		return workPlace;
	}

	public void setWorkPlace(String workPlace) {
		this.workPlace = workPlace == null ? null : workPlace.trim();
	}

	public String getAvatar() {
		return avatar;
	}

	public void setAvatar(String avatar) {
		this.avatar = avatar == null ? null : avatar.trim();
	}

	public Long getBirthday() {
		return birthday;
	}

	public void setBirthday(Long birthday) {
		this.birthday = birthday;
	}

	public Long getPwdLastSet() {
		return pwdLastSet;
	}

	public void setPwdLastSet(Long pwdLastSet) {
		this.pwdLastSet = pwdLastSet;
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

	public String getEnableFlag() {
		return enableFlag;
	}

	public void setEnableFlag(String enableFlag) {
		this.enableFlag = enableFlag == null ? null : enableFlag.trim();
	}

	public String getDeleteFlag() {
		return deleteFlag;
	}

	public void setDeleteFlag(String deleteFlag) {
		this.deleteFlag = deleteFlag == null ? null : deleteFlag.trim();
	}

	@Override
	public String toString() {
		return "User [id=" + id + ", userNo=" + userNo + ", company=" + company + ", fullName=" + fullName + ", nameCode=" + nameCode + ", userPwd=" + userPwd + ", identification=" + identification
				+ ", email=" + email + ", mobile=" + mobile + ", telephone=" + telephone + ", marryFlag=" + marryFlag + ", qq=" + qq + ", position=" + position + ", userRank=" + userRank
				+ ", joinDate=" + joinDate + ", regularizeDate=" + regularizeDate + ", contrBeginDate=" + contrBeginDate + ", contrEndDate=" + contrEndDate + ", gender=" + gender + ", userRegion="
				+ userRegion + ", occupState=" + occupState + ", depart=" + depart + ", workPlace=" + workPlace + ", avatar=" + avatar + ", birthday=" + birthday + ", pwdLastSet=" + pwdLastSet
				+ ", comments=" + comments + ", addUser=" + addUser + ", addTime=" + addTime + ", updateUser=" + updateUser + ", updateTime=" + updateTime + ", enableFlag=" + enableFlag
				+ ", deleteFlag=" + deleteFlag + "]";
	}

}