import mongoose, { ObjectId, Schema } from "mongoose"
import { PCPartInfo, PCPartType } from "../../types/api"

const PartSchema = new Schema({
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
  } as Record<keyof PCPartInfo | string, any>,
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


const Part = mongoose.model("Part", PartSchema)
export default Part