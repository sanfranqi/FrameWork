package com.greenleaf.common.utils;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.apache.commons.compress.archivers.zip.ZipArchiveEntry;
import org.apache.commons.compress.archivers.zip.ZipFile;

import com.github.junrar.Archive;
import com.github.junrar.rarfile.FileHeader;
import com.greenleaf.common.exception.UnCaughtException;
import com.greenleaf.common.file.IOUtil;

/**
 * Title:文件操作工具类
 * 
 * @author QSF
 * @version 创建时间：2012-3-16
 */
public class FileUtil {
	/**
	 * 私有构造方法，防止类的实例化，因为工具类不需要实例化。
	 */
	private FileUtil() {
	}

	/**
	 * 创建目录
	 * 
	 * @param directory
	 *            主目录
	 * @param subDirectory
	 *            子目录
	 */
	public static void createDirectory(String directory, String subDirectory) {
		String dir[];
		File fl = new File(directory);

		try {
			if (subDirectory == "" && fl.exists() != true) {
				fl.mkdir();
			} else if (subDirectory != "") {
				dir = subDirectory.replace('\\', '/').split("/");
				for (int i = 0; i < dir.length; i++) {
					File subFile = new File(directory + File.separator + dir[i]);

					if (subFile.exists() == false) {
						subFile.mkdir();
					}
					directory += File.separator + dir[i];
				}
			}
		} catch (Exception ex) {
			System.out.println(ex.getMessage());
		}
	}

	/**
	 * 拷贝文件夹中的所有文件到另外一个文件夹
	 * 
	 * @param srcDirector
	 *            源文件夹
	 * 
	 * @param desDirector
	 *            目标文件夹
	 */
	public static void copyFileWithDirector(String srcDirector, String desDirector) throws IOException {
		(new File(desDirector)).mkdirs();
		File[] file = (new File(srcDirector)).listFiles();

		for (int i = 0; i < file.length; i++) {
			if (file[i].isFile()) {
				FileInputStream input = new FileInputStream(file[i]);
				FileOutputStream output = new FileOutputStream(desDirector + "/" + file[i].getName());

				byte[] b = new byte[1024 * 5];
				int len;
				while ((len = input.read(b)) != -1) {
					output.write(b, 0, len);
				}

				output.flush();
				output.close();
				input.close();
			}

			if (file[i].isDirectory()) {
				copyFileWithDirector(srcDirector + "/" + file[i].getName(), desDirector + "/" + file[i].getName());
			}
		}
	}

	/**
	 * 删除文件夹
	 * 
	 * @param folderPath
	 *            文件夹完整绝对路径
	 */
	public static void delFolder(String folderPath) throws Exception {

		// 删除完里面所有内容

		delAllFile(folderPath);

		String filePath = folderPath;

		filePath = filePath.toString();

		File myFilePath = new File(filePath);

		// 删除空文件夹

		myFilePath.delete();

	}

	/**
	 * 删除指定文件夹下所有文件
	 * 
	 * @param path
	 *            文件夹完整绝对路径
	 */
	public static boolean delAllFile(String path) throws Exception {

		boolean flag = false;
		File file = new File(path);

		if (!file.exists()) {
			return flag;
		}

		if (!file.isDirectory()) {
			return flag;
		}

		String[] tempList = file.list();
		File temp = null;

		for (int i = 0; i < tempList.length; i++) {
			if (path.endsWith(File.separator)) {
				temp = new File(path + tempList[i]);
			} else {
				temp = new File(path + File.separator + tempList[i]);
			}

			if (temp.isFile()) {
				temp.delete();
			}

			if (temp.isDirectory()) {
				// 先删除文件夹里面的文件

				delAllFile(path + "/" + tempList[i]);

				// 再删除空文件夹

				delFolder(path + "/" + tempList[i]);

				flag = true;
			}
		}

		return flag;

	}

	/***
	 * 获取文件扩展名
	 * 
	 * @param filename
	 *            文件名
	 */
	public static String getFileExt(String filename) {
		String ext = "";
		int i = filename.lastIndexOf(".");
		if (i >= 0) {
			ext = filename.substring(i);
		}
		return ext;
	}

	/**
	 * 创建一个文件夹
	 * 
	 * @param path
	 *            路径
	 * @return 返回是否成功
	 */
	public static boolean createFolder(String path) {
		return new File(path).mkdir();
	}

	/**
	 * 拷贝文件
	 * 
	 * @param sourcePath
	 *            源文件路径
	 * @param descPath
	 *            目标文件路径
	 * @return 返回是否成功
	 */
	public static boolean copyFile(String sourcePath, String descPath) {
		boolean flag = false;
		try {
			FileInputStream in = new FileInputStream(sourcePath);
			FileOutputStream out = new FileOutputStream(descPath);
			byte[] b = new byte[4096];
			int len = 0;
			while ((len = in.read(b)) != -1) {
				out.write(b, 0, len);
			}
			out.flush();
			out.close();
			in.close();
			flag = true;
		} catch (FileNotFoundException e1) {
			e1.printStackTrace();
		} catch (IOException e2) {
			e2.printStackTrace();
		}
		return flag;
	}

	/**
	 * 删除一个文件
	 */
	public static boolean deleteFile(String path) {
		return new File(path).delete();
	}

	/**
	 * 判断文件或者文件夹是否存在
	 */
	public static boolean isExist(String path) {
		return new File(path).exists();
	}

	/**
	 * 判断某个路径下面的文件夹列表中，将文件夹为空的列表显示出来
	 */
	public static List<String> dirListEmpty(String path) {
		List<String> list = new ArrayList<String>();
		File dir = new File(path);
		if (dir.exists()) {
			File files[] = dir.listFiles();
			if (files == null) {
				System.out.println("没有文件夹");
			} else {
				for (File file : files) {
					File afiles[] = file.listFiles();
					if (afiles == null || (afiles != null && afiles.length == 0)) {
						list.add(file.getName());
					}
				}
			}
		} else {
			System.out.println("该目录不存在");
		}
		return list;
	}

	/**
	 * zip扩展名.
	 */
	private final static String ZIP_EXT = ".zip";

	/**
	 * 转标准路径,带/或者\结尾.
	 * 
	 * @param path
	 * @return
	 * @author yangz
	 * @date 2013-2-25 上午9:32:15
	 */
	public static String toStandardPath(String path) {
		if (isDirectory(path)) {
			return appendPath(path, "");
		} else {
			return path;
		}
	}

	/**
	 * 是否是文件夹.
	 * 
	 * @param path
	 * @return
	 * @author yangz
	 * @date 2013-2-25 上午10:28:09
	 */
	public static boolean isDirectory(String path) {
		return new File(path).isDirectory();
	}

	/**
	 * 路径合并.
	 * 
	 * @param source
	 * @param append
	 * @return
	 * @author yangz
	 * @date 2013-2-22 下午4:21:49
	 */
	public static String appendPath(String basePath, String append) {
		String result = basePath;
		if (isLeftSlash(result)) {
			if (result.endsWith("/")) {
				result += append + "/";
			} else {
				result += "/" + append;
			}
		} else if (isRightSlash(result)) {
			if (result.endsWith("\\")) {
				result += append + "\\";
			} else {
				result += "\\" + append;
			}
		}
		return result;
	}

	/**
	 * 路径追加文件名.
	 * 
	 * @param path
	 * @param fileName
	 * @return
	 * @author yangz
	 * @date 2013-2-22 下午5:14:15
	 */
	public static String appendFileName(String path, String fileName) {
		String result = path;
		if (isLeftSlash(result)) {
			if (result.endsWith("/")) {
				result += fileName;
			} else {
				result += "/" + fileName;
			}
		} else if (isRightSlash(result)) {
			if (result.endsWith("\\")) {
				result += fileName;
			} else {
				result += "\\" + fileName;
			}
		}
		return result;
	}

	/**
	 * 文件创建,目录不存在自动创建.
	 * 
	 * @param fileName
	 * @author yangz
	 * @date 2013-2-22 下午5:28:47
	 */
	public static void create(String fileName) {
		File file = new File(fileName);
		mkdirs(file.getParentFile().getPath());
		try {
			if (!file.createNewFile()) {
				throw new UnCaughtException("create file faild:" + fileName);
			}
		} catch (Exception e) {
			throw new UnCaughtException(e);
		}
	}

	/**
	 * 创建目录.
	 * 
	 * @param path
	 * @author yangz
	 * @date 2013-2-22 下午5:26:00
	 */
	public static void mkdirs(String path) {
		File dir = new File(toStandardPath(path));
		if (dir.isDirectory()) {
			if (!dir.exists()) {
				dir.mkdirs();
			}
		} else {
			File parent = dir.getParentFile();
			if (!parent.exists()) {
				parent.mkdirs();
			}
		}
	}

	/**
	 * 压缩成zip文件, 隐藏文件不可见.
	 * 
	 * @param zipFilePath
	 *            压缩文件存放的路径.
	 * @param filePath
	 *            文件路径或者文件夹路径.
	 * @author yangz
	 * @date 2013-2-27 上午9:46:49
	 */
	public static void zip(String zipFilePath, String filePath) {
		zip(zipFilePath, filePath, false);
	}

	/**
	 * 压缩成zip文件.
	 * 
	 * @param zipFilePath
	 *            压缩文件存放的路径.
	 * @param filePath
	 *            文件路径或者文件夹路径.
	 * @param hiddenVisible
	 *            隐藏文件是否可见.
	 * @author yangz
	 * @date 2013-2-25 上午9:21:31
	 */
	public static void zip(String zipFilePath, String filePath, boolean hiddenVisible) {
		ZipOutputStream out = null;
		String zipPath = zipFilePath;
		try {
			mkdirs(zipPath);
			if (isDirectory(zipPath)) {
				zipPath = appendFileName(zipPath, new File(zipPath).getName() + ZIP_EXT);
			}
			zipPath = toStandardPath(zipPath);
			out = new ZipOutputStream(new FileOutputStream(zipPath));
			File file = new File(toStandardPath(filePath));
			zip(out, file, "/", zipPath, hiddenVisible);
		} catch (Exception e) {
			throw new UnCaughtException(e);
		} finally {
			IOUtil.close(out);
		}
	}

	/**
	 * 循环压缩文件.
	 * 
	 * @param out
	 * @param file
	 * @param base
	 * @author yangz
	 * @date 2013-2-25 上午10:02:41
	 */
	private static void zip(ZipOutputStream out, File file, String base, String zipPath, boolean hiddenVisible) {
		BufferedInputStream in = null;
		try {
			if (!file.isHidden() || hiddenVisible) {
				if (file.isDirectory()) {
					File[] fl = file.listFiles();
					for (File file2 : fl) {
						if (!toStandardPath(file2.getPath()).equals(zipPath)) {
							String path = "/";
							if (file2.isDirectory()) {
								path = appendPath(base, file2.getName());
							} else {
								path = appendFileName(base, file2.getName());
							}
							zip(out, file2, path, zipPath, hiddenVisible);
						}
					}
				} else {
					out.putNextEntry(new ZipEntry(base));
					in = new BufferedInputStream(new FileInputStream(file));
					byte[] buffer = new byte[1024];
					while (in.read(buffer) != -1) {
						out.write(buffer);
					}
				}
			}
		} catch (Exception e) {
			throw new UnCaughtException(e);
		} finally {
			IOUtil.close(in);
		}
	}

	/**
	 * 解压缩.
	 * 
	 * @param zipPath
	 * @param unZipPath
	 * @author yangz
	 * @date 2013-2-27 上午11:51:59
	 */
	public static void unZip(String zipPath, String unZipPath) {
		InputStream is = null;
		OutputStream os = null;
		ZipFile file = null;
		try {
			file = new ZipFile(new File(zipPath));
			Enumeration<ZipArchiveEntry> en = file.getEntries();
			ZipArchiveEntry ze = null;
			while (en.hasMoreElements()) {
				ze = en.nextElement();
				File f = new File(toStandardPath(unZipPath), ze.getName());
				if (ze.isDirectory()) {
					f.mkdirs();
					continue;
				} else {
					f.getParentFile().mkdirs();
					is = file.getInputStream(ze);
					os = new FileOutputStream(f);
					IOUtil.copy(is, os);
					IOUtil.close(is);
					IOUtil.close(os);
				}
			}
			file.close();
		} catch (IOException e) {
			throw new UnCaughtException(e);
		} finally {
			IOUtil.close(is);
			IOUtil.close(os);
			IOUtil.close(file);
		}
	}

	/**
	 * 是否是Zip文件
	 * 
	 * @param zipFile
	 * @return
	 * @author yangz
	 * @date 2012-9-19 上午09:29:18
	 */
	public static boolean isZipFile(File zipFile) {
		try {
			ZipFile zf = new ZipFile(zipFile);
			boolean isZip = zf.getEntries().hasMoreElements();
			zf.close();
			return isZip;
		} catch (IOException e) {
			throw new UnCaughtException(e);
		}
	}

	/**
	 * 是否是图片文件.
	 * 
	 * @param fileName
	 * @return
	 * @author yangz
	 * @date 2013-2-22 下午2:00:40
	 */
	public static boolean isImage(String fileName) {
		boolean flag = false;
		String lower = fileName.toLowerCase();
		if (lower.endsWith(".jpg") || lower.endsWith(".gif") || lower.endsWith(".bmp") || lower.endsWith(".png")) {
			flag = true;
		}
		return flag;
	}

	/**
	 * 获取文件的扩展名.
	 * 
	 * @param fileName
	 * @return
	 * @author yangz
	 * @date 2013-2-20 上午9:28:51
	 */
	public static String getExtType(String fileName) {
		if (!ObjectUtil.isEmpty(fileName) && fileName.contains(".")) {
			return fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
		} else {
			throw new UnCaughtException("path is not law:" + fileName);
		}
	}

	/**
	 * 获取文件名.
	 * 
	 * @param fileName
	 * @return
	 * @author yangz
	 * @date 2013-2-22 下午12:03:14
	 */
	public static String getFileName(String filePath) {
		if (isLeftSlash(filePath)) {
			return filePath.substring(filePath.lastIndexOf("/") + 1);
		} else if (isRightSlash(filePath)) {
			return filePath.substring(filePath.lastIndexOf("\\") + 1);
		} else {
			throw new UnCaughtException("path is not law:" + filePath);
		}
	}

	/**
	 * 路径左斜杆形式.
	 * 
	 * @return
	 * @author yangz
	 * @date 2013-2-19 下午6:34:05
	 */
	public static boolean isLeftSlash(String path) {
		boolean result = path.contains("/");
		if (result && path.contains("\\")) {
			throw new UnCaughtException("path is not law:" + path);
		} else {
			return result;
		}
	}

	/**
	 * 路径右斜杆形式.
	 * 
	 * @param path
	 * @return
	 * @author yangz
	 * @date 2013-2-19 下午6:37:15
	 */
	public static boolean isRightSlash(String path) {
		boolean result = path.contains("\\");
		if (result && path.contains("/")) {
			throw new UnCaughtException("path is not law:" + path);
		} else {
			return result;
		}
	}

	/**
	 * 压缩文件, 必须配置winrar环境变量.
	 * 
	 * @param rarPath
	 * @param filePath
	 * @author yangz
	 * @date 2013-3-1 上午10:10:24
	 */
	public static void rar(String rarPath, String filePath) {
		String cmd = "rar a " + rarPath + " " + toStandardPath(filePath);
		try {
			Runtime rt = Runtime.getRuntime();
			rt.exec(cmd);
		} catch (Exception e) {
			throw new UnCaughtException(e);
		}
	}

	/**
	 * 解压缩.
	 * 
	 * @param rarPath
	 *            压缩文件.
	 * @param unRarPath
	 *            解压缩的路径.
	 * @throws Exception
	 * @author yangz
	 * @date 2012-9-20 下午06:27:22
	 */
	public static void unRar(String rarPath, String unRarPath) {
		Archive a = null;
		FileOutputStream fos = null;
		try {
			a = new Archive(new File(rarPath));
			FileHeader fh = a.nextFileHeader();
			while (fh != null) {
				if (!fh.isDirectory()) {
					// 1 根据不同的操作系统拿到相应的 destDirName 和 destFileName
					String compressFileName = fh.getFileNameW().trim();
					if (!StringUtil.isExistZH(compressFileName)) {
						compressFileName = fh.getFileNameString().trim();
					}
					String destFileName = "";
					String destDirName = "";
					// 非windows系统
					if (File.separator.equals("/")) {
						destFileName = unRarPath + compressFileName.replaceAll("\\\\", "/");
						destDirName = destFileName.substring(0, destFileName.lastIndexOf("/"));
						// windows系统
					} else {
						destFileName = unRarPath + compressFileName.replaceAll("/", "\\\\");
						destDirName = destFileName.substring(0, destFileName.lastIndexOf("\\"));
					}
					// 2创建文件夹
					File dir = new File(destDirName);
					if (!dir.exists() || !dir.isDirectory()) {
						dir.mkdirs();
					}
					// 3解压缩文件
					fos = new FileOutputStream(new File(destFileName));
					a.extractFile(fh, fos);
					IOUtil.close(fos);
				}
				fh = a.nextFileHeader();
			}
		} catch (Exception e) {
			throw new UnCaughtException(e);
		} finally {
			IOUtil.close(fos);
			IOUtil.close(a);
		}
	}
}
