package com.web.util;

import org.springframework.jdbc.datasource.lookup.AbstractRoutingDataSource;
/**
 * 多数据源配置
 * @author GaoPeng
 *
 */
public class DynamicDataSource extends AbstractRoutingDataSource {

	@Override     
    protected Object determineCurrentLookupKey() {     
        return DBContextHolder.getDBType();     
    }     

}
