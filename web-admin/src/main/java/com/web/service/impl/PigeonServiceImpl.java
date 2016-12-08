package com.web.service.impl;


import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.web.dao.PigeonMapper;
import com.web.dao.TerminalMapper;
import com.web.entity.Pigeon;
import com.web.service.PigeonService;
import com.web.util.JSONUtil;

/**
 * 鸽子 服务层
 * 
 * @author gaopeng
 * @createtime 2016-03-05 09:13:56
 */
@Service
public class PigeonServiceImpl implements PigeonService {
	private Logger logger = Logger.getLogger(this.getClass());
//	private SerializerFeature[] features = {
//			SerializerFeature.WriteMapNullValue,
//			SerializerFeature.WriteNullStringAsEmpty };

	@Autowired
	PigeonMapper pigeonMapper;
	@Autowired
	TerminalMapper terminalMapper;

	public String insertPigeon(Pigeon pigeon) {

		int result = 0;
		if (pigeon == null || pigeon.getId() == null
				|| pigeon.getName() == null) {
			return JSONUtil.appendError("1", "鸽子信息不全或不正确！", "");
		}
		try {
			result = pigeonMapper.insertSelective(pigeon);
		} catch (Exception e) {
			return JSONUtil.appendError("1", "错误：" + e.getMessage(), "");
		}

		if (result > 0) {
			logger.info("插入成功：鸽子编号" + pigeon.getId());
			return JSONUtil.appendError("0", "插入鸽子信息成功！", "");
		}

		return JSONUtil.appendError("1", "未知错误", "");
	}

	
}
