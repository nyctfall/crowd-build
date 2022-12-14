import mongoose, { Types, Schema, Model, Query, Document } from "mongoose"


export interface UserType {
  username: string
  password: string
  lists?: Types.ObjectId[]
}

export interface UserTypeQueryHelpers {
  byUsername(username: string): Query<any, Document<UserType>> & UserTypeQueryHelpers
}


const UserSchema = new Schema<UserType, Model<UserType, UserTypeQueryHelpers>>({
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


const Users = mongoose.model<UserType, Model<UserType, UserTypeQueryHelpers>>("User", UserSchema)


export default Users