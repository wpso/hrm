package com.web.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springside.modules.orm.Page;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.serializer.SerializerFeature;
//import com.hrm.usermanager.entity.Country;
//import com.hrm.usermanager.entity.Industry;
//import com.hrm.usermanager.entity.UserProfile;
//import com.hrm.usermanager.vo.AdminMenuVO;
import com.web.dao.PigeonMapper;
import com.web.dao.TerminalMapper;
import com.web.entity.AdminMenuVO;
import com.web.entity.MenuVO;
import com.web.entity.Pigeon;
import com.web.entity.QueryResult;
import com.web.entity.Role;
import com.web.entity.Terminal;
import com.web.entity.User;
import com.web.service.TerminalService;
import com.web.util.DBContextHolder;
import com.web.util.JSONUtil;

/**
 * 终端服务
 * 
 * @author gaopeng
 * @createtime 2016-03-03 23:00:57
 */
@Service
public class TerminalServiceImpl implements TerminalService {
	private Logger logger = Logger.getLogger(this.getClass());
	private SerializerFeature[] features = {
			SerializerFeature.WriteMapNullValue,
			SerializerFeature.WriteNullStringAsEmpty };
	@Autowired
	TerminalMapper terminalMapper;
	@Autowired
	PigeonMapper pigeonMapper;

	public String login(String parm) {
		Terminal dbtermianl = terminalMapper.selectByTid(parm);
		if (dbtermianl != null) {
			// int islogin = dbtermianl.getIslogin();
			// if(islogin==1){
			// //正在登录中
			// return JSONUtil.appendError("1", "登陆失败，此账号正在登录中。。",
			// JSONObject.toJSONString(new Terminal(), features));
			// }
			// logger.info(email + "登陆成功");
			return JSONUtil.appendError("0", "登陆成功",
					JSONObject.toJSONString(dbtermianl, features));
		}
		return JSONUtil.appendError("1", "登陆失败，没有此手机号码",
				JSONObject.toJSONString(new Terminal(), features));
	}

	/**
	 * 多查询
	 */
	public String queryByParm(String parm) {
		List<QueryResult> queryResultlist = terminalMapper.queryByParm(parm);
		String jsonstr = "";
		if (queryResultlist.size() < 1) {
			return JSONUtil.appendError("0", "查询成功", JSONArray.toJSONString(
					new ArrayList<QueryResult>(), features));
		}
		jsonstr = JSONArray.toJSONStringWithDateFormat(queryResultlist,
				"yyyy-MM-dd HH:mm:ss", features);
		return JSONUtil.appendError("0", "查询成功", jsonstr);
	}

	public String queryPigeonInfo() {
		DBContextHolder.setDBType(DBContextHolder.DATASOURCE_SQLSERVER);
		Pigeon pigeon = terminalMapper.selectPigeonInfo();
		if (pigeon == null) {
			return JSONUtil.appendError("0", "查询成功!", "{}");
		}
		DBContextHolder.setDBType(DBContextHolder.DATASOURCE_MYSQL);
		String info = JSONUtil.appendError("0", "查询成功!",
				JSONObject.toJSONString(pigeon));
		return info;
	}

	public String adminPush(Pigeon pigeon, String tid) {
		Pigeon dbpigeon = pigeonMapper.selectByPrimaryKey(pigeon.getId());
		if (dbpigeon != null) {
			return JSONUtil.appendError("1", "发送失败，编号" + pigeon.getId()
					+ "鸽子已存在！", "");
		}
		try {
			int result = pigeonMapper.insertSelective(pigeon);
			Map<String, String> map = new HashMap<String, String>();
			map.put("pid", pigeon.getId());
			map.put("tid", tid);
			int insertresult = terminalMapper.insert_pigeon_terminal(map);
			insertresult = 0;
			if (result != 1 || insertresult != 1) {
				// throw new Exception("失败了啊");
			}
		} catch (Exception e) {

			throw new RuntimeException();

		}

		return JSONUtil.appendError("0", "保存成功！", "");
	}

	public String confirmation(String tid) {
		int result = 0;
		Terminal terminal = new Terminal();
		terminal.setId(tid);
		terminal.setStatus(0);
		result = terminalMapper.updateByPrimaryKeySelective(terminal);
		if (result == 1) {
			return JSONUtil.appendError("0", "成功!", "");
		}

		return JSONUtil.appendError("1", "未知错误，失败。请重试!", "");
	}

	@Transactional
	public String getAdminMenu(String parentId) {
		String ids = "";
		Map<String, AdminMenuVO> toolMap = new HashMap<String, AdminMenuVO>();
		List<AdminMenuVO> list = terminalMapper.getAdminMenu(parentId);
		if (parentId.equals('0')) {
			return JSONArray.toJSONString(list);
		}
		for (AdminMenuVO adminMenuVO : list) {
			ids += adminMenuVO.getId() + ",";
			toolMap.put(adminMenuVO.getId(), adminMenuVO);
		}
		if (StringUtils.isNotBlank(ids)) {
			ids = ids.substring(0, ids.length() - 1);
			AdminMenuVO parent = null;
			List<AdminMenuVO> childList = terminalMapper.getAdminMenu(ids);
			for (AdminMenuVO adminMenuVO : childList) {
				if (toolMap.containsKey(adminMenuVO.getParentId())) {
					parent = toolMap.get(adminMenuVO.getParentId());
					parent.getChildrenList().add(adminMenuVO);
				}
			}
		}
		return JSONArray.toJSONString(list);

	}
	
	public String getMenuStore(String roleId) {
		List<MenuVO> list = terminalMapper.getMenuStore(roleId);
		return JSONArray.toJSONString(list);

	}

	public String getAllUserByPage(String parm) {
		// List<User> user_list = terminalMapper.getAllUserByPage(parm);
		List<User> user_list = null;
		List<User> filtered_user_list = new ArrayList<User>();
		// for (User user : user_list) {
		// User filtered_user = user;
		// // filtered_user.setPassword(null);
		// filtered_user_list.add(filtered_user);
		// if (user.getUserProfile() == null) {
		// UserProfile userProfile = new UserProfile();
		// Country country = new Country();
		// country.setId(1l);
		// userProfile.setCountry(country);
		// Industry industry = new Industry();
		// industry.setId(1l);
		// userProfile.setIndustry(industry);
		// user.setUserProfile(userProfile);
		//
		// }
		// }
		// user_list.setResult(filtered_user_list);
		return JSONArray.toJSONString(user_list);
	}

	public String loadCountry(String parm) {
		// TODO Auto-generated method stub
		return null;
	}

	public String loadRegion(String parm) {
		// TODO Auto-generated method stub
		return null;
	}

	public String findRelatedBrandByDomainId(String parm) {
		// TODO Auto-generated method stub
		return null;
	}

	public String loadIndustry(String parm) {
		// TODO Auto-generated method stub
		return null;
	}

	public List<Role> getPageRole(int start, int limit,String query) {
		// TODO Auto-generated method stub
		return terminalMapper.getPageRole(start,limit,query);
	}

	public List<Role> getAllRole(String query) {
		// TODO Auto-generated method stub
		return terminalMapper.getAllRole(query);
		
	}

	public boolean findAdminRole(String name) {
		// TODO Auto-generated method stub
		Role role = terminalMapper.findAdminRole(name);
		if(role!=null){
			return true;
		}
		else{
			return false;
		}
	}

	public void addAdminRole(String name) {
		// TODO Auto-generated method stub
		terminalMapper.addAdminRole(name);
	}

	public void deleteAdminRole(long roleId) {
		// TODO Auto-generated method stub
		terminalMapper.deleteAdminRole(roleId);
	}
}
