// Simple test script to verify backend connectivity
const fetch = require('node-fetch');

const API_BASE = 'http://localhost:5000/api';

async function testBackend() {
  console.log('Testing backend connectivity...\n');
  
  try {
    // Test 1: Basic API connectivity
    console.log('1. Testing basic API connectivity...');
    const response = await fetch(`${API_BASE.replace('/api', '')}/api`);
    const text = await response.text();
    console.log('✅ API Response:', text);
    
    // Test 2: Test user registration
    console.log('\n2. Testing user registration...');
    const registerData = {
      name: 'Test User',
      email: 'test@student.college.edu',
      password: 'password123',
      department: 'Computer Science'
    };
    
    const registerResponse = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData)
    });
    
    const registerResult = await registerResponse.json();
    console.log('Register Response Status:', registerResponse.status);
    console.log('Register Response:', registerResult);
    
    if (registerResponse.status === 201) {
      console.log('✅ Registration successful');
      
      // Test 3: Test login with the registered user
      console.log('\n3. Testing login...');
      const loginResponse = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: registerData.email,
          password: registerData.password
        })
      });
      
      const loginResult = await loginResponse.json();
      console.log('Login Response Status:', loginResponse.status);
      console.log('Login Response:', loginResult);
      
      if (loginResponse.status === 200) {
        console.log('✅ Login successful');
      } else {
        console.log('❌ Login failed');
      }
    } else if (registerResponse.status === 400 && registerResult.message === 'User already exists') {
      console.log('ℹ️ User already exists, testing login...');
      
      // Test login with existing user
      const loginResponse = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: registerData.email,
          password: registerData.password
        })
      });
      
      const loginResult = await loginResponse.json();
      console.log('Login Response Status:', loginResponse.status);
      console.log('Login Response:', loginResult);
      
      if (loginResponse.status === 200) {
        console.log('✅ Login successful');
      } else {
        console.log('❌ Login failed');
      }
    } else {
      console.log('❌ Registration failed');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\nMake sure:');
    console.log('1. Backend server is running on port 5000');
    console.log('2. MongoDB is running and connected');
    console.log('3. All environment variables are set correctly');
  }
}

// Run the test
testBackend();
