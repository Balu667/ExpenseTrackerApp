import { useEffect, useState } from "react";
import styles from "./index.module.css";
import Form from "react-bootstrap/Form";
import { yupResolver } from "@hookform/resolvers/yup";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Controller, useForm } from "react-hook-form";
import { containerManagementValidation } from "../../../../validationSchema/containerManagementValidation";
import moment from "moment";
import Loader from "../../../../components/Loader/Loader";
import { inputLengthRestriction, keyMatchLoop } from "../../../../helper";
import { useUpdateContainerData } from "../../../../hooks/bookingManagement";
import Popup from "../../../../components/ConfirmationPopup";
import { closePopup, openPopup } from "../../../../redux/slices/popupSlice";
import { useDispatch } from "react-redux";

const ContainerManagement = ({
	changeView,
	scheduleLoading,
	scheduleList,
	id,
}) => {
	const dispatch = useDispatch();
	const [sendPayload, setSendPayload] = useState(null);
	const titleText = "Update Container Management ?";
	const contentText = `Are you sure that you want to update this container data ?`;
	const {
		handleSubmit,
		formState: { errors },
		control,
		reset,
	} = useForm({
		resolver: yupResolver(containerManagementValidation),
		mode: "onTouched",
		defaultValues: {
			containerNo: "",
			sealNo: "",
			mblNo: "",
			mblDate: null,
			etd: null,
			eta: null,
			aetd: null,
			aeta: null,
		},
	});

	const onUpdateContainerSuccess = () => {
		changeView();
	};

	let { mutate: updateContainerData, isLoading: containerDataLoading } =
		useUpdateContainerData(onUpdateContainerSuccess);

	const scheduleDatas = () => {
		const scheduleData = keyMatchLoop("_id", scheduleList, id);
		scheduleData.etd = moment(scheduleData.etd);
		scheduleData.eta = moment(scheduleData.eta);
		if (scheduleData.aetd) {
			scheduleData.aetd = moment(scheduleData.aetd);
		}
		if (scheduleData.aeta) {
			scheduleData.aeta = moment(scheduleData.aeta);
		}
		if (scheduleData.mblDate) {
			scheduleData.mblDate = moment(scheduleData.mblDate);
		}
		reset(scheduleData);
	};

	useEffect(() => {
		if (scheduleList) {
			scheduleDatas();
		}
	}, [scheduleList]);

	if (scheduleLoading || containerDataLoading) {
		return <Loader />;
	}

	const onSubmit = (data) => {
		const etaDate = moment(data.eta).format("DD-MM-YYYY");
		const postData = {
			containerNo: data.containerNo,
			sealNo: data.sealNo,
			mblNo: data.mblNo,
			mblDate: data.mblDate,
			eta: etaDate,
			aetd: data.aetd,
			aeta: data.aeta,
			id,
		};
		setSendPayload(postData);
		dispatch(openPopup());
	};

	function handleAgree() {
		updateContainerData(sendPayload);
		dispatch(closePopup());
	}

	const preventSpace = (event) => {
		if (event.key === " ") {
			event.preventDefault();
		}
	};

	return (
		<div className={styles.personalcon}>
			<div className={styles.personaldiv}>
				<h2>Container Management</h2>
			</div>
			<div className={styles.detailsdiv}>
				<Form onSubmit={handleSubmit(onSubmit)}>
					<div className={styles.fromdiv}>
						<Form.Group className={styles.formgroup}>
							<Form.Label
								htmlFor="cnumber"
								className={styles.formlabel}>
								Container Number
							</Form.Label>

							<Controller
								name="containerNo"
								control={control}
								render={({ field }) => (
									<Form.Control
										{...field}
										type="text"
										id="cnumber"
										placeholder="Enter Container Number"
										onKeyDown={preventSpace}
										onInput={(event) =>
											inputLengthRestriction(event, 11)
										}
										className={styles.disable}
									/>
								)}
							/>
							{errors.containerNo && (
								<span className="error">
									{errors.containerNo.message}
								</span>
							)}
						</Form.Group>

						<Form.Group className={styles.formgroup}>
							<Form.Label
								htmlFor="sealNo"
								className={styles.formlabel}>
								Seal Number
							</Form.Label>
							<Controller
								name="sealNo"
								control={control}
								render={({ field }) => (
									<Form.Control
										{...field}
										type="text"
										placeholder="Enter Seal Number"
										onKeyDown={preventSpace}
										id="sealNo"
										className={styles.disable}
									/>
								)}
							/>
							{errors.sealNo && (
								<span className="error">
									{errors.sealNo.message}
								</span>
							)}
						</Form.Group>
					</div>
					<div className={styles.fromdiv}>
						<Form.Group className={styles.formgroup}>
							<Form.Label
								htmlFor="MBL"
								className={styles.formlabel}>
								MBL Number
							</Form.Label>
							<Controller
								name="mblNo"
								control={control}
								render={({ field }) => (
									<Form.Control
										{...field}
										placeholder="Enter MBL Number"
										type="text"
										onKeyDown={preventSpace}
										id="MBL"
										className={styles.disable}
									/>
								)}
							/>
							{errors.mblNo && (
								<span className="error">
									{errors.mblNo.message}
								</span>
							)}
						</Form.Group>
						<Form.Group className={styles.formgroup}>
							<Form.Label
								htmlFor="mblDate"
								className={styles.formlabel}>
								MBL Date
							</Form.Label>
							<Controller
								name="mblDate"
								control={control}
								render={({ field }) => (
									<DatePicker
										{...field}
										type="date"
										slotProps={{
											textField: {
												readOnly: true,
											},
										}}
										id="mblDate"
										views={["year", "month", "day"]}
										format="DD-MM-YYYY"
										className={styles.date}
									/>
								)}
							/>
							{errors.mblDate && (
								<span className="error">
									{errors.mblDate.message}
								</span>
							)}
						</Form.Group>
					</div>
					<div className={styles.fromdiv}>
						<Form.Group className={styles.formgroup}>
							<Form.Label
								htmlFor="etd"
								className={styles.formlabel}>
								ETD
							</Form.Label>
							<Controller
								name="etd"
								control={control}
								render={({ field }) => (
									<DatePicker
										{...field}
										type="date"
										id="etd"
										slotProps={{
											textField: {
												readOnly: true,
											},
										}}
										disabled
										views={["year", "month", "day"]}
										format="DD-MM-YYYY"
										className={styles.date}
									/>
								)}
							/>
						</Form.Group>
						<Form.Group className={styles.formgroup}>
							<Form.Label
								htmlFor="eta"
								className={styles.formlabel}>
								ETA
							</Form.Label>
							<Controller
								name="eta"
								control={control}
								render={({ field }) => (
									<DatePicker
										{...field}
										type="date"
										id="eta"
										slotProps={{
											textField: {
												readOnly: true,
											},
										}}
										views={["year", "month", "day"]}
										format="DD-MM-YYYY"
										className={styles.date}
									/>
								)}
							/>
						</Form.Group>
					</div>
					<div className={styles.fromdiv}>
						<Form.Group className={styles.formgroup}>
							<Form.Label
								htmlFor="aetd"
								className={styles.formlabel}>
								ATD
							</Form.Label>
							<Controller
								name="aetd"
								control={control}
								render={({ field }) => (
									<DatePicker
										{...field}
										type="date"
										id="aetd"
										slotProps={{
											textField: {
												readOnly: true,
											},
										}}
										views={["year", "month", "day"]}
										format="DD-MM-YYYY"
										className={styles.date}
									/>
								)}
							/>
							{errors.aetd && (
								<span className="error">
									{errors.aetd.message}
								</span>
							)}
						</Form.Group>
						<Form.Group className={styles.formgroup}>
							<Form.Label
								htmlFor="aeta"
								className={styles.formlabel}>
								ATA
							</Form.Label>
							<Controller
								name="aeta"
								control={control}
								render={({ field }) => (
									<DatePicker
										{...field}
										type="date"
										id="aeta"
										slotProps={{
											textField: {
												readOnly: true,
											},
										}}
										views={["year", "month", "day"]}
										format="DD-MM-YYYY"
										className={styles.date}
									/>
								)}
							/>
							{errors.aeta && (
								<span className="error">
									{errors.aeta.message}
								</span>
							)}
						</Form.Group>
					</div>
					<div className={styles.btndiv}>
						<button
							type="button"
							onClick={() => changeView()}
							className={styles.cancelbtn}>
							Cancel
						</button>
						<button type="submit" className={styles.savebtn}>
							Save Changes
						</button>
					</div>
					<Popup
						titleText={titleText}
						contentText={contentText}
						handleAgree={handleAgree}
					/>
				</Form>
			</div>
		</div>
	);
};

export default ContainerManagement;
