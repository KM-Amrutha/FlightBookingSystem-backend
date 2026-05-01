export interface CreateUserDTO{
    firstName:string;
    lastName:string;
    email:string;
    password:string;
}

export interface UpdateUserDetailsDTO {
        userId: string;
        role:"user"|"admin"|"provider";
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
}

export interface userListDTO{
    userId: string;
    firstName:string;
    lastName:string;
    email:string;
    isActive:boolean;
    role:"user"|"admin"|"provider";
    otpVerified: boolean;
    googleVerified: boolean;
    mobile?:string;
    dateOfBirth?:string;
    gender?:"male"|"female";
    profilePicture?:string;
    address1?:string;
    address2?:string;
    createdAt?:Date;
}

export interface UpdateUserProfileDTO {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  dateOfBirth: string;
  gender: "male" | "female";
  address1: string;
  address2?: string;
  profilePicture?: string;
}

