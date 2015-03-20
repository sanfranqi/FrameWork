package com.greenleaf.common.mybatis.bean;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * 分页对象.
 * 
 * @author QiSF 2015-03-11
 */
public class Paged<T> implements Serializable {

	private static final long serialVersionUID = -3563058571948937207L;

	/*
	 * 总的查询命中数量
	 */
	private int totalHit;

	/*
	 * 当前页码
	 */
	private int pageNo = 10;

	/*
	 * 页面大小
	 */
	private int pageSize = 1;

	private int totalPage; // 总共页数
	private boolean hasPrevious; // 是否有上一页
	private boolean hasNext; // 是否有下一页
	private boolean beginPage; // 是否是首页
	private boolean endPage; // 是否是尾页

	/*
	 * 分页数据
	 */
	private List<T> listData = new ArrayList<T>();

	public Paged() {

	}

	public Paged(List<T> listData, int totalHit, int pageNo, int pageSize) {
		this.listData = listData;
		this.totalHit = totalHit;
		this.pageNo = pageNo;
		this.pageSize = pageSize;
		this.totalPage = totalPage();
		// 修正当前页
		setCurrentPage(pageNo);
		// 初始化前后页等信息
		init();
	}

	public Paged(List<T> listData, int totalHit, int pageNo, int pageSize, boolean needPaged) {
		int start = (pageNo - 1) * pageSize;
		if (start < 0)
			start = 0;
		int end = pageNo * pageSize;
		if (listData != null && end > listData.size())
			end = listData.size();
		this.listData = listData.subList(start, end);
		this.totalHit = totalHit;
		this.pageNo = pageNo;
		this.pageSize = pageSize;
		this.totalPage = totalPage();
		// 修正当前页
		setCurrentPage(pageNo);
		// 初始化前后页等信息
		init();
	}

	public int getTotalHit() {
		return totalHit;
	}

	public void setTotalHit(int totalHit) {
		this.totalHit = totalHit;
	}

	public int getPageNo() {
		return pageNo;
	}

	public void setPageNo(int pageNo) {
		this.pageNo = pageNo;
	}

	public int getPageSize() {
		return pageSize;
	}

	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}

	public List<T> getListData() {
		return listData;
	}

	public void setListData(List<T> listData) {
		this.listData = listData;
	}

	public int getTotalPage() {
		return totalPage;
	}

	public void setTotalPage(int totalPage) {
		this.totalPage = totalPage;
	}

	public boolean isHasPrevious() {
		return hasPrevious;
	}

	public void setHasPrevious(boolean hasPrevious) {
		this.hasPrevious = hasPrevious;
	}

	public boolean isHasNext() {
		return hasNext;
	}

	public void setHasNext(boolean hasNext) {
		this.hasNext = hasNext;
	}

	public boolean isBeginPage() {
		return beginPage;
	}

	public void setBeginPage(boolean beginPage) {
		this.beginPage = beginPage;
	}

	public boolean isEndPage() {
		return endPage;
	}

	public void setEndPage(boolean endPage) {
		this.endPage = endPage;
	}

	public boolean hasNext() {
		return pageNo < this.totalPage;
	}

	public boolean hasPrevious() {
		return pageNo > 1;
	}

	public boolean isFirst() {
		return pageNo == 1;
	}

	public boolean isLast() {
		return pageNo >= this.totalPage;
	}

	// 初始化信息
	private void init() {
		this.hasNext = hasNext();
		this.hasPrevious = hasPrevious();
		this.beginPage = isFirst();
		this.endPage = isLast();
	}

	// 修正计算当前页
	public void setCurrentPage(int currentPage) {
		if (currentPage > this.totalPage) {
			this.pageNo = this.totalPage;
		} else if (currentPage < 1) {
			this.pageNo = 1;
		} else {
			this.pageNo = currentPage;
		}
	}

	/**
	 * 根据pageSize和totalHit计算总页数
	 * 
	 * @return
	 */
	public int totalPage() {
		int totalPage = this.totalHit / this.pageSize;
		if (this.totalHit % this.pageSize != 0) {
			totalPage = totalPage + 1;
		}
		return totalPage;
	}

	// 获取当前页记录的开始索引
	public int getBeginIndex() {
		int beginIndex = (pageNo - 1) * pageSize; // 索引下标从0开始
		return beginIndex;
	}

	// 返回下一页的页码
	public int getNextPage() {
		if (pageNo + 1 >= this.totalPage) { // 如果当前页已经是最后页 则返回最大页
			return this.totalPage;
		}
		return pageNo + 1;
	}

	// 返回前一页的页码
	public int getPreviousPage() {
		if (pageNo - 1 <= 1) {
			return 1;
		} else {
			return pageNo - 1;
		}
	}

}
