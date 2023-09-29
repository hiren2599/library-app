package com.keepreading.springbootlibrary.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.keepreading.springbootlibrary.dao.BookRepository;
import com.keepreading.springbootlibrary.dao.CheckoutRepository;
import com.keepreading.springbootlibrary.dao.ReviewRepository;
import com.keepreading.springbootlibrary.entity.Book;
import com.keepreading.springbootlibrary.requestmodels.AddBookRequest;

@Service
@Transactional
public class AdminService {

	@Autowired
	private BookRepository bookRepository;
	
	@Autowired
	private CheckoutRepository checkoutRepository;
	
	@Autowired
	private ReviewRepository reviewRepository;
	
	public void increamentBook(Long bookId) throws Exception {
		Optional<Book> book = bookRepository.findById(bookId);
		if(!book.isPresent()) {
			throw new Exception("Book not found");
		}
		
		book.get().setCopiesAvailable(book.get().getCopiesAvailable()+1);
		book.get().setCopies((book.get().getCopies()+1));
		bookRepository.save(book.get());
	}
	
	public void decrementBook(Long bookId) throws Exception {
		Optional<Book> book = bookRepository.findById(bookId);
		if(!book.isPresent() || book.get().getCopiesAvailable() <=0 || book.get().getCopies() <=0 ) {
			throw new Exception("Book not found or Book quantity can't be decreased more");
		}
		
		book.get().setCopiesAvailable(book.get().getCopiesAvailable()-1);
		book.get().setCopies((book.get().getCopies()-1));
		bookRepository.save(book.get());
	}
	
	public void deleteBook(Long bookId) throws Exception {
		Optional<Book> book = bookRepository.findById(bookId);
		if(!book.isPresent()) {
			throw new Exception("Book not found");
		}
		
		bookRepository.deleteById(bookId);
		reviewRepository.deleteAllByBookId(bookId);
		checkoutRepository.deleteAllByBookId(bookId);
	}
	
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
