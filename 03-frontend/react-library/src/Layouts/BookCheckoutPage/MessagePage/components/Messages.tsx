import { useEffect, useState } from "react";
import MessageModel from "../../../../models/MessageModel";
import { useOktaAuth } from "@okta/okta-react";
import { SpinnerLoading } from "../../../Utils/SpinnerLoading";
import { Pagination } from "../../../Utils/Pagination";

export const Messages = () => {
	const { authState } = useOktaAuth();
	const [httpError, setHttpError] = useState(null);

	// Messages
	const [messages, setMessages] = useState<MessageModel[]>([]);
	const [isLoadingMessages, setIsLoadingMessages] = useState(true);

	// Pagination
	const [currentPage, setCurrentPage] = useState(1);
	const [messagePerPage] = useState(5);
	const [totalPages, setTotalPages] = useState(0);

	useEffect(() => {
		const fetchMessages = async () => {
			if (authState && authState.isAuthenticated) {
				const url = `http://localhost:8080/api/messages/search/findByUserEmail?userEmail=${
					authState?.accessToken?.claims.sub
				}&page=${currentPage - 1}&size=${messagePerPage}`;

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

		fetchMessages().catch((error) => {
			setIsLoadingMessages(false);
			setHttpError(error);
		});
		window.scrollTo(0, 0);
	}, [authState, currentPage]);

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

	return (
		<div className="mt-2">
			{messages.length > 0 ? (
				<>
					<h5>Current Q/A: </h5>
					{messages.map((message) => (
						<div key={message.id}>
							<div className="card mt-2 shadow p-3 bg-body rounder">
								<h5>
									Case #{message.id}: {message.title}
								</h5>
								<h6>{message.userEmail}</h6>
								<p>{message.question}</p>
								<hr />
								<div>
									{message.response && message.adminEmail ? (
										<>
											<h5>Response: </h5>
											<h6>{message.adminEmail} (admin)</h6>
											<p>{message.response}</p>
										</>
									) : (
										<p>
											<i>
												Pending Response from Administration. Please be patient.
											</i>
										</p>
									)}
								</div>
							</div>
						</div>
					))}
				</>
			) : (
				<p>All your Questions will be shown here.</p>
			)}

			{totalPages > 1 && (
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					paginate={paginate}
				/>
			)}
		</div>
	);
};
