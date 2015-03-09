package com.greenleaf.common.mybatis.annotation;

import org.springframework.stereotype.Component;

import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)
@Documented
@Component
public @interface Table {
    String value() default "";
}
