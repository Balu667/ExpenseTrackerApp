import { Dialog } from "@mui/material";
import { AiOutlineClose } from "react-icons/ai";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { invoiceValidation } from "../../validationSchema/invoiceValidation";
import styles from "./index.module.css";
import styled from "@emotion/styled";
import moment from "moment";

const CustomDialog = styled(Dialog)`
	.MuiDialog-paper {
		background: "red" !important;
		border-radius: 10px important;
	}
`;

export default function Paymentpopup({
	handleClose,
	modalOpen,
	portName,
	bookingId,
	confirmClick,
	bId,
}) {
	const {
		handleSubmit,
		formState: { errors },
		control,
		reset,
	} = useForm({
		resolver: yupResolver(invoiceValidation),
		mode: "onTouched",
		defaultValues: {
			utrNo: "",
			utrDate: null,
		},
	});

	const submitHandler = (data) => {
		const utrDate = moment(data.utrDate).format("DD-MM-YYYY");
		confirmClick({ bookingId, status: 11, utrNo: data.utrNo, utrDate });
	};

	function removeErrors() {
		reset({ utrNo: "", utrDate: null });
		handleClose();
	}

	return (
		<CustomDialog
			open={modalOpen}
			onClose={() => removeErrors()}
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description">
			<div className={styles.popupdiv}>
				<div className={styles.headdiv}>
					<button
						className={styles.closebtn}
						onClick={() => removeErrors()}>
						<AiOutlineClose />
					</button>
				</div>
				<h2 className={styles.paymentdetails}>Payment Details</h2>
				<p className={styles.pleasetxt}>
					Please share payment details regarding the below booking
				</p>
				<div className={styles.portdiv}>
					<h1 className={styles.port}>{portName}</h1>
					<p className={styles.bookingid}>Booking ID: #{bId}</p>
				</div>
				<Form onSubmit={handleSubmit(submitHandler)}>
					<div className={styles.inputdiv}>
						<Form.Group className={styles.utanumber}>
							<Form.Label htmlFor="utrNo" className="formlabel">
								UTR Number
							</Form.Label>
							<Controller
								name="utrNo"
								control={control}
								render={({ field }) => (
									<Form.Control
										{...field}
										type="text"
										id="utrNo"
										className="formcontrol"
										placeholder="Enter UTR Number"
									/>
								)}
							/>
							{errors.utrNo && (
								<span className="error">
									{errors.utrNo.message}
								</span>
							)}
						</Form.Group>

						<Form.Group className={styles.utanumber}>
							<Form.Label htmlFor="utrDate" className="formlabel">
								UTR Date
							</Form.Label>
							<Controller
								name="utrDate"
								control={control}
								render={({ field }) => (
									<DatePicker
										{...field}
										className="datepicker"
										value={field.value}
										id="utrDate"
										views={["year", "month", "day"]}
										format="DD-MM-YYYY"
									/>
								)}
							/>
							{errors.utrDate && (
								<span className="error">
									{errors.utrDate.message}
								</span>
							)}
						</Form.Group>
					</div>
					<div>
						<button type="submit" className={styles.confirm}>
							Confirm Details
						</button>
					</div>
				</Form>
			</div>
		</CustomDialog>
	);
}
