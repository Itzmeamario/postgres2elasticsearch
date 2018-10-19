const connection = require('./');
// const elasticsearch = require('elasticsearch');

const indexName = 'panama_papers';

function deleteIndex() {
  console.log('Deleting index!');
  return connection.indices.delete({
    index: indexName
  });
}

function createIndex() {
  console.log('Creating index!');
  return connection.indices.create({
    index: indexName
  });
}

function indexExists() {
  return connection.indices.exists({
    index: indexName
  });
}

function uploadBulk(data) {
  console.log('Uploading bulk');
  return connection.bulk({body:data});
}

module.exports = {
  deleteIndex,
  createIndex,
  indexExists,
  uploadBulk
}