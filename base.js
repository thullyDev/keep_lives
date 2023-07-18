import express from "express";
import fs from "fs";
import lineReader from "line-reader"
import axios from "axios";

const app = express();

app.use(express.json());
app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  next();
});

app.listen(3000, function () {
  console.log("KeepLives-v1.0.0 ===> http://localhost:" + 3000);
});

app.get("/", async function(req, res) {
  res.status(200).json("Keeps servers live");
});

app.get("/all", function(req, res) {
	let status = 200
	lineReader.eachLine('servers.txt', async function(url, last) {
		try {
			const response = await axios({
			  method: "GET",
			  url: url.trim(),
			})
		} catch(e) {
			status = 503
		}
	});
	
	res.status(status).json(status);
});

//? 404 HANDLER
app.get("*", function (req, res) {
  const routes = app._router.stack.filter((r) => r.route && r.route.methods.get).map((r) => r.route.path);
  const message = "path " + req.originalUrl + " is " + "not found";

  let aval_routes = [];
  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];

    if (!route.includes(req.originalUrl)) continue;

    aval_routes.push(route);
  }

  res.status(400).json({ status_code: 400, message: message, aval_routes: aval_routes });
});
//? 404 HANDLER
