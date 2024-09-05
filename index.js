const express = require("express");
const app = express();
const mongoose = require('mongoose')
const URL = process.env.URL;
const session = require('express-session');
const mbSession = require('connect-mongodb-session')(session);
const {allowInsecurePrototypeAccess} = require("@handlebars/allow-prototype-access");
const Handlebars = require("handlebars");
const multer = require("multer");
const path = require('path')
const flash = require("connect-flash")
const Mahsulot = require('./models/mahsulot')
const Category =require('./models/category')
const Cart = require('./models/cart')

// const flash = require('connect-flash')

// const mongoose = require("mongoose");
// const URL = 'mongodb+srv://abdullohibrohimov85:zsYi91VEPhXS99Cn@cluster0.0ijpncy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0x'
// const session = require('express-session');
// const mbSession = require('connect-mongodb-session')(session)
const PORT =  process.env.POST;
async function start() {
  try {
    await mongoose.connect(URL);
    app.listen(PORT, ( req , res) => {
      console.log(`Server ${PORT} portda ishladi`);
    });
  } catch (error) {
    console.log(error);
  }
}
start();

const exphbs = require('express-handlebars');
const category = require("./models/category");
const hbs = exphbs.create({
    defaultLayout:'main',
    extname:'hbs',
    handlebars:allowInsecurePrototypeAccess(Handlebars),
    helpers:{
      incr:function(index){return index+1},
      katta:function(index){return index>=3},
      seven:function(index){return index>=7}  
  }
})

const store = new mbSession({
  collection:'sessions',
  uri:URL
})

app.use(session({
  secret:'maxfiy key',
  resave:false,
  saveUninitialized:false,
  store
}))

app.get('/api/products', async (req, res) => {
  try {
      const mahsulot = await Mahsulot.find().populate("category");
      res.json(mahsulot);
  } catch (error) {
      res.status(500).send(error);
  }
});
app.get('/api/category', async (req, res) => {
  try {
      const category = await Category.find();
        res.json(category);
      // console.log(category)
  } catch (error) {
      res.status(500).send(error);
  }
});
app.get('/api/cart', async (req, res) => {
  try {
      const cart = await Cart.find().populate("items.product")
      res.json(cart);
      // console.log(cart)
  } catch (error) {
      res.status(500).send(error);
  }
});




app.engine("hbs" , hbs.engine);
app.set("view engine" , "hbs");
app.set("views" , "page");
app.use(express.json())
app.use(flash())
// app.use(session({secret:'Abdu' , resave:false , saveUninitialized:false}))
// app.use(flash());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// app.use(bodyParser.urlencoded({extended:true}));
// app.use(bodyParser.json());

app.use(express.static("public"));
app.use("/images" , express.static(path.join(__dirname , "images")));
// app.use('/mahsulot', express.static(path.join(__dirname,"public","main")));
app.use(express.urlencoded({extended:true}));
app.use('/' , require("./routers/Home"));
app.use('/mahsulot' , require("./routers/Mahsulot"));
app.use('/category' ,require('./routers/Category') );
app.use('/qushish' , require('./routers/Qushish'));
app.use('/login' , require('./routers/Login'));
app.use('/logout' , require('./routers/Logout'));
app.use('/cart' , require('./routers/Cart'))
// app.use('/korzinka' , require('./routers/Korzinka'));






app.use((req, res) => {
  res.status(404).render("notfound", { title: "Sahifa topilmadi" });
});


