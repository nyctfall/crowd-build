"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assetsRouter = void 0;
const express_1 = __importDefault(require("express"));
const { VITE_PORT = 5173 } = process.env;
const assetsRouter = express_1.default.Router();
exports.assetsRouter = assetsRouter;
const imageRegex = /\/.+\.(svg|png|jpg|png|jpeg)$/;
const videoRegex = /\/.+\.(mp4|ogv)$/;
assetsRouter.get(imageRegex, (req, res) => {
    const filePath = req.path;
    res.redirect(303, `http://localhost:${VITE_PORT}/src${filePath}`);
});
assetsRouter.get(videoRegex, (req, res) => {
    const filePath = req.path;
    res.redirect(303, `http://localhost:${VITE_PORT}/src${filePath}`);
});
//# sourceMappingURL=assets-router.js.map