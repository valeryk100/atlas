const express= require("express");
const bcrypt = require("bcrypt");
const {UserModel,userValid,loginValid,createToken} = require("../models/userModel")
const {auth} = require("../middlewares/auth");

const router = express.Router();

router.get("/" , async(req,res)=> {
  res.json({msg:"users endpoint work"})
})

router.get("/userInfo",auth, async(req,res) => {
  let user = await UserModel.findOne({_id:req.tokenData._id},{password:0})
  res.json(user);
})

router.post("/",async(req,res) => {
  let valdiateBody = userValid(req.body);
  if(valdiateBody.error){
    return res.status(400).json(valdiateBody.error.details)
  }
  try{
    let user = new UserModel(req.body);
    // הצפנה חד כיוונית לסיסמא ככה 
    // שלא תשמר על המסד כמו שהיא ויהיה ניתן בקלות
    // לגנוב אותה
    user.password = await bcrypt.hash(user.password, 10)
    await user.save();
    // כדי להציג לצד לקוח סיסמא אנונימית
    user.password = "******";
    res.status(201).json(user)
  }
  catch(err){
    // בודק אם השגיאה זה אימייל שקיים כבר במערכת
    // דורש בקומפס להוסיף אינדקס יוניקי
    if(err.code == 11000){
      return res.status(400).json({msg:"Email already in system try login",code:11000})
    }
    console.log(err)
    res.status(500).json({msg:"err",err})
  }
})

router.post("/login", async(req,res) => {
  let valdiateBody = loginValid(req.body);
  if(valdiateBody.error){
    return res.status(400).json(valdiateBody.error.details)
  }
  try{
    // לבדוק אם המייל שנשלח בכלל יש רשומה של משתמש שלו
    let user = await UserModel.findOne({email:req.body.email})
    if(!user){
      // שגיאת אבטחה שנשלחה מצד לקוח
      return res.status(401).json({msg:"User and password not match 1"})
    }
    // בדיקה הסימא אם מה שנמצא בבאדי מתאים לסיסמא המוצפנת במסד
    let validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword){
      return res.status(401).json({msg:"User and password not match 2"})
    }
    // בשיעור הבא נדאג לשלוח טוקן למשתמש שיעזור לזהות אותו 
    // לאחר מכן לראוטרים מסויימים
    let token = createToken(user._id);
    res.json({token});
  }
  catch(err){
    
    console.log(err)
    res.status(500).json({msg:"err",err})
  }
})

module.exports = router;