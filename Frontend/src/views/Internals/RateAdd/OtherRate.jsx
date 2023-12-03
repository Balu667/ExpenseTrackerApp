import styles from "./style.module.css";

function OtherRate({
	register,
	roundNumber,
	fullCurrencyData,
	errors,
	setValue,
}) {
	return (
		<div className={`${styles.origindiv} ${styles.ptop}`}>
			{fullCurrencyData.other.costHeadingData && (
				<>
					<h1>Other</h1>
					<div className={styles.origincon}>
						<div className={styles.costbox}>
							<h3 className={styles.origintitle}>Cost</h3>
							<div
								className={`${styles.origincontainer} ${styles.ptop3}`}>
								<div className={styles.originflex}>
									<h1
										className={`${styles.ocfs} ${styles.elleps} text-uppercase`}>
										{fullCurrencyData.other.costHeadingData}
									</h1>
									<h1 className={styles.per}>Per Doc</h1>
									<h3 className={styles.inrtxt}>USD</h3>
									<input
										type="number"
										onWheel={() =>
											document.activeElement.blur()
										}
										{...register("OR", {
											onChange: (event) => {
												setValue(
													"OCOMR",
													roundNumber(
														event.target.value
													)
												);
											},
										})}
										name="OR"
										className={`${styles.rateinput} ${
											errors?.OR ? styles.errors : ""
										}`}
									/>
								</div>
							</div>
						</div>
						<div className={styles.compatebox}>
							<h3 className={styles.origintitle}>Comparison</h3>
							<div className={styles.comparecon}>
								<div className={styles.comaprelable}>
									<h1
										className={`${styles.per} ${styles.comparetxt} ${styles.elleps} text-uppercase`}>
										{fullCurrencyData.other.costHeadingData}
									</h1>
								</div>
								<div className={styles.comapreval}>
									<div className={styles.ratecompare}>
										<h3 className={styles.inrtxt}>Rate</h3>
										<h3 className={styles.inrtxt}>
											Market Rate
										</h3>
									</div>
									<div className={styles.ocfsvaldivdiv}>
										<input
											type="number"
											{...register("OCOMR")}
											name="OCOMR"
											className={styles.compareinput}
											disabled={true}
										/>
										<input
											type="number"
											onWheel={() =>
												document.activeElement.blur()
											}
											{...register("OCOMMR")}
											name="OCOMMR"
											className={`${
												styles.compareinput
											} ${
												errors?.OCOMMR
													? styles.errors
													: ""
											}`}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
export default OtherRate;
