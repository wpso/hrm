package com.hrm.common.entity;


public class UserBrand extends AbstractEntity {

	private String code;

	private String description;

	private short status = (short) 1;
	private Integer rebateRate;// 返点率
	private Integer giftsDiscountRate;// 礼金率
	
	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public short getStatus() {
		return status;
	}

	public void setStatus(short status) {
		this.status = status;
	}

	public Integer getRebateRate() {
		return rebateRate;
	}

	public void setRebateRate(Integer rebateRate) {
		this.rebateRate = rebateRate;
	}

	public Integer getGiftsDiscountRate() {
		return giftsDiscountRate;
	}

	public void setGiftsDiscountRate(Integer giftsDiscountRate) {
		this.giftsDiscountRate = giftsDiscountRate;
	}

	@Override
	public String toString() {
		return "UserBrand [code=" + code + ", description=" + description + ", status=" + status + ", rebateRate="
				+ rebateRate + ", giftsDiscountRate=" + giftsDiscountRate + "]";
	}

}