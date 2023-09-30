import { useState } from "react";
import { StarsReview } from "./StarsReview";

export const LeaveAReview: React.FC<{ submitReview: any }> = (props) => {
	const [starInput, setStarInput] = useState(0);
	const [displayInput, setDisplayInput] = useState(false);
	const [reviewDescription, setReviewDescription] = useState("");

	function starValue(value: number) {
		setStarInput(value);
		setDisplayInput(true);
	}

	return (
		<div className="dropdown" style={{ cursor: "pointer" }}>
			<h5
				className="dropdown-style"
				id="dropDownMenuButton1"
				data-bs-toggle="dropdown"
			>
				Leave a Review?
			</h5>
			<ul
				id="submitReviewRating"
				className="dropdown-menu"
				aria-labelledby="dropDownMenuButton1"
			>
				<li>
					<button className="dropdown-item" onClick={() => starValue(0)}>
						0 star
					</button>
				</li>
				<li>
					<button className="dropdown-item" onClick={() => starValue(0.5)}>
						0.5 star
					</button>
				</li>
				<li>
					<button className="dropdown-item" onClick={() => starValue(1)}>
						1 star
					</button>
				</li>
				<li>
					<button className="dropdown-item" onClick={() => starValue(1.5)}>
						1.5 star
					</button>
				</li>
				<li>
					<button className="dropdown-item" onClick={() => starValue(2)}>
						2 star
					</button>
				</li>
				<li>
					<button className="dropdown-item" onClick={() => starValue(2.5)}>
						2.5 star
					</button>
				</li>
				<li>
					<button className="dropdown-item" onClick={() => starValue(3)}>
						3 star
					</button>
				</li>
				<li>
					<button className="dropdown-item" onClick={() => starValue(3.5)}>
						3.5 star
					</button>
				</li>
				<li>
					<button className="dropdown-item" onClick={() => starValue(4)}>
						4 star
					</button>
				</li>
				<li>
					<button className="dropdown-item" onClick={() => starValue(4.5)}>
						4.5 star
					</button>
				</li>
				<li>
					<button className="dropdown-item" onClick={() => starValue(5)}>
						5 star
					</button>
				</li>
			</ul>
			<StarsReview rating={starInput} size={32} />
			{displayInput && (
				<form method="POST" action="#">
					<hr />
					<div className="mb-3">
						<label className="form-label">Description</label>
						<textarea
							className="form-control"
							id="submitReviewDescription"
							placeholder="Enter Description"
							rows={3}
							onChange={(e) => setReviewDescription(e.target.value)}
						></textarea>
					</div>
					<div>
						<button
							type="button"
							className="btn btn-primary mt-3"
							onClick={() => props.submitReview(starInput, reviewDescription)}
						>
							Submit Review
						</button>
					</div>
				</form>
			)}
		</div>
	);
};
