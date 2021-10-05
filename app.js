const express = require("express");
const app = express();
const fs = require("fs");
const ytdl = require("ytdl-core");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

function renderHTML(res, path) {
  return fs.readFile(path, function (err, data) {
    if (err) return err;
    res.end(data);
  });
}

function htmlDOM(path, callback) {
  fs.readFile(path, function (err, data) {
    if (err) return err;
    callback(data.toString());
  });
}

function errorFile(res, html) {
  fs.writeFile("./views/error.html", html, function (err) {
    if (err) return err;
    renderHTML(res, "./views/error.html");
  });
}
function LoadingFile(res, html) {
  fs.writeFile("./views/loading.html", html, function (err) {
    if (err) return err;
    renderHTML(res, "./views/loading.html");
  });
}

app.use(express.static("public"));

app.get("/", function (req, res) {
  renderHTML(res, "./views/index.html");
});

app.get("/download", async function (req, res) {
  try {
    const youtubeLink = req.query.url;
    const info = await ytdl.getBasicInfo(youtubeLink);
    const title = info.player_response.videoDetails.title;
    res.header("Content-Disposition", `attachment; filename="${title}.mp4"`);
    ytdl(youtubeLink, {
      format: "mp4",
    }).pipe(res);
  } catch (err) {
    htmlDOM("./views/index.html", function (data) {
      const { document } = new JSDOM(`${data}`).window;
      const errorText = document.body.querySelector("span.error-text");
      errorText.textContent = `Sorry.. video url ${req.query.url} not found, please check your video url`;
      const html = document.documentElement.outerHTML;
      errorFile(res, html);
    });
  }
});

app.get("/mp3", async function (req, res) {
  try {
    const youtubeLink = req.query.url;
    const info = await ytdl.getBasicInfo(youtubeLink);
    const title = info.player_response.videoDetails.title;
    res.header("Content-Disposition", `attachment; filename="${title}.mp3"`);
    ytdl(youtubeLink, {
      filter: "audioonly",
    }).pipe(res);
  } catch (err) {
    htmlDOM("./views/index.html", function (data) {
      const { document } = new JSDOM(`${data}`).window;
      const errorText = document.body.querySelector("span.error-text");
      errorText.textContent = `Sorry.. video url ${req.query.url} not found, please check your video url`;
      const html = document.documentElement.outerHTML;
      errorFile(res, html);
    });
  }
});

// 404 Page
app.use((req, res) => {
  renderHTML(res, "./views/404.html");
});

app.listen(process.env.PORT || 3000, () => console.log("Running"));
