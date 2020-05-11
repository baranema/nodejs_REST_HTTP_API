const sqlite = require('sqlite3').verbose();
let db = my_database('./phones.db');

// ###############################################################################

var express = require('express');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(bodyParser.json());
app.use(cors())

var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log('Server listening on ' + PORT);
})

app.get("/", function(req, res) {
    response_body = {'Group': 'Lab126'} ;
    res.send(response_body);
});

app.get('/phones', (req, res) => {
    db.all(`SELECT * FROM phones`, function(err, data) {
        if (err) {
            res.status(400).send(err);
            console.log("Error occured. Cannot get the products");
        }
        else {
            console.log("Successfully implied GET method.");
            res.writeHead(200, {'Content-Type': 'application/json'});
            var myObj = data;
            res.end(JSON.stringify(myObj));
        }
    });
});

app.post('/phones', (req, res) => { 
    db.run(`INSERT INTO phones (brand, model, os, image, screensize) VALUES (?, ?, ?, ?, ?)`,
    [req.body.brand, req.body.model, req.body.os, req.body.image, req.body.screensize], function(err) {
        if (err) {
            res.status(400).send(err);
            console.log("Error occured while posting a new product");
        }
        else {
            res.send("Successfully posted.")
            console.log("New product was successfully posted");
        }
    });
});

app.put('/phones/:id', (req, res) => {
    db.run(`
        UPDATE phones
        SET image = "`+ req.body.image +`",
            brand = "`+ req.body.brand +`",
            model = "`+ req.body.model +`",
            os = "`+ req.body.os +`",
            screensize = "`+ req.body.screensize +`"
        WHERE id=`+ req.params.id +``, function(err) {
        if (err) {
            res.status(400).send(err);
            console.log("An error occured while updating");
        }
        else {
            res.send("Successfully updated.")
            console.log("Entry succesfully updated");
        }
    });
});

app.delete('/phones/delete/:id', (req, res) => {
    db.run(`DELETE from phones WHERE id=`+ req.params.id +``, function(err) {
        if (err) {
            res.status(400).send(err);
            console.log("An error occured while deleting");
        }
        else {
            res.send("Successfully deleted.")
            console.log("Entry succesfully deleted");
        }
    });
});

app.delete('/reset', (req, res) => { 
    db.run(`DELETE from phones`, 
        function(err) {
        if (err) {
            res.status(400).send(err);
            console.log("An error occured while reseting");
        }
        else {
            res.send("Successful reset.")
            console.log("Deleted. Database now is empty");
        }
    });
});

app.get('/phones/:id', function(req, res) {
    db.all(`SELECT * FROM phones WHERE id=?`, [req.params.id], function(err, rows) {
        if (err) {
            res.status(400).send(err);
            console.log("An error occured while searching for a product");
        }
    	else {
            return res.json(rows);
        }
    });
});

app.get('/phones/:brand', function(req, res) {
    db.all(`SELECT * FROM phones WHERE brand=?`, [req.params.brand], function(err, rows) {
        if (err) {
            res.status(400).send(err);
            console.log("An error occured while searching for a product");
        }
    	else {
            return res.json(rows);
        }
    });
});

// ###############################################################################
// Some helper functions called above
function my_database(filename) {
	// Conncect to db by opening filename, create filename if it does not exist:
	var db = new sqlite.Database(filename, (err) => {
  		if (err) {
			console.error(err.message);
  		}
  		console.log('Connected to the phones database.');
	});
	// Create our phones table if it does not exist already:
	db.serialize(() => {
		db.run(`
        	CREATE TABLE IF NOT EXISTS phones
        	(id 	INTEGER PRIMARY KEY,
        	brand	CHAR(100) NOT NULL,
        	model 	CHAR(100) NOT NULL,
        	os 	    CHAR(10) NOT NULL,
        	image 	CHAR(254) NOT NULL,
        	screensize INTEGER NOT NULL
        	)`);
		db.all(`select count(*) as count from phones`, function(err, result) {
			if (result[0].count == 0) {
				console.log('Your database is empty');
			} else {
				console.log("Database already contains", result[0].count, " item(s) at startup.");
			}
		});
	});
	return db;
}