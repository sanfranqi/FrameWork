package com.greenleaf.common.jms;

import java.util.Map;

import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.MessageListener;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.greenleaf.common.exception.UnCaughtException;

/**
 * 消息处理类.
 * 
 * <pre>
 * 修改日期			修改人		修改原因
 * 2013-03-24       崔诗杰                        新建
 * 
 * </pre>
 */
public class JmsSpringReceiverListener implements MessageListener {
	/** 日志处理器 . */
	private static Logger logger = LoggerFactory.getLogger(JmsSpringReceiverListener.class);

	/** 处理器map . */
	private Map<?, ?> processorMap;

	/**
	 * 监听消息处理
	 * 
	 * @param message
	 *            消息对象
	 * 
	 *            <pre>
	 * 修改日期        修改人    修改原因
	 * 2011-11-29       崔诗杰         新建
	 * </pre>
	 */
	@Override
	public void onMessage(Message message) {
		if (null != message) {
			JmsProcessorSpi jmsProcessor = null;
			try {
				// 消息业务代码
				String appMessageCode = message.getJMSType();
				if (StringUtils.isEmpty(appMessageCode)) {
					logger.error("消息没有设置消息业务标识");
					throw new JMSException("消息没有设置消息业务标识");
				}

				if (null == processorMap) {
					logger.error("没有设置消息处理器");
					throw new JMSException("没有设置消息处理器");
				}
				// 获取对应的业务代码的消息处理器
				jmsProcessor = (JmsProcessorSpi) processorMap.get(appMessageCode);
				if (null == jmsProcessor) {
					logger.error("消息业务标识：{}没有配置对应的处理类", appMessageCode);
					throw new JMSException("消息业务标识:" + appMessageCode + "没有配置对应的处理类");
				}
				// 调用处理器的消费消息方法
				jmsProcessor.processMsg(message);
			} catch (Exception e) {
				logger.error("调用处理类出错：{}", jmsProcessor.getClass(), e);
				throw new UnCaughtException(e);
			}
		}

	}

	public Map<?, ?> getProcessorMap() {
		return processorMap;
	}

	public void setProcessorMap(Map<?, ?> processorMap) {
		this.processorMap = processorMap;
	}

}
