require('dotenv').config()
const express = require('express');
const corn = require('node-cron');
const jwt = require('jsonwebtoken');
const app = express();


//MiddleWare
app.use(express.json());


//Api
app.get('/', (req, res) => {
    console.log('Cron Job Started')
    corn.schedule('* * * * *', ()=> {
        logTime()
    })
    const token = jwt.sign('sampleToke', process.env.secret)
    res.status(200).json({'Cron Job': 'Started', 'Access Token': token})
})

//Token Verification Api
app.get('/verify', authenticationToken, (req, res) => {
    res.status(200).json({"Authentication Token": 'Verified'})
})


//Token Authentication Function
function authenticationToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.status(404).json({"Authentication Token": 'Not Found'});

    jwt.verify(token, process.env.secret, (err, data) => {
        if(err) return res.status(401).json({"Authentication Token": 'Unauthorized'});
        next()
    })
}


//LogTime Function
function logTime(){
    let today = new Date(Date.now()).toUTCString()
    console.log('The date and time is now ' + today )
}


//Port Server
app.listen(3001, ()=>{
    console.log('server started')
})
