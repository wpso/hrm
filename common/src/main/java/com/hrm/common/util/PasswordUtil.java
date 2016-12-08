package com.hrm.common.util;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.util.concurrent.TimeUnit;

import net.sf.json.JSONObject;

import org.apache.commons.lang.StringUtils;

public class PasswordUtil {
	
	public static String getRandomNum(int pwd_len) {
		   /*int i; // 生成的随机数
		   int count = 0; // 生成的密码的长度
		   char[] str = { 
				   'A','a', 
				   'B','b', 
				   'C','c',
				   'D','d',
				   'E','e',
				   'F','f',
				   'G','g', 
				   'H','h',
				   'I','i',
				   'J','j',
				   'J','k', 
				   'L','l', 
				   'M','m', 
				   'N','n', 
				   'O','o', 
				   'P','p', 
				   'Q','q', 
				   'R','r', 
				   'S','s', 
				   'T','t', 
				   'U','u', 
				   'V','v', 
				   'W','w',
				   'X','x', 
				   'Y','y', 
				   'Z','z', 
				   '0','1', 
				   '2','3', 
				   '4','5', 
				   '6','7', 
				   '8','9' 
				   };
		   
		   final int maxNum = str.length;
		   StringBuffer pwd = new StringBuffer("");
		   Random r = new Random();
		   while (count < pwd_len) {
			   
			    // 生成随机数
			    i = Math.abs(r.nextInt(maxNum)); // 生成的数最大为36-1
			    if (i >= 0 && i < str.length) {
				     pwd.append(str[i]);
				     count++;
			    }
		   }
		   return pwd.toString();*/
		
		/**
		 *  by liyunhui 2013-05-20 bugId:0001956
		 *  测试人员预期结果:  随机密码，密码长度12位及以上,必须包含大小写字母+数字
		 */
		// 1.假设虚拟机密码长度为12位，虚拟机密码要求包含数字和大小写英文字符
		int vmPasswordLength = pwd_len;
		// 2.随机生成3个必须>=1的数字，且数字之和=vmPasswordLength 分别作为大写小写和数字的个数
		int[] kinds = new int[3];
		// 如果是12位，就显示1-10位大写字母
		kinds[0] = 1 + (int) (Math.random() * (vmPasswordLength - 2));
		// 显示1 - (vmPasswordLength-kinds[0]-1)位小写字母，其实就是1到 11-kinds[0]
		kinds[1] = 1 + (int) (Math.random() * (vmPasswordLength - kinds[0] - 1));
		// 剩下的就是为几位数字
		kinds[2] = vmPasswordLength - kinds[0] - kinds[1];
		String[] upperLetters = "A,B,C,D,E,F,G,H,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z"
				.split(",");
		String[] lowerLetters = "a,b,c,d,e,f,g,h,i,j,k,m,n,o,p,q,r,s,t,u,v,w,x,y,z"
				.split(",");
		String[] digitals = "0,1,2,3,4,5,6,7,8,9".split(",");
		StringBuffer sb = new StringBuffer();
		Random random = new Random();
		// 3.vmPassword的前面kinds[0]个字符赋值大写字母
		for (int i = 0; i < kinds[0]; i++) {
			sb.append(upperLetters[random.nextInt(upperLetters.length - 1)]);
		}
		for (int i = 0; i < kinds[1]; i++) {
			sb.append(lowerLetters[random.nextInt(lowerLetters.length - 1)]);
		}
		for (int i = 0; i < kinds[2]; i++) {
			sb.append(digitals[random.nextInt(digitals.length - 1)]);
		}
		// 4.实现一个简单的洗牌，避免密码出现大写小写数字这种按部就班的顺序
		char[] cards_char = sb.toString().toCharArray();
		List<Character> cards_arraylist = new ArrayList<Character>();
		for (char card : cards_char) {
			cards_arraylist.add(card);
		}
		Collections.shuffle(cards_arraylist);
		StringBuffer finalVmPassword = new StringBuffer();
		for (char card : cards_arraylist) {
			finalVmPassword.append(card);
		}
		return finalVmPassword.toString();
	}
	
	
	public static String getEncyptedPasswd(String originalPwd)throws Exception{
		String result=null;
		if(StringUtils.isNotBlank(originalPwd)){
			result=MD5Util.getMD5Str(originalPwd);
		}
		return result;
	}
	
	public static boolean validEncyptedPasswd(String passwd,String passwdInDb)throws Exception{
		boolean result=false;
		if(StringUtils.isNotBlank(passwd)&&StringUtils.isNotBlank(passwdInDb)){
			String encyptedPwd=getEncyptedPasswd(passwd);
			result=encyptedPwd.equals(passwdInDb);
		}
		return result;
	}
	
	public static void main(String[] args)throws Exception{
		String passwd="q1w2e3r4";//c62d929e7b7e7b6165923a5dfc60cb56
		//7f176142c10a64faae4d790012a8883d
		String getPasswd=getEncyptedPasswd(passwd);
		String passwdInDb=getEncyptedPasswd(getPasswd);
		String lastPasswd=getEncyptedPasswd(passwdInDb);
		
		
		System.out.println(getEncyptedPasswd(getEncyptedPasswd(passwd)));
		System.out.println(getPasswd);
		System.out.println(passwdInDb);
		System.out.println(lastPasswd);
		System.out.println(lastPasswd.length());
		System.out.println(validEncyptedPasswd(getPasswd,passwdInDb));
		
		JSONObject testJson=new JSONObject();
		testJson.accumulate("2015-02-10 16:51:44","eeeeeeeeeee");
		String testStr=testJson.toString();
		JSONObject testJson1=JSONObject.fromObject(testStr);
		TimeUnit.SECONDS.sleep(1);
		testJson1.accumulate(TTCloudDateUtil.getNowStr(),"eeeeeeeeeee");
		System.out.println(testJson1.toString());
		JSONObject testJson2=JSONObject.fromObject(testJson1.toString());
		TimeUnit.SECONDS.sleep(1);
		testJson2.accumulate(TTCloudDateUtil.getNowStr(),"eeeeeeeeeee");
		System.out.println(testJson2.toString());
		System.out.println(testJson2.keySet().toString());
		Object[] testArr=testJson2.keySet().toArray();
		if(testArr[0].equals("2015-02-10 16:51:44")){
			System.out.println(true);
		}
		
	}
	
}
	

