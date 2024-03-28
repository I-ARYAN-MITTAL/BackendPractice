import { asyncHandler } from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
// import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
const registerUser = asyncHandler( async (req,res)=>{
   
    const {fullName,email,password,username} = req.body

    if (
        [fullName,email,password,username].some((field)=>
            field?.trim() ===""
        )
    ) {
        throw new ApiError(400,"all fields are required")
    }
    const existedUser = await User.findOne({
        $or:[{username},{email}]
    }
    )
    
    if(existedUser){
        throw new ApiError(409,"Email or UserName is already in use")
    }

    // const avatarImageLocalPath= req.files?.avatar[0]?.path;
    // const coverImageLocalPath= req.files?.coverImage[0]?.path;

    // if (!avatarImageLocalPath) {
    //     throw new ApiError(400,"avatar is required")
    // }
    // const avatar = await uploadOnCloudinary(avatarImageLocalPath);
    // const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    // if (!avatar) {
    //     throw new ApiError(400,"avatar is required")
    // }

    const user = await User.create({
        fullName,
        // avatar:avatar.url,
        // coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500,"Something went wrong while registering a user")
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"user registered successfully")
    )
})



export {registerUser}