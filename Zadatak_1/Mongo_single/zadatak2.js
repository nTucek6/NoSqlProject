use("projekt_1");

load("fields.js");

/*Postavljanje upita, prvo izbacujemo sve prazne vrijednosti pa preko mongoDb metoda računamo 
  Srednju vrijednost, Standardnu devijaciju i broj ispravnih podataka
  */

db.statistika_german_credit_data.drop();

const result = [];
for (const field of NUMERIC_FIELD) {
  const query = [
    {
      $match: { field: { $ne: -1 } },
    },
    {
      $group: {
        _id: null,
        "Srednja vrijednost": { $avg: `$${[field]}` },
        "Standardna devijacija": { $stdDevSamp: `$${[field]}` },
        "Broj nomissing elemenata": {
          $sum: { $cond: [{ $ne: [`$${[field]}`, -1] }, 1, 0] },
        },
      },
    },
  ];
  var data = db.german_credit_data.aggregate(query).toArray();
  if (data.length > 0) {
    data[0].Varijabla = field;
    result.push(...data);
  }
}

if (result.length > 0) {
  db.statistika_german_credit_data.insertMany(result);
}
print(db.statistika_german_credit_data.find().toArray());
