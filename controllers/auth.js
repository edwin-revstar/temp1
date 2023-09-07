const mysql = require("mysql");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Function to generate random number
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

//import database
//import database
const db = mysql.createConnection({
    multipleStatements: true,
    host: "ls-b5a7c2d0523ed96d796d06f76a9bca04dd878354.colruabkptpb.us-east-1.rds.amazonaws.com",
    user: "dbmasterprint",
    password: "Sasuke317",
    database: "dbmaster"
});

exports.register = (req, res) => {

    let i = randomNumber(1, 99999);

    const {username, email, password} = req.body;

    db.query('SELECT Email from User WHERE Email = ?', [email], async (error, results) => {

        // encrypt the password
        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        // insert into database
        var insertSQL = "INSERT INTO User (UserID, AdminID, Username, Email, Passwrd) VALUES (?, ?, ?, ?, ?)";

        // insert into userPrinter
        var insertUserPrinterSQL = "INSERT INTO UserPrinter (User_UserID, Printer_PrinterID) VALUES (?, ?)";

        // relay users printer connections
        var userPrinterSQL = "SELECT * from User WHERE Username = ?;SELECT PrinterName FROM UserPrinter JOIN User ON (User.UserID = UserPrinter.User_UserID) JOIN Printer ON (Printer.PrinterID = UserPrinter.Printer_PrinterID) WHERE Username = ?";


        var resultArray = Object.values(JSON.parse(JSON.stringify(results)))
        if(error){
            console.log(error);
        }
        // email already in database
        // else if(resultArray.length && password.length == 0) password is wrong
        if(resultArray.length > 0){
            return res.render('register', {
                message: 'That Email is already in use.'
            });
        }

        db.query(insertSQL, [i, 1, username, email, hashedPassword], (error, results) => {
            db.query(insertUserPrinterSQL, [i, 1], (error, resultss) => {
                if(error){
                    throw(error);
                } else{
                    db.query(userPrinterSQL, [username, username], async (error, results) => {
                        res.render('UserDashboard', {"data":results[0], "myData":results[1]});
                        console.log("Row one", results[0]);
                        console.log("Row Two", results[1]);
                    })
                }
            })
        }) 
    }); 
   // res.send("Form Submitted");
}


exports.login = (req, res) => {

    const {username, password} = req.body;

    // relay users printer connections
    var userPrinterSQL = "SELECT * from User WHERE Username = ?;SELECT * FROM HotelUserPrinter JOIN HotelUser ON (HotelUser.idHotelUser = HotelUserPrinter.User_HotelUserID) JOIN Printer ON (Printer.PrinterID = HotelUserPrinter.Printer_HotelPrinterID);";

    db.query('SELECT Username from User WHERE Username = ?', [username], async (error, results) => {
        db.query('SELECT Passwrd from User WHERE Passwrd = ?', [password], async (errorPass, resultsPass) => {

            var resultUser = Object.values(JSON.parse(JSON.stringify(results)))
            var resultPass = Object.values(JSON.parse(JSON.stringify(resultsPass)))
            if(error){
                console.log(error);
            }
            // username already in database
            // if(resultArray.length && password.length > 0) password is correct
            // if password correct, query all information from said user, and add it to the UserDashboard page.
            if(resultUser.length > 0 && resultPass.length > 0){
                db.query(userPrinterSQL, [username], async (error, results) => {
                    res.render('UserDashboard', {"data":results[0], "myData":results[1]});
                    let s = username;
                    
                    if (typeof localStorage === "undefined" || localStorage === null) {
                        var LocalStorage = require('node-localstorage').LocalStorage;
                        localStorage = new LocalStorage('./scratch');
                     } else{
                        throw error;
                     }
                     
                    let globalX = localStorage.getItem('username');
                    console.log("Local Storage Username: ", globalX);
                    // profile page should have same username
                    
                })
            } else{
                return res.render('login', {
                    message: 'Incorrect Email or Password'
                });
            }

        })
    });

        
}

// when refresh button is hit, render UserDashboard page with updated user values
exports.refresh = (req, res) => {

    // relay users printer connections
    var userPrinterSQL = "SELECT * from User WHERE Username = ?;SELECT * FROM HotelUserPrinter JOIN HotelUser ON (HotelUser.idHotelUser = HotelUserPrinter.User_HotelUserID) JOIN Printer ON (Printer.PrinterID = HotelUserPrinter.Printer_HotelPrinterID);";

    db.query(userPrinterSQL, [localStorage.getItem('username')],async (error, results) => {
        
        res.render('UserDashboard', {"data":results[0], "myData":results[1]});
        
      })

}

// save user information into database
exports.hotelUser = (req, res) => {

    let i = randomNumber(1, 99999);

    const {lastName, roomNum, filename} = req.body;
    console.log(req);
    console.log(req.files);
    const time = new Date().toISOString().slice(0, 19).replace('T', ' ');

    //db.query("INSERT INTO HotelUser (idHotelUser, LastName, RoomNumber, File, Time) VALUES (?, ?, ?, ?, ?)", [i, lastName, roomNum, filename, time], async (error, result) => {
    //    db.query("INSERT INTO HotelUserPrinter (User_HotelUserID, Printer_HotelPrinterID) VALUES (?, ?)", [i, 1], async (error, result) => {
          /*  return res.render('Hotel', {
                message: 'Thank You'
            });*/
    //    })
    //})
   
}

