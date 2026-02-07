import { connectDb } from "../connection.js";

async function showCollections() {
  const db = await connectDb();
  const collections = await db.listCollections().toArray();
  console.log("Collections in vjezba1:");
  collections.forEach((col) => console.log("Collection: " + col.name));
}

async function createCollection(collectionName) {
  const db = await connectDb();
  await db.createCollection(collectionName);
}

async function getCollection(collectionName) {
  const db = await connectDb();
  return await db.collection(collectionName);
}

async function createIndex(collectionName, index, indexName) {
  const db = await connectDb();
  await db.collection(collectionName).createIndex(index, { name: indexName });
}

async function dropIndex(collectionName, indexName) {
  const db = await connectDb();
  await db.collection(collectionName).dropIndex({ name: indexName });
}

async function dropCollection(collectionName) {
  const db = await connectDb();
  await db.dropCollection(collectionName);
}

async function findOneInCollection(collectionName, query = {}) {
  const db = await connectDb();
  const collection = db.collection(collectionName);
  const data = await collection.findOne(query);
  return data;
}

async function findInCollection(collectionName, query = {}) {
  const db = await connectDb();
  const collection = db.collection(collectionName);
  const data = await collection.find(query).toArray();
  return data;
}

async function insertOneToCollection(collectionName, data) {
  //create collection if it does'nt exist and add data, data is object {attribte: 'value', ...}
  const db = await connectDb();
  const exist = await db.listCollections({ name: collectionName }).hasNext();
  if (!exist) {
    await createCollection(collectionName);
  }
  return await db.collection(collectionName).insertOne(data);
}

async function insertManyToCollection(collectionName, data = []) {
  //create collection if it does'nt exist and add data, data is object {attribte: 'value', ...}
  const db = await connectDb();
  const exist = await db.listCollections({ name: collectionName }).hasNext();
  if (!exist) {
    await createCollection(collectionName);
  }
  return await db.collection(collectionName).insertMany(data);
}

async function updateOneFromCollection(
  collectionName,
  query,
  updatedValue,
  options,
) {
  //create collection if it does'nt exist and add data, data is object {attribte: 'value', ...}
  const db = await connectDb();
  return await db
    .collection(collectionName)
    .updateOne(query, updatedValue, options);
}

async function updateManyFromCollection(collectionName, query, updatedValue) {
  //create collection if it does'nt exist and add data, data is object {attribte: 'value', ...}
  const db = await connectDb();
  return await db
    .collection(collectionName)
    .updateMany(query, { $set: { ...updatedValue } });
}

async function removeFieldsFromCollection(collectionName, fields, query = {}) {
  const db = await connectDb();

  const unsetObj = {};
  if (Array.isArray(fields)) {
    fields.forEach((field) => {
      unsetObj[field] = "";
    });
  } else {
    unsetObj = fields;
  }

  await db.collection(collectionName).updateMany(query, { $unset: unsetObj });
}

async function deleteOneFromCollection(collectionName, query) {
  // query is object in example: {email: 'email' }
  const db = await connectDb();
  const result = await db.collection(collectionName).deleteOne(query);
  console.log(`Deleted ${result.deletedCount} document(s)`);
}

async function deleteManyFromCollection(collectionName, filter = {}) {
  // if filter is empty delete all!
  const db = await connectDb();
  const result = await db.collection(collectionName).deleteMany(filter);
  console.log(`Deleted ${result.deletedCount} document(s)`);
}

async function getCollectionColumnNames(collectionName) {
  const db = await connectDb();
  const result = Object.keys(await db.collection(collectionName).findOne());
  return result;
}

async function countDocuments(collectionName, query) {
  const db = await connectDb();
  return db.collection(collectionName).countDocuments(query);
}

async function aggregateCollection(collectionName, query) {
  const db = await connectDb();
  const result = db.collection(collectionName).aggregate(query).toArray();
  return result;
}

async function getDocumentsName() {
  const db = await connectDb();
  return db.listCollections().toArray();
}

export {
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
  createIndex,
  dropIndex,
  getCollection,
  getDocumentsName,
};
