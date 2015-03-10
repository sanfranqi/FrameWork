package com.greenleaf.common.email;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeUtility;
import java.io.IOException;

/**
 * 提供邮件的配置
 * 
 * @author jianleizhuo
 * 
 */
public class MailEngine {

	private static final Logger logger = LoggerFactory
			.getLogger(MailEngine.class);

	@Autowired
	private MailSender mailSender;

	/**
	 * 发送带附件的邮件
	 * 
	 * @param emailAddresses
	 *            收件人地址
	 * @param bodyText
	 *            正文
	 * @param subject
	 *            主题
	 * @param mailDTOs
	 *            附件dto
	 * @throws MessagingException
	 */
	public void sendEmailWithAttach(String[] emailAddresses, String bodyText,
			String subject, MailDTO... mailDTOs) throws MessagingException,
			IOException {

		MimeMessage message = ((JavaMailSenderImpl) mailSender)
				.createMimeMessage();

		MimeMessageHelper helper = new MimeMessageHelper(message, true, "utf-8");
		helper.setTo(emailAddresses);
        helper.setFrom(((JavaMailSenderImpl) mailSender).getUsername());
        helper.setText(bodyText);
		helper.setSubject(subject);

		for (MailDTO dto : mailDTOs) {
			helper.addAttachment(MimeUtility.encodeWord(dto.getFileName()),
					new ByteArrayResource(dto.getAttachBytes()));
		}

		((JavaMailSenderImpl) mailSender).send(message);
	}

	/**
	 * 发送简单邮件
	 * 
	 * @param mailMessage
	 */
	public void sendSimpleEmail(SimpleMailMessage mailMessage) {
		try {
			mailSender.send(mailMessage);
		} catch (Exception e) {
			logger.error(e.getMessage());
		}
	}

	/**
	 * 发送带内容的邮件 note: 内容可以为html的形式
	 * 
	 * @param mailMessage
	 * @param content
	 * @throws MessagingException
	 */
	public void sendEmailWithContent(SimpleMailMessage mailMessage,
			String content) throws MessagingException {
		MimeMessage message = ((JavaMailSenderImpl) mailSender)
				.createMimeMessage();

		MimeMessageHelper helper = new MimeMessageHelper(message, true, "utf-8");

		helper.setTo(mailMessage.getTo());

		if (mailMessage.getSubject() != null) {
			helper.setSubject(mailMessage.getSubject());
		}

		if (mailMessage.getFrom() != null) {
			helper.setFrom(mailMessage.getFrom());
		}

		helper.setText(content, true);

		((JavaMailSenderImpl) mailSender).send(message);
	}

	/**
	 * 发送带附件的邮件.
	 * 
	 * @param emailAddress
	 *            email地址
	 * @param bodyText
	 *            内容
	 * @param subject
	 *            主题
	 * @param mailAttachDTOs
	 *            邮件附件dtos
	 * @author zhufu
	 * @version 2013-9-29 下午4:45:12
	 * @throws IOException
	 * @throws MessagingException
	 */
	public void sendEmailWithAttach(String emailAddress, String bodyText,
			String subject, MailDTO... mailAttachDTOs)
			throws MessagingException, IOException {
		sendEmailWithAttach(new String[] { emailAddress }, bodyText, subject,
				mailAttachDTOs);

	}
}
