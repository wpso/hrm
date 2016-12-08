package com.hrm.common.entity;

import java.util.Date;


public abstract class AbstractEntity {

	// 主健
	private long id;
	private String name = "0";
	// 创建者id
	private Long createId = 0L;
	// 创建时间
	private Date createDate = new Date();
	// 修改人
	private Long updateId = 0L;
	// 修改时间
	private Date updateDate = new Date();
	// 版本
	private Long version = 0l;

	

	public long getId() {
		return id;
	}



	public void setId(long id) {
		this.id = id;
	}



	public String getName() {
		return name;
	}



	public void setName(String name) {
		this.name = name;
	}



	public Long getCreateId() {
		return createId;
	}



	public void setCreateId(Long createId) {
		this.createId = createId;
	}



	public Date getCreateDate() {
		return createDate;
	}



	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}



	public Long getUpdateId() {
		return updateId;
	}



	public void setUpdateId(Long updateId) {
		this.updateId = updateId;
	}



	public Date getUpdateDate() {
		return updateDate;
	}



	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}



	public Long getVersion() {
		return version;
	}



	public void setVersion(Long version) {
		this.version = version;
	}



	@Override
	public String toString() {

		return "id=\"" + this.id + "\",name=\"" + this.name
				+ "\",createDate=\"" + this.createDate + "\",updateId=\""
				+ this.updateId + "\",updateDate=\"" + this.updateDate
				+ "\",version=" + this.version + "\",createId=\""
				+ this.createId + "\"";

	}

}
