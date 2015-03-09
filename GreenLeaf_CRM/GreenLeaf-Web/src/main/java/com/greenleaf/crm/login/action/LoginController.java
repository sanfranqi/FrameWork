package com.greenleaf.crm.login.action;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.greenleaf.common.utils.Response;
import com.greenleaf.crm.config.SystemConfig;

@Controller
public class LoginController {

    @Autowired
    private SystemConfig systemConfig;
//    private MatrixUserService matrixUserService;


    @ResponseBody
    @RequestMapping(value = "/index")
    public HttpServletResponse index(HttpServletRequest request, HttpServletResponse httpResponse) {
        try {
            httpResponse.sendRedirect("index.jsp");
        } catch (IOException e) {
            e.printStackTrace();
        }
        return httpResponse;
    }


    @ResponseBody
    @RequestMapping(value = "/admin/login.do", produces = MediaType.APPLICATION_JSON_VALUE)
    public Response<String> loginCtrl(HttpServletRequest request, HttpServletResponse httpResponse) throws IOException {
        String userName = request.getParameter("userName");
        String passWord = request.getParameter("passWord");
        Response response = Response.getFailedResponse();
//        Token token = WebContext.getLoginToken();
//        if (token != null) {
//            httpResponse.sendRedirect(ServiceTagConstants.DOMAIN_URL + "admin/serviceTag.html");
//            return response;
//        }
        if (StringUtils.isBlank(userName) || StringUtils.isBlank(passWord)) {
            response.setData("用户名或者密码不能为空");
            return response;
        }
        String allowUser = systemConfig.getAdmins();
        if (StringUtils.isBlank(allowUser)) {
            response.setData("用户名或者密码错误");
            return response;
        }
        try {
//            token = matrixUserService.login(userName, passWord, IPUtil.ip2long(WebUtil.getRemoteIP(request)) + "", ServiceTagConstants.DEFAULT_LOGIN_TYPE);
        } catch (Exception e) {
            response.setData("用户名或者密码错误");
        }
//        if (token == null) {
//            response.setData("用户名或者密码错误");
//        } else {
//            response.setResult(Response.RESULT_SUCCESS);
//            WebContext.setLoginToken(token);
//            response.setData("登陆成功。");
//        }
        return response;
    }
}
