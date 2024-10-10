const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, '/public')));

app.use((req, res, next) => {
    res.show = (name) => {
      res.sendFile(path.join(__dirname, `/views/${name}`));
    };
    next();
});

app.use((req, res, next) => {
    if (req.path.startsWith('/user')) {
        res.show('/forbidden.html')
    } else {
        next();
    }
});

app.get('/', (req, res) => {
    res.show('home.html');
});

app.get('/home', (req, res) => {
    res.show('home.html');
});

app.get('/about', (req, res) => {
    res.show('about.html');
});

app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, '/style.css'));
});
  
  app.get('/404.jpg', (req,res) => {
    res.sendFile(path.join(__dirname, '/404.jpg'));
});


app.use((req, res) => {
    res.status(404).show('/404.html');
});

app.listen(8000, () => {
    console.log('Server is running on port: 8000');
  });