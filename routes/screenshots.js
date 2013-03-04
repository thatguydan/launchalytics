var fs = require('fs');
var async = require('async');
var path = require('path');
var baseDirectory = process.env.IMG_LOCATION;

exports.get = function(req,res) {
  fs.readdir(baseDirectory,function(err,contents) {

    if (err) {
      res.json({error:'Unknown Error'},500);
      return;
    }

    async.filter(contents,function(file,cb) {
      fs.stat(baseDirectory+file,function(err,stats) {
        if (err || !stats.isDirectory()) cb(false);
        else cb(true)
      });
    },function(results) {

      var out={};

      async.forEach(results,function(item,cb) {

        fs.readdir(baseDirectory+item,function(err,contents) {

          if (err) return cb(err);
          else {
            out[item] = contents;
            cb(null,out)
          }
        });
      },function(err) {
        res.json(out);
      });
    });
  });
};

exports.show = function(req,res) {
  res.render('screenshots', {
    title: '*alytics',
    user:req.session.ninja
  });
};

exports.fetchImage = function(req,res) {

  var rawPath = baseDirectory + req.params.ip + '/' + req.params.image;
  var noramlisedPath = path.normalize(rawPath);

  // Ensure they haven't given any .. or the like.

  if (noramlisedPath !== rawPath) {
    return res.send(400);
  }

  // Send the image
  res.sendfile(noramlisedPath);
};