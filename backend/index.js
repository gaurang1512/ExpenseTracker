const  express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');


const app = express();


const AuthRouter = require('./Routes/AuthRouter');
const IncomeRouter = require('./Routes/IncomeRouter');
const ExpenseRouter = require("./Routes/ExpenseRouter");

app.use(bodyParser.json());
app.use(cors());
app.use(express.json()); // Allows JSON data in requests
//Router
app.use('/auth',AuthRouter);
app.use('/income',IncomeRouter);
app.use('/expense',ExpenseRouter)

require('dotenv').config();
require('./Models/db');

const PORT = process.env.PORT || 8080;

app.get('/ping',(req,res)=>{
   res.send('pong')
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})

//File uploading multer
/*const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,  './uploads')
    },
    filename: function (req, file, cb) {

      cb(null, Date.now() + '-' + file.originalname)
    }
  })
  
  const upload = multer({ storage })
app.post('/upload', upload.single('image'), (req, res) => {
    res.send('File uploaded successfully')
  } )
*/
