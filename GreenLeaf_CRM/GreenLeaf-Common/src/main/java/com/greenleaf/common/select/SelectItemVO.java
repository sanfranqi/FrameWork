package com.greenleaf.common.select;

import java.io.Serializable;

/**
 * 下拉框VO.
 * 
 * @author QiSF 2015-03-11
 */
public class SelectItemVO implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -4964560958317676420L;

	/**
	 * 值.
	 */
	private String id;

	/**
	 * 显示名称.
	 */
	private String text;

	public SelectItemVO() {

	}

	public SelectItemVO(String id, String text) {
		this.id = id;
		this.text = text;
	}

	/**
	 * @return the value
	 */
	public String getId() {
		return id;
	}

	/**
	 * @param id
	 *            the value to set
	 */
	public void setId(String id) {
		this.id = id;
	}

	/**
	 * @return the text
	 */
	public String getText() {
		return text;
	}

	/**
	 * @param text
	 *            the text to set
	 */
	public void setText(String text) {
		this.text = text;
	}

}
