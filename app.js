const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Campground = require('./models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/campgrounds', async (req, res) => {
    try {
        const campgrounds = await Campground.find({});
        res.render('campgrounds/index', { campgrounds });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading campgrounds');
    }
});

app.get('/campgrounds/new',(req,res)=>{
    res.render('campgrounds/new');
});

app.post('/campgrounds', async (req, res) => {
    try {
        const campground = new Campground(req.body.campground);
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating campground');
    }
});

app.get('/campgrounds/:id',async(req,res)=>{
    try {
        const campground = await Campground.findById(req.params.id);
        if (!campground) {
            return res.status(404).send('Campground not found');
        }
        res.render('campgrounds/show', { campground });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading campground');
    }
})

app.get('/campgrounds/:id/edit', async (req, res) => {
    try {
        const campground = await Campground.findById(req.params.id);
        res.render('campgrounds/edit', { campground });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading campground');
    }
});

app.put('/campgrounds/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });  //...--> spread operator
        res.redirect(`/campgrounds/${campground._id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating campground');
    }  
}); 


app.delete('/campgrounds/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await campgrounds.findByIdAndDelete(id);
        res.redirect('/campgrounds');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting campground');
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});