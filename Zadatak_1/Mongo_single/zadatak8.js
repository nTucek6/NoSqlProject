use("projekt_1");
load("fields.js");

const table = db.german_credit_data;

const indexName = "custom_index";

const indexes = table.getIndexes();
print(indexes)
const indexExists = indexes.some((index) => index.name === indexName);

if (indexExists) {
  table.dropIndex(indexName);
}

table.createIndex(
  { ageYears: 1, creditAmount: -1, checkingAccountStatus: 1 },
  { name: indexName },
);

const result = table
  .find({
    ageYears: { $gte: 30 }, // Range (prefix)
    checkingAccountStatus: "A11", // Equality (suffix)
  })
  .sort({ creditAmount: -1 })
  .toArray();

print(result);
print("Entries: ", result.length);
