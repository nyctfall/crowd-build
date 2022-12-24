import express from "express"

const { VITE_PORT = 5173 } = process.env

/**
 * The vite dev server asset router Express Router.
 */
const assetsRouter = express.Router()

// from vite docs for custon backend server:
const imageRegex = /\/.+\.(svg|png|jpg|png|jpeg)$/

const videoRegex = /\/.+\.(mp4|ogv)$/

assetsRouter.get(imageRegex, (req, res) => {
  const filePath = req.path

  res.redirect(303, `http://localhost:${VITE_PORT}/src${filePath}`)
})

assetsRouter.get(videoRegex, (req, res) => {
  const filePath = req.path

  res.redirect(303, `http://localhost:${VITE_PORT}/src${filePath}`)
})

export { assetsRouter }
