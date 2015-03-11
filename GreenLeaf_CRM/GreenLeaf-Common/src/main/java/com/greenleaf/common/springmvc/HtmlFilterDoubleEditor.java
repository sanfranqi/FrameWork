package com.greenleaf.common.springmvc;

import java.beans.PropertyEditorSupport;

import org.springframework.web.util.HtmlUtils;

import com.greenleaf.common.utils.ObjectUtil;

/**
 * html 字符过滤, 防止脚本注入.
 * 
 * @author QiSF 2015-03-11
 */
public class HtmlFilterDoubleEditor extends PropertyEditorSupport {
	public void setAsText(String text) throws IllegalArgumentException {
		if (!ObjectUtil.isEmpty(text)) {
			setValue(Double.valueOf(HtmlUtils.htmlEscape(text)));
		} else {
			setValue(null);
		}
	}

	public String getAsText() {
		Object value = getValue();
		return ObjectUtil.isEmpty(value) ? "" : value.toString().trim();
	}
}