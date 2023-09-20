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
	const [search, setSearch] = useState("");
	const [searchUrl, setSearchUrl] = useState("");
	const [searchCategory, setSearchCategory] = useState("Book Category");

	useEffect(() => {
		const fetchBooks = async () => {
			const baseUrl = "http://localhost:8080/api/books";
			let url = "";

			if (searchUrl === "") {
				url = baseUrl + `?page=${currentPage - 1}&size=${booksPerPage}`;
			} else {
				url = baseUrl + searchUrl;
			}

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
	}, [currentPage, searchUrl]);

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

	const handleSearchChange = () => {
		if (search === "") {
			setSearchUrl("");
		} else {
			setSearchUrl(
				`/search/findByTitleContaining?title=${search}&page=0&size=${booksPerPage}`
			);
		}
	};

	const handleSearchCategoryChange = (selection: string) => {
		switch (selection.toLowerCase()) {
			case "fe":
			case "be":
			case "data":
			case "devops":
				setSearchCategory(selection);
				setSearchUrl(
					`/search/findByCategory?category=${selection}&page=0&size=${booksPerPage}`
				);
				break;
			default:
				setSearchCategory("All");
				setSearchUrl(`?page=0&size=${booksPerPage}`);
				break;
		}
	};

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
									onChange={(e) => setSearch(e.target.value)}
								/>
								<button
									className="btn btn-outline-success"
									onClick={handleSearchChange}
								>
									Search
								</button>
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
									{searchCategory}
								</button>
								<ul
									className="dropdown-menu"
									aria-labelledby="dropDownMenuItem1"
								>
									<li onClick={() => handleSearchCategoryChange("All")}>
										<a className="dropdown-item" href="#">
											All
										</a>
									</li>
									<li onClick={() => handleSearchCategoryChange("FE")}>
										<a className="dropdown-item" href="#">
											Coding - Front End
										</a>
									</li>
									<li onClick={() => handleSearchCategoryChange("BE")}>
										<a className="dropdown-item" href="#">
											Coding - Back End
										</a>
									</li>
									<li onClick={() => handleSearchCategoryChange("Data")}>
										<a className="dropdown-item" href="#">
											Coding - Data
										</a>
									</li>
									<li onClick={() => handleSearchCategoryChange("Devops")}>
										<a className="dropdown-item" href="#">
											Coding - Devops
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
					{totalAmountofBooks ? (
						<>
							<div className="mt-3">
								<h5>Number of results: {totalAmountofBooks}</h5>
							</div>
							<p>
								{firstIndexOfCurrentPage + 1} to {lastItem} of{" "}
								{totalAmountofBooks} items
							</p>
							{books.map((book) => (
								<SearchBook book={book} key={book.id} />
							))}
						</>
					) : (
						<div className="m-5">
							<h3>Can't find what you are looking for?</h3>
							<a
								type="button"
								className="btn btn-md text-white main-color me-md-2 fw-bold"
							>
								Library Services
							</a>
						</div>
					)}
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
