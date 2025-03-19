import express from "express"
import fileUpload from "express-fileupload"

import { exec } from "child_process"

const uploadRoute = express.Router()

const FILE_UPLOAD_CFG = fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  useTempFiles : true,
  preserveExtension: true,
  safeFileNames: true,
  tempFileDir : '/tmp/'
})

uploadRoute.use(FILE_UPLOAD_CFG);

uploadRoute.post("/", async (req, res) => {
  const {file} = req.files || {};

  if(!file){
    res.status(422).send("No files were uploaded");
  }

  try {
    exec(`unoconvert ${file.tempFilePath} - --convert-to pdf`, (error, stdout, stderr) => {
      const err = error || stderr;
      res.send(stdout)
    });

  } catch (error) {
    res.status(500, error.message)
  }

});

export default uploadRoute;
