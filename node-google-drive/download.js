if (process.argv.length < 4) {
  console.log('Uso: node download.js <id> <arq_saida>');
  return;
}

const { google } = require('googleapis');
const fs = require('fs');

const credentials = require('./credentials.json');

const scopes = [
  'https://www.googleapis.com/auth/drive'
];

const auth = new google.auth.JWT(credentials.client_email, null, credentials.private_key, scopes);

const drive = google.drive({ version: "v3", auth });

let dest = fs.createWriteStream(process.argv[3]);

drive.files.get(
  {fileId: process.argv[2], alt: "media"},
  {responseType: "stream"},
  (err, {data}) => {
    if (err) {
      console.log(err);
      return;
    }
    data
      .on("end", () => console.log("Done."))
      .on("error", (err) => {
        console.log(err);
        return process.exit();
      })
      .pipe(dest);
  }
);
