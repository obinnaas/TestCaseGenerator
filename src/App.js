import React, { useState } from 'react';
import './App.css';
import logo from './logo.svg';


const testOptions = {
  'Feed/Data Ingestion': (column) => ({
    test_case: `Validate that the "${column}" column in the ingested data corresponds to the expected data type, value and the business rules/implemented logic are accurate`,
    expected_result: `The "${column}" column in the ingested data should correspond to the expected data type, value and the business rules/implemented logic are accurate`
  }),
  'Report Automation': (column) => ({
    test_case: `Validate that the "${column}" column is in the right format and generated based on logic provided`,
    expected_result: `The "${column}" column should be in the right format and generated based on logic provided.`
  }),
  'Feed/Column Modification': (column) => ({
    test_case: `Validate that the modified/added ingested "${column}" column  is in the right datatype format, value and the business rules/implemented logic is accurate`,
    expected_result: `The modified/added ingested "${column}" column  is in the right datatype format, value and the business rules/implemented logic is accurate`
  }),
  'API development': (column) => ({
    test_case: `Validate that the "${column}" attribute matches the expected format, structure and value.`,
    expected_result: `The "${column}" attribute should match the expected format, structure and value.`
  }),
  'PowerBI Report': (column) => ({
    test_case: `Verify that the "${column}" metric matches the expected values and visualizations accurately represent the data and adhere to the intended design`,
    expected_result: `The "${column}" metric matches the expected values and visualizations accurately represent the data and adhere to the intended design.`
  }),
  'Column Decoding': (column) => ({
    test_case: `Validate that the "${column}" column is decoded correctly and the values and datatype is in the specified format and logic`,
    expected_result: `The "${column}" column should be decoded correctly and values and datatype and are in the specified format and logic`
  }),
};

function App() {
  const [tableName, setTableName] = useState('');
  const [columnNames, setColumnNames] = useState('');
  const [testOption, setTestOption] = useState('Feed/Data Ingestion');
  const [testCases, setTestCases] = useState([]);

  const handleGenerateTestCases = () => {
    const columns = columnNames.split('\t');
    const newTestCases = [];
    for (let column of columns) {
      const { test_case, expected_result } = testOptions[testOption](column);
      const test_steps = `SELECT ${column} from ${tableName} OR SELECT * from ${tableName}`;
      const actual_result = '';
      const status = 'Pending';
      newTestCases.push([column, test_case, expected_result, test_steps, actual_result, status]);
    }
    setTestCases(newTestCases);
  };

  const handleDownloadCSV = () => {
    let csvContent =
      'data:text/csv;charset=utf-8,' +
      'Test Case ID,Fields,Test Case,Expected Result,Test Steps,Actual result (Not As Expected/As Expected),Status\n';
    testCases.forEach((testCase, index) => {
      const formatted_test_id = `TC${(index + 1).toString().padStart(2, '0')}`;
      csvContent += `${formatted_test_id},${testCase.join(',')}\n`;
    });
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
          <label htmlFor="column-names">Enter column names separated by tabs:</label>
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
                <th>Test Case ID</th>
                <th>Fields</th>
                <th>Test Case</th>
                <th>Expected Result</th>
                <th>Test Steps</th>
                <th>Actual result (Not As Expected/As Expected)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {testCases.map((testCase, index) => (
                <tr key={index}>
                  <td>{`TC${(index + 1).toString().padStart(2, '0')}`}</td>
                  {testCase.map((value) => (
                    <td key={value}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default App;