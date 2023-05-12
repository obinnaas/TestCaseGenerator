import React, { useState } from 'react';
import './App.css';
import logo from './logo.svg';


const testOptions = {
  'Feed/Data Ingestion': (column) => ({
    test_case: `Verify that data for ${column} is ingested correctly from the feed`,
    expected_result: `Data for ${column} should be ingested correctly from the feed`,
  }),
  'Report Automation': (column) => ({
    test_case: `Verify that the report for ${column} is generated automatically`,
    expected_result: `The report for ${column} should be generated automatically`,
  }),
  'Feed/Column Modification': (column) => ({
    test_case: `Verify that the feed/column for ${column} is modified correctly`,
    expected_result: `The feed/column for ${column} should be modified correctly`,
  }),
  'API development': (column) => ({
    test_case: `Verify that the API for ${column} is developed correctly`,
    expected_result: `The API for ${column} should be developed correctly`,
  }),
  'PowerBI Report': (column) => ({
    test_case: `Verify that the PowerBI report for ${column} is generated correctly`,
    expected_result: `The PowerBI report for ${column} should be generated correctly`,
  }),
  'Column Decoding': (column) => ({
    test_case: `Verify that the column for ${column} is decoded correctly`,
    expected_result: `The column for ${column} should be decoded correctly`,
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