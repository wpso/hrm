package com.hrm.common.util;

import java.security.MessageDigest;

import org.apache.log4j.Logger;

public class MD5Util {

	private static Logger log = Logger.getLogger(MD5Util.class);
	
	public static String getMD5Str(String str) {
		try {
			MessageDigest messageDigest = MessageDigest.getInstance("MD5");
			messageDigest.reset();
			messageDigest.update(str.getBytes("UTF-8"));
			
			byte[] byteArray = messageDigest.digest();
			StringBuffer md5StrBuff = new StringBuffer();
			for (int i = 0; i < byteArray.length; i++) {
				if (Integer.toHexString(0xFF & byteArray[i]).length() == 1){
					md5StrBuff.append("0").append(Integer.toHexString(0xFF & byteArray[i]));
				}else{
					md5StrBuff.append(Integer.toHexString(0xFF & byteArray[i]));
				}
			}
			//log.info("加密前为：<"+str+"> 加密后为：< "+md5StrBuff.toString()+">");
			return md5StrBuff.toString();
        } catch (Exception e) {
        	log.error(e.getMessage(), e); 
        }
        return str ;
	}

}
