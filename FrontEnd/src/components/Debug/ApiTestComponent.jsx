import React, { useState, useEffect } from 'react';
import apiService from '../../services/ApiService';

const ApiTestComponent = () => {
  const [testResults, setTestResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const runApiTests = async () => {
    setIsLoading(true);
    const results = {};

    // Test 1: Check backend connection
    try {
      const response = await fetch('http://localhost:5000/api');
      results.backendConnection = {
        success: response.ok,
        message: response.ok ? 'Backend connected successfully' : `Error: ${response.status}`
      };
    } catch (error) {
      results.backendConnection = {
        success: false,
        message: `Connection failed: ${error.message}`
      };
    }

    // Test 2: Test Events API
    try {
      const events = await apiService.getAllEvents();
      results.eventsApi = {
        success: true,
        message: `Events API working - Found ${events.length} events`,
        data: events.slice(0, 2) // Show first 2 events
      };
    } catch (error) {
      results.eventsApi = {
        success: false,
        message: `Events API failed: ${error.message}`
      };
    }

    // Test 3: Test Students API
    try {
      const students = await apiService.getAllStudents();
      results.studentsApi = {
        success: true,
        message: `Students API working - Found ${students.length} students`,
        data: students.slice(0, 2) // Show first 2 students
      };
    } catch (error) {
      results.studentsApi = {
        success: false,
        message: `Students API failed: ${error.message}`
      };
    }

    // Test 4: Test Activities API
    try {
      const activities = await apiService.getAllActivities();
      results.activitiesApi = {
        success: true,
        message: `Activities API working - Found ${activities.length} activities`,
        data: activities.slice(0, 2) // Show first 2 activities
      };
    } catch (error) {
      results.activitiesApi = {
        success: false,
        message: `Activities API failed: ${error.message}`
      };
    }

    // Test 5: Test Faculty API
    try {
      const faculty = await apiService.getAllFaculty();
      results.facultyApi = {
        success: true,
        message: `Faculty API working - Found ${faculty.length} faculty members`,
        data: faculty.slice(0, 2) // Show first 2 faculty
      };
    } catch (error) {
      results.facultyApi = {
        success: false,
        message: `Faculty API failed: ${error.message}`
      };
    }

    setTestResults(results);
    setIsLoading(false);
  };

  useEffect(() => {
    runApiTests();
  }, []);

  const getStatusIcon = (success) => {
    return success ? '✅' : '❌';
  };

  const getStatusColor = (success) => {
    return success ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">API Integration Test</h2>
        <button
          onClick={runApiTests}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Run Tests'}
        </button>
      </div>

      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Running API tests...</p>
        </div>
      )}

      <div className="space-y-4">
        {Object.entries(testResults).map(([testName, result]) => (
          <div key={testName} className="border rounded-lg p-4">
            <div className="flex items-center mb-2">
              <span className="text-xl mr-2">{getStatusIcon(result.success)}</span>
              <h3 className="text-lg font-semibold capitalize">
                {testName.replace(/([A-Z])/g, ' $1').trim()}
              </h3>
            </div>
            
            <p className={`mb-2 ${getStatusColor(result.success)}`}>
              {result.message}
            </p>

            {result.data && result.data.length > 0 && (
              <div className="mt-3">
                <h4 className="font-medium text-gray-700 mb-2">Sample Data:</h4>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <pre className="whitespace-pre-wrap">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {Object.keys(testResults).length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Instructions:</h3>
          <ul className="text-blue-700 space-y-1 text-sm">
            <li>• If backend connection fails, start the backend server: <code>cd BackEnd/server && npm start</code></li>
            <li>• Backend should run on port 5000</li>
            <li>• Frontend should run on port 3000</li>
            <li>• All API endpoints should return data from the database</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ApiTestComponent;
