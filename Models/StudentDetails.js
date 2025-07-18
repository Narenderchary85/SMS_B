import mongoose from "mongoose";

const Student=new mongoose.Schema({
    sname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    id:{
        type:String,
        required:true
    },
    fees:{
        type:Boolean,
        default:false
    },
});

const StudentDetails = mongoose.model('StudentDetails', Student);
export default StudentDetails;
