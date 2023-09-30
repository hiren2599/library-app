package com.keepreading.springbootlibrary.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.keepreading.springbootlibrary.requestmodels.AddBookRequest;
import com.keepreading.springbootlibrary.service.AdminService;
import com.keepreading.springbootlibrary.utils.ExtractJWT;

@CrossOrigin("https://localhost:3000")
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
	
	@PutMapping("/secure/increase/book/quantity")
	public void increamentBook(@RequestHeader(value = "Authorization") String token,@RequestParam Long bookId) throws Exception {
		String admin = ExtractJWT.payloadJWTExtraction(token, "\"userType\"");
		if(admin == null || !admin.equals("admin")) {
			throw new Exception("Only Admin users are allowed");
		}
		adminService.increamentBook(bookId);
	}
	
	@PutMapping("/secure/decrease/book/quantity")
	public void decrementBook(@RequestHeader(value = "Authorization") String token,@RequestParam Long bookId) throws Exception {
		String admin = ExtractJWT.payloadJWTExtraction(token, "\"userType\"");
		if(admin == null || !admin.equals("admin")) {
			throw new Exception("Only Admin users are allowed");
		}
		adminService.decrementBook(bookId);
	}
	
	@DeleteMapping("/secure/delete/book")
	public void deleteBook(@RequestHeader(value = "Authorization") String token,@RequestParam Long bookId) throws Exception {
		String admin = ExtractJWT.payloadJWTExtraction(token, "\"userType\"");
		if(admin == null || !admin.equals("admin")) {
			throw new Exception("Only Admin users are allowed");
		}
		adminService.deleteBook(bookId);
	}
}
