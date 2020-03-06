var express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userDataId = require('./routes/user');
//connection to the database
mongoose.connect('mongodb+srv://sambhav:sambhavjain@myproject-cxldo.mongodb.net/test?retryWrites=true&w=majority',
{
    useNewUrlParser: true
}
);

app.use(morgan('dev'));
//bodyparser helps in parsing of json data
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//allowing various headers manually
app.use((req, res, next) =>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Header', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS'){
        req.header('Access=Control-Allow-Methods', 'PUT, POST, GET, DELETE, PATCH');
        return res.status(200).json({});
    }
    next();
});

app.use('/user', userDataId);

// Handling errors
app.use((req, res, next) =>{
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) =>{
    res.status(error.status || 500);
    res.json({
        error:{
            message:error.message
        }
    });
})
module.exports = app;