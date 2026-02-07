use("projekt_1");
load("fields.js");

/*
Skripta za svaki dokument analizira polja s sufiksom _stat: računa koeficijent varijacije (std.dev/srednja vrijednost × 100) 
i ako je > 10%, dodaje novo polje "standard_deviation_>_average_in_%". 
Modificirani dokumenti ažuriraju se pomoću updateOne() s $set operatorom.
*/

let emb2 = db.emb2_german_credit_data.find().toArray();

for (const e of emb2) {
  Object.keys(e).forEach((key) => {
    if (key.endsWith("_stat")) {
      var average = e[key]["Srednja vrijednost"];
      var standard_deviation = e[key]["Standardna devijacija"];

      var result = Math.round((standard_deviation / average) * 100);
      if (result > 10) {
        e[key]["standard_deviation_>_average_in_%"] = result;
      }
    }
  });
  db.emb2_german_credit_data.updateOne(
    {
      _id: e["_id"],
    },
    {
      $set: e,
    },
    {
      upsert: true,
    },
  );
}

print(db.emb2_german_credit_data.find().toArray());
