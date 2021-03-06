package com.greenleaf.common.http;

import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.http.Consts;
import org.apache.http.HttpEntity;
import org.apache.http.HttpStatus;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * HTTP工具.
 * 
 * @author QiSF 2015-03-11
 */
public class HttpClientUtil {

	private static Logger logger = LoggerFactory.getLogger(HttpClientUtil.class);
	private static final String CHARSET = "UTF-8";
	private static final int CONNECT_TIMEOUT = 5000;
	private static HttpClientUtil instance = new HttpClientUtil();

	public static HttpClientUtil getInstance() {
		return instance;
	}

	/**
	 * 设置超时间
	 */
	public static RequestConfig getRequestConfig() {
		RequestConfig requestConfig = RequestConfig.custom().setConnectTimeout(CONNECT_TIMEOUT).setSocketTimeout(CONNECT_TIMEOUT).setConnectionRequestTimeout(CONNECT_TIMEOUT).build();
		return requestConfig;
	}

	/**
	 * 发送 get请求
	 */
	public static String get(String url, List<BasicNameValuePair> parameters) {
		url = createUrl(url, parameters);
		return get(url);
	}

	/**
	 * 拼接url
	 * 
	 * @param url
	 * @param parameters
	 * @return
	 */
	private static String createUrl(String url, List<BasicNameValuePair> parameters) {
		StringBuffer urlSb = new StringBuffer(url);
		try {
			if (parameters != null && parameters.size() > 0) {
				urlSb.append("?");
				for (BasicNameValuePair parameter : parameters) {
					urlSb.append(parameter.getName()).append("=").append(parameter.getValue()).append("&");
				}
				urlSb.deleteCharAt(urlSb.length() - 1);
			}
		} catch (Exception e) {
			logger.error("参数拼接失败", e);
			System.out.println("参数拼接失败");
			throw new HttpRuntimeException("网络访问异常", e);
		}
		return urlSb.toString();
	}

	/**
	 * 发送 get请求
	 */
	public static String get(String url) {
		HttpClientBuilder clientBuilder = HttpClientBuilder.create();
		CloseableHttpClient client = clientBuilder.build();
		String content = "";
		Integer statusCode = null;
		try {
			url = getEncodeUrl(url);
			System.out.println("encodeUrl:" + url);
			HttpGet httpget = new HttpGet(url);
			httpget.setConfig(getRequestConfig());
			CloseableHttpResponse response = client.execute(httpget);
			HttpEntity entity = response.getEntity();
			statusCode = response.getStatusLine().getStatusCode();
			if (statusCode == HttpStatus.SC_OK) {
				if (entity != null) {
					content = EntityUtils.toString(entity, CHARSET);
				}
			} else {
				logger.error("返回码错误,网络访问异常*statusCode:" + statusCode);
				System.out.println("返回码错误,网络访问异常*statusCode:" + statusCode);
				throw new HttpRuntimeException("网络访问异常");
			}
		} catch (Exception e) {
			logger.error("网络访问异常*url:" + url, e);
			throw new HttpRuntimeException("网络访问异常*url:" + url, e);
		} finally {
			// 关闭连接,释放资源
			try {
				client.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return content;
	}

	/**
	 * 对url进行编码
	 * 
	 * @param url
	 * @return
	 * @throws java.io.UnsupportedEncodingException
	 */
	private static String getEncodeUrl(String url) throws UnsupportedEncodingException {
		if (StringUtils.isEmpty(url)) {
			return "";
		}

		// 无参
		if (url.indexOf("?") == -1) {
			return url;
		}

		// 有参
		String preUrl = url.substring(0, url.indexOf("?"));
		String sufUrl = url.substring(url.indexOf("?") + 1);

		String parameters[] = sufUrl.split("&");
		List<BasicNameValuePair> parameterList = new ArrayList<BasicNameValuePair>();
		for (String parameter : parameters) {
			String key = parameter.substring(0, parameter.indexOf("="));
			String value = parameter.substring(parameter.indexOf("=") + 1);
			parameterList.add(new BasicNameValuePair(key, value));
		}
		return getEncodeUrl(preUrl, parameterList);
	}

	/**
	 * 对url进行编码
	 * 
	 * @param url
	 * @param parameters
	 * @return
	 * @throws java.io.UnsupportedEncodingException
	 */
	private static String getEncodeUrl(String url, List<BasicNameValuePair> parameters) throws UnsupportedEncodingException {
		StringBuffer urlSb = new StringBuffer(url);
		if (parameters != null && parameters.size() > 0) {
			urlSb.append("?");
			for (BasicNameValuePair parameter : parameters) {
				urlSb.append(parameter.getName()).append("=").append(URLEncoder.encode(parameter.getValue(), CHARSET)).append("&");
			}
			urlSb.deleteCharAt(urlSb.length() - 1);
		}
		return urlSb.toString();
	}

	/**
	 * post请求
	 * 
	 * @param url
	 * @param params
	 *            参数列表
	 * @return
	 */
	public static String post(String url, List<BasicNameValuePair> params) {
		HttpClientBuilder clientBuilder = HttpClientBuilder.create();
		CloseableHttpClient client = clientBuilder.build();

		HttpPost httppost = new HttpPost(url);
		httppost.setConfig(getRequestConfig());
		String content = "";
		Integer statusCode = null;
		UrlEncodedFormEntity uefEntity;
		try {
			uefEntity = new UrlEncodedFormEntity(params, CHARSET);
			httppost.setEntity(uefEntity);
			CloseableHttpResponse response = client.execute(httppost);
			HttpEntity entity = response.getEntity();
			statusCode = response.getStatusLine().getStatusCode();
			if (statusCode == HttpStatus.SC_OK) {
				if (entity != null) {
					content = EntityUtils.toString(entity, CHARSET);
				}
			} else {
				logger.error("返回码错误,网络访问异常*statusCode:" + statusCode);
				System.out.println("返回码错误,网络访问异常*statusCode:" + statusCode);
				throw new HttpRuntimeException("网络访问异常");
			}
		} catch (HttpRuntimeException e) {
			throw e;
		} catch (Exception e) {
			logger.error("网络访问异常*url:" + url, e);
			throw new HttpRuntimeException("网络访问异常*url:" + url, e);
		} finally {
			// 关闭连接,释放资源
			try {
				client.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return content;
	}

	/**
	 * 单个文件上传的post请求
	 * 
	 * @param url
	 * @param fileParamName
	 *            文件表单名称
	 * @param file
	 *            文件
	 * @return
	 */
	public static String post(String url, String fileParamName, File file) {
		Map<String, File> fileMap = new HashMap<String, File>();
		if (!StringUtils.isEmpty(fileParamName) && file != null) {
			fileMap.put(fileParamName, file);
		}
		return post(url, fileMap, null);
	}

	/**
	 * 带参数的文件上传的post请求
	 * 
	 * @param url
	 * @param fileParamName
	 *            文件表单名称
	 * @param file
	 *            文件
	 * @param params
	 *            参数列表
	 * @return
	 */
	public static String post(String url, String fileParamName, File file, List<BasicNameValuePair> params) {
		Map<String, File> fileMap = new HashMap<String, File>();
		if (!StringUtils.isEmpty(fileParamName) && file != null) {
			fileMap.put(fileParamName, file);
		}
		return post(url, fileMap, params);
	}

	/**
	 * 带参数的文件上传的post请求
	 * 
	 * @param url
	 * @param fileMap
	 *            文件map
	 * @param params
	 *            参数列表
	 * @return
	 */
	public static String post(String url, Map<String, File> fileMap, List<BasicNameValuePair> params) {
		HttpClientBuilder clientBuilder = HttpClientBuilder.create();
		CloseableHttpClient client = clientBuilder.build();
		String content = "";
		Integer statusCode = null;
		try {
			HttpPost httppost = new HttpPost(url);
			httppost.setConfig(getRequestConfig());
			HttpEntity httpEntity = getFileEntity(fileMap, params);
			httppost.setEntity(httpEntity);
			CloseableHttpResponse response = client.execute(httppost);
			HttpEntity entity = response.getEntity();
			statusCode = response.getStatusLine().getStatusCode();
			if (statusCode == HttpStatus.SC_OK) {
				if (entity != null) {
					content = EntityUtils.toString(entity, CHARSET);
				}
			} else {
				logger.error("返回码错误,网络访问异常*statusCode:" + statusCode);
				System.out.println("返回码错误,网络访问异常*statusCode:" + statusCode);
				throw new HttpRuntimeException("网络访问异常");
			}
		} catch (HttpRuntimeException e) {
			throw e;
		} catch (Exception e) {
			logger.error("网络访问异常*url:" + url, e);
			throw new HttpRuntimeException("网络访问异常*url:" + url, e);
		} finally {
			// 关闭连接,释放资源
			try {
				client.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return content;
	}

	/**
	 * 获取文件的参数体
	 * 
	 * @param fileMap
	 * @param params
	 * @return
	 */
	private static HttpEntity getFileEntity(Map<String, File> fileMap, List<BasicNameValuePair> params) throws UnsupportedEncodingException {
		MultipartEntityBuilder multipartEntityBuilder = MultipartEntityBuilder.create().setCharset(Consts.UTF_8); //

		// 添加文件参数
		if (fileMap != null) {
			for (String fileKey : fileMap.keySet()) {
				FileBody fileBody = new FileBody(fileMap.get(fileKey));
				multipartEntityBuilder.setMode(HttpMultipartMode.BROWSER_COMPATIBLE);
				multipartEntityBuilder.addPart(fileKey, fileBody);
			}
		}
		ContentType strContentType = ContentType.create("text/plain", Consts.UTF_8);
		// 添加其他参数
		if (params != null) {
			for (BasicNameValuePair nameValuePair : params) {
				StringBody stringBody = new StringBody(nameValuePair.getValue(), strContentType);
				multipartEntityBuilder.addPart(nameValuePair.getName(), stringBody);
			}
		}
		return multipartEntityBuilder.build();
	}
}
