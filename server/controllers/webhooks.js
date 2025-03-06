import { Webhook } from "svix";
import User from "../models/User.js";

//API Controller function to manage CLERK user with Database
export const clerkWebhooks = async (req, res) => {
    try {

        //Create a Sivix Instance with Clerk webhook Secret.
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        //Veryfing Headers
        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        })

        //Getting DAta from request body
        const { data, type } = req.body

        //Switch Case for different events
        switch (type) {
            case 'user.created': {
                const userData = {
                    _id:data.id,
                    email:data.email_address[0].email_address,
                    name:data.first_name + " " + data.last_name,
                    image: data.image_url,
                    resume: ''
                }
                await User.create(userData)
                req.json({})
                break;
            }
            case 'user.updated': {
                const userData = {
                    email:data.email_address[0].email_address,
                    name:data.first_name + " " + data.last_name,
                    image: data.image_url,
                }
                await User.findByIdAndUpdate(data.id, userData)
                req.json({})
                break;

            }
            case 'user.deleted': {
                await User.findByIdAndDelete(data.id)
                req.json({})
                break;

            }
            default:
                break;


        }

    } catch (error) {
        console.log(error.message);
        req.json({success:false, message:'Webhooks Error'})
    }
}