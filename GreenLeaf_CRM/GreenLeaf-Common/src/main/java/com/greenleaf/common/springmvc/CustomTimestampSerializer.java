package com.greenleaf.common.springmvc;

import java.io.IOException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;

import org.codehaus.jackson.JsonGenerator;
import org.codehaus.jackson.JsonProcessingException;
import org.codehaus.jackson.map.JsonSerializer;
import org.codehaus.jackson.map.SerializerProvider;

/**
 * Timestamp类型参数JSON输出(通过注解方式).
 * 
 * @author QiSF 2015-03-11
 */
public class CustomTimestampSerializer extends JsonSerializer<Timestamp> {

	public static String FORMATTER = "yyyy-MM-dd HH:mm:ss";

	@Override
	public void serialize(Timestamp value, JsonGenerator jgen, SerializerProvider provider) throws IOException, JsonProcessingException {
		SimpleDateFormat formatter = new SimpleDateFormat(FORMATTER);
		String formattedDate = formatter.format(value);
		jgen.writeString(formattedDate);
	}
}
