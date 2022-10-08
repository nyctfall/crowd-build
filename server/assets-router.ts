import express from "express"

const assetsRouter = express.Router()

// You can add other image formats
const imageRegex = /\/.+\.(svg|png|jpg|png|jpeg)$/
const videoRegex = /\/.+\.(mp4|ogv)$/

assetsRouter.get(imageRegex, (req, res) => {
  const filePath = req.path
  res.redirect(303, `http://localhost:5173/src${filePath}`)
})

assetsRouter.get(videoRegex, (req, res) => {
  const filePath = req.path
  res.redirect(303, `http://localhost:5173/src${filePath}`)
});

export { assetsRouter as router }