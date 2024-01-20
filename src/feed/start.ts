import mongooseConnect from '../databases/mongodb/mongodb';
import quotesSchema from '../databases/mongodb/schema/quotes.schema';
import quoteJson from './quotes.json';

async function start() {
    await Promise.all([mongooseConnect()]);
    console.log('Database started');
    try {
        //const dd = await (quotesSchema.insertMany(quoteJson));
        // console.log('Database',dd);
        const ddd = quotesSchema.findOne({});
        console.log('ddd -->',ddd);
    }
    catch(error) {
        console.log(error);
    }
}

start().then(() => {
    console.log('DONE');
}).catch((error) => {
    console.error('Error',error);
});
