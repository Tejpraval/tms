const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

async function run() {
    await mongoose.connect('mongodb+srv://tejpraval:UrKTIZQLvMlJW9E6@cluster0.0xs5bzs.mongodb.net/tenant-db');
    console.log('Connected');
    const hash = await bcrypt.hash('password', 10);
    await mongoose.connection.db.collection('users').updateOne({ email: 'admin@test.com' }, { $set: { password: hash } });
    console.log('Password updated');
    process.exit(0);
}

run().catch(console.error);
