const mongoose=require('mongoose');

const connectDB=async()=>{
    try{
        
        await mongoose.connect(`mongodb+srv://himanijain22:Smile@cluster0.2k0q6.mongodb.net/abes_tot_cafe_management?retryWrites=true&w=majority&appName=Cluster0`)
    console.log("--------DB Connected-------------")
    }
    catch(err)
    {
        
        console.log("Error in DB connection", err.message)
    }
   
}
connectDB();
