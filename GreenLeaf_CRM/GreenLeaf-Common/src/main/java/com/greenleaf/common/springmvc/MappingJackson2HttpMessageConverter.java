/*
 * Copyright 2002-2012 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.greenleaf.common.springmvc;

import java.io.IOException;
import java.text.SimpleDateFormat;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpOutputMessage;
import org.springframework.http.converter.HttpMessageNotWritableException;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.greenleaf.common.utils.ObjectUtil;
import com.greenleaf.common.utils.ValueUtil;

/**
 * Implementation of
 * {@link org.springframework.http.converter.HttpMessageConverter
 * HttpMessageConverter} that can read and write JSON using <a
 * href="http://jackson.codehaus.org/">Jackson 2's</a>
 * {@link com.fasterxml.jackson.databind.ObjectMapper}.
 *
 * <p>
 * This converter can be used to bind to typed beans, or untyped
 * {@link java.util.HashMap HashMap} instances.
 *
 * <p>
 * By default, this converter supports {@code application/json}. This can be
 * overridden by setting the {@link #setSupportedMediaTypes(java.util.List)
 * supportedMediaTypes} property.
 *
 * @author Arjen Poutsma
 * @author Keith Donald
 * @since 3.2
 * @see org.springframework.web.servlet.view.json.MappingJackson2JsonView
 */
public class MappingJackson2HttpMessageConverter extends org.springframework.http.converter.json.MappingJackson2HttpMessageConverter {

	public static final String DEFAULT_CALLBACK = "callback";

	public MappingJackson2HttpMessageConverter() {
		ObjectMapper mapper = getObjectMapper();
		mapper.setDateFormat(new SimpleDateFormat("yyyy-MM-dd"));
		mapper.configure(JsonGenerator.Feature.ESCAPE_NON_ASCII, true);
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		mapper.configure(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT, true);
		mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
		setObjectMapper(mapper);
	}

	@Override
	protected void writeInternal(Object object, HttpOutputMessage outputMessage) throws IOException, HttpMessageNotWritableException {
		try {
			HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
			// 对于jsonp的请求做特殊处理
			String callback = request.getParameter(DEFAULT_CALLBACK);
			if (ObjectUtil.isEmpty(callback)) {
				callback = ValueUtil.getString(request.getAttribute(DEFAULT_CALLBACK));
			}
			boolean isJSONP = !ObjectUtil.isEmpty(callback);
			if (isJSONP) {
				outputMessage.getBody().write((callback + "(").getBytes());
			}
			super.writeInternal(object, outputMessage);
			if (isJSONP) {
				outputMessage.getBody().write(')');
			}
		} catch (JsonProcessingException ex) {
			throw new HttpMessageNotWritableException("Could not write JSON: " + ex.getMessage(), ex);
		}
	}

}
