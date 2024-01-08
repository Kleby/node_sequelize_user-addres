const express = require('express');
const ehb = require('express-handlebars');

const conn = require('./db/conn');
const User = require('./models/User');
const Address = require('./models/Address');

const app = express();
const port = process.env.PORT || 3000;

const ehbPartials = ehb.create({
    partialsDir: ['views/partials']
});

app.engine('handlebars', ehbPartials.engine);
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

app.get('/add-user', (req, res) => {
    res.render('add-user');
});

app.post('/users/create', async (req, res) => {
    const {name, occupation} = req.body;
    let newsletter = req.body.newsletter;

    newsletter = newsletter === 'on' ? true : false;

    await User.create({name, occupation, newsletter});

    res.redirect('/');

});


//get one
app.get('/users/:id', async (req, res) => {
    const id = req.params.id;

    const user = await User.findOne({ 
        raw: true,
        where: {id: id}
    });
    res.render('user-detail', { user: user})
})

//delete
app.post('/users/delete/:id', async (req, res) => {
    const id = req.params.id;
    await User.destroy({
        where: {id : id}
    })
    res.redirect('/');
});

//edição

app.get('/users/edit/:id', async(req, res) =>{
    const id = req.params.id;

    const user = await User.findOne({
        include: Address,
        where: {id: id}
    });
    res.render('user-edit', { user: user.get({ plain: true})})
})

app.post('/users/edit', async (req, res) => {
    const { id, name, occupation} = req.body;
    let newsletter = req.body.newsletter;

    newsletter = newsletter === 1 ? true : false;

    const userData = {
        id, name, occupation, newsletter
    }

    await User.update(userData, { where: { id: id}});

    res.redirect('/');
})

app.get('/', async (req, res) => {

    const users = await User.findAll({ raw: true})

    res.render('home', {users: users});
})

app.post('/address/create', async (req, res) => {
    const { street, number, city, UserId } = req.body;

    const address = {
        street, number, city, UserId
    }

    await Address.create(address);
    
    res.redirect(`/users/edit/${UserId}`);
})

app.post('/address/delete', (req, res) => {
    const id = req.body.id;
    const UserId = req.body.UserId;

    Address.destroy({ where: {id: id} });
    res.redirect(`/users/edit/${UserId}`);
})

conn.
    sync()
    // sync({force: true}) //apaga os dados da tabela e reciar a tabela vazia
    .then(
        () => app.listen(
            port, 
            console.log(`Servidor escutando na porta ${port}`)
            )
        )
    .catch(err => console.log(err))

