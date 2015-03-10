package com.greenleaf.common.bean;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import com.greenleaf.common.response.Response;

/**
 * 结果VO.
 *
 * @author QISF
 * @date 2015-03-10
 */
public class ResultVO implements Serializable {

	private static final long serialVersionUID = 5818701239255621354L;

	/**
	 * 是否成功.
	 */
	private boolean isSuccess = true;

	/**
	 * 提示信息.
	 */
	private List<String> msg = new ArrayList<String>();

	/**
	 * 错误代码.
	 */
	private List<String> errorCode = new ArrayList<String>();

	public ResultVO() {

	}

	public ResultVO(boolean isSuccess) {
		this.isSuccess = isSuccess;
	}

	/**
	 * @return the isSuccess
	 */
	public boolean isSuccess() {
		return isSuccess;
	}

	/**
	 * @param isSuccess
	 *            the isSuccess to set
	 */
	public void setSuccess(boolean isSuccess) {
		this.isSuccess = isSuccess;
	}

	/**
	 * @return the msg
	 */
	public List<String> getMsg() {
		return msg;
	}

	/**
	 * @param msg
	 *            the msg to set
	 */
	public void setMsg(List<String> msg) {
		this.msg = msg;
	}

	/**
	 * @return the errorCode
	 */
	public List<String> getErrorCode() {
		return errorCode;
	}

	/**
	 * @param errorCode
	 *            the errorCode to set
	 */
	public void setErrorCode(List<String> errorCode) {
		this.errorCode = errorCode;
	}

	/**
	 * 获得提示信息的字符串.
	 */
	public String getStringMsg() {
		String str = "";
		for (String temp : this.msg) {
			str += temp + "\n";
		}
		return str;
	}

	/**
	 * 获得提示信息的字符串，多个用逗号','相隔.
	 */
	public String getStringMsgDivide() {
		String str = "";
		for (int i = 0; i < this.msg.size(); i++) {
			if (i != 0) {
				str += ",";
			}
			str += this.msg.get(i);
		}
		return str;
	}

	/**
	 * 添加提示信息.
	 */
	public void addMsg(String s) {
		this.msg.add(s);
	}

	/**
	 * 添加错误代码.
	 */
	public void addErrorCode(String e) {
		this.errorCode.add(e);
	}

	/**
	 * 获得错误代码，多个用逗号','相隔.
	 */
	public String getErrorCodeStr() {
		String s = "";
		for (String _s : this.errorCode) {
			if (!s.equals("")) {
				s += ",";
			}
			s += _s;
		}
		return s;
	}

	/**
	 * 转response.
	 */
	public <T> void toResponse(Response<T> response) {
		if (this.isSuccess == true) {
			response.setResult(Response.RESULT_SUCCESS);
			for (String s : this.msg) {
				response.getMessages().add(s);
			}
		} else {
			response.setResult(Response.RESULT_FAILURE);
			for (String s : this.msg) {
				response.getMessages().add(s);
			}
		}
	}

}
