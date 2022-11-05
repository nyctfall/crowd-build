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
const api_1 = require("../../types/api");
const PartSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: false
    },
    model: {
        type: String,
        required: true
    },
    oem: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: Object.values(api_1.PCPartType),
        required: true
    },
    typeInfo: {
        type: Map,
        of: String,
        required: false
    },
    MSRP: {
        type: Number,
        required: true
    },
    img: {
        type: String,
        required: false
    },
    released: {
        type: Date,
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
        byName(name) {
            return this.find({ name: new RegExp(name, "ig") });
        },
        byModel(model) {
            if (!Array.isArray(model))
                return this.find({ model: new RegExp(model, "ig") });
            return this.find({ model: { $in: model.flat(Infinity) } });
        },
        byOEM(oem) {
            if (!Array.isArray(oem))
                return this.find({ oem: oem });
            return this.find({ oem: { $in: oem.flat(Infinity) } });
        },
        byType(type) {
            if (!Array.isArray(type))
                return this.find({ type: type });
            return this.find({ type: { $in: type.flat(Infinity) } });
        },
        byMaxPrice(maxPrice) {
            return this.find({ MSRP: { $lte: maxPrice } });
        },
        byMinPrice(minPrice) {
            return this.find({ MSRP: { $gte: minPrice } });
        },
        byReleasedBefore(maxDate) {
            return this.find({ released: { $lte: new Date(maxDate) } });
        },
        byReleasedAfter(minDate) {
            return this.find({ released: { $gte: new Date(minDate) } });
        },
        byTypeInfo(info) {
            return this.find({ typeInfo: info });
        }
    }
});
const Part = mongoose_1.default.model("Part", PartSchema);
exports.default = Part;
//# sourceMappingURL=part.js.map