package com.greenleaf.crm.utils.inteceptor;


import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.greenleaf.crm.utils.bean.Token;
import com.greenleaf.crm.utils.context.WebContext;

/**
 * User: littlehui
 * Date: 14-10-28
 * Time: 下午4:20
 */
public class InitWebContentInteceptor implements Filter {

//    MatrixUserService matrixUserService;

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
//        matrixUserService = ApplicationContextUtil.getBean(MatrixUserService.class);
    }

    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;
        WebContext.setRequest(httpRequest);
        WebContext.setResponse((HttpServletResponse) response);
        WebContext.getResponse().setContentType("text/html;charset=UTF-8");
        String url = httpRequest.getServletPath();
        try {
            if (url.startsWith("/admin") && !url.startsWith("/admin/login")) {
                String returnUrl = "/admin/login.do";
//                Token token = WebContext.getLoginToken();
//                if (token == null) {
//                    res.sendRedirect(returnUrl);
//                    return;
//                }
            }
            chain.doFilter(request, response);
        } catch (RuntimeException e) {
            e.printStackTrace();
        } finally {
            WebContext.remove();
        }
    }


    @Override
    public void destroy() {
    }
}
