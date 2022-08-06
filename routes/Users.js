const express= require('express');
const router =express.Router();
const {Users}= require("../models");
const bcrypt= require('bcrypt')

const {sign}= require('jsonwebtoken');
const { validateToken } = require('../middlewares/AuthMiddleware');

router.get('/', async (req, res)=>{
    const listOfUsers= await Users.findAll();
    res.json(listOfUsers);
});

router.post('/',async (req, res)=>{
    const {username, password, e_mail} =req.body;
    const us=await Users.findOne({where: {username:username}});
    if(!us){
    bcrypt.hash(password, 10).then((hash)=>{
        Users.create({
            username: username,
            password: hash,
            e_mail: e_mail
        })
       
    }); 
    res.json("Success");
    }else{
        res.json("This user this user is already registered ");
    }
    
   
});

router.post('/login',async (req, res)=>{
    const {username, password} =req.body;
    const user= await Users.findOne({where: {username:username}});
    
    if(!user){
        res.json({error: "User Doesn't exist"});}
    else{
    
        bcrypt.compare(password, user.password).then((match)=>{
        if(!match){ 
            res.json({error: "Wrong username or password"});
            }
        else{
            if(user.status==='blocked'){
                console.log("działa");
                res.json("User blocked")
            }else{
                const accessToken = sign({username: user.username, id:user.id}, "importantsecret")
                res.json({token: accessToken, username:username, id: user.id}) 
                let date= new Date();
                Users.update(
                    { last_login_time: date.toLocaleString() },
                    {where:{username:username}}
                );
            } 
        }
        
    })}
    

});

router.get('/byId/:id', async(req, res)=>{
    const id= req.params.id
    const user =await Users.findByPk(id)
    res.json(user)
});
router.get('/token',validateToken,async (req, res)=>{
    res.json(req.user);
});
router.post('/delete', async (req, res)=>{
    let len=Object.keys(req.body).length;
    for(let i=0; i<len; i++){
        await Users.destroy({where:{id:req.body[i]}})
    }
    res.json('success delete');
    
});
router.post('/block', async (req, res)=>{
    let len=Object.keys(req.body).length;
    for(let i=0; i<len; i++){
        await Users.update(
            { status: 'blocked' },
            {where:{id:req.body[i]}}
        );
    }
   
    res.json('blo');
});
router.post('/unlock', async (req, res)=>{
    let len=Object.keys(req.body).length;
    for(let i=0; i<len; i++){
        await Users.update(
            { status: 'active' },
            {where:{id:req.body[i]}}
        );
    }
});



module.exports = router;