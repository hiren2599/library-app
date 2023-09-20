import { useState, useEffect } from "react";
import BookModel from "../../models/BookModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { SearchBook } from "./components/SearchBook";
import { Pagination } from "../Utils/Pagination";

export const SearchBooksPage = () => {
	const [books, setBooks] = useState<BookModel[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [booksPerPage] = useState(5);
	const [totalPages, setTotalPages] = useState(0);
	const [totalAmountofBooks, setTotalAmountOfBooks] = useState(0);

	useEffect(() => {
		const fetchBooks = async () => {
			const baseUrl = "http://localhost:8080/api/books";
			const url = baseUrl + `?page=${currentPage - 1}&size=${booksPerPage}`;

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
	}, [currentPage]);

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

	const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
	const lastIndexOfCurrentPage = currentPage * booksPerPage;
	const firstIndexOfCurrentPage = lastIndexOfCurrentPage - booksPerPage;
	const lastItem = Math.min(lastIndexOfCurrentPage, totalAmountofBooks);

	return (
		<div>
			<div className="container">
				<div>
					<div className="row mt-5">
						<div className="col-6">
							<div className="d-flex">
								<input
									className="form-control me-2"
									type="search"
									placeholder="Search"
									aria-labelledby="Search"
								/>
								<button className="btn btn-outline-success">Search</button>
							</div>
						</div>
						<div className="col-4">
							<div className="dropdown">
								<button
									className="btn btn-secondary dropdown-toggle"
									id="dropDownMenuItem1"
									data-bs-toggle="dropdown"
									aria-expanded="false"
									type="button"
								>
									Category
								</button>
								<ul
									className="dropdown-menu"
									aria-labelledby="dropDownMenuItem1"
								>
									<li>
										<a className="dropdown-item" href="#">
											All
										</a>
									</li>
									<li>
										<a className="dropdown-item" href="#">
											Coding - Front End
										</a>
									</li>
									<li>
										<a className="dropdown-item" href="#">
											Coding - Back End
										</a>
									</li>
									<li>
										<a className="dropdown-item" href="#">
											Coding - Data
										</a>
									</li>
									<li>
										<a className="dropdown-item" href="#">
											Coding - Devops
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<div className="mt-3">
						<h5>Number of results: {totalAmountofBooks}</h5>
					</div>
					<p>
						{firstIndexOfCurrentPage + 1} to {lastItem} of {totalAmountofBooks}{" "}
						items
					</p>
					{books.map((book) => (
						<SearchBook book={book} key={book.id} />
					))}
					{totalPages > 1 && (
						<Pagination
							totalPages={totalPages}
							currentPage={currentPage}
							paginate={paginate}
						/>
					)}
				</div>
			</div>
		</div>
	);
};
