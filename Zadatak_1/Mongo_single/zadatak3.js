use("projekt_1");
load("fields.js");

/*
  Prolazak kroz sve kategoričke stupce, spremanje svakog stupca u objekt formata "nazivStupca": ['vrijednost1'...]
  Nakon toga se kreira novi dokument u koji će se spremini frekvencija pojavljivanjai varijabli
  Nakon toga se prolazi kroz objekt koji sadrži atribute koje imaju listu kategoričkih vrijednosti
  Unutar for petlje se kreira unutar novog dokumenta za svaki atribut vrijednost s brojem pojavljanja,
  primjer: checkingAccountStatus: { A11: 0, A12: 0, A13: 0, A14: 0 },
  Nakon toga unutar još jedne for petlje prolaze se sve vrijednosti kategorije i broji se njihovo ponavljanje
  Onda se svako ponavljanje sprema u bazu za svaku kategoriju i njihovu vrijednost
  */
const query = [
  { $match: { field: { $ne: "empty" } } },
  {
    $group: {
      _id: null,
      ...Object.fromEntries(
        CATEGORIC_FIELD.map((field) => [[field], { $addToSet: `$${field}` }]),
      ),
    },
  },
];
//const result = await aggregateCollection(collection.GERMAN_CREDIT_DATA, query);
const result = db.german_credit_data.aggregate(query).toArray();

db.frekvencija_german_credit_data.drop();
db.createCollection("frekvencija_german_credit_data");

for (const [key, value] of Object.entries(result[0])) {
  if (key != "_id") {
    //const setValues= [];
    if (Array.isArray(value)) {
      const sorted = value.sort();
      const query = { _id: "frekvencija" };

      const init = {
        $set: {
          [key]: {
            ...Object.fromEntries(sorted.map((v) => [v, 0])),
          },
        },
      };
      const options = { upsert: true };

      db.frekvencija_german_credit_data.updateOne(query, init, options);

      for (const v of value) {
        const result = db.german_credit_data.countDocuments({ [key]: v });

        const update = {
          $inc: { [`${key}.${v}`]: result },
        };
        db.frekvencija_german_credit_data.updateOne(query, update, options);
      }
    }
  }
}

const doc = db.frekvencija_german_credit_data.find({
  _id: "frekvencija",
});
print(doc);
