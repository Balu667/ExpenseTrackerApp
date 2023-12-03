import styles from "./index.module.css";

export function CheckoutCargoDetails({ data }) {
	function checkRadius(cargo) {
		if (cargo.packageType === "barrels" || cargo.packageType === "rolls") {
			return `${cargo.radius} x ${cargo.height} ${cargo.metric}`;
		} else {
			return `${cargo.length} x ${cargo.breadth} x ${cargo.height} ${cargo.metric}`;
		}
	}

	return (
		<>
			{data.cargoDetails.map((cargo, index) => (
				<div key={index}>
					<div className={styles.detailsdiv}>
						<p className={styles.detailsdivlabel}>Stackable</p>
						<div className={styles.dotted}></div>
						<p className={styles.detailsdivval}>
							{data.cargoType === "stackable" ? "YES" : "NO"}
						</p>
					</div>
					<div className={styles.detailsdiv}>
						<p className={styles.detailsdivlabel}>Package Type</p>
						<div className={styles.dotted}></div>
						<p className={styles.detailsdivval}>
							{cargo.packageType}
						</p>
					</div>
					<div className={styles.detailsdiv}>
						<p className={styles.detailsdivlabel}>Dimensions</p>
						<div className={styles.dotted}></div>
						<p className={styles.detailsdivval}>
							{checkRadius(cargo)}
						</p>
					</div>
					<div className={styles.detailsdiv}>
						<p className={styles.detailsdivlabel}>
							Weight per Package
						</p>
						<div className={styles.dotted}></div>
						<p className={styles.detailsdivval}>
							{cargo.weightPerPackage} Kg
						</p>
					</div>
					<div className={styles.detailsdiv}>
						<p className={styles.detailsdivlabel}>
							No. of Packages
						</p>
						<div className={styles.dotted}></div>
						<p className={styles.detailsdivval}>
							{cargo.noOfPackage}
						</p>
					</div>
					<div className={styles.detailsdiv}>
						<p className={styles.detailsdivlabel}>Commodity</p>
						<div className={styles.dotted}></div>
						<p className={styles.detailsdivval}>
							{cargo.commodity}
						</p>
					</div>
					<div className={styles.detailsdiv}>
						<p className={styles.detailsdivlabel}>HSN Code</p>
						<div className={styles.dotted}></div>
						<p className={styles.detailsdivval}>
							{cargo.hsnCode.split("-")[0]}
						</p>
					</div>
					{data?.volume && (
						<div className={styles.detailsdiv}>
							<p className={styles.detailsdivlabel}>Volume</p>
							<div className={styles.dotted}></div>
							<p className={styles.detailsdivval}>
								{data.volume < 1
									? 1
									: Number(data.volume).toFixed(1)}{" "}
								CBM
							</p>
						</div>
					)}
					<div className={styles.detailsdiv}>
						<p className={styles.detailsdivlabel}>Gross Weight</p>
						<div className={styles.dotted}></div>
						<p className={styles.detailsdivval}>
							{cargo.weight} kg
						</p>
					</div>
				</div>
			))}
			{data.cargoDetails.length > 1 && (
				<div className={styles.detailsdiv}>
					<p className={styles.detailsdivlabel}>Total Gross Weight</p>
					<div className={styles.dotted}></div>
					<p className={styles.detailsdivval}>{data.totalWt} kg</p>
				</div>
			)}
		</>
	);
}
