package com.keepreading.springbootlibrary.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.keepreading.springbootlibrary.entity.Book;
import com.keepreading.springbootlibrary.service.BookService;
import com.keepreading.springbootlibrary.utils.ExtractJWT;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/books")
public class BookController {

	@Autowired
	private BookService bookService;
	
	@PutMapping("/secure/checkout")
	public Book checkoutBook(@RequestHeader(value = "Authorization") String token,@RequestParam Long bookId) throws Exception {
		String testEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
		return bookService.checkoutBook(testEmail, bookId);
	}
	
	@GetMapping("/secure/ischeckout/byuser")
	public Boolean checkoutBookByUser(@RequestHeader(value = "Authorization") String token,@RequestParam Long bookId) {
		String testEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
		return bookService.checkoutBookByUser(testEmail,bookId);
	}
	
	@GetMapping("/secure/currentloans/count")
	public int currentLoansCount(@RequestHeader(value = "Authorization") String token) {
		String testEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
		return bookService.currentLoansCount(testEmail);
	}
}