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