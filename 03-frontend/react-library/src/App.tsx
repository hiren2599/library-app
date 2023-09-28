import "./App.css";
import { Navbar } from "./Layouts/NavbarAndFooter/Navbar";
import { Footer } from "./Layouts/NavbarAndFooter/Footer";
import { HomePage } from "./Layouts/HomePage/HomePage";
import { SearchBooksPage } from "./Layouts/SearchBooksPage/SearchBooksPage";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import { BookCheckoutPage } from "./Layouts/BookCheckoutPage/BookCheckoutPage";
import { oktaConfig } from "./lib/oktaConfig";
import { OktaAuth, toRelativeUrl } from "@okta/okta-auth-js";
import { Security, LoginCallback, SecureRoute } from "@okta/okta-react";
import LoginWidget from "./Auth/LoginWidget";
import { ReviewListPage } from "./Layouts/BookCheckoutPage/ReviewListPage/ReviewListPage";
import { ShelfPage } from "./Layouts/ShelfPage/ShelfPage";
import { MessagePage } from "./Layouts/BookCheckoutPage/MessagePage/MessagePage";

const oktaAuth = new OktaAuth(oktaConfig);

export const App = () => {
	const customAuthHandler = () => {
		history.push("/login");
	};

	const history = useHistory();

	const restoreOriginalUri = async (_oktaAuth: any, originalUrl: any) => {
		history.replace(toRelativeUrl(originalUrl || "/", window.location.origin));
	};

	return (
		<div className="d-flex flex-column min-vh-100">
			<Security
				oktaAuth={oktaAuth}
				restoreOriginalUri={restoreOriginalUri}
				onAuthRequired={customAuthHandler}
			>
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
						<Route path="/reviewList/:bookId">
							<ReviewListPage />
						</Route>
						<Route path="/checkout/:bookId">
							<BookCheckoutPage />
						</Route>
						<Route
							path="/login"
							render={() => <LoginWidget config={oktaConfig} />}
						/>
						<Route path="/login/callback" component={LoginCallback} />
						<SecureRoute path="/shelf">
							<ShelfPage />
						</SecureRoute>
						<SecureRoute path="/messages">
							<MessagePage />
						</SecureRoute>
					</Switch>
				</div>
				<Footer />
			</Security>
		</div>
	);
};
