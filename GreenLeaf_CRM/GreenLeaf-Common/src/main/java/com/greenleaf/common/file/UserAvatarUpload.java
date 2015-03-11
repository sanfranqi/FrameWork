package com.greenleaf.common.file;

import java.awt.image.BufferedImage;
import java.io.File;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.fileupload.FileItem;

import com.greenleaf.common.bean.ResultVO;
import com.greenleaf.common.bean.SystemConfig;

/**
 * 用户头像上传工具类.
 * 
 * @author QiSF 2015-03-11
 */
public class UserAvatarUpload {
	private final String uploadPath;
	private FileItem fileItem;
	private String imgType;
	private String uploadSourcePath;

	public UserAvatarUpload(HttpServletRequest request, String uploadPath) {
		this.uploadPath = uploadPath;

	}

	/**
	 * 保存头像到文件
	 * 
	 * @return
	 */
	public ResultVO saveAvatarFile() {
		// 1.进行校验
		ResultVO result = fileCheck();
		if (!result.isSuccess()) {
			return result;
		}
		// 2.保存原头像图片
		uploadSourcePath = uploadPath + "source." + imgType;
		File tempFile = new File(uploadSourcePath);
		try {
			fileItem.write(tempFile);
			// 二次校验. 由于图片传输未结束.可能导致读取不到图片正式的大小
			if (fileItem.getSize() > SystemConfig.FILE_SIZE) {
				result.setSuccess(false);
				result.addMsg("上传文件格不能大于 5M ！");
				return result;
			}
			BufferedImage srcImage = Thumbnail.saveImageAsJpg2(uploadSourcePath, uploadPath + "source.jpg");
			result.addMsg(srcImage.getWidth() + "");
			result.addMsg(srcImage.getHeight() + "");
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}

	public ResultVO fileCheck() {
		ResultVO result = new ResultVO(true);
		// 没有上传文件
		// List<FileItem> fileList = super.getFileList();
		// if (fileList == null) {
		// result.setSuccess(false);
		// result.addMsg("上传文件不能为空！");
		// return result;
		// }
		// if (fileList.size() == 0) {
		// result.setSuccess(false);
		// result.addMsg("上传文件不能为空！");
		// return result;
		// }
		// for (FileItem item : fileList) {
		// if (item.getFieldName().equals("file")) {
		// fileItem = item;
		// break;
		// }
		// }
		if (fileItem == null) {
			result.setSuccess(false);
			result.addMsg("上传文件不能为空！");
			return result;
		}
		imgType = getImgType(fileItem);
		if (imgType == null) {
			result.setSuccess(false);
			result.addMsg("上传文件格式不符合(必须是“jpg”,“png”,“gif”中的一种格式)！");
			return result;
		}
		if (fileItem.getSize() > SystemConfig.FILE_SIZE) {
			result.setSuccess(false);
			result.addMsg("上传文件格不能大于 5M ！");
			return result;
		}
		String[] strs = uploadPath.split("avatar");
		result.addMsg(strs[1] + "source." + imgType);
		return result;
	}

	/**
	 * 获取文件类型
	 * 
	 * @param fileItem
	 * @return
	 * @author linhao
	 */
	String getImgType(FileItem fileItem) {
		if (fileItem.getContentType().equals("image/jpeg")) {
			return "jpg";
		} else if (fileItem.getContentType().equals("image/png")) {
			return "png";
		} else if (fileItem.getContentType().equals("image/gif")) {
			return "gif";
		} else if (fileItem.getContentType().equals("image/pjpeg")) {
			return "jpg";
		} else {
			return null;
		}
	}
}
