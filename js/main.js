crimeDataUrl = "https://data.lacity.org/resource/7fvc-faax.json?";
mapsUrl = "https://maps.googleapis.com/maps/api/geocode/json?";

var zipTable = {}; // found zipcodes

/*
 * Given coordinates in the US, returns the zip-code corresponding to those
 * coordinates through reverse-geocoding.
 */
function generateZip(coords) {
  mapsUrlWithCoords = mapsUrl + "latlng=" + coords[1] + "," + coords[0] +
    "&result_type=postal_code&key=AIzaSyA_WPzfn9BURv6RAf51daErCFm18WdxBQ0";
  fetch(mapsUrlWithCoords)
  .then((resp) => resp.json())
  .then(function(data) {
    try {
      var zip = data.results[0].address_components[0].long_name; // The zip code reverse-geocoded
      // Count the number of crimes in each zip code
      if (typeof zip != 'undefined') {
        if (zipTable.hasOwnProperty(zip)) {
          zipTable[String(zip)] = zipTable[String(zip)] + 1;
        } else {
          zipTable[String(zip)] = 1;
        }
      }
    } catch(error) {
      //console.log("nah");
    }
  })
}

function fillZipTable(crimeData) {
  for (var i = 0; i < crimeData.length; i++) {
    generateZip(crimeData[i].location_1.coordinates);
  }

  waitForElement();

  console.log('ended fnc');
}

function waitForElement() {
  if (Object.keys(zipTable).length != 0) {
    var countTable = document.getElementById('zipTable');

    for (var zip in zipTable) {
      var tableBody = document.createElement('tbody');
      var tableRow = document.createElement('tr');
      var zipTableCell = document.createElement('td');
      var zipData = document.createTextNode(zip);
      zipTableCell.appendChild(zipData);

      var zipCountCell = document.createElement('td');
      var zipCount = document.createTextNode(zipTable[zip]);
      zipCountCell.appendChild(zipCount);

      tableRow.appendChild(zipTableCell);
      tableRow.appendChild(zipCountCell);
      tableBody.appendChild(tableRow);

      countTable.appendChild(tableBody);
    }
  } else {
    console.log("not yet");
    setTimeout(waitForElement, 1250);
  }
}

// latlng=blah,blah2&result_type=postal_code
(function grabCrimeData() {
  fetch(crimeDataUrl)
  .then((resp) => resp.json())  // parse as json
  .then(function(data) {
    fillZipTable(data);
//    console.log(data);
  })
})();
/*
(function logic() {
  var crimeData = grabCrimeData();
  crimeData.then(result => fillZipTable(result))
  .then(console.log(zipTable));

  console.log(crimeData);
})();
*/
