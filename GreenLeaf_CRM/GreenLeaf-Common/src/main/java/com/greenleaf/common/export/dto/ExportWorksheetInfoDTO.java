package com.greenleaf.common.export.dto;

import java.io.Serializable;

/**
 * excel worksheet信息.
 * 
 * @author zhufu
 * @version 2013-9-26 下午11:24:48
 */
public class ExportWorksheetInfoDTO implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	/** worksheet名称. */
	private String name;

	/**
	 * @param name
	 */
	public ExportWorksheetInfoDTO(String name) {
		this.name = name;
	}

	/**
	 * 
	 */
	public ExportWorksheetInfoDTO() {
		super();
	}

	/**
	 * get worksheet名称.
	 * 
	 * @return worksheet名称.
	 */
	public String getName() {
		return name;
	}

	/**
	 * set worksheet名称.
	 * 
	 * @param name
	 *            worksheet名称.
	 */
	public void setName(String name) {
		this.name = name;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("ExportWorksheetInfoDTO [name=");
		builder.append(name);
		builder.append("]");
		return builder.toString();
	}

}
