package com.greenleaf.common.security3;

import org.springframework.security.web.context.HttpSessionSecurityContextRepository;

/**
 * security Session 来源.
 * 
 * @author QiSF 2015-03-11
 */
public class AdminSecurityContextRepository extends HttpSessionSecurityContextRepository {
	/**
	 * 后台SECURITY CONTEXT存储键.
	 */
	public static final String SPRING_SECURITY_CONTEXT_ADMIN_KEY = "SPRING_SECURITY_CONTEXT_ADMIN";

	public AdminSecurityContextRepository() {
		this.setSpringSecurityContextKey(SPRING_SECURITY_CONTEXT_ADMIN_KEY);
	}
}
