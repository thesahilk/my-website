var mongoose = require('mongoose');
var username = process.env.MONGO_USER;
var password = process.env.MONGO_PASS;
var mongoServer = process.env.MONGO_SERVER;
mongoose.connect('mongodb://'+username+':'+password+'@'+mongoServer+'/website?authSource=admin');
console.log('mongodb://'+username+':'+password+'@'+mongoServer+'/website?authSource=admin');

var blog = mongoose.model('Blog',
  {
    title: String,
    summary: String,
    blogFile: String,
    publishDate: Number,
    tags: String,
    urlId: String
  });

var portfolio = mongoose.model('Portfolio',
  {
    title: String,
    startDate: Number,
    endDate: Number,
    publishDate: Number,
    imageFile: String,
    blogFile: String,
    tags: String,
    urlId: String
  });

var mod = {};
mod.addPost = function(title, summary, blogFile, publishDate, tags, callback) {
  if (title && summary && blogFile && tags) {
    var blogDetails = new blog({
      title: title,
      summary: summary,
      blogFile: blogFile,
      publishDate: publishDate,
      tags: tags,
      urlId: encodeURIComponent(title.toLowerCase().replace(" ", "-")),
    });
    blogDetails.save(function(err) {
      if (err) {

      } else {

      }
    });
  } else {
    // callback
  }
};

mod.addProject = function(title, startDate, endDate, publishDate, imageFile, blogFile, tags, callback) {
  if (title && startDate && endDate && publishDate && imageFile && blogFile && tags) {
    var portfolioDetails = new portfolio({
      title: title,
      startDate: startDate,
      endDate: endDate,
      publishDate: publishDate,
      imageFile: imageFile,
      blogFile: blogFile,
      tags: tags,
      urlId: encodeURIComponent(title.toLowerCase().replace(" ", "-"))
    });
    portfolioDetails.save(function(err) {
      if (err) {

      } else {

      }
    });
  } else {
    // callback
  }
};

mod.hasMorePages = function(page, callback) {

};

mod.getPosts = function(page, callback) {
  blog.find({}).sort({ publishDate: -1 }).skip(page*10).limit(10).exec(function (err, docs) {
    if (err) {
      callback({ errorName: dbError, errorDescription: "DB Error in getPosts"});
    } else {
      callback(undefined, docs);
    }
  });
};

mod.getProjects = function(page, callback) {
  portfolio.find({}).sort({ publishDate: -1 }).skip(page*20).limit(20).exec(function (err, docs) {
    if (err) {
      callback({ errorName: dbError, errorDescription: "DB Error in getProjects"});
    } else {
      callback(undefined, docs);
    }
  });
};

mod.findPost = function(urlId, callback) {
  blog.findOne({urlId: urlId}).exec(function(err, doc){
    if (err) {
      callback({ errorName: dbError, errorDescription: "DB Error in findPost"});
    } else {
      callback(undefined, doc);
    }
  });
};

mod.findPostById = function(postId, callback) {
  blog.findById(postId, function(err, post) {
    if (err) {
      callback(err, undefined);
    } else {
      callback(undefined, post);
    }
  });
};

mod.findProject = function(urlId, callback) {
  portfolio.findOne({urlId: urlId}).exec(function(err, doc){
    if (err) {
      callback({ errorName: dbError, errorDescription: "DB Error in findProject"});
    } else {
      callback(undefined, doc);
    }
  });
};

mod.findProjectById = function(projectId, callback) {
  portfolio.findById(projectId, function(err, project) {
    if (err) {
      callback(err, undefined);
    } else {
      callback(undefined, project);
    }
  });
};

module.exports = mod;
