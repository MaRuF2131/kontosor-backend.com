import { ObjectId } from "mongodb";
import {AllUserservice} from "../services/Alluser.service.mjs";

export const AllUserController = {
  // List / Paginated 
  async list(req, res) {
    try {
      const {  id,database,category,subcategory,division,distic,upozila, page, limit } = req.query;
      const filter={}
      console.log("qurey",database);
      
      if(id) filter._id=new ObjectId(id);
      if(database){
        filter.database=database
      }else{
        res.status(400).json({message:"Database is required"})
        return;
      }
      if(category) filter.category=category.normalize("NFC");
      if(subcategory) filter.subcategory=subcategory.normalize("NFC");
         
      if(division) filter.division=division.normalize("NFC");
      if(distic) filter.distic=distic.normalize("NFC");
      if(upozila) filter.upozila=upozila.normalize("NFC");
      const srt={createdAt:-1}
      const news = await AllUserservice.getNews(
       filter,
       srt,
       {
        page,
        limit,
       }
      );

      res.status(201).json(news);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Failed to fetch news", error });
    }
  },

/*   async getSigle(req,res){
      try {
          const {id} =req.params;
          console.log("id",id);
          const contest = await AllUserservice.getById(
             id
           );
        console.log(contest);
        res.status(201).json(contest);
      } catch (error) {
        console.log(error);
        res
          .status(500)
          .json({ message: "Failed to fetch contest", error });
      }
  } */
};
