var express = require("express");
var router = express.Router();
var db = require("../data/db");
var request = require('request');
var markdown = require('markdown').markdown;

/* GET home page. */
router.get("/", function(req, res, next) {
  var page = req.query.page ? req.query.page : 0;
  db.getProjects(page, function(err, projects) {
    console.log(projects);
    res.render("index", { title: "design | navarjun", projects: projects });
  });
});

router.get("/writing", function(req, res, next) {
  var page = req.query.page ? req.query.page : 0;
  db.getPosts(page, function(err, posts) {
    res.render("writing", { title: "writing | navarjun", posts: posts });
  });
});

router.get("/writing/:urlId", function(req, res, next) {
  var urlId = req.params.urlId;
  urlId = encodeURIComponent(urlId);
  db.findPost(urlId, function(err, post) {
    if (err) {
      console.log(err);
    } else {
      request.get(post.blogFile, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            var html = markdown.toHTML(body);
            res.render("writing-post", { title: post.title + " | navarjun", post: html });
          }
      });
    }
  });
});

router.get("/design/:urlId", function(req, res, next) {
  var urlId = req.params.urlId;
  urlId = encodeURIComponent(urlId);
  db.findProject(urlId, function(err, project) {
    if (err) {
      console.log(err);
    } else {
      request.get(project.blogFile, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            var html = markdown.toHTML(body);
            console.log(html);
            res.render("design-post", { title: project.title + " | navarjun", post: html });
          }
      });
    }
  });
});

router.get("/editor", function(req, res, next) {
  res.render("editor");
});

router.post("/addPost", function(req, res, next) {
  console.log(req.body);
  var publishDate = req.param("publishDate") ? req.param("publishDate") : (new Date()).valueOf();
  db.addPost(req.param("title"), req.param("summary"), req.param("blogFile"), publishDate, req.param("tags"));
  res.send("OK");
});

router.post("/addProject", function(req, res, next) {
  console.log(req.body);
  var publishDate = req.param("publishDate") ? req.param("publishDate") : (new Date()).valueOf();
  console.log(req.param("title"), req.param("startDate"), req.param("endDate"), publishDate, req.param("imageFile"), req.param("blogFile"), req.param("tags"));
  db.addProject(req.param("title"), req.param("startDate"), req.param("endDate"), publishDate, req.param("imageFile"), req.param("blogFile"), req.param("tags"));
  res.send("OK");
});

module.exports = router;
