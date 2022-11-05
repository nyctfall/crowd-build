import mongoose, { Schema, Types } from "mongoose"


export interface UserType {
  username: string
  password: string
  lists?: Types.ObjectId[]
}

const UserSchema = new Schema<UserType>({
    username: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    lists: {
      type: [Types.ObjectId],
      required: false,
      ref: "List"
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
      byUsername(username: string){
        return this.where({ username: new RegExp(username, "ig") })
      }
    }
  }
)

const Users = mongoose.model<UserType>("User", UserSchema)
export default Users