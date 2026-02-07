//mongosh

use ("projekt_1")

load("fields.js")

/* Prolazimo kroz sva polja koja su numerička i tražimo ako je koja vrijednost prazna, ako da ta vrijednost se postavlja na -1
Isto tako i za sva kategorička polja, prolazimo kroz listu tih polja i tražimo prazne vrijednosti i dajemo im vrijednost empty. 
*/
for (var i = 0; i < NUMERIC_FIELD.length; i++) {
  var field = NUMERIC_FIELD[i];
  var query = {
    $or: [
      {[field]: null},
      {[field]: {$exists: false}},
      {[field]: ""},
      {[field]: "?"}
    ]
  };
  var update = {$set: {[field]: -1}};
  
  var result = db.german_credit_data.updateMany(query, update);
  print("Updated numeric field " + field + ": " + result.modifiedCount + " documents");
}

// Handle categoric fields
var totalUpdated = 0;
for (var i = 0; i < CATEGORIC_FIELD.length; i++) {
  var field = CATEGORIC_FIELD[i];
  var query = {$or: [{[field]: null}, {[field]: {$exists: false}}]};
  var update = {$set: {[field]: "empty"}};
  
  var result = db.german_credit_data.updateMany(query, update);
  totalUpdated += result.modifiedCount;
  print("Updated categoric field " + field + ": " + result.modifiedCount + " documents");
}

print("Total categoric updates: " + totalUpdated);