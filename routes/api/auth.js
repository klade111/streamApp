const express = require('express')
const router = express.Router()
const auth = require('../../milddelware/auth')
const bcrypt = require('bcryptjs')
const  jwt = require('jsonwebtoken')
const config = require('config')
const {check , validationResult} = require('express-validator');

// @routen    get api/auts
// @desc      test route
//@acess       public



router.get('/',auth, async(req , res)=>{
    try{
         const user = await User.findById(req.user.id).select('-password')
         res.json(user)  
    }catch(err){
        console.error(err.message)
        res.status(500).send('server error')

    }
})

//@route    post api/auth
//@desc     authenticate user & get token
//@acess    public


router.post('/',[
    
    check('email', 'Please include a valid email').isEmail(),
    check('password','Please enter a password with 6 or more characters').isLength({min:6})
] , async(req , res)=>{
const erros = validationResult(req)
if(!erros.isEmpty()){
    return res.status(400).json({erros:erros.array()})
}
const { email, password} = req.body  

try{
let user = await User.findOne({email})
if(!user){
    return res.status(400).json({errors:[{msg:'ivalid credential'}]})
}

 const isMatch = await bcrypt.compare(password, user.password)
 if(!isMatch){
    return res.status(400).json({errors:[{msg:'ivalid credential'}]})
 }


  const payload = {
      user : {
          id: user.id
      }
  }
  jwt.sign( 
      payload,
      config.get('jwtSecret'),
      {expiresIn:360000},
     (err, token)=>{
         if(err)throw err;
         res.json({token})

     } )
 





    
}catch(err){
    console.error(err.message)
    res.status(500).send('server error')
    
}
 })









module.exports = router;