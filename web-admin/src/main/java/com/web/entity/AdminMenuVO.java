package com.web.entity; 

import java.util.ArrayList;
import java.util.List;

public class AdminMenuVO {
	private String id;
	private String name;
	private String url;
	private String icon;
	private String parentId;
	private List<AdminMenuVO> childrenList = new ArrayList<AdminMenuVO>();
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public String getIcon() {
		return icon;
	}
	public void setIcon(String icon) {
		this.icon = icon;
	}
	public String getParentId() {
		return parentId;
	}
	public void setParentId(String parentId) {
		this.parentId = parentId;
	}
	public List<AdminMenuVO> getChildrenList() {
		return childrenList;
	}
	public void setChildrenList(List<AdminMenuVO> childrenList) {
		this.childrenList = childrenList;
	}
}
