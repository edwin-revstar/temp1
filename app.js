const express = require("express");
const path = require("path");
const mysql = require("mysql");
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");

dotenv.config({ path: "./.env" });

// start server
const app = express();

// const ip = '10.200.102.53';

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

/*
const publicD = path.join(__dirname, './assets');
app.use(express.static(publicD));
*/

const a = path.join(__dirname, "./assets/images/brand");
const b = path.join(__dirname, "./assets/plugins/bootstrap/css");
const c = path.join(__dirname, "./assets/css");
const d = path.join(__dirname, "./assets/plugins/web-fonts");
const e = path.join(__dirname, "./assets/plugins/web-fonts/font-awesome");
const f = path.join(__dirname, "./assets/images/svgs");
const g = path.join(__dirname, "./assets/images/users");
const h = path.join(__dirname, "./assets/images/pattern");
const i = path.join(__dirname, "./assets/js/vendors");
const j = path.join(__dirname, "./assets/plugins/bootstrap/js");
const k = path.join(__dirname, "./assets/plugins/othercharts");
const l = path.join(__dirname, "./assets/js/vendors");
const m = path.join(__dirname, "./assets/plugins/rating");
const n = path.join(__dirname, "./assets/plugins/p-scrollbar");
const o = path.join(__dirname, "./assets/plugins/sidemenu");
const p = path.join(__dirname, "./assets/js");
const q = path.join(__dirname, "./assets/images/files");
const r = path.join(__dirname, "./assets/plugins/select2");

app.use(express.static(a));
app.use(express.static(b));
app.use(express.static(c));
app.use(express.static(d));
app.use(express.static(e));
app.use(express.static(f));
app.use(express.static(g));
app.use(express.static(h));
app.use(express.static(i));
app.use(express.static(j));
app.use(express.static(k));
app.use(express.static(l));
app.use(express.static(m));
app.use(express.static(n));
app.use(express.static(o));
app.use(express.static(p));
app.use(express.static(q));
app.use(express.static(r));

//grab data from forms
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set("view engine", "hbs");

db.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("MYSQL Connected");
  }
});

// look at routes folder to redirect accordingly
app.use("/", require("./routes/pages"));
//whenever we are at /UserDashboard we require the following route
//app.use('/UserDashboard', require('./routes/pages'));
// whenever we are at /auth, we require the following route
app.use("/", require("./auth"));
app.use("/auth", require("./auth"));
app.use(
  fileUpload({
    createParentPath: true,
  })
);

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

app.post("/HotelSubmitFile", function (req, res) {
  let i = randomNumber(1, 99999);

  const { lastName, roomNum } = req.body;
  let filename = req.files.filename;
  const time = new Date().toISOString().slice(0, 19).replace("T", " ");

  db.query(
    "INSERT INTO HotelUser (idHotelUser, LastName, RoomNumber, File, Time) VALUES (?, ?, ?, ?, ?)",
    [i, lastName, roomNum, filename.data, time],
    async (error, result) => {
      console.log(error, result);

      db.query(
        "INSERT INTO HotelUserPrinter (User_HotelUserID, Printer_HotelPrinterID) VALUES (?, ?)",
        [i, 1],
        async (error, result) => {
          /*  return res.render('Hotel', {
                message: 'Thank You'
            });*/
        }
      );
    }
  );
});

/*
app.listen(5002, ip, (req, res) => {
    console.log("Server Started");
});
*/

const WEB_PORT = process.env.WEB_PORT || 5002;
app.listen(WEB_PORT, (req, res) => {
  console.log(`Server Started on port ${WEB_PORT}`);
});
