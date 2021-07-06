//index.js
const Joi = require ('joi');
const express = require ('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();

app.use(express.json());

MongoClient.connect('mongodb+srv://usernum1:usernum1pass@contactnumbers.zc2ev.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
    useUnifiedTopology: true
}).then(client => {
    console.log('Connected to Database')
    const db = client.db('forContactsDatabase')
    const numberCollection = db.collection('contactsCollection')

    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Listening from port ${port}...`));

    console.log ('This is a practice API. Hi!!!');
    app.get('/', (req, res) => {
        res.send('Hi!!!! This is my sample API');
    })
    app.get('/contactNumbers', (req, res) => {
        db.collection('contactsCollection').find({}).toArray((err, result) => {
            if (err) throw err;
                res.send(result);
            });
    });
    app.get('/contactNumbers/totalCount', (req, res) => {
        db.collection('contactsCollection').count({}, (err, result) => {
            if (err) res.send(result);
            else res.json(result);
            });
    });
    app.post('/contactNumbers', (req, res) =>{
        const { error } = validateContacts(req.body);
        if (error){
            res.send(error.details[0].message);
            return;
        }
        numberCollection.insertOne(req.body);
        res.send(req.body);
    });

function validateContacts(contacts){
    const schema = {
        last_name : Joi.string().min(3).required(),
        first_name : Joi.string().min(3).required(),
        phone_numbers : Joi.array().min(2).required(),
    };
    return Joi.validate(contacts, schema);
}
});