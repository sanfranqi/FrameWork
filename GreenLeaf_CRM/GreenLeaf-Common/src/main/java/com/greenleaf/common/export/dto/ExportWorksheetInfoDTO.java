package com.greenleaf.common.export.dto;

import java.io.Serializable;

/**
 * excel worksheet信息.
 * 
 * @author QiSF 2015-03-11
 */
public class ExportWorksheetInfoDTO implements Serializable {

	private static final long serialVersionUID = 1L;
	/** worksheet名称. */
	private String name;

	public ExportWorksheetInfoDTO(String name) {
		this.name = name;
	}

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

	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("ExportWorksheetInfoDTO [name=");
		builder.append(name);
		builder.append("]");
		return builder.toString();
	}
}
