/**
 * @title ActionResult.java
 * @package com.ttcloud.common.util
 * @description 统一返回结果类
 * @author AaronFeng
 * @update 2012-4-19 上午 11:21:42
 * @version V1.0
 */
package com.hrm.common.vo;

/**
 * @description 封装通用的结果属性
 * @version 1.0
 * @author AaronFeng
 * @update 2012-4-19 上午 11:21:42
 */
public class ActionResult {
	//是否操作成功
	private boolean success = true;
	
	//返回结果代码
	private String resultCode;
	
	//返回结果描述
	private String resultMsg;
	
	//返回结果对像
	private Object resultObject;
	/**
	 * @return success : return the property success.
	 */
	public boolean isSuccess() {
		return success;
	}
	/**
	 * @param success : set the property success.
	 */
	public void setSuccess(boolean success) {
		this.success = success;
	}
	/**
	 * @return resultCode : return the property resultCode.
	 */
	public String getResultCode() {
		return resultCode;
	}
	/**
	 * @param resultCode : set the property resultCode.
	 */
	public void setResultCode(String resultCode) {
		this.resultCode = resultCode;
	}
	/**
	 * @return resultMsg : return the property resultMsg.
	 */
	public String getResultMsg() {
		return resultMsg;
	}
	/**
	 * @param resultMsg : set the property resultMsg.
	 */
	public void setResultMsg(String resultMsg) {
		this.resultMsg = resultMsg;
	}
		
	/**
	 * @return resultObject : return the property resultObject.
	 */
	public Object getResultObject() {
		return resultObject;
	}
	/**
	 * @param resultObject : set the property resultObject.
	 */
	public void setResultObject(Object resultObject) {
		this.resultObject = resultObject;
	}
	/* (非 Javadoc) 
	 * <p>Title: toString</p> 
	 * <p>Description: </p> 
	 * @return 
	 * @see java.lang.Object#toString() 
	 */
	@Override
	public String toString() {
		return "ActionResult [success=" + success + ", resultCode="
				+ resultCode + ", resultMsg=" + resultMsg + ", resultObject="
				+ resultObject + "]";
	}
	
}
