use("projekt_1");
load("fields.js");

/* Na isti princip kao i zadatak 6, dohvaćamo glavne podatke koje onda kopiramo u novi dokument
  Na objekte u novom dokumentu onda dodajemo statistiku za srednju vrijednost i standardnu devijaciju
  To radimo tako da prođemo kroz podatke iz dokumenta statistike i spremamo objekt u obliku 
    ageYears_stat: {
    'Srednja vrijednost': 35.546,
    'Standardna devijacija': 11.375468574317512,
    'Broj nomissing elemenata': 1000
  },
  Ovaj format se onda sprema na sve objekte polja
  Spremanje se vrši nad cijelim dokumentom preko updateMany()
  */

db.emb2_german_credit_data.drop();

const main_data = db.german_credit_data.find().toArray();

db.emb2_german_credit_data.insertMany(main_data);

const statistics = db.statistika_german_credit_data.find().toArray();

const update = {};

for (const stat of statistics) {
  update[stat["Varijabla"] + "_stat"] = Object.fromEntries(
    Object.entries(stat)
      .filter(([key]) => key !== "_id" && key !== "Varijabla")
      .map(([key, value]) => [key, value]),
  );
}

db.emb2_german_credit_data.updateMany({}, { $set: { ...update } });

print(db.emb2_german_credit_data.findOne());
