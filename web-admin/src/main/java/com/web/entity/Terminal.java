/**
 * 
 */
package com.web.entity;

import java.io.Serializable;

import com.alibaba.fastjson.annotation.JSONField;

/**
 * @author gaopeng
 * @createtime 2016-03-03 12:34:25
 */
public class Terminal implements Serializable {
	/**
	 * 终端实体
	 */
	private static final long serialVersionUID = -7727645087633955105L;
	private String id;
	private String password;
	private int status;
	private String channelid;
	private int isadmin;
	private int islogin;
//	private List<Pigeon> pigeonList;
	
	
	
	

	public String getChannelid() {
		return channelid;
	}
	@JSONField(serialize=false)
	public int getIslogin() {
		return islogin;
	}
	public void setIslogin(int islogin) {
		this.islogin = islogin;
	}
	public int getIsadmin() {
		return isadmin;
	}
	public void setIsadmin(int isadmin) {
		this.isadmin = isadmin;
	}
	public void setChannelid(String channelid) {
		this.channelid = channelid;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public int getStatus() {
		return status;
	}
	public void setStatus(int status) {
		this.status = status;
	}
	@Override
	public String toString() {
		return "Terminal [id=" + id + ", password=" + password + ", status="
				+ status + ", channelid=" + channelid + "]";
	}

	
	
	
	
}
