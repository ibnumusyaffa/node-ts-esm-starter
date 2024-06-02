import { randomUUID } from "crypto"
import multer from "multer"

const publicStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "storage/public")
  },
  filename: (req, file, cb) => {
    const customFileName = randomUUID() + "-" + file.originalname
    cb(null, customFileName)
  },
})

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "storage/app")
  },
  filename: (req, file, cb) => {
    const customFileName = randomUUID() + "-" + file.originalname
    cb(null, customFileName)
  },
})

export const upload = multer({ storage })
export const publicUpload = multer({ storage: publicStorage })
