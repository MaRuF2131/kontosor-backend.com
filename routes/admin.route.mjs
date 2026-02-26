import express from "express";
import { adminController } from "../controllers/admin.controller.mjs";
import { validateRequest } from "../middlewares/validate.middleware.mjs";

import {
  idParamRules,
  listRules,
  newsRules,
  videoRules
} from "../validationRules/rules.validation.mjs";
import verifyJWT from "../middlewares/auth.middleware.mjs";
import rolecheck from "../utils/Rolecheck.mjs";
import { upload } from "../utils/uploadConfig.mjs";
import {fileCheck} from '../utils/filecheck.mjs'
import { videoCheck } from "../utils/videoProcess/videoCheck.mjs";

const router = express.Router();
//middleware to protect routes
/* router.use(verifyJWT);
router.use(rolecheck)
router.use(async (req, res, next) => {
  if (req.role !== 'admin') {
    return res.status(403).json({ message: 'Only admin can access this route' });
  }
  next();
}); */

// add news
router.post(
  "/news",
  upload.single("image"),
  validateRequest(newsRules),
  fileCheck("news"),
  adminController.addNews
);

// add video
router.post(
  "/video",
  upload.none(),
  validateRequest(videoRules),
  adminController.addVideo
);

// add photo-story
router.post(
  "/photo_story",
  upload.array("images",20),
  fileCheck("photo_story"),
  adminController.addPhoto_story
);

// add video story
 router.post(
  "/video_story",
   upload.single("video"),
   videoCheck("video_story"), 
  adminController.addVideo_story
);

// add video story
 router.put(
  "/video_story/:id",
   upload.single("video"),
   videoCheck("video_story"), 
  adminController.updateVideo_Story
);

// update photo-story
router.put(
  "/photo_story/:id",
   upload.array("images",20),
   fileCheck("photo_story"),
   adminController.updatePhoto_Story
);
// get photo-story
router.get(
  "/photo_story",
  validateRequest(listRules),
  adminController.PhotoStorylist
);

// get video-story
router.get(
  "/video_story",
  validateRequest(listRules),
  adminController.VideoStorylist
);

// update news
router.put(
  "/news/:id",
  upload.single("image"),
  validateRequest({...idParamRules,...newsRules}),
  fileCheck("news"),
  adminController.updateNews
);
// update video
router.put(
  "/video/:id",
  upload.none(),
  validateRequest({...idParamRules,...videoRules}),
  adminController.updateVideo
);

// LIST  + PAGINATION
router.get(
  "/news",
  validateRequest(listRules),
  adminController.newslist
);

// LIST  + PAGINATION
router.get(
  "/video",
  validateRequest(listRules),
  adminController.videolist
);
// get element id
router.get(
  "/news/getbyid/:id",
   validateRequest(idParamRules),
   adminController.getSigle
);

/* // LIST  + PAGINATION
router.get(
  "/get/user",
  validateRequest(listRules),
  adminController.Userlist
);

// UPDATE 
router.patch(
  "/contest/:id",
  validateRequest(idParamRules),
  adminController.updateStatus
);
// UPDATE 
router.patch(
  "/user/:id",
  validateRequest(idParamRules),
  adminController.updateRole
); */

// DELETE 
router.delete(
  "/:id",
  validateRequest(idParamRules),
  adminController.remove
);


export default router;
