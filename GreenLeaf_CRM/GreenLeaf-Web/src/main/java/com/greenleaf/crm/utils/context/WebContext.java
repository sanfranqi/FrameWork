package com.greenleaf.crm.utils.context;


import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.ibatis.ognl.Token;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * User: littlehui Date: 14-10-30 Time: 下午3:42
 */
public class WebContext {
	private static Logger logger = LoggerFactory.getLogger(WebContext.class);
	private static ThreadLocal<HttpServletRequest> request = new ThreadLocal<HttpServletRequest>();
	private static ThreadLocal<HttpServletResponse> response = new ThreadLocal<HttpServletResponse>();
	/**
	 * 注入使用的容器
	 */
//	private static MatrixUserService matrixUserService = ApplicationContextUtil.getBean(MatrixUserService.class);

    private static Map<String, Object> cacheKey = new HashMap<String, Object>();


    /**
	 * 放入web请求
	 *
	 * @param r
	 * @author yangz
	 * @date 2012-10-8 下午04:22:36
	 */
	public static void setRequest(HttpServletRequest r) {
		request.set(r);
	}

	/**
	 * 获取当前request
	 *
	 * @return
	 * @author yangz
	 * @date 2012-10-18 上午10:50:32
	 */
	public static HttpServletRequest getRequest() {
		return request.get();
	}

	/**
	 * 得到当前线程response
	 *
	 * @return
	 * @author yangz
	 * @date 2012-10-13 下午06:00:37
	 */
	public static HttpServletResponse getResponse() {
		if (null == response.get()) {
			return null;
		}
		return response.get();
	}

	/**
	 * 放入当前线程response
	 *
	 * @param r
	 * @author yangz
	 * @date 2012-10-13 下午06:00:40
	 */
	public static void setResponse(HttpServletResponse r) {
		response.set(r);
	}

	/**
	 * 删除web请求
	 *
	 * @author yangz
	 * @date 2012-10-8 下午04:22:49
	 */
	public static void remove() {
		request.remove();
		response.remove();
	}

//	public static Token getLoginToken() {
//		if (WebContext.getRequest() == null) {
//            return null;
//        }
//		//HttpSession session = (HttpSession) cacheKey.get(WebContext.getRequest().getSession().getId());
//        HttpSession session = WebContext.getRequest().getSession(true);
//		if (session == null)
//			return null;
//		Token token = (Token) session.getAttribute("token");
//		return token;
//	}

//	public static Long getLoginUserId() {
//        if(getLoginToken()==null) return null;
//		return getLoginToken().getUser().getUserId();
//	}
//
//	public static String getLoginTokenString() {
//        if(getLoginToken()==null) return null;
//		return getLoginToken().getWebToken();
//	}


	public static Boolean setLoginToken(Token token) {
		if (WebContext.getRequest() == null) {
			return false;
		}
		HttpSession session = WebContext.getRequest().getSession(true);
		session.setAttribute("token", token);
        //cacheKey.put(session.getId(), session);
		return true;
	}

//    public static boolean isLoginUserAdmin() {
//        String userId = getLoginUserId().toString();
//        if (StringUtil.isEmpty(userId)) {
//            return false;
//        }
//        return ServiceTagConstants.ADMINUSERIDS.contains(userId);
//    }
}
