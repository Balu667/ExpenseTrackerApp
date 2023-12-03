import * as yup from "yup";

const excludedMail = [
	"gmail.com",
	"yahoo.com",
	"ymail.com",
	"yahoo.co.in",
	"yahoo.co.uk",
	"rocketmail.com",
	"hotmail.com",
	"live.com",
	"msn.com",
	"bing.com",
	"aol.com",
	"aim.com",
	"microsoft.com",
	"outlook.com",
	"apple.com",
	"mac.com",
	"icloud.com",
	"rediffmail.com",
	"facebook.com",
	"mailinator.com",
	"maildrop.cc",
	"yopmail.fr",
	"yopmail.net",
	"cool.fr.nf",
	"jetable.fr.nf",
	"nospam.ze.tc",
	"nomail.xl.cx",
	"mega.zik.dj",
	"speed.1s.fr",
	"courriel.fr.nf",
	"moncourrier.fr.nf",
	"monemail.fr.nf",
	"monmail.fr.nf",
	"dispostable.com",
	"spam4me.com",
	"sharklasers.com",
	"guerillamail.info",
	"guerillamail.biz",
	"guerillamail.com",
	".de",
	".net",
	".org",
	"grr.la",
	"guerillamailblock.com",
	"pokemail.net",
	"mailcatch.com",
	"mailnesia.com",
	"madvisorp.com",
	"mintemail.com",
	"mymintinbox.com",
	"superrito.com",
	"armyspy.com",
	"cuvox.de",
	"dayrep.com",
	"einrot.com",
	"fleckens.hu",
	"gustr.com",
	"jourrapide.com",
	"rhyta.com",
	"teleworm.us",
	"likemaple.com",
	"markotop.com",
	"motornation.buzz",
	"taobali.org",
	"captainjoso.com",
];

export const registerValidation = yup.object({
	fullName: yup
		.string()
		.trim()
		.required("Full Name is required")
		.matches(/^[a-zA-Z ]*$/, "Only alphabets are allowed"),
	designation: yup
		.string()
		.notOneOf(["Choose Designation"], "Department is required")
		.required("Designation is required"),
	mobileCode: yup.string().required("Country Code is required"),
	mobileNumber: yup
		.string()
		.required("Mobile Number is required")
		.matches(/^[0-9]+$/, "Enter valid Mobile Number")
		.min(10, "Should have atleast 10 numbers")
		.max(10, "Maximum 10 numbers are allowed"),
	email: yup
		.string()
		.email("Enter valid email address")
		.required("Email is required")
		.matches(
			new RegExp(
				`^[a-zA-Z0-9._-]+@(?!(${excludedMail.join(
					"|"
				)})$)[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$`
			),
			"Enter your official email"
		),
	password: yup
		.string()
		.trim()
		.required("Password is required")
		.matches(
			/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.,_]).{8,}$/,
			"Invalid Password format"
		),
	confirmPassword: yup
		.string()
		.trim()
		.required("Confirm Password is required")
		.oneOf([yup.ref("password")], "Password does not match"),
});
