import { connect } from "mongoose";


export default async function MongodbConnection(): Promise<boolean> {

    try {
        let uri = process.env.MONGODB_URI as string;

        if (!uri) throw Error(" You must provide the mongodb uri ");

        await connect(uri)

        console.log("connected to mongoDB");

        return true
    }
    catch (err) {
        console.log(err);
        return false
    }
}
//* To define the file runtime
export const runtime = 'nodejs' 