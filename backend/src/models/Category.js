const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");


const Category = sequelize.define("Category",{


id:{
type:DataTypes.UUID,
defaultValue:DataTypes.UUIDV4,
primaryKey:true
},


name:{
type:DataTypes.STRING,
allowNull:false
},


image:{
type:DataTypes.STRING
},


isActive:{
type:DataTypes.BOOLEAN,
defaultValue:true
}


});


module.exports = Category;