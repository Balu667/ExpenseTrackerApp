import styles from "./index.module.css";
import { AiFillEye } from "react-icons/ai";
import { BsFillEyeSlashFill } from "react-icons/bs";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginValidation } from "../../validationSchema/loginValidation";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setProfileData } from "../../redux/slices/profileSlice";
import jwtDecode from "jwt-decode";
import { CircularProgress } from "@mui/material";
import { logInApi } from "../../api/logInApi";
import { useLogoutUser } from "../../hooks/userAuthManagement";
import { closePopup, openPopup } from "../../redux/slices/popupSlice";
import Popup from "../../components/ConfirmationPopup";

const Loginpage = () => {
	const queryClient = useQueryClient();
	const [passwordVisibile, setPasswordVisibile] = useState(false);
	const {
		handleSubmit,
		formState: { errors },
		control,
		reset,
		watch,
	} = useForm({
		resolver: yupResolver(loginValidation),
		mode: "onTouched",
		defaultValues: {
			email: "",
			password: "",
		},
	});
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const watchFields = watch();
	const titleText = "Kind Note";
	const contentText =
		"Please know that we are currently operational only from Mumbai. Rest assured, we will soon be launching operations from more gateways. Stay tuned for further updates.";

	const { mutateAsync: logOut, isLoading: isLogOutLoading } = useLogoutUser(
		false,
		watchFields.type
	);

	const loginData = useMutation({
		mutationFn: (data) => logInApi(data),
		onSuccess: async (data) => {
			console.log(data,"data")
			// if (data.status === 1) {
			// 	const parsedData = JSON.parse(data.data);
			// 	const decodedData = jwtDecode(parsedData.token);
			// 	localStorage.setItem("allMasterToken", parsedData.token);
			// 	localStorage.setItem("allMasterId", parsedData.userId);
			// 	data.role = decodedData.role;
			// 	dispatch(setProfileData(decodedData));
			// 	await queryClient.refetchQueries({ queryKey: ["profileData"] });
			// } else {
			// 	if (data.status === 0 && data.data != null) {
			// 		localStorage.setItem("allMasterId", data.data);
			// 		setLoggedInCheck({
			// 			userId: data.data,
			// 			modal: true,
			// 		});
			// 	} else {
			// 		toast.error(data.response);
			// 	}
			// }
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});

	const onSubmit = (data) => {
			loginData.mutate(data);
	};

	function togglePasswordVisiblity() {
		setPasswordVisibile(!passwordVisibile);
	}

	const preventEvents = (e) => {
		e.preventDefault();
	};

	return (
		<>
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
						id="form"
						className={styles.form}
						onSubmit={handleSubmit(onSubmit)}>
						<div className={styles.Logodiv}>
							<img
								src="https://ticketsque.com/assets/logo-56665aa4.svg"
								alt="AllMasters Logo"
								className="masterlogo"
							/>
							<h5 className="pt-2">Welcome back !</h5>
							{/* <p>Book & Track your shipments</p> */}
						</div>
						<Form.Group className="pt-2">
							<Form.Label htmlFor="InputEmail1">
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
										id="InputEmail1"
										className="form-control col-md-3"
										aria-describedby="passwordHelpBlock"
										placeholder="Enter Email Address"
									/>
								)}
							/>
							{errors.email && (
								<p className="errormsg">
									{errors.email.message}
								</p>
							)}
						</Form.Group>
						<Form.Group className={`${styles.iconposition} pt-3`}>
							<Form.Label htmlFor="InputPassword1">
								Password <span style={{ color: "red" }}>*</span>
							</Form.Label>
							<Controller
								name="password"
								control={control}
								render={({ field }) => (
									<Form.Control
										{...field}
										type={
											passwordVisibile
												? "text"
												: "password"
										}
										id="InputPassword1"
										className="form-control col-md-3"
										aria-describedby="passwordHelpBlock"
										placeholder="Enter Password"
										onCut={preventEvents}
										onCopy={preventEvents}
										onPaste={preventEvents}
										maxLength={16}
									/>
								)}
							/>
							<div
								className={styles.icons}
								onClick={() => togglePasswordVisiblity()}>
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
							disabled={loginData.isLoading}
							type="submit"
							id="Signin"
							className={`${styles.loginbtn} w-100`}>
							{loginData.isLoading ? (
								<CircularProgress />
							) : (
								"Sign In"
							)}
						</Button>
					</Form>
				</div>
			</div>
			<Popup
				titleText={titleText}
				contentText={contentText}
				handleAgree={() => {
					navigate("/register");
					dispatch(closePopup());
				}}
				isLogin={true}
			/>
		</>
	);
};

export default Loginpage;
