package com.greenleaf.common.utils;

/**
 * Created with IntelliJ IDEA.
 * User: Administrator
 * Date: 13-7-3
 * Time: 下午4:03
 * To change this template use File | Settings | File Templates.
 */
public class MathUtil {
    /**
     * 计算当前页丢弃的行数.
     * @param pageNo
     * @param pageSize
     * @return
     * @author yangz
     * @date 2012-7-28 下午10:39:46
     */
    public static int getSkipRow(int pageNo, int pageSize) {
        return (pageNo - 1) * pageSize;
    }
}
