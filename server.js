var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var counter = 1;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost/prairieDash');
var dogSchema = new mongoose.Schema( {
    name: {type: String, minlength: 3, required: true},
    sex: String,
    age: {type: Number, minlength: 1, required: true},
    status: String,
    imageSrc: String
}, {timestamps: true});
mongoose.model('Dogs', dogSchema);
var Dog = mongoose.model('Dogs');
mongoose.Promise = global.Promise;

app.get('/', function(req, res) {
    // TODO: send in all the things in the db
    // Dog.remove({}, function(err) {
    //     if(!err) {
    //         console.log('db wiped')
    //     }
    // });
    Dog.find({}, function(err, dogs) {
        if (err) {
            console.log(err);
        } else {
            console.log(dogs.length);
            res.render('index', {dogs: dogs})
        }
    })
})

app.get('/prairie/:id', function(req, res) {
    Dog.find({_id: req.params.id}, function(err, dog) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.render('single', {dog: dog});
        }

    })
})

app.get('/prairie/new', function(req, res) {
    res.render('create');
})

app.get('/prairie/edit/:id', function(req, res) {
    Dog.find({_id: req.params.id}, function(err, dog) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.render('edit', {dog: dog});
        }

    })
})

app.post('/prairie_dogs', function(req, res) {
    console.log('post request on prairie_dogs');
    let imageStr = '/prairie' + counter + '.jpg';
    counter ++;
    if (counter == 7) {
        counter = 1;
    }
    var newDoggy = new Dog({
        name: req.body.name,
        sex: req.body.sex,
        age: req.body.age,
        status: req.body.alphaBeta,
        imageSrc: imageStr
    })

    newDoggy.save(function(err) {
        if (err) {
            console.log('failed to save: ', err);
            res.send(err);
        } else {
            res.redirect('/prairie/new');
        }
    })
})

app.post('/prairie/:id', function(req, res) {
    Dog.update({_id: req.params.id}, {
        name: req.body.name,
        sex: req.body.sex,
        age: req.body.age,
        status: req.body.status
    }, function(err) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.redirect('/prairie/' + req.params.id);
        }
    })
})

app.post('/prairie/destroy/:id', function(req, res) {
    Dog.remove({_id: req.params.id}, function(err) {
        if(err) {
            console.log(err);
            res.send(err);
        } else {
            res.redirect('/');
        }
    });
})

app.listen(8000, function() {
    console.log('listening on port 8000');
})