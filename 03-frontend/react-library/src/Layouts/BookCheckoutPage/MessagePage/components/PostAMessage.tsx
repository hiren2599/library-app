import { useOktaAuth } from "@okta/okta-react";
import { useState } from "react";
import MessageModel from "../../../../models/MessageModel";

export const PostAMessage = () => {
	const { authState } = useOktaAuth();

	// Post a Message states
	const [title, setTitle] = useState("");
	const [question, setQuestion] = useState("");
	const [displaySuccess, setDisplaySuccess] = useState(false);
	const [displayWarning, setDisplayWarning] = useState(false);

	async function submitNewQuestion() {
		if (authState?.isAuthenticated && title !== "" && question !== "") {
			const url = `http://localhost:8080/api/messages/secure/add/message`;

			const requestMessageModel: MessageModel = new MessageModel(
				title,
				question
			);

			const requestOptions = {
				method: "POST",
				headers: {
					Authorization: `Bearer ${authState.accessToken?.accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(requestMessageModel),
			};

			const submitNewQuestionResponse = await fetch(url, requestOptions);
			if (!submitNewQuestionResponse.ok) {
				throw new Error("Something went wrong");
			}

			setTitle("");
			setQuestion("");
			setDisplayWarning(false);
			setDisplaySuccess(true);
		} else {
			setDisplayWarning(true);
			setDisplaySuccess(false);
		}
	}

	return (
		<div className="card mt-3">
			<div className="card-header">Ask question to Keep Reading Admin</div>
			<div className="card-body">
				<form method="POST">
					{displaySuccess && (
						<div className="alert alert-success" role="alert">
							Question added Successfully
						</div>
					)}
					{displayWarning && (
						<div className="alert alert-danger" role="alert">
							All fields must be filled out.
						</div>
					)}
					<div className="mb-3">
						<label className="form-label">Title</label>
						<input
							type="text"
							className="form-control"
							id="exampleFormControlInput1"
							placeholder="title"
							onChange={(e) => setTitle(e.target.value)}
							value={title}
						/>
					</div>
					<div className="mb-3">
						<label className="form-label">Question</label>
						<textarea
							className="form-control"
							id="exampleFormControlTextarea1"
							placeholder="Post your Question"
							onChange={(e) => setQuestion(e.target.value)}
							value={question}
						></textarea>
					</div>
					<div>
						<button
							type="button"
							className="btn btn-primary mt-3"
							onClick={submitNewQuestion}
						>
							Submit Question
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
