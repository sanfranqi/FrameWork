package com.greenleaf.common.jms;

import javax.jms.Message;

/**
 * 应用信息消息处理器接口.
 * 
 * @author QiSF 2015-03-11
 */
public interface JmsProcessorSpi {

	/**
	 * 
	 * 处理消息,此方法如果抛出异常，消息将没有被消费.
	 * 
	 * @param message
	 *            消息对象
	 * @return
	 */
	void processMsg(Message message);
}
