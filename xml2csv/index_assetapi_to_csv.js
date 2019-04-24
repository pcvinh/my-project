const https = require('https');

const createCsvWriter = require('csv-writer').createArrayCsvWriter;  
const csvWriter = createCsvWriter({  
  path: 'out_assetapi_tc.csv'
});

/*collections = [{"id":"8526419","details":"children"},
{"collections":"8097792","details":"all","page_size":"450","orderby":"display_name+asc"},
{"id":"8805558","details":"children"},
{"collections":"167019455","details":"all","orderby":"display_name+asc","page_size":"350"},
{"collections":"88260570","details":"all","page_size":"800","orderby":"display_name+asc"},
{"id":"60542967","details":"children"},
{"id":"103464920","details":"children"},
{"id":"76130918","details":"children"},
{"id":"8810303","details":"children"},
{"collections":"139265409","details":"all","orderby":"display_name+asc","page_size":"250"},
{"collections":"139265311","details":"all","orderby":"display_name+asc","page_size":"800"},
{"collections":"9120495","details":"all","orderby":"display_name+asc","page_size":"800"},
{"id":"25126779","details":"children"},
{"id":"7636845","details":"children"},
{"id":"7678174","details":"children"},
{"collections":"132066734","details":"all","page_size":"50","orderby":"display_name+asc"},
{"id":"52242875","details":"children"},
{"id":"12468713","details":"children"},
{"id":"16981737","details":"children"},
{"id":"12355874","details":"children"},
{"id":"8798580","details":"children"},
{"id":"7684943","details":"children"},
{"id":"16982417","details":"children"},
{"collections":"174352934","details":"all","page_size":"200","orderby":"display_name+asc"},
{"id":"16982047","details":"children"},
{"id":"16982855","details":"children"},
{"collections":"69646295","details":"all","page_size":"500","orderby":"display_name+asc"},
{"id":"94540407","details":"children"},
{"collections":"103854764","details":"all","orderby":"display_name+asc","page_size":"300"},
{"id":"16390752","details":"children"},
{"collections":"8808677","details":"all","orderby":"display_name+asc","page_size":"550"},
{"id":"16386522","details":"children"},
{"id":"164040386","details":"all"},
{"id":"16389898","details":"children"},
{"id":"16347175","details":"children"},
{"id":"12344752","details":"children"},
{"id":"8106566","details":"children"},
{"collections":"71828227","details":"all","orderby":"display_name+asc"}];*/

collections = [
	{"id":"203991828","details":"children"},
	{"id":"203991730","details":"children"},
	{"id":"203991581","details":"children"},
	{"id":"203991737","details":"children"},
	{"id":"203991728","details":"children"},
	{"id":"203991493","details":"children"},
]

array_csv = [];

function run(x) {
	if(x < collections.length) {
		var collection_id = (collections[x].hasOwnProperty('collections') ? collections[x].collections : collections[x].id);
		https.get('https://player.ooyala.com/opm/v1/assets?collections='+collection_id+'&details=all&pcode=V4bmQyOqnbswtz9daXLyKFGCO8Zp&orderby=display_name+asc&page_size=800', (resp)=>{
		  let data = '';
		  // A chunk of data has been recieved.
		  resp.on('data', (chunk) => {
			data += chunk;
		  });

		  // The whole response has been received. Print out the result.
		  resp.on('end', () => {
			process_assetapi(collection_id, JSON.parse(data), function(ret) {
				array_csv = array_csv.concat(ret);
				console.log('run(x='+x+'/'+collections.length+')finish for collection_id = ' + collection_id);
				run(x + 1);
			});
			
		  });

		}).on("error", (err) => {
		  console.log("Error: " + err.message);
		});
	} else {
		csvWriter  
		  .writeRecords(array_csv)
		  .then(()=> console.log('The CSV file was written successfully'));
	}
	
	
}

run(0);

function process_assetapi(collection_id, data, callback) {
	var ret = [];
	var assets = data.results;

	for(var i = 0; i < assets.length; i++) {
		var parents = "";
		if(assets[i].parents) {
			for(var j=0; j < assets[i].parents.length; j++) {
				parents += ", " + assets[i].parents[j].type + "(" +assets[i].parents[j].name+ ")";
			}
		}
		var collections = "";
		if(assets[i].collections) {
			for(var j=0; j < assets[i].collections.length; j++) {
				collections += ", " + assets[i].collections[j].display_name + "(" +assets[i].collections[j].id+ ")";
			}
		}
		var asset = [collection_id, assets[i].id, assets[i].name,assets[i].type, assets[i].display_name, parents, collections, (assets[i].type == 'series' ? assets[i].children : 'NA')];
		
		ret.push(asset);
		
		if(i == assets.length - 1) {
			callback(ret);
		}
	}
}