require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Question = require('./models/question_schema.js');
const questionRoutes = require('./routes/questionRoutes.js');
const bcrypt = require('bcrypt');
const admin = require('./models/user_schema');
const session = require('express-session');
const requireLogin = require('./middleware/auth.js');

const app = express();

app.use(session({
  secret: process.env.SECRET_SESSION_KEY, 
  resave: false,                    
  saveUninitialized: false,         
  cookie: {
    maxAge: 1000 * 60 * 60,         
    httpOnly: true,                 // client-side JS can't access the cookie
    // secure: true,                // enable only if using HTTPS
    // sameSite: 'strict'          
  }
}));

app.set('view engine','ejs');
app.set('views','views');

const username = process.env.ADMIN_USERNAME;
const password = process.env.ADMIN_PASSWORD;
const dbUri = `mongodb+srv://${username}:${password}@node-practice.nyxbhhf.mongodb.net/MCQ-Battle`;
mongoose.connect(dbUri)
.then((result) => {
    console.log("Connected to DataBase");
    app.listen(3000)}
)
.catch((error) => console.log(error));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // for JSON requests (application/json)

app.get('/',requireLogin, async (req,res) => {

    console.log("req.url: ",req.url);
    console.log("this is index");
    let count = 0;
    try {
        count = await Question.countDocuments();
        // console.log("Total Number of Documents:", count);
    } catch (error) {
        console.error(error);
    }

    console.log(count);
    Question.aggregate([
        { $group: { _id: "$topic", count: { $sum: 1 } } },
        { $sort: { _id: 1 } } // Sorts by topic name (ascending)
    ])
    .then((result) => {
        console.log("This is the result",result);
        res.render('index.ejs', { title: 'Home', count: count, topics: result  })
    })
    .catch((error) => console.log(error));
})

//login
app.get('/login', (req,res) => {
    if (req.session && req.session.loggedIn) {
        console.log("Redirect to home page");
        return res.redirect('/');
    } else {
        console.log("move to login page");
        res.render('login.ejs', {title: "login"});
    }
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(username);
    console.log(password);
    try {
        const user = await admin.findOne({ username });

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Not matched Password")
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }
        
        // If successful
        req.session.loggedIn = true;
        console.log("Session ID set");
        req.session.username = user.username;
        return res.status(200).json({ success: true, message: '', redirectUrl: '/' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});

// logout
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).send('Could not log out.');
    }
    res.clearCookie('connect.sid'); // Removes the session cookie from the browser
    res.redirect('/login');
  });
});

app.get('/about', requireLogin, (req,res) => {
    console.log("This is about");
    res.render('about.ejs', { title: 'About' });
})

// question routes
app.use('/questions', requireLogin, questionRoutes);

// 404 error
app.use((req,res) => {
    console.log("This is 404",req.url);
    res.status(404).render('404.ejs', { title: '404 Error' });
})
