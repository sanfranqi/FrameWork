package com.greenleaf.common.springmvc;

import java.util.regex.Pattern;

import org.springframework.core.convert.converter.Converter;

/**
 * 
 * @author QiSF 2015-03-11
 */
public class StringConverter implements Converter<String, String> {
	// 过滤<scrpit>内容正则
	private static final String REG_SCRIPT = "<[\\s]*?script[^>]*?>[\\s\\S]*?<[\\s]*?/[\\s]*?script[\\s]*?>";

	@Override
	public String convert(String text) {
		if (text != null) {
			text = text.trim();
			// 过滤<scrpit> </script>内容
			Pattern pattern = Pattern.compile(REG_SCRIPT, Pattern.CASE_INSENSITIVE);
			text = pattern.matcher(text).replaceAll("");
			return text;

		} else {
			return "";
		}
	}
}
