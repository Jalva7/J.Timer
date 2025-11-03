const express = require('express');
const request = require('request');
const dotenv = require('dotenv');
//const axios = require('axios');
const cors = require('cors');


dotenv.config()

const port = process.env.PORT || 5001
const CLIENT_URL = process.env.NODE_ENV === 'production' 
  ? 'https://jalva7.github.io/J.Timer'
  : 'http://localhost:3000'

global.access_token = ''

var spotify_client_id = process.env.SPOTIFY_CLIENT_ID
var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET

var spotify_redirect_uri = process.env.NODE_ENV === 'production'
  ? process.env.SPOTIFY_REDIRECT_URI
  : 'http://127.0.0.1:5001/auth/callback'

var generateRandomString = function (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var app = express();

console.log('Setting up CORS...');

app.use(cors({
    origin: [CLIENT_URL, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));

console.log('CORS set up successfully.');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running!');
});

app.get('/auth/login', (req, res) => {
    var scope = "user-read-playback-state user-modify-playback-state user-read-currently-playing streaming user-read-email user-read-private"

    var state = generateRandomString(16);
    
    var auth_query_parameters = new URLSearchParams({
        response_type: "code",
        client_id: spotify_client_id,
        scope: scope,
        redirect_uri: spotify_redirect_uri,
        state: state
})

res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());
})



app.get('/auth/callback', async (req, res) => {
    console.log('Callback hit, Code:', req.query.code);
    var code = req.query.code;

    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: spotify_redirect_uri,
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        json: true
    };

    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            access_token = body.access_token;
            console.log('Access Token obtained:', access_token);
            res.redirect(CLIENT_URL);
        } else {
            console.error('Auth error:', error, body);
            res.redirect(`${CLIENT_URL}?error=auth_failed`);
        }
    });
})
        
app.get('/auth/token', (req, res) => {
    res.json({ access_token: access_token });
});

app.listen(port, () => {
  console.log(`Listening at http://127.0.0.1:${port}`);
});