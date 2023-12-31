import { Link } from "react-router-dom";
import BookModel from "../../models/BookModel";
import { LeaveAReview } from "../Utils/LeaveAReview";

export const CheckoutAndReviewBox: React.FC<{
	book: BookModel | undefined;
	mobile: boolean;
	currentLoansCount: number;
	isAuthenticated: any;
	isBookCheckout: boolean;
	checkoutBook: any;
	hasUserReviewed: boolean;
	submitReview: any;
}> = (props) => {
	function buttonRender() {
		if (props.isAuthenticated) {
			if (!props.isBookCheckout && props.currentLoansCount < 5) {
				return (
					<button
						onClick={() => props.checkoutBook()}
						className="btn btn-success btn-lg"
					>
						Checkout
					</button>
				);
			} else if (props.isBookCheckout) {
				return (
					<p>
						<b>Book checked out. Enjoy!</b>
					</p>
				);
			} else if (!props.isBookCheckout) {
				return <p className="text-danger">Too many books checkedout.</p>;
			}
		}
		return (
			<Link to="/login" className="btn btn-success btn-lg">
				Sign In
			</Link>
		);
	}

	function reviewRender() {
		if (props.isAuthenticated) {
			if (props.hasUserReviewed) {
				return (
					<p>
						<b>Thank you for your Reviews!!</b>
					</p>
				);
			} else {
				return <LeaveAReview submitReview={props.submitReview} />;
			}
		}
		return (
			<div>
				<hr />
				<p>Sign in to be able to leave a review.</p>
			</div>
		);
	}
	return (
		<div
			className={
				props.mobile ? "card d-flex mt-5" : "card col-3 container d-flex mb-5"
			}
		>
			<div className="card-body container">
				<div className="mt-3">
					<p>
						<b>{props.currentLoansCount}/5 </b>
						books checked out.
					</p>
					<hr />
					{props.book &&
					props.book.copiesAvailable &&
					props.book.copiesAvailable > 0 ? (
						<h4 className="text-success">Available</h4>
					) : (
						<h4 className="text-danger">Wait List</h4>
					)}
					<div className="row">
						<div className="col-6 lead">
							<b>{props.book?.copies} </b>
							copies.
						</div>
						<div className="col-6 lead">
							<b>{props.book?.copiesAvailable} </b>
							available.
						</div>
					</div>
				</div>
				{buttonRender()}
				<hr />
				{reviewRender()}
			</div>
		</div>
	);
};
