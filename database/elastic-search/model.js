const connection = require('./');
// const elasticsearch = require('elasticsearch');

const indexName = 'panama_papers';

function deleteIndex() {
  return connection.indices.delete({
    index: indexName
  });
}

function createIndex() {
  return connection.indices.create({
    index: indexName
  });
}

function indexExists() {
  return connection.indices.exists({
    index: indexName
  });
}

module.exports = {
  deleteIndex,
  createIndex,
  indexExists
}