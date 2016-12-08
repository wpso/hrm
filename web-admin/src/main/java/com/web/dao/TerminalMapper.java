package com.web.dao;

import java.util.List;
import java.util.Map;

import org.springside.modules.orm.Page;

import com.web.entity.AdminMenuVO;
import com.web.entity.MenuVO;
import com.web.entity.Pigeon;
import com.web.entity.QueryResult;
import com.web.entity.Role;
import com.web.entity.Terminal;
import com.web.entity.User;

public interface TerminalMapper {
	
	Terminal selectByTid(String parm);//登陆 id手机号码
	
	List<AdminMenuVO> getAdminMenu(String parm);
	
	List<MenuVO> getMenuStore(String parm);
	
	List<Role> findPage(String parm);
	
	List<Role> getPageRole(int start,int limit, String query);
	
	List<Role> getAllRole(String query);
	
	List<User> getAllUserByPage(String parm);
	
	int updateByPrimaryKeySelective(Terminal Terminal);
	
	//输入鸽子编号，点击查询得到所有推送的设备编号及接收状态
	List<QueryResult> queryByParm(String parm);
	
	int insert_pigeon_terminal(Map<String,String> map);
	
	Pigeon selectPigeonInfo();
	
	List<Terminal> selectUserList();

	void addAdminRole(String name);

	Role findAdminRole(String name);

	void deleteAdminRole(long roleId);
}
