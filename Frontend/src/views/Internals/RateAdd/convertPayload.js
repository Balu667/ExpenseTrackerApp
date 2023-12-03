import CryptoJS from "crypto-js";

export function convertPayload(
	data,
	checkGreaterRate,
	checkDifferentRate,
	fullCurrencyData,
	checkLesserRate,
	currencyCovert
) {
	const id = localStorage.getItem("allMasterId");
	const FOCFS = checkGreaterRate(
		data.ROCFS,
		data.MROCFS,
		fullCurrencyData.origin.currencyRate,
		fullCurrencyData.origin.currencyData
	);
	const FODOC = checkLesserRate(
		data.ODOC,
		data.MRODOC,
		fullCurrencyData.origin.currencyRate,
		fullCurrencyData.origin.currencyData
	);
	const FDCFS = checkGreaterRate(
		data.RDCFS,
		data.MRDCFS,
		fullCurrencyData.destination.currencyRate,
		data.CDCFS
	);
	const FDDO = checkLesserRate(
		data.DDO,
		data.MRDDO,
		fullCurrencyData.destination.currencyRate,
		data.CDDO
	);
	const SOCFS =
		currencyCovert(
			data.MROCFS,
			fullCurrencyData.origin.currencyRate,
			data.OCC
		) -
		currencyCovert(
			data.ROCFS,
			fullCurrencyData.origin.currencyRate,
			data.OCC
		);
	const SODOC =
		currencyCovert(
			data.MRODOC,
			fullCurrencyData.origin.currencyRate,
			data.OCC
		) -
		currencyCovert(
			data.RODOC,
			fullCurrencyData.origin.currencyRate,
			data.OCC
		);
	const SDCFS =
		currencyCovert(
			data.MRDCFS,
			fullCurrencyData.destination.currencyRate,
			data.OCC
		) -
		currencyCovert(
			data.RDCFS,
			fullCurrencyData.destination.currencyRate,
			data.OCC
		);
	const SDDO =
		currencyCovert(
			data.MRDDO,
			fullCurrencyData.destination.currencyRate,
			data.OCC
		) -
		currencyCovert(
			data.RDDO,
			fullCurrencyData.destination.currencyRate,
			data.OCC
		);
	const SGT =
		currencyCovert(
			data.MRDCFS,
			fullCurrencyData.destination.currencyRate,
			data.OCC
		) -
		currencyCovert(
			data.RDCFS,
			fullCurrencyData.destination.currencyRate,
			data.OCC
		) +
		currencyCovert(
			data.MRDDO,
			fullCurrencyData.destination.currencyRate,
			data.OCC
		) -
		currencyCovert(
			data.RDDO,
			fullCurrencyData.destination.currencyRate,
			data.OCC
		) +
		checkDifferentRate(
			data.ROCFS,
			data.MROCFS,
			fullCurrencyData.origin.currencyRate,
			fullCurrencyData.origin.currencyData
		) +
		checkDifferentRate(
			data.RODOC,
			data.MRODOC,
			fullCurrencyData.origin.currencyRate,
			fullCurrencyData.origin.currencyData
		) +
		Math.round(data.MRF - data.RF) +
		checkDifferentRate(
			data.OCOMR,
			data.OCOMMR,
			fullCurrencyData.destination.currencyRate,
			data.OC
		);

	const POCFS = checkLesserRate(
		data.ROCFS,
		data.MROCFS,
		fullCurrencyData.origin.currencyRate,
		fullCurrencyData.origin.currencyData
	);
	const PODOC = checkLesserRate(
		data.ODOC,
		data.MRODOC,
		fullCurrencyData.origin.currencyRate,
		fullCurrencyData.origin.currencyData
	);
	const PDCFS = checkLesserRate(
		data.RDCFS,
		data.MRDCFS,
		fullCurrencyData.destination.currencyRate,
		data.CDCFS
	);
	const PDDO = checkLesserRate(
		data.DDO,
		data.MRDDO,
		fullCurrencyData.destination.currencyRate,
		data.CDDO
	);

	const MRODOCUSD = currencyCovert(
		data.MRODOC,
		fullCurrencyData.origin.currencyRate,
		data.OCC
	);
	const MRDDOCUSD = currencyCovert(
		data.MRDDO,
		fullCurrencyData.destination.currencyRate,
		data.OCC
	);

	const payload = {
		scheduleId: data.scheduleId.value,
		scheduleInfo: {
			pol: data.scheduleId.pol,
			pod: data.scheduleId.pod,
			containerType: data.scheduleId.container,
			weight: data.scheduleId.weight,
			volume: data.scheduleId.volume,
		},
		originCost: {
			OCFS: data.OCFS,
			ODOC: data.ODOC,
			OCC: data.OCC,
		},
		originBE: {
			OGBECBM: data.OGBECBM,
			OMBECBM: data.OMBECBM,
		},
		originComparison: {
			ROCFS: data.ROCFS,
			RODOC: data.RODOC,
			MROCFS: data.MROCFS,
			MRODOC: data.MRODOC,
			MRODOCUSD,
		},
		freightCost: {
			F: data.F,
		},
		freightBE: {
			FGBECBM: data.FGBECBM,
			FMBECBM: data.FMBECBM,
		},
		freightComparison: {
			RF: data.RF,
			MRF: data.MRF,
		},
		destinationCost: {
			DCFS: data.DCFS,
			DDO: data.DDO,
			CDCFS: data.CDCFS,
			CDDO: data.CDDO,
		},
		destinationBE: {
			DGBECBM: data.DGBECBM,
			DMBECBM: data.DMBECBM,
		},
		destinationComparison: {
			RDCFS: data.RDCFS,
			RDDO: data.RDDO,
			MRDCFS: data.MRDCFS,
			MRDDO: data.MRDDO,
			MRDDOCUSD,
		},
		finalRates: {
			FOCFS,
			FODOC,
			FOT: FOCFS + FODOC,
			FF: Math.max(data.RF, data.MRF),
			FDCFS,
			FDDO,
			FDT: FDCFS + FDDO,
			USDOCFS: currencyCovert(
				data.OCFS,
				fullCurrencyData.origin.currencyRate,
				data.OCC
			),
			USDODOC: currencyCovert(
				data.ODOC,
				fullCurrencyData.origin.currencyRate,
				data.OCC
			),
			USDMROCFS: currencyCovert(
				data.MROCFS,
				fullCurrencyData.origin.currencyRate,
				data.OCC
			),
			USDROCFS: currencyCovert(
				data.ROCFS,
				fullCurrencyData.origin.currencyRate,
				data.OCC
			),
			USDDCFS: currencyCovert(
				data.DCFS,
				fullCurrencyData.destination.currencyRate,
				data.CDCFS
			),
			USDDDO: currencyCovert(
				data.DDO,
				fullCurrencyData.destination.currencyRate,
				data.CDDO
			),
			USDMRDCFS: currencyCovert(
				data.MRDCFS,
				fullCurrencyData.destination.currencyRate,
				data.CDCFS
			),
			USDRDCFS: currencyCovert(
				data.RDCFS,
				fullCurrencyData.destination.currencyRate,
				data.CDCFS
			),
			USDOR:
				fullCurrencyData.other.costHeadingData === null
					? null
					: currencyCovert(
							data.OR,
							fullCurrencyData.other.currencyRate,
							data.OC
					  ),
			USDOCOMMR:
				fullCurrencyData.other.costHeadingData === null
					? null
					: currencyCovert(
							data.OCOMMR,
							fullCurrencyData.other.currencyRate,
							data.OC
					  ),
			USDOCOMR:
				fullCurrencyData.other.costHeadingData === null
					? null
					: currencyCovert(
							data.OCOMR,
							fullCurrencyData.other.currencyRate,
							data.OC
					  ),
		},
		savingRates: {
			SOCFS,
			SODOC,
			SOT: SOCFS + SODOC,
			SF: Math.round(data.MRF - data.RF),
			SDCFS,
			SDDO,
			SDT: SDCFS + SDDO,
			SGT,
		},
		predictionRates: {
			POCFS,
			PODOC,
			POT: POCFS + PODOC,
			PF: Math.min(data.RF, data.MRF),
			PDCFS,
			PDDO,
			PDT: PDCFS + PDDO,
		},
		createdBy: id,
		status: 2,
	};
	if (fullCurrencyData.other.costHeadingData !== null) {
		payload.otherCost = {
			OCOMName: fullCurrencyData.other.costHeadingData,
			OR: data.OR,
			OC: data.OC,
		};
		payload.otherComparison = {
			OCOMName: fullCurrencyData.other.costHeadingData,
			OCOMR: data.OCOMR,
			OCOMMR: data.OCOMMR,
		};
		payload.finalRates.FOR = checkLesserRate(
			data.OR,
			data.OCOMMR,
			fullCurrencyData.destination.currencyRate,
			data.OC
		);
		payload.predictionRates.POR = checkLesserRate(
			data.OR,
			data.OCOMMR,
			fullCurrencyData.destination.currencyRate,
			data.OC
		);
		payload.savingRates.SOR = checkDifferentRate(
			data.OR,
			data.OCOMMR,
			fullCurrencyData.destination.currencyRate,
			data.OC
		);
	} else {
		payload.otherCost = {};
		payload.otherComparison = {};
	}
	const postPayload = { data: [payload] };
	const encryptedPayload = CryptoJS.AES.encrypt(
		JSON.stringify(postPayload),
		import.meta.env.VITE_ENCRYPTION_KEY
	).toString();
	return encryptedPayload;
}
