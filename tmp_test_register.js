const axios = require('axios');

async function testRegister() {
    try {
        const response = await axios.post('http://localhost:5001/api/auth/register', {
            name: 'Test Account',
            email: 'test' + Math.random() + '@example.com',
            password: 'password123'
        });
        console.log('Success:', response.data);
    } catch (error) {
        console.log('Error:', error.response ? error.response.status : error.message);
        if (error.response) {
            console.log('Data:', error.response.data);
        }
    }
}

testRegister();
