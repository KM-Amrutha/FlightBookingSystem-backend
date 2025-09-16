import mongoose, {Document} from "mongoose"


export interface Iuser extends Document {
    _id:mongoose.Schema.Types.ObjectId;
    role:"user"|"admin"|"provider";
    firstName:string;
    lastName:string;
    email:string;
    isActive:boolean;
    password:string;
    otpVerified: boolean;
    googleVerified: boolean;
    phone:string;
    dateOfBirth:string;
    gender:"male"|"female";
    profilePicture?:string;
    address1:string;
    address2?:string;
    isVerified:boolean;
}


 
  
 

