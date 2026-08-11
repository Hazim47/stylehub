const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");


const Admin = sequelize.define("Admin", {

    id:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey:true
    },


    username:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },

   email:{
 type:DataTypes.STRING,
 unique:true
},

google:{
 type:DataTypes.BOOLEAN,
 defaultValue:false
},
    password:{
 type:DataTypes.STRING,
 allowNull:true
}


});


module.exports = Admin;