"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const assetsRouter = express_1.default.Router();
exports.router = assetsRouter;
const imageRegex = /\/.+\.(svg|png|jpg|png|jpeg)$/;
const videoRegex = /\/.+\.(mp4|ogv)$/;
assetsRouter.get(imageRegex, (req, res) => {
    const filePath = req.path;
    res.redirect(303, `http://localhost:5173/src${filePath}`);
});
assetsRouter.get(videoRegex, (req, res) => {
    const filePath = req.path;
    res.redirect(303, `http://localhost:5173/src${filePath}`);
});
//# sourceMappingURL=assets-router.js.map