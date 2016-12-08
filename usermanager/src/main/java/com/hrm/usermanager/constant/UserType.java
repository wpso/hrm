package com.hrm.usermanager.constant;

/**
 * 用户类型
 * ENTERPRISE_USER  企业用户
 * PERSONAL_USER    个人用户
 * @author Minggang
 *
 */
public enum UserType {
	
	UNKNOW_USER((short)0,"UNKNOW_TYPE","usertype.unknow"),
	ENTERPRISE_USER((short)1,"EntUser","usertype.enterprise"),
	PERSONAL_USER((short)2,"NorUser","usertype.personal");
 
	private short index;
	private String type;
	private String i18n;
	
	
	UserType(short index,String type,String i18n){
		
		this.index = index;
		this.type = type;
		this.i18n = i18n;
		
	}


	public short getIndex() {
		return index;
	}


	public void setIndex(short index) {
		this.index = index;
	}

	

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}


	public String getI18n() {
		return i18n;
	}


	public void setI18n(String i18n) {
		this.i18n = i18n;
	}
	
	public static UserType getItem(short index){
		
		for (UserType usertype:UserType.values()) {
			if(usertype.index==index){
				return usertype;
			}
		}
		
		return UserType.UNKNOW_USER;
		
	}

	

}
