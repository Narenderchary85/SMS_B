import StudentDetails from '../Models/StudentDetails.js';

export default function oneSocket(io) {
    io.on('connection', (socket) => {

        socket.on("getStudentDetails",async(callback)=>{
            try{
                const students = await StudentDetails.find({});
                callback({ success: true, data: students });
                io.emit("EmitDetails")
            }catch(err){
                console.error("Error fetching student details:", err);
                callback({ success: false, error: "Failed to fetch student details." });
            }
        })

        socket.on("getStudent",async(id,callback)=>{
            try{
                const student = await StudentDetails.findOne({_id:id});
                callback({ success: true, data: student });
                io.emit("EmitStudent")
            }catch(err){
                console.error("Error fetching student details:", err);
                callback({ success: false, error: "Failed to fetch student details." });
            }
        });

        socket.on('updateStudent', async (updateData, callback) => {
            try {
                const { id, sname, email } = updateData;
        
                if (!id || !sname || !email) {
                    return callback({ success: false, error: "Missing required fields (id, name, email)." });
                }
        
                const updatedStudent = await StudentDetails.findByIdAndUpdate(
                    id,
                    { sname: sname, email: email },
                    { new: true, runValidators: true }
                );
        
                if (!updatedStudent) {
                    return callback({ success: false, error: "Student not found." });
                }
        
                callback({ success: true, data: updatedStudent });
        
            } catch (error) {
                console.error("Update error:", error);
                if (error.name === 'ValidationError') {
                    return callback({ success: false, error: error.message });
                }
                callback({ success: false, error: "An internal server error occurred." });
            }
        });

        socket.on('updateFeeStatus', async (data, callback) => {
            try {
                const { id, fees } = data;
    
                if (!id || typeof fees !== 'boolean') {
                    return callback({ 
                        success: false, 
                        error: "Invalid data provided. An ID and a boolean fee status are required." 
                    });
                }

                const updatedStudent = await StudentDetails.findByIdAndUpdate(
                    id,
                    { fees: fees },
                    { new: true }   
                );
    

                if (!updatedStudent) {
                    return callback({ 
                        success: false, 
                        error: "Student not found." 
                    });
                }

                callback({ 
                    success: true, 
                    data: updatedStudent 
                });
    
            } catch (err) {

                console.error("Error during fee update:", err);
                callback({ 
                    success: false, 
                    error: "An internal server error occurred while updating fees." 
                });
            }
        });
    });
}