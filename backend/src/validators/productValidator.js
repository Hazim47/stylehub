const {
body
}=require("express-validator");


const productValidator=[

body("name")
.notEmpty()
.withMessage("Product name required"),


body("price")
.isNumeric()
.withMessage("Price must be number"),


body("category")
.notEmpty()
.withMessage("Category required")


];


module.exports=productValidator;