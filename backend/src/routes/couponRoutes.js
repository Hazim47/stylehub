const express=require("express");

const router=express.Router();


const {

getCoupons,

createCoupon,

deleteCoupon,

applyCoupon


}=require("../controllers/couponController");



router.get(
"/",
getCoupons
);


router.post(
"/",
createCoupon
);



router.delete(
"/:id",
deleteCoupon
);



router.post(
"/apply",
applyCoupon
);



module.exports=router;