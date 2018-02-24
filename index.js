var api = require('instagram-node').instagram();
var app = require('express')();
// api.use({
//   client_id: 'cbd07d0a3dd944038c6d877fb1aaf53a',
//   client_secret: '7c650993f2414b60a18092294246598a'
// });
//https://www.instagram.com/oauth/authorize/?client_id=cbd07d0a3dd944038c6d877fb1aaf53a&redirect_uri=http://localhost&response_type=code&scope=public_content
var masterData = [];
app.listen(process.env.PORT || 9000, () => {console.log('app has started')})
api.use({
  access_token: '7166708691.cbd07d0.c8f07f2fb9ed447ebc803d3bb983e615'
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
  api.add_user_subscription('https://bully-me-not.herokuapp.com/subreturn', (err, data) => {
    masterData.push(data);
    res.send('ok');
  })
});

app.get('/subreturn', (req, res) => {
  masterData.push(req);
});

app.get('/data', (req, res) => {
  res.send(masterData);
})



// api.subscriptions((err, subs) => {
//   console.dir(subs);
// })

// api.add_user_subscription('')
