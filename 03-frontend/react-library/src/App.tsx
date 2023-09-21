import "./App.css";
import { Navbar } from "./Layouts/NavbarAndFooter/Navbar";
import { Footer } from "./Layouts/NavbarAndFooter/Footer";
import { HomePage } from "./Layouts/HomePage/HomePage";
import { SearchBooksPage } from "./Layouts/SearchBooksPage/SearchBooksPage";
import { Redirect, Route, Switch } from "react-router-dom";
import { BookCheckoutPage } from "./Layouts/BookCheckoutPage/BookCheckoutPage";

export const App = () => {
	return (
		<div className="d-flex flex-column min-vh-100">
			<Navbar />
			<div className="flex-grow-1">
				<Switch>
					<Route path="/" exact>
						<Redirect to="/home" />
					</Route>
					<Route path="/home" exact>
						<HomePage />
					</Route>
					<Route path="/search">
						<SearchBooksPage />
					</Route>
					<Route path="/checkout">
						<BookCheckoutPage />
					</Route>
				</Switch>
			</div>
			<Footer />
		</div>
	);
};
