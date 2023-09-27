import { useEffect, useState } from "react";
import ReviewModel from "../../../models/ReviewModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Review } from "../../Utils/Review";
import { Pagination } from "../../Utils/Pagination";

export const ReviewListPage = () => {
	const [reviews, setReviews] = useState<ReviewModel[]>();
	const [isLoading, setIsLoading] = useState(true);
	const [httpError, setHttpError] = useState(null);

	// Pagination for Reviews
	const [currentPage, setCurrentPage] = useState(1);
	const [reviewsPerPage] = useState(5);
	const [totalPages, setTotalPages] = useState(0);
	const [totalAmountofReviews, setTotalAmountOfReviews] = useState(0);

	const bookId = window.location.pathname.split("/")[2];

	useEffect(() => {
		const fetchReviews = async () => {
			const reviewsUrl = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}&page=${
				currentPage - 1
			}&size=${reviewsPerPage}`;

			const reviewsResponse = await fetch(reviewsUrl);

			if (!reviewsResponse.ok) {
				throw new Error("Something went wrong");
			}

			const reviewResponseJson = await reviewsResponse.json();

			const reviewsResponseData = reviewResponseJson._embedded.reviews;

			setTotalPages(reviewResponseJson.page.totalPages);
			setTotalAmountOfReviews(reviewResponseJson.page.totalElements);

			const loadedReviews: ReviewModel[] = [];

			for (const key in reviewsResponseData) {
				loadedReviews.push({
					id: reviewsResponseData[key].id,
					userEmail: reviewsResponseData[key].userEmail,
					date: reviewsResponseData[key].date,
					rating: reviewsResponseData[key].rating,
					book_id: reviewsResponseData[key].bookId,
					reviewDescription: reviewsResponseData[key].reviewDescription,
				});
			}

			setReviews(loadedReviews);
			setIsLoading(false);
		};
		fetchReviews().catch((err) => {
			setIsLoading(false);
			setHttpError(err.message);
		});
	}, [currentPage]);

	if (isLoading) {
		return <SpinnerLoading />;
	}

	if (httpError) {
		return (
			<div className="container m-5">
				<p>{httpError}</p>
			</div>
		);
	}

	const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

	const lastIndexOfCurrentPage = currentPage * reviewsPerPage;
	const firstIndexOfCurrentPage = lastIndexOfCurrentPage - reviewsPerPage;
	const lastItem = Math.min(lastIndexOfCurrentPage, totalAmountofReviews);

	return (
		<div className="container m-5">
			<div>
				<h3>Comments: {reviews?.length}</h3>
			</div>
			<p>
				{firstIndexOfCurrentPage + 1} to {lastItem} of {totalAmountofReviews}{" "}
				reviews
			</p>
			<div className="row">
				{reviews?.map((review) => (
					<Review review={review} key={review.id} />
				))}
			</div>
			{totalPages > 1 && (
				<Pagination
					totalPages={totalPages}
					currentPage={currentPage}
					paginate={paginate}
				/>
			)}
		</div>
	);
};
