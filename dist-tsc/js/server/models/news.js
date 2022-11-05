"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const NewsSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: false
    },
    content: {
        type: String,
        required: false
    },
    createdAt: {
        type: String,
        required: true
    },
    updatedAt: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    toObject: {
        transform(_doc, ret) {
            if ("__v" in ret)
                delete ret.__v;
            return ret;
        }
    },
    toJSON: {
        transform(_doc, ret) {
            if ("__v" in ret)
                delete ret.__v;
            return ret;
        }
    },
    query: {
        byId(id) {
            if (!Array.isArray(id))
                return this.find({ _id: id });
            return this.find({ _id: { $in: id.flat(Infinity) } });
        },
        byTitle(title) {
            return this.find({ title: new RegExp(title, "ig") });
        },
        byContent(content) {
            return this.find({ content: new RegExp(content, "ig") });
        },
        byLink(link) {
            return this.find({ link: new RegExp(link, "ig") });
        },
        byCreatedBefore(maxDate) {
            return this.find({ createdAt: { $lte: new Date(maxDate) } });
        },
        byCreatedAfter(minDate) {
            return this.find({ createdAt: { $gte: new Date(minDate) } });
        },
        byUpdatedBefore(maxDate) {
            return this.find({ updatedAt: { $lte: new Date(maxDate) } });
        },
        byUpdatedAfter(minDate) {
            return this.find({ updatedAt: { $gte: new Date(minDate) } });
        },
    }
});
const News = mongoose_1.default.model("News", NewsSchema);
exports.default = News;
//# sourceMappingURL=news.js.map