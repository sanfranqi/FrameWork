package com.greenleaf.common.jms;

import java.io.Serializable;

import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.ObjectMessage;
import javax.jms.Session;
import javax.jms.TextMessage;

import org.springframework.jms.core.JmsTemplate;
import org.springframework.jms.core.MessageCreator;

import com.greenleaf.common.context.ApplicationContextUtil;

/**
 * 消息发送类.
 * 
 * @author QiSF 2015-03-11
 */
public class JmsSender {

	/** 默认使用点对点模式模板 . */
	private JmsTemplate queueTemplate = null;

	/** 发布订阅模式模板 . */
	private JmsTemplate topicTemplate = null;

	/** 默认使用点对点模式. */
	private boolean topic = false;

	/** 持久化模式，默认持久化. */
	private boolean deliveryMode = true;

	/** 队列名称. */
	public static final String DESTINATIONNAME = "destinationName";
	/** 点对点队列. */
	public static final String QUEUETEMPLATE = "queueTemplate";
	/** 发布订阅队列. */
	public static final String TOPICTEMPLATE = "topicTemplate";

	/** 点对点队列前缀 */
	public static final String QUEUE_POSTFIX = "Queue";

	/** 发布订阅队列前缀 */
	public static final String TOPIC_POSTFIX = "Topic";

	/**
	 * 构造函数。
	 */
	public JmsSender() {
		queueTemplate = ApplicationContextUtil.getBean(QUEUETEMPLATE);

	}

	/**
	 * 构造函数。
	 * 
	 * @param topic
	 *            是否发布订阅模式
	 */
	public JmsSender(boolean topic) {
		this.topic = topic;
		if (topic) {
			topicTemplate = ApplicationContextUtil.getBean(TOPICTEMPLATE);
		} else {
			queueTemplate = ApplicationContextUtil.getBean(QUEUETEMPLATE);
		}

	}

	/**
	 * 构造函数。
	 * 
	 * @param topic
	 *            是否发布订阅模式
	 * @param deliveryMode
	 *            持久化模式
	 */
	public JmsSender(boolean topic, boolean deliveryMode) {
		this(topic);
		this.deliveryMode = deliveryMode;

	}

	/**
	 * 发送对象消息.
	 * 
	 * @param destinationName
	 *            队列名称
	 * @param messageType
	 *            消息类型
	 * @param message
	 *            消息体对象
	 */
	public void sendObjectMsg(final String destinationName, final String messageType, final Serializable message) {
		MessageCreator messageCreator = new MessageCreator() {
			public Message createMessage(Session session) throws JMSException {
				ObjectMessage objectMessage = session.createObjectMessage(message);
				objectMessage.setJMSType(messageType);
				objectMessage.setStringProperty(DESTINATIONNAME, destinationName);
				return objectMessage;
			}
		};
		this.sendMsg(destinationName, messageType, messageCreator);

	}

	/**
	 * 发送文本消息.
	 * 
	 * @param destinationName
	 *            队列名称
	 * @param messageType
	 *            消息类型
	 * @param message
	 *            消息体对象
	 */
	public void sendTextMsg(final String destinationName, final String messageType, final String message) {

		MessageCreator messageCreator = new MessageCreator() {
			public Message createMessage(Session session) throws JMSException {
				TextMessage textMessage = session.createTextMessage(message);
				textMessage.setJMSType(messageType);
				textMessage.setStringProperty(DESTINATIONNAME, destinationName);
				return textMessage;
			}
		};
		this.sendMsg(destinationName, messageType, messageCreator);

	}

	/**
	 * 发送消息.
	 * 
	 * @param destinationName
	 *            队列名称
	 * @param messageType
	 *            消息类型
	 * @param messageCreator
	 *            消息体创建对象
	 */
	public void sendMsg(String destinationName, String messageType, MessageCreator messageCreator) {

		if (topic) {
			if (!deliveryMode) {
				topicTemplate.setExplicitQosEnabled(true);
				topicTemplate.setDeliveryPersistent(deliveryMode);
			}
			topicTemplate.send(destinationName, messageCreator);
		} else {
			if (!deliveryMode) {
				queueTemplate.setExplicitQosEnabled(true);
				queueTemplate.setDeliveryPersistent(deliveryMode);
			}
			queueTemplate.send(destinationName, messageCreator);
		}

	}

	public boolean isDeliveryMode() {
		return deliveryMode;
	}

	public void setDeliveryMode(boolean deliveryMode) {
		this.deliveryMode = deliveryMode;
	}

}
