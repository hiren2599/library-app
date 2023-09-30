import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import MessageModel from "../../../models/MessageModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Pagination } from "../../Utils/Pagination";
import { AdminMessage } from "./AdminMessage";
import AdminMessageRequest from "../../../models/AdminMessageRequest";

export const AdminMessages = () => {
	const { authState } = useOktaAuth();
	const [httpError, setHttpError] = useState(null);

	// Messages
	const [messages, setMessages] = useState<MessageModel[]>([]);
	const [isLoadingMessages, setIsLoadingMessages] = useState(true);

	// Pagination
	const [currentPage, setCurrentPage] = useState(1);
	const [messagePerPage] = useState(5);
	const [totalPages, setTotalPages] = useState(0);

	// Response submit
	const [responesButtonClick, setResponseButtonClick] = useState(false);

	useEffect(() => {
		const fetchUserMessages = async () => {
			if (authState && authState.isAuthenticated) {
				const url = `${
					process.env.REACT_APP_API
				}/api/messages/search/findByClosed?closed=false&page=${
					currentPage - 1
				}&size=${messagePerPage}`;

				const requestOptions = {
					method: "GET",
					headers: {
						Authorization: `Bearer ${authState.accessToken?.accessToken}`,
						"Content-Type": "application/json",
					},
				};

				const messagesResponse = await fetch(url, requestOptions);

				if (!messagesResponse.ok) {
					throw new Error("Something went wrong");
				}

				const messagesResponseJson = await messagesResponse.json();

				setMessages(messagesResponseJson._embedded.messages);
				setTotalPages(messagesResponseJson.page.totalPages);
			}
			setIsLoadingMessages(false);
		};

		fetchUserMessages().catch((error) => {
			setIsLoadingMessages(false);
			setHttpError(error);
		});
		window.scrollTo(0, 0);
	}, [authState, currentPage, responesButtonClick]);

	if (isLoadingMessages) {
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

	async function submitResponseToQuestion(id: number, response: string) {
		if (
			authState &&
			authState?.isAuthenticated &&
			id !== null &&
			response !== ""
		) {
			const url = `${process.env.REACT_APP_API}/messages/secure/admin/message`;

			const adminRequestMessage: AdminMessageRequest = new AdminMessageRequest(
				id,
				response
			);

			const requestOptions = {
				method: "PUT",
				headers: {
					Authorization: `Bearer ${authState.accessToken?.accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(adminRequestMessage),
			};

			const adminResponseQuestionResponse = await fetch(url, requestOptions);
			if (!adminResponseQuestionResponse.ok) {
				throw new Error("Something went wrong");
			}
			setResponseButtonClick(!responesButtonClick);
		}
	}

	return (
		<div className="mt-3">
			{messages.length > 0 ? (
				<>
					<h5>Pending Questions: </h5>
					{messages.map((message) => (
						<AdminMessage
							message={message}
							key={message.id}
							submitResponseToQuestion={submitResponseToQuestion}
						/>
					))}
				</>
			) : (
				<h5>No Pending Question</h5>
			)}
			{totalPages > 1 && (
				<Pagination
					currentPage={currentPage}
					paginate={paginate}
					totalPages={totalPages}
				/>
			)}
		</div>
	);
};
