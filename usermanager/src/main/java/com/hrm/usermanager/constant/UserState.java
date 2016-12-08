package com.hrm.usermanager.constant;

/**
 * 用户状态
 * CREATE   创建
 * ACTIVE   激活
 * FREEZE   冻结
 * APPROVED 审批通过
 * DELETED  删除
 * @author Minggang
 *
 */
public enum UserState {
	
	CREATE((short)0,"CREATE","userstate.create"),
	ACTIVE((short)1,"ACTIVE","userstate.active"),
	FREEZE((short)2,"FREEZE","userstate.freeze"),
	APPROVED((short)3,"APPROVED","userstate.approved"),
	UNKNOW_STATE((short)4,"UNKNOW_STATE","usertype.unknow"),
	DELETED((short)5,"DELETE","userstate.deleted");
	
	private short index;
	private String type;
	private String i18n;
	
	UserState(short index,String type,String i18n){
		
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
	
	
	

}
