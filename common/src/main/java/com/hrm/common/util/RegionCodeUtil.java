package com.hrm.common.util;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
/**
 * 获取当前用户region code
 * @author jianwei zhang
 *
 */
public class RegionCodeUtil {
	private static final ThreadLocal<String> regionMap = new ThreadLocal<String>();
	private static Logger logger = Logger.getLogger(RegionCodeUtil.class);
	
	public static String getRegionCode(){
		String  regionCode = null;
		HttpSession session = (HttpSession) HttpSessionUtils.get();
		if(session!=null){
			Object obj = session.getAttribute(Constants.LOGIN_CURRENTUSER);
			if(null != obj ){
				regionCode = session.getAttribute("regionCode").toString();
			}
		}else{
			regionCode = regionMap.get();
		}
		logger.debug("--------RegionCodeUtil--->getRegionCode: "+regionCode);
		return regionCode;
	}
	
	
	public static void setRegionCode(String regionCode){
		logger.debug("--------RegionCodeUtil--->setRegionCode: "+regionCode);
		HttpSession session = (HttpSession) HttpSessionUtils.get();
		if(session!=null){
			Object obj = session.getAttribute(Constants.LOGIN_CURRENTUSER);
			if(null != obj){
				session.setAttribute("regionCode", regionCode);
			}
		}
		regionMap.set(regionCode);
	}
	
	public static void removeRegionCode(){
		logger.debug("--------RegionCodeUtil--->removeRegionCode");
		regionMap.remove();
	}

}
