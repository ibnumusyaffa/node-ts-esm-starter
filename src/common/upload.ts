/* eslint-disable unicorn/no-null */
import { randomUUID } from "node:crypto"
import multer from "multer"

const publicStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "storage/public")
  },
  filename: function (req, file, cb) {
    const customFileName = randomUUID() + "-" + file.originalname
    cb(null, customFileName)
  },
})

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "storage/app")
  },
  filename: function (req, file, cb) {
    const customFileName = randomUUID() + "-" + file.originalname
    cb(null, customFileName)
  },
})

export const upload = multer({ storage })
export const publicUpload = multer({ storage: publicStorage })
