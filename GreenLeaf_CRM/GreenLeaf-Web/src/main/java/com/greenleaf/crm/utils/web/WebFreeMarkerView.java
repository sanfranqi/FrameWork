package com.greenleaf.crm.utils.web;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.servlet.view.freemarker.FreeMarkerView;

public class WebFreeMarkerView extends FreeMarkerView {

	@Override
	protected void exposeHelpers(Map<String, Object> model, HttpServletRequest request) throws Exception {
		model.put("ctx", request.getContextPath());
	}

}
