const { connectDb, closeConnection } = require("./connection");

const {
  showCollections,
  createCollection,
  findInCollection,
  insertOneToCollection,
  insertManyToCollection,
  deleteOneFromCollection,
  deleteManyFromCollection,
  dropCollection,
  updateOneFromCollection,
  removeFieldsFromCollection,
} = require("./utils/utils");

const { collection } = require("./enum/collectionsEnum");

async function main() {
  try {
    console.clear();
    console.log("Connecting to DB...");
    await connectDb();

    await showCollections();
    //await dropCollection('gay');
    //await showCollections();

    //await deleteManyFromCollection("gay", { score: 10 });

    let blogData = await findInCollection(collection.BLOG);
    console.log(blogData);

    const insert = {
      title: "My Blog Post update 123",
      content: "Here's my blog post. hehe",
      date: new Date("2026-11-04T18:00:36.049Z"),
      comments: [
        "Hello darkness my old friend",
        "Ja sam beta i ne trebam pomoc",
      ],
      score: 10,
    };

    console.log("Waiting...");
    await new Promise((resolve) => setTimeout(resolve, 3000));

    //await removeFieldsFromCollection(collection.BLOG, ['updatedValue'])

    //await insertOneToCollection(collection.BLOG, insert);
    await updateOneFromCollection(
      collection.BLOG,
      { score: 60 },
      { date: new Date("2026-11-04T18:00:36.049Z"), content: "Makno sam gay žabe" }
    );
    blogData = await findInCollection(collection.BLOG);
    console.log(blogData);

    //await showCollections();
    await closeConnection();
  } catch (error) {
    console.error("Error:", error);
    closeConnection();
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };
