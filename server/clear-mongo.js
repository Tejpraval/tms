const mongoose = require('mongoose');

async function clean() {
    await mongoose.connect('mongodb://localhost:27017/tms_local');
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    let badCount = 0;
    for (const collInfo of collections) {
        const coll = db.collection(collInfo.name);

        try {
            const result = await coll.deleteMany({
                $or: [
                    { 'baseVersionId': '<version5_id>' },
                    { 'candidateVersionId': '<version5_id>' },
                    { '_id': '<version5_id>' }
                ]
            });

            if (result.deletedCount > 0) {
                console.log(`Deleted ${result.deletedCount} bad mocks from ${collInfo.name}`);
                badCount += result.deletedCount;
            }
        } catch (e) {
            // ignore cast errors on collections without these properties
        }
    }

    console.log('Total mock strings eradicated globally:', badCount);
    process.exit(0);
}

clean().catch(console.error);
