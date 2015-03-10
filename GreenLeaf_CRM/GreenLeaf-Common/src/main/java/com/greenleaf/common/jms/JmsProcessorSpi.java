package com.greenleaf.common.jms;

import javax.jms.Message;

/**
 * 
 * 接口说明:应用信息消息处理器接口.
 * 
 * <pre>
 * 修改日期      修改人    修改原因
 * 2013-03-24    崔诗杰    新建
 * </pre>
 */
public interface JmsProcessorSpi {

	/**
	 * 
	 * 处理消息,此方法如果抛出异常，消息将没有被消费.
	 * 
	 * @param message
	 *            消息对象
	 * @return
	 * 
	 *         <pre>
	 * 修改日期      修改人    修改原因
	 * 2013-03-24    崔诗杰    新建
	 * </pre>
	 */
	void processMsg(Message message);
}
