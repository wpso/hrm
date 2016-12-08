/**
 * @title Role.java
 * @package com.ttcloud.crm.usermanager.entity
 * @description 用一句话描述该文件做什么
 * @author guole.liang
 * @update 2012-5-9 下午4:14:43
 * @version V1.1
 */
package com.web.entity;

import java.sql.Timestamp;

/**
 * @description 这里用一句话描述这个类的作用
 * @version 1.1
 * @author guole.liang
 * @update 2012-5-9 下午4:14:43
 */
public class Role {
	private String id;//各资源表id ,如 vm usergroup menu 的id
    private String name;
    private Timestamp create_date;
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

	public Timestamp getCreate_date() {
		return create_date;
	}

	public void setCreate_date(Timestamp create_date) {
		this.create_date = create_date;
	}

	private String code;
	
	//0表示其他，1是前台初始角色，2是后台初始角色
	private int status = 0;

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	@Override
	public String toString() {

		return "Role[" + super.toString() + ",name=\""+this.name+",create_time=\""+this.create_date+",code=\"" + this.code + "\"" + ",status=\"" + this.status + "\"]";

	}

}
