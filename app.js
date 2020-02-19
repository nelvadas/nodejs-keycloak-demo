
const express = require('express');
const session = require('express-session')
const Keycloak =  require('keycloak-connect')



// Express Initialize
const app = express();
const port = 8000;

// 
const memoryStore = new session.MemoryStore();


app.use(
  session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
  })
);


const keycloak = new Keycloak({
  store: memoryStore
});


app.use(
    keycloak.middleware({
      logout: '/logout',
      admin: '/'
    })
  );






app.listen(port,()=> {
console.log('listen port 8000');
})


//create api
app.get('/', (req,res)=>{
    res.send('Hello World');
    })

//create unsecure
app.get('/api/unsecured', function(req, res) {
    res.json({ message: 'This is an unsecured endpoint payload' });
  });

//secure api user realm
app.get('/api/secure', keycloak.protect('realm:uma_authorization') , function(req,res) {

        res.json({ project: 'Canalous', release : '1.0.0' , description: ' API Réservation bateaux ' });
})

//secure api admin  user

app.get('/api/admin', keycloak.protect('realm:admin') , function(req,res) {

    res.json({ user: "**admin**", project: 'Canalous', release : '1.0.0' });
})