package com.hrm.common.entity;

import java.util.Date;

public abstract class AbstractVO {

	// id
	private long id;
	private String name;
	// 修改人id
	private long createId;
	// 创建时间
	private Date createDate;
	// 修改人id
	private long updateId;
	// 修改时间
	private Date updateDate;
	// 版本
	private long version;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public long getCreateId() {
		return createId;
	}

	public void setCreateId(long createId) {
		this.createId = createId;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public long getUpdateId() {
		return updateId;
	}

	public void setUpdateId(long updateId) {
		this.updateId = updateId;
	}

	public Date getUpdateDate() {
		return updateDate;
	}

	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}

	public long getVersion() {
		return version;
	}

	public void setVersion(long version) {
		this.version = version;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Override
	public String toString() {

		return "id=\"" + this.id + "\",name=\"" + this.name
				+ "\",createName=\"" + "\",createDate=\"" + this.createDate
				+ "\",updateId=\"" + this.updateId + "\",updateDate=\""
				+ this.updateDate + "\",version=" + this.version
				+ "\",createId=\"" + this.createId + "\"";

	}

}
