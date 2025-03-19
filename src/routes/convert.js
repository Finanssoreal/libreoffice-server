import express from "express"
import fileUpload from "express-fileupload"
import { execPromise } from "../utils/misc"

const uploadRoute = express.Router()

const MAX_BUFFER_SIZE = 15 * 1024 * 1024

const FILE_UPLOAD_CFG = fileUpload({
  abortOnLimit: true,
  limits: { fileSize: MAX_BUFFER_SIZE },
  preserveExtension: true,
  safeFileNames: true,
  useTempFiles: true,
})

uploadRoute.use(FILE_UPLOAD_CFG)

uploadRoute.post("/", async (req, res) => {
  const { file } = req.files || {}

  if (!file) {
    res.status(422).send("The file key is not present in the request")
  }

  try {
    const { stdout, stderr } = await execPromise(
      `unoconvert ${file.tempFilePath} - --convert-to pdf`,
      { encoding: "binary", maxBuffer: MAX_BUFFER_SIZE },
    )

    res.writeHead(200, {
      "Content-Type": "application/pdf",
      "Content-Length": stdout.length,
    })
    res.end(Buffer.from(stdout, "binary"))
  } catch (error) {
    res.status(500, error.message)
  }
})

export default uploadRoute
