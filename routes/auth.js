module.exports = (router, Users)=>{
  router.post('/signup', async (req,res)=>{
    var new_User = new Users(req.body);
    var result = await new_User.save();
    if(!result.ok){
      res.send('new User!' + new_User);
      console.log('new User!' + new_User);
    }
    else{
      res.status(500).send('ERR!');
      console.log('ERR!');
    }
  })

  .post('/signin', async (req,res)=>{
    var result = await Users.findOne(req.body);
    if(result){
      res.send('Login Success');
      console.log('Login! ' + result.name);
    }
    else {
      res.status(404).send("User Not Found");
      console.log('fail');
    }
  })

  return router;
}
