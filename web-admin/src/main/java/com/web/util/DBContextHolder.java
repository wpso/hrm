package com.web.util;
/**
 * 多数据源配置
 * @author GaoPeng
 *
 */
public class DBContextHolder {
	public static final String DATASOURCE_MYSQL = "dataSource_Mysql";     
    public static final String DATASOURCE_SQLSERVER = "dataSource_SqlServer";     
         
    private static final ThreadLocal<String> contextHolder = new ThreadLocal<String>();     
         
    public static void setDBType(String dbType) {     
        contextHolder.set(dbType);  
    }       
         
    public static String getDBType() {     
        return contextHolder.get();     
    }     
         
    public static void clearDBType() {     
        contextHolder.remove();     
    }     
}
