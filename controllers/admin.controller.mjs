import { adminservice } from "../services/admin.service.mjs";
import { deleteFromCloudinary } from "../utils/CDN/cloudinaryUpload.mjs";

export const adminController = {

  async addNews(req,res) {
    try {
      const {
        breaking,
        status,
        imageBy,
        upazila,
        district,
        division,
        country,
        locationType,
        subcategory,
        category,
        description,
        title,
        reporter
      } = req.body;
        const info = {
        breaking,
        status,
        imageBy,
        upazila,
        district,
        division,
        country,
        locationType,
        subcategory,
        category,
        description,
        title,
        reporter,
        createdAt: new Date(),
      };
      if (req.imageData && req.imageData.secure_url) {
        info.imageUrl = req.imageData.secure_url;
        info.imagePublicId = req.imageData.public_id;
      }else{
        res.status(403).json({message:"Image is required"})
      }
      const news = await adminservice.createNews({
       ...info
      });

      res.status(201).json({
        success:true,
        data:news,
        message: "Successfully created news"
      });
    } catch (error) {
      console.log(error);     
      res
        .status(500)
        .json({ message: "Failed to create news", error });
    }
  },

  async addVideo(req,res) {
    try {
      const {
        status,
        category,
        title,
        thumbnail,
        youtubeUrl
      } = req.body;
        const info = {
        status,
        category,
        title,
        thumbnail,
        youtubeUrl,
        createdAt: new Date(),
      };
      const video = await adminservice.createVideo({
       ...info
      });

      res.status(201).json({
        success:true,
        data:video,
        message: "Successfully created video news"
      });
    } catch (error) {
      console.log(error);     
      res
        .status(500)
        .json({ message: "Failed to create video news", error });
    }
  },

  async addPhoto_story(req, res) {
      try {
        const { status} = req.body;
        let captions=[];
         console.log("body",req.body);

        if (Array.isArray(req.body?.captions)) {
            captions = req.body?.captions;
          } else if (req.imageData) {
            captions = [req.body?.captions];
          }
        //  fileCheck middleware থেকে আসা uploaded images
        let uploadedImages = [];

          if (Array.isArray(req.imageData)) {
            uploadedImages = req.imageData;
          } else if (req.imageData) {
            uploadedImages = [req.imageData];
          }

        if (!uploadedImages.length) {
          return res.status(400).json({
            success: false,
            message: "At least one image is required",
          });
        }

        //  image + caption match করা
        const finalImages = uploadedImages.map((img, index) => ({
          imageUrl: img.secure_url,
          imagePublicId: img.public_id,
          caption: captions[index] || "",
        }));

        const info = {
          status,
          images: finalImages,
          createdAt: new Date(),
        };

        const story = await adminservice.createPhotoStory(info);

        res.status(201).json({
          success: true,
          data: story,
          message: "Successfully created photo story",
        });

      } catch (error) {
        console.error(error);
        res.status(500).json({
          success: false,
          message: "Failed to create photo story",
          error: error.message,
        });
      }
    },

  async addVideo_story(req,res) {
    try {
      const {
        status,
        title,
      } = req.body;
        const info = {
        status,
        title,
        createdAt: new Date(),
      };

      if (req.videoData && req.videoData.secure_url) {
        info.videoUrl = req.videoData.secure_url;
        info.videoPublicId = req.videoData.public_id;
        info.videoDuration= req.videoData.duration
      }else{
        res.status(403).json({message:"video is required"})
      }
      const video = await adminservice.createVideoStory({
       ...info
      });

      res.status(201).json({
        success:true,
        data:video,
        message: "Successfully created video Story"
      });
    } catch (error) {
      console.log(error);     
      res
        .status(500)
        .json({ message: "Failed to create video story", error });
    }
  },

  // List / Paginated 
  async newslist(req, res) {
    try {
      const { status, category,subcategory,locationType,breaking,search, page, limit } = req.query;
      const filter={}
      if(category !='all'){
        filter.category=category
      }
      if(subcategory !='all'){
        filter.subcategory=subcategory
      }
      if(locationType !='all'){
        filter.locationType=locationType
      }
      if(status !=='all'){
        filter.status=status
      }
      if(breaking !=='all'){
        filter.breaking=breaking
      }
      if(search !=''){
      filter.$or = [
        { reporter: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
        { division: { $regex: search, $options: 'i' } },
        { district: { $regex: search, $options: 'i' } },
        { upazila: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
      ]
      }
      const news = await adminservice.getNews(
       filter,
       {
        page,
        limit
       }
      );

      res.status(201).json(news);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to fetch news", error });
    }
  },
  // List / Paginated 
  async videolist(req, res) {
    try {
      const { status, category,search, page, limit } = req.query;
      const filter={}
      if(category !='all'){
        filter.category=category
      }
      if(status !=='all'){
        filter.status=status
      }
      if(search !=''){
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
      ]
      }
      const video = await adminservice.getVideo(
       filter,
       {
        page,
        limit
       }
      );

      res.status(201).json(video);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to fetch video", error });
    }
  },

  // List / Paginated 
  async PhotoStorylist(req, res) {
    try {
      const { status,search, page, limit } = req.query;
      const filter={}
      if(status !=='all'){
        filter.status=status
      }
      if(search !=''){
      filter.$or = [
        { "images.caption": { $regex: search, $options: 'i' } },
      ]
      }
      const video = await adminservice.getPhotoStory(
       filter,
       {
        page,
        limit
       }
      );

      res.status(201).json(video);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to fetch video", error });
    }
  },

  // List / Paginated 
  async VideoStorylist(req, res) {
    try {
      const { status,search, page, limit } = req.query;
      const filter={}
      if(status !=='all'){
        filter.status=status
      }
      if(search !=''){
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
      ]
      }
      const video = await adminservice.getVideoStory(
       filter,
       {
        page,
        limit
       }
      );

      res.status(201).json(video);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to fetch video", error });
    }
  },

  async getSigle(req,res){
      try {
          const {id} =req.params;
          const {database}=req.query;
          console.log("id",id);
          const news = await adminservice.getById(
             id,database
           );
        console.log(news);
        res.status(201).json(news);
      } catch (error) {
        console.log(error);
        res
          .status(500)
          .json({ message: "Failed to fetch contest", error });
      }
  },

    // Update News
  async updateNews(req, res) {
    try {
      let sign=false;
      const { id } = req.params ;

      const {
        breaking,
        status,
        imageBy,
        upazila,
        district,
        division,
        country,
        locationType,
        subcategory,
        category,
        description,
        title,
        reporter
      } = req.body;
        const info = {
        breaking,
        status,
        imageBy,
        upazila,
        district,
        division,
        country,
        locationType,
        subcategory,
        category,
        description,
        title,
        reporter,
        updateddAt: new Date(),
      };
      if (req.imageData && req.imageData.secure_url) {
       sign=true;
       info.imageUrl = req.imageData.secure_url;
       info.imagePublicId = req.imageData.public_id;
     }
     console.log("info",info,"sign",sign);
     
      const updated = await adminservice.updateNews(id, {...info}, sign);
      console.log("update",updated);
      
      if(!updated.acknowledged){
        return res.status(404).json({ message: "No news found to update" });
      }

      if(updated?.imagePublicId){
        try {
          await deleteFromCloudinary(updated?.imagePublicId);
          console.log(`🗑️ Cloudinary image deleted for product:`, updated?.imagePublicId);
        } catch (cloudErr) {
          console.error("⚠️ Cloudinary delete error:", cloudErr.message);
        }
      }

      res.status(201).json({
        success:true,
        data:updated,
        message: "Successfully update news"
      });
    } catch (error) {
      console.log(error);
      
      res
        .status(500)
        .json({ message: "Failed to update contest", error });
    }
  },

    // Update Video Story
  async updateVideo_Story(req, res) {
    try {
      let sign=false;
      const { id } = req.params ;

      const {
        status,
        title
      } = req.body;
        const info = {
        status,
        title,
        updateddAt: new Date(),
      };
      if (req.videoData && req.videoData.secure_url) {
        info.videoUrl = req.videoData.secure_url;
        info.videoPublicId = req.videoData.public_id;
        info.videoDuration= req.videoData.duration;
        sign=true;
      }
     console.log("info",info,"sign",sign);
     
      const updated = await adminservice.updatePhoto_Story(id, {...info}, sign);
      console.log("update",updated);
      
      if(!updated.acknowledged){
        return res.status(404).json({ message: "No video story found to update" });
      }

      if(updated?.videoPublicId){
        try {
          await deleteFromCloudinary(updated?.videoPublicId);
          console.log(`🗑️ Cloudinary image deleted for product:`, updated?.videoPublicId);
        } catch (cloudErr) {
          console.error("⚠️ Cloudinary delete error:", cloudErr.message);
        }
      }

      res.status(201).json({
        success:true,
        data:updated,
        message: "Successfully update video story"
      });
    } catch (error) {
      console.log(error);
      
      res
        .status(500)
        .json({ message: "Failed to update video story", error });
    }
  },

  // update video
  async updateVideo(req,res) {
    try {
      const {
        status,
        category,
        title,
        thumbnail,
        youtubeUrl
      } = req.body;
        const info = {
        status,
        category,
        title,
        thumbnail,
        youtubeUrl,
        updatedAt: new Date(),
      };
      const { id } = req.params ;
      const video = await adminservice.updateVideo(id,{
       ...info
      });

      res.status(201).json({
        success:true,
        data:video,
        message: "Successfully update video news"
      });
    } catch (error) {
      console.log(error);     
      res
        .status(500)
        .json({ message: "Failed to update video news", error });
    }
  },

    // Update Photo Story
  async updatePhoto_Story(req, res) {
      try {

        const { status } = req.body;
        
        //  Existing Images (frontend থেকে JSON string)
        let existingImages = [];
        if (req.body.existingImages) {
          existingImages = JSON.parse(req.body.existingImages);
        }


        //  New Uploaded Images
        let uploadedImages = [];
        if (Array.isArray(req.imageData)) {
          uploadedImages = req.imageData;
        } else if (req.imageData) {
          uploadedImages = [req.imageData];
        }

        //  Captions for new images
        let captions = [];
        if (Array.isArray(req.body?.captions)) {
          captions = req.body.captions;
        } else if (req.body?.captions) {
          captions = [req.body.captions];
        }


        //  Format New Images
        const newImages = uploadedImages.map((img, index) => ({
          imageUrl: img.secure_url,
          imagePublicId: img.public_id,
          caption: captions[index] || "",
        }));

        //  Combine old + new
        const finalImages = [...existingImages, ...newImages];

        if (!finalImages.length) {
          return res.status(400).json({
            success: false,
            message: "At least one image is required",
          });
        }
     
        //  Get old data from DB
        const oldData = await adminservice.getById(req.params.id,"photo_story");
        console.log("kkkkk",oldData);
        const oldPublicIds = oldData?.data?.images.map(img => img.imagePublicId);
        console.log("mmmmmmmmmm");

        // Detect deleted images
        const remainingPublicIds = existingImages.map(img => img.imagePublicId);

        const deletedPublicIds = oldPublicIds.filter(
          id => !remainingPublicIds.includes(id)
        );
       
        console.log("jddjhjsdhjshjhs",existingImages,finalImages,deletedPublicIds,oldData);
        //  Update DB
        await adminservice.updatePhotoStory(req.params.id, {
          status,
          images: finalImages,
          updatedAt: new Date(),
        });

        //  Delete removed images from Cloudinary
        for (const id of deletedPublicIds) {
          try {
            await deleteFromCloudinary(id);
            console.log("Deleted:", id);
          } catch (err) {
            console.log("Cloud delete error:", err.message);
          }
        }

        res.status(200).json({
          success: true,
          changedImagePublicIds: newImages.map(img => img.imagePublicId), //  only new ones
          message: "Successfully updated photo story",
        });

      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Failed to update photo story",
          error: error.message,
        });
      }
    },
  // List / Paginated 
  async Userlist(req, res) {
    try {
      const { type,search, page, limit } = req.query;
      const filter={}
      if(type !=='admin' && type !=='user' && type !=='creator' && type !=='all'){
         return res.status(401).json({message:"Invalid Role"})
      }
      if(type !='all'){
        filter.role=type
      }
      if(search !=''){
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ]
      }
      const user = await adminservice.getUser(
       filter,
       {
        page,
        limit
       }
      );
      console.log("user",user);
      
      res.status(200).json(user);
    } catch (error) {
      console.log("error",error);
      
      res
        .status(500)
        .json({ message: "Failed to fetch contest", error });
    }
  },

  // Update user role
  async updateRole(req, res) {
    try {
      const { id } = req.params ;
      const {role}=req.body;
      console.log("role",role);
      
      if(role!='user' && role!='creator' && role!='admin'){
       return res.status(403).json({ message: 'Invalid role' });
      }
      const updated = await adminservice.updateUserRole(id, role);
      if(!updated){
        return res.status(403).json({message:"Faild to update"})
      }
      res.status(201).json({
        success:true,
        data:updated,
        message: "Successfully update user role"
      });
    } catch (error) {
      console.log("rr",error);
      
      res
        .status(500)
        .json({ message: "Failed to update user role", error });
    }
  },
  // Update contest status
  async updateStatus(req, res) {
    try {
      const { id } = req.params ;
      const {status}=req.body;
      if(status!='Confirmed' && status!='Rejected'){
       return res.status(403).json({ message: 'Invalid status' });
      }
      const updated = await adminservice.updateContestStatus(id, status);
      if(!updated){
        return res.status(403).json({message:"Faild to update"})
      }
      res.status(201).json({
        success:true,
        data:updated,
        message: "Successfully update contest status"
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Failed to update contest status", error });
    }
  },
    // Delete contest
  async remove(req, res) {
      const {database}=req.query;
      try {
        const { id } = req.params;
        console.log("database",req.query,database);
        
        const result=  await adminservice.delete(id,database);
        console.log("ress",result);
        
              if(!result){
                return res.status(404).json({ message: `${database} not found` });
              }
              if(result?.imagePublicId){
                try {
                  await deleteFromCloudinary(result?.imagePublicId);
                  console.log(`🗑️ Cloudinary image deleted for product:`, result?.imagePublicId);
                } catch (cloudErr) {
                  console.error("⚠️ Cloudinary delete error:", cloudErr.message);
                }
              }
              res.status(200).json({ message: `${database} deleted` });
      } catch (error) {
        console.log("error",error);
        
        res
          .status(500)
          .json({ message: `Failed to delete ${database}`, error });
      }
    },
};
