var express = require("express");
var router = express.Router();
var db = require("../data/db");
var request = require("request");
// var markdown = require("markdown").markdown;
var mdBlocks = require("markdown-blocks");
var NOTICE = process.env.NOTICE;

/* GET home page. */
router.get("/", function (req, res) {
  var page = req.query.page ? req.query.page : 1;
  db.getProjects(page, function (err, projects) {
    if (err) {
      res.redirect("/error");
      return;
    }
    db.projectPages(page, function (err, totalPages) {
      if (err) {
        totalPages = page + 1;
      }
      const obj = {
        navbar: "design",
        title: "design | navarjun",
        projects: projects,
        currPage: page,
        totalPages: totalPages
      };
      if (NOTICE) {
        obj["notice"] = NOTICE;
      }
      if (page < totalPages) {
        obj.nextPage = page + 1;
      }
      if (page > 1) {
        obj.prevPage = page - 1;
      }
      res.render("index", obj);
    });
  });
});

/* twitter share link */
router.get("/w/:postId", function (req, res) {
  var postId = req.params.postId;
  postId = encodeURIComponent(postId);
  db.findPostById(postId, function (err, post) {
    if (err) {
      res.redirect("/error");
    } else {
      res.redirect("/writing/" + post.urlId);
    }
  });
});

router.get("/d/:projectId", function (req, res) {
  var projectId = req.params.projectId;
  projectId = encodeURIComponent(projectId);
  db.findProjectById(projectId, function (err, project) {
    if (err) {
      res.redirect("/error");
    } else {
      res.redirect("/design/" + project.urlId);
    }
  });
});

router.get("/writing", function (req, res) {
  var page = req.query.page ? req.query.page : 1;
  db.getPosts(page, function (err, posts) {
    if (err) {
      res.redirect("/error");
      return;
    }
    db.postPages(page, function (err, totalPages) {
      if (err) {
        totalPages = page + 1;
      }
      const obj = {
        navbar: "writing",
        title: "writing | navarjun",
        posts: posts,
        currPage: page,
        totalPages: totalPages
      };
      if (page < totalPages) {
        obj.nextPage = page + 1;
      }
      if (page > 1) {
        obj.prevPage = page - 1;
      }
      res.render("writing", obj);
    });
  });
});

router.get("/shop", function (req, res) {
  var page = req.query.page ? req.query.page : 0;
  db.getShopItems(page, function (err, items) {
    if (err) {
      res.redirect("/error");
      return;
    }
    console.log(items[0]);
    res.render("shop", {
      navbar: "shop",
      title: "shop | navarjun",
      items: items
    });
  });
});

// -- DETAILS POSTS -- //

router.get("/writing/:urlId", function (req, res) {
  var urlId = req.params.urlId;
  urlId = encodeURIComponent(urlId.split(" ").join("-"));
  db.findPost(urlId, function (err, post) {
    if (err) {
      res.redirect("/error");
    } else {
      request.get(post.blogFile, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          var html = mdBlocks(body);
          res.render("writing-post", {
            navbar: "writing",
            title: post.title + " | navarjun",
            post: html,
            url: "http://navarjun.com/writing/" + urlId,
            params: post
          });
        }
      });
    }
  });
});

router.get("/design/:urlId", function (req, res) {
  var urlId = req.params.urlId;
  urlId = encodeURIComponent(urlId.split(" ").join("-"));
  db.findProject(urlId, function (err, project) {
    if (err) {
      res.redirect("/error");
    } else {
      request.get(project.blogFile, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          var html = mdBlocks(body);
          res.render("design-post", {
            navbar: "design",
            title: project.title + " | navarjun",
            post: html,
            url: "http://navarjun.com/design/" + urlId,
            params: project
          });
        }
      });
    }
  });
});

// -- EDITOR THINGS -- //
router.get("/editor", function (req, res) {
  res.render("editor");
});

router.post("/addPost", function (req, res) {
  var publishDate = req.param("publishDate") ? req.param("publishDate") : (new Date()).valueOf();
  db.addPost(req.param("title"), req.param("summary"), req.param("blogFile"), publishDate, req.param("tags"));
  res.send("OK");
});

router.post("/addProject", function (req, res) {
  var publishDate = req.param("publishDate") ? req.param("publishDate") : (new Date()).valueOf();
  db.addProject(req.param("title"), req.param("startDate"), req.param("endDate"), publishDate, req.param("description"), req.param("imageFile"), req.param("blogFile"), req.param("tags"));
  res.send("OK");
});

router.post("/addShopItem", function (req, res) {
  var publishDate = req.param("publishDate") ? req.param("publishDate") : (new Date()).valueOf();
  db.addShopItem(req.param("title"), req.param("description"), req.param("isAvailable"), req.param("imageFile"), req.param("width_cm"), req.param("height_cm"), publishDate, req.param("priceUSD"), req.param("process"));
  res.send("OK");
});
router.get("/error", function (req, res) {
  res.render("error");
});

module.exports = router;
