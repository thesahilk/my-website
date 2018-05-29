var c = require('../helpers/constants');
var mongoose = require('mongoose');
var username = process.env.MONGO_USER;
var password = process.env.MONGO_PASS;
var mongoServer = process.env.MONGO_SERVER;
var url = 'mongodb://' + username + ':' + password + '@' + mongoServer + '/website?authSource=admin';
if (!username) {
  url = 'mongodb://localhost:27017/website';
}
const db = mongoose.createConnection(url);
console.log('mongodb://' + username + ':' + password + '@' + mongoServer + '/website?authSource=admin');

var blog = db.model('Blog', new mongoose.Schema({
  title: String,
  summary: String,
  blogFile: String,
  publishDate: Number,
  tags: [String],
  urlId: String
}, {timestamps: true})
);

var portfolio = db.model('Portfolio', new mongoose.Schema({
  title: String,
  startDate: Number,
  endDate: Number,
  publishDate: Number,
  description: String,
  imageFile: String,
  blogFile: String,
  tags: [String],
  urlId: String
}, {timestamps: true})
);

var shop = db.model('Shop', {
  title: String,
  description: String,
  isAvailable: Boolean,
  imageFile: String,
  width_cm: Number,
  height_cm: Number,
  publishDate: Number,
  priceUSD: Number,
  urlId: String,
  process: String
});

var mod = {};

// -- ADD SOMETHING TO DB -- //
mod.addPost = function (title, summary, blogFile, publishDate, tags, callback) {
  if (title && summary && blogFile && tags) {
    var blogDetails = new blog({
      title: title,
      summary: summary,
      blogFile: blogFile,
      publishDate: publishDate,
      tags: tags ? tags.split(',') : [],
      urlId: encodeURIComponent(title.toLowerCase().split(" ").join("-"))
    });
    blogDetails.save(function (err) {
      if (err) {

      } else {

      }
    });
  } else {
    // callback
  }
};

mod.addProject = function (title, startDate, endDate, publishDate, description, imageFile, blogFile, tags, callback) {
  if (title && startDate && endDate && publishDate && imageFile && blogFile && tags) {
    var portfolioDetails = new portfolio({
      title: title,
      startDate: startDate,
      endDate: endDate,
      publishDate: publishDate,
      description: description,
      imageFile: imageFile,
      blogFile: blogFile,
      tags: tags ? tags.split(',') : [],
      urlId: encodeURIComponent(title.toLowerCase().split(" ").join("-"))
    });
    portfolioDetails.save(function (err) {
      if (err) {

      } else {

      }
    });
  } else {
    // callback
  }
};

mod.addShopItem = function (title, description, isAvailable, imageFile, width_cm, height_cm, publishDate, priceUSD, process, callback) {
  if (title && description && isAvailable && imageFile && width_cm && height_cm && publishDate && priceUSD && process) {
    var shopItem = new shop({
      title: title,
      description: description,
      isAvailable: isAvailable,
      imageFile: imageFile,
      width_cm: width_cm,
      height_cm: height_cm,
      publishDate: publishDate,
      priceUSD: priceUSD,
      process: process,
      urlId: encodeURIComponent(title.toLowerCase().split(" ").join("-"))
    });
    shopItem.save(function (err) {
      if (err) {
        console.log(err);
      } else {

      }
    });
  } else {
    // callback
  }
};

// -- GET PAGES -- //
mod.projectPages = function (page, callback) {
  portfolio.count({}, function (err, count) {
    if (err) {
      callback(err);
    } else {
      var totalPages = Math.ceil(parseFloat(count) / c.PAGE_SIZE);
      callback(undefined, totalPages);
    }
  });
};

mod.postPages = function (page, callback) {
  blog.count({}, function (err, count) {
    if (err) {
      callback(err);
    } else {
      var totalPages = Math.ceil(parseFloat(count) / c.PAGE_SIZE);
      callback(undefined, totalPages);
    }
  });
};

// -- GET LIST OF THINGS -- //
mod.getPosts = function (page, callback) {
  console.log(page * c.PAGE_SIZE);
  blog.find({}).sort({
    publishDate: -1
  }).skip((page - 1) * c.PAGE_SIZE).limit(c.PAGE_SIZE).exec(function (err, docs) {
    if (err) {
      callback({
        errorName: c.DB_ERROR,
        errorDescription: "DB Error in getPosts"
      });
    } else {
      callback(null, docs);
    }
  });
};

mod.getProjects = function (page, callback) {
  portfolio.find({}).sort({
    publishDate: -1
  }).skip((page - 1) * c.PAGE_SIZE).limit(c.PAGE_SIZE).exec(function (err, docs) {
    if (err) {
      callback({
        errorName: c.DB_ERROR,
        errorDescription: "DB Error in getProjects"
      });
    } else {
      callback(undefined, docs);
    }
  });
};

mod.getShopItems = function (page, callback) {
  shop.find({}).sort({
    publishDate: -1
  }).skip(page * 20).limit(20).exec(function (err, docs) {
    if (err) {
      callback({
        errorName: c.DB_ERROR,
        errorDescription: "DB Error in getShopItems"
      });
    } else {
      callback(undefined, docs);
    }
  });
};

// -- FIND A PARTICULAR THING IN LIST OF THINGS -- /
mod.findPost = function (urlId, callback) {
  blog.findOne({
    urlId: urlId
  }).exec(function (err, doc) {
    if (err) {
      callback({
        errorName: c.DB_ERROR,
        errorDescription: "DB Error in findPost"
      });
    } else {
      callback(undefined, doc);
    }
  });
};

mod.findPostById = function (postId, callback) {
  blog.findById(postId, function (err, post) {
    if (err) {
      callback(err, undefined);
    } else {
      callback(undefined, post);
    }
  });
};

mod.findProject = function (urlId, callback) {
  portfolio.findOne({
    urlId: urlId
  }).exec(function (err, doc) {
    if (err) {
      callback({
        errorName: c.DB_ERROR,
        errorDescription: "DB Error in findProject"
      });
    } else {
      callback(undefined, doc);
    }
  });
};

mod.findProjectById = function (projectId, callback) {
  portfolio.findById(projectId, function (err, project) {
    if (err) {
      callback(err, undefined);
    } else {
      callback(undefined, project);
    }
  });
};

module.exports = mod;
