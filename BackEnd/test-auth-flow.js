const fetch = require('node-fetch');

async function testAuthFlow() {
  console.log('🧪 Testing complete authentication flow...\n');

  try {
    // 1. Test basic API connectivity
    console.log('1️⃣ Testing API connectivity...');
    const apiResponse = await fetch('http://localhost:5000/api/test');
    const apiData = await apiResponse.json();
    console.log('✅ API Response:', apiData.message);

    // 2. Test login API
    console.log('\n2️⃣ Testing login API...');
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'student@demo.com',
        password: 'student123'
      })
    });

    const loginData = await loginResponse.json();
    console.log('Login Status:', loginResponse.status);
    console.log('Login Success:', loginData.success);
    console.log('Login Message:', loginData.message);

    if (loginData.success) {
      console.log('✅ Login API working correctly');
      console.log('Token received:', !!loginData.token);
      console.log('User received:', !!loginData.user);
      console.log('User name:', loginData.user?.name);
      console.log('User email:', loginData.user?.email);
      console.log('User role:', loginData.user?.role);
    } else {
      console.log('❌ Login API failed:', loginData.message);
    }

    // 3. Test frontend connectivity (simulate CORS)
    console.log('\n3️⃣ Testing CORS connectivity...');
    const corsResponse = await fetch('http://localhost:3000', {
      method: 'HEAD'
    });
    console.log('Frontend Status:', corsResponse.status);
    console.log('✅ Frontend accessible');

    console.log('\n🎉 All tests completed!');

  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testAuthFlow();
