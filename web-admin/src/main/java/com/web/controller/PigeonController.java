package com.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.web.entity.Pigeon;
import com.web.service.PigeonService;

@Controller
@RequestMapping("/pigeon")
public class PigeonController {
	@Autowired
	private PigeonService pigeonService;
	
//	@RequestMapping("/createPigeon")
//	@ResponseBody
//	public String createPigeon(Pigeon pigeon){
//		String result = pigeonService.insertPigeon(pigeon);
//		return result;
//	}
	
	
}
