import mongoose, {Schema} from "mongoose";

const userSchema = new Schema(
    {
    role:{ type:String,
        enum:["user","admin","provider"],
        required:true,
        default:"user"
    },
    firstName:{type:String, required:true},
    lastName: {type:String,required:true},
    email:{type:String, required:true,unique:true},
    isActive:{type:Boolean, default:true},

   password: {
      type: String,
      required: function (this: { googleVerified?: boolean }) {
        return !this.googleVerified;
      },
      default: "",
    },
    otpVerified:{type:Boolean, default:false},
    googleVerified: {type:Boolean,default:false},
    mobile:{type:String},
    dateOfBirth:{type:String},
    gender:{type:String},
    profilePicture:{type:String},
    address1:{type:String},
    address2:{type:String},
    isVerified:{type:Boolean},
   
},
{timestamps: true}

);

const UserModel = mongoose.model("User",userSchema)
export default UserModel;