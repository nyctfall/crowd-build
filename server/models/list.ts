import mongoose, { Schema, Types } from "mongoose"
import { PCPartType } from "../../types/api"

export interface ListType {
  parts: Types.ObjectId[] | undefined
  user?: Types.ObjectId
}


const ListSchema = new Schema<ListType>({
    parts: {
      type: [Types.ObjectId],
      required: true,
      default: undefined,
      ref: "Part"
    },
    /* totalPrice: {
      type: String,
      required: true
    }, */
    user: {
      type: Types.ObjectId,
      required: false,
      ref: "User"
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
      byType(type: PCPartType){
        return this.where({ parts: { type: new RegExp(type, "ig") } })
      }
    }
  }
)

const List = mongoose.model<ListType>("List", ListSchema)
export default List