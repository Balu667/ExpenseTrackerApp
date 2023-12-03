import styles from "./index.module.css";
import Logo from "../../../assets/Images/AllMasterslogo.jpg";
import { AiFillEye } from "react-icons/ai";
import { BsFillEyeSlashFill } from "react-icons/bs";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { changePasswordValidation } from "../../../validationSchema/changePasswordValidation";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import { getEmail } from "../../../api/otpApi";
import Loader from "../../../components/Loader/Loader";
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";
import { fetchData } from "../../../helper";
import { URL } from "../../../config";

function ChangePassword() {
	const { id } = useParams();
	const [passwordVisibile, setPasswordVisibile] = useState(false);
	const [emailId, setEmailId] = useState("");
	const navigate = useNavigate();
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

	const changepasswordData = useMutation({
		mutationFn: (data) =>
			fetchData(
				{
					url: URL + "user/createSubUserPassword",
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

	const emailData = useMutation({
		mutationFn: () => getEmail(id),
		onSuccess: ({ data }) => {
			setEmailId(data);
		},
		onError: () => {
			navigate("/login");
		},
	});

	useEffect(() => {
		emailData.mutate();
	}, []);

	if (emailData.isLoading) {
		return <Loader />;
	}

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

	return (
		<div className="container flexdiv">
			<Form
				className={styles.subuserForm}
				id="form"
				onSubmit={handleSubmit(onSubmit)}>
				<div className={styles.Logodiv}>
					<img
						src={Logo}
						alt="AllMasters Logo"
						className="masterlogo"
					/>
					<h5 className="pt-2">Create Password</h5>
					<p>For {emailId}</p>
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
							New Password
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
								type={passwordVisibile ? "text" : "password"}
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
						<p className="errormsg">{errors.password.message}</p>
					)}
				</Form.Group>
				<Form.Group className={`${styles.passiconposition} pt-2`}>
					<Form.Label
						className={styles.changepasslabel}
						htmlFor="confirmPassword">
						Confirm Password
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
	);
}

export default ChangePassword;
