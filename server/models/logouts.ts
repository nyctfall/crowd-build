import mongoose, { Schema } from "mongoose"


export interface TokenLogoutType {
  token: String
  expireAt: Date
}


const LogoutSchema = new Schema<TokenLogoutType>({
    token: {
      type: String,
      required: true,
      default: undefined
    },
    // auto delete at expire time:
    expireAt: {
      type: Date,
      expires: 0
    }
  },
  {
    expireAfterSeconds: 0,
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
    }
  }
)

const Logouts = mongoose.model<TokenLogoutType>("Logouts", LogoutSchema)


export default Logouts