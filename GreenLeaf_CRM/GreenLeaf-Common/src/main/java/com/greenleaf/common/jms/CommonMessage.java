package com.greenleaf.common.jms;

import java.io.Serializable;
import java.util.Map;

/**
 * 通用消息实体.
 * 
 * <pre>
 * 修改日期         修改人     修改原因
 * 2013-03-24 崔诗杰    新建
 * </pre>
 */
public class CommonMessage implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	
	/**
	 * 通用消息存储器.
	 */
	private Map<String,Object> map;


	/**
	 * @return
	 */
	public Map<String, Object> getMap() {
		return map;
	}


	/**
	 * @param map
	 */
	public void setMap(Map<String, Object> map) {
		this.map = map;
	}
	
	 
}
