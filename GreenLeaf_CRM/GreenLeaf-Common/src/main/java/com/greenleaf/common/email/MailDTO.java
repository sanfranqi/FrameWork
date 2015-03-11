package com.greenleaf.common.email;

/**
 * 邮件中针对附件所设立的DTO对象.
 * 
 * @author QiSF 2015-03-11
 */
public class MailDTO {

	/** 文件名 **/
	private String fileName;

	private byte[] attachBytes;

	public String getFileName() {
		return fileName;
	}

	public MailDTO(String fileName, byte[] attachBytes) {
		this.fileName = fileName;
		this.attachBytes = attachBytes;
	}

	public MailDTO() {
		super();
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public byte[] getAttachBytes() {
		return attachBytes;
	}

	public void setAttachBytes(byte[] attachBytes) {
		this.attachBytes = attachBytes;
	}
}
