const express= require("express");
const router = express.Router();

router.get("/" , (req,res)=> {
  res.json({msg:"Rest api work 2222 !"})
})

module.exports = router;