var google = require('googleapis').google;
var fs = require('fs');
var CronJob = require('cron').CronJob;
var async = require('async');

var credentials = require('./credentials.json');
var scopes = ['https://www.googleapis.com/auth/drive'];
var auth = new google.auth.JWT(credentials.client_email, null, credentials.private_key, scopes);
var drive = google.drive({ version: "v3", auth });

// Ref.: https://developers.google.com/drive/api/v3/manage-changes#node.js
var startPageToken;

console.log('Initializiing');
drive.changes.getStartPageToken({}, function (err, res) {
    console.log('Obtained start token');
    startPageToken = res.data.startPageToken;

    var job = new CronJob({
        //cronTime: '0 0 5 * * *',
        cronTime: '10 * * * * *',
        onTick: checkUpdates,
        onComplete: function () {
          console.log("Done for now.");
        },
        start: true,
        timeZone: 'America/Sao_Paulo'
    });

    job.start();
});


function checkUpdates() {
    var pageToken = startPageToken;
    var newStartPageToken;
    console.log('Fetching changes');
    async.doWhilst(
        function(callback) {
            drive.changes.list({pageToken: pageToken, fields: '*'}, function (err, res) {
                if (err) {
                    callback(err);
                }
                else {
                    //console.log('RES:', res)
                    res.data.changes.forEach(function (change) {
                        console.log('Change found for file:', change);
                    });
                    pageToken = res.data.nextPageToken;
                    newStartPageToken = res.data.newStartPageToken;
                    console.log('page token:', pageToken, newStartPageToken)
                    callback();
                }
            });
        },
        function() {
            return !!pageToken
        },
        function() {
            console.log('Done fetching changes', newStartPageToken);
            startPageToken = newStartPageToken;
        }
    );
}

