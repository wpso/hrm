package com.web.controller;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.codehaus.jackson.type.TypeReference;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springside.modules.orm.Page;

import com.alibaba.fastjson.JSONArray;
import com.hrm.common.util.Constants;
import com.hrm.common.dao.TTCloudAction;
//import com.hrm.usermanager.service.UserService;
import com.web.entity.Pigeon;
import com.web.entity.Role;
import com.web.service.TerminalService;

@Controller
@RequestMapping("/admin")
public class TerminalController {
	
	private Page<Role> pageRole = new Page<Role>(Constants.PAGE_NUM);
	private int start;
	public int getStart() {
		return start;
	}

	public void setStart(int start) {
		this.start = start;
	}
	private int limit;
	private int page;
	private String query;// 模糊查询条件
	
	int type;
	
	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	public String getQuery() {
		return query;
	}

	public void setQuery(String query) {
		this.query = query.replace(" ", "");
	}

	public int getLimit() {
		return limit;
	}

	public void setLimit(int limit) {
		this.limit = limit;
	}

	public int getPage() {
		return page;
	}

	public void setPage(int page) {
		this.page = page;
	}

	public Page<Role> getPageRole() {
		return pageRole;
	}

	public void setPageRole(Page<Role> pageRole) {
		this.pageRole = pageRole;
	}
	@Autowired
	private TerminalService terminalService;
//	private UserService userService;
	/**
	 * 登陆
	 * @param telphone 手机号
	 * @param registerid 推送标识
	 * @return {"error":"1","message":"登陆失败，没有此手机号码","data":{"channelid":"","id":"","isadmin":0,"password":"","status":0}}
	 */
	@RequestMapping("/login")
	@ResponseBody
	public String login(String parm){
		return terminalService.login(parm);
	}
	/**
	 * 管理员功能
	 * @param parm
	 * @return
	 */
	@RequestMapping("/getAdminMenu")
	@ResponseBody
	public String getAdminMenu(String parm){
		return terminalService.getAdminMenu(parm);
	}
	
	/**
	 * 管理员功能
	 * @param parm
	 * @return
	 */
	@RequestMapping("/getMenuStore")
	@ResponseBody
	public String getMenuStore(String parm){
		return terminalService.getMenuStore(parm);
	}
	
	/**
	 * 管理员功能
	 * @param parm
	 * @return
	 */
	@RequestMapping("/getAllRole")
	@ResponseBody
	public String getAllRole(int start, int limit, String query){
		try {
			if (!StringUtils.isEmpty(query)) { // 如果查询框不为空时，进入模糊查询
				query = new String(query.getBytes("iso8859_1"), "UTF-8");
			}
			List<Role> total = terminalService.getAllRole(query);
			List<Role> result = terminalService.getPageRole(start,limit,query);
			//为了分页，要加上start,limit,totalProperty,下面的符合json数据的形式  
//			String jsonString = "{start:"+start+",limit:"+limit+",totalProperty:"+totalProperty+",newsList:"+jsonStr+"}";
		    String jsonString = JSONArray.toJSONString(result);  
			return "{totalProperty:"+total.size()+",RoleList:"+jsonString+"}";
//			fillActionResult(pageRole);
	//		facade.insertOperationLog(admin, "分页显示角色，不返回角色的权限",
		//			"分页显示角色，不返回角色的权限", Constants.RESULT_SUCESS);
		} catch (Exception e) {
			System.out.print(e);
			//facade.insertOperationLog(admin,
				//	"分页显示角色，不返回角色的权限错误:" + e.getMessage(), "分页显示角色，不返回角色的权限",
					//Constants.RESULT_FAILURE);
//			throw new TTCloudException("A007", "page异常", logger, e);
		}
		return "";
	}

	/**
	 * 管理员功能
	 * @param parm
	 * @return
	 */
	@RequestMapping("/addAdminRole")
	@ResponseBody
	public String addAdminMenu(String name){
		try{
			if(terminalService.findAdminRole(name)){
				return "exist";
			}
			else{
				terminalService.addAdminRole(name);
				return "success";
			}
		}
		catch(Exception e){
			
		}
		return "";
	}
	

	/**
	 * 管理员功能
	 * @param parm
	 * @return
	 */
	@RequestMapping("/deleteAdminRole")
	@ResponseBody
	public String deleteAdminMenu(long roleId){
		try{
			// 企业用户或系统用户无法删除
			if (roleId == Constants.Role_Enterprise_ID
					|| roleId == Constants.Role_SYSTEM_ADMIN_ID) {
				return "false";
			}
			terminalService.deleteAdminRole(roleId);
			return "true";
		}
		catch(Exception e){
			System.out.println(e);
		}
		return "";
	}

	
	@RequestMapping("/getAllUserByPage")
	@ResponseBody
	public String getAllUserByPage(String parm){
		return terminalService.getAllUserByPage(parm);
	}
	
	@RequestMapping("/loadCountry")
	@ResponseBody
	public String loadCountry(String parm){
		String list = terminalService.loadCountry(parm);
		return list;
	}
	
	@RequestMapping("/loadRegion")
	@ResponseBody
	public String loadRegion(String parm){
		String list = terminalService.loadRegion(parm);
		return list;
	}
	
	@RequestMapping("/findRelatedBrandByDomainId")
	@ResponseBody
	public String findRelatedBrandByDomainId(String parm){
		String list = terminalService.findRelatedBrandByDomainId(parm);
		return list;
	}
	
	@RequestMapping("/loadIndustry")
	@ResponseBody
	public String loadIndustry(String parm){
		String list = terminalService.loadIndustry(parm);
		return list;
	}
	
	@RequestMapping("/loadDomain")
	@ResponseBody
	public String loadDomain(String parm){
		String list = terminalService.getAdminMenu(parm);
		return list;
	}
	
	/**
	 * 多查询
	 * @param parm
	 * @return List<QueryResult>
	 */
	@RequestMapping("/query")
	@ResponseBody
	public String query(String parm){
		String result = terminalService.queryByParm(parm);
		return result;
	}

	/**
	 * 管理员推送
	 * @param pigeon 鸽子信息
	 * @return
	 */
	@RequestMapping("/push")
	@ResponseBody
	public String adminpush(Pigeon pigeon,String tid){
		return terminalService.adminPush(pigeon,tid);
	}
	
	/**
	 * 确定按钮（终端）更新终端状态 = 空闲
	 * @param tid
	 * @return
	 */
	@RequestMapping("/confirmation")
	@ResponseBody
	public String confirmation(String tid){
		return terminalService.confirmation(tid);
	}
	
	
	@RequestMapping("/getPigeonInfo")
	@ResponseBody
	public String test(){
		return terminalService.queryPigeonInfo();
	}
	
}
