/**
 * 北京畅游是空软件技术有限公司福州分公司 - 版权所有
 * 2013-4-12 上午10:37:04
 */
package com.greenleaf.common.export.processor;

import java.util.List;
import java.util.Map;

/**
 * 
 * RPC调用查询结果处理器.
 * 
 * <pre>
 * 修改日期        修改人    修改原因
 * 2013-04-12    朱赋    新建
 * </pre>
 */
public interface IExportProcessor {

	/**
	 * 处理开始通知.
	 * 
	 * <pre>
	 * 修改日期        修改人    修改原因
	 * 2013-04-12    朱赋    新建
	 * </pre>
	 */
	void processBegin();

	/**
	 * 查询结果调用回调.
	 * 
	 * <pre>
	 * 修改日期        修改人    修改原因
	 * 2013-04-12    朱赋    新建
	 * </pre>
	 */
	void processEnd();

	/**
	 * 结果集处理.
	 * 
	 * @param dataList
	 *            数据结果集
	 * 
	 *            <pre>
	 * 修改日期        修改人    修改原因
	 * 2013-04-12    朱赋    新建
	 * </pre>
	 */
	void processResult(List<Map<String, Object>>... dataLists);

	/**
	 * 不需要过程处理时,可调用此方法统一输出.支持多个dataList, 放在多个sheet中.
	 * 
	 * @param dataLists
	 *            数据列表的列表
	 * @author zhufu
	 * @version 2013-9-26 上午11:48:21
	 */
	void export(List<Map<String, Object>>... dataLists);

}
