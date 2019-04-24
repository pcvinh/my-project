const fs = require('fs')
const fileContents = fs.readFileSync('data.json', 'utf8')

const createCsvWriter = require('csv-writer').createArrayCsvWriter;  
const csvWriter = createCsvWriter({  
  path: 'out.csv'
});

try {
  const data = JSON.parse(fileContents);
  
	parse(data, function(ret) {
	  csvWriter  
	  .writeRecords(ret)
	  .then(()=> console.log('The CSV file was written successfully'));
	});

} catch(err) {
  console.error(err)
}

function parse(data, callback) {

	var ret = [] ;
  for(var i = 0; i < data.profileData.pages.length; i++) {
	  var page = data.profileData.pages[i];
	  for(var j=0; j < page.items.length; j++) {
		  var item = page.items[j];
		  
		  //console.log(page["@Metadata_RepeatLabel"]);
		  ret.push([page["@Metadata_RepeatLabel"], page.analyticsPageName, page.id, item["@Metadata_RepeatLabel"], item.action,item.actionID,item.query, item.queryoptions_str, item.title.en_US]);
		if(i == data.profileData.pages.length - 1 && j == page.items.length - 1) {
			callback(ret);
		}
	  }
  }
  
	
}