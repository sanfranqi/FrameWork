package com.greenleaf.common.file;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

import com.greenleaf.common.encrypt.EncryptUtil;
import com.greenleaf.common.utils.PropertiesUtil;
import com.greenleaf.common.utils.RandomUtil;

/**
 * ImageUtil.
 * 
 * @author QiSF 2015-03-11
 */
public class ImageUtil {
	private static final Logger LOG = LoggerFactory.getLogger(ImageUtil.class);
	/**
	 * 图片限制100KB
	 */
	public static final int IMAGE_CAPACITY_LIMIT = 100;

	/**
	 * 验证图片格式
	 *
	 * @param bytes
	 * @return
	 */
	public static boolean validImageType(byte[] bytes) {
		return getImageFileType(bytes) != null;
	}

	/**
	 * 验证图片容量
	 *
	 * @param bytes
	 * @return
	 */
	public static boolean validImageCapacity(byte[] bytes) {
		return IOUtil.getFileCapacity(bytes) <= IMAGE_CAPACITY_LIMIT;
	}

	/**
	 * 获取图片类型
	 *
	 * @param bytes
	 * @return
	 */
	public static Integer getImageFileType(byte[] bytes) {
		try {
			String start = (Integer.toHexString(bytes[0] & 0xFF) + Integer.toHexString(bytes[1] & 0xFF)).toLowerCase();
			if (start.equals("ffd8")) {
				// jpg格式的图片是以ffd8开头
				return FileType.IMAGE_TYPE_JPG;
			} else if (start.equals("4749")) {
				// gif格式的图片是以4749开头
				return FileType.IMAGE_TYPE_GIF;
			} else if (start.equals("8950")) {
				// png格式的图片是以8950开头
				return FileType.IMAGE_TYPE_PNG;
			} else if (start.equals("424d")) {
				// bmp格式的图片是以424d开头
				return FileType.IMAGE_TYPE_BMP;
			}
			// else if (start.equals("d0cf")) {
			// // els格式的图片是以424d开头
			// return FileType.OFFICE_TYPE_XLS;
			// } else if (start.equals("504b")) {
			// // elsx格式的图片是以424d开头
			// return FileType.OFFICE_TYPE_XLSX;
			// }
		} catch (Exception e) {
		}
		return null;
	}

	/**
	 * 生成图片的fid
	 *
	 * @param time
	 *            创建时间
	 * @return 返回图片的fid
	 */
	public static String generateImageFid(long time) {
		return RandomUtil.getRandomNumber(6) + EncryptUtil.encodeTimestamp(time);
	}

	/**
	 * 上传图片.
	 * 
	 * @author QiSF 2015-03-11
	 */
	public static String uploadImage(MultipartFile imageFile) {
		String savePath = new PropertiesUtil().getProperties("file.imagePath");
		new File(savePath).mkdir();
		InputStream inputStream = null;
		String fileName = ImageUtil.generateImageFid(System.currentTimeMillis()) + "." + IOUtil.getFileSuffix(imageFile.getOriginalFilename());
		try {
			if (!validImageCapacity(imageFile.getBytes()))
				throw new RuntimeException("图片大小不可以超过100KB！");
			inputStream = imageFile.getInputStream();
			IOUtil.in2File(inputStream, savePath + fileName);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return fileName;
	}
}
