// Test script to verify API integration
// This script tests the connection between frontend and backend

const API_BASE_URL = 'http://localhost:5000/api';

async function testApiConnection() {
  console.log('🔍 Testing API Integration...\n');

  // Test 1: Check if backend is running
  try {
    console.log('1. Testing backend connection...');
    const response = await fetch(`${API_BASE_URL}`);
    if (response.ok) {
      const data = await response.text();
      console.log('✅ Backend is running:', data);
    } else {
      console.log('❌ Backend returned error:', response.status);
    }
  } catch (error) {
    console.log('❌ Backend connection failed:', error.message);
    console.log('   Make sure the backend server is running on port 5000');
    return;
  }

  // Test 2: Test Events API
  try {
    console.log('\n2. Testing Events API...');
    const response = await fetch(`${API_BASE_URL}/events`);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Events API working, found', data.data?.length || 0, 'events');
    } else {
      console.log('❌ Events API failed:', response.status);
    }
  } catch (error) {
    console.log('❌ Events API error:', error.message);
  }

  // Test 3: Test Students API
  try {
    console.log('\n3. Testing Students API...');
    const response = await fetch(`${API_BASE_URL}/students`);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Students API working, found', data.data?.students?.length || 0, 'students');
    } else {
      console.log('❌ Students API failed:', response.status);
      const errorData = await response.json().catch(() => ({}));
      console.log('   Error:', errorData.message || 'Unknown error');
    }
  } catch (error) {
    console.log('❌ Students API error:', error.message);
  }

  // Test 4: Test Activities API
  try {
    console.log('\n4. Testing Activities API...');
    const response = await fetch(`${API_BASE_URL}/activities`);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Activities API working, found', data.data?.length || 0, 'activities');
    } else {
      console.log('❌ Activities API failed:', response.status);
      const errorData = await response.json().catch(() => ({}));
      console.log('   Error:', errorData.message || 'Unknown error');
    }
  } catch (error) {
    console.log('❌ Activities API error:', error.message);
  }

  // Test 5: Test Faculty API
  try {
    console.log('\n5. Testing Faculty API...');
    const response = await fetch(`${API_BASE_URL}/faculty`);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Faculty API working, found', data.data?.faculty?.length || 0, 'faculty members');
    } else {
      console.log('❌ Faculty API failed:', response.status);
      const errorData = await response.json().catch(() => ({}));
      console.log('   Error:', errorData.message || 'Unknown error');
    }
  } catch (error) {
    console.log('❌ Faculty API error:', error.message);
  }

  // Test 6: Test Certificates API
  try {
    console.log('\n6. Testing Certificates API...');
    const response = await fetch(`${API_BASE_URL}/certificates`);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Certificates API working, found', data.data?.length || 0, 'certificates');
    } else {
      console.log('❌ Certificates API failed:', response.status);
      const errorData = await response.json().catch(() => ({}));
      console.log('   Error:', errorData.message || 'Unknown error');
    }
  } catch (error) {
    console.log('❌ Certificates API error:', error.message);
  }

  console.log('\n🎉 API Integration Test Complete!');
  console.log('\nNext Steps:');
  console.log('1. Start the backend server: cd BackEnd/server && npm start');
  console.log('2. Frontend is already running on: http://localhost:5173');
  console.log('3. Test the application in your browser');
}

// Run the test
testApiConnection().catch(console.error);
