
exports.put = function(req,res) {

  for (var i in req.body) {
    if (req.body.hasOwnProperty(i)) {
      if (typeof req.body[i]==="object")
        req.body[i] = JSON.stringify(req.body[i]);
    }
  }
  req.redisClient.hmset('user:'+req.session.ninja.id+':store',req.body,function(err) {

    if (err) {
      res.json({error:'Unkown Database Error'},500);
      return;
    }
    res.send(200);
  });
};

exports.get = function(req,res) {

  req.redisClient.hgetall('user:'+req.session.ninja.id+':store',function(err,reply) {

    reply = reply || {};
    for (var i in reply) {
      if (reply.hasOwnProperty(i)) {
        try { reply[i] = JSON.parse(reply[i]) }
        catch (err) { }
      }
    }

    if (err) {
      res.json({error:'Unkown Database Error'},500);
      return;
    }
    res.json(reply);
  });
};