import {
Navigate
}
from "react-router-dom";


import useAuth from "./useAuth";



function RequireAdmin({children}){


const user =
useAuth(
state=>state.user
);



if(!user || user.role !== "ADMIN"){

return (

<Navigate
to="/admin/login"
/>

);

}



return children;


}


export default RequireAdmin;