package com.web.entity;

import com.hrm.common.util.Constants;
//import com.hrm.usermanager.entity.AbstractUser;
//import com.hrm.usermanager.entity.Domain;
//import com.hrm.usermanager.entity.UserProfile;

/**
 * @description user entity
 * @version 1.0
 * @author guole.liang
 * @update 2012-3-29 下午1:38:59
 */
public class User {

	private String user_type;//用户类型
	private String telephone;//手机号码
	private short online_status = (short) 0;
//	private UserProfile userProfile;
	private String user_source;//用户来源
	private String level=Constants.DEFULT_BRAND_CODE;// 用户级别
	private int specialFlag;//特殊用户标识：0-普通；1-特殊
//	private Domain domain;
	private String private_key;
	private long id;
	private String name;
	private String password;
	

	public String getUser_type() {
		return user_type;
	}

	public void setUser_type(String user_type) {
		this.user_type = user_type;
	}

	public short getOnline_status() {
		return online_status;
	}

	public void setOnline_status(short online_status) {
		this.online_status = online_status;
	}

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

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public short getOnlineStatus() {
		return online_status;
	}

	public void setOnlineStatus(short onlineStatus) {
		this.online_status = onlineStatus;
	}

//	public UserProfile getUserProfile() {
//		return userProfile;
//	}
//
//	public void setUserProfile(UserProfile userProfile) {
//		this.userProfile = userProfile;
//	}

	public String getUserType() {
		return user_type;
	}

	public void setUserType(String userType) {
		this.user_type = userType;
	}

	public String getTelephone() {
		return telephone;
	}

	public void setTelephone(String telephone) {
		this.telephone = telephone;
	}

	public String getLevel() {
		return level;
	}

	public void setLevel(String level) {
		this.level = level;
	}
	
	public int getSpecialFlag() {
		return specialFlag;
	}

	public void setSpecialFlag(int specialFlag) {
		this.specialFlag = specialFlag;
	}

	public User(long id, String name) {
		this.id=id;
		this.name=name;
	}

//	public Domain getDomain() {
//		return domain;
//	}
//
//	public void setDomain(Domain domain) {
//		this.domain = domain;
//	}
	public User() {

	}

	public User(long id) {
		this.id=id;
	}

	public long getCurrentUserId() {
		return id;
	}

	public String getUser_source() {
		return user_source;
	}

	public void setUser_source(String user_source) {
		this.user_source = user_source;
	}
	
	

	public String getPrivate_key() {
		return private_key;
	}

	public void setPrivate_key(String private_key) {
		this.private_key = private_key;
	}

	@Override
	public String toString() {
		return "User [userType=" + user_type + ", telephone=" + telephone
				+ ", onlineStatus=" + online_status + ", userProfile="
				+ "" + ", user_source=" + user_source + ", level="
				+ level + ", specialFlag=" + specialFlag + ", domain=" + ""
				+ "]";
	}

}