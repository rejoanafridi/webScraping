const fs = require('fs');
const path = require('path');

// Directory containing the JSON files to be merged
const directory = path.resolve(__dirname, './filter');

// Create an empty array to store the merged data
const mergedData = [];

// Read the directory
fs.readdirSync(directory).forEach((file) => {
  // Check if the file is a JSON file
  if (path.extname(file) === '.json') {
    const filePath = path.join(directory, file);

    // Read the JSON file
    const jsonData = require(filePath);

    // Create an object with the filename as the key and JSON data as the value
    const fileObject = { [file]: jsonData };

    // Push the object to the mergedData array
    mergedData.push(fileObject);
  }
});

// Write the merged data to a single JSON file
const mergedFilePath = './filter/allComponents.json'; // Change to your desired output file path
fs.writeFileSync(mergedFilePath, JSON.stringify(mergedData, null, 2));

console.log('JSON files merged successfully.');
