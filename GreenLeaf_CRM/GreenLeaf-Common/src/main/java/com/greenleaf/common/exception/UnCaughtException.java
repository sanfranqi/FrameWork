package com.greenleaf.common.exception;

import java.io.Serializable;

/**
 * 不被捕获的异常,将抛至最顶层.
 * 
 * @author QiSF 2015-03-11
 */
public class UnCaughtException extends RuntimeException implements Serializable {

	private static final long serialVersionUID = 1L;

	public UnCaughtException() {
		super();
	}

	public UnCaughtException(String message, Throwable cause) {
		super(message, cause);
	}

	public UnCaughtException(String message) {
		super(message);
	}

	public UnCaughtException(Throwable cause) {
		super(cause);
	}

}
