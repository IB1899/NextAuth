
import mongoose, { Schema, model } from "mongoose"
import validator from "validator"
import bcrypt from "bcrypt"

let { isEmail } = validator;

let AuthSchema = new Schema({

    name: {
        type: String,
        required: [true, "Please you must enter your name"],
    },

    email: {
        type: String,
        unique: true,
        required: [true, "Please you must enter your email"],

        validate: [isEmail, "Please enter a valid email"]
    },

    password: {
        type: String,
        minlength: [10, "The password must be more than 9 characters"], // only for strings
    },

    image: {
        type: String
    }

}, { timestamps: true })

AuthSchema.pre("save", async function (next) {

    let salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password!, salt);

    next()
})

export default mongoose.models.auth || model("auth", AuthSchema)
// export let User = model("user", AuthUsersSchema)

