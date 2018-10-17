// const db = require('./database/postgres/model.js');
const postgres = require('./database/postgres');
const elastic = require('./database/elastic-search');
const sequelize = require('sequelize');
const util = require('./lib/utility');

// const controller = {
  // get: (req, res) => {
function doAll () {
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
                console.log('DONE IMPORTING DATABASE INFO!\n Files added:', other.length + address.length + entity.length + intermediary.length + officers.length + edges.length)
                console.log('\n');

                const fs = require('fs');
                const write = fs.createWriteStream('./data.json');
                const writeEdges = fs.createWriteStream('./dataEdges.json');

                util.createJsonEdges(writeEdges, 'utf8', edges, () => {
                  console.log('file done edges');
                });

                util.createJson(write, 'utf8', officers, "officers", () => { 
                  console.log('file done officers');
                  util.createJson(write, 'utf8', intermediary, "intermediary", () => {
                    console.log('file done intermediary');
                    util.createJson(write, 'utf8', entity, "entity", () => {
                      console.log('file done entity');
                      util.createJson(write, 'utf8', address, "address", () => {
                        console.log('file done address');
                        util.createJson(write, 'utf8', other, "other", () => {
                          console.log('file done other');
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


function testElastic() {

}

doAll();
testElastic();
  // }
// }

// module.exports = controller;