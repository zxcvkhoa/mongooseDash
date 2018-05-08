var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, './static')));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mongooseDash');

var userSchema = new mongoose.Schema({
    name: {
        type: String, required: true, minlength: 3
    } 
})

var Animal = mongoose.model('Animal', userSchema);
mongoose.Promise = global.Promise;

//---------------------------------------------------------------

app.get('/', function(req, res){
    Animal.find({}, function(err, data){
        if(err){
            console.log(err);
            res.send(err);
        }
        else {
            // console.log(data);
            res.render('index', {data:data});
        }     
    })
})

app.get('/koala/:id', function(req, res){
    Animal.findById({_id: req.params.id}, function(err, data){
        if(err){
            console.log(err);
            res.send(err);
        }
        else {
            console.log("found the koala");
            res.render('details', {data:data});
        }     
    })
})

app.get('/koala/edit/:id', function(req, res){
    console.log(req.params.id);
    Animal.find({_id: req.params.id}, function (err, data){
        if (err) {
            console.log(err);
            res.send(err)
        }
        else {
        res.render('edit', {data:data})
        }
    });
});

app.get('/koala/new', function(req, res){
    console.log("lets make something new");
    res.render('new');
})

app.post('/koala/new', function(req, res){
    console.log("POST DATA", req.body);
    var koala = new Animal({
        name: req.body.name
    });
    koala.save(function(err){
        if(err){
            console.log('something went wrong');
            res.redirect('/')
        }else{
            console.log('sucessfully added a koala!');
            res.redirect('/')
        }
    })
})

app.post('/koala/edit/:id', function(req, res){
    Animal.findById({_id: req.params.id}, function(err, data){
        data.name = req.body.newName;
        data.save();
    })
    res.redirect('/')
})

app.post('/koala/destroy/:id', function(req, res){
    Animal.remove({_id: req.params.id}, function(err, data){
        console.log('see ya later dude')
    })
    res.redirect('/')
})

app.listen(8000, function() {
    console.log("listening on port 8000");
})