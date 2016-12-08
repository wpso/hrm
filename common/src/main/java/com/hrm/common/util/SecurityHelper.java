package com.hrm.common.util;

import java.util.HashMap;
import java.util.Map;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.DESKeySpec;
import javax.crypto.spec.IvParameterSpec;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

/**
 * 加密工具类
 * 
 * @author panbk
 * 
 */
public final class SecurityHelper {
	private final static String Cipher_Algorithm = "DES/CBC/PKCS5Padding";
	private final static String Security_Algorithm = "DES";
	private final static String Encoding_UTF_8 = "UTF-8";
	private static Logger logger = Logger.getLogger(SecurityHelper.class);

	/**
	 * 加密数据（根据配置文件key）
	 * 
	 * @param data
	 * @return
	 * @throws TTCloudException 
	 */
	public static String EncryptData(String data) throws TTCloudException {
		String key = getSecurityKey();
		return EncryptData(data, key);
	}

	/**
	 * 解密数据（根据配置文件key）
	 * 
	 * @param data
	 * @return
	 * @throws TTCloudException 
	 */
	public static String DecryptData(String data) throws TTCloudException {
		String key = getSecurityKey();
		return DecryptData(data, key);
	}
	
	/**
	 * 加密数据（根据配置文件key）
	 * 
	 * @param data
	 * @return
	 */
	public static String EncryptDataMain(String data) {
		String key = Constants.DEFAULT_SECURITY_KEY;//getSecurityKey();
		return EncryptData(data, key);
	}

	/**
	 * 解密数据（根据配置文件key）
	 * 
	 * @param data
	 * @return
	 */
	public static String DecryptDataMain(String data) {
		String key = Constants.DEFAULT_SECURITY_KEY;//getSecurityKey();
		return DecryptData(data, key);
	}

	/**
	 * 获得配置文件key
	 * 
	 * @return
	 * @throws TTCloudException 
	 */
	private static String getSecurityKey() throws TTCloudException

	{
		Map<String, String> properties = new HashMap<String, String>();
		properties = PropertiesUtils.getPropertiesMap("jdbc.properties",
				properties);
		String securityKey =  properties.get("jdbc.soWhat");
		if (StringUtils.isEmpty(securityKey)) {
			securityKey = Constants.DEFAULT_SECURITY_KEY;
		}
		return securityKey;
	}

	/**
	 * 加密数据
	 * 
	 * @param data
	 * @param key
	 * @return
	 */
	public static String EncryptData(String data, String key) {
		String encryptData = null;
		try {
			Cipher cipher = Cipher.getInstance(Cipher_Algorithm);
			DESKeySpec desKeySpec = new DESKeySpec(key.getBytes(Encoding_UTF_8));
			SecretKeyFactory keyFactory = SecretKeyFactory
					.getInstance(Security_Algorithm);
			SecretKey secretKey = keyFactory.generateSecret(desKeySpec);
			IvParameterSpec iv = new IvParameterSpec(
					key.getBytes(Encoding_UTF_8));
			cipher.init(Cipher.ENCRYPT_MODE, secretKey, iv);
			byte[] encryptDataBytes = cipher.doFinal(data
					.getBytes(Encoding_UTF_8));
			encryptData = new BASE64Encoder().encode(encryptDataBytes);
		} catch (Exception ex) {
			logger.error("EncryptData Excepiton", ex);
			encryptData = null;
		}
		return encryptData;
	}

	/**
	 * 解密数据
	 * 
	 * @param data
	 * @param key
	 * @return
	 */
	public static String DecryptData(String data, String key) {
		String encryptData = null;
		try {
			Cipher cipher = Cipher.getInstance(Cipher_Algorithm);
			DESKeySpec desKeySpec = new DESKeySpec(key.getBytes(Encoding_UTF_8));
			SecretKeyFactory keyFactory = SecretKeyFactory
					.getInstance(Security_Algorithm);
			SecretKey secretKey = keyFactory.generateSecret(desKeySpec);
			IvParameterSpec iv = new IvParameterSpec(
					key.getBytes(Encoding_UTF_8));
			cipher.init(Cipher.DECRYPT_MODE, secretKey, iv);
			byte[] dataBytes = new BASE64Decoder().decodeBuffer(data);
			byte[] decryptDataBytes = cipher.doFinal(dataBytes);
			encryptData = new String(decryptDataBytes, Encoding_UTF_8);
		} catch (Exception ex) {
			logger.error("DecryptData Excepiton", ex);
			encryptData = null;
		}
		return encryptData;
	}

	public static void main(String[] args) {
		String passwdE = EncryptDataMain("1cfc3aad");
		System.out.println("密文:" + passwdE);
//		String passwdE ="535656c516d0d207628ef3aeb8cda17d";
		String passwdD = DecryptDataMain("1cfc3aad");
		System.out.println("明文:" + passwdD);
	}

}