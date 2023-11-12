import conf from "../conf/conf.js";
import { Client, Account, ID, Databases, Storage, Query } from "appwrite";

export class Service {
  client = new Client();
  database;
  bucket;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.account = new Account(this.client);
    this.database = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }
  async createPost({ title, slug, content, featuredImage, status, userId }) {
    try {
      return await this.database.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug, // slug is for the document id
        {
          title,
          content,
          featuredImage,
          status,
          userId,
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
  async updatePost(slug, { title, content, featuredImage, status }) {
    try {
      return await this.database.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
        }
      );
    } catch (error) {
      console.log("Error in updatePost", error);
    }
  }

  async deletePost(slug) {
    try {
      await this.database.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );
      return true;
    } catch (error) {
      console.log(error);
    }
  }

  async getPost(slug) {
    try {
      return await this.database.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );
    } catch (error) {
      console.log("Appwrite serive :: getPost :: error", error);
      return false;
    }
  }

  async getPosts(queries = [Query.equal("status","active")]){
    try{

      return await this.database.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        queries
      )


    }catch(error){
      console.log("Appwrite service :: getPosts :: error",error);
      return false;
    }
  }

  //file upload services
  async fileUpload(file){
    try{

      return this.bucket.createFile(
        conf.appwriteBucketId,
        ID.unique(),
        file
      )
    }catch(error){
      console.log("Appwrite service :: file Upload :: Error",error);
    }
  }

  async deleteFile(fileId){
    try{

       return await this.bucket.deleteFile(
        conf.appwriteBucketId,
        fileId,
       )
    }catch(error){
      console.log("Apppwrite service :: deleteFile :: Error",error);
      return false;
    }
  }
  getFilePreview(fileId){
    return this.bucket.getFilePreview(
        conf.appwriteBucketId,
        fileId
    )
}

}
//! you can make queries if you give index in appwrite 

const service = new Service();
export default service;
