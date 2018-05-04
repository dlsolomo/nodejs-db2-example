
//Example Function to lookup a record
exports.lookupRecords = function (ibmdb, connString) {
  return function (req, res) {

    //       res.render('lookup');
    console.log(req.body);
    //Open Db2 Connection
    ibmdb.open(connString, function (err, conn) {
      if (err) {
        res.send("error occurred " + err.message);
      }
      else {
        //Prepare the SQL Statement
        var sql = "SELECT * FROM DASH14958.NODE_TEST WHERE LAST_NAME = ? AND FIRST_NAME = ?";
        conn.query(sql, req.body["LAST_NAME"], req.body["FIRST_NAME"], function (err, tables, moreResultSets) {

          //Show the SQL Result
          if (!err) {
            res.render('tablelist', {
              "tablelist": tables,
              "tableName": "Your Query Results",
              "message": "Congratulations. Your connection to Db2 is successful."

            });


          } else {
            res.send("error occurred " + err.message);
          }

          //Close Db2 Connection
          conn.close(function () {
            console.log("Connection Closed");
          });
        });
      }
    });

  };
};

// Example Function to add a record to a table
exports.addContact = function (ibmdb, connString) {

  return function (req, res) {

    //console.log(req.body)
    //Open Db2 connection
    ibmdb.open(connString, function (err, conn) {
      if (err) {
        res.send("error occurred " + err.message);
      }
      else {
        // prepare the SQL statement
        conn.prepare("INSERT INTO DASH14958.CONTACT(FIRST_NAME,LAST_NAME,CONTACT_EMAIL) VALUES (?,?,?)", function (err, stmt) {

          if (err) {
            //could not prepare for some reason
            console.log(err);
            return conn.closeSync();
          }

          //Bind and Execute the statment asynchronously
          stmt.execute([req.body["first_name"], req.body["last_name"], req.body["email"]], function (err, result) {


            conn.query("SELECT IDENTITY_VAL_LOCAL() AS CONTACT_KEY FROM SYSIBM.SYSDUMMY1", function (err, result) {
              var contactKey = result[0].CONTACT_KEY
              console.log(contactKey)
              if (err) {
              //        //could not prepare for some reason
                      console.log(err);
             };
               conn.close(function () {
               console.log("Connection Closed");
             });
  //           addPhoneInfo(contactKey,req.body["phone"],req.body["extension"]);
  //           addAddressInfo(contactKey,req.body["address1"],req.body["address2"],req.body["city"],req.body["state"],req.body["zip"]);
            });
//            Close the Db2 connection



         });
});


            };
});
};
function addPhoneInfo(contact,phone,extension) {
  console.log(contact,phone,extension)
  ibmdb.open(connString, function (err, conn) {
    if (err) {
      console.log("error occurred " + err.message);
    }
    else {
      // prepare the SQL statement
     var phoneInsert = "INSERT INTO DASH14958.PHONE(PHONE_KEY,CONTACT_KEY,PHONE_NUMBER,PHONE_NUMBER_EXTENSION,PHONE_TYPE_KEY) VALUES (?,?,?,?,?)"
      conn.prepare(phoneInsert, function (err, stmt) {

        if (err) {
          //could not prepare for some reason
          console.log(err);
          return conn.closeSync();
        }
        stmt.execute([8,contact,phone,extension,1], function (err, result) {

        conn.close(function () {
          console.log("Connection Closed");

});
});

});
};
});


};
function addAddressInfo(contact,ad1,ad2,city,state,zip) {
console.log(contact,ad1,ad2)
  ibmdb.open(connString, function (err, conn) {
    if (err) {
      console.log("error occurred " + err.message);
    }
    else {
      // prepare the SQL statement
     var phoneInsert = "INSERT INTO DASH14958.CONTACT_ADDRESS(CONTACT_ADDRESS_KEY,CONTACT_KEY,CONTACT_ADDRESS1,CONTACT_ADDRESS2,CONTACT_CITY,CONTACT_STATE,CONTACT_ZIP) VALUES (?,?,?,?,?,?,?)"
      conn.prepare(phoneInsert, function (err, stmt) {

        if (err) {
          //could not prepare for some reason
          console.log(err);
          return conn.closeSync();
        }
        stmt.execute([2,contact,ad1,ad2,city,state,zip], function (err, result) {

        conn.close(function () {
          console.log("Connection Closed");

});
});

});
};
});
};








};
