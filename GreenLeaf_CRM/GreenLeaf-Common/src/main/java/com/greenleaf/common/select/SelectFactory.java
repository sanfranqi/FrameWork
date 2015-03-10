package com.greenleaf.common.select;

import java.util.ArrayList;
import java.util.List;

import com.greenleaf.common.exception.UnCaughtException;
import com.greenleaf.common.utils.ObjectUtil;

/**
 * 下拉框转化工厂.
 * 
 * @author qingwu
 * @date 2014-2-19 下午1:17:47
 */
public class SelectFactory {

	/**
	 * 获得下拉框列表.
	 * 
	 * @param sourceList
	 *            数据源
	 * @param valueFieldName
	 *            value字段名称
	 * @param textFieldName
	 *            text字段名称
	 * @return
	 * @author qingwu
	 * @date 2014-2-19 下午1:34:56
	 */
	public static <T> List<SelectItemVO> getSelectList(List<T> sourceList, String valueFieldName, String textFieldName) {
		List<SelectItemVO> list = new ArrayList<SelectItemVO>();
		try {
			for (T obj : sourceList) {
				Object valueObj = ObjectUtil.getFieldValue(obj, valueFieldName);
				String value = valueObj == null ? "" : String.valueOf(valueObj);
				Object textObj = ObjectUtil.getFieldValue(obj, textFieldName);
				String text = textObj == null ? "" : String.valueOf(textObj);
				SelectItemVO item = new SelectItemVO(value, text);
				list.add(item);
			}
		} catch (Exception e) {
			throw new UnCaughtException(e);
		}
		return list;
	}

}
