package com.shareup.jwt;

public class AuthenticationResponse {
	private final String jwt;
	private final String username;
	private String type = "Bearer";

	public AuthenticationResponse(String accessToken, String username) {
		super();
		this.jwt = accessToken;
		this.username = username;
	}

	public String getJwt() {
		return jwt;
	}

	public String getUsername() {
		return username;
	}
	
	
}
