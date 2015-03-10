package com.greenleaf.common.export.dto;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import com.greenleaf.common.bean.ResultVO;
import com.greenleaf.common.utils.DateUtil;

/**
 * excel数据单元格DTO.
 * 
 * @author qingwu
 * @date 2014-1-24 下午5:52:02
 */
public class ExcelDataDTO {

	private String dateFormat = "yyyy/MM/dd";

	private ICheck check;

	/**
	 * 列名.
	 */
	private String colName;

	/**
	 * 单元格内容.
	 */
	private Object cellValue;

	/**
	 * 内容类型.
	 */
	private String valueType;

	/**
	 * 映射字段.
	 */
	private String mapperField;

	/**
	 * 行标志(从1开始).
	 */
	private Integer row;

	/**
	 * 列标志(从1开始).
	 */
	private Integer col;

	public ExcelDataDTO() {

	}

	public interface ICheck {
		public ResultVO validate(Object cellValue);
	}

	/**
	 * 不带校验的初始化.
	 * 
	 * @param colName
	 * @param cellValue
	 * @param valueType
	 * @param mapperField
	 * @param row
	 * @param col
	 */
	public ExcelDataDTO(String colName, String cellValue, String valueType, String mapperField, Integer row, Integer col) {
		init(colName, cellValue, valueType, mapperField, row, col);
	}

	/**
	 * 不带校验的初始化.
	 * 
	 * @param colName
	 * @param cellValue
	 * @param valueType
	 * @param mapperField
	 * @param row
	 * @param col
	 * @param dateFormat
	 */
	public ExcelDataDTO(String colName, String cellValue, String valueType, String mapperField, Integer row, Integer col, String dateFormat) {
		this.dateFormat = dateFormat;
		init(colName, cellValue, valueType, mapperField, row, col);
	}

	/**
	 * 带校验的初始化.
	 * 
	 * @param colName
	 * @param cellValue
	 * @param valueType
	 * @param mapperField
	 * @param row
	 * @param col
	 * @param check
	 */
	public ExcelDataDTO(String colName, String cellValue, String valueType, String mapperField, Integer row, Integer col, ICheck check) {
		this.check = check;
		init(colName, cellValue, valueType, mapperField, row, col);
	}

	/**
	 * 带校验的初始化.
	 * 
	 * @param colName
	 * @param cellValue
	 * @param valueType
	 * @param mapperField
	 * @param row
	 * @param col
	 * @param dateFormat
	 * @param check
	 */
	public ExcelDataDTO(String colName, String cellValue, String valueType, String mapperField, Integer row, Integer col, String dateFormat, ICheck check) {
		this.check = check;
		this.dateFormat = dateFormat;
		if (check.validate(cellValue).isSuccess() == true) {
			init(colName, cellValue, valueType, mapperField, row, col);
		}
	}

	/**
	 * 初始化.
	 * 
	 * @param colName
	 * @param cellValue
	 * @param valueType
	 * @param mapperField
	 * @param row
	 * @param col
	 * @author qingwu
	 * @date 2014-1-24 下午6:27:37
	 */
	public void init(String colName, String cellValue, String valueType, String mapperField, Integer row, Integer col) {
		this.colName = colName;
		this.mapperField = mapperField;
		this.row = row;
		this.col = col;
		this.valueType = valueType;
		this.cellValue = cellValue;
		if (cellValue != null && !cellValue.equals("")) {
			if (this.valueType.equals(ExcelCellType.LONG)) {
				this.cellValue = Long.valueOf(cellValue);
			} else if (this.valueType.equals(ExcelCellType.DATE)) {
				try {
					this.cellValue = new Timestamp(DateUtil.parseDate(cellValue, this.dateFormat).getTime());
				} catch (Exception e) {
					final String _colName = this.colName;
					final String _format = this.dateFormat;
					this.check = new ICheck() {

						@Override
						public ResultVO validate(Object cellValue) {
							ResultVO result = new ResultVO(false);
							result.addMsg(_colName + "不符合日期格式[" + _format + "]!");
							return result;
						}

					};
				}
			} else if (this.valueType.equals(ExcelCellType.DOUBLE)) {
				this.cellValue = Double.parseDouble(cellValue);
			}
		}
	}

	/**
	 * 校验.
	 * 
	 * @return
	 * @author qingwu
	 * @date 2014-1-26 上午9:42:33
	 */
	public ResultVO validate() {
		if (this.check != null) {
			ResultVO result = this.check.validate(cellValue);
			// 提示信息增加行列标志
			List<String> _msg = new ArrayList<String>();
			for (int i = 0; i < result.getMsg().size(); i++) {
				_msg.add(getErrMsg(this.row, this.col, result.getMsg().get(i)));
			}
			result.setMsg(_msg);
			return result;
		}
		return new ResultVO(true);
	}

	/**
	 * 获得错误提示.
	 * 
	 * @param rowIndex
	 *            行标志
	 * @param colIndex
	 *            列标志
	 * @param msg
	 *            错误信息
	 * @return
	 * @author qingwu
	 * @date 2014-1-24 下午5:47:31
	 */
	private String getErrMsg(int rowIndex, int colIndex, String msg) {
		String[] col = { "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" };
		String s = "第" + rowIndex + "行" + col[colIndex] + "列" + msg;
		return s;
	}

	/**
	 * @return the colName
	 */
	public String getColName() {
		return colName;
	}

	/**
	 * @param colName
	 *            the colName to set
	 */
	public void setColName(String colName) {
		this.colName = colName;
	}

	/**
	 * @return the cellValue
	 */
	public Object getCellValue() {
		return cellValue;
	}

	/**
	 * @param cellValue
	 *            the cellValue to set
	 */
	public void setCellValue(Object cellValue) {
		this.cellValue = cellValue;
	}

	/**
	 * @return the valueType
	 */
	public String getValueType() {
		return valueType;
	}

	/**
	 * @param valueType
	 *            the valueType to set
	 */
	public void setValueType(String valueType) {
		this.valueType = valueType;
	}

	/**
	 * @return the mapperField
	 */
	public String getMapperField() {
		return mapperField;
	}

	/**
	 * @param mapperField
	 *            the mapperField to set
	 */
	public void setMapperField(String mapperField) {
		this.mapperField = mapperField;
	}

	/**
	 * @return the row
	 */
	public Integer getRow() {
		return row;
	}

	/**
	 * @param row
	 *            the row to set
	 */
	public void setRow(Integer row) {
		this.row = row;
	}

	/**
	 * @return the col
	 */
	public Integer getCol() {
		return col;
	}

	/**
	 * @param col
	 *            the col to set
	 */
	public void setCol(Integer col) {
		this.col = col;
	}

	/**
	 * @return the dateFormat
	 */
	public String getDateFormat() {
		return dateFormat;
	}

	/**
	 * @param dateFormat
	 *            the dateFormat to set
	 */
	public void setDateFormat(String dateFormat) {
		this.dateFormat = dateFormat;
	}

}
