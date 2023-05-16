import React, { useState } from 'react';
import './App.css';
import logo from './logo.svg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define an object containing test options and their corresponding functions
const testOptions = {
  'Feed/Data Ingestion': (column, tableName) => ({
    test_case: `Validate that the "${column}" column in the ingested record corresponds to the expected data type, value and aligns with the  business rules/logic from the source`,
    expected_result: `The "${column}" column in the ingested record should correspond to the expected data type, the value and should align with the business rules/logic from the source.`,
    test_steps: `On Dbeaver, type DESCRIBE ${tableName}, SELECT "${column}" from ${tableName}, SELECT * from ${tableName}`
  }),
  'Report Automation': (column, tableName) => ({
    test_case: `Validate that the "${column}" column is in the required datatype and values generated based on required business logic and rules.`,
    expected_result: `The "${column}" column should be in the required datatype and values generated based on required business logic and rules.`,
    test_steps: `On Dbeaver, DESCRIBE ${tableName}, SELECT "${column}" from ${tableName}, SELECT * from ${tableName}`
  }),
  'Feed/Column Modification': (column, tableName) => ({
    test_case: `Validate that the modified/added ingested "${column}" column is in the right datatype format, value and the business rules/implemented logic is accurate`,
    expected_result: `The modified/added ingested "${column}" column is in the right datatype format, value and the business rules/implemented logic is accurate`,
    test_steps: `On Dbeaver, DESCRIBE ${tableName}, SELECT "${column}" from ${tableName}, SELECT * from ${tableName}`
  }),
  'API development': (column, tableName) => ({
    test_case: `Validate that the "${column}" attribute matches the expected format, structure and value.`,
    expected_result: `The "${column}" attribute should match the expected format, structure and value.`,
    test_steps: `Send a request to the API endpoint that returns data for the "${column}" attribute and verify that the format, structure and value are correct`
  }),
  'PowerBI Report': (column, tableName) => ({
    test_case: `Verify that the "${column}" metric matches the expected values and visualizations accurately represent the data and adhere to the design requirement`,
    expected_result: `The "${column}" metric matches the expected values and visualizations accurately represent the data and adhere to the design requirement`,
    test_steps: `SELECT "${column}" metric and verify that the values and visualizations are correct`
  }),
  'Column Decoding': (column, tableName) => ({
    test_case: `Validate that the "${column}" column is decoded correctly and the values and datatype are in the specified format and logic`,
    expected_result: `The "${column}" column should be decoded correctly and the values and datatype are in the specified format and logic`,
    test_steps: `On Dbeaver, DESCRIBE ${tableName}, SELECT "${column}" from ${tableName}, SELECT * from ${tableName}`
  }),
};
// Define the App component
function App() {
  const [tableName, setTableName] = useState('');
  const [columnNames, setColumnNames] = useState('');
  const [testOption, setTestOption] = useState('Feed/Data Ingestion');
  const [testCases, setTestCases] = useState([]);
// Define a function to handle splitting the column names string into an array of column names
  const handleColumnNames = () => {
  let separator = /\s+/;
  if (columnNames.includes(',')) {
    separator = ',';
  }
  return columnNames.split(separator);
};
  // Define a function to handle generating test cases
  const handleGenerateTestCases = () => {
    const columns = handleColumnNames();
    const newTestCases = [];
    for (let column of columns) {
      const { test_case, expected_result, test_steps} = testOptions[testOption](column, tableName);
      const actual_result = '';
      const status = 'Pending';
      // Push an array containing this column's data into newTestCases
      newTestCases.push([column, test_case, expected_result, test_steps, actual_result, status]);
    }
    // Display a toast notification to the user
    setTestCases(newTestCases);
    toast('Scroll down, View Test Cases and Click Download', {
      position: 'bottom-left',
    });

  };
// Define a function to handle downloading the test cases as a CSV file
  const handleDownloadCSV = () => {

    // Initialize a csvContent variable to a string containing the CSV header row
    let csvContent =
      'data:text/csv;charset=utf-8,' +
      'Test Case ID,Fields,Test Case,Expected Result,Test Steps,Actual result (Not As Expected/As Expected),Status\n';
    // Loop over each test case in testCases
      testCases.forEach((testCase, index) => {
      // Format the test case ID by adding a leading zero if necessary
      const formatted_test_id = `TC${(index + 1).toString().padStart(2, '0')}`;
      // Map over the values in testCase and quote them to escape any special characters
      const quotedValues = testCase.map((value) =>
        `"${value.toString().replace(/"/g, '""')}"`
      );
      csvContent += `${formatted_test_id},${quotedValues.join(',')}\n`;
    });
    // Encode csvContent as a URI
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'test_cases.csv');
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="App">
      <img src={logo} alt="Logo" className="logo" />
      <h2>Test Case Generator</h2>
      <ToastContainer />
      <div className="input-container">
        <div class="parent-container">
        <div className="input-field">
          <label htmlFor="table-name">Enter table name:</label>
          <input
            id="table-name"
            type="text"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
          />
          
        <div className="input-field">
          <label htmlFor="column-names">Enter column names or paste from spreadsheet </label>
          <input
            id="column-names"
            type="text"
            value={columnNames}
            onChange={(e) => setColumnNames(e.target.value)}
          />
        </div>
        <div className="input-field">
          <label htmlFor="test-option">Select test option:</label>
          <select
            id="test-option"
            value={testOption}
            onChange={(e) => setTestOption(e.target.value)}
          >
            {Object.keys(testOptions).map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
            </div>
          </div>
        </div>
        <div className="button-container">
          <button onClick={handleGenerateTestCases}>Generate Test Cases</button>
          {testCases.length > 0 && (
            <button onClick={handleDownloadCSV} className="download-csv">Download Test Cases</button>
          )}
        </div>
      </div>
      
      {testCases.length > 0 && (
        <>
          <table>
            <thead>
              <tr>
                <th className="no-wrap">Test Case ID</th>
                <th>Fields</th>
                <th>Test Case</th>
                <th>Expected Result</th>
                <th>Test Steps</th>
                <th className="no-wrap">Actual result (Not As Expected/As Expected)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {testCases.map((testCase, index) => {
                const uniqueId = testCase[0];
                return (
                <tr key={uniqueId}>
                  <td>{`TC${(index + 1).toString().padStart(2, '0')}`}</td>
                  {testCase.map((value) => (
                    <td key={value}>{value}</td>
                  ))}
                </tr>
                )
                  })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default App;