package com.greenleaf.common.utils;

import com.greenleaf.common.exception.UnCaughtException;

/**
 * 虚拟机环境工具类.
 * 
 * @author yangz
 * @date 2013-2-11 上午9:50:23
 */
public class JvmUtil {
	/**
	 * 虚拟机环境类路径.<br>
	 * 结尾带/
	 * 
	 * @author yangz
	 * @date 2012-7-28 下午04:46:18
	 */
	public static String getClassPath() {
		String path = Thread.currentThread().getContextClassLoader().getResource("").getPath();
		if (isWindows() && !ObjectUtil.isEmpty(path)) {
			if (path.startsWith("/")) {
				path = path.substring(1);
			}
		}
		return path;
	}

	/**
	 * 当前操作系统是否是Linux或者是Unix.
	 * 
	 * @return
	 * @author yangz
	 * @date 2013-2-18 下午3:26:09
	 */
	public static boolean isLinux() {
		return System.getProperty("os.name").equals("Linux");
	}

	/**
	 * 当前操作系统是否是Windows
	 * 
	 * @return
	 * @author yangz
	 * @date 2013-2-18 下午3:26:09
	 */
	public static boolean isWindows() {
		return System.getProperty("os.name").toLowerCase().contains("windows");
	}

	/**
	 * 当前运行的方法名.
	 * 
	 * @return
	 * @author yangz
	 * @date 2012-8-7 下午01:25:21
	 */
	public static String getCurrentMethodName() {
		StackTraceElement[] stack = Thread.currentThread().getStackTrace();
		return stack[1].getMethodName();
	}

	/**
	 * 类第一个方法被调用的方法名<br>
	 * 适用于在Web的action, controller层使用,用来拼凑返回的result标识,不支持方法重载.
	 * 
	 * @return
	 * @author yangz
	 * @date 2012-8-7 下午01:52:37
	 */
	public static String getClassFirstRunMethodName(Class<?> c) {
		StackTraceElement[] stack = Thread.currentThread().getStackTrace();
		for (int i = 0; i < stack.length; i++) {
			if (stack[i].getClassName().equals(c.getName())) {
				return stack[i].getMethodName();
			}
		}
		throw new UnCaughtException("unknow class method run:" + c.getName());
	}

	/**
	 * 类最后一个方法被调用的方法名<br>
	 * 适用于在Web的action, controller层使用,用来拼凑返回的result标识,不支持方法重载.
	 * 
	 * @return
	 * @author yangz
	 * @date 2012-8-7 下午01:52:37
	 */
	public static String getClassLastRunMethodName(Class<?> c) {
		String result = null;
		StackTraceElement[] stack = Thread.currentThread().getStackTrace();
		for (int i = stack.length - 1; i > 0; i--) {
			if (stack[i].getClassName().equals(c.getName())) {
				result = stack[i].getMethodName();
			}
		}
		if (result == null) {
			throw new UnCaughtException("unknow class run:" + c.getName());
		} else {
			return result;
		}
	}
}
