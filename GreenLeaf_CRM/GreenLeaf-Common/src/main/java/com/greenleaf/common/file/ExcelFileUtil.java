package com.greenleaf.common.file;

import org.apache.poi.hssf.usermodel.HSSFDateUtil;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.DateFormat;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

/**
 * excel文件处理工具类.
 *
 * @author linhao
 * @date 2014-5-16
 */
public class ExcelFileUtil {

    /**
     * excel文件.
     */
    private File excelFile;

    /**
     * excel类型.
     */
    private int excelType = -1;

    private static final int EXCEL_TYPE_XLS = 1;

    private static final int EXCEL_TYPE_XLSX = 2;

    public ExcelFileUtil(File file) {
        excelFile = file;
        if (excelFile == null) throw new RuntimeException("没有上传文件");
        String fileName = excelFile.getName();
        if (fileName.endsWith(".xls")) {
            excelType = EXCEL_TYPE_XLS;
        } else if (fileName.endsWith(".xlsx")) {
            excelType = EXCEL_TYPE_XLSX;
        }
    }


    /**
     * 初始化excel.
     *
     * @param in
     * @return
     * @author qingwu
     * @date 2014-3-20 上午10:19:30
     */
    public Workbook getWorkbook(InputStream in) {
        Workbook workbook = null;
        try {
            switch (this.excelType) {
                case EXCEL_TYPE_XLS:// xls格式
                    workbook = new HSSFWorkbook(in);
                    break;
                case EXCEL_TYPE_XLSX:// xlsx格式
                    workbook = new XSSFWorkbook(in);
                    break;
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return workbook;
    }

    /**
     * 读取excel文件,将数据转换成List.<br>
     * 说明：目前只支持单excel、单sheet类型，且文件类型为'.xls'或者'.xlsx'.
     *
     * @return
     * @author qingwu
     * @date 2014-1-22 下午3:18:48
     */
    public List<List<String>> readExcel() {
        fileCheck();
        List<List<String>> datas = new ArrayList<List<String>>();
        // 读取excel
        InputStream in = null;
        try {
            in=new FileInputStream(excelFile);
            Workbook workbook = getWorkbook(in);
            if (workbook == null) {
                throw new RuntimeException("初始化excel出错!");
            }
            Sheet sheet = workbook.getSheetAt(0);
            if(sheet.getLastRowNum()==0) throw new RuntimeException("excel文件没有数据!");
            int colLength = sheet.getRow(0).getLastCellNum();
            for (int i = 0; i <= sheet.getLastRowNum(); i++) {
                List<String> _row = new ArrayList<String>();
                Row row = sheet.getRow(i);
                for (int j = 0; j < row.getLastCellNum(); j++) {
                    Cell cell = row.getCell(j);
                    if (cell == null) {
                        _row.add(null);
                        continue;
                    }
                    if (cell.toString() == null) {
                        _row.add(null);
                        continue;
                    }
                    if (cell.toString().equals("")) {
                        _row.add(null);
                        continue;
                    }

                    if (cell.getCellType() == Cell.CELL_TYPE_STRING) {
                        _row.add(cell.getStringCellValue());
                    } else if ((cell.getCellType() == Cell.CELL_TYPE_NUMERIC)) {
                        if (HSSFDateUtil.isCellDateFormatted(cell)) {// 如果是日期格式
                            DateFormat formater = new SimpleDateFormat(
                                    "yyyy/MM/dd");
                            _row.add(formater.format(cell.getDateCellValue()));
                        } else {
                            DecimalFormat df = new DecimalFormat("0");
                            String value = df
                                    .format(cell.getNumericCellValue());
                            _row.add(value);
                        }
                    } else if (cell.getCellType() == Cell.CELL_TYPE_FORMULA) {
                        _row.add(getFormulaValue(workbook, cell));
                    } else {
                        _row.add(cell.toString());
                    }
                }
                while (_row.size() < colLength) {// 与列头保持列数一致
                    _row.add(null);
                }
                datas.add(_row);
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return datas;
    }

    /**
     * 根据公式获得单元格的值文本.
     *
     * @param cell
     * @return
     * @author qingwu
     * @date 2014-3-14 下午6:00:51
     */
    public String getFormulaValue(Workbook wb, Cell cell) {
        FormulaEvaluator evaluator = wb.getCreationHelper()
                .createFormulaEvaluator();
        String s = null;
        CellValue cellValue = evaluator.evaluate(cell);
        switch (cellValue.getCellType()) {
            case Cell.CELL_TYPE_BOOLEAN:
                s = String.valueOf(cellValue.getBooleanValue());
                break;
            case Cell.CELL_TYPE_NUMERIC:
                DecimalFormat df = new DecimalFormat("0");
                s = df.format(cellValue.getNumberValue());
                break;
            case Cell.CELL_TYPE_STRING:
                s = cellValue.getStringValue();
                break;
            case Cell.CELL_TYPE_BLANK:
                break;
            case Cell.CELL_TYPE_ERROR:
                break;
            // CELL_TYPE_FORMULA will never happen
            case Cell.CELL_TYPE_FORMULA:
                break;
        }
        return s;
    }

    public Boolean fileCheck() {
        Boolean result = true;
        // 没有上传文件
        if (excelFile == null) {
            throw new RuntimeException("上传文件不能为空！");
        }
        if (IOUtil.getFileCapacity(excelFile) == 0) {
            throw new RuntimeException("上传文件不能为空！");
        }
        // 读取excel
        if (excelType == -1) {
            throw new RuntimeException("上传文件格式不符合(必须是.xls或者.xlsx格式)！");
        }

        if (IOUtil.getFileCapacity(excelFile) / 1024 > 1048576) {
            throw new RuntimeException("上传文件不能大于5M！");
        }
        return result;
    }
}
