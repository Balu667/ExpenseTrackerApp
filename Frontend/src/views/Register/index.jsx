import styles from "./index.module.css";
import { AiFillEye } from "react-icons/ai";
import { BsFillEyeSlashFill } from "react-icons/bs";
import { Form, Button } from "react-bootstrap";
import {
	CircularProgress,
	Tooltip
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerValidation } from "../../validationSchema/registerValidation";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import InfoIcon from "@mui/icons-material/Info";
import { saveregistration } from "../../api/services";

function Register() {
	const [passwordVisibile, setPasswordVisibile] = useState(false);
	const [confirmPasswordVisibile, setConfirmPasswordVisibile] =
		useState(false);
	const {
		handleSubmit,
		formState: { errors },
		control
	} = useForm({
		resolver: yupResolver(registerValidation),
		mode: "onTouched",
		defaultValues: {
			username: "",
			email: "",
			password: ""
		},
	});

	const navigate = useNavigate();

	const postRegistrationData = useMutation({
		mutationFn: saveregistration,
		onSuccess: (data) => {
			if (data.status === 0) {
				toast.error(data.response);
			} else {
				navigate("/login");
			}
		},
		onError: (error) => {
			toast.error(error);
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

	const onSubmit = (data) => {
		postRegistrationData.mutate(data);
	};

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
						<h1>Expense Tracker</h1>
						<h5 className="pt-2">Get Started</h5>
					</div>
					<Form.Group className="pt-2">
						<Form.Label
							className={styles.registerlabels}
							htmlFor="username">
							Full Name <span style={{ color: "red" }}>*</span>
						</Form.Label>
						<Controller
							name="username"
							control={control}
							render={({ field }) => (
								<Form.Control
									{...field}
									type="text"
									id="username"
									className="form-control col-md-3"
									placeholder="ex. John Lin Doe"
									autoComplete="new-password"
								/>
							)}
						/>
						{errors.username && (
							<p className="errormsg">
								{errors.username.message}
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
					<Button
						type="submit"
						id="Signin"
						className={`${styles.loginbtn} w-100`}>
						{postRegistrationData.isLoading
							? (
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
