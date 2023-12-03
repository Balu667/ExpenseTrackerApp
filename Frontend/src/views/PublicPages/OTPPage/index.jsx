import styles from "./index.module.css";
import Logo from "../../../assets/Images/AllMasterslogo.jpg";
import Form from "react-bootstrap/Form";
import Line from "../../../assets/Images/otpline.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchData } from "../../../helper";
import Button from "react-bootstrap/Button";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { otpValidation } from "../../../validationSchema/otpValidation";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Loader from "../../../components/Loader/Loader";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import { URL } from "../../../config";
import { getEmail } from "../../../api/otpApi";

const OTPPage = () => {
	const [emailId, setEmailId] = useState("");
	const navigate = useNavigate();
	const { id } = useParams();
	const {
		handleSubmit,
		formState: { errors },
		control,
	} = useForm({
		resolver: yupResolver(otpValidation),
		mode: "onSubmit",
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

	const otpPost = useMutation({
		mutationFn: (data) => {
			const postData = {};
			postData.id = id;
			postData.otp = Object.values(data).join("");
			return fetchData(
				{
					url: URL + "user/verifyOtp",
					method: "POST",
					isAuthRequired: true,
				},
				{ data: [postData] }
			);
		},
		onSuccess: (response) => {
			toast.success(response);
			navigate("/login");
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});

	const resendOtpData = useMutation({
		mutationFn: () =>
			fetchData(
				{
					url: URL + "user/resendOtp",
					method: "POST",
					isAuthRequired: true,
				},
				{ data: [{ id }] }
			),
		onSuccess: (data) => {
			toast.success(data);
		},
		onError: (error) => {
			toast.error(error.message.split(":")[1]);
		},
	});

	useEffect(() => {
		emailData.mutate();
	}, []);

	const saveData = (data) => {
		otpPost.mutate(data, id);
	};

	const codeChangeHandler = (event) => {
		const currentId = event.target.id;
		const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
		const element = event.target;
		if (keys.includes(event.key) && currentId < 6) {
			const nextSibling = document.getElementById(
				`${parseInt(currentId) + 1}`
			);
			nextSibling ? nextSibling.focus() : element.blur();
		} else if (event.key === "Backspace" && currentId > 0) {
			const prevSibling = document.getElementById(currentId - 1);
			prevSibling ? prevSibling.focus() : element.blur();
		}
	};

	if (emailData.isLoading || resendOtpData.isLoading) {
		return <Loader />;
	}

	return (
		<div className={styles.maindiv}>
			<div className={`container flexdiv  ${styles.otpcon}`}>
				<Form
					id="form"
					className={styles.form}
					onSubmit={handleSubmit(saveData)}>
					<div className={styles.Logodiv}>
						<img
							src={Logo}
							alt="AllMasters Logo"
							className="masterlogo"
						/>
						<h5 className="pt-2">Enter OTP</h5>
						<p>OTP sent to {emailId}</p>
					</div>
					<div className={styles.otplabel}>
						<Form.Label className={styles.otptxt}>
							OTP <span style={{ color: "red" }}>*</span>
						</Form.Label>
						<Link
							to={`/register/${id}`}
							className={styles.Changeemail}>
							Change Email
						</Link>
					</div>
					<div className={styles.otpdiv}>
						<Controller
							name="otp1"
							control={control}
							render={({ field }) => (
								<Form.Control
									{...field}
									type="text"
									onChange={(event) =>
										field.onChange(
											event.target.value.replace(
												/[^\d]+/g,
												""
											)
										)
									}
									maxLength={1}
									id="1"
									className={styles.otp}
									placeholder="*"
									onKeyUp={(event) => {
										codeChangeHandler(event);
									}}
								/>
							)}
						/>
						<Controller
							name="otp2"
							control={control}
							render={({ field }) => (
								<Form.Control
									{...field}
									type="text"
									id="2"
									maxLength={1}
									onChange={(event) =>
										field.onChange(
											event.target.value.replace(
												/[^\d]+/g,
												""
											)
										)
									}
									className={styles.otp}
									placeholder="*"
									onKeyUp={(event) =>
										codeChangeHandler(event)
									}
								/>
							)}
						/>
						<Controller
							name="otp3"
							control={control}
							render={({ field }) => (
								<Form.Control
									{...field}
									type="text"
									id="3"
									maxLength={1}
									className={styles.otp}
									placeholder="*"
									onChange={(event) =>
										field.onChange(
											event.target.value.replace(
												/[^\d]+/g,
												""
											)
										)
									}
									onKeyUp={(event) =>
										codeChangeHandler(event)
									}
								/>
							)}
						/>
						<img src={Line} className="otpline" alt="" />
						<Controller
							name="otp4"
							control={control}
							render={({ field }) => (
								<Form.Control
									{...field}
									type="text"
									maxLength={1}
									id="4"
									className={styles.otp}
									placeholder="*"
									onChange={(event) =>
										field.onChange(
											event.target.value.replace(
												/[^\d]+/g,
												""
											)
										)
									}
									onKeyUp={(event) =>
										codeChangeHandler(event)
									}
								/>
							)}
						/>
						<Controller
							name="otp5"
							control={control}
							render={({ field }) => (
								<Form.Control
									{...field}
									type="text"
									maxLength={1}
									id="5"
									onChange={(event) =>
										field.onChange(
											event.target.value.replace(
												/[^\d]+/g,
												""
											)
										)
									}
									className={styles.otp}
									placeholder="*"
									onKeyUp={(event) =>
										codeChangeHandler(event)
									}
								/>
							)}
						/>
						<Controller
							name="otp6"
							control={control}
							render={({ field }) => (
								<Form.Control
									{...field}
									type="text"
									maxLength={1}
									id="6"
									onChange={(event) =>
										field.onChange(
											event.target.value.replace(
												/[^\d]+/g,
												""
											)
										)
									}
									className={styles.otp}
									placeholder="*"
									onKeyUp={(event) =>
										codeChangeHandler(event)
									}
								/>
							)}
						/>
					</div>
					{Object.keys(errors).length > 0 && (
						<p className="errormsg">Enter Valid OTP</p>
					)}
					<Button
						type="submit"
						id="otpsubmit"
						disabled={otpPost.isLoading || resendOtpData.isLoading}
						className={`w-100 ${styles.loginbtn}`}
						style={{ marginBottom: "5px" }}>
						{otpPost.isLoading || resendOtpData.isLoading ? (
							<CircularProgress />
						) : (
							"Submit"
						)}
					</Button>
					<div className={styles.receiveotp}>
						<p onClick={() => resendOtpData.mutate()}>
							Didn`t Receive OTP?{" "}
							<a href="#" className={styles.forgot}>
								Resend
							</a>
						</p>
					</div>
				</Form>
			</div>
		</div>
	);
};

export default OTPPage;
