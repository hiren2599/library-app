import React from "react";
import "./App.css";
import { Navbar } from "./Layouts/NavbarAndFooter/Navbar";
import { ExploreTopBooks } from "./Layouts/HomePage/ExploreTopBooks";
import { Carousel } from "./Layouts/HomePage/Carousel";
import { Heros } from "./Layouts/HomePage/Heros";

function App() {
	return (
		<div>
			<Navbar />
			<ExploreTopBooks />
			<Carousel />
			<Heros />
		</div>
	);
}

export default App;
