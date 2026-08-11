import { create } from "zustand";


const useAuth = create((set)=>({


user:
JSON.parse(
localStorage.getItem("user")
)
||
null,


token:
localStorage.getItem("token")
||
null,



login:(data)=>{


localStorage.setItem(
"token",
data.token
);


localStorage.setItem(
"user",
JSON.stringify(data.user)
);



set({

token:data.token,

user:data.user

});


},




logout:()=>{


localStorage.removeItem("token");

localStorage.removeItem("user");



set({

token:null,

user:null

});


},




}));



export default useAuth;