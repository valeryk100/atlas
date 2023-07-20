require("dotenv").config();
const express= require("express");
const axios = require("axios");
const router = express.Router();



router.get("/" , async (req,res)=> {
  try{
    let url = "http://www.omdbapi.com/?s=lego&apikey="+process.env.API_KEY;
    let resp = await axios.get(url);
    res.json(resp.data.Search)
  }
  catch(err){
    res.status(500).json(err)
  }
  res.json({msg:"vod work 2222 !"})
})

module.exports = router;