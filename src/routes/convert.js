import express from "express"
import fileUpload from "express-fileupload"
import { execPromise } from "../utils/misc.js";

const uploadRoute = express.Router()

const FILE_UPLOAD_CFG = fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  useTempFiles : true,
  tempFileDir : '/tmp/'
})

uploadRoute.use(FILE_UPLOAD_CFG);

uploadRoute.post("/", async (req, res) => {
  const {file} = req.files || {};

  if(!file){
    return res.status(422).send("No files were uploaded");
  }

  const result = await execPromise("ls -la /tmp");

  res.send(result)
});

export default uploadRoute;
