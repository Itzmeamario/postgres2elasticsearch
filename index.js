const postgresdb = require('./database/postgres/model');
const postgres = require('./database/postgres');
const elasticdb = require('./database/elastic-search');
const elastic = require('./database/elastic-search/model');
const sequelize = require('sequelize');
const util = require('./lib/utility');
const fs = require('fs');

// const controller = {
  // get: (req, res) => {
function doAll (testElastic, uploadToElastic) {
    const writeEntity = fs.createWriteStream('./dataEntity.json');
    const writeEntity1 = fs.createWriteStream('./dataEntity1.json');
    const writeOfficers = fs.createWriteStream('./dataOfficers.json');
    const writeOfficers1 = fs.createWriteStream('./dataOfficers1.json');
    const writeAddress = fs.createWriteStream('./dataAddress.json');
    const writeIntermediary = fs.createWriteStream('./dataIntermediary.json');
    const writeOther = fs.createWriteStream('./dataOther.json');
    const format = 'utf8';
    let bulk = [];
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
                console.log('DONE IMPORTING DATABASE INFO!\nFiles added:', other.length + address.length + entity.length + intermediary.length + officers.length);


                // util.createJson(writeOfficers, format, officers.slice(0, officers.length/2), "officers", () => { 
                //   console.log('file done: officers');
                // });
                // util.createJson(writeOfficers1, format, officers.slice(officers.length/2), "officers", () => { 
                //   console.log('file done: officers');
                // });
                // util.createJson(writeIntermediary, format, intermediary, "intermediary", () => {
                //   console.log('file done: intermediary');
                // });
                // util.createJson(writeEntity, format, entity.slice(0, entity.length/2), "entity", () => {
                //   console.log('file done: entity');
                // });
                // util.createJson(writeEntity1, format, entity.slice(entity.length/2), "entity", () => {
                //   console.log('file done: entity');
                // });
                // util.createJson(writeAddress, format, address, "address", () => {
                //   console.log('file done: address');
                // });
                // util.createJson(writeOther, format, other, "other", () => {
                //   console.log('file done: other');
                // });


                elastic.indexExists()
                .then(exists => {
                  if(exists) {
                    console.log('Index exist! Deleting it just for test');
                    elastic.deleteIndex()
                    .then(console.log('Deleted index'));
                  } else {
                    console.log('Index does not exist!');
                  }
                })
                .then(() => {
                  elastic.createIndex()
                  .then(() => {
                    console.log('Created index!');
                    util.createBulk(bulk, intermediary, "intermediary", () => {
                      console.log('object done: intermediary', intermediary.length);
                      elastic.uploadBulk(bulk)
                      .then(() => {
                        console.log('finished uploading bulk')
                        bulk = [];
                        util.createBulk(bulk, officers.slice(0, officers.length/2), "officers", () => {
                          console.log('object done: officers', officers.length/2);
                          elastic.uploadBulk(bulk)
                          .then(() => {
                            console.log('finished uploading bulk')
                            bulk = [];
                            util.createBulk(bulk, officers.slice(officers.length/2), "officers", () => {
                              console.log('object done: officers1', officers.length/2);
                              elastic.uploadBulk(bulk)
                              .then(() => {
                                console.log('finished uploading bulk')
                                bulk = [];
                                util.createBulk(bulk, entity.slice(0, entity.length/2), "entity", () => {
                                  console.log('object done: entity', entity.length/2);
                                  elastic.uploadBulk(bulk)
                                  .then(() => {
                                    console.log('finished uploading bulk')
                                    bulk = [];
                                    util.createBulk(bulk, entity.slice(entity.length/2), "entity", () => {
                                      console.log('object done: entity1', entity.length/2);
                                      elastic.uploadBulk(bulk)
                                      .then(() => {
                                        console.log('finished uploading bulk')
                                        bulk = [];
                                        util.createBulk(bulk, address, "address", () => {
                                          console.log('object done: address', address.length);
                                          elastic.uploadBulk(bulk)
                                          .then(() => {
                                            console.log('finished uploading bulk')
                                            bulk = [];
                                            util.createBulk(bulk, other, "other", () => {
                                              console.log('object done: other', other.length);
                                              elastic.uploadBulk(bulk)
                                              .then(() => {
                                                console.log('finished uploading bulk');
                                              });
                                            });
                                          });
                                        });
                                      });
                                    });
                                  });
                                });
                              });
                            });
                          });   
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

function uploadToElastic(bulk) {
  elastic.uploadBulk(bulk)
  .then(console.log('finished uploading bulk'))
  .catch(error => console.error(error));
}

function testElastic() {
  elastic.indexExists()
  .then(exists => {
    if(exists) {
      console.log('Index exist! Deleting it just for test');
      elastic.deleteIndex()
      .then(console.log('Deleted index'));
    } else {
      console.log('Index does not exist!');
    }
  })
  .then(() => {
    return elastic.createIndex();
    // .then(() => {
    //   console.log('Created index!');
    // });
  })
}
// function testElastic(bulk) {
//   elastic.indexExists()
//   .then(exists => {
//     if(exists) {
//       console.log('Index exist! Deleting it just for test');
//       elastic.deleteIndex()
//       .then(console.log('Deleted index'));
//     } else {
//       console.log('Index does not exist!');
//     }
//   })
//   .then(() => {
//     elastic.createIndex()
//     .then(() => {
//     elastic.uploadBulk(bulk)
//     .then(console.log('finished uploading bulk'))
//     .catch(error => console.error(error));
//     });
//   })
// }

doAll(testElastic, uploadToElastic);
  // }
// }

// module.exports = controller;