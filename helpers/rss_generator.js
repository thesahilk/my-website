const CronJob = require('cron').CronJob;
const request = require('request');
const { toXML } = require('jstoxml');
const mdBlocks = require('markdown-blocks');
const db = require('../data/db_v2');

function getRSS () {
    db.getBlogPosts({}, 50)
        .then(function (posts) {
            const createXML = function () {
                const items = posts.map(d => {
                    return {
                        item: {
                            title: d.title,
                            link: 'http://navarjun.com/blog/' + d.slug,
                            description: d.content,
                            pubDate: d.publishDate,
                            GUID: d._id.toString()
                        }
                    };
                });

                const xmlOptions = {
                    header: true,
                    indent: '  '
                };
                const rssFeed = toXML(
                    {
                        _name: 'rss',
                        _attrs: {
                            version: '2.0'
                        },
                        _content: {
                            channel: [
                                { title: 'navarjun | blog' },
                                { description: 'Personal blog of Navarjun. Navarjun is an information designer and developer.' },
                                { link: 'http://navarjun.com/blog' },
                                { lastBuildDate: Date.now() },
                                { pubDate: () => Date.now() },
                                { language: 'en' },
                                ...items
                            ]
                        }
                    }, xmlOptions);
                RSS_CACHE = rssFeed;
                console.log('done');
            };
            const loadBlogFile = function (index = 0, tryCount = 0) {
                if (index < posts.length) {
                    request.get(posts[index].blogFile, function (error, response, body) {
                        if (!error && response.statusCode === 200) {
                            var html = mdBlocks(body);
                            posts[index].content = html;

                            setTimeout(() => { loadBlogFile(++index); }, 0);
                        } else {
                            if (tryCount < 3) {
                                setTimeout(() => { loadBlogFile(index, ++tryCount); }, 0);
                            } else {
                                setTimeout(() => { loadBlogFile(++index); }, 0);
                            }
                        }
                    });
                } else {
                    createXML();
                }
            };

            loadBlogFile();
        })
        .catch(function (err) {
            console.log(err);
        });
}

var job = new CronJob('* * * * 0 0');
job.start();
getRSS();

var RSS_CACHE;

module.exports = {
    rss: () => { return RSS_CACHE; }
};
