package com.hrm.common.util;

import java.text.MessageFormat;
import java.util.Locale;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springside.modules.web.struts2.Struts2Utils;

import com.opensymphony.xwork2.ActionInvocation;
import com.hrm.common.vo.ActionResult;




public class TTCloudException extends RuntimeException{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -149395889164377020L;

	private String code;
	
	public TTCloudException() {}
	/**
	 * 后台打印code并向上传递code
	 * @param code
	 * @param logger
	 */
	public TTCloudException(String code, Logger logger) {
		super(code);
		this.code = code;
		logger.error(code, this);
	}
	/**
	 * 后台打印message，向上传递code
	 * @param code
	 * @param message
	 * @param logger
	 */
	public TTCloudException(String code,String message, Logger logger) {
		super(message);
		this.code = code;
	}
	
	public TTCloudException(String message) {
		super(message);
	}
	
	public TTCloudException(String message, Exception ex) {
		super(message, ex);
	}
	
	public TTCloudException(String code, Logger logger, Exception ex) {
		super(code, ex);
		if(!(ex instanceof  TTCloudException)){
			this.code = code;
		} else {
			this.code = ((TTCloudException)ex).getCode();
		}
	}
	
	public TTCloudException(String code, String message, Logger logger, Exception ex) {
		super(message, ex);
		if(!(ex instanceof  TTCloudException)){
			this.code = code;
		} else {
			this.code = ((TTCloudException)ex).getCode();
			
		}
	}
	
	public TTCloudException(String code, String message, Exception ex) {
		super(message, ex);
		if(!(ex instanceof  TTCloudException)){
			this.code = code;
		} else {
			this.code = ((TTCloudException)ex).getCode();
			
		}
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}
	
	public static void  renderTTCloudException(Logger logger,TTCloudException te,ActionInvocation actionInvocation){
		logger.error("TTCLOUD_ERROR_MESSAGE:"+te.getMessage());
		logger.error("TTCLOUD_ERROR_STACK:",te);
		String code = te.getCode() ;
		String msg = te.getMessage() ;
		ActionResult actionResult = new ActionResult() ;
		actionResult.setSuccess(false);
		actionResult.setResultCode(code);
		if(StringUtils.isBlank(code)){
			actionResult.setResultMsg(msg);
		}else{
			formatCode(logger,actionInvocation, actionResult);
		}
		actionResult.setResultObject(te.getMessage());
		Struts2Utils.renderJson(actionResult);
	}
	
	public static void  renderException(Logger logger,Exception ex,ActionInvocation actionInvocation){
		logger.error("ERROR_MESSAGE:"+ex.getMessage());
		logger.error("ERROR_STACK:"+ex,ex);
		ActionResult actionResult = new ActionResult() ;
		actionResult.setSuccess(false);
		actionResult.setResultMsg("系统异常，请联系管理员！");
		actionResult.setResultObject(ex.getMessage());
		Struts2Utils.renderJson(actionResult);

	}
	public static void formatCode(Logger logger,ActionInvocation actionInvocation,ActionResult actionResult){
		try {
			String code = actionResult.getResultCode() ;
			String msg = actionResult.getResultMsg() ;
			Locale local = actionInvocation.getInvocationContext().getLocale();
			String m = LanguageUtil.getString(code, local);
			if(null != msg && !"".equals(msg)){
				msg = MessageFormat.format(m, new Object[]{msg});
			}else{
				msg = m;
			}
			logger.debug("msg=" + msg);
			actionResult.setResultMsg(msg);
		} catch (Exception e) {
			logger.error(e.getMessage(),e);
		}
	}
	
	
}
