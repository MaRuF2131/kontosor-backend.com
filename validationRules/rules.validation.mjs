import { isRequired, isValidNumber, isValidString,DangerousContentCheck, UrlValidationCheck } from "../utils/validation.mjs";
import validator from "validator";

export const newsRules = {
  reporter: [
    [(v) => isRequired(v), "Reporter is required"],
    [(v) => DangerousContentCheck(v, 2, 100), "Reporter contains invalid content"],
  ],

  title: [
    [(v) => isRequired(v), "Title is required"],
    [(v) => isValidString(v, 5, 300), "Title must be 5-200 characters"],
  ],

  description: [
    [(v) => isRequired(v), "Description is required"],
    [(v) => isValidString(v, 20, 50000), "Description must be 20-50000 characters"],
  ],

  category: [
    [(v) => isRequired(v), "Category is required"],
    [(v) => DangerousContentCheck(v, 2, 100), "Category contains invalid content"],
  ],

  subcategory: [
    [(v) => isRequired(v), "Subcategory is required"],
    [(v) => v === undefined || v === "" || DangerousContentCheck(v, 2, 100), "Subcategory contains invalid content"],
  ],

  locationType: [
    [(v) => isRequired(v), "Location type is required"],
    [(v) => ["bangladesh", "world"].includes(v), "Location type must be bangladesh or world"],
  ],

  country: [
          [
            (v, data) =>
              data.locationType === "world" ? isRequired(v) : true,
            "Country is required for world news",
          ],
          [
            (v, data) =>
              data.locationType === "world" ? DangerousContentCheck(v, 2, 100): true,
            "Country must be valid text",
          ],
  ],

    division: [
      [
        (v, data) =>
          data.locationType === "bangladesh" ? isRequired(v) : true,
        "Division is required for Bangladesh news",
      ],
      [
        (v, data) =>
          data.locationType !== "world" || DangerousContentCheck(v, 2, 100),
        "Division must be valid text",
      ],
    ],

    district: [
      [
        (v, data) =>
          data.locationType === "bangladesh" ? isRequired(v) : true,
        "District is required for Bangladesh news",
      ],
      [
        (v, data) =>
          data.locationType !== "world" || DangerousContentCheck(v, 2, 100),
        "District must be valid text",
      ],
    ],

    upazila: [
      [
        (v, data) =>
          data.locationType === "bangladesh" ? isRequired(v) : true,
        "Upazila is required for Bangladesh news",
      ],
      [
        (v, data) =>
          data.locationType !== "world" || DangerousContentCheck(v, 2, 100),
        "Upazila must be valid text",
      ],
    ],


  imageBy: [
    [(v) => isRequired(v), "Image credit is required"],
    [(v) => DangerousContentCheck(v, 2, 100), "Image credit contains invalid content"],
  ],

  status: [
    [(v) => isRequired(v), "Status is required"],
    [(v) => ["draft", "published"].includes(v), "Invalid status"],
  ],

  breaking: [
    [(v) =>  v === "true" ||  v === "false", "Breaking must be true or false"],
  ]
};

export const videoRules = {

  title: [
    [(v) => isRequired(v), "Title is required"],
    [(v) => isValidString(v, 5, 300), "Title must be 5-200 characters"],
  ],


  category: [
    [(v) => isRequired(v), "Category is required"],
    [(v) => DangerousContentCheck(v, 2, 100), "Category contains invalid content"],
  ],

  youtubeUrl:[
     [(v) => isRequired(v), "YoutubeUrl is required"],
     [(v) => UrlValidationCheck(v), "YoutubeUrl contains invalid content"],
  ],

  thumbnail:[
     [(v) => isRequired(v), "thumbnail is required"],
     [(v) => UrlValidationCheck(v), "thumbnail contains invalid content"],
  ],

  status: [
    [(v) => isRequired(v), "Status is required"],
    [(v) => ["draft", "published"].includes(v), "Invalid status"],
  ],
};

export const idParamRules = {
  id: [
    [(v) => validator.isMongoId(String(v)), "Invalid  ID"],
    [(v) => isRequired(v), " ID is required"],
    [(v) => isValidString(v,24,24), " ID must be 24 characters"]
  ],
};


export const listRules = {
  page: [
    [(v) =>  validator.isInt(String(v)), "Page must be number"],
    [(v) => isValidNumber(v, 1), "Page must be at least 1"],
  ],
  limit: [
    [(v) =>  validator.isInt(String(v)), "limit must be number"],
    [(v) => isValidNumber(v, 1,10), "limit must be at least 1"],
  ],
  search: [
    [(v) =>  DangerousContentCheck(v, 1, 255), "search is invalid"]
  ],
  status:[
     [(v) => DangerousContentCheck(v,1,500), "status is invalid"],
  ],

  category: [
    [(v) => DangerousContentCheck(v, 2, 100), "Category contains invalid content"],
  ],

  subcategory: [
    [(v) => DangerousContentCheck(v, 2, 100), "Subcategory contains invalid content"],
  ],

  locationType: [
    [(v) => DangerousContentCheck(v, 2, 100), "Location type must be bangladesh or world"],
  ],

  breaking: [
    [(v) =>  DangerousContentCheck(v, 2, 100), "Breaking must be true or false"],
  ]
};
