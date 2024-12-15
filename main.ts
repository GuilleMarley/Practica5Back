import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { MongoClient } from "mongodb";
import { schema } from "./schema.ts";
import { CourseModel, StudentModel, TeacherModel } from "./types.ts";
import { resolvers } from "./resolvers.ts";

const MONGO_URL = Deno.env.get("MONGO_URL");

if (!MONGO_URL) {
  throw new Error("MONGO_URL is required");
}

const mongoClient = new MongoClient(MONGO_URL);
await mongoClient.connect();

console.info("Connected to MongoDB");

const mongoDB = mongoClient.db("school");
const StudentCollection = mongoDB.collection<StudentModel>("students");
const TeacherCollection = mongoDB.collection<TeacherModel>("teachers");
const CourseCollection = mongoDB.collection<CourseModel>("courses");

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  context: async () => ({ StudentCollection, TeacherCollection, CourseCollection }),
});

console.info(`Server ready at ${url}`);