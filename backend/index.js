const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongo = require("mongoose");

const app = express();
app.use(express.json());
app.use(cors());

const username = "poorani_d13";
const password = encodeURIComponent("Ginoraj@1506");

const uri = `mongodb+srv://${username}:${password}@cluster3.e5dyf2l.mongodb.net`;
const model = mongo.model('model', {}, 'bulkmail')

app.listen(5000, () => {
  console.log("Server started...");
});

app.use(express.urlencoded({ extended: true }));

app.get("/sendmail", (req, res) => {
  console.log("get method");
  res.send("Get method");
});

app.post("/sendmail", (req, res) => {
  var subject = req.body.subject;
  var message = req.body.message;
  var emailList = req.body.emailList;
  console.log("post req received");
  console.log("subject - ", subject);
  console.log("message - ", message);
  console.log("emailList - ", emailList);

  mongo.connect(uri)
  .then(() => {console.log('DB Connected')})
  .catch((error) => {console.log('DB not Connected', error)});

  model.find().then((data)=>{
        const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: data[0].toJSON().user,
            pass: data[0].toJSON().pass,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });
  })

  new Promise(async (resolve, reject) => {
    try {
      for (let i = 0; i < emailList.length; i++) {
        console.log("inside for loop");
        await transporter.sendMail({
          from: data[0].toJSON().user,
          to: emailList[i],
          subject: subject,
          text: message,
        });
        console.log("Email sent to - ", emailList[i]);
      }
      resolve("Success");
    } catch (error) {
      reject("failed");
      console.log("In catch block", error);
    }
  })
    .then(() => {
      res.status(200).send('Email sent');
    })
    .catch(() => {
      console.log("in reject block");
      res.status(400).send('Email not sent');
    });
});
