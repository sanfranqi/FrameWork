package com.greenleaf.common.email;

/**
 * 邮件中针对附件所设立的dto对象
 * 
 * @author jianleizhuo
 * 
 */
public class MailDTO {

	/** 文件名 **/
	private String fileName;
	// /** 文件输入流 **/
	// private InputStream inputStream;

	private byte[] attachBytes;

	// public InputStream getInputStream() {
	// return inputStream;
	// }
	//
	// public void setInputStream(InputStream inputStream) {
	// this.inputStream = inputStream;
	// }

	public String getFileName() {
		return fileName;
	}

	/**
	 * @param fileName
	 * @param attachBytes
	 */
	public MailDTO(String fileName, byte[] attachBytes) {
		this.fileName = fileName;
		this.attachBytes = attachBytes;
	}

	/**
	 * 
	 */
	public MailDTO() {
		super();
		// TODO Auto-generated constructor stub
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	/**
	 * @return the attachBytes
	 */
	public byte[] getAttachBytes() {
		return attachBytes;
	}

	/**
	 * @param attachBytes
	 *            the attachBytes to set
	 */
	public void setAttachBytes(byte[] attachBytes) {
		this.attachBytes = attachBytes;
	}

}
