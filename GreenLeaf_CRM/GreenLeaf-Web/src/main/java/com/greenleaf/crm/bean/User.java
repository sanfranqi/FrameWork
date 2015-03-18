package com.greenleaf.crm.bean;

import com.greenleaf.common.mybatis.annotation.Id;
import com.greenleaf.common.mybatis.annotation.Table;

/**
 * 
 * @author QiSF 2015-03-13
 */
@Table("T_USER")
public class User {

	@Id
	private Integer id;

	private String name;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

}
