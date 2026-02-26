import { ObjectId} from "mongodb";
import mongo from "../config/MongoDB.mjs";

export const adminservice ={
    async createNews(news){
        try{
            const db= await mongo();
            const result = await db.collection('news').insertOne(news);
            return result; 
        }catch(err){
            throw err;
        }    
    },

    async createVideoStory(video){
        try{
            const db= await mongo();
            const result = await db.collection('video_story').insertOne(video);
            return result; 
        }catch(err){
            throw err;
        }    
    },

    async createVideo(video){
        try{
            const db= await mongo();
            const result = await db.collection('video').insertOne(video);
            return result; 
        }catch(err){
            throw err;
        }    
    },

    async createPhotoStory(photo){
        try{
            const db= await mongo();
            const result = await db.collection('photo_story').insertOne(photo);
            return result; 
        }catch(err){
            throw err;
        }    
    },

    async getNews(filter,pagination){
        try{
           const skip = (parseInt(pagination?.page) - 1) * parseInt(pagination?.limit);
           const db=await mongo();
           const [data,total]=await Promise.all([
            await db.collection("news").find(filter).skip(skip).limit(parseInt(pagination?.limit)).sort({createdAt:-1}).toArray(),
            await db.collection("news").countDocuments(filter),
           ])

            return {
            success: true,
            data,
            pagination: {
                total,
                page: parseInt(pagination?.page),
                limit: parseInt(pagination?.limit),
                totalPages: Math.ceil(total / parseInt(pagination?.limit)),
            },
            }
        }catch(error){
            throw error
        }
    },
    async getVideo(filter,pagination){
        try{
           const skip = (parseInt(pagination?.page) - 1) * parseInt(pagination?.limit);
           const db=await mongo();
           const [data,total]=await Promise.all([
            await db.collection("video").find(filter).skip(skip).limit(parseInt(pagination?.limit)).sort({createdAt:-1}).toArray(),
            await db.collection("video").countDocuments(filter),
           ])

            return {
            success: true,
            data,
            pagination: {
                total,
                page: parseInt(pagination?.page),
                limit: parseInt(pagination?.limit),
                totalPages: Math.ceil(total / parseInt(pagination?.limit)),
            },
            }
        }catch(error){
            throw error
        }
    },

    async getPhotoStory(filter,pagination){
        try{
           const skip = (parseInt(pagination?.page) - 1) * parseInt(pagination?.limit);
           const db=await mongo();
           const [data,total]=await Promise.all([
            await db.collection("photo_story").find(filter).skip(skip).limit(parseInt(pagination?.limit)).sort({createdAt:-1}).toArray(),
            await db.collection("photo_story").countDocuments(filter),
           ])

            return {
            success: true,
            data,
            pagination: {
                total,
                page: parseInt(pagination?.page),
                limit: parseInt(pagination?.limit),
                totalPages: Math.ceil(total / parseInt(pagination?.limit)),
            },
            }
        }catch(error){
            throw error
        }
    },

    async getVideoStory(filter,pagination){
        try{
           const skip = (parseInt(pagination?.page) - 1) * parseInt(pagination?.limit);
           const db=await mongo();
           const [data,total]=await Promise.all([
            await db.collection("video_story").find(filter).skip(skip).limit(parseInt(pagination?.limit)).sort({createdAt:-1}).toArray(),
            await db.collection("video_story").countDocuments(filter),
           ])

            return {
            success: true,
            data,
            pagination: {
                total,
                page: parseInt(pagination?.page),
                limit: parseInt(pagination?.limit),
                totalPages: Math.ceil(total / parseInt(pagination?.limit)),
            },
            }
        }catch(error){
            throw error
        }
    },

    async updatePhotoStory(id,story) {
    try {
        const db = await mongo();
            const result = await db.collection("photo_story").updateOne(
            { _id: new ObjectId(id) },
            { $set: story }
            );
            return result; 
    } catch (err) {
        throw err;
    }
    },

    async updateNews(id,news,sign) {
    try {
        const db = await mongo();
        if (sign){
            const result = await db.collection("news").updateOne(
            { _id: new ObjectId(id) },
            { $set: news },
            {
                projection:{imagePublicId:1},
                returnDocument: "before", //  updated document return করবে
            }
            );
            return result; 
       }else{
            const result = await db.collection("news").updateOne(
            { _id: new ObjectId(id) },
            { $set: news },
            );
            return result;

       }
    } catch (err) {
        throw err;
    }
    },

    async updatePhoto_Story(id,news,sign) {
    try {
        const db = await mongo();
        if (sign){
            const result = await db.collection("video_story").updateOne(
            { _id: new ObjectId(id) },
            { $set: news },
            {
                projection:{videoPublicId:1},
                returnDocument: "before", //  updated document return করবে
            }
            );
            return result; 
       }else{
            const result = await db.collection("video_story").updateOne(
            { _id: new ObjectId(id) },
            { $set: news },
            );
            return result;

       }
    } catch (err) {
        throw err;
    }
    },

    async updateVideo(id,video) {
        try {
            const db = await mongo();

                const result = await db.collection("video").updateOne(
                { _id: new ObjectId(id) },
                { $set:video },
                );
                return result;

        } catch (err) {
            throw err;
        }
    },

  async updateContestStatus(id,status) {
    try {
        const db = await mongo();
        const result = await db.collection("contests").updateOne(
        { _id: new ObjectId(id) },
        { $set:{ status:status} }
        );

        return result; // full updated contest data
    } catch (err) {
        throw err;
    }
    },

  async updateUserRole(id,role) {
    try {
        const db = await mongo();
        const result = await db.collection("user_roles").updateOne(
        { _id: new ObjectId(id) },
        { $set:{role: role} }
        );

        return result; // full updated contest data
    } catch (err) {
        throw err;
    }
    },
    async getUser(filter,pagination){
        try{
           const skip = (parseInt(pagination?.page) - 1) * parseInt(pagination?.limit);
           const db=await mongo();
           const [data,total]=await Promise.all([
            await db.collection("user_roles").find(filter).skip(skip).limit(parseInt(pagination?.limit)).sort({createdAt:-1}).toArray(),
            await db.collection("user_roles").countDocuments(filter),
           ])

            return {
            success: true,
            data,
            pagination: {
                total,
                page: parseInt(pagination?.page),
                limit: parseInt(pagination?.limit),
                totalPages: Math.ceil(total / parseInt(pagination?.limit)),
            },
            }
        }catch(error){
            console.log("rrrr");
            
            throw error
        }
    },
  async getById(id,database){
        try {
            const db=await mongo();
            const result= await db.collection(database).findOne({_id:new ObjectId(id)}); 
            return {
                success: true,
                data:result,
                } 
        } catch (error) {
            throw error
        }
    },
   async delete(id,database){
        try{
            const db= await mongo();
            const result = await db.collection(database).deleteOne({
                _id:new ObjectId(id)
            },{projection:{imagePublicId:1},returnDocument:'before'});
            return result; 
        }catch(err){
            throw err;
        }    
    }

};

