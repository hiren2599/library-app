import { useEffect, useState } from "react";
import BookModel from "../../../models/BookModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Pagination } from "../../Utils/Pagination";
import { ChangeQuantityOfBook } from "./ChangeQuantityOfBook";
import { useOktaAuth } from "@okta/okta-react";

export const ChangeQuantityOfBooks = () => {
	const { authState } = useOktaAuth();
	const [books, setBooks] = useState<BookModel[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [booksPerPage] = useState(5);
	const [totalPages, setTotalPages] = useState(0);
	const [totalAmountofBooks, setTotalAmountOfBooks] = useState(0);

	// Delete a book
	const [bookDelete, setBookDelete] = useState(false);

	useEffect(() => {
		const fetchBooks = async () => {
			const url = `http://localhost:8080/api/books?page=${
				currentPage - 1
			}&size=${booksPerPage}`;

			const response = await fetch(url);

			if (!response.ok) {
				throw new Error("Something went wrong");
			}

			const responseJson = await response.json();

			setTotalAmountOfBooks(responseJson.page.totalElements);
			setTotalPages(responseJson.page.totalPages);

			const responseData = responseJson._embedded.books;

			const loadedBooks: BookModel[] = [];
			for (const key in responseData) {
				loadedBooks.push({
					id: responseData[key].id,
					title: responseData[key].title,
					author: responseData[key].author,
					description: responseData[key].description,
					copies: responseData[key].copies,
					copiesAvailable: responseData[key].copiesAvailable,
					category: responseData[key].category,
					img: responseData[key].img,
				});
			}

			setBooks(loadedBooks);
			setIsLoading(false);
		};

		fetchBooks().catch((err) => {
			setError(err.message);
			setIsLoading(false);
		});
		window.scrollTo(0, 0);
	}, [currentPage, bookDelete]);

	if (isLoading) {
		return <SpinnerLoading />;
	}

	if (error) {
		return (
			<div className="container m-5">
				<p>{error}</p>
			</div>
		);
	}

	const deleteBook = () => setBookDelete(!bookDelete);

	const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

	const lastIndexOfCurrentPage = currentPage * booksPerPage;
	const firstIndexOfCurrentPage = lastIndexOfCurrentPage - booksPerPage;
	const lastItem = Math.min(lastIndexOfCurrentPage, totalAmountofBooks);

	return (
		<div className="container mt-5">
			{totalAmountofBooks > 0 ? (
				<>
					<div className="mt-3">
						<h3>Number of results: ({totalAmountofBooks})</h3>
					</div>
					<p>
						{firstIndexOfCurrentPage + 1} to {lastItem} of {totalAmountofBooks}{" "}
						items:
					</p>
					{books.map((book) => (
						<ChangeQuantityOfBook
							book={book}
							key={book.id}
							deleteBook={deleteBook}
						/>
					))}
				</>
			) : (
				<h5>Add a book before changing quantity</h5>
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
