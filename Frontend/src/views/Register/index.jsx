import styles from "./index.module.css";
// import Logo from "../../../assets/Images/AllMasterslogo.jpg";
import { AiFillEye } from "react-icons/ai";
import { BsFillEyeSlashFill } from "react-icons/bs";
import { Form, Button } from "react-bootstrap";
import { countryCodes } from "../../../assets/countryPhoneCodes";
import {
	Select,
	MenuItem,
	CircularProgress,
	Tooltip,
	Checkbox,
} from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerValidation } from "../../../validationSchema/registerValidation";
import { Controller, useForm } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { fetchData } from "../../../helper";
import Loader from "../../../components/Loader/Loader";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-toastify";
import { URL } from "../../../config";
import styled from "@emotion/styled";
import InfoIcon from "@mui/icons-material/Info";
import { saveregistration } from "../../../api/registrationApi";

const CustomisedSelect = styled(Select)`
	.MuiOutlinedInput-input {
		padding: 11px 14px !important;
	}
`;

function PhoneCodeIcon({ icon }) {
	return <img width="30" src={icon} alt="" />;
}

function Register() {
	const [passwordVisibile, setPasswordVisibile] = useState(false);
	const [confirmPasswordVisibile, setConfirmPasswordVisibile] =
		useState(false);
	const [captchaToken, setCaptchaToken] = useState(null);
	const reCaptchaRef = useRef(null);
	const {
		handleSubmit,
		formState: { errors },
		reset,
		control,
		watch,
	} = useForm({
		resolver: yupResolver(registerValidation),
		mode: "onTouched",
		defaultValues: {
			fullName: "",
			designation: "Choose Designation",
			email: "",
			mobileCode: "+91",
			mobileNumber: "",
			password: "",
			confirmPassword: "",
			termsconditions: false,
		},
	});

	const navigate = useNavigate();
	const { id } = useParams();

	const postRegistrationData = useMutation({
		mutationFn: saveregistration,
		onSuccess: (data) => {
			if (data.status === 0) {
				toast.error(data.response);
			} else {
				navigate("/otp/" + data.data);
			}
		},
		onError: (error) => {
			toast.error(error);
		},
	});

	const updateEmailData = useMutation({
		mutationFn: (data) =>
			fetchData(
				{
					url: URL + "user/userUpdate",
					method: "POST",
				},
				{
					data: [data],
				}
			),
		onSuccess: (data) => {
			toast.success(data);
			navigate("/otp/" + id);
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});

	const fetchExistingData = useMutation({
		mutationFn: () =>
			fetchData(
				{
					url: URL + "user/getUserById",
					method: "POST",
				},
				{
					data: [{ id }],
				}
			),
		onSuccess: (data) => {
			reset(data);
		},
	});

	const togglePasswordVisiblity = (type) => {
		switch (type) {
			case "password":
				setPasswordVisibile(!passwordVisibile);
				break;
			case "confirmPassword":
				setConfirmPasswordVisibile(!confirmPasswordVisibile);
				break;
			default:
				break;
		}
	};

	const preventEvents = (e) => {
		e.preventDefault();
	};

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
			if (id) {
				data.id = id;
				updateEmailData.mutate(data);
			} else {
				postRegistrationData.mutate(data);
			}
		}
	};

	useEffect(() => {
		if (id) {
			fetchExistingData.mutate();
		}
	}, []);

	if (fetchExistingData.isLoading) {
		return <Loader />;
	}

	return (
		<div className={styles.maindiv}>
			<div className="container flexdiv">
				<div className={styles.newuser}>
					<p>
						Already have an account ?{" "}
						<Link to="/login" className={styles.forgot}>
							Login
						</Link>
					</p>
				</div>
				<Form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
					<div className={styles.Logodiv}>
						<img
							src="https://ticketsque.com/assets/logo-56665aa4.svg"
							alt="AllMasters Logo"
							className="masterlogo"
						/>
						<h5 className="pt-2">Get Started</h5>
						<p>Freight Logistics Simplified</p>
					</div>
					<Form.Group className="pt-2">
						<Form.Label
							className={styles.registerlabels}
							htmlFor="fullname">
							Full Name <span style={{ color: "red" }}>*</span>
						</Form.Label>
						<Controller
							name="fullName"
							control={control}
							render={({ field }) => (
								<Form.Control
									{...field}
									type="text"
									id="fullname"
									className="form-control col-md-3"
									placeholder="ex. John Lin Doe"
									autoComplete="new-password"
								/>
							)}
						/>
						{errors.fullName && (
							<p className="errormsg">
								{errors.fullName.message}
							</p>
						)}
					</Form.Group>
					<Form.Group className="pt-2">
						<Form.Label
							className={styles.registerlabels}
							htmlFor="designation">
							Department <span style={{ color: "red" }}>*</span>
						</Form.Label>
						<Controller
							name="designation"
							control={control}
							render={({ field }) => (
								<Form.Select
									{...field}
									id="designation"
									placeholder="sd"
									autoComplete="new-password">
									<option value={""} hidden>
										Choose Designation
									</option>
									<option value={"finance"}>Finance</option>
									<option value={"generalmanagement"}>
										General Management
									</option>
									<option value={"it"}>IT</option>
									<option value={"operations"}>
										Operations
									</option>
									<option value={"procurement"}>
										Procurement
									</option>
								</Form.Select>
							)}
						/>
						{errors.designation && (
							<p className="errormsg">
								{errors.designation.message}
							</p>
						)}
					</Form.Group>
					<Form.Group className="pt-2">
						<Form.Label
							className={styles.registerlabels}
							htmlFor="mobileCode">
							Mobile Number{" "}
							<span style={{ color: "red" }}>*</span>
						</Form.Label>
						<div className={styles.mobilenodiv}>
							<div className={styles.phonecode}>
								<Controller
									name="mobileCode"
									control={control}
									render={({ field }) => (
										<CustomisedSelect
											{...field}
											sx={{
												width: "100%",
												padding: "0px",
												outline: "none",
												borderRadius: "4px 0px 0px 4px",
											}}
											id="mobileCode"
											aria-label="Phone Code">
											{countryCodes.map(
												(country, index) => (
													<MenuItem
														key={index}
														value={country.value}>
														<PhoneCodeIcon
															icon={country.icon}
														/>
													</MenuItem>
												)
											)}
										</CustomisedSelect>
									)}
								/>
							</div>
							<div className={styles.phoneno}>
								<Controller
									name="mobileNumber"
									control={control}
									render={({ field }) => (
										<Form.Control
											{...field}
											type="text"
											maxLength={10}
											onChange={(event) =>
												field.onChange(
													event.target.value.replace(
														/[^\d]+/g,
														""
													)
												)
											}
											id="phoneCode"
											className={`form-control col-md-3 ${styles.phonenumber}`}
											placeholder="Enter Mobile Number"
											autoComplete="new-password"
										/>
									)}
								/>
							</div>
						</div>
						{errors.mobileCode && (
							<p className="errormsg">
								{errors.mobileCode.message}
							</p>
						)}
						{errors.mobileNumber && (
							<p className="errormsg">
								{errors.mobileNumber.message}
							</p>
						)}
					</Form.Group>
					<Form.Group className="pt-2">
						<Form.Label
							htmlFor="email"
							className={styles.registerlabels}>
							Email Address{" "}
							<span style={{ color: "red" }}>*</span>
						</Form.Label>
						<Controller
							name="email"
							control={control}
							render={({ field }) => (
								<Form.Control
									{...field}
									type="email"
									id="email"
									className="form-control col-md-3"
									placeholder="Enter Email Address"
									autoComplete="new-password"
								/>
							)}
						/>
						{errors.email && (
							<p className="errormsg">{errors.email.message}</p>
						)}
					</Form.Group>
					<Form.Group className={`${styles.iconposition} pt-2`}>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
							}}>
							<Form.Label
								htmlFor="Password"
								className={styles.registerlabels}>
								Password <span style={{ color: "red" }}>*</span>
							</Form.Label>
							<Tooltip
								style={{ paddingBottom: "0.5rem" }}
								title="Password must be more than 8 characters long with atleast 1 Uppercase letter, 1 Lowecase letter, 1 Symbol, and 1 Number.      Example : Allmaster@2023">
								<InfoIcon />
							</Tooltip>
						</div>
						<Controller
							name="password"
							control={control}
							render={({ field }) => (
								<Form.Control
									{...field}
									type={
										passwordVisibile ? "text" : "password"
									}
									id="Password"
									className="form-control col-md-3"
									placeholder="Enter Password"
									autoComplete="new-password"
									onCut={preventEvents}
									onCopy={preventEvents}
									onPaste={preventEvents}
									maxLength={16}
								/>
							)}
						/>
						<div
							className={styles.passicons}
							onClick={() => {
								togglePasswordVisiblity("password");
							}}>
							{passwordVisibile ? (
								<BsFillEyeSlashFill />
							) : (
								<AiFillEye />
							)}
						</div>
						{errors.password && (
							<p className="errormsg">
								{errors.password.message}
							</p>
						)}
					</Form.Group>
					<Form.Group className={`${styles.iconposition} pt-2`}>
						<Form.Label
							htmlFor="ConfirmPassword"
							className={styles.registerlabels}>
							Confirm Password{" "}
							<span style={{ color: "red" }}>*</span>
						</Form.Label>
						<Controller
							name="confirmPassword"
							control={control}
							render={({ field }) => (
								<Form.Control
									{...field}
									type={
										confirmPasswordVisibile
											? "text"
											: "password"
									}
									id="ConfirmPassword"
									className="form-control col-md-3"
									placeholder="Enter Password"
									autoComplete="new-password"
									onCut={preventEvents}
									onCopy={preventEvents}
									onPaste={preventEvents}
									maxLength={16}
								/>
							)}
						/>
						<div
							className={styles.passicons}
							onClick={() => {
								togglePasswordVisiblity("confirmPassword");
							}}>
							{confirmPasswordVisibile ? (
								<BsFillEyeSlashFill />
							) : (
								<AiFillEye />
							)}
						</div>
						{errors.confirmPassword && (
							<p className="errormsg">
								{errors.confirmPassword.message}
							</p>
						)}
					</Form.Group>

					<div className="pt-3">
						<ReCAPTCHA
							class={styles.recaptcha}
							sitekey={import.meta.env.VITE_CAPTCHA_KEY}
							ref={reCaptchaRef}
							onChange={verify}
							onExpired={verify}
						/>
					</div>
					<Form.Group className="pt-2">
						<Controller
							control={control}
							name="termsconditions"
							defaultValue={true}
							render={({ field }) => (
								<Checkbox
									{...field}
									style={{
										color: "#f3cf00",
									}}
									size="small"
									checked={field.value}
									onChange={(e) =>
										field.onChange(e.target.checked)
									}
								/>
							)}
						/>
						<Form.Label>
							<a
								target="__blank"
								href="/termsconditons"
								className={styles.termsStyls}>
								Terms & Conditions
							</a>
						</Form.Label>
					</Form.Group>

					{errors.termsconditions && (
						<p className="errormsg">
							{errors.termsconditions.message}
						</p>
					)}
					<Button
						disabled={
							postRegistrationData.isLoading ||
							updateEmailData.isLoading ||
							!watch().termsconditions
						}
						type="submit"
						id="Signin"
						className={`${styles.loginbtn} w-100`}>
						{postRegistrationData.isLoading ||
						updateEmailData.isLoading ? (
							<CircularProgress />
						) : (
							"Get Started"
						)}
					</Button>
				</Form>
			</div>
		</div>
	);
}

export default Register;
