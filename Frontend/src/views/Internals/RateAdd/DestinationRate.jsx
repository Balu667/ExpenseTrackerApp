import styles from "./style.module.css";

function DestinatinRate({
	register,
	division,
	roundNumber,
	fullCurrencyData,
	watchFields,
	errors,
	setValue,
	checkCBMExceeds,
}) {
	return (
		<div className={`${styles.origindiv} ${styles.ptop}`}>
			<h1>Destination</h1>
			<div className={styles.origincon}>
				<div className={styles.costbox}>
					<h3 className={styles.origintitle}>Cost</h3>
					<div
						className={`${styles.origincontainer} ${styles.ptop3}`}>
						<div className={styles.originflex}>
							<h1 className={styles.ocfs}>DCFS</h1>
							<div className={styles.costperdiv}>
								<h1
									className={`${styles.per} ${styles.elleps}`}>
									Per Container
								</h1>
								<h3 className={styles.inrtxt}>
									{fullCurrencyData.destination.currencyData}
								</h3>
							</div>
							<input
								type="number"
								onWheel={() => document.activeElement.blur()}
								{...register("DCFS", {
									onChange: (event) => {
										setValue(
											"CDCFS",
											fullCurrencyData.destination
												.currencyData
										);
										setValue(
											"CDDO",
											fullCurrencyData.destination
												.currencyData
										);
										setValue(
											"RDCFS",
											division(
												event.target.value,
												watchFields.DGBECBM
											)
										);
										setValue(
											"DMBECBM",
											division(
												event.target.value,
												watchFields.MRDCFS
											),
											{ shouldValidate: true }
										);
									},
								})}
								name="DCFS"
								className={`${styles.rateinput} ${
									errors?.DCFS ? styles.errors : ""
								}`}
							/>
						</div>
						<div className={styles.originflex}>
							<h1 className={styles.ocfs}>DDO</h1>
							<div className={styles.costperdiv}>
								<h1 className={styles.per}>Per Doc</h1>
								<h3 className={styles.inrtxt}>
									{fullCurrencyData.destination.currencyData}
								</h3>
							</div>
							<input
								type="number"
								onWheel={() => document.activeElement.blur()}
								{...register("DDO", {
									onChange: (event) => {
										setValue(
											"RDDO",
											roundNumber(event.target.value)
										);
									},
								})}
								name="DDO"
								className={`${styles.rateinput} ${
									errors?.DDO ? styles.errors : ""
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
									{...register("DGBECBM", {
										onChange: (event) => {
											setValue(
												"RDCFS",
												division(
													watchFields.DCFS,
													event.target.value
												)
											);
										},
									})}
									name="DGBECBM"
									className={`${styles.beinput} ${
										checkCBMExceeds(
											watchFields.DGBECBM,
											watchFields.scheduleId
										)
											? styles.errors
											: ""
									}${errors?.DGBECBM ? styles.errors : ""}`}
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
									{...register("DMBECBM")}
									name="DMBECBM"
									disabled={true}
									className={`${styles.beinput} ${
										checkCBMExceeds(
											watchFields.DMBECBM,
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
								DCFS
							</h1>
							<h1 className={`${styles.per} ${styles.ptop3}`}>
								DDO
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
									{...register("RDCFS")}
									name="RDCFS"
									className={styles.compareinput}
									disabled={true}
								/>
								<input
									type="number"
									onWheel={() =>
										document.activeElement.blur()
									}
									{...register("MRDCFS", {
										onChange: (event) => {
											setValue(
												"DMBECBM",
												division(
													watchFields.DCFS,
													event.target.value
												),
												{ shouldValidate: true }
											);
										},
									})}
									name="MRDCFS"
									className={`${styles.compareinput} ${
										errors?.MRDCFS ? styles.errors : ""
									}`}
								/>
							</div>
							<div className={styles.ocfsvaldivdiv}>
								<input
									type="number"
									{...register("RDDO")}
									name="RDDO"
									className={styles.compareinput}
									disabled={true}
									value={roundNumber(watchFields.DDO)}
								/>
								<input
									type="number"
									onWheel={() =>
										document.activeElement.blur()
									}
									{...register("MRDDO")}
									name="MRDDO"
									className={`${styles.beinput} ${
										errors?.MRDDO ? styles.errors : ""
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
export default DestinatinRate;
