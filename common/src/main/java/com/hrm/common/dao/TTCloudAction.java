/**
 * @title ttcloudAction.java
 * @package com.ttcloud.common
 * @description 统一接口的Action类
 * @author AaronFeng
 * @update 2012-4-19 上午 11:13:19
 * @version V1.0
 */
package com.hrm.common.dao;

import java.util.List;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.apache.log4j.Logger;
import org.apache.struts2.ServletActionContext;
import com.hrm.common.util.Constants;
import com.hrm.common.util.TTCloudException;
import com.hrm.common.vo.ActionResult;
import com.opensymphony.xwork2.ActionSupport;

/**
 * @description 用来统一处理一般性问题，如获取登录用户，返回统一的结果对像
 * @version 1.0
 * @author AaronFeng
 * @update 2012-4-19 上午 11:13:19
 */
public abstract class TTCloudAction extends ActionSupport {
	
	private ActionResult actionResult = new ActionResult();
	
	private List<Object> primKeys = null;

	/**
	 * @return actionResult : return the property actionResult.
	 */
	public ActionResult getActionResult() {
		return actionResult;
	}

	/**
	 * @param actionResult
	 *            : set the property actionResult.
	 */
	public void setActionResult(ActionResult actionResult) {
		this.actionResult = actionResult;
	}
	

	public List<Object> getPrimKeys() {
		return primKeys;
	}

	public void setPrimKeys(List<Object> primKeys) {
		this.primKeys = primKeys;
	}	


	protected HttpServletRequest getRequest(){
		return (HttpServletRequest)ServletActionContext.getRequest(); 
	}

	protected HttpServletResponse getResponse(){
		return (HttpServletResponse)ServletActionContext.getResponse(); 
	}
	
	protected HttpSession getSession(){
		return (HttpSession)ServletActionContext.getRequest().getSession();
	}
	
	protected ServletContext getApplication(){
		return (ServletContext)ServletActionContext.getServletContext();
	}
	
	protected Object getCurrentLoginUser() {
		return this.getSession().getAttribute(Constants.LOGIN_CURRENTUSER);
	}
	
	public void fillActionResult(String resultCode) {
		this.actionResult.setResultCode(resultCode);
	}

	public void fillActionResult(String resultCode,String resultMsg) {
		this.actionResult.setResultCode(resultCode);
		this.actionResult.setResultMsg(resultMsg);
	}
	
	public void fillActionResult(Object resultObject) {
		this.actionResult.setResultObject(resultObject);
	}

	public void fillActionResult(String resultCode, String resultMsg,
			Object resultObject) {
		this.actionResult.setResultCode(resultCode);
		this.actionResult.setResultMsg(resultMsg);
		this.actionResult.setResultObject(resultObject);
	}

}
