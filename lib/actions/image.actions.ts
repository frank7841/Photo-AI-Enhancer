"use server"

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/mongoose"
import { handleError } from "../utils"
import User from "../database/models/user.model";
import { error } from "console";
import Image from "../database/models/image.model";
import { redirect } from "next/navigation";

const populateUser = (query:any)=> query.populate({
    path:'author',
    model:User,
    select: '_Id firstName lastName'
})

export async function addImage({image, userId, path}:AddImageParams){
    try {
        await connectToDatabase();
        const author = await User.findById(userId);
        if(!author){
            throw new Error("User not found");
        }
        const newImage = await Image.create({
            ...image,
            author:author._Id
        })

        revalidatePath(path);
        return JSON.parse(JSON.stringify(newImage))
        
    } catch (error) {
        handleError(error)
        
    }

}
export async function updateImage({image, userId, path}:UpdateImageParams){
    try {
        await connectToDatabase();
        const imageToUpdate =  await Image.findById(image._id);
        if(!imageToUpdate || imageToUpdate.author.toHexString()!== userId){
            throw new Error("Image not found or Unauthorised");
        }
        const updatedImage = await Image.findByIdAndUpdate(imageToUpdate._Id,image, {new:true})


        revalidatePath(path);
        return JSON.parse(JSON.stringify(updatedImage))
        
    } catch (error) {
        handleError(error)
        
    }

}
export async function deleteImage(imageId: string){
    try {
        await connectToDatabase();
        await Image.findByIdAndDelete(imageId)
        redirect('/');
        
    } catch (error) {
        handleError(error)
        
    }

}
export async function getImageById(imageId:string){
    try {
        await connectToDatabase();
        const image = await populateUser(Image.findById(imageId));
        if(!image){
            throw new Error('Image not found')
        }
        return JSON.parse(JSON.stringify(image))
        
    } catch (error) {
        handleError(error)
        
    }

}