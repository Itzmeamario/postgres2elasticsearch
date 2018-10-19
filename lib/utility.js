exports.createBulk = (bulk, element, elementName, callback) => {
  function write() {
    for(let i = 0; i < element.length; i++) {
      let id = element[i].node_id;
      let name = element[i].name.replace(/\r?\n/g, " ").replace(/\t?\t/g, "").replace(/"/g, "");
      let countries = element[i].countries;
      let country_codes = element[i].country_codes;
      bulk.push({
        'index':
          {
            '_index': 'panama_papers',
            '_type': 'panama_papers',
            '_id': id
          }
      });
      bulk.push({
        id,
        name, 
        countries, 
        country_codes,
        elementName
      });
    }
    callback();
  }
  write();
}

exports.createJson = (writer, encoding, element, elementName, callback) => {
  let i = 0;
  let max = element.length;
  function write() {
    let ok = true;
    while (i < max && ok) {
      let id = element[i].node_id;
      let name = element[i].name.replace(/\r?\n/g, " ").replace(/\t?\t/g, "").replace(/"/g, "");
      let countries = element[i].countries;
      let country_codes = element[i].country_codes;
      i += 1;
      if (i === max) {
        writer.write(`{ "index" : { "_index" : "panama_papers", "_type" : "panama_papers", "_id" : "${id}" } }\n`, encoding);
        writer.write(`{ "id" : "${id}", "name" : "${name}", "countries" : "${countries}", "country_codes" : "${country_codes}", "type" : "${elementName}" }\n`, encoding, callback);
      } else {
        ok = writer.write(`{ "index" : { "_index" : "panama_papers", "_type" : "panama_papers", "_id" : "${id}" } }\n`, encoding);
        ok = writer.write(`{ "id" : "${id}", "name" : "${name}", "countries" : "${countries}", "country_codes" : "${country_codes}", "type" : "${elementName}" }\n`, encoding);
      }
    }
    if (i < max) {
      writer.once('drain', write);
    }
  }
  write();
}