/**
 * 北京畅游是空软件技术有限公司福州分公司 - 版权所有
 * 2013-4-12 上午10:37:04
 */
package com.greenleaf.common.export.processor;

import java.io.IOException;
import java.io.OutputStream;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.util.HtmlUtils;

import com.greenleaf.common.exception.UnCaughtException;
import com.greenleaf.common.export.dto.ExportColInfoDTO;
import com.greenleaf.common.export.dto.ExportWorksheetInfoDTO;
import com.greenleaf.common.utils.ValueUtil;

/**
 * excel导出处理器.
 * 
 * <pre>
 * 修改日期     修改人 修改原因
 * 2013-04-12   zhufu   新建
 * </pre>
 */
public class ExcelExportProcessor extends AbstractExportProcessor implements IExportProcessor {
	/**
	 * 日志.
	 */
	private static Logger logger = LoggerFactory.getLogger(ExcelExportProcessor.class);

	/**
	 * 构造.
	 * 
	 * @param headName
	 *            列名称
	 * @param headField
	 *            列对应字段
	 * @param outputStream
	 *            输出流
	 */
	public ExcelExportProcessor(String[] headName, String[] headField, OutputStream outputStream) {
		super(headName, headField, outputStream);
	}

	/**
	 * 构造.
	 * 
	 */
	public ExcelExportProcessor(List<ExportColInfoDTO> exportColInfoList, OutputStream outputStream) {
		super(exportColInfoList, outputStream);
	}

	/**
	 * 构造.带有worksheet信息
	 * 
	 */
	public ExcelExportProcessor(List<ExportColInfoDTO> exportColInfoList, List<ExportWorksheetInfoDTO> exportWorksheetInfoList, OutputStream outputStream) {
		super(exportColInfoList, exportWorksheetInfoList, outputStream);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.shine.eframe.webapp.base.pub.export.processor.AbstractExportProcessor
	 * #exportColHeader()
	 */
	@Override
	protected void exportColHeader() throws IOException {
		StringBuffer data = new StringBuffer();
		data.append("    <Row ss:StyleID=\"header\">\r\n");
		for (ExportColInfoDTO exportColInfoDTO : getExportColInfoList()) {
			// 需要将内容转码 避免标签注入
			data.append("        <Cell><Data ss:Type='String'>" + HtmlUtils.htmlEscape(exportColInfoDTO.getColName()) + "</Data></Cell>\r\n");
		}
		data.append("    </Row>\r\n");
		IOUtils.write(data.toString(), outputStream, defaultEncoding);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @seecom.shine.eframe.webapp.servlet.rpc.helper.RpcShineRowSetProcessor#
	 * processBegin()
	 */
	@Override
	public void processBegin() {
		exclusionCol();
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see
	 * com.shine.eframe.webapp.servlet.rpc.helper.RpcShineRowSetProcessor#processEnd
	 * ()
	 */
	@Override
	public void processEnd() {

	}

	/*
	 * (non-Javadoc)
	 * 
	 * @seecom.shine.eframe.webapp.servlet.rpc.helper.RpcShineRowSetProcessor#
	 * processResult(com.shine.pub.query.ShineRowSet)
	 */
	@Override
	public void processResult(List<Map<String, Object>>... dataLists) throws UnCaughtException {
		try {
			this.dataLists = dataLists;
			// 导出xml头
			exportHeader();
			// 导出数据
			exportData();
			// 导出结束标签
			exportLaster();
		} catch (IOException e) {
			String errTagMsg = "写入信息到response出错";
			throw new UnCaughtException(errTagMsg, e);
		}
	}

	/**
	 * 导出数据.
	 * 
	 * @throws IOException
	 *             IOException
	 * 
	 *             <pre>
	 * 修改日期     修改人 修改原因
	 * 2013-04-12   zhufu   新建
	 * </pre>
	 */
	private void exportData() throws IOException {
		// 导出数据
		List<ExportColInfoDTO> exportColInfoList = getExportColInfoList();

		int i = 0;
		for (List<Map<String, Object>> dataList : dataLists) { // 每个list数据生成一个sheet
			List<ExportWorksheetInfoDTO> exportWorksheetInfoList = getExportWorksheetInfoList();
			String worksheetName = null;
			if (exportWorksheetInfoList != null) {
				try {
					worksheetName = exportWorksheetInfoList.get(i).getName();
				} catch (Exception e) {
					logger.error("未对当前worksheet写入名称");
					worksheetName = new StringBuilder().append("第").append(i + 1).append("页").toString();
				}
			} else {
				worksheetName = new StringBuilder().append("第").append(i + 1).append("页").toString();
			}
			i++;
			// 写入 worksheet 头部
			exportWorksheetBegin(worksheetName);
			// 导出列表头
			exportColHeader();

			Integer dataListSize = dataList.size();
			for (int row = 0; row < dataListSize; row++) {
				IOUtils.write("    <Row>\r\n", outputStream, defaultEncoding);
				for (ExportColInfoDTO exportColInfo : exportColInfoList) {
					String cellType = "String";
					String cellText = null;
					// 原值
					Object val = dataList.get(row).get(exportColInfo.getFieldName());
					// 判断是否为Number，不是的一律为String
					if (val instanceof Number) {
						cellType = "Number";
					}
					// 获得显示值
					cellText = ValueUtil.getString(val);
					if (cellText == null) {
						cellText = "";
					}
					// 需要将内容转码 避免标签注入
					IOUtils.write("        <Cell><Data ss:Type='" + cellType + "'>" + HtmlUtils.htmlEscape(cellText) + "</Data></Cell>\r\n", outputStream, defaultEncoding);
				}
				IOUtils.write("    </Row>\r\n", outputStream, defaultEncoding);
			}
			// 写入worksheet尾部
			exportWorksheetEnd();
		}
	}

	/**
	 * 导出excel头部.
	 * 
	 * @throws IOException
	 *             IOException
	 * 
	 *             <pre>
	 * 修改日期     修改人 修改原因
	 * 2013-04-12   zhufu   新建
	 * </pre>
	 */
	private void exportHeader() throws IOException {
		StringBuffer data = new StringBuffer();
		data.append("<?xml version='1.0' encoding='UTF-8'?>\r\n").append("<?mso-application progid='Excel.Sheet'?>\r\n").append("<Workbook xmlns='urn:schemas-microsoft-com:office:spreadsheet'\r\n")
				.append("xmlns:o='urn:schemas-microsoft-com:office:office'\r\n").append("xmlns:x='urn:schemas-microsoft-com:office:excel'\r\n")
				.append("xmlns:ss='urn:schemas-microsoft-com:office:spreadsheet'\r\n").append("xmlns:html='http://www.w3.org/TR/REC-html40'>\r\n");
		data.append("<Styles>\r\n");
		data.append("    <Style ss:ID='Default' ss:Name='Normal'>\r\n");
		data.append("        <Alignment ss:Vertical='Center'/>\r\n");
		data.append("        <Borders/>\r\n");
		data.append("        <Font x:CharSet='134' ss:Size='10'/>\r\n");
		data.append("        <Interior/>\r\n");
		data.append("        <NumberFormat/>\r\n");
		data.append("        <Protection/>\r\n");
		data.append("    </Style>\r\n");
		// 设置表头
		data.append("    <ss:Style ss:ID=\"header\">\r\n");
		data.append("        <ss:Font ss:Bold=\"1\"/>\r\n");
		data.append("        <ss:Alignment ss:Horizontal=\"Center\" ss:Vertical=\"Center\"/>\r\n");
		// 设置表头的边框
		data.append("        <Borders>\r\n");
		data.append("        <Border ss:Position=\"Bottom\" ss:LineStyle=\"Continuous\" ss:Weight=\"1\"/>\r\n");
		data.append("        <Border ss:Position=\"Left\" ss:LineStyle=\"Continuous\" ss:Weight=\"1\"/>\r\n");
		data.append("        <Border ss:Position=\"Right\" ss:LineStyle=\"Continuous\" ss:Weight=\"1\"/>\r\n");
		data.append("        <Border ss:Position=\"Top\" ss:LineStyle=\"Continuous\" ss:Weight=\"1\"/>\r\n");
		data.append("        </Borders>\r\n");
		// 设置表头的填充色
		data.append("        <Interior ss:Color=\"#92D050\" ss:Pattern=\"Solid\"/>\r\n");
		data.append("    </ss:Style>");
		data.append("</Styles>\r\n");
		IOUtils.write(data.toString(), outputStream, defaultEncoding);
	}

	/**
	 * 输出worksheet的头部到ouputstream.
	 * 
	 * @param worksheetName
	 *            worksheet名称
	 * @throws IOException
	 * @author zhufu
	 * @version 2013-9-26 下午11:42:16
	 */
	private void exportWorksheetBegin(String worksheetName) throws IOException {
		StringBuilder data = new StringBuilder();

		data.append("<Worksheet ss:Name='").append(worksheetName).append("'>\r\n<Table>\r\n");
		// 设置列宽
		for (ExportColInfoDTO exportColInfo : getExportColInfoList()) {
			Integer charWidth = 10;
			data.append("    <ss:Column ss:Width=\"" + exportColInfo.getColName().getBytes().length * charWidth + "\"/>\r\n");
			logger.debug("列[{}]的长度:[{}]", exportColInfo.getColName(), exportColInfo.getColName().length());
		}
		IOUtils.write(data.toString(), outputStream, defaultEncoding);
	}

	/**
	 * 输出worksheet的结尾到outputstream.
	 * 
	 * @throws IOException
	 *             IOException
	 * @author zhufu
	 * @version 2013-9-26 下午5:10:32
	 */
	private void exportWorksheetEnd() throws IOException {
		IOUtils.write("</Table>\r\n</Worksheet>\r\n", outputStream, defaultEncoding);
	}

	/**
	 * 导出结束标签.
	 * 
	 * @throws IOException
	 *             IOException
	 * 
	 *             <pre>
	 * 修改日期     修改人 修改原因
	 * 2013-04-12   zhufu   新建
	 * </pre>
	 */
	private void exportLaster() throws IOException {
		IOUtils.write("</Workbook>", outputStream, defaultEncoding);
	}

}
