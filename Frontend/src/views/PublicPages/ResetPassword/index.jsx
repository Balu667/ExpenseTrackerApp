import styles from "./index.module.css";
import Logo from "../../../assets/Images/AllMasterslogo.jpg";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { resetPasswordValidation } from "../../../validationSchema/resetPasswordValidation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import ReCAPTCHA from "react-google-recaptcha";
import { fetchData } from "../../../helper";
import { URL } from "../../../config";
import { closePopup, openPopup } from "../../../redux/slices/popupSlice";
import { useDispatch } from "react-redux";
import Popup from "../../../components/ConfirmationPopup";

function ResetPassword() {
	const [captchaToken, setCaptchaToken] = useState(null);
	const reCaptchaRef = useRef(null);
	const {
		handleSubmit,
		formState: { errors },
		control,
	} = useForm({
		resolver: yupResolver(resetPasswordValidation),
		mode: "onChange",
		defaultValues: {
			email: "",
			type: "",
		},
	});
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const resetpasswordData = useMutation({
		mutationFn: (data) => {
			let payload = data;
			payload.type = parseInt(data.type);
			return fetchData(
				{
					url: URL + "user/forgotpasswordmail",
					method: "POST",
					isAuthRequired: true,
				},
				{ data: [payload] }
			);
		},
		onSuccess: () => {
			navigate("/check-inbox");
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});

	const verify = (value) => {
		setCaptchaToken(value);
	};

	const onSubmit = (data) => {
		if (
			captchaToken === null ||
			captchaToken === undefined ||
			captchaToken === ""
		) {
			toast.error("Please Enter Captcha");
		} else {
			resetpasswordData.mutate(data);
		}
	};
	const titleText = "Kind Note";
	const contentText =
		"Please know that we are currently operational only from Mumbai. Rest assured, we will soon be launching operations from more gateways. Stay tuned for further updates.";

	return (
		<div className={styles.maindiv}>
			<div className="container flexdiv">
				<div className={styles.newuser}>
					<p>
						Are you new here ?{" "}
						<button
							type="button"
							className={styles.forgot}
							onClick={() => dispatch(openPopup())}>
							Register
						</button>
					</p>
				</div>
				<Form
					className={`${styles.form}`}
					onSubmit={handleSubmit(onSubmit)}>
					<div className={styles.Logodiv}>
						<img
							src={Logo}
							alt="AllMasters Logo"
							className="masterlogo"
						/>
						<h5 className="pt-2">Reset Password</h5>
						<p>& take back control now</p>
					</div>
					<div className="form-group pt-2">
						<Form.Group className="pt-2">
							<Form.Label htmlFor="type" className="formlabel">
								Type <span style={{ color: "red" }}>*</span>
							</Form.Label>
							<Controller
								name="type"
								control={control}
								render={({ field }) => (
									<Form.Select
										{...field}
										type="number"
										id="type"
										className="formcontrol">
										<option hidden>Select Type</option>
										<option value="1">
											I am a Customer
										</option>
										<option value="2">
											I am a Partner
										</option>
									</Form.Select>
								)}
							/>
							{errors.type && (
								<span className="error">
									{errors.type.message}
								</span>
							)}
						</Form.Group>
						<Form.Label htmlFor="InputEmail">
							Email Address{" "}
							<span style={{ color: "red" }}>*</span>
						</Form.Label>
						<Controller
							name="email"
							control={control}
							render={({ field }) => (
								<Form.Control
									{...field}
									type="text"
									id="InputEmail"
									className="form-control col-md-3"
									aria-describedby="Enter email address block"
									placeholder="Enter Email Address"
								/>
							)}
						/>
						{errors.email && (
							<p className="errormsg">{errors.email.message}</p>
						)}
					</div>
					<div className="pt-1">
						<ReCAPTCHA
							className={styles.recaptcha}
							sitekey={import.meta.env.VITE_CAPTCHA_KEY}
							ref={reCaptchaRef}
							onChange={verify}
							onExpired={verify}
						/>
					</div>

					<Button
						disabled={resetpasswordData.isLoading}
						type="submit"
						className={styles.loginbtn}
						id="Resetbtn">
						{resetpasswordData.isLoading ? (
							<CircularProgress />
						) : (
							"Reset Password"
						)}
					</Button>
					<Link to="/login" className={styles.goback}>
						Go back
					</Link>
				</Form>
				<Popup
					titleText={titleText}
					contentText={contentText}
					handleAgree={() => {
						navigate("/register");
						dispatch(closePopup());
					}}
					isLogin={true}
				/>
			</div>
		</div>
	);
}

export default ResetPassword;
