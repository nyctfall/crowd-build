import mongoose, { ObjectId, Schema, Model, Query, Document } from "mongoose"
import { PCPartInfo, PCPartType } from "~types/api"


export interface PCPartInfoQueryHelpers {
  byId(id: ObjectId | string | ObjectId[] | string[]): Query<any, Document<PCPartInfo>> & PCPartInfoQueryHelpers
  byName(name: string): Query<any, Document<PCPartInfo>> & PCPartInfoQueryHelpers
  byModel(model: string | string[] | RegExp | RegExp[]): Query<any, Document<PCPartInfo>> & PCPartInfoQueryHelpers
  byOEM(oem: string | string[]): Query<any, Document<PCPartInfo>> & PCPartInfoQueryHelpers
  byType(type: PCPartType): Query<any, Document<PCPartInfo>> & PCPartInfoQueryHelpers
  byMaxPrice(maxPrice: string | number | Schema.Types.Decimal128 | Schema.Types.Number): Query<any, Document<PCPartInfo>> & PCPartInfoQueryHelpers
  byMinPrice(minPrice: string | number | Schema.Types.Decimal128 | Schema.Types.Number): Query<any, Document<PCPartInfo>> & PCPartInfoQueryHelpers
  byReleasedBefore(maxDate: Date | string): Query<any, Document<PCPartInfo>> & PCPartInfoQueryHelpers
  byReleasedAfter(minDate: Date | string): Query<any, Document<PCPartInfo>> & PCPartInfoQueryHelpers
  byTypeInfo(info: Record<string | number, any>): Query<any, Document<PCPartInfo>> & PCPartInfoQueryHelpers
}


const PartSchema = new Schema<PCPartInfo, Model<PCPartInfo, PCPartInfoQueryHelpers>>({
    // name could be substituted with `${model} ${oem}`:
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
      enum: Object.values(PCPartType),
      required: true
    },
    // just extra info about centain more complex parts:
    typeInfo: {
      type: Map,
      of: String,
      required: false
    },
    MSRP: {
      type: Number,
      required: true
    },
    // just substitute with oem logo?
    img: {
      type: String,
      required: false
    },
    // or just substitute with "TBD"?...
    released: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true,
    toObject: {
      transform(_doc, ret){
        // don't set __v in plain objects:
        if ("__v" in ret) delete ret.__v
        
        return ret
      }
    },
    toJSON: {
      transform(_doc, ret){
        // don't send __v in JSON:
        if ("__v" in ret) delete ret.__v
        
        return ret
      }
    },
    query: {
      byId(id: ObjectId | string | ObjectId[] | string[]){
        if (!Array.isArray(id)) return this.find({ _id: id })
        return this.find({ _id: { $in: id.flat(Infinity) } })
      },
      byName(name: string){
        return this.find({ name: new RegExp(name, "ig") })
      },
      byModel(model: string | string[] | RegExp | RegExp[]){
        if (!Array.isArray(model)) return this.find({ model: new RegExp(model, "ig") })
        return this.find({ model: { $in: model.flat(Infinity) } })
      },
      byOEM(oem: string | string[]){
        if (!Array.isArray(oem)) return this.find({ oem: oem })
        return this.find({ oem: { $in: oem.flat(Infinity) } })
      },
      byType(type: PCPartType){
        if (!Array.isArray(type)) return this.find({ type: type })
        return this.find({ type: { $in: type.flat(Infinity) } })
      },
      byMaxPrice(maxPrice: string | number | Schema.Types.Decimal128 | Schema.Types.Number){
        return this.find({ MSRP: { $lte: maxPrice } })
      },
      byMinPrice(minPrice: string | number | Schema.Types.Decimal128 | Schema.Types.Number){
        return this.find({ MSRP: { $gte: minPrice } })
      },
      byReleasedBefore(maxDate: Date | string){
        return this.find({ released: { $lte: new Date(maxDate) } })
      },
      byReleasedAfter(minDate: Date | string){
        return this.find({ released: { $gte: new Date(minDate) } })
      },
      byTypeInfo(info: Record<string | number, any>){
        return this.find({ typeInfo: info })
      }
    }
  }
)


const Part = mongoose.model<PCPartInfo, Model<PCPartInfo, PCPartInfoQueryHelpers>>("Part", PartSchema)


export default Part