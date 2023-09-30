import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Link } from "react-router-dom";
import PaymentInfoRequest from "../../models/PaymentInfoRequest";

export const PaymentPage = () => {
	const { authState } = useOktaAuth();
	const [httpError, setHttpError] = useState<any>(null);
	const [submitDisabled, setSubmitDisabled] = useState(false);
	const [fees, setFees] = useState(0);
	const [isFeesLoading, setIsFeesLoading] = useState(true);

	useEffect(() => {
		const fetchFees = async () => {
			if (authState && authState.isAuthenticated) {
				const url = `${process.env.REACT_APP_API}/payment/secure/findByUserEmail`;

				const requestOptions = {
					method: "GET",
					headers: {
						Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
						"Content-Type": "application/json",
					},
				};

				const paymentResponse = await fetch(url, requestOptions);

				if (!paymentResponse.ok) {
					throw new Error("Something went wrong");
				}

				const paymentResponseJson = await paymentResponse.json();
				setFees(paymentResponseJson.amount);
			}
			setIsFeesLoading(false);
		};

		fetchFees().catch((err) => {
			setIsFeesLoading(false);
			setHttpError(err.message);
		});
	}, [authState]);

	const elements = useElements();
	const stripe = useStripe();
	async function checkout() {
		if (!stripe || !elements || !elements.getElement(CardElement)) {
			return;
		}
		setSubmitDisabled(true);

		let paymentInfo = new PaymentInfoRequest(
			fees * 100,
			"INR",
			authState?.accessToken?.claims.sub
		);

		const url = `${process.env.REACT_APP_API}/payments/secure/payment-intent`;
		const requestOptions = {
			method: "POST",
			headers: {
				Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(paymentInfo),
		};

		const stripeResponse = await fetch(url, requestOptions);

		if (!stripeResponse.ok) {
			setSubmitDisabled(false);
			setHttpError("Something went wrong");
			throw new Error("Something went wrong");
		}

		const stripeResponseJson = await stripeResponse.json();

		stripe
			.confirmCardPayment(
				stripeResponseJson.client_secret,
				{
					payment_method: {
						card: elements.getElement(CardElement)!,
						billing_details: {
							email: authState?.accessToken?.claims.sub,
						},
					},
				},
				{ handleActions: false }
			)
			.then(async function (result: any) {
				if (result.error) {
					setSubmitDisabled(false);
					alert("Payment failed");
				} else {
					const url = `${process.env.REACT_APP_API}/payments/secure/payment-complete`;
					const requestOptions = {
						method: "PUT",
						headers: {
							Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
							"Content-Type": "application/json",
						},
					};

					const stripeResponse = await fetch(url, requestOptions);

					if (!stripeResponse.ok) {
						setSubmitDisabled(false);
						setHttpError("Something went wrong");
						throw new Error("Something went wrong");
					}
					setFees(0);
					setSubmitDisabled(false);
				}
			});
		setHttpError(false);
	}

	if (isFeesLoading) {
		return <SpinnerLoading />;
	}

	if (httpError) {
		return (
			<div className="container m-5">
				<p>{httpError}</p>
			</div>
		);
	}

	return (
		<div className="container">
			{fees > 0 && (
				<div className="card mt-3">
					<h5 className="card-header">
						Fees Pending: <span className="text-danger">${fees}</span>
					</h5>
					<div className="card-body">
						<h5 className="card-title mb-3">Credit Card</h5>
						<CardElement id="card-element" />
						<button
							disabled={submitDisabled}
							type="button"
							className="btn btn-md main-color text-white mt-3"
							onClick={checkout}
						>
							Pay Fees
						</button>
					</div>
				</div>
			)}
			{fees === 0 && (
				<div className="mt-3">
					<h5>You have no fees</h5>
					<Link type="button" className="btn main-color text-white" to="search">
						Explore Top Books
					</Link>
				</div>
			)}
			{submitDisabled && <SpinnerLoading />}
		</div>
	);
};
