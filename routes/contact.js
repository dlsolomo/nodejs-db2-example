// exports.lookupRecords = function (ibmdb, connString) {
//   return function (req, res) {
//
//     //       res.render('lookup');
//     console.log(req.body);
//     //Open Db2 Connection
//     ibmdb.open(connString, function (err, conn) {
//       if (err) {
//         res.send("error occurred " + err.message);
//       }
//       else {
//         //Prepare the SQL Statement
//         var sql = "SELECT * FROM DASH14958.NODE_TEST WHERE LAST_NAME = ? AND FIRST_NAME = ?";
//         conn.query(sql, req.body["LAST_NAME"], req.body["FIRST_NAME"], function (err, tables, moreResultSets) {
//
//           //Show the SQL Result
//           if (!err) {
//             res.render('tablelist', {
//               "tablelist": tables,
//               "tableName": "Your Query Results",
//               "message": "Congratulations. Your connection to Db2 is successful."
//
//             });
//
//
//           } else {
//             res.send("error occurred " + err.message);
//           }
//
//           //Close Db2 Connection
//           conn.close(function () {
//             console.log("Connection Closed");
//           });
//         });
//       }
//     });
//
//   };
// };

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
//      Get Affiliation and Contact Type Keys

//        contactType(req.body["type"], function(type_key));
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




             conn.close(function () {
             console.log("Connection Closed");
             });

             addPhoneInfo(contactKey,req.body["phone"],req.body["extension"],req.body["phone_type"]);
             addAddressInfo(contactKey,req.body["address1"],req.body["address2"],req.body["city"],req.body["state"],req.body["zip"]);
             updateAffiliationInfo(contactKey,req.body["affiliation"]);
             updateCompanyInfo(contactKey,req.body["company"]);
             updateContactTypeInfo(contactKey,req.body["type"]);


    });
  });
});
};
});


function updateAffiliationInfo(contact,affiliation) {
  console.log(contact,affiliation);
// Open Db2 Connection
  ibmdb.open(connString, function (err, conn) {
    if (err) {
    res.send("error occurred " + err.message);
  }
    else {
//   Find the Affiliation
      var sql = "SELECT CONTACT_AFFILIATION_KEY FROM DASH14958.CONTACT_AFFILIATION WHERE CONTACT_AFFILIATION_NAME=?";
      conn.query (sql,[affiliation], function (err, result) {
        console.log(result);
//   If Affiniation does not exist, create a new entry
        if (!result[0]) {
          var insertAffSql = "INSERT INTO DASH14958.CONTACT_AFFILIATION (CONTACT_AFFILIATION_NAME) VALUES(?)";
          conn.query (insertAffSql,[affiliation], function (err, result) {
            if (err) {
              //could not prepare for some reason
              console.log(err);
            }
          });
        };
//   Update Contact with Affiliation Key
      var sql = "UPDATE DASH14958.CONTACT SET (CONTACT_AFFILIATION_KEY)=(SELECT CONTACT_AFFILIATION_KEY FROM DASH14958.CONTACT_AFFILIATION WHERE CONTACT_AFFILIATION_NAME=?) WHERE CONTACT_KEY=?";
      conn.query (sql,[affiliation,contact], function (err, result) {
        if (err) {
    //could not prepare for some reason
        console.log(err);
        return conn.closeSync();
        }

    //Close the Db2 connection
    conn.close(function () {
      console.log("Connection Closed");
});
});
});
};
});
};
function updateCompanyInfo(contact,company) {
  console.log(contact,company);
// Open Db2 Connection
  ibmdb.open(connString, function (err, conn) {
    if (err) {
    res.send("error occurred " + err.message);
  }
    else {
//   Find the Company
      var sql = "SELECT COMPANY_KEY FROM DASH14958.COMPANY WHERE COMPANY_NAME=?";
      conn.query (sql,[company], function (err, result) {
        console.log(result);
//   If Company does not exist, create a new entry
        if (!result[0]) {
          var insertAffSql = "INSERT INTO DASH14958.COMPANY (COMPANY_NAME) VALUES(?)";
          conn.query (insertAffSql,[company], function (err, result) {
            if (err) {
              //could not prepare for some reason
              console.log(err);
            }
          });
        };
//   Update Contact with Company Key
      var sql = "UPDATE DASH14958.CONTACT SET (COMPANY_KEY)=(SELECT COMPANY_KEY FROM DASH14958.COMPANY WHERE COMPANY_NAME=?) WHERE CONTACT_KEY=?";
      conn.query (sql,[company,contact], function (err, result) {
        if (err) {
    //could not prepare for some reason
        console.log(err);
        return conn.closeSync();
        }

    //Close the Db2 connection
    conn.close(function () {
      console.log("Connection Closed");
});
});
});
};
});
};

function updateContactTypeInfo(contact,type) {
  console.log(contact,type);
// Open Db2 Connection
  ibmdb.open(connString, function (err, conn) {
    if (err) {
    res.send("error occurred " + err.message);
  }
    else {
//   Find the Contact Type
      var sql = "SELECT CONTACT_TYPE_KEY FROM DASH14958.CONTACT_TYPE WHERE CONTACT_TYPE_NAME=?";
      conn.query (sql,[type], function (err, result) {
        console.log(result);
//   If Contact Type does not exist, create a new entry
        if (!result[0]) {
          var insertAffSql = "INSERT INTO DASH14958.CONTACT_TYPE (CONTACT_TYPE_NAME) VALUES(?)";
          conn.query (insertAffSql,[type], function (err, result) {
            if (err) {
              //could not prepare for some reason
              console.log(err);
            }
          });
        };
//   Update Contact with Contact Type Key
      var sql = "UPDATE DASH14958.CONTACT SET (CONTACT_TYPE_KEY)=(SELECT CONTACT_TYPE_KEY FROM DASH14958.CONTACT_TYPE WHERE CONTACT_TYPE_NAME=?) WHERE CONTACT_KEY=?";
      conn.query (sql,[type,contact], function (err, result) {
        if (err) {
    //could not prepare for some reason
        console.log(err);
        return conn.closeSync();
        }

    //Close the Db2 connection
    conn.close(function () {
      console.log("Connection Closed");
});
});
});
};
});
};



function addPhoneInfo(contact,phone,extension,type) {
  console.log(contact,phone,extension)
  ibmdb.open(connString, function (err, conn) {
    if (err) {
      console.log("error occurred " + err.message);
    }
    else {
      // get Phone Type Key
     var phoneTypeSQL = "SELECT PHONE_TYPE_KEY FROM DASH14958.PHONE_TYPE WHERE PHONE_TYPE_NAME=?";
     conn.query(phoneTypeSQL,[type], function (err, result) {
       var phoneTypeKey = result[0].PHONE_TYPE_KEY;
       // Create new Phone Record
        var phoneInsert = "INSERT INTO DASH14958.PHONE(CONTACT_KEY,PHONE_NUMBER,PHONE_NUMBER_EXTENSION,PHONE_TYPE_KEY) VALUES (?,?,?,?)"
        conn.query(phoneInsert,[contact,phone,extension,phoneTypeKey], function (err, stmt) {

          if (err) {
            //could not prepare for some reason
            console.log(err);
            return conn.closeSync();
          }

        conn.close(function () {
          console.log("Connection Closed");
});
});
});
};
});
};



function addAddressInfo(contact,ad1,ad2,city,state,zip) {
  console.log(contact,ad1,ad2);
  ibmdb.open(connString, function (err, conn) {
    if (err) {
      console.log("error occurred " + err.message);
    }
    else {
      // prepare the SQL statement
     var phoneInsert = "INSERT INTO DASH14958.CONTACT_ADDRESS(CONTACT_KEY,CONTACT_ADDRESS1,CONTACT_ADDRESS2,CONTACT_CITY,CONTACT_STATE,CONTACT_ZIP) VALUES (?,?,?,?,?,?)"
      conn.query(phoneInsert, [contact ,ad1, ad2, city, state, zip], function (err, stmt) {

        if (err) {
          //could not prepare for some reason
          console.log(err);
          return conn.closeSync();
        }

        conn.close(function () {
          console.log("Connection Closed");

});
});
};
});
};
};
};
