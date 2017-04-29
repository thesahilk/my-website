const mongoose = require('mongoose');
const username = process.env.PRES_MONGO_USER;
const password = process.env.PRES_MONGO_PASS;
const mongoServer = process.env.PRES_MONGO_SERVER;
const dbName = process.env.PRES_DB_NAME;
const db = mongoose.createConnection('mongodb://'+username+':'+password+'@'+mongoServer+'/'+dbName+'?authSource=admin');
console.log('mongodb://'+username+':'+password+'@'+mongoServer+'/'+dbName+'?authSource=admin');


const imageSchema = mongoose.Schema({
  code : String,
  instagramImageId : String,
  userId : {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
  instagramUserId : String,
  locationId : {
      type: mongoose.Schema.ObjectId,
      ref: 'Location',
      required: false
    },
  likes : Number,
  date : Date,
  dataAt : Date,
  comments : Number,
  caption : String
}, {collection: 'Image'});

const imageModel = db.model('Image', imageSchema, 'Image');

const userSchema = mongoose.Schema({
  username: String,
  instagramUserId: String,
  dataAt: Date,
  profilePicURL: String,
  follows: Number,
  fullName: String,
  followedBy: Number,
  biography: String
}, {
  collection: 'User'
});

const userModel = db.model('User', userSchema, 'User');

const mod = {};

mod.getRecentFollowers = function(callback) {
  userModel.aggregate([{
    $match: {
      instagramUserId: {
        $in: ["180329950", "1359613841", "1813324637", "1834271085", "347696668", "548499078", "2109645194"]
      }
    }
  }, {
    $group: {
      _id: "$instagramUserId",
      username: {
        $first: "$username"
      },
      followers: {
        $max: "$followedBy"
      },
      fullname: {
        $first: "$fullName"
      },
      bio: {
        $first: "$biography"
      },
      profilePicURL: {
        $first: "$profilePicURL"
      }
    }
  }, {
    $project: {
      "_id": 0,
      instagramUserId: "$_id",
      username: "$username",
      fullname: "$fullname",
      followers: "$followers",
      bio: "$bio",
      profilePicURL: "$profilePicURL"
    }
  }], function(err, result) {
    if (!err) {
      setTimeout(callback, 0, result);
    }
  });
};

mod.getRecentPosts = function(instagramUserId, callback) {
  imageModel.aggregate([
    {$match: {"instagramUserId": instagramUserId, "date": {"$gte": new Date(2016, 1, 9, 0,0,0)}}},
    {$sort: {"createdAt": -1, "dataAt": -1}},
    {$group: {"_id": "$instagramImageId", "details": {"$push": {"instagramUserId": "$instagramUserId", "instagramImageId": "$instagramImageId", "createdAt": "$date", "dataAt": "$dataAt", "imageCode": "$code", "likes": "$likes", "comments": "$comments", "caption": "$caption"}}
    }},
    { $project: {
        _id:0,
        instagramImageId: "$_id",
        details: {$slice: ["$details", 1]}
      }
    }
  ], function(err, data) {
    if (!err) {
      setTimeout(callback, 0, data)
    }
  });
}

module.exports = mod;
