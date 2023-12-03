import styles from "./style.module.css";

function OriginRate({
	register,
	division,
	roundNumber,
	fullCurrencyData,
	watchFields,
	setValue,
	errors,
	checkCBMExceeds,
}) {
	return (
		<div className={styles.origindiv}>
			<h1>Origin</h1>
			<div className={styles.origincon}>
				<div className={styles.costbox}>
					<h3 className={styles.origintitle}>Cost</h3>
					<div
						className={`${styles.origincontainer} ${styles.ptop3}`}>
						<div className={styles.originflex}>
							<h1 className={styles.ocfs}>OCFS</h1>
							<div className={styles.costperdiv}>
								<h1
									className={`${styles.per} ${styles.perdoc}`}>
									Per Container
								</h1>
								<h3 className={styles.inrtxt}>
									{fullCurrencyData.origin.currencyData}
								</h3>
							</div>
							<input
								type="number"
								onWheel={() => document.activeElement.blur()}
								{...register("OCFS", {
									onChange: (event) => {
										setValue(
											"ROCFS",
											division(
												event.target.value,
												watchFields.OGBECBM
											)
										);
										setValue(
											"OMBECBM",
											division(
												event.target.value,
												watchFields.MROCFS
											),
											{ shouldValidate: true }
										);
									},
								})}
								name="OCFS"
								className={`${styles.rateinput} ${
									errors?.OCFS ? styles.errors : ""
								}`}
							/>
						</div>
						<div className={styles.originflex}>
							<h1 className={styles.ocfs}>ODOC</h1>
							<div className={styles.costperdiv}>
								<h1
									className={`${styles.per} ${styles.perdoc}`}>
									Per Doc
								</h1>
								<h3 className={styles.inrtxt}>
									{fullCurrencyData.origin.currencyData}
								</h3>
							</div>
							<input
								type="number"
								onWheel={() => document.activeElement.blur()}
								name="ODOC"
								{...register("ODOC", {
									onChange: (event) => {
										setValue(
											"RODOC",
											roundNumber(event.target.value)
										);
									},
								})}
								className={`${styles.rateinput} ${
									errors?.ODOC ? styles.errors : ""
								}`}
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
									{...register("OGBECBM", {
										onChange: (event) => {
											setValue(
												"ROCFS",
												division(
													watchFields.OCFS,
													event.target.value
												)
											);
										},
									})}
									name="OGBECBM"
									className={`${styles.beinput} ${
										checkCBMExceeds(
											watchFields.OGBECBM,
											watchFields.scheduleId
										)
											? styles.errors
											: ""
									}${errors?.OGBECBM ? styles.errors : ""}`}
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
									{...register("OMBECBM")}
									name="OMBECBM"
									disabled={true}
									className={`${styles.beinput} ${
										checkCBMExceeds(
											watchFields.OMBECBM,
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
								OCFS
							</h1>
							<h1 className={`${styles.per} ${styles.ptop3}`}>
								ODOC
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
									{...register("ROCFS")}
									name="ROCFS"
									className={styles.beinput}
									disabled={true}
								/>
								<input
									type="number"
									onWheel={() =>
										document.activeElement.blur()
									}
									{...register("MROCFS", {
										onChange: (event) => {
											setValue(
												"OMBECBM",
												division(
													watchFields.OCFS,
													event.target.value
												),
												{ shouldValidate: true }
											);
										},
									})}
									name="MROCFS"
									className={`${styles.compareinput} ${
										errors?.MROCFS ? styles.errors : ""
									}`}
								/>
							</div>
							<div className={styles.ocfsvaldivdiv}>
								<input
									type="number"
									{...register("RODOC")}
									name="RODOC"
									className={styles.beinput}
									disabled={true}
								/>
								<input
									type="number"
									onWheel={() =>
										document.activeElement.blur()
									}
									{...register("MRODOC")}
									name="MRODOC"
									className={`${styles.beinput} ${
										errors?.MRODOC ? styles.errors : ""
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
export default OriginRate;
