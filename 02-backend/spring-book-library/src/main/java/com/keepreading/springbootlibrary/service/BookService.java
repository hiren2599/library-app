package com.keepreading.springbootlibrary.service;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.keepreading.springbootlibrary.dao.BookRepository;
import com.keepreading.springbootlibrary.dao.CheckoutRepository;
import com.keepreading.springbootlibrary.entity.Book;
import com.keepreading.springbootlibrary.entity.Checkout;

@Service
@Transactional
public class BookService {

	@Autowired
	private BookRepository bookRepository;
	
	@Autowired
	private CheckoutRepository checkoutRepository;
	
	public Book checkoutBook(String userEmail, Long bookId) throws Exception {
		Optional<Book> book = bookRepository.findById(bookId);
		
		Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);
		
		if(!book.isPresent() || validateCheckout != null || book.get().getCopiesAvailable() <= 0) {
			throw new Exception("Book already checkedout or book not available");
		}
		
		book.get().setCopiesAvailable(book.get().getCopiesAvailable() - 1);
		bookRepository.save(book.get());
		
		checkoutRepository.save(new Checkout(userEmail, LocalDate.now().toString()o, LocalDate.now().plusDays(7).toString(), bookId))
		
		return book.get();
	}

	public Boolean checkoutBookByUser(String testEmail, Long bookId) {
		Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(testEmail, bookId);
		return validateCheckout != null;
	}

	public int currentLoansCount(String testEmail) {
		return checkoutRepository.findBooksByUserEmail(testEmail).size();
	}
}
