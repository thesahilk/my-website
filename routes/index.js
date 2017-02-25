var express = require("express");
var router = express.Router();
var db = require("../data/db");
var request = require('request');
var markdown = require('markdown').markdown;

/* GET home page. */
router.get("/", function(req, res, next) {
  var page = req.query.page ? req.query.page : 0;
  db.getProjects(page, function(err, projects) {
    res.render("index", { navbar: "design", title: "design | navarjun", projects: projects });
  });
});

/* twitter share link */
router.get("/w/:postId", function(req, res, next) {
  var postId = req.params.postId;
  postId = encodeURIComponent(postId);
  db.findPostById(postId, function(err, post) {
    if (err) {
      res.redirect("/error");
    } else {
      res.redirect("/writing/"+post.urlId);
    }
  });
});

router.get("/d/:projectId", function(req, res, next) {
  var projectId = req.params.projectId;
  projectId = encodeURIComponent(projectId);
  db.findProjectById(projectId, function(err, project) {
    if (err) {
      res.redirect("/error");
    } else {
      res.redirect("/design/"+project.urlId);
    }
  });
});

router.get("/writing", function(req, res, next) {
  var page = req.query.page ? req.query.page : 0;
  db.getPosts(page, function(err, posts) {
    res.render("writing", { navbar: "writing", title: "writing | navarjun", posts: posts });
  });
});

router.get("/writing/:urlId", function(req, res, next) {
  var urlId = req.params.urlId;
  urlId = encodeURIComponent(urlId);
  db.findPost(urlId, function(err, post) {
    if (err) {
      res.redirect("/error");
    } else {
      request.get(post.blogFile, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            var html = markdown.toHTML(body);
            res.render("writing-post", { navbar: "writing", title: post.title + " | navarjun", post: html, url: "http://navarjun.com/writing/"+urlId, params: post });
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
      res.redirect("/error");
    } else {
      request.get(project.blogFile, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            var html = markdown.toHTML(body);
            res.render("design-post", { navbar: "design", title: project.title + " | navarjun", post: html, url: "http://navarjun.com/design/"+urlId, params: project });
          }
      });
    }
  });
});

router.get("/editor", function(req, res, next) {
  res.render("editor");
});

router.post("/addPost", function(req, res, next) {
  var publishDate = req.param("publishDate") ? req.param("publishDate") : (new Date()).valueOf();
  db.addPost(req.param("title"), req.param("summary"), req.param("blogFile"), publishDate, req.param("tags"));
  res.send("OK");
});

router.post("/addProject", function(req, res, next) {
  var publishDate = req.param("publishDate") ? req.param("publishDate") : (new Date()).valueOf();
  db.addProject(req.param("title"), req.param("startDate"), req.param("endDate"), publishDate, req.param("description"), req.param("imageFile"), req.param("blogFile"), req.param("tags"));
  res.send("OK");
});

router.get("/error", function(req, res, next) {
  res.render("error");
});

module.exports = router;
