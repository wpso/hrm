/**
 * 
 */
package com.web.entity;

import java.io.Serializable;
import java.util.List;

import com.alibaba.fastjson.annotation.JSONField;

/**
 * @author gaopeng
 * @createtime 2016-03-03 12:01:17
 */
public class Pigeon implements Serializable {

	/**
	 * 鸽子实体
	 */
	private static final long serialVersionUID = 3531493718784107015L;
	
	private String id;
	private String name;
	private String location;
	private String cage;
	private int status;
	private List<Terminal> terminalList;
	private int version;
	
	
	@JSONField(serialize=false)
	public int getVersion() {
		return version;
	}
	public void setVersion(int version) {
		this.version = version;
	}
	@JSONField(serialize=false)
	public List<Terminal> getTerminalList() {
		return terminalList;
	}
	public void setTerminalList(List<Terminal> terminalList) {
		this.terminalList = terminalList;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getLocation() {
		return location;
	}
	public void setLocation(String location) {
		this.location = location;
	}
	public String getCage() {
		return cage;
	}
	public void setCage(String cage) {
		this.cage = cage;
	}
	public int getStatus() {
		return status;
	}
	public void setStatus(int status) {
		this.status = status;
	}
	
	@Override
	public String toString() {
		return "Pigeon [id=" + id + ", name=" + name + ", location=" + location
				+ ", cage=" + cage + ", status=" + status + "]";
	}
	
	
	
}
