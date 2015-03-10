package com.greenleaf.common.select;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 下拉框.
 *
 * @author qingwu
 * @date 2014-2-19 下午1:56:47
 */
@SuppressWarnings("rawtypes")
public class Select extends ArrayList {

    /**
     *
     */
    private static final long serialVersionUID = -7822485345098729810L;

    /**
     * 初始化.
     *
     * @param sourceList     数据源
     * @param valueFieldName value字段名称
     * @param textFieldName  text字段名称
     */
    @SuppressWarnings("unchecked")
    public <T> Select(List<T> sourceList, String valueFieldName,
                      String textFieldName) {
        List<SelectItemVO> list = SelectFactory.getSelectList(sourceList,
                valueFieldName, textFieldName);
        for (SelectItemVO item : list) {
            this.add(item);
        }
    }

    /**
     * 初始化.
     *
     * @param sourceMap 数据源
     */
    @SuppressWarnings("unchecked")
    public Select(Map<String, String> sourceMap) {
        for (String key : sourceMap.keySet()) {
            SelectItemVO e = new SelectItemVO();
            e.setId(key);
            e.setText(sourceMap.get(key));
            this.add(e);
        }

    }

    /**
     * 初始化.
     *
     * @param list
     */
    @SuppressWarnings("unchecked")
    public Select(List<SelectItemVO> list) {
        for (SelectItemVO item : list) {
            this.add(item);
        }
    }
}
