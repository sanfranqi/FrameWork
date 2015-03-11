package com.greenleaf.common.springmvc;

import java.math.BigDecimal;

import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.support.WebBindingInitializer;
import org.springframework.web.context.request.WebRequest;

public class BindingInitializer implements WebBindingInitializer {

	@Override
	public void initBinder(WebDataBinder binder, WebRequest request) {
		binder.registerCustomEditor(Long.class, new HtmlFilterLongEditor());
		binder.registerCustomEditor(long.class, new HtmlFilterLongEditor());
		binder.registerCustomEditor(Integer.class, new HtmlFilterIntegerEditor());
		binder.registerCustomEditor(int.class, new HtmlFilterIntegerEditor());
		binder.registerCustomEditor(Double.class, new HtmlFilterDoubleEditor());
		binder.registerCustomEditor(double.class, new HtmlFilterDoubleEditor());
		binder.registerCustomEditor(String.class, new HtmlFilterStringEditor());
		binder.registerCustomEditor(BigDecimal.class, new HtmlFilterBigDecimalEditor());
		// binder.registerCustomEditor(Timestamp.class, new
		// CustomTimestampEditor("yyyy-MM-dd HH:mm:ss",true));
	}

}
