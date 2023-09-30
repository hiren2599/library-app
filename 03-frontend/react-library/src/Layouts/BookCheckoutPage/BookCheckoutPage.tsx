import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import ReviewModel from "../../models/ReviewModel";
import { LatestReviews } from "./LatestReviews";
import { useOktaAuth } from "@okta/okta-react";
import ReviewRequestModel from "../../models/ReviewRequestModel";

export const BookCheckoutPage = () => {
	const { authState } = useOktaAuth();

	// Book State
	const [book, setBook] = useState<BookModel>();
	const [isLoading, setIsLoading] = useState(true);
	const [httpError, setHttpError] = useState(null);

	// Review State
	const [reviews, setReviews] = useState<ReviewModel[]>([]);
	const [totalStars, setTotalStars] = useState(0);
	const [isReviewLoading, setIsReviewLoading] = useState(true);

	const [hasUserReviewed, setHasUserReviewed] = useState(false);
	const [isHasUserReviewedLoading, setIsHasUserReviewedLoading] =
		useState(true);

	// Checkout State
	const [currentLoansCount, setCurrentLoansCount] = useState(0);
	const [isCurrentLoansCountLoading, setIsCurrentLoansCountLoading] =
		useState(true);

	// is book checked out?
	const [isBookCheckout, setIsBookCheckout] = useState(false);
	const [isBookCheckoutLoading, setIsBookCheckoutLoading] = useState(true);

	const bookId = window.location.pathname.split("/")[2];

	useEffect(() => {
		const fetchBook = async () => {
			const baseUrl = `${process.env.REACT_APP_API}/books/${bookId}`;

			const response = await fetch(baseUrl);

			if (!response.ok) {
				throw new Error("Something went wrong");
			}

			const responseJson = await response.json();

			const loadedBook: BookModel = {
				id: responseJson.id,
				title: responseJson.title,
				author: responseJson.author,
				description: responseJson.description,
				copies: responseJson.copies,
				copiesAvailable: responseJson.copiesAvailable,
				category: responseJson.category,
				img: responseJson.img,
			};

			setBook(loadedBook);
			setIsLoading(false);
		};

		fetchBook().catch((err) => {
			setHttpError(err.message);
			setIsLoading(false);
		});
	}, [isBookCheckout]);

	useEffect(() => {
		const fetchReviews = async () => {
			const reviewsUrl = `${process.env.REACT_APP_API}/reviews/search/findByBookId?bookId=${bookId}`;

			const reviewsResponse = await fetch(reviewsUrl);

			if (!reviewsResponse.ok) {
				throw new Error("Something went wrong");
			}

			const reviewResponseJson = await reviewsResponse.json();

			const reviewsResponseData = reviewResponseJson._embedded.reviews;

			const loadedReviews: ReviewModel[] = [];
			let weightedStarReviews: number = 0;

			for (const key in reviewsResponseData) {
				loadedReviews.push({
					id: reviewsResponseData[key].id,
					userEmail: reviewsResponseData[key].userEmail,
					date: reviewsResponseData[key].date,
					rating: reviewsResponseData[key].rating,
					book_id: reviewsResponseData[key].bookId,
					reviewDescription: reviewsResponseData[key].reviewDescription,
				});
				weightedStarReviews =
					weightedStarReviews + reviewsResponseData[key].rating;
			}

			if (loadedReviews) {
				const roundedReviewStar = (
					Math.round((weightedStarReviews / loadedReviews.length) * 2) / 2
				).toFixed(1);
				setTotalStars(Number(roundedReviewStar));
			}

			setReviews(loadedReviews);
			setIsReviewLoading(false);
		};
		fetchReviews().catch((err) => {
			setIsReviewLoading(false);
			setHttpError(err.message);
		});
	}, [hasUserReviewed]);

	useEffect(() => {
		const fetchUserLoanCount = async () => {
			if (authState && authState.isAuthenticated) {
				const url = `${process.env.REACT_APP_API}/books/secure/currentloans/count`;

				const requestOptions = {
					method: "GET",
					headers: {
						Authorization: `Bearer ${authState.accessToken?.accessToken}`,
						"Content-Type": "application/json",
					},
				};

				const currentLoansCountResponse = await fetch(url, requestOptions);
				if (!currentLoansCountResponse.ok) {
					throw new Error("Something went wrong");
				}
				const currentLoansCountJson = await currentLoansCountResponse.json();
				setCurrentLoansCount(currentLoansCountJson);
			}

			setIsCurrentLoansCountLoading(false);
		};

		fetchUserLoanCount().catch((err) => {
			setHttpError(err.message);
			setIsCurrentLoansCountLoading(false);
		});
	}, [authState, isBookCheckout]);

	useEffect(() => {
		const fetchUserBookCheckout = async () => {
			if (authState && authState.isAuthenticated) {
				const url = `${process.env.REACT_APP_API}/books/secure/ischeckout/byuser?bookId=${bookId}`;

				const requestOptions = {
					method: "GET",
					headers: {
						Authorization: `Bearer ${authState.accessToken?.accessToken}`,
						"Content-Type": "application/json",
					},
				};

				const bookCheckoutResponse = await fetch(url, requestOptions);
				if (!bookCheckoutResponse.ok) {
					throw new Error("Something went wrong");
				}
				const bookCheckoutJson = await bookCheckoutResponse.json();
				setIsBookCheckout(bookCheckoutJson);
			}
			setIsBookCheckoutLoading(false);
		};

		fetchUserBookCheckout().catch((err) => {
			setHttpError(err.message);
			setIsBookCheckoutLoading(false);
		});
	}, [authState]);

	useEffect(() => {
		const fetchHasUserReviewed = async () => {
			if (authState && authState.isAuthenticated) {
				const url = `${process.env.REACT_APP_API}/reviews/secure/user/book?bookId=${bookId}`;

				const requestOptions = {
					method: "GET",
					headers: {
						Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
						"Content-Type": "application/json",
					},
				};

				const hasUserReviewedResponse = await fetch(url, requestOptions);

				if (!hasUserReviewedResponse.ok) {
					throw new Error("Something went wrong");
				}

				const hasUserReviewedJson = await hasUserReviewedResponse.json();

				setHasUserReviewed(hasUserReviewedJson);
			}
			setIsHasUserReviewedLoading(false);
		};

		fetchHasUserReviewed().catch((err) => {
			setIsHasUserReviewedLoading(false);
			setHttpError(err.message);
		});
	}, [authState]);

	if (
		isLoading ||
		isReviewLoading ||
		isCurrentLoansCountLoading ||
		isBookCheckoutLoading ||
		isHasUserReviewedLoading
	) {
		return <SpinnerLoading />;
	}

	if (httpError) {
		return (
			<div className="container m-5">
				<p>{httpError}</p>
			</div>
		);
	}

	async function checkoutBook() {
		const url = `${process.env.REACT_APP_API}/books/secure/checkout?bookId=${book?.id}`;
		const requestOptions = {
			method: "PUT",
			headers: {
				Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
				"Content-Type": "application/json",
			},
		};

		const checkoutResponse = await fetch(url, requestOptions);

		if (!checkoutResponse.ok) {
			throw new Error("Something went wrong");
		}
		setIsBookCheckout(true);
	}

	async function submitReview(starInput: number, reviewDescription: string) {
		let currBookId: number = 0;

		if (book?.id) {
			currBookId = book?.id;
		}

		const reviewRequestModel = new ReviewRequestModel(
			starInput,
			currBookId,
			reviewDescription
		);
		const url = `${process.env.REACT_APP_API}/reviews/secure`;
		const requestOptions = {
			method: "POST",
			headers: {
				Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(reviewRequestModel),
		};

		const reviewCreateResponse = await fetch(url, requestOptions);
		if (!reviewCreateResponse.ok) {
			throw new Error("Something went wrong");
		}

		setHasUserReviewed(true);
	}

	return (
		<div>
			<div className="container d-none d-lg-block">
				<div className="row mt-5">
					<div className="col-sm-2 col-md-2">
						{book?.img ? (
							<img src={book?.img} width="226" height="349" alt="Book" />
						) : (
							<img
								src={require("./../../Images/BooksImages/book-luv2code-1000.png")}
								width="226"
								height="349"
								alt="Book"
							/>
						)}
					</div>
					<div className="col-4 col-md-4 container">
						<div className="ml-2">
							<h2>{book?.title}</h2>
							<h5 className="text-primary">{book?.author}</h5>
							<p className="lead">{book?.description}</p>
							<StarsReview rating={totalStars} size={32} />
						</div>
					</div>
					<CheckoutAndReviewBox
						book={book}
						mobile={false}
						currentLoansCount={currentLoansCount}
						isAuthenticated={authState?.isAuthenticated}
						isBookCheckout={isBookCheckout}
						checkoutBook={checkoutBook}
						hasUserReviewed={hasUserReviewed}
						submitReview={submitReview}
					/>
				</div>
				<hr />
				<LatestReviews reviews={reviews} bookId={book?.id} mobile={false} />
			</div>
			<div className="container d-lg-none mt-5">
				<div className="d-flex justify-content-center align-items-center">
					{book?.img ? (
						<img src={book?.img} width="226" height="349" alt="Book" />
					) : (
						<img
							src={require("./../../Images/BooksImages/book-luv2code-1000.png")}
							width="226"
							height="349"
							alt="Book"
						/>
					)}
				</div>
				<div className="mt-4">
					<div className="ml-2">
						<h2>{book?.title}</h2>
						<h5 className="text-primary">{book?.author}</h5>
						<p className="lead">{book?.description}</p>
						<StarsReview rating={totalStars} size={32} />
					</div>
				</div>
				<CheckoutAndReviewBox
					book={book}
					mobile={true}
					currentLoansCount={currentLoansCount}
					isAuthenticated={authState?.isAuthenticated}
					isBookCheckout={isBookCheckout}
					checkoutBook={checkoutBook}
					hasUserReviewed={hasUserReviewed}
					submitReview={submitReview}
				/>
				<hr />
				<LatestReviews reviews={reviews} bookId={book?.id} mobile={true} />
			</div>
		</div>
	);
};
