var express = require("express");
var router = express.Router();
var db = require("../data/presidentialElectionDB");

router.get("/recentFollowersData", function(req, res, _) {
  console.log(req.hostname);
  db.getRecentFollowers(function(data) {
    let responseArray = [];
    for (let index in data) {
      var object = data[index];
      if (object["username"] == "hillaryclinton" || object["username"] == "berniesanders") {
        object["party"] = "Democratic"
      } else {
        object["party"] = "Republican"
      }
      responseArray.push(object)
    }
    res.set("Acess-Control-Allow-Origin", "https://navarjun.github.io/");
    res.json({
      "data": responseArray
    });
  })
});

router.get("/instagramPostsData/:username", function(req, res, next) {
  db.getRecentFollowers(function(data) {
    let instagramUser = data.filter(function(d) {
      return d.username == req.params.username
    })[0];
    var instagramUserId = instagramUser.instagramUserId;

    db.getRecentPosts(instagramUserId,
      function(result) {
        res.set("Acess-Control-Allow-Origin", "https://navarjun.github.io/");
        res.json({
          "data": {
              "user": instagramUser,
              "timeline": result.map(function(d) { return d.details[0]; })
            }
        });
      });
  });
});

module.exports = router;
