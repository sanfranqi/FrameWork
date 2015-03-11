package com.greenleaf.common.http;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Map;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.Document;
import org.xml.sax.SAXException;

/**
 * Http客户端.
 * 
 * @author shanfengqi 2013-7-26
 */
public class HttpClient {

	/**
	 * 读取cookie用于保持session.
	 */
	private static String cookie;

	/**
	 * 获取JSON字符串.
	 * 
	 * @param httpServerURL
	 *            Http服务器域名/IP + PORT+uri.
	 * @param isPost
	 *            是否POST访问[true：POST,false:GET].
	 * @param paramMap
	 *            请求参数.
	 * @return JSON字符串.
	 * @throws IOException
	 */
	public static String getJsonString(String httpServerURL, boolean isPost, Map<String, Object> paramMap) throws IOException {
		HttpURLConnection urlConnection = getHttpURLConnection(httpServerURL, isPost, paramMap);
		InputStream in = null;
		try {
			StringBuilder builder = new StringBuilder();
			in = new BufferedInputStream(urlConnection.getInputStream());
			byte[] bytes = new byte[8192];
			for (int n; (n = in.read(bytes)) != -1;) {
				builder.append(new String(bytes, 0, n));
			}
			cookie = urlConnection.getHeaderField("set-cookie");
			return builder.toString();
		} finally {
			if (in != null) {
				try {
					in.close();
				} catch (IOException ex) {
				}
				in = null;
			}
		}
	}

	/**
	 * 获取XML Document.
	 * 
	 * @param httpServerURL
	 *            Http服务器域名/IP + PORT+uri.
	 * @param isPost
	 *            是否POST访问(true-POST,false-Get).
	 * @param paramMap
	 *            请求参数.
	 * @return XML Document.
	 * @throws IOException
	 * @throws ParserConfigurationException
	 * @throws SAXException
	 */
	public static Document getXml(String httpServerURL, boolean isPost, Map<String, Object> paramMap) throws IOException, ParserConfigurationException, SAXException {
		HttpURLConnection urlConnection = getHttpURLConnection(httpServerURL, isPost, paramMap);
		InputStream in = null;
		try {
			in = new BufferedInputStream(urlConnection.getInputStream());
			DocumentBuilder builder = DocumentBuilderFactory.newInstance().newDocumentBuilder();
			Document doc = builder.parse(in);
			cookie = urlConnection.getHeaderField("set-cookie");
			return doc;
		} finally {
			if (in != null) {
				try {
					in.close();
				} catch (IOException ex) {
				}
				in = null;
			}
		}
	}

	/**
	 * 获取Http连接.
	 * 
	 * @param httpServerURL
	 *            Http服务器域名/IP + PORT+uri.
	 * @param isPost
	 *            是否POST访问(true-POST,false-Get).
	 * @param paramMap
	 *            请求参数.
	 * @return Http连接.
	 * @throws IOException
	 */
	private static HttpURLConnection getHttpURLConnection(String httpServerURL, boolean isPost, Map<String, Object> paramMap) throws IOException {
		String paramString = getParaString(paramMap);
		URL url = isPost ? new URL(httpServerURL) : new URL(httpServerURL + "?" + paramString);
		HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
		// 处理数据发送
		urlConnection.setDoOutput(true);
		// 禁止使用缓存
		urlConnection.setUseCaches(false);
		// 若cookie存在，则增加请求属性"cookie"
		if (cookie != null) {
			urlConnection.setRequestProperty("cookie", cookie);
		}
		// 发送POST请求参数
		if (isPost) {
			DataOutputStream out = null;
			try {
				out = new DataOutputStream(new BufferedOutputStream(urlConnection.getOutputStream(), 256));
				out.writeBytes(paramString);
			} finally {
				if (out != null) {
					try {
						out.close();
					} catch (IOException ex) {
					}
					out = null;
				}
			}
		}
		return urlConnection;
	}

	/**
	 * 获得请求参数字符串.
	 * 
	 * @param params
	 *            请求参数.
	 * @return 请求字符串.
	 * @throws UnsupportedEncodingException
	 */
	private static String getParaString(Map<String, Object> params) throws UnsupportedEncodingException {
		StringBuilder paramBuilder = new StringBuilder(256);
		if (params != null) {
			for (Map.Entry<String, Object> entry : params.entrySet()) {
				paramBuilder.append(URLEncoder.encode(entry.getKey(), "UTF-8"));
				paramBuilder.append("=");
				Object value = entry.getValue();
				paramBuilder.append(URLEncoder.encode(value == null ? "" : value.toString(), "UTF-8"));
				paramBuilder.append("&");
			}
			paramBuilder.deleteCharAt(paramBuilder.length() - 1);
		}
		return paramBuilder.toString();
	}
}
