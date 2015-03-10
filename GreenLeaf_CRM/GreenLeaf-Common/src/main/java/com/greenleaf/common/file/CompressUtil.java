package com.greenleaf.common.file;

import java.io.ByteArrayOutputStream;
import java.io.File;
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
 * 压缩工具类
 *
 * @author longlin(longlin@cyou-inc.com)
 * @date 2013-11-11
 * @since V1.0
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

	public static String uploadZipFile(MultipartFile zipFile) {
		String savePath = new PropertiesUtil().getProperties("file.imagePath");
		new File(savePath).mkdir();
		InputStream inputStream = null;
		String originalFilename = zipFile.getOriginalFilename();
		if (StringUtils.isBlank(originalFilename))
			throw new UnCaughtException("上传失败，请重试");
		String fileName = FileUtil.generateImageFid(System.currentTimeMillis()) + "." + IOUtil.getFileSuffix(originalFilename);
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
