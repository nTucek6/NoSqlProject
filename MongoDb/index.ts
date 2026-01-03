import fs from "fs";
import path from "path";

import { connectDb, closeConnection } from "./connection.js";

import {
  showCollections,
  createCollection,
  findOneInCollection,
  findInCollection,
  insertOneToCollection,
  insertManyToCollection,
  deleteOneFromCollection,
  deleteManyFromCollection,
  dropCollection,
  updateOneFromCollection,
  updateManyFromCollection,
  removeFieldsFromCollection,
  getCollectionColumnNames,
  countDocuments,
  aggregateCollection,
} from "./utils/utils.js";

import { collection, CHECKING_ACCOUNT_STATUS } from "./enum/enums.js";

import { CreditRiskClass, StatisticsNumerical } from "./class/classes.js";
//import { input } from "./utils/readKeyboard-util.js";

import readlineSync from "readline-sync";

const NUMERIC_FIELD = [
  "durationMonths",
  "creditAmount",
  "installmentRatePercent",
  "residenceSince",
  "ageYears",
  "existingCreditsThisBank",
  "dependentsCount",
];

const CATEGORIC_FIELD = [
  "checkingAccountStatus",
  "creditHistory",
  "purpose",
  "savingsAccount",
  "employmentSince",
  "personalStatusSex",
  "otherDebtors",
  "property",
  "otherInstallments",
  "housing",
  "job",
  "telephone",
  "foreignWorker",
];

async function main() {
  try {
    await console.clear();
    console.log("Connecting to DB...");
    await connectDb();

    let continueProgram = true;

    let input: number | undefined = readlineSync.questionInt(
      "Odaberite zadatak: "
    );

    if (input != undefined) {
      const number = parseInt(input);
      switch (number) {
        case 1:
          await zadatak1();
          break;
        case 2:
          const data = await zadatak2();
          console.log(data);
          break;
        case 3:
          await zadatak3();
          break;
        case 4:
          await zadatak4();
          break;
      }
    }

    await closeConnection();
  } catch (error) {
    console.error("Error:", error);
    closeConnection();
  }
}

async function importToDatabase() {
  // Učitavanje u bazu, prvi korak prije rješavanja zadataka
  const path = "./data/german.data";
  const records = readFromFileAndParse(path);
  console.log(records[1]);
  await insertManyToCollection(collection.GERMAN_CREDIT_DATA, records);
}

async function zadatak1() {
  for (const field of NUMERIC_FIELD) {
    const query = {
      $or: [
        { [field]: null },
        { [field]: { $exists: false } },
        { [field]: "" },
        { [field]: "?" },
      ],
    };
    const update = { [field]: -1 };
    await updateManyFromCollection(
      collection.GERMAN_CREDIT_DATA,
      query,
      update
    );
  }

  let updated = 0;
  for (const field of CATEGORIC_FIELD) {
    const query = { $or: [{ [field]: null }, { [field]: { $exists: false } }] };
    const update = { [field]: "empty" };
    const result = await updateManyFromCollection(
      collection.GERMAN_CREDIT_DATA,
      query,
      update
    );
    updated += result.modifiedCount;
  }
  console.log(updated);
}

async function zadatak2() {
  /*Postavljanje upita, prvo izbacujemo sve prazne vrijednosti pa preko mongoDb metoda računamo 
  Srednju vrijednost, Standardnu devijaciju i broj ispravnih podataka
  */
  await dropCollection(collection.STATISTICS_GERMAN_CREDIT_DATA);

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
    let data = await aggregateCollection(collection.GERMAN_CREDIT_DATA, query);
    data[0].Varijabla = field;
    result.push(...data);
  }

  if (result.length > 0) {
    await insertManyToCollection(
      collection.STATISTICS_GERMAN_CREDIT_DATA,
      result
    );
  }
  const done = await findInCollection(collection.STATISTICS_GERMAN_CREDIT_DATA);
  return done;
}

async function zadatak3() {
  /*
  Prolazak kroz sve kategoričke stupce, spremanje svakog stupca u objekt formata "nazivStupca": ['vrijednost1'...]
  Nakon toga se kreira novi dokument u koji će se spremini frekvencija pojavljivanjai varijabli
  */

  const uniqueCategories = [];
  const query = [
    { $match: { field: { $ne: "empty" } } },
    {
      $group: {
        _id: null,
        ...Object.fromEntries(
          CATEGORIC_FIELD.map((field) => [[field], { $addToSet: `$${field}` }])
        ),
      },
    },
  ];
  const result = await aggregateCollection(
    collection.GERMAN_CREDIT_DATA,
    query
  );

  await dropCollection(collection.FREQUENCY_GERMAN_CREDIT_DATA);
  await createCollection(collection.FREQUENCY_GERMAN_CREDIT_DATA);

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

        await updateOneFromCollection(
          collection.FREQUENCY_GERMAN_CREDIT_DATA,
          query,
          init,
          options
        );

        for (const v of value) {
          const result = await countDocuments(collection.GERMAN_CREDIT_DATA, {
            [key]: v,
          });
          //console.log(result);

          const update = {
            $inc: { [`${key}.${v}`]: result },
          };

          await updateOneFromCollection(
            collection.FREQUENCY_GERMAN_CREDIT_DATA,
            query,
            update,
            options
          );
        }
      }
    }
  }

  const doc = await findInCollection(collection.FREQUENCY_GERMAN_CREDIT_DATA, {
    _id: "frekvencija",
  });
  console.log(doc);
}

async function zadatak4() {
  const statistics = await findInCollection(
    collection.STATISTICS_GERMAN_CREDIT_DATA
  );

  await dropCollection(collection.STATISTICS1_GERMAN_CREDIT_DATA);
  await dropCollection(collection.STATISTICS2_GERMAN_CREDIT_DATA);

  let query = {
    ...Object.fromEntries(
      statistics.map((s: any) => [
        [s.Varijabla],
        { $lte: s["Srednja vrijednost"] },
      ])
    ),
  };
  const statistics1 = await findInCollection(
    collection.GERMAN_CREDIT_DATA,
    query
  );

  query = {
    ...Object.fromEntries(
      statistics.map((s: any) => [
        [s.Varijabla],
        { $gt: s["Srednja vrijednost"] },
      ])
    ),
  };
  const statistics2 = await findInCollection(
    collection.GERMAN_CREDIT_DATA,
    query
  );

  const result1 = await insertManyToCollection(
    collection.STATISTICS1_GERMAN_CREDIT_DATA,
    statistics1
  );
  const result2 = await insertManyToCollection(
    collection.STATISTICS2_GERMAN_CREDIT_DATA,
    statistics2
  );

  console.log(statistics);
  console.log(await findInCollection(collection.STATISTICS1_GERMAN_CREDIT_DATA));
}



function readFromFileAndParse(filename: string) {
  const filePath = path.join(process.cwd(), filename);
  const content = fs.readFileSync(filePath, "utf8");
  return content
    .split(/\r?\n/)
    .filter((line) => line.trim())
    .map((line) => {
      const fields = line.trim().split(/\s+/);
      if (fields.length !== 21) return null;
      return new CreditRiskClass(fields);
    })
    .filter(Boolean);
}

function parseToObject(object: any): CreditRiskClass {
  let data: any = new CreditRiskClass();
  for (const [key, value] of Object.entries(object)) {
    data[key] = value;
  }
  return data;
}

function parseJSONToArray(data: []): CreditRiskClass[] {
  const array = data.map((item) => parseToObject(item));
  return array;
}

main().catch(console.error);
