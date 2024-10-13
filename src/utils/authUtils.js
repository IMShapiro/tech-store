import { auth } from "../config/FirebaseConfig.js";
import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    updatePassword,
    updateEmail,
    sendPasswordResetEmail,
 } from "firebase/auth";

/**
 * Creates a new user with email and password.
 *
 * @param {string} email - The email address of the new user.
 * @param {string} password - The password for the new user.
 * @returns {Promise<void>}
 */

export let authError = '';

export const createUserWithPassword = async (email, password) => {
    try {
        await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
        authError = useAuthErrorHandler(error);
        console.log(error);
    }
};

/**
 * Signs up and signs in a user using Google popup.
 *
 * @returns {Promise<void>}
 */
export const signInWithGoogle = async () => {
    // Sign in using a popup.
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    const result = await signInWithPopup(auth, provider);

    // The signed-in user info.
    const user = result.user;
    // This gives you a Google Access Token.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
}

/**
 * Signs in a user with email and password.
 *
 * @param {string} email - The email address of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<void>}
 */

export const signInUserWithPassword = async (email, password) => {
    try{
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/")
    } catch (error) {
        console.error("Error signing in user: ", error);
        authError = useAuthErrorHandler(error);
        return useAuthErrorHandler(error)
    }
}

/**
 * Sends a password reset email to the specified email address.
 *
 * @param {string} email - The email address to send the password reset link to.
 * @returns {Promise<void>}
 */

export const sendPasswordResetLink = async (email) => {
    try{
        await sendPasswordResetEmail(auth, email)
    }catch(error){
        authError = useAuthErrorHandler(error);
    };
}

/**
 * Updates the password of the specified user.
 *
 * @param {firebase.User} user - The current user.
 * @param {string} newPassword - The new password to set.
 * @returns {Promise<void>}
 */

export const updateUserPassword = async (user, newPassword) => {
    try{
        await updatePassword(user, newPassword);
    }catch(error){
        authError = useAuthErrorHandler(error);
    }
}

/**
 * Updates the email of the recently logged in user
 * @param {firebase.User} user - The current user.
 * @param {string} newEmail - New email as a string.
*/
export const updateUserEmail = async (user, email) => {
    try {
        await updateEmail(user, email);
    } catch (error) {
        authError = useAuthErrorHandler(error);
    }
}

/**
 * Signs out the current user.
 *
 * @returns {Promise<void>}
 */

export const SignOutUser = async () => {
    await auth.signOut()
}

/**
 * Deletes the current user.
 *
 * @returns {Promise<void>}
 */

export const deleteUser = async () => {
    await auth.currentUser.delete()
}

/**
 * Return an error message based on Firebases error code 
 * @param {object} error Firebases error object
 * */
export const useAuthErrorHandler = (error) => {
    if (!error) return '';

    const errorCode = error.code;
    let errorMessage = '';

    switch (errorCode) {
        case 'auth/user-not-found':
            errorMessage = 'No user found with this email.';
            break;
        case 'auth/wrong-password':
            errorMessage = 'Incorrect password.';
            break;
        case 'auth/email-already-in-use':
            errorMessage = 'Email already attached to an account';
            break;
        case 'auth/invalid-email':
            errorMessage = 'Missing/Invalid email format.';
            break;
        case 'auth/invalid-credential':
            errorMessage = 'Invalid email or password. Please try again.';
            break;
        case 'auth/requires-recent-login':
            errorMessage = 'Updating your profile requires you to be recently logged in!';
            break;
        case 'auth/missing-password':
            errorMessage = 'Missing password!';
            break;
        default:
            errorMessage = 'An unknown error occurred.';
    }

    return errorMessage;
};