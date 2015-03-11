package com.greenleaf.common.springmvc;

import java.beans.PropertyEditorSupport;
import java.util.regex.Pattern;

import com.greenleaf.common.utils.ObjectUtil;
import com.greenleaf.common.utils.StringUtil;
import com.greenleaf.common.utils.ValueUtil;

/**
 * BigDecimal 属性转换器.
 * 
 * @author QiSF 2015-03-11
 */
public class HtmlFilterBigDecimalEditor extends PropertyEditorSupport {

	public void setAsText(String text) throws IllegalArgumentException {
		if (!ObjectUtil.isEmpty(text)) {
			String value = Pattern.compile("<script.*?>.*?</script>", Pattern.CASE_INSENSITIVE).matcher(ValueUtil.getString(text)).replaceAll("");
			setValue(ValueUtil.getBigDecimal(value));
		} else {
			setValue(null);
		}
	}

	public String getAsText() {
		Object value = getValue();
		if (ObjectUtil.isEmpty(value)) {
			value = 0;
		}
		return StringUtil.toNuSicen(value);
	}
}