package com.greenleaf.common.bean;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import com.greenleaf.common.response.Response;

/**
 * 结果VO.
 * 
 * @author QiSF 2015-03-11
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

	public boolean isSuccess() {
		return isSuccess;
	}

	public void setSuccess(boolean isSuccess) {
		this.isSuccess = isSuccess;
	}

	public List<String> getMsg() {
		return msg;
	}

	public void setMsg(List<String> msg) {
		this.msg = msg;
	}

	public List<String> getErrorCode() {
		return errorCode;
	}

	public void setErrorCode(List<String> errorCode) {
		this.errorCode = errorCode;
	}

	public void addMsg(String s) {
		this.msg.add(s);
	}

	public void addErrorCode(String e) {
		this.errorCode.add(e);
	}

	/**
	 * 获得提示信息的字符串.
	 * 
	 * @author QiSF 2015-03-11
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
	 * 
	 * @author QiSF 2015-03-11
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
	 * 获得错误代码，多个用逗号','相隔.
	 * 
	 * @author QiSF 2015-03-11
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
	 * 转Response.
	 * 
	 * @author QiSF 2015-03-11
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
