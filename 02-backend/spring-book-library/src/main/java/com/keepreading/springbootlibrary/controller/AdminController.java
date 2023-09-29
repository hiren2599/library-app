package com.keepreading.springbootlibrary.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.keepreading.springbootlibrary.requestmodels.AddBookRequest;
import com.keepreading.springbootlibrary.service.AdminService;
import com.keepreading.springbootlibrary.utils.ExtractJWT;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/admin")
public class AdminController {

	@Autowired
	private AdminService adminService;
	
	@PostMapping("/secure/add/book")
	public void postBook(@RequestHeader(value = "Authorization") String token,@RequestBody AddBookRequest addBookRequest) throws Exception {
		String admin = ExtractJWT.payloadJWTExtraction(token, "\"userType\"");
		if(admin == null || !admin.equals("admin")) {
			throw new Exception("Only Admin users are allowed");
		}
		adminService.postBook(addBookRequest);
	}
}
