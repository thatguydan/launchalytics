App.utils = {
  findClosestImagesToDate: function(dump,goalDate) {

    var out = {};

    Object.keys(dump).forEach(function(ip) {

      var images = dump[ip];
      var closestDate = null;
      var closestStr = null;

      for (var i=0;i<images.length;i++) {

        var thisDate = new Date(images[i].split('.')[0]);

        if (closestDate == null || Math.abs(thisDate.getTime() - goalDate.getTime()) < Math.abs(closestDate.getTime() - goalDate.getTime())) {
          closestDate = thisDate;
          closestStr = images[i];
        }
      }

      out[ip] = closestStr;
    });

    return out;
  },
  sanitize: function(input) {
    return input.replace(/\W/g, '')
  },
  getLargeImageUrl: function(host,time) {
    return '/screenshots/'+host+'/'+time
  }
}