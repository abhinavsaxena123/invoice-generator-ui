import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect, useContext, useState } from "react";
import {AppContext} from "../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

const UserSyncHandler = () => {

    const [synced, setSynced] = useState(false);

    // Clerk hooks to get auth and user data
    const {isLoaded, isSignedIn, getToken } = useAuth();
    const {user} = useUser();

    const {baseURL} = useContext(AppContext);

    // useEffect hook to run the sync logic
    useEffect(() => {
        const saveUser = async () => {
            // Prevent execution if:
            // - Clerk data isn't loaded yet
            // - User is not signed in
            // - User data has already been synced in this session
            if(!isLoaded || !isSignedIn || synced) {
                return;
            }

            try {
                // Get the JWT from Clerk for authorization
                const token = await getToken();

                // Prepare the user data object to send to the backend
                const userData = {
                    clerkId: user.id,  // Clerk's unique user ID
                    email: user.primaryEmailAddress.emailAddress,  // User's primary email
                    firstname: user.firstName,
                    lastName: user.lastName,
                    photoUrl: user.imageUrl
                }

                // Make a POST request to your backend's user endpoint
                await axios.post(baseURL+"/users", userData, {
                    headers: {
                        Authorization: `Bearer ${token}` // Attach the JWT for authentication
                        }
                    });
                
                // Set synced to true to prevent future runs in the same session
                setSynced(true);
                toast.success("User data synced successfully!");
            } catch(error) {
                console.error("User sync error:", error);
                if (axios.isAxiosError(error) && error.response) {
                    toast.error(`Failed to sync user data: ${error.response.data.message || error.response.statusText}`);
                } else {
                    toast.error("An unexpected error occurred during user sync.");
                }
                //toast.error(error.message);
            }
        }
        saveUser();   // Call the async function
    }, [isLoaded, isSignedIn, getToken, user, synced, baseURL]);  // Dependencies for useEffect

    return null;  // This component doesn't render anything visually
}

export default UserSyncHandler;