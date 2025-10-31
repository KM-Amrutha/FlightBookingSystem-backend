import mongoose from 'mongoose'

const connectDB =async(): Promise<void> =>{
const url :string = process.env.ATLAS_DATABASE_CONFIG!;
  
if(!url){
    console.error("Database url is not defined");
    process.exit(1)
}
try{
    await mongoose.connect(url)
    console.log("Database connected successfully")

} catch(error){
 console.error("Error connecting to MongoDB: " ,error);
}

}

export default connectDB
