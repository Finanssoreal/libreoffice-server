import express from "express"
import fileUpload from "express-fileupload"

import { exec } from "child_process"

const uploadRoute = express.Router()

const FILE_UPLOAD_CFG = fileUpload({
  abortOnLimit: true,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB max
  preserveExtension: true,
  safeFileNames: true,
  useTempFiles : true,
})

uploadRoute.use(FILE_UPLOAD_CFG);

uploadRoute.post("/", async (req, res) => {
  const {file} = req.files || {};

  if(!file){
    res.status(422).send("The file key is not present");
  }

  try {
    exec(`unoconvert ${file.tempFilePath} - --convert-to pdf`,{encoding: 'binary', maxBuffer: 10000*1024}, (error, stdout, stderr) => {
      const err = error || stderr;

      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Length': stdout.length
      });

      res.end(Buffer.from(stdout, 'binary'));
    });
  } catch (error) {
    res.status(500, error.message)
  }

});

export default uploadRoute;
