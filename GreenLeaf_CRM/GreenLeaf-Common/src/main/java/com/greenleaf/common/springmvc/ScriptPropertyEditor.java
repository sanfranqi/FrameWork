package com.greenleaf.common.springmvc;

import java.beans.PropertyEditorSupport;

/**
 * 跳过过滤scipt标签.
 * 
 * @author QiSF 2015-03-11
 */
public class ScriptPropertyEditor extends PropertyEditorSupport {
	public void setAsText(String text) throws IllegalArgumentException {
		if (text != null) {
			setValue(text);
		} else {
			setValue("");
		}
	}

	public String getAsText() {
		Object value = getValue();
		return value == null ? "" : value.toString().trim();
	}
}
