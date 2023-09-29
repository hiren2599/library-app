package com.keepreading.springbootlibrary.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.keepreading.springbootlibrary.dao.BookRepository;
import com.keepreading.springbootlibrary.entity.Book;
import com.keepreading.springbootlibrary.requestmodels.AddBookRequest;

@Service
@Transactional
public class AdminService {

	@Autowired
	private BookRepository bookRepository;
	
	public void postBook(AddBookRequest addBookRequest) {
		Book book = new Book();
		book.setTitle(addBookRequest.getTitle());
		book.setAuthor(addBookRequest.getAuthor());
		book.setDescription(addBookRequest.getDescription());
		book.setCopies(addBookRequest.getCopies());
		book.setCopiesAvailable(addBookRequest.getCopies());
		book.setCategory(addBookRequest.getCategory());
		book.setImg(addBookRequest.getImg());
		bookRepository.save(book);
	}
}
