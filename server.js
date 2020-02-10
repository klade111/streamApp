const expresse = require("express")
const app = expresse() 
const connectDB = require('./config/db')


// connecter base de donne
connectDB();

//init Middelware
app.use(expresse.json({extended:false}))




// definir les routes
app.use('/api/users' , require('./routes/api/users.js')) 
app.use('/api/auth' , require('./routes/api/auth.js')) 
app.use('/api/posts' , require('./routes/api/posts.js')) 
app.use('/api/profile' , require('./routes/api/profile.js')) 




app.get('/', (req, res) => res.send('server is runnig'));


const PORT = process.env.PORT || 5000 ;
app.listen(PORT, ()=>console.log(`server is starting ${PORT}`))