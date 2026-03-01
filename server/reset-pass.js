const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
import { ENV } from './env';

async function run() {
    await mongoose.connect(ENV.MONGO_URI);
    console.log('Connected');
    const hash = await bcrypt.hash('password', 10);
    await mongoose.connection.db.collection('users').updateOne({ email: 'admin@test.com' }, { $set: { password: hash } });
    console.log('Password updated');
    process.exit(0);
}

run().catch(console.error);
