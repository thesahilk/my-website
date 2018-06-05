var c = require('../helpers/constants');
const slugify = require('slugify');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var username = process.env.MONGO_USER;
var password = process.env.MONGO_PASS;
var mongoServer = process.env.MONGO_SERVER;
var url = 'mongodb://' + username + ':' + password + '@' + mongoServer + '/website?authSource=admin';
if (!username) {
    url = 'mongodb://localhost:27017/website';
}
const db = mongoose.createConnection(url);
console.log(url);

const Blog = db.model('v2_blog', new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    blogFile: {
        type: String,
        required: true
    },
    publishDate: {
        type: Date,
        default: Date.now
    },
    tags: {
        type: [String],
        default: []
    },
    slug: {
        type: String,
        required: true
    },
    version: {
        type: String,
        default: '2.0.0'
    }
}, {timestamps: true})
);

const Project = db.model('v2_project', new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    publishDate: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String,
        required: true
    },
    imageFile: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        default: []
    },
    slug: {
        type: String,
        required: true
    },
    rgb: {
        type: [Number],
        default: [68, 68, 68]
    }
}, {timestamps: true})
);

const Photograph = db.model('v2_photograph', new mongoose.Schema({
    file: {
        type: String,
        required: true
    },
    externalUrl: {
        type: String
    },
    tags: {
        type: [String],
        default: []
    }
}, {timestamps: true})
);

const Calligraph = db.model('v2_calligraph', new mongoose.Schema({
    file: {
        type: String,
        required: true
    },
    externalUrl: {
        type: String
    },
    tags: {
        type: [String],
        default: []
    }
}, {timestamps: true})
);

var mod = {};

// -- ADD TO DB -- //
mod.addBlogPost = function (title, summary, blogFile, tags = []) {
    const obj = new Blog({
        title: title,
        summary: summary,
        blogFile: blogFile,
        tags: tags,
        slug: slugify(title)
    });
    return obj.save();
};

mod.addProject = function (title, startDate, endDate, description, imageFile, slug, tags, rgb) {
    const obj = new Project({
        title,
        startDate,
        endDate,
        description,
        imageFile,
        tags,
        slug,
        rgb
    });
    return obj.save();
};

mod.addPhotograph = function (file, externalUrl, tags) {
    const obj = new Photograph({
        file, externalUrl, tags
    });
    return obj.save();
};

mod.addCalligraph = function (file, externalUrl, tags) {
    const obj = new Calligraph({file, externalUrl, tags});
    return obj.save();
};

// -- GET PAGES -- //
mod.getBlogPostsCount = function (filter = {}) {
    return Blog.find(filter)
        .count()
        .exec();
};

mod.getProjectsCount = function (filter = {}) {
    return Project.find(filter)
        .count()
        .exec();
};

mod.getPhotographsCount = function (filter = {}) {
    return Photograph.find(filter)
        .count()
        .exec();
};

mod.getCalligraphsCount = function (filter = {}) {
    return Calligraph.find(filter)
        .count()
        .exec();
};

// -- GET LIST OF THINGS -- //
mod.getBlogPosts = function (filter = {}, pageSize, page = 0) {
    return Blog.find(filter)
        .limit(pageSize)
        .skip(page * pageSize)
        .sort({createdAt: -1})
        .exec();
};

mod.getProjects = function (filter = {}, pageSize, page = 0) {
    return Project.find(filter)
        .limit(pageSize)
        .skip(page * pageSize)
        .sort({createdAt: -1})
        .exec();
};

mod.getPhotographs = function (filter = {}, pageSize, page = 0) {
    return Photograph.find(filter)
        .limit(pageSize)
        .skip(page * pageSize)
        .sort({createdAt: -1})
        .exec();
};

mod.getCalligraphs = function (filter = {}, pageSize, page = 0) {
    return Calligraph.find(filter)
        .limit(pageSize)
        .skip(page * pageSize)
        .sort({createdAt: -1})
        .exec();
};

module.exports = mod;
