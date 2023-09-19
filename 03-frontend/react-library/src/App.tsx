import "./App.css";
import { Navbar } from "./Layouts/NavbarAndFooter/Navbar";
import { Footer } from "./Layouts/NavbarAndFooter/Footer";
import { HomePage } from "./Layouts/HomePage/HomePage";

function App() {
	return (
		<div>
			<Navbar />
			<HomePage />
			<Footer />
		</div>
	);
}

export default App;
