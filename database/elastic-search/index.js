const elasticsearch = require('elasticsearch');

const connection = new elasticsearch.Client({
  host: 'localhost:9200',
  keepAlive: true,
  // log: 'trace'
});

connection.ping({ requestTimeout: 90000 }, error => {
  if (error) {
    console.error('Elasticsearch cluster is down!');
  } else {
    console.log('Connection to elasticsearch db has been established successfully!');
  }
});

module.exports = connection;