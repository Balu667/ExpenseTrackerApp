import styles from "./index.module.css";
import Logo from "../../../assets/Images/AllMasterslogo.jpg";
import { AiFillEye } from "react-icons/ai";
import { BsFillEyeSlashFill } from "react-icons/bs";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { changePasswordValidation } from "../../../validationSchema/changePasswordValidation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import { getCfsDetails } from "../../../hooks/cfsManagement";
import Loader from "../../../components/Loader/Loader";
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";
import { fetchData } from "../../../helper";
import { URL } from "../../../config";
function NewPassword() {
	const [passwordVisibile, setPasswordVisibile] = useState(false);
	const [confirmPasswordVisibile, setConfirmPasswordVisibile] =
		useState(false);

	const {
		handleSubmit,
		formState: { errors },
		control,
	} = useForm({
		resolver: yupResolver(changePasswordValidation),
		mode: "onTouched",
		defaultValues: {
			password: "",
			confirmPassword: "",
			otp: "",
		},
	});
	const { id } = useParams();
	const { data, isLoading, isError, error } = getCfsDetails(id);
	const navigate = useNavigate();
	const changepasswordData = useMutation({
		mutationFn: (data) =>
			fetchData(
				{
					url: URL + "cfs/updatePassword",
					method: "POST",
					isAuthRequired: true,
				},
				{ data: [data] }
			),
		onSuccess: () => {
			toast.success("Password updated Successfully");
			navigate("/login");
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});

	const togglePasswordVisiblity = (type) => {
		switch (type) {
			case "password":
				setPasswordVisibile((boolean) => !boolean);
				break;
			case "confirmPassword":
				setConfirmPasswordVisibile((boolean) => !boolean);
				break;
			default:
				break;
		}
	};

	const onSubmit = (data) => {
		data.id = id;
		changepasswordData.mutate(data);
	};

	const preventPaste = (e) => {
		e.preventDefault();
	};

	if (isLoading) {
		return <Loader />;
	}

	if (isError) {
		return <div>{error.message}</div>;
	}

	if (data.status === 1 || data.status === 2) {
		return (
			<div className="container flexdiv">
				<Form
					id="form"
					className="form"
					onSubmit={handleSubmit(onSubmit)}>
					<div className={styles.Logodiv}>
						<h5 className="pt-2">Password is already Created...</h5>
						<p>
							{" "}
							<span>Full Name</span> :{" "}
							<span>{data.fullName}</span>{" "}
						</p>
						<p>
							{" "}
							<span>Email</span> : <span>{data.email}</span>{" "}
						</p>
						<p>
							{" "}
							<span>CFS Name</span> : <span>{data.cfsName}</span>{" "}
						</p>
					</div>
					<p>
						Click here to login <Link to="/login">Login</Link>
					</p>
				</Form>
			</div>
		);
	}

	return (
		<div className={styles.maindiv}>
			<div className="container flexdiv">
				<Form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
					<div className={styles.Logodiv}>
						<img
							src={Logo}
							alt="AllMasters Logo"
							className="masterlogo"
						/>
						<h5 className="pt-2">Create Password</h5>
						<div>
							<span style={{ fontSize: "20px" }}>For</span>{" "}
							<span
								style={{ fontSize: "20px", fontWeight: "bold" }}
								className="pt-2">
								{data.email}
							</span>
						</div>
						<div>
							<p style={{ fontSize: "20px" }}>
								& take control now
							</p>
						</div>
					</div>
					<Form.Group className={`${styles.passiconposition} pt-2`}>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
							}}>
							<Form.Label
								className={styles.changepasslabel}
								htmlFor="newpassword">
								New Password{" "}
								<span style={{ color: "red" }}>*</span>
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
									id="newpassword"
									className="form-control col-md-3"
									aria-describedby="newpassword"
									placeholder="Enter New Password"
									onPaste={preventPaste}
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
					<Form.Group className={`${styles.passiconposition} pt-2`}>
						<Form.Label
							className={styles.changepasslabel}
							htmlFor="confirmPassword">
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
									id="confirmPassword"
									className="form-control col-md-3"
									aria-describedby="confirmPassword"
									placeholder="Confirm New Password"
									onPaste={preventPaste}
									maxLength={16}
								/>
							)}
						/>
						<div
							className={styles.conpassicons}
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
					<Form.Group className={`${styles.passiconposition} pt-2`}>
						<Form.Label
							className={styles.changepasslabel}
							htmlFor="otp">
							Confirm OTP <span style={{ color: "red" }}>*</span>
						</Form.Label>
						<Controller
							name="otp"
							control={control}
							render={({ field }) => (
								<Form.Control
									{...field}
									id="otp"
									className="form-control col-md-3"
									aria-describedby="otp"
									placeholder="Confirm oTP"
									maxLength={6}
								/>
							)}
						/>
						{errors.otp && (
							<p className="errormsg">{errors.otp.message}</p>
						)}
					</Form.Group>
					<Button
						disabled={changepasswordData.isLoading}
						type="submit"
						className={`${styles.loginbtn} w-100`}>
						{changepasswordData.isLoading ? (
							<CircularProgress />
						) : (
							"Create Password"
						)}
					</Button>
				</Form>
			</div>
		</div>
	);
}

export default NewPassword;
