package com.keepreading.springbootlibrary.service;

import java.sql.Date;
import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.keepreading.springbootlibrary.dao.ReviewRepository;
import com.keepreading.springbootlibrary.entity.Review;
import com.keepreading.springbootlibrary.requestmodels.ReviewRequest;

@Service
@Transactional
public class ReviewService {
	
	@Autowired
	private ReviewRepository reviewRepository;
	
	public void postReview(String userEmail, ReviewRequest reviewRequest) throws Exception {
		Review validateReview = reviewRepository.findByUserEmailAndBookId(userEmail, reviewRequest.getBookId());
		
		if(validateReview != null) {
			throw new Exception("Review is already created.");
		}
		
		Review review = new Review();
		review.setUserEmail(userEmail);
		review.setDate(Date.valueOf(LocalDate.now()));
		review.setRating(reviewRequest.getRating());
		review.setBookId(reviewRequest.getBookId());
		if(reviewRequest.getReviewDescription().isPresent()) {			
			review.setReviewDescription(reviewRequest.getReviewDescription().map(
					Object::toString
					).orElse(null));
		}
		
		reviewRepository.save(review);
		
	}

	public Boolean reviewBookByUser(String userEmail, Long bookId) {
		Review validateReview = reviewRepository.findByUserEmailAndBookId(userEmail, bookId);
		return validateReview != null;
	}
	
}
