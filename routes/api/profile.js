const express = require('express')
const router = express.Router()
const auth = require('../../milddelware/auth')
const Profile = require('../../model/Profile')
const User = require ('../../model/User')
const {check , validationResult} = require('express-validator')

// @routen    get api/me profile
// @desc      get current user profile
//@acess      private



router.get('/me', auth, async (req , res)=>{
    try{
        const profile = await Profile.findOne({user: req.user.id}).populate('user',[
            'name', 'avatar'
        ])
       if (!profile){
           return res.status(400).json({msg:"profile d'ont existe"})
       }
       res.json(profile) 

    }catch(err){
        console.error(err.message)
        res.status(500).send('server error')
    }

})
         // @routen    get api/ profile
         // @desc      create or update profile
         //@acess      private


 router.post('/',[auth,[check('status','status is required ').not().isEmpty()]], async (req,res)=>{
     const errors = validationResult(req)
     if(!errors.isEmpty()){
         res.status(400).json({errors:errors.array()})
     }

const {status , description}= req.body

     //build profile object
     const profileFields = {}
     profileFields.user = req.user.id
    // console.log(profileFields.uers )
     if(description) profileFields.description = description
     if(status){
          profileFields.status = status
          //.split(',').map(status => status.trim())
     }
     //console.log(profileFields.status)
      try{
           let profile = await Profile.findOne({user: req.user.id})
           if(profile){
               //update
               profile = await Profile.findOneAndUpdate({user: req.user.id},{$set: profileFields},{new: true})
               return res.json(profile)
           }

           //create 
           profile = new Profile(profileFields)
           await profile.save()
           res.json(profile)


      }catch(err){
          console.error(err.message)
          res.status(500).send('server error')
      }

 })        
        // @routen    get api/ profile
         // @desc     get all profile
         //@acess     private


  router.get('/' ,async(req, res)=>{
      try {
          const profiles = await Profile.find().populate('user' , ['name','avatar'])
          res.json(profiles)
          
      } catch (err) {
          console.error(err.message)
          res.status(500).send('server err')
          
      }
  })       

         // @routen    get api/ profile/user/:user_id
         // @desc      get profile by yser id
         //@acess      public


         router.get('/user/:user_id' ,async(req, res)=>{
            try {
                const profile = await Profile.findOne({user: req.params.user_id}).populate('user' , ['name','avatar'])
               
                if(!profile) return res.status(400).json({msg:'there is no profile for this user'})
                

                res.json(profile)

            } catch (err) {
                console.error(err.message)
                res.status(500).send('server error')
                
            }
 })       

module.exports = router;