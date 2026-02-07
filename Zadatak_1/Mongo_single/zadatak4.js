use("projekt_1");
load("fields.js");

/* Prvo učitavamo in dokumenta statistike podatke koji prikazuju srednju vrijednost
    Prvo se kreira upit gdje se pomoću operatora $lte traže sva polja gdje su sve numeričke
    vrijednosti manje ili jednake od srednje vrijednosti 
    Isti proces se ponavlja i za drugi upit gdje se traže sva polja gdje su sve vrijednosti veće od
    srednje vrijednosti
    Na kraju se se rezultati spremaju u dva nova dokumenta statiskia1 i statistika2
  */

const statistics = db.statistika_german_credit_data.find().toArray()

db.statistika1_german_credit_data.drop();
db.statistika2_german_credit_data.drop();

let query = {
  ...Object.fromEntries(
    statistics.map((s) => [[s.Varijabla], { $lte: s["Srednja vrijednost"] }]),
  ),
};

const statistics1 = db.german_credit_data.find(query).toArray()

query = {
  ...Object.fromEntries(
    statistics.map((s) => [[s.Varijabla], { $gt: s["Srednja vrijednost"] }]),
  ),
};

const statistics2 = db.german_credit_data.find(query).toArray()


db.statistika1_german_credit_data.insertMany(statistics1)
db.statistika2_german_credit_data.insertMany(statistics2)


print(statistics)
print(db.statistika1_german_credit_data.find().toArray())
