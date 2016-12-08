package com.web.util;

import java.util.ArrayList;
import java.util.HashMap;   
import java.util.Iterator;
import java.util.List;
import java.util.Map;   
import net.sf.json.JSONArray;   
import net.sf.json.JSONObject;  
/**
 * JSON 工具类
 * @author GaoPeng
 *
 */
public final class JSONUtil {  
   public static String appendError(String error,String message,String json){
	   JSONObject object = new JSONObject();   
       object.put("error", error);
       object.put("message", message);
       object.put("data", json);
       return object.toString();
   }
    // 将String转换成JSON   
    public static String stringToJson(String key, String value) {   
        JSONObject object = new JSONObject();   
        object.put(key, value);   
        return object.toString();   
    }  
   
    // 将数组转换成JSON   
    public static String arrayToJson(Object object) {   
        JSONArray jsonArray = JSONArray.fromObject(object);   
        return jsonArray.toString();   
    }  
   
    // 将Map转换成JSON   
    public static String mapToJson(Object object) {   
        JSONObject jsonObject = JSONObject.fromObject(object);   
        return jsonObject.toString();   
    }  
   
    // 将domain对象转换成JSON   
    public static String beanToJson(Object object) {   
        JSONObject jsonObject = JSONObject.fromObject(object);   
        return jsonObject.toString();   
    }  
   
    // 将JSON转换成domain对象,其中beanClass为domain对象的Class   
    public static Object jsonToObject(String json, Class beanClass) {   
        return JSONObject.toBean(JSONObject.fromObject(json), beanClass);   
    }  
   
    // 将JSON转换成String   
    public static String jsonToString(String json, String key) {   
        JSONObject jsonObject = JSONObject.fromObject(json);   
        return jsonObject.get(key).toString();   
    }   
  
    // 将JSON转换成数组,其中valueClass为数组中存放对象的Class   
    public static Object jsonToArray(String json, Class valueClass) {   
        JSONArray jsonArray = JSONArray.fromObject(json);   
        return JSONArray.toArray(jsonArray, valueClass);   
    }  
  
    // 将JSON转换成Map,其中valueClass为Map中value的Class,keyArray为Map的key   
    public static Map jsonToMap(Object[] keyArray, String json, Class valueClass) {   
        JSONObject jsonObject = JSONObject.fromObject(json);   
        Map classMap = new HashMap();  
   
        for (int i = 0; i < keyArray.length; i++) {   
            classMap.put(keyArray[i], valueClass);   
        }   
        return (Map) JSONObject.toBean(jsonObject, Map.class, classMap);   
    }  
    public static List<Map<String, Object>> parseJSON2List(String jsonStr){  
        JSONArray jsonArr = JSONArray.fromObject(jsonStr);  
        List<Map<String, Object>> list = new ArrayList<Map<String,Object>>();  
        Iterator<JSONObject> it = jsonArr.iterator();  
        while(it.hasNext()){  
            JSONObject json2 = it.next();  
            list.add(parseJSON2Map(json2.toString()));  
        }  
        return list;  
    } 
    
    public static Map<String, Object> parseJSON2Map(String jsonStr){  
        Map<String, Object> map = new HashMap<String, Object>();  
        //最外层解析  
        JSONObject json = JSONObject.fromObject(jsonStr);  
        for(Object k : json.keySet()){  
            Object v = json.get(k);   
            //如果内层还是数组的话，继续解析  
            if(v instanceof JSONArray){  
                List<Map<String, Object>> list = new ArrayList<Map<String,Object>>();  
                Iterator<JSONObject> it = ((JSONArray)v).iterator();  
                while(it.hasNext()){  
                    JSONObject json2 = it.next();  
                    list.add(parseJSON2Map(json2.toString()));  
                }  
                map.put(k.toString(), list);  
            } else {  
                map.put(k.toString(), v);  
            }  
        }  
        return map;  
    }  
    
}  