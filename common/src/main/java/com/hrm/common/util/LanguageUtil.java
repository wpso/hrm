package com.hrm.common.util;

import java.util.Locale;
import java.util.ResourceBundle;

public class LanguageUtil {
	/**
	 * 本机默认语言
	 */
	private static ResourceBundle bundle = ResourceBundle.getBundle("ApplicationResources");

	/**
	 * 获取key对应默认语言的value
	 * @param key
	 * @return
	 */
	public static String getString(String key){
		return bundle.getString(key);
	}
	
	public static String getString(String key,Locale locale){
		ResourceBundle bundle = ResourceBundle.getBundle("ApplicationResources",locale);
		return bundle.getString(key);
	}
}
