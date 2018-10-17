const elasticsearch = require('elasticsearch');

const connection = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

connection.ping({ requestTimeout: 30000 }, error => {
  if (error) {
    console.error('Elasticsearch cluster is down!');
  } else {
    console.log('Connection to elasticsearch db has been established successfully!');
  }
});

module.exports = connection;