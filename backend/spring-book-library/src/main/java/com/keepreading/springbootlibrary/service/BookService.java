package com.keepreading.springbootlibrary.service;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.keepreading.springbootlibrary.dao.BookRepository;
import com.keepreading.springbootlibrary.dao.CheckoutRepository;
import com.keepreading.springbootlibrary.dao.HistoryRepository;
import com.keepreading.springbootlibrary.dao.PaymentRepository;
import com.keepreading.springbootlibrary.entity.Book;
import com.keepreading.springbootlibrary.entity.Checkout;
import com.keepreading.springbootlibrary.entity.History;
import com.keepreading.springbootlibrary.entity.Payment;
import com.keepreading.springbootlibrary.responsemodels.ShelfCurrentLoansResponse;

@Service
@Transactional
public class BookService {

	@Autowired
	private BookRepository bookRepository;
	
	@Autowired
	private CheckoutRepository checkoutRepository;
	
	@Autowired
	private HistoryRepository historyRepository;
	
	@Autowired
	private PaymentRepository paymentRepository;
	
	public Book checkoutBook(String userEmail, Long bookId) throws Exception {
		Optional<Book> book = bookRepository.findById(bookId);
		
		Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);
		
		if(!book.isPresent() || validateCheckout != null || book.get().getCopiesAvailable() <= 0) {
			throw new Exception("Book already checkedout or book not available");
		}
		
		List<Checkout> checkoutBooks = checkoutRepository.findBooksByUserEmail(userEmail);
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		boolean booksNeededToReturn = false;
		for(Checkout checkout: checkoutBooks) {
			Date d1 = sdf.parse(checkout.getReturnDate());
			Date d2 = sdf.parse(LocalDate.now().toString());
			TimeUnit time = TimeUnit.DAYS;
			double differenceInTime = time.convert(d1.getTime()-d2.getTime(),TimeUnit.MILLISECONDS);
			if(differenceInTime < 0) {
				booksNeededToReturn=true;
				break;
			}
		}
		
		Payment userPayment = paymentRepository.findByUserEmail(userEmail);
		
		if((userPayment != null && userPayment.getAmount() > 0) || (userPayment != null && booksNeededToReturn)) {
			throw new Exception("Outstanding fees");
		}
		
		if(userPayment == null) {
			Payment payment = new Payment();
			payment.setAmount(0.0);
			payment.setUserEmail(userEmail);
			paymentRepository.save(payment);
		}
		
		book.get().setCopiesAvailable(book.get().getCopiesAvailable() - 1);
		bookRepository.save(book.get());
		
		checkoutRepository.save(new Checkout(userEmail, LocalDate.now().toString(), LocalDate.now().plusDays(7).toString(), bookId));
		
		return book.get();
	}

	public Boolean checkoutBookByUser(String testEmail, Long bookId) {
		Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(testEmail, bookId);
		return validateCheckout != null;
	}

	public int currentLoansCount(String testEmail) {
		return checkoutRepository.findBooksByUserEmail(testEmail).size();
	}
	
	public List<ShelfCurrentLoansResponse> currentLoans(String userEmail) throws Exception {
		
		List<ShelfCurrentLoansResponse> shelfCurrentLoansResponse = new ArrayList<>();
		
		List<Checkout> checkoutList = checkoutRepository.findBooksByUserEmail(userEmail);
		
		List<Long> bookIds = new ArrayList<>();
		for(Checkout checkout: checkoutList) {
			bookIds.add(checkout.getBookId());
		}
		
		List<Book> books = bookRepository.findAllById(bookIds);
//		List<Book> books = bookRepository.findBooksByBookIds(bookIds);
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		for(Book book: books) {
			Optional<Checkout> checkout = checkoutList.stream().filter(ele -> ele.getBookId() == book.getId()).findFirst();
			
			if(checkout.isPresent()) {
				Date d1 = sdf.parse(checkout.get().getReturnDate());
				Date d2 = sdf.parse(LocalDate.now().toString());
				
				TimeUnit time = TimeUnit.DAYS;
				
				long difference_in_Time = time.convert(d1.getTime() - d2.getTime(), TimeUnit.MILLISECONDS);
				
				shelfCurrentLoansResponse.add(new ShelfCurrentLoansResponse(book, (int)difference_in_Time));
			}
		}
		
		return shelfCurrentLoansResponse;
	}
	
	public void returnBook(String userEmail,Long bookId) throws Exception {
		Optional<Book> book = bookRepository.findById(bookId);
		
		Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);
		
		if(!book.isPresent() || validateCheckout == null) {
			throw new Exception("Book is not present or Book is not checkedout");
		}
		
		book.get().setCopiesAvailable(book.get().getCopiesAvailable() + 1);
		
		bookRepository.save(book.get());
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Date d1 = sdf.parse(validateCheckout.getReturnDate());
		Date d2 = sdf.parse(LocalDate.now().toString());
		TimeUnit time = TimeUnit.DAYS;
		double differenceInTime = time.convert(d1.getTime()-d2.getTime(),TimeUnit.MILLISECONDS);
		if(differenceInTime < 0) {
			Payment payment = paymentRepository.findByUserEmail(userEmail);
			payment.setAmount(payment.getAmount() + (differenceInTime * -1));
			paymentRepository.save(payment);
		}
		
		
		checkoutRepository.deleteById(validateCheckout.getId());
		
		History history = new History(
				userEmail,
				validateCheckout.getCheckoutDate(),
				LocalDate.now().toString(),
				book.get().getTitle(),
				book.get().getAuthor(),
				book.get().getDescription(),
				book.get().getImg()
		);
		historyRepository.save(history);
	}
	
	public void renewBook(String userEmail, Long bookId) throws Exception {
		Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);
		
		if(validateCheckout == null) {
			throw new Exception("Book not checkedout");
		}
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		
		Date d1 = sdf.parse(validateCheckout.getReturnDate());
		Date d2 = sdf.parse(LocalDate.now().toString());
		
		if(d1.compareTo(d2) > 0 || d1.compareTo(d2) == 0) {
			validateCheckout.setReturnDate(LocalDate.now().plusDays(7).toString());
			checkoutRepository.save(validateCheckout);
		}
	}
}
