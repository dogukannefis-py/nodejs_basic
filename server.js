const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const InstagramApi = require("instagram-web-api");
const FileCookieStore = require("tough-cookie-filestore2");
const cookieStore = new FileCookieStore("./cookies.json");

const client = new InstagramApi({
  username: "newUser1676",
  password: "3e4r5t",
  cookieStore,
});

client.login().then(() => {
  client.getProfile().then(console.log);
});

app.get("/", (req, res) => {
  console.log("First is running");
  res.send("Hello To Your Instagram Server");
});

app.get("/account/:userName", (req, res) => {
  console.log("Username is running");
  const user_name = req.params.userName;
  (async () => {
    try{
     const instagram_user = await client.getUserByUsername({
      username: `${user_name}`,
    });
    res.json(instagram_user);
  }
  catch(err){
    console.error("There was an error:", err.message);
  }
  })();
});

app.get("/search/:q", (req, res) => {
  const query = req.params.q;
  console.log("Serach is running");
  (async () => {
    try{
    const resulte = await client.search({ query: query });
    res.send(resulte);
    }
    catch(err){
      console.error("There was an error:", err.message);
    }
  })();
});

app.use(function (req, res, next) {
  res.status(404).send({
    Error: "Sorry can't find that!",
    Code: res.statusCode,
  });
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
/*
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
*/

// Add a health check route in express
app.get('/_health', (req, res) => {
  res.status(500).send('ok')
})