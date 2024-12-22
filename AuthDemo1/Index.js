const express=require('express')
const app=express()
const User =require('./models/User');
// const register=require('./Views')
const  mongoose  = require('mongoose');
const bycrpt=require('bcrypt');
const session=require('express-session');

mongoose
  .connect("mongodb://localhost:27017/AuthDemo", { useNewUrlParser: true,
    useUnifiedTopology: true,})
  .then(() => {
    console.log('Connected to MongoDB successfully!');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });

app.set('view engine','ejs');
app.set('views','views')
app.use(express.urlencoded({extended:true}))
app.use(session ({secret:'notaGoodSecret'}))
app.get('/register', (req, res) => {
    res.render('register')
})
app.get('/LogIn', (req, res) => {
    res.render('LogIn')
})
app.post('/LogIn', async(req, res) => {
    const{username,password}=req.body;
    const user=await User.findOne({username});
    const passwordValue=await bycrpt.compare(password,user.password)
    if(passwordValue)
    {
      req.session.user_id=user._id;
      // res.send("log in SuccessFull")
      res.redirect('/secret')
    }
    else{
      // res.send("Not SuccessFull")
      res.redirect('/LogIn')
    }

    
})
app.post('/register', async (req, res) => {
    const {username,password}=req.body;
    const hash=await bycrpt.hash(password,12);
    console.log(username);
    const user = new User({
      username,
      password: hash,
    });
    
    
    await user.save();
    res.redirect('/')
})

app.post('/logOut',(req,res)=>{
  req.session.destroy();
  res.redirect('/LogIn')
  // res.send("Log out")

})

app.get('/', (req, res) => { 
    res.send('Welcome to the home page');
})

app.get('/secret',(req,res)=>{
  if(!req.session.user_id)
  {
   console.log("Log in first")
    return res.redirect('/LogIn')
  }
    res.render('secret')
})

app.listen(3000,()=>{
console.log("Server is connected on port");

}
)