var express = require('express');
var router = express.Router();
var mysql = require('../config/config');
const nJwt = require('njwt');
const config = require('../config/jwt_config');

// Horse Data Pull
router.get('/horses', function (req, res) {
    mysql.query("SELECT * FROM horses", function (err, rows) {
    if (err) {
        throw err;
    } else {
        res.status(200).send({"data": rows});
    }
    });
});

// Horse Data Post
router.post('/horses', function (req, res) {
    mysql.query("INSERT INTO horses (Name, herd, bands) values ('"+req.body.Name+"', '"+req.body.Location+"', '"+req.body.BandName+"')",
    function (err, result) { 
        if (err) {
            res.status(500).send({"success": false});
            throw err;
        } else {
            let Color = req.body.Features.Color === undefined ? '"Black"' : '"'+req.body.Features.Color+'"';
            let ManePosition = req.body.Features.ManePosition === undefined ? null : '"'+req.body.Features.ManePosition+'"';
            let ManeColor = req.body.Features.Mane === undefined ? null : '"'+req.body.Features.Mane+'"';
            let leftFront = req.body.Features.leftFront === undefined ? null : '"'+req.body.Features.leftFront+'"';
            let rightFront = req.body.Features.rightFront === undefined ? null : '"'+req.body.Features.rightFront+'"';
            let leftBack = req.body.Features.leftBack === undefined ? null : '"'+req.body.Features.leftBack+'"';
            let rightBack = req.body.Features.rightBack === undefined ? null : '"'+req.body.Features.rightBack+'"';
            let Face = req.body.Features.Face === undefined ? null : '"'+req.body.Features.Face+'"';
            mysql.query("INSERT INTO horses_markings (HorseID, color, Position, Mane_Color, LFMarking, RFMarking, LHMarking, RHMarking, FaceString) values ('"+result.insertId+"', "+Color+", "+ManePosition+", "+ManeColor+", "+leftFront+", "+rightFront+", "+leftBack+", "+rightBack+", "+Face+")",
            function (error, respo) { 
                if (error) {
                    res.status(500).send({"success": false});
                    throw error;
                } else {
                    mysql.query("INSERT INTO horses_images (HorseID, ImageFile) values ('"+result.insertId+"', 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png'), ('"+result.insertId+"', 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png')",
                        function (errr, resp) { 
                        if (errr) {
                            res.status(500).send({"success": false});
                            throw err;
                        } else {
                            res.status(200).send({"success": true});
                        }
                    });
                }
            });
        }
    });
});

// Horse Data PUT
router.put('/horses', function (req, res) {
    mysql.query("UPDATE horses SET Name = '"+req.body.Name+"', herd = '"+req.body.Location+"', bands = '"+req.body.BandName+"', Status = '"+req.body.Status+"' WHERE ID = '"+req.body.HorseID+"'",
    function (err, result) { 
        if (err) {
            res.status(500).send({"success": false});
            throw err;
        } else {
            let Color = req.body.Features.Color === undefined ? '"Black"' : '"'+req.body.Features.Color+'"';
            let ManePosition = req.body.Features.ManePosition === undefined || "" || null ? null : '"'+req.body.Features.ManePosition+'"';
            let ManeColor = req.body.Features.Mane === undefined || "" || null ? null : '"'+req.body.Features.Mane+'"';
            let leftFront = req.body.Features.leftFront === undefined || "" || null ? null : '"'+req.body.Features.leftFront+'"';
            let rightFront = req.body.Features.rightFront === undefined || "" || null ? null : '"'+req.body.Features.rightFront+'"';
            let leftBack = req.body.Features.leftBack === undefined || "" || null ? null : '"'+req.body.Features.leftBack+'"';
            let rightBack = req.body.Features.rightBack === undefined || "" || null ? null : '"'+req.body.Features.rightBack+'"';
            let Face = req.body.Features.Face === undefined || "" || null ? null : '"'+req.body.Features.Face+'"';
            mysql.query("UPDATE horses_markings SET color = "+Color+", Position = "+ManePosition+", Mane_Color = "+ManeColor+", LFMarking = "+leftFront+",  RFMarking = "+rightFront+", LHMarking = "+leftBack+", RHMarking = "+rightBack+", FaceString = "+Face+" WHERE HorseID = '"+req.body.HorseID+"'",
            function (error, respo) { 
                if (error) {
                    res.status(500).send({"success": false});
                    throw error;
                } else {
                    res.status(200).send({"success": true});
                }
            });
        }
    });
});


// Horse Images Pull
router.get('/horseimages', function (req, res) {
    mysql.query("SELECT * FROM horses_images", function (err, rows) {
    if (err) {
        throw err;
    } else {
        res.status(200).send({"data": rows});
    }
    });
});

// Horse Treatment Pull
router.get('/horsetreatments', function (req, res) {
    mysql.query("SELECT * FROM horses_treatments", function (err, rows) {
    if (err) {
        throw err;
    } else {
        res.status(200).send({"data": rows});
    }
    });
});


// Horse Markings Pull
router.get('/horsemarkings', function (req, res) {
    mysql.query("SELECT * FROM horses_markings", function (err, rows) {
    if (err) {
        throw err;
    } else {
        res.status(200).send({"data": rows});
    }
    });
});

// Post
router.post('/support', function (req, res) {
    mysql.query("INSERT INTO support (Name, Email, Comments) values ('"+req.body.Name+"', '"+req.body.Email+"', '"+req.body.Comments+"')",
        function (err, result) { 
        if (err) {
            res.status(500).send({"success": false});
            throw err;
        } else {
            res.status(200).send({"success": true});
        }
    });
});

router.post('/dart', function (req, res) {
    mysql.query("INSERT INTO horses_treatments (HorseID, Date, Action) values ('"+req.body.HorseID+"', '"+formatDate(new Date())+"', '"+req.body.Shot+"')",
        function (err, result) { 
        if (err) {
            res.status(500).send({"success": false, "id": null});
            throw err;
        } else {
            res.status(200).send({"success": true, "id": result.insertId});
        }
    });
});


function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

module.exports = router;