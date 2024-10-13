const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const multer = require('multer');

const app = express();
app.engine('.hbs', hbs());
app.set('view engine', '.hbs');

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const upload = multer({
    limits: {filesize: 3*1024*1024},
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
          } else {
            cb(new Error('Only .png, .jpg, .jpeg, and .gif files are allowed!'));
        }
    }
})

app.use((req, res, next) => {
    if (req.path.startsWith('/user')) {
        res.render('/forbidden.hbs')
    } else {
        next();
    }
});

app.get('/hello/:name', (req, res) => {
    res.render('hello', {name: req.params.name});
});

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/home', (req, res) => {
    res.render('home');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/history', (req, res) => {
    res.render('history');
});
app.get('/info', (req, res) => {
    res.render('info', { layout: 'dark'});
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.post('/contact/send-message', upload.single('design'), ( req,res ) => {
    const { author, sender, title, message, design} = req.body;
    const file = req.file;

    if(author && sender && title && message && file) {
        const fileName = file.originalname;
        res.render('contact', { isSent: true, fileName: fileName });
    } else {
        res.render('contact', { isError: true })
    }
});

app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, '/style.css'));
});
  
  app.get('/404.jpg', (req,res) => {
    res.sendFile(path.join(__dirname, '/404.jpg'));
});


app.use((req, res) => {
    res.status(404).render('404', { layout: false });
});

app.listen(8000, () => {
    console.log('Server is running on port: 8000');
  });