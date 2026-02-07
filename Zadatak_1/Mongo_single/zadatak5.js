use("projekt_1");
load("fields.js");

/* Dohvaćanje orginalnih podataka i spremanje u novi dokument
  Nakon toga dohvaćamo frekvencije pojavljivanja za svaku kategoričku varijablu
  Onda prolazimo kroz objekt frekvencija i uzimamo ključ i dodajemo mu sufix _freq u koje onda spremamo objekt koji sadrži
  kategoričke vrijednosti u obliku ključ: vrijednost (primjer: creditHistory_freq: {A11: 20,A12:66,...})
  Nakon toga svim objektima polja dodajemo nove vrijednosti na svaki objekt
  */

db.emb_german_credit_data.drop();

const main_data = db.german_credit_data.find().toArray();

db.emb_german_credit_data.insertMany(main_data);

let freq = db.frekvencija_german_credit_data.find().toArray();
freq = freq[0];

const update = {};

Object.keys(freq).forEach((key) => {
  if (key != "_id") {
    update[key + "_freq"] = freq[key];
  }
});

db.emb_german_credit_data.updateMany({}, { $set: { ...update } });

print(db.emb_german_credit_data.findOne());
