const express = require('express')
const router = express.Router()

// @routen    get api/posts
// @desc      test route
//@acess       public



router.get('/', (req , res)=>res.send('posts_route'))
module.exports = router;