const fs = require('fs');
const path = require('path');

// Directory containing the JSON files to merge
const directoryPath = './products'; // Replace with the actual directory path

// Function to read and merge JSON files in a directory
const mergeJSONFiles = (dirPath) => {
  const mergedData = [];

  // Read all files in the directory
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    // Merge the data from the current file into the mergedData array
    mergedData.push(...fileData);
  });

  return mergedData;
};

// Call the mergeJSONFiles function with the directory path
const mergedJSONData = mergeJSONFiles(directoryPath);

// Write the merged data to a single JSON file
fs.writeFileSync('merged_data2.json', JSON.stringify(mergedJSONData, null, 2));

console.log('JSON files merged successfully!');
