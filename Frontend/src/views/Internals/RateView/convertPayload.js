import CryptoJS from "crypto-js";

export function convertPayload(
	data,
	singleRateData,
	checkGreaterRate,
	checkDifferentRate,
	checkLesserRate,
	currencyCovert,
	Originrate,
	destinationrate,
	usdRates
) {
	const id = localStorage.getItem("allMasterId");
	const FOCFS = checkGreaterRate(
		data.ROCFS,
		data.MROCFS,
		Originrate,
		data.OCC
	);
	const FODOC = checkLesserRate(data.ODOC, data.MRODOC, Originrate, data.OCC);
	const FDCFS = checkGreaterRate(
		data.RDCFS,
		data.MRDCFS,
		destinationrate,
		data.CDCFS
	);
	const FDDO = checkLesserRate(
		data.DDO,
		data.MRDDO,
		destinationrate,
		data.CDDO
	);
	const SOCFS =
		currencyCovert(data.MROCFS, Originrate, data.OCC) -
		currencyCovert(data.ROCFS, Originrate, data.OCC);
	const SODOC =
		currencyCovert(data.MRODOC, Originrate, data.OCC) -
		currencyCovert(data.RODOC, Originrate, data.OCC);
	const SDCFS =
		currencyCovert(data.MRDCFS, destinationrate, data.OCC) -
		currencyCovert(data.RDCFS, destinationrate, data.OCC);
	const SDDO =
		currencyCovert(data.MRDDO, destinationrate, data.OCC) -
		currencyCovert(data.RDDO, destinationrate, data.OCC);
	const SGT =
		currencyCovert(data.MRDCFS, destinationrate, data.OCC) -
		currencyCovert(data.RDCFS, destinationrate, data.OCC) +
		currencyCovert(data.MRDDO, destinationrate, data.OCC) -
		currencyCovert(data.RDDO, destinationrate, data.OCC) +
		checkDifferentRate(data.ROCFS, data.MROCFS, Originrate, data.OCC) +
		checkDifferentRate(data.RODOC, data.MRODOC, Originrate, data.OCC) +
		Math.round(data.MRF - data.RF) +
		checkDifferentRate(data.OCOMR, data.OCOMMR, destinationrate, data.OC);

	const POCFS = checkLesserRate(
		data.ROCFS,
		data.MROCFS,
		Originrate,
		data.OCC
	);
	const PODOC = checkLesserRate(data.ODOC, data.MRODOC, Originrate, data.OCC);
	const PDCFS = checkLesserRate(
		data.RDCFS,
		data.MRDCFS,
		destinationrate,
		data.CDCFS
	);
	const PDDO = checkLesserRate(
		data.DDO,
		data.MRDDO,
		destinationrate,
		data.CDDO
	);

	const MRODOCUSD = currencyCovert(data.MRODOC, Originrate, data.OCC);
	const MRDDOCUSD = currencyCovert(data.MRDDO, destinationrate, data.OCC);

	const payload = {
		id: singleRateData._id,
		scheduleId: singleRateData.scheduleId,
		scheduleInfo: {
			pol: singleRateData.scheduleInfo.pol,
			pod: singleRateData.scheduleInfo.pod,
			containerType: singleRateData?.scheduleInfo.containerType,
			weight: singleRateData.scheduleInfo.weight,
			volume: singleRateData.scheduleInfo.volume,
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
			USDOCFS: currencyCovert(data.OCFS, Originrate, data.OCC),
			USDODOC: currencyCovert(data.ODOC, Originrate, data.OCC),
			USDMROCFS: currencyCovert(data.MROCFS, Originrate, data.OCC),
			USDROCFS: currencyCovert(data.ROCFS, Originrate, data.OCC),
			USDDCFS: currencyCovert(data.DCFS, destinationrate, data.CDCFS),
			USDDDO: currencyCovert(data.DDO, destinationrate, data.CDDO),
			USDMRDCFS: currencyCovert(data.MRDCFS, destinationrate, data.CDCFS),
			USDRDCFS: currencyCovert(data.RDCFS, destinationrate, data.CDCFS),
			USDOR:
				singleRateData.otherCost.OCOMName === null
					? null
					: currencyCovert(data.OR, usdRates, data.OC),
			USDOCOMMR:
				singleRateData.otherCost.OCOMName === null
					? null
					: currencyCovert(data.OCOMMR, usdRates, data.OC),
			USDOCOMR:
				singleRateData.otherCost.OCOMName === null
					? null
					: currencyCovert(data.OCOMR, usdRates, data.OC),
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
		status: 1,
	};
	if (singleRateData.otherCost !== undefined) {
		payload.otherCost = {
			OCOMName: singleRateData.otherCost.OCOMName,
			OR: data.OR,
			OC: data.OC,
		};
		payload.otherComparison = {
			OCOMName: singleRateData.otherCost.OCOMName,
			OCOMR: data.OCOMR,
			OCOMMR: data.OCOMMR,
		};
		payload.finalRates.FOR = checkLesserRate(
			data.OR,
			data.OCOMMR,
			destinationrate,
			data.OC
		);
		payload.predictionRates.POR = checkLesserRate(
			data.OR,
			data.OCOMMR,
			destinationrate,
			data.OC
		);
		payload.savingRates.SOR = checkDifferentRate(
			data.OR,
			data.OCOMMR,
			destinationrate,
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
