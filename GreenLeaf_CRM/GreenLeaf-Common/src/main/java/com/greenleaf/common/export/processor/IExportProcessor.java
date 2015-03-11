package com.greenleaf.common.export.processor;

import java.util.List;
import java.util.Map;

/**
 * RPC调用查询结果处理器.
 * 
 * @author QiSF 2015-03-11
 */
public interface IExportProcessor {

	/**
	 * 处理开始通知.
	 */
	void processBegin();

	/**
	 * 查询结果调用回调.
	 */
	void processEnd();

	/**
	 * 结果集处理.
	 */
	void processResult(List<Map<String, Object>>... dataLists);

	/**
	 * 不需要过程处理时,可调用此方法统一输出.支持多个dataList, 放在多个sheet中.
	 */
	void export(List<Map<String, Object>>... dataLists);

}
