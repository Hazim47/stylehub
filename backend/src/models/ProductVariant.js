const {DataTypes}=require("sequelize");

const sequelize=require("../config/database");


const ProductVariant=sequelize.define("ProductVariant",{


id:{
type:DataTypes.UUID,
defaultValue:DataTypes.UUIDV4,
primaryKey:true
},


size:{
type:DataTypes.STRING,
allowNull:false
},


stock:{
type:DataTypes.INTEGER,
defaultValue:0
},



productId:{
type:DataTypes.UUID,
allowNull:false
}


});


module.exports=ProductVariant;