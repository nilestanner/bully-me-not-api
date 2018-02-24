var api = require('instagram-node').instagram();
var app = require('express')();
var request = require('request');

//https://www.instagram.com/oauth/authorize/?client_id=cbd07d0a3dd944038c6d877fb1aaf53a&redirect_uri=http://localhost&response_type=code&scope=public_content
var masterData = [];
app.listen(process.env.PORT || 9000, () => {console.log('app has started')})

// api.use({
//   client_id: 'cbd07d0a3dd944038c6d877fb1aaf53a',
//   client_secret: '7c650993f2414b60a18092294246598a'
// });
api.use({
  access_token: '7167628015.cbd07d0.058bab3c489b49d29c3fd919389bbea2'
});


app.get('/', (req, res) => {
  res.send('it works');
});

app.get('/user', (req, res) => {
  api.user_search(req.query.user, (err, data) => {
    res.send(data);
  });
});

app.get('/user/subscribe/:id', (req, res) => {

});

app.get('/subreturn', (req, res) => {
  console.log('subreturn');
  if(req.query['hub.challenge']){
    res.send(req.query['hub.challenge']);
  } else {
    console.dir(req);
  }
});

app.get('/data', (req, res) => {
  res.send(masterData);
});

var alerts = [];
var checkedComments = {};

app.get('/alerts', (req, res) => {
  res.send(alerts);
});

app.get('/refresh', (req, res) => {
  // var promise = new Promise((resolve, reject) => {
    api.user_search('hackthebullyvictim', (err, data) => {
      api.user_media_recent(data[0].id, (err, medias) => {
        medias.forEach((media) => {
          console.dir(media);
          api.comments(media.id.split('_')[0], (err, comments) => {
            console.log(comments);
            comments.forEach((comment) => {
              if (!checkedComments[comment.id]){
                checkedComments[comment.id] = 1;
                var options = {
                  url: `https://cyberbullyingornot.herokuapp.com?message=${comment.text}`
                };
                console.log(comment.text);
                request(options, (err, res, body) => {
                  if (err) {
                    console.log(err);
                  }
                  console.log('bullying or not', body);
                  if (body) {
                    comment.thumbnail = media.images.thumbnail
                    comment.posturl = media.link
                    alerts.push(comment);
                  }
                });
              }
            });
          });
        });
      });
    });
  // });
  res.send('ok');
});
