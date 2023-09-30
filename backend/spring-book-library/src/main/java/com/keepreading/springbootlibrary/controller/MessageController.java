package com.keepreading.springbootlibrary.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.keepreading.springbootlibrary.entity.Message;
import com.keepreading.springbootlibrary.requestmodels.AdminQuestionRequest;
import com.keepreading.springbootlibrary.service.MessageService;
import com.keepreading.springbootlibrary.utils.ExtractJWT;

@CrossOrigin("https://localhost:3000")
@RestController
@RequestMapping("/api/messages")
public class MessageController {
	
	@Autowired
	private MessageService messageService;
	
	@PostMapping("/secure/add/message")
	public void checkoutBook(@RequestHeader(value = "Authorization") String token,@RequestBody Message messageRequest) throws Exception {
		String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
		messageService.postMessage(messageRequest,userEmail);
	}
	
	@PutMapping("/secure/admin/message")
	public void putMessage(@RequestHeader(value = "Authorization") String token,@RequestBody AdminQuestionRequest adminQuestionRequest) throws Exception {
		String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
		String admin = ExtractJWT.payloadJWTExtraction(token, "\"userType\"");
		if(admin==null || !admin.equals("admin")) {
			throw new Exception("Allowed for admins only");
		}
		messageService.putMessage(adminQuestionRequest,userEmail);
	}

}
