const express = require('express')
const app = express()
const bcrypt = require('bcrypt')

app.use(express.json())

const users = []
app.get('/users', (req,res) => {
    res.json(users)
})

app.post('/users', async (req,res) => {
    try{
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(req.body.password, 10) //generation of salt
        const user = {name: req.body.name, password:hashedPassword}
        users.push(user)
        res.status(201).send()
    }
   
    catch{
        res.status(500).send()
    }
})

// checking the user
app.post('/user/login', async (req,res)=>
{
    const user = users.find(user => user.name === req.body.name)
    if(user == null)
        return res.status(400).set("cannot find user")
    try{
        if(await bcrypt.compare(req.body.password, user.password))
            {
                res.send("success")
            } // prevents timing attacks
            else{
                res.send("invalid")
            }
    }catch{
        res.status(500).send()
    }
})
app.listen(3000)