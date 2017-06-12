const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const path = require('path');
const passport = require('passport');
const massive = require('massive');
const config = require('./config/config');
const userCtrl = require('./models/userCtrl');
const jwt = require('jsonwebtoken')

let app = module.exports = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'dist')));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());



let massiveServer = massive.connectSync({
    connectionString: config.postgresLink
})
app.set('db', massiveServer);

require('./config/passport')(passport);
let db = app.get('db');

const users = require('./routes/users');
app.use('/users', users)


// app.get('/user/:id', (req, res) => {
//     const userId = req.params.id;
//     db.get_user_by_id([userID], (err, user) => {
//         if (err) {
//             console.log(err)
//             return res.status(500).json({ "error message": err });
//         }
//         res.status(200).json(user);
//     })
// })




app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'))
});

// const port = process.env.PORT || '3000';
const port = '3001';

app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => {
    console.log('Listening on port', port);
})