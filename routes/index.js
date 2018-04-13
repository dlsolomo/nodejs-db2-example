
//Example Function to lookup a record
exports.lookupRecords = function(ibmdb,connString) {
    return function(req, res) {

       res.render('lookup');
       console.log(req.body);
       //Open Db2 Connection
       ibmdb.open(connString, function(err, conn) {
			    if (err ) {
			      res.send("error occurred " + err.message);
			    }
			else {
        //Prepare the SQL Statement
        var sql = "SELECT * FROM DASH14416.NODE_TEST WHERE LAST_NAME = ? AND FIRST_NAME = ?";
        conn.query(sql,req.body["LAST_NAME"], req.body["FIRST_NAME"], function(err, tables, moreResultSets) {

        //Show the SQL Result
				if ( !err ) {
					res.render('tablelist', {
						"tablelist" : tables,
						"tableName" : "Your Query Results",
						"message": "Congratulations. Your connection to Db2 is successful."

					 });


				} else {
				   res.send("error occurred " + err.message);
				}

        //Close Db2 Connection
        conn.close(function(){
					console.log("Connection Closed");
				});
      });
			}
		});

	};
};

// Example Function to add a record to a table
exports.addRecord = function(ibmdb,connString) {

                return function(req, res) {

                    console.log(req.body)
                    //Open Db2 connection
                     ibmdb.open(connString, function(err, conn) {
                           if (err ) {
                              res.send("error occurred " + err.message);
                           }
                           else {
                              // prepare the SQL statement
                              conn.prepare("INSERT INTO DASH14416.NODE_TEST(FIRST_NAME,LAST_NAME,EMAIL,PHONE) VALUES (?,?,?,?)", function(err, stmt) {
                                 if (err) {
                                    //could not prepare for some reason
                                    console.log(err);
                                    return conn.closeSync();
                                 }

                                 //Bind and Execute the statment asynchronously
                                 stmt.execute([req.body ["First Name"],req.body["Last Name"],req.body["email"],req.body["Phone"]], function (err, result) {
                                   console.log(err);
                                   // Close the Db2 connection
                                   conn.close(function(){
                                     console.log("Connection Closed");
                                   });
                                });
                              });
                     };
              });
         }
  };
