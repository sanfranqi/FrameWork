package com.greenleaf.common.file;

import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import org.apache.commons.compress.archivers.zip.ZipArchiveEntry;
import org.apache.commons.compress.archivers.zip.ZipFile;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

import com.github.junrar.Archive;
import com.github.junrar.exception.RarException;
import com.github.junrar.rarfile.FileHeader;
import com.greenleaf.common.exception.UnCaughtException;
import com.greenleaf.common.utils.PropertiesUtil;

/**
 * 压缩工具类.
 * 
 * @author QiSF 2015-03-11
 */
public class CompressUtil {

	public static final Logger LOG = LoggerFactory.getLogger(CompressUtil.class);
	/**
	 * 压缩包限制10M
	 */
	public static final int COMPRESS_CAPACITY_LIMIT = 10;
	/**
	 * 压缩包处理线程数
	 */
	public static final int COMPRESSED_THREAD_LIMIT = 3;

	/**
	 * zip扩展名.
	 */
	private final static String ZIP_EXT = ".zip";

	private static ExecutorService compressedExecutorService = Executors.newFixedThreadPool(COMPRESSED_THREAD_LIMIT);

	/**
	 * 获取压缩文件类型
	 * 
	 * @param file
	 * @return
	 */
	public static int getFileType(File file) {
		String suffix = IOUtil.getFileSuffix(file.getPath());
		if (FileType.COMPRESSED_TYPE_NAME_RAR.equals(suffix)) {
			if (isRarFile(file)) {
				return FileType.COMPRESSED_TYPE_RAR;
			} else if (isZipFile(file)) {
				return FileType.COMPRESSED_TYPE_ZIP;
			}
		} else if (FileType.COMPRESSED_TYPE_NAME_ZIP.equals(suffix)) {
			if (isZipFile(file)) {
				return FileType.COMPRESSED_TYPE_ZIP;
			} else if (isRarFile(file)) {
				return FileType.COMPRESSED_TYPE_RAR;
			}
		} else {
			if (isRarFile(file)) {
				return FileType.COMPRESSED_TYPE_RAR;
			} else if (isZipFile(file)) {
				return FileType.COMPRESSED_TYPE_ZIP;
			}
		}
		return -1;
	}

	/**
	 * 判断是否是Zip文件.
	 *
	 * @param file
	 *            zip压缩文件
	 * @return
	 */
	public static boolean isZipFile(final File file) {
		ZipFile zipFile = null;
		try {
			zipFile = new ZipFile(file);
			return zipFile.getEntries().hasMoreElements();
		} catch (IOException e) {
			return false;
		} finally {
			if (zipFile != null) {
				try {
					zipFile.close();
				} catch (IOException e) {
					LOG.error(e.getMessage());
				}
			}
		}
	}

	/**
	 * 解压缩
	 *
	 * @param file
	 *            zip压缩文件
	 * @param filter
	 *            过滤条件
	 * @return
	 * @throws java.io.IOException
	 */
	public static Map<String, byte[]> unzip(final File file, final ZipFileFilter filter) {
		Future<Map<String, byte[]>> future = compressedExecutorService.submit(new Callable<Map<String, byte[]>>() {
			@Override
			public Map<String, byte[]> call() throws Exception {
				ZipFile zipFile = null;
				try {
					zipFile = new ZipFile(file);
					Map<String, byte[]> map = new HashMap<String, byte[]>();
					Enumeration<ZipArchiveEntry> en = zipFile.getEntries();
					while (en.hasMoreElements()) {
						ZipArchiveEntry zipEntry = en.nextElement();
						if (!zipEntry.isDirectory()) {
							byte[] bytes = IOUtil.in2Bytes(zipFile.getInputStream(zipEntry));
							if (filter == null || filter.filter(zipEntry, bytes)) {
								map.put(zipEntry.getName(), bytes);
							}
						}
					}
					return map;
				} catch (IOException e) {
					LOG.error(e.getMessage());
				} finally {
					if (zipFile != null) {
						try {
							zipFile.close();
						} catch (IOException e) {
							LOG.error(e.getMessage());
						}
					}
				}
				return null;
			}
		});
		try {
			return future.get();
		} catch (InterruptedException e) {
			LOG.error(e.getMessage());
		} catch (ExecutionException e) {
			LOG.error(e.getMessage());
		}
		return null;
	}

	/**
	 * 判断是否是rar文件
	 *
	 * @param file
	 *            rar压缩文件
	 * @return
	 */
	public static boolean isRarFile(final File file) {
		Archive rarFile = null;
		try {
			rarFile = new Archive(file);
			List<FileHeader> fileHeaders = rarFile.getFileHeaders();
			return fileHeaders != null && fileHeaders.size() > 0;
		} catch (Exception e) {
			return false;
		} finally {
			if (rarFile != null) {
				try {
					rarFile.close();
				} catch (IOException e) {
					LOG.error(e.getMessage());
				}
			}
		}
	}

	/**
	 * 解压缩rar
	 *
	 * @param file
	 *            rar文件
	 * @param filter
	 *            过滤条件
	 * @return
	 */
	public static Map<String, byte[]> unrar(final File file, final RarFileFilter filter) {
		Future<Map<String, byte[]>> future = compressedExecutorService.submit(new Callable<Map<String, byte[]>>() {
			@Override
			public Map<String, byte[]> call() throws Exception {
				Archive archive = null;
				try {
					archive = new Archive(file);
					Map<String, byte[]> map = new HashMap<String, byte[]>();
					FileHeader fh;
					while (true) {
						fh = archive.nextFileHeader();
						if (fh == null) {
							break;
						}
						if (!fh.isDirectory()) {
							ByteArrayOutputStream out = new ByteArrayOutputStream();
							archive.extractFile(fh, out);
							byte[] bytes = out.toByteArray();
							out.close();
							if (filter == null || filter.filter(fh, bytes)) {
								if (StringUtils.isNotEmpty(fh.getFileNameW())) {
									map.put(fh.getFileNameW(), bytes);
								} else {
									map.put(fh.getFileNameString(), bytes);
								}
							}
						}
					}
					return map;
				} catch (IOException e1) {
					LOG.error(e1.getMessage());
				} catch (RarException e2) {
					LOG.error(e2.getMessage());
				} finally {
					if (archive != null) {
						try {
							archive.close();
						} catch (IOException e) {
							LOG.error(e.getMessage());
						}
					}
				}
				return null;
			}
		});
		try {
			return future.get();
		} catch (InterruptedException e) {
			LOG.error(e.getMessage());
		} catch (ExecutionException e) {
			LOG.error(e.getMessage());
		}
		return null;
	}

	public static interface ZipFileFilter {
		public boolean filter(ZipArchiveEntry zipEntry, byte[] bytes);
	}

	public static interface RarFileFilter {
		public boolean filter(FileHeader fh, byte[] bytes);
	}

	/**
	 * 验证压缩包容量
	 *
	 * @param bytes
	 * @return
	 */
	public static boolean validCompressCapacity(byte[] bytes) {
		return IOUtil.getFileCapacity(bytes) <= COMPRESS_CAPACITY_LIMIT * 1024.0;
	}

	/**
	 * 压缩成zip文件, 隐藏文件不可见.
	 * 
	 * @param zipFilePath
	 *            压缩文件存放的路径.
	 * @param filePath
	 *            文件路径或者文件夹路径.
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
	 */
	public static void zip(String zipFilePath, String filePath, boolean hiddenVisible) {
		ZipOutputStream out = null;
		String zipPath = zipFilePath;
		try {
			FileUtil.mkdirs(zipPath);
			if (FileUtil.isDirectory(zipPath)) {
				zipPath = FileUtil.appendFileName(zipPath, new File(zipPath).getName() + ZIP_EXT);
			}
			zipPath = FileUtil.toStandardPath(zipPath);
			out = new ZipOutputStream(new FileOutputStream(zipPath));
			File file = new File(FileUtil.toStandardPath(filePath));
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
	 */
	private static void zip(ZipOutputStream out, File file, String base, String zipPath, boolean hiddenVisible) {
		BufferedInputStream in = null;
		try {
			if (!file.isHidden() || hiddenVisible) {
				if (file.isDirectory()) {
					File[] fl = file.listFiles();
					for (File file2 : fl) {
						if (!FileUtil.toStandardPath(file2.getPath()).equals(zipPath)) {
							String path = "/";
							if (file2.isDirectory()) {
								path = FileUtil.appendPath(base, file2.getName());
							} else {
								path = FileUtil.appendFileName(base, file2.getName());
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
	 * 上传压缩包.
	 * 
	 * @author QiSF 2015-03-11
	 */
	public static String uploadZipFile(MultipartFile zipFile) {
		String savePath = new PropertiesUtil().getProperties("file.imagePath");
		new File(savePath).mkdir();
		InputStream inputStream = null;
		String originalFilename = zipFile.getOriginalFilename();
		if (StringUtils.isBlank(originalFilename))
			throw new UnCaughtException("上传失败，请重试");
		String fileName = ImageUtil.generateImageFid(System.currentTimeMillis()) + "." + IOUtil.getFileSuffix(originalFilename);
		try {
			if (!validCompressCapacity(zipFile.getBytes()))
				throw new RuntimeException("压缩包大小不能超过" + COMPRESS_CAPACITY_LIMIT + "M！");
			inputStream = zipFile.getInputStream();
			IOUtil.in2File(inputStream, savePath + fileName);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return fileName;
	}
}
