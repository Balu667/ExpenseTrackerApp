import styles from "./index.module.css";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";
import { addUserValidation } from "../../../validationSchema/addUserValidation";
import { useInsertNewUser } from "../../../hooks/addUser";
import { ReactComponent as Back } from "../../../assets/Icons/back.svg";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { InputGroup, Form } from "react-bootstrap";
import { useProfileData } from "../../../hooks/userAuthManagement";
import Loader from "../../../components/Loader/Loader";
import { useEffect } from "react";

function AddUser() {
	const navigate = useNavigate();
	const id = localStorage.getItem("allMasterId");
	const role = useSelector((state) => state.profile.role);
	const {
		data: profileData,
		isLoading: userDataLoading,
		isSuccess: isUserDataSuccess,
	} = useProfileData(id, role);

	const {
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
		control,
	} = useForm({
		resolver: yupResolver(addUserValidation),
		mode: "onTouched",
		defaultValues: {
			fullName: "",
			legalName: "",
			emailDomain: "",
			mobileNumber: "",
			email: "",
		},
	});

	useEffect(() => {
		if (isUserDataSuccess) {
			setValue("legalName", profileData[0].legalName);
		}
	}, [isUserDataSuccess]);

	const onAddUserSuccess = (data) => {
		toast.success(data);
		navigate("/user/Myaccount");
		reset();
	};

	const { mutate: addNewUser, isLoading: addNewUseLoading } =
		useInsertNewUser(onAddUserSuccess);

	const onSubmit = (data) => {
		const postData = data;
		postData.email = `${data.email}${data.emailDomain}`;
		postData.mobileCode = "+91";
		postData.mobileNumber = Number(data.mobileNumber);
		postData.userId = profileData[0]._id;
		addNewUser(postData);
	};

	if (userDataLoading) {
		return <Loader />;
	}
	return (
		<div className="container">
			<div className={styles.mainbody}>
				<div className={styles.containerdiv}>
					<button
						className={styles.backbtn}
						type="button"
						onClick={() => navigate("/user/Myaccount")}>
						<Back />
						Back
					</button>
					<h1>Add Team Member</h1>
				</div>
				<div className={styles.accountsubdiv}>
					<div className={styles.personalcon}>
						<div className={styles.personaldiv}>
							<h2>Personal Details</h2>
						</div>
						<div className={styles.detailsdiv}>
							<Form onSubmit={handleSubmit(onSubmit)}>
								<div className={styles.fromdiv}>
									<Form.Group className={styles.formgroup}>
										<Form.Label
											htmlFor="fullName"
											className={styles.formlabel}>
											Name
										</Form.Label>
										<Controller
											name="fullName"
											control={control}
											render={({ field }) => (
												<Form.Control
													{...field}
													type="text"
													placeholder="Enter Name"
													id="fullName"
													className={styles.disable}
												/>
											)}
										/>
										{errors.fullName && (
											<p className="errormsg">
												{errors.fullName.message}
											</p>
										)}
									</Form.Group>
									<Form.Group className={styles.formgroup}>
										<Form.Label
											htmlFor="email"
											className={styles.formlabel}>
											Email
										</Form.Label>
										<InputGroup>
											<Controller
												name="email"
												control={control}
												render={({ field }) => (
													<Form.Control
														{...field}
														type="text"
														className={
															styles.emailinput
														}
														placeholder="Enter Email"
														id="email"
														autoComplete="new-password"
														onChange={(value) => {
															field.onChange(
																value
															);
															if (value !== "") {
																setValue(
																	"emailDomain",
																	`@${
																		profileData[0].email.split(
																			"@"
																		)[1]
																	}`
																);
															}
														}}
													/>
												)}
											/>
											<InputGroup.Text id="basic-addon2">
												@
												{
													profileData[0].email.split(
														"@"
													)[1]
												}
											</InputGroup.Text>
										</InputGroup>
										{errors.email && (
											<p className="errormsg">
												{errors.email.message}
											</p>
										)}
									</Form.Group>
								</div>
								<div className={styles.fromdiv}>
									<Form.Group className={styles.formgroup}>
										<Form.Label
											htmlFor="Mobile"
											className={styles.formlabel}>
											Mobile Number
										</Form.Label>
										<Controller
											name="mobileNumber"
											control={control}
											render={({ field }) => (
												<Form.Control
													{...field}
													type="text"
													id="Mobile"
													placeholder="Enter Mobile Number"
													maxLength={10}
													onChange={(event) =>
														field.onChange(
															event.target.value.replace(
																/[^\d]+/g,
																""
															)
														)
													}
													className={styles.disable}
												/>
											)}
										/>
										{errors.mobileNumber && (
											<p className="errormsg">
												{errors.mobileNumber.message}
											</p>
										)}
									</Form.Group>
									<Form.Group className={styles.formgroup}>
										<Form.Label
											htmlFor=""
											className={styles.formlabel}>
											Company Name
										</Form.Label>
										<Controller
											name="legalName"
											control={control}
											render={({ field }) => (
												<Form.Control
													{...field}
													type="text"
													id="Company Name"
													disabled={true}
													className={styles.disable}
												/>
											)}
										/>
									</Form.Group>
								</div>
								<div className={styles.btndiv}>
									<button
										type="submit"
										disabled={addNewUseLoading}
										className={styles.savebtn}>
										{addNewUseLoading ? (
											<CircularProgress />
										) : (
											"Add User"
										)}
									</button>
								</div>
							</Form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default AddUser;
