const { Setting } = require("../models");


// GET SETTINGS

const getSettings = async(req,res)=>{

try{


let setting = await Setting.findOne();


if(!setting){

setting = await Setting.create({

storeName:"StyleHub"

});

}


res.json(setting);



}catch(error){

res.status(500).json({
message:error.message
});

}

};




// UPDATE SETTINGS

const updateSettings = async(req,res)=>{

try{


let setting = await Setting.findOne();


if(!setting){

setting = await Setting.create(req.body);

}else{


await setting.update(req.body);


}



res.json({

success:true,

setting

});



}catch(error){

res.status(500).json({
message:error.message
});

}

};



module.exports={
getSettings,
updateSettings
};