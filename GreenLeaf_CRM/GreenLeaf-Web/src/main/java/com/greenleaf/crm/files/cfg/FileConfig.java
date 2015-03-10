package com.greenleaf.crm.files.cfg;


import com.greenleaf.common.context.ApplicationContextUtil;
import com.greenleaf.crm.config.SystemConfig;

/**
 * 文件上传配置.
 *
 * @author qingwu
 * @date 2014-1-22 下午2:08:01
 */
public class FileConfig implements java.io.Serializable, IHotDeployInit {

    private static final long serialVersionUID = -7896269265500161030L;

    /**
     * 临时文件位置.
     */
    public static String TEMP_PATH;

    /**
     * 文件大小.
     */
    public static Integer FILE_SIZE;

    static {
        new FileConfig().init();
    }

    @Override
    public void init() {
        TEMP_PATH = ApplicationContextUtil.getBean(SystemConfig.class).getTempPath();
        FILE_SIZE = ApplicationContextUtil.getBean(SystemConfig.class).getFileSize();
    }

}
