const postgresdb = require('./database/postgres/model');
const postgres = require('./database/postgres');
const elasticdb = require('./database/elastic-search');
const elastic = require('./database/elastic-search/model');
const sequelize = require('sequelize');
const util = require('./lib/utility');
const fs = require('fs');
const write = fs.createWriteStream('./data.json');
const writeEdges = fs.createWriteStream('./dataEdges.json');

// const controller = {
  // get: (req, res) => {
  function doAll (callback) {
    const bulk = [];
    const bulkEdges = [];
    const format = 'utf8';
    postgres.query("SELECT start_id, type, end_id FROM bahamas_edges UNION " + 
      "SELECT start_id, type, end_id FROM offshore_edges UNION " + 
      "SELECT start_id, type, end_id FROM paradise_edges UNION " + 
      "SELECT start_id, type, end_id FROM panama_edges", {
      type: sequelize.QueryTypes.SELECT
    })
    .then(edges => {
      postgres.query("SELECT node_id, name, countries, country_codes FROM bahamas_officer UNION " + 
        "SELECT node_id, name, countries, country_codes FROM offshore_officer UNION " + 
        "SELECT node_id, name, countries, country_codes FROM paradise_officer UNION " + 
        "SELECT node_id, name, countries, country_codes FROM panama_officer", {
        type: sequelize.QueryTypes.SELECT
      })
      .then(officers => {
        postgres.query("SELECT node_id, name, countries, country_codes FROM bahamas_intermediary UNION " + 
          "SELECT node_id, name, countries, country_codes FROM offshore_intermediary UNION " + 
          "SELECT node_id, name, countries, country_codes FROM paradise_intermediary UNION " + 
          "SELECT node_id, name, countries, country_codes FROM panama_intermediary", {
          type: sequelize.QueryTypes.SELECT
        })
        .then(intermediary => {
          postgres.query("SELECT node_id, name, countries, country_codes FROM bahamas_entity UNION " + 
            "SELECT node_id, name, countries, country_codes FROM offshore_entity UNION " + 
            "SELECT node_id, name, countries, country_codes FROM paradise_entity UNION " + 
            "SELECT node_id, name, countries, country_codes FROM panama_entity", {
            type: sequelize.QueryTypes.SELECT
          })
          .then(entity => {
            postgres.query("SELECT node_id, name, countries, country_codes FROM bahamas_address UNION " + 
              "SELECT node_id, name, countries, country_codes FROM offshore_address UNION " + 
              "SELECT node_id, name, countries, country_codes FROM paradise_address UNION " + 
              "SELECT node_id, name, countries, country_codes FROM panama_address", {
              type: sequelize.QueryTypes.SELECT
            })
            .then(address => {
              postgres.query("SELECT node_id, name, countries, country_codes FROM paradise_other", {
                type: sequelize.QueryTypes.SELECT
              })
              .then(other => {
                console.log('DONE IMPORTING DATABASE INFO!\nFiles added:', other.length + address.length + entity.length + intermediary.length + officers.length + edges.length);

                // util.createJsonEdges(writeEdges, format, edges, () => {
                //   console.log('file done: edges');
                //   console.log('Edges: ', edges.length);
                // });

                // util.createJson(write, format, officers, "officers", () => { 
                //   console.log('file done: officers');
                //   util.createJson(write, format, intermediary, "intermediary", () => {
                //     console.log('file done: intermediary');
                //     util.createJson(write, format, entity, "entity", () => {
                //       console.log('file done: entity');
                //       util.createJson(write, format, address, "address", () => {
                //         console.log('file done: address');
                //         util.createJson(write, format, other, "other", () => {
                //           console.log('file done: other');
                //           callback(bulk);
                //         });
                //       });
                //     });
                //   });
                // });

                util.createJsonEdges(bulkEdges, edges, () => {
                  console.log('object done: edges');
                });

                util.createBulk(bulk, officers, "officers", () => {
                  console.log('object done: officers');
                  util.createBulk(bulk, intermediary, "intermediary", () => {
                    console.log('object done: intermediary');
                    util.createBulk(bulk, entity, "entity", () => {
                      console.log('object done: entity');
                      util.createBulk(bulk, address, "address", () => {
                        console.log('object done: address');
                        util.createBulk(bulk, other, "other", () => {
                          console.log('object done: other');
                        });
                      });
                    });
                  });
                });
                


              })
              .catch(errorOther => console.log('error other:', errorOther));
            })
            .catch(errorAddress => console.log('error address:', errorAddress));
          })
          .catch(errorEntity => console.log('error entity:', errorEntity));
        })
        .catch(errorIntermediary => console.log('error intermediary:', errorIntermediary));
      })
      .catch(errorOfficers => console.log('error officers:', errorOfficers));
    })
    .catch(errorEdges => console.log('error edges:', errorEdges));
}


function testElastic(bulk) {
  elastic.indexExists()
  .then(exists => {
    if(exists) {
      console.log('Index exist!');
    } else {
      console.log('Creating index!');
      elastic.createIndex()
      .then(something => {
        console.log({something});
      });
    }
  })
}

doAll(testElastic);
  // }
// }

// module.exports = controller;