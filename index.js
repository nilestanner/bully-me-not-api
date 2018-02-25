var api = require('instagram-node').instagram();
var app = require('express')();
var request = require('request');

//https://www.instagram.com/oauth/authorize/?client_id=cbd07d0a3dd944038c6d877fb1aaf53a&redirect_uri=http://localhost&response_type=token&scope=public_content
app.listen(process.env.PORT || 9000, () => {
  console.log('app has started');
});

api.use({
  access_token: process.env.instagram_hackthebullyvictim_access_id
});


app.get('/', (req, res) => {
  res.send('it works');
});

app.get('/user', (req, res) => {
  api.user_search(req.query.user, (err, data) => {
    res.send(data);
  });
});

var alerts = [];
var checkedComments = {};

app.get('/alerts', (req, res) => {
  res.send(alerts);
});

app.get('/refresh', (req, res) => {
  try {
      api.user_search('hackthebullyvictim', (err, data) => {
        api.user_media_recent(data[0].id, (err, medias) => {
          promises = []
          medias.forEach((media) => {
            api.comments(media.id.split('_')[0], (err, comments) => {
              promises.push(...comments.map((comment) => {
                if (!checkedComments[comment.id]){
                  checkedComments[comment.id] = 1;
                  var options = {
                    url: `https://cyberbullyingornot.herokuapp.com`,
                    qs: {
                      message: comment.text
                    }
                  };
                  return request(options, (err, res, body) => {
                    if (body == 1 || body == 2) {
                      comment.thumbnail = media.images.thumbnail;
                      comment.posturl = media.link;
                      comment.severity = body;
                      alerts.push(comment);
                    }
                  });
                }
              }));

            });
          });
          Promise.all(promises).then(() => {
              res.send('ok');
          });
        });
      });
  }
  catch (ex) {
    console.dir(ex);
    res.status(500).send('fail');
  }
});
