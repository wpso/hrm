package com.hrm.common.util;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.commons.lang.StringUtils;

public class TTCloudDateUtil {
	/**
	 * <按照一定格式把日期转化为字符串> <如果格式为空默认为yyyy-MM-dd HH:mm:ss 如果日期为空默认为new Date()>
	 * @param pattern
	 * @param parsedDate
	 * @return
	 * @see [类、类#方法、类#成员]
	 */
	public static String transferDate2Str(String pattern, Date parsedDate) {
		if (parsedDate == null) {
			parsedDate = new Date();
		}
		SimpleDateFormat sf = new SimpleDateFormat(
				"yyyy-MM-dd HH:mm:ss");
		if (StringUtils.isNotBlank(pattern)) {
			sf = new SimpleDateFormat(pattern);
		}
		String result = sf.format(parsedDate);

		return result;
	}
	
	/**
	 * <按照一定格式把日期转化为字符串> <如果格式为空默认为yyyy-MM-dd HH:mm:ss 如果日期为空默认为new Date()>
	 * @param pattern
	 * @param parsedDate
	 * @return
	 * @see [类、类#方法、类#成员]
	 */
	public static String transferDate2Str(Date parsedDate) {
		if (parsedDate == null) {
			parsedDate = new Date();
		}
		SimpleDateFormat sf = new SimpleDateFormat(
				"yyyy-MM-dd HH:mm:ss");
		String result = sf.format(parsedDate);

		return result;
	}

	/**
	 * <字符串转化为日期> <如果格式为空默认为yyyy-MM-dd HH:mm:ss>
	 * 
	 * @param pattern
	 * @param dateStr
	 * @return
	 * @throws Exception
	 * @see [类、类#方法、类#成员]
	 */
	public static Date transferStr2Date(String pattern, String dateStr)
			throws Exception {
		SimpleDateFormat sf = new SimpleDateFormat(
				"yyyy-MM-dd HH:mm:ss");
		if (StringUtils.isNotBlank(pattern)) {
			sf = new SimpleDateFormat(pattern);
		}
		Date result = sf.parse(dateStr);

		return result;
	}

	/**
	 * <把当前日期转化为字符串形式为yyyy-MM-dd HH:mm:ss> <功能详细描述>
	 * 
	 * @return
	 * @see [类、类#方法、类#成员]
	 */
	public static String getNowStr() {
		SimpleDateFormat sf = new SimpleDateFormat(
				"yyyy-MM-dd HH:mm:ss");
		return sf.format(new Date());
	}

	/**
	 * <按照一定格式把当前日期转化为字符串> <功能详细描述>
	 * 
	 * @param pattern
	 * @return
	 * @see [类、类#方法、类#成员]
	 */
	public static String getNowStr(String pattern) {
		SimpleDateFormat sf = new SimpleDateFormat(pattern);
		return sf.format(new Date());
	}
}
