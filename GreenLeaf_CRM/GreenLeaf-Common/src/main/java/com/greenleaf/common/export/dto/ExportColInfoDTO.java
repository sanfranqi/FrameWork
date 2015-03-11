package com.greenleaf.common.export.dto;

/**
 * EXPORT_COL导出列配置DTO对象.
 * 
 * @author QiSF 2015-03-11
 */
public class ExportColInfoDTO implements java.io.Serializable {

	/**
	 * 序列号id.
	 */
	private static final long serialVersionUID = 111212160336135L;

	/**
	 * 列字段名.
	 */
	private String fieldName;
	/**
	 * 列名.
	 */
	private String colName;
	/**
	 * 导出标识.TRUE:导出,FALSE:不导出.(暂时为保留字段不使用)
	 */
	private Boolean exportFlag;

	public ExportColInfoDTO() {
	}

	/**
	 * 完整构造函数.
	 * 
	 * @param fieldName
	 *            字段名，比如：name或者key或者password
	 * @param colName
	 *            表头列名， 比如：名称或者键或者密码
	 * @param exportFlag
	 *            是否排除此字段，本字段暂不使用
	 */
	public ExportColInfoDTO(String fieldName, String colName, Boolean exportFlag) {
		this.fieldName = fieldName;
		this.colName = colName;
		this.exportFlag = exportFlag;
	}

	/**
	 * 列字段名.
	 * 
	 * @return 列字段名
	 */
	public String getFieldName() {
		return this.fieldName;
	}

	/**
	 * 列字段名.
	 * 
	 * @param fieldName
	 *            列字段名
	 */
	public void setFieldName(String fieldName) {
		this.fieldName = fieldName;
	}

	/**
	 * 列名.
	 * 
	 * @return 列名
	 */
	public String getColName() {
		return this.colName;
	}

	/**
	 * 设置列显示名（表头）.
	 * 
	 * @param colName
	 *            列名
	 */
	public void setColName(String colName) {
		this.colName = colName;
	}

	/**
	 * 导出标识TRUE.导出 FALSE不导出.(暂时为保留字段不使用)
	 * 
	 * @return 导出标识
	 */
	public Boolean getExportFlag() {
		return this.exportFlag;
	}

	/**
	 * 导出标识TRUE.导出 FALSE不导出.(暂时为保留字段不使用)
	 * 
	 * @param exportFlag
	 *            导出标识
	 */
	public void setExportFlag(Boolean exportFlag) {
		this.exportFlag = exportFlag;
	}

}