package com.greenleaf.common.export.processor;

import java.io.IOException;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;

import com.greenleaf.common.export.dto.ExportColInfoDTO;
import com.greenleaf.common.export.dto.ExportWorksheetInfoDTO;

/**
 * 导出处理器抽象类.
 * 
 * <pre>
 * 修改日期     修改人 修改原因
 * 2013-04-12   zhufu   新建
 * </pre>
 */
public abstract class AbstractExportProcessor implements IExportProcessor {
	/**
	 * 网格导出配置DTO.
	 */
	private List<ExportColInfoDTO> exportColInfoList;
	/**
	 * worksheet 信息列表.
	 */
	private List<ExportWorksheetInfoDTO> exportWorksheetInfoList;
	/**
	 * response.
	 */
	protected OutputStream outputStream;

	/**
	 * 默认编码.
	 */
	protected String defaultEncoding = "utf-8";

	/**
	 * 导出数据编码.
	 */
	protected String exportDataEncoding = "utf-8";
	/**
	 * 結果集.
	 */
	protected List<Map<String, Object>>[] dataLists;

	/**
	 * 检查文件名是否包含指定后缀.
	 * 
	 * @param exportName
	 *            导出文件名
	 * @param postfix
	 *            文件名后缀
	 * @return 包含返回true，不包含返回false
	 * 
	 *         <pre>
	 * 修改日期     修改人 修改原因
	 * 2013-04-12   zhufu   新建
	 * </pre>
	 */
	protected boolean checkPostfix(String exportName, String postfix) {
		if (exportName.contains(postfix)) {
			return true;
		}
		return false;
	}

	/**
	 * AbstractExportProcessor.
	 * 
	 * @param gridExportDTO
	 *            网格导出配置
	 * @param response
	 *            response
	 */
	public AbstractExportProcessor(List<ExportColInfoDTO> exportColInfoList, OutputStream outputStream) {
		this.exportColInfoList = exportColInfoList;
		this.outputStream = outputStream;
	}

	/**
	 * @param exportColInfoList
	 * @param exportWorksheetInfoList
	 * @param outputStream
	 */
	public AbstractExportProcessor(List<ExportColInfoDTO> exportColInfoList, List<ExportWorksheetInfoDTO> exportWorksheetInfoList, OutputStream outputStream) {
		this.exportColInfoList = exportColInfoList;
		this.exportWorksheetInfoList = exportWorksheetInfoList;
		this.outputStream = outputStream;
	}

	/**
	 * 
	 * @param headName
	 * @param headField
	 * @param outputStream
	 */
	public AbstractExportProcessor(String[] headName, String[] headField, OutputStream outputStream) {
		List<ExportColInfoDTO> exportColInfoList = new ArrayList<ExportColInfoDTO>();
		for (int i = 0; i < headName.length; i++) {// 导出表头信息
			ExportColInfoDTO exportColInfoDTO = new ExportColInfoDTO();
			exportColInfoDTO.setColName(headName[i]);
			exportColInfoDTO.setFieldName(headField[i]);
			exportColInfoList.add(exportColInfoDTO);
		}
		this.exportColInfoList = exportColInfoList;
		this.outputStream = outputStream;
	}

	/**
	 * 导出表头.
	 * 
	 * <pre>
	 * 修改日期     修改人 修改原因
	 * 2013-04-12   zhufu   新建
	 * </pre>
	 * 
	 * @throws IOException
	 *             IO异常
	 */
	protected abstract void exportColHeader() throws IOException;

	/**
	 * 导出数组增加分隔符到response.
	 * 
	 * @param list
	 *            数组
	 * @param separator
	 *            分隔符
	 * @param encoding
	 *            编码
	 * @throws IOException
	 *             io异常
	 * 
	 *             <pre>
	 * 修改日期     修改人 修改原因
	 * 2013-04-12   zhufu   新建
	 * </pre>
	 */
	protected void writeArrayToResponse(List<String> list, String separator, String encoding) throws IOException {
		String args = encoding;
		if (StringUtils.isBlank(args)) {
			args = defaultEncoding;
		}
		IOUtils.write(StringUtils.join(list.toArray(), separator), outputStream, args);
	}

	/**
	 * 去除不需要导出的列.
	 * 
	 * <pre>
	 * 修改日期     修改人 修改原因
	 * 2011-12-21   zhufu   新建
	 * </pre>
	 */
	protected void exclusionCol() {
	}

	/**
	 * 获得导出列信息列表.
	 * 
	 * @return 导出列信息列表
	 */
	protected List<ExportColInfoDTO> getExportColInfoList() {
		return exportColInfoList;
	}

	/**
	 * 设置导出列信息列表.
	 * 
	 * @param exportColInfoList
	 *            导出列信息列表
	 */
	protected void setExportColInfoList(List<ExportColInfoDTO> exportColInfoList) {
		this.exportColInfoList = exportColInfoList;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.cyou.fz.common.export.processor.IExportProcessor#export(java.util
	 * .List)
	 */
	@Override
	public void export(List<Map<String, Object>>... dataLists) {
		processBegin();
		processResult(dataLists);
		processEnd();
	}

	/**
	 * @return the exportWorksheetInfoList
	 */
	public List<ExportWorksheetInfoDTO> getExportWorksheetInfoList() {
		return exportWorksheetInfoList;
	}

	/**
	 * @param exportWorksheetInfoList
	 *            the exportWorksheetInfoList to set
	 */
	public void setExportWorksheetInfoList(List<ExportWorksheetInfoDTO> exportWorksheetInfoList) {
		this.exportWorksheetInfoList = exportWorksheetInfoList;
	}
}
