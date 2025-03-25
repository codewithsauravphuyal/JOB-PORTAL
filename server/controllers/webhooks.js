export const clerkWebhooks = async (req, res) => {
    try {
        if (!req.headers['svix-id'] || !req.headers['svix-signature']) {
            return res.status(400).json({ success: false, message: 'Missing required headers' });
        }

        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        const payload = JSON.stringify(req.body);
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        };

        const verified = whook.verify(payload, headers);
        if (!verified) {
            return res.status(401).json({ success: false, message: 'Invalid signature' });
        }

        const { data, type } = req.body;

        switch (type) {
            case 'user.created': {
                const email = data.email_addresses?.find(email => email.id === data.primary_email_address_id)?.email_address;
                if (!email) {
                    return res.status(400).json({ success: false, message: 'No email found' });
                }

                const userData = {
                    _id: data.id,
                    email: email,
                    name: `${data.first_name || ''} ${data.last_name || ''}`.trim(),
                    image: data.image_url,
                    resume: ''
                };

                await User.create(userData);
                console.log(`User created: ${userData._id}`);
                break;
            }
            case 'user.updated': {
                const userData = {
                    email:data.email_addresses[0].email_address,
                    name:data.first_name + " " + data.last_name,
                    image: data.image_url,
                }
                await User.findByIdAndUpdate(data.id, userData)
                res.json({})
                break;

            }
            case 'user.deleted': {
                await User.findByIdAndDelete(data.id)
                res.json({})
                break;

            }
            default:
                break;


        }

    } catch (error) {
        console.log(error.message);
        res.json({success:false, message:'Webhooks Error'})
    }
}