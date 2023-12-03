import styles from "./style.module.css";

function FreightRate({
	register,
	division,
	watchFields,
	errors,
	setValue,
	checkCBMExceeds,
}) {
	return (
		<div className={`${styles.origindiv} ${styles.ptop}`}>
			<h1>Freight</h1>
			<div className={styles.origincon}>
				<div className={styles.costbox}>
					<h3 className={styles.origintitle}>Cost</h3>
					<div
						className={`${styles.origincontainer} ${styles.ptop3}`}>
						<div className={styles.originflex}>
							<h1 className={styles.ocfs}>Freight Rate</h1>
							<h1 className={styles.per}>Per Container</h1>
							<h3 className={styles.inrtxt}>USD </h3>
							<input
								type="number"
								onWheel={() => document.activeElement.blur()}
								{...register("F", {
									onChange: (event) => {
										setValue(
											"RF",
											division(
												event.target.value,
												watchFields.FGBECBM
											),
											{ shouldValidate: true }
										);
										setValue(
											"FMBECBM",
											division(
												event.target.value,
												watchFields.MRF
											)
										);
									},
								})}
								className={`${styles.rateinput} ${
									errors?.F ? styles.errors : ""
								}`}
								name="F"
							/>
						</div>
					</div>
				</div>
				<div className={styles.breakebox}>
					<h3 className={styles.origintitle}>Breakeven</h3>
					<div
						className={`${styles.origincontainer} ${styles.ptop3}`}>
						<div className={styles.originflex}>
							<div className={styles.bediv}>
								<h1 className={styles.per}>General BE</h1>
							</div>
							<div className={styles.cbmdiv}>
								<input
									type="number"
									onWheel={() =>
										document.activeElement.blur()
									}
									{...register("FGBECBM", {
										onChange: (event) => {
											setValue(
												"RF",
												division(
													watchFields.F,
													event.target.value
												)
											);
										},
									})}
									name="FGBECBM"
									className={`${styles.beinput} ${
										checkCBMExceeds(
											watchFields.FGBECBM,
											watchFields.scheduleId
										)
											? styles.errors
											: ""
									}${errors?.FGBECBM ? styles.errors : ""}`}
								/>
								<h3 className={styles.inrtxt}>CBM</h3>
							</div>
						</div>
						<div className={styles.originflex}>
							<div className={styles.bediv}>
								<h1 className={styles.per}>Market Rate BE</h1>
							</div>
							<div className={styles.cbmdiv}>
								<input
									type="number"
									{...register("FMBECBM")}
									name="FMBECBM"
									disabled={true}
									className={`${styles.beinput} ${
										checkCBMExceeds(
											watchFields.FMBECBM,
											watchFields.scheduleId
										)
											? styles.errorstxt
											: ""
									}`}
								/>
								<h3 className={styles.inrtxt}>CBM</h3>
							</div>
						</div>
					</div>
				</div>
				<div className={styles.compatebox}>
					<h3 className={styles.origintitle}>Comparison</h3>
					<div className={styles.comparecon}>
						<div className={styles.comaprelable}>
							<h1
								className={`${styles.per} ${styles.comparetxt}`}>
								Freight Rate
							</h1>
						</div>
						<div className={styles.comapreval}>
							<div className={styles.ratecompare}>
								<h3 className={styles.inrtxt}>Rate</h3>
								<h3 className={styles.inrtxt}>Market Rate</h3>
							</div>
							<div className={styles.ocfsvaldivdiv}>
								<input
									type="number"
									{...register("RF")}
									name="RF"
									className={styles.compareinput}
									disabled={true}
								/>
								<input
									type="number"
									onWheel={() =>
										document.activeElement.blur()
									}
									{...register("MRF", {
										onChange: (event) => {
											setValue(
												"FMBECBM",
												division(
													watchFields.F,
													event.target.value
												),
												{ shouldValidate: true }
											);
										},
									})}
									name="MRF"
									className={`${styles.compareinput} ${
										errors?.MRF ? styles.errors : ""
									}`}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
export default FreightRate;
