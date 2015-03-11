package com.greenleaf.common.file;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import com.greenleaf.common.exception.UnCaughtException;
import com.greenleaf.common.utils.ObjectUtil;

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
	 * 转标准路径,带/或者\结尾.
	 * 
	 * @param path
	 * @return
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
	 * 获取文件的扩展名.
	 * 
	 * @param fileName
	 * @return
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

}
