var express = require("express");
var router = express.Router();
var db = require("../data/db_v2");
var request = require("request");
var process = require('process');
var helpers = require('../helpers/constants');

// var markdown = require("markdown").markdown;
var mdBlocks = require("markdown-blocks");
const RSS_FEED = require('../helpers/rss_generator');
var NOTICE = process.env.NOTICE;

/* GET home page. */
router.get("/", function (req, res) {
    res.render('v2/index', { title: 'navarjun', navbar: 'home' });
});

router.get("/rss", function (req, res) {
    res.set('Content-Type', 'text/xml');
    res.status(200).send(RSS_FEED.rss());
});

router.get("/work", function (req, res) {
    const filters = req.body.filters;
    const page = req.query.page || 0;
    db.getProjects(filters, helpers.PAGE_SIZE, page)
        .then(function (projects) {
            db.getProjectsCount(filters)
                .then(function (count) {
                    const paging = {
                        currPage: page,
                        totalPages: parseInt(count / helpers.PAGE_SIZE) + 1
                    };
                    if (paging.totalPages === 1) {
                        res.render('v2/projects', { title: 'Sahil K | Work', navbar: 'work', projects });
                    }
                    if (page !== 0) {
                        paging.prevPage = page - 1;
                    }
                    if (paging.totalPages > page) {
                        paging.nextPage = page + 1;
                    }
                    res.render('v2/projects', { title: 'Sahil K | Work', navbar: 'work', projects, paging });
                }).catch(function (err) {
                    console.log(err);
                    res.render('v2/projects', { title: 'Sahil K | Work', navbar: 'work', projects });
                });
        })
        .catch(function (err) {
            console.log(err);
            res.status(500).send({error: 'Internal server error'});
        });
});

router.get("/blog", function (req, res) {
    const filters = req.body.filters;
    const page = req.query.page || 0;
    db.getBlogPosts(filters, helpers.PAGE_SIZE, page)
        .then(function (posts) {
            posts.forEach(d => {
                d.publishDateStr = helpers.weekdays[d.publishDate.getDay()] + ', ' + d.publishDate.getDate() + ' ' + helpers.monthNames[d.publishDate.getMonth()] + ' ' + d.publishDate.getFullYear();
            });
            db.getBlogPostsCount(filters)
                .then(function (count) {
                    const paging = {
                        currPage: +page,
                        totalPages: parseInt(count / helpers.PAGE_SIZE) + 1
                    };
                    if (paging.totalPages === 1) {
                        res.render('v2/blog', { title: 'navarjun | blog', navbar: 'blog', posts });
                    }
                    if (page !== 0) {
                        paging.prevPage = page - 1;
                    }
                    if (paging.totalPages > page) {
                        paging.nextPage = page + 1;
                    }
                    res.render('v2/blog', { title: 'navarjun | blog', navbar: 'blog', posts, paging });
                }).catch(function (err) {
                    console.log(err);
                    res.render('v2/blog', { title: 'navarjun | blog', navbar: 'blog', posts });
                });
        })
        .catch(function (err) {
            console.log(err);
            res.status(500).send({error: 'Internal server error'});
        });
});

router.get("/blog/:slug", function (req, res, next) {
    const filters = {slug: req.params.slug};
    db.getBlogPosts(filters)
        .then(function (posts) {
            if (posts.length < 1) {
                res.status(404);
                next();
            }
            request.get(posts[0].blogFile, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    var html = mdBlocks(body).replace(/\n/gim, '<br/>')
                        .replace(/<br\/><br\/>/gim, '');
                    res.render('v2/blog-post', { title: 'navarjun | blog', navbar: 'blog', post: posts[0], html: html });
                    res.render('v2/blog-post', {
                        title: posts[0].title + '| navarjun',
                        navbar: 'blog',
                        post: posts[0],
                        html: html
                    });
                }
            });
        })
        .catch(function (err) {
            console.log(err);
            res.status(500).send({error: 'Internal server error'});
        });
});

router.get("/photography", function (req, res) {
    const filters = req.body.filters;
    const page = req.query.page || 0;
    db.getPhotographs(filters, helpers.PAGE_SIZE_BIG, page)
        .then(function (photographyArray) {
            db.getPhotographsCount(filters)
                .then(function (count) {
                    const paging = {
                        currPage: page,
                        totalPages: parseInt(count / helpers.PAGE_SIZE) + 1
                    };
                    if (page !== 0) {
                        paging.prevPage = page - 1;
                    }
                    if (paging.totalPages > page) {
                        paging.nextPage = page + 1;
                    }
                    res.render('v2/photography', { title: 'navarjun | photography', navbar: 'photography', photographyArray: photographyArray, paging });
                }).catch(function (err) {
                    console.log(err);
                    res.render('v2/photography', { title: 'navarjun | photography', navbar: 'photography', photographyArray: photographyArray });
                });
        })
        .catch(function (err) {
            console.log(err);
            res.status(500).send({error: 'Internal server error'});
        });
});

router.get("/calligraphy", function (req, res) {
    const filters = req.body.filters;
    const page = req.query.page || 0;
    db.getCalligraphs(filters, helpers.PAGE_SIZE_BIG, page)
        .then(function (calligraphyArray) {
            db.getCalligraphsCount(filters)
                .then(function (count) {
                    const paging = {
                        currPage: page,
                        totalPages: parseInt(count / helpers.PAGE_SIZE) + 1
                    };
                    if (page !== 0) {
                        paging.prevPage = page - 1;
                    }
                    if (paging.totalPages > page) {
                        paging.nextPage = page + 1;
                    }
                    res.render('v2/calligraphy', { title: 'navarjun | calligraphy', navbar: 'calligraphy', calligraphyArray: calligraphyArray, paging });
                }).catch(function (err) {
                    console.log(err);
                    res.render('v2/calligraphy', { title: 'navarjun | calligraphy', navbar: 'calligraphy', calligraphyArray: calligraphyArray });
                });
        })
        .catch(function (err) {
            console.log(err);
            res.status(500).send({error: 'Internal server error'});
        });
});

// -- ADD THINGS TO DB -- //
router.use(function (req, res, next) {
    if (req.method === 'PUT') {
        if (req.headers.auth === process.env.AUTH) {
            // res.send({message: 'auth'});
            next();
        } else {
            res.status(401).send({error: 'no auth'});
        }
    } else {
        next();
    }
});

router.put('/add/:type', function (req, res, next) {
    console.log(req.body);
    const type = req.params.type;
    const obj = req.body;
    switch (type) {
    case 'blog':
        if (!obj.title || !obj.summary || !obj.blogFile) {
            res.status(402).send({error: '(title, summary, blogFile) is a required argument (title, summary, blogFile, *tags*)'});
            return;
        }
        db.addBlogPost(obj.title, obj.summary, obj.blogFile, obj.tags)
            .then(function (obj) {
                res.status(200).send({blogPost: obj});
            })
            .catch(function (err) {
                res.status(500).send({error: err.message});
            });
        break;

    case 'project':
        if (!obj.title || !obj.startDate || !obj.endDate || !obj.description || !obj.imageFile || !obj.slug) {
            res.status(402).send({error: '(title, startDate, endDate, description, imageFile, slug) is a required argument (title, startDate, endDate, description, imageFile, slug, *tags*)'});
            return;
        }
        obj.startDate = new Date(obj.startDate);
        obj.endDate = new Date(obj.endDate);
        db.addProject(obj.title, obj.startDate, obj.endDate, obj.description, obj.imageFile, obj.slug, obj.tags, obj.rgb)
            .then(function (obj) {
                res.status(200).send({project: obj});
            })
            .catch(function (err) {
                res.status(500).send({error: err.message});
            });
        break;

    case 'photograph':
        if (!obj.file) {
            res.status(402).send({error: 'file is a required argument (file, externalUrl, tags)'});
            return;
        }
        db.addPhotograph(obj.file, obj.externalUrl, obj.tags)
            .then(function (obj) {
                res.status(200).send({photograph: obj});
            })
            .catch(function (err) {
                res.status(500).send({error: err.message});
            });
        break;

    case 'calligraph':
        if (!obj.file) {
            res.status(402).send({error: 'file is a required argument (file, externalUrl, tags)'});
            return;
        }
        db.addCalligraph(obj.file, obj.externalUrl, obj.tags)
            .then(function (obj) {
                res.status(200).send({calligraph: obj});
            })
            .catch(function (err) {
                res.status(500).send({error: err.message});
            });
        break;

    default:
        res.status(402).send({error: 'Invalid content-type'});
        break;
    }
});

module.exports = router;
