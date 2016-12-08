package com.web.service;

import java.util.List;

import org.springside.modules.orm.Page;

import com.web.entity.Pigeon;
import com.web.entity.Role;

public interface TerminalService {
	//登陆
	String login(String parm);
	//登陆
	String getAdminMenu(String parm);
	
	String getMenuStore(String parm);
	
	List<Role> getPageRole(int start, int limit, String query);
	
	List<Role> getAllRole(String query);

	//登陆
	String getAllUserByPage(String parm);

	//登陆
	String loadCountry(String parm);
	
	//登陆
	String loadRegion(String parm);
	
	//登陆
	String findRelatedBrandByDomainId(String parm);
	
	//登陆
	String loadIndustry(String parm);
	
	
	//查询
	String queryByParm(String parm);
	
	String queryPigeonInfo();
	//管理员推送
	String adminPush(Pigeon pigeon,String tid);
	//确认按钮（终端）
	String confirmation(String tid);
	boolean findAdminRole(String name);
	void addAdminRole(String name);
	void deleteAdminRole(long roleId);
		
	
}
