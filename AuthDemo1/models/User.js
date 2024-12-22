const mongoose =require('mongoose');

const userScehema = mongoose.Schema({
    username:{
        type:String,
        required:[true,'user cannot be blank']
    },
    password:{
        type:String,
        required:[true,'user cannot be blank']
    }
});

module.exports=mongoose.model('User',userScehema);