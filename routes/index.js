var request = require('request');

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

/*
 * handle Ninja's authentication
 */

exports.handleNinjaAuthentication = function(req,res,ninja) {

  req.session.ninja = ninja.data;
  req.session.token = ninja.token;
  res.redirect('/');
};

exports.proxy = function(req,res) {

  var query = req.query;
  query.access_token = req.session.token;
  request({
      url: 'https://api.ninja.is'+req.url,
      method: req.method,
      qs: query,
      json: req.body
  }).pipe(res);
};