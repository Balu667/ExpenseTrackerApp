const Category = require("../schema/category")

const createCategory = async (req, res) => {
    const { name } = req.body;
    let categoryExist, CategoryCreated;
    try {
        categoryExist = await Category.findOne({ name: name })
        if (categoryExist == null) {
            CategoryCreated = await Category.create({ name: name })
            if (CategoryCreated) {

                return res.send({ status: 1, response: "New categories added" });
            }
            return res.send({ status: 0, response: "Something went wrong" })
        }
        return res.send({ status: 0, response: "Invalid request" });
    } catch (error) {
        return res.send({ status: 0, response: error.message });
    }
};

const getAllCategory = async (req, res) => {
    let categoryExist;
    try {
        categoryExist = await Category.find({})
        if (categoryExist == null) {

            return res.send({ status: 0, response: "No category found" })
        }

        return res.send({ status: 1, data: JSON.stringify(categoryExist) })
    } catch (error) {
        return res.send({ status: 0, response: error.message });
    }
};

module.exports = { createCategory, getAllCategory }
