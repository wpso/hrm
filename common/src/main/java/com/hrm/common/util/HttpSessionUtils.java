// $Id: com.vianet.sceportal.common.util.HttpSessionUtils  May 11, 2014 6:05:18 PM  Invisiller King
package com.hrm.common.util;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;


/**
 * @fileName       HttpSessionUtils.java
 * @description    用于保存session会话期间之内用户登录成功之后的User信息,实现Controller,Service,Dao层纵向直接调用,
 *                 无需横向一层一层传参数,实现层与层之间的松耦合
 * @author         zz
 * @since          1.0
 * @createTime     May 11, 2014 6:05:18 PM
 */
public class HttpSessionUtils {

	private static final ThreadLocal<HttpSession> SESSION_MAP = new ThreadLocal<HttpSession>();
//	private static final ThreadLocal<Map<String,Object>> SESSION_MAPS = new ThreadLocal<Map<String,Object>>();

	/**
	 * 为当前线程的attribute存放object,一般放"User"和User对象.
	 *
	 * @param attribute  属性名称
	 * @param value  属性值
	 */
	public static void set(String attribute, Object value) {
		HttpSession threadLocalSession = SESSION_MAP.get();
		threadLocalSession.setAttribute(attribute, value);
	}
	
	public static void set(HttpSession httpSession){
		SESSION_MAP.set(httpSession);
	}
	
//	public static void set(String name, Object obj){
//		Map<String,Object> map = new HashMap<String, Object>();
//		map.put(name, obj);
//		SESSION_MAPS.set(map);
//	}
	

	/**
	 * 为当前线程的attribute存放object,一般放"User"和User对象.
	 *
	 * @param attribute  属性名称
	 * @param value  属性值
	 */
	public static void set(String attribute, Object value, HttpServletRequest request) {
//		HttpSession threadLocalSession = SESSION_MAP.get();
//		if (threadLocalSession == null) {
			HttpSession requestSession = request.getSession();
			requestSession.setAttribute(attribute, value);
			SESSION_MAP.set(requestSession);
//		}
//		else {
//			threadLocalSession.setAttribute(attribute, value);
//			SESSION_MAP.set(threadLocalSession);
//		}
	}

	/**
	 * 获得线程中保存的属性,一般放"User"和User对象.
	 *
	 * @param attribute  属性名称
	 * @return 属性对象
	 */
	public static Object get(String attribute) {
		HttpSession httpSession = SESSION_MAP.get();
		return httpSession.getAttribute(attribute);
	}
	
//	public static Object get(String name){
//		return SESSION_MAP.get();
//	}
	
	public static HttpSession get(){
		return SESSION_MAP.get();
	}
	

	/**
	 * 获得线程中保存的属性.
	 *
	 * @param attribute  属性名称
	 * @param clazz  类型
	 * @param <T>  自动转型
	 * @return 属性值
	 */
	@SuppressWarnings("unchecked")
	public static <T> T get(String attribute, Class<T> clazz) {
		return (T) get(attribute);
	}

	/**
	 * 删除当前线程局部变量的值.
	 */
	public static void remove(HttpServletRequest request) {
		//request.getSession().invalidate();
		SESSION_MAP.remove();
	}

	/**
	 * 删除当前线程局部变量的值.
	 */
	public static void remove() {
		SESSION_MAP.remove();
	}
	
//	public static void remove(){
//		SESSION_MAPS.remove();
//	}
	

}