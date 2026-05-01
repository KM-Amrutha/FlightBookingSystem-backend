
export interface IUser {
    id:string;
    role:"user"
    firstName:string;
    lastName:string;
    email:string;
    isActive:boolean;
    password:string;
    otpVerified: boolean;
    googleVerified: boolean;
    mobile:string;
    dateOfBirth:string;
    gender:"male"|"female";
    profilePicture?:string;
    address1:string;
    address2?:string;
    isVerified:boolean;
    createdAt:Date;
    updatedAt:Date;
}


 
  
 

