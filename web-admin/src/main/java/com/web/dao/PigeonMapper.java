package com.web.dao;


import java.util.Map;

import com.web.entity.Pigeon;

public interface PigeonMapper {
	Pigeon selectByPrimaryKey(String id);
	int insertSelective(Pigeon pigeon);
	Pigeon selPigeonBystatus();
	int updatePigeon_statusByid(Map<String,Object> map);
	int updateByPrimaryKeySelective(Map map);
}
