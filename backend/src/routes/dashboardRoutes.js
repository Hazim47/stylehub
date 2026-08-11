const express=require("express");

const router=express.Router();

const auth=require("../middleware/auth");


const {
getDashboard
}=require("../controllers/dashboardController");



router.get(
"/",
auth,
getDashboard
);



module.exports=router;