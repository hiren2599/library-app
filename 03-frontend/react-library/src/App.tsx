import React from "react";
import "./App.css";
import { Navbar } from "./Layouts/NavbarAndFooter/Navbar";
import { ExploreTopBooks } from "./Layouts/HomePage/ExploreTopBooks";
import { Carousel } from "./Layouts/HomePage/Carousel";
import { Heros } from "./Layouts/HomePage/Heros";
import { LibraryServices } from "./Layouts/HomePage/LibraryServices";
import { Footer } from "./Layouts/NavbarAndFooter/Footer";

function App() {
	return (
		<div>
			<Navbar />
			<ExploreTopBooks />
			<Carousel />
			<Heros />
			<LibraryServices />
			<Footer />
		</div>
	);
}

export default App;
