const fs = require('fs');

// Read the components.json file
const componentsData = JSON.parse(
  fs.readFileSync('./merged_data2.json', 'utf-8'),
);

// Filter objects where name includes 'amd', 'intel', or 'processor'
const processorsData = componentsData.filter((product) => {
  const name = product.name.toLowerCase();
  return name.includes('ups') && name.includes('battery');
});

// Write the filtered data to processors.json
fs.writeFileSync('./filter/ups.json', JSON.stringify(processorsData, null, 2));

console.log(
  `Filtered data for ${processorsData.length} processors saved to processors.json`,
);
