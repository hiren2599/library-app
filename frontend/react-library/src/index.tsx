import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { BrowserRouter } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
	"pk_test_51Nw20tSAphp6WlQQsSUUoVQLEMQrvgl2StqzC35z6CKI7yzFjhQXLaGpBJ2efVR3rwcFYQQGGPTdDYZA8tTA8slv00x53k1hr3"
);

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(
	<BrowserRouter>
		<Elements stripe={stripePromise}>
			<App />
		</Elements>
	</BrowserRouter>
);
