package com.greenleaf.common.file;

import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.URL;

import org.apache.commons.compress.utils.IOUtils;
import org.codehaus.plexus.util.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.greenleaf.common.exception.UnCaughtException;

/**
 * IOUtil.
 * 
 * @author QiSF 2015-03-11
 */
public class IOUtil extends FileUtils {
	private static final Logger LOG = LoggerFactory.getLogger(IOUtil.class);

	/**
	 * 将输入流(InputStream)转为byte数组，读取完后输入流(InputStream)即被关闭
	 *
	 * @param in
	 *            输入流
	 * @return 返回byte数组
	 * @throws java.io.IOException
	 */
	public static byte[] in2Bytes(InputStream in) throws IOException {
		if (in == null) {
			return null;
		}

		ByteArrayOutputStream out = null;
		byte[] bytes = null;
		try {
			out = new ByteArrayOutputStream();
			byte[] buffer = new byte[2048];
			int len;
			while ((len = in.read(buffer)) > 0) {
				out.write(buffer, 0, len);
			}
			bytes = out.toByteArray();
		} finally {
			if (out != null) {
				out.close();
			}
			in.close();
		}

		return bytes;
	}

	/**
	 * 将byte数组转为输入流(ByteArrayInputStream)
	 *
	 * @param bytes
	 *            byte数组
	 * @return 返回输入流
	 * @throws java.io.IOException
	 */
	public static ByteArrayInputStream bytes2In(byte[] bytes) throws IOException {
		return new ByteArrayInputStream(bytes);
	}

	/**
	 * 将byte数组转为输出流(ByteArrayOutputStream)
	 *
	 * @param bytes
	 *            byte数组
	 * @return 返回输出流
	 * @throws java.io.IOException
	 */
	public static ByteArrayOutputStream bytes2Out(byte[] bytes) throws IOException {
		ByteArrayOutputStream out = new ByteArrayOutputStream();
		out.write(bytes);
		return out;
	}

	/**
	 * byte数组转为文件
	 *
	 * @param bytes
	 *            文件流
	 * @param filePath
	 *            文件路径
	 * @return
	 * @throws java.io.IOException
	 */
	public static File byte2File(byte[] bytes, String filePath) throws IOException {
		return in2File(bytes2In(bytes), filePath);
	}

	/**
	 * InputStream转为文件
	 *
	 * @param in
	 *            文件流
	 * @param filePath
	 *            文件路径
	 * @return
	 * @throws java.io.IOException
	 */
	public static File in2File(InputStream in, String filePath) throws IOException {
		mkParentDir(filePath);
		File file = null;
		OutputStream os = null;
		try {
			file = new File(filePath);
			os = new FileOutputStream(file);

			int bytesRead;
			byte[] buffer = new byte[8192];
			while ((bytesRead = in.read(buffer, 0, 8192)) != -1) {
				os.write(buffer, 0, bytesRead);
			}
		} finally {
			if (os != null) {
				os.close();
			}
			if (in != null) {
				in.close();
			}
		}
		return file;
	}

	/**
	 * 强制创建目录
	 *
	 * @param dir
	 * @return
	 */
	public static boolean mkDir(String dir) {
		try {
			FileUtils.forceMkdir(new File(dir));
			return true;
		} catch (IOException e) {
			LOG.error(e.getMessage());
		}
		return false;
	}

	/**
	 * 强制创建父目录
	 *
	 * @param filepath
	 * @return
	 */
	public static boolean mkParentDir(String filepath) {
		return mkDir(new File(filepath).getParent());
	}

	/**
	 * 强制删除文件
	 * 
	 * @param file
	 */
	public static void forceDelete(File file) {
		try {
			FileUtils.forceDelete(file);
		} catch (IOException ignored) {
		}
	}

	/**
	 * 下载图片
	 *
	 * @param url
	 * @return
	 * @throws java.io.IOException
	 */
	public static InputStream downloadFile(String url) throws IOException {
		return new URL(url).openStream();
	}

	/**
	 * 获取文件名称
	 *
	 * @param filepath
	 * @return
	 */
	public static String getFileName(String filepath) {
		String[] arr = filepath.split("[\\\\|/]+");
		return arr.length > 0 ? arr[arr.length - 1] : null;
	}

	/**
	 * 获取文件后缀
	 *
	 * @param filepath
	 * @return
	 */
	public static String getFileSuffix(String filepath) {
		if (filepath.contains(".")) {
			String[] array = filepath.split("\\.");
			if (array.length > 0) {
				return array[array.length - 1].toLowerCase();
			}
		}
		return null;
	}

	/**
	 * 获取文件容量，单位KB
	 *
	 * @param bytes
	 * @return
	 * @throws java.io.IOException
	 */
	public static double getFileCapacity(byte[] bytes) {
		return Math.round(bytes.length * 100.0 / 1024) / 100.0;
	}

	/**
	 * 获取文件容量，单位KB
	 *
	 * @param file
	 * @return
	 */
	public static double getFileCapacity(File file) {
		return Math.round(file.length() * 100.0 / 1024) / 100.0;
	}

	/**
	 * 读取classpath下的文件流.
	 * 
	 * @param path
	 *            相对于classPath
	 */
	public static InputStream getClassPathInputStream(String path) {
		return Thread.currentThread().getContextClassLoader().getResourceAsStream(path);
	}

	/**
	 * 流拷贝.
	 * 
	 * @param input
	 * @param output
	 */
	public static void copy(InputStream input, OutputStream output) {
		try {
			IOUtils.copy(input, output);
		} catch (Exception e) {
			throw new UnCaughtException(e);
		}
	}

	/**
	 * 关闭输入输出流.
	 * 
	 * @param stream
	 */
	public static void close(Object stream) {
		try {
			if (stream == null) {
				return;
			} else if (stream instanceof OutputStream) {
				OutputStream out = (OutputStream) stream;
				out.close();
			} else if (stream instanceof InputStream) {
				InputStream in = (InputStream) stream;
				in.close();
			} else if (stream instanceof PrintWriter) {
				PrintWriter pw = (PrintWriter) stream;
				pw.close();
			} else {
				stream.getClass().getMethod("close").invoke(stream);
			}
		} catch (Exception e) {
			throw new UnCaughtException(e);
		}
	}

	/**
	 * 读取文件的二进制数据.
	 * 
	 * @param file
	 * @return
	 */
	public static byte[] getBytes(File file) {
		BufferedInputStream bufferedInputStream = null;
		try {
			byte[] result = new byte[(int) file.length()];
			bufferedInputStream = new BufferedInputStream(new FileInputStream(file));
			if (bufferedInputStream.read(result) != (int) file.length()) {
				throw new UnCaughtException("file read length error.");
			}
			return result;
		} catch (Exception e) {
			throw new UnCaughtException(e);
		} finally {
			close(bufferedInputStream);
		}
	}

	/**
	 * 网络资源是否存在.
	 * 
	 * @param url
	 * @return
	 */
	public static boolean urlExists(String url) {
		try {
			IOUtil.close(new URL(url).openStream());
			return true;
		} catch (Exception e) {
			return false;
		}
	}
}
