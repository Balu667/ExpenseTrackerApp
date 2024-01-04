const User = require("../schema/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const registerUser = async (req, res) => {
    const { username, password, email } = req.body;
    let userExist, hashPass, registerUser;
    try {
        userExist = await User.findOne({ email: email });
        if (userExist != null) {

            return res.send({ status: 0, response: "User already exist", });
        }
        hashPass = await bcrypt.hash(password, 10);
        registerUser = await User.create({ username: username, password: hashPass, email: email })
        if (registerUser) {

            return res.send({ status: 1, response: "Registration Successfully" });
        }
        return res.send({ status: 0, response: "Invalid request" });
    } catch (error) {
        return res.send({ status: 0, response: error.message });
    }
};

const loginUser = async (req, res) => {
    const { password, email } = req.body;
    let userExist, matchPass, checkVerified, accessToken;
    try {
        userExist = await User.findOne({ email: email });
        if (userExist == null) {

            return res.send({ status: 0, response: "User not exist", });
        }
        matchPass = await bcrypt.compare(password, userExist.password);
        if (matchPass === false) {

            return res.send({ status: 0, response: "Password doesn't match" });
        }
        accessToken = jwt.sign({ user: { userId: userExist._id, email: userExist.email } }, process.env.JWT_SECRET, { expiresIn: "3h" });

        return res.send({ status: 1, response: "Logged in Successfully", token: accessToken, });
    } catch (error) {
        return res.send({ status: 0, response: error.message });
    }
};

const logoutUser = async (req, res) => {
    const { userId } = req.body;
    let userExist
    try {
        userExist = await User.updateOne({ _id: userId }, );
        if (userExist == null) {

            return res.send({ status: 0, response: "Invalid request", });
        }
        return res.send({ status: 1, response: "Loggedout in Successfully" });
    } catch (error) {
        return res.send({ status: 0, response: error.message });
    }
};


module.exports = { loginUser, registerUser, logoutUser }