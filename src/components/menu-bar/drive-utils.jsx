
import Swal from 'sweetalert2';

// utilities/googleDriveUtils.js
export const loadGoogleApis = (onGoogleApiLoaded) => {
    const gisScript = document.createElement('script');
    gisScript.src = "https://accounts.google.com/gsi/client";
    gisScript.onload = () => {
        console.log("Google Identity Services loaded.");

        // Check if we already have an access token stored
        const storedAccessToken = localStorage.getItem('googleAccessToken');
        const tokenExpiry = localStorage.getItem('googleTokenExpiry');
        const now = new Date().getTime();

        if (now < tokenExpiry && storedAccessToken) {
            console.log("Using stored access token.");
            onGoogleApiLoaded(storedAccessToken);
            return;
        } else {
            // Initialize token client only if we do not have a stored token
            window.google.accounts.oauth2.initTokenClient({
                client_id: '313123590702-lb7fjsbbqt83t3ljocvpf5la58uqmir4.apps.googleusercontent.com',
                scope: 'https://www.googleapis.com/auth/drive',
                callback: (response) => {
                    if (response.error) {
                        console.error('Error fetching access token:', response.error);
                        return;
                    }
                    if (response.access_token) {
                        const expiresAt = new Date().getTime() + response.expires_in * 1000;

                        localStorage.setItem('googleAccessToken', response.access_token);
                        localStorage.setItem('googleTokenExpiry', expiresAt);
                    } // Store the access token
                    onGoogleApiLoaded(response.access_token);
                },
            }).requestAccessToken({ prompt: 'select_account' });
        }
    };

    document.body.appendChild(gisScript);

    // Load the Google API client library and the Google Drive API
    const apiScript = document.createElement('script');
    apiScript.src = "https://apis.google.com/js/api.js";
    apiScript.onload = () => {
        console.log("Google API client loaded.");
        window.gapi.load('client', () => {
            initializeGapiClient();
        });
    };
    document.body.appendChild(apiScript);
};

const initializeGapiClient = async () => {
    try {
        await window.gapi.client.load('https://www.googleapis.com/discovery/v1/apis/drive/v3/rest');
        console.log("Drive API loaded.");
    } catch (error) {
        console.error("Error loading the Google Drive API:", error);
    }
};

const findFileByName = async (fileName, accessToken) => {
    const response = await fetch(`https://www.googleapis.com/drive/v3/files?q=name='${fileName}' and trashed=false`, {
        headers: new Headers({ 'Authorization': 'Bearer ' + accessToken })
    });
    const result = await response.json();
    return result.files.length > 0 ? result.files[0] : null; // returns the first found file or null
};

const shareFileWithUser = async (fileId, email, accessToken) => {
    const body = {
        role: 'writer', // Change to 'reader' if you want to give read-only access
        type: 'user',
        emailAddress: email
    };

    try {
        const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions?sendNotificationEmail=false`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error('Failed to share file: ' + response.statusText);
        }

        console.log(`File shared with ${email}`);
    } catch (error) {
        console.error('Error sharing file:', error);
    }
};

export const uploadFileToGoogleDrive = async (blob, fileName, accessToken, onSuccess, onError) => {
    try {

               // Show loading modal before starting the upload
               Swal.fire({
                title: 'Saving...',
                text: `Please wait while we save ${fileName} to Google Drive.`,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

        const existingFile = await findFileByName(fileName, accessToken);

        const metadata = {
            name: fileName,
            mimeType: 'application/octet-stream'
        };
        const form = new FormData();
        form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
        form.append('file', blob);

        let url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
        let method = 'POST';

        // If file exists, modify URL to update the file
        if (existingFile) {
            url = `https://www.googleapis.com/upload/drive/v3/files/${existingFile.id}?uploadType=multipart`;
            method = 'PATCH'; // Use PATCH to update the existing file
        }

        const response = await fetch(url, {
            method: method,
            headers: new Headers({ 'Authorization': 'Bearer ' + accessToken }),
            body: form,
        });
        const result = await response.json();
        if (response.ok) {
            await shareFileWithUser(result.id, 'john.limpiada@felice.ed.jp', accessToken); // Share the file with the specified email
            onSuccess(result);
                        Swal.close();

                        // Use SweetAlert2 to display a success message
                        Swal.fire({
                            icon: 'success',
                            title: `${fileName} has been successfully saved.`,
                            confirmButtonColor: '#4CAF50',
                            confirmButtonText: 'Okay',
                            background: 'white',
                            iconColor: '#4CAF50',
                            customClass: {
                                title: 'text-green-500',
                                content: 'text-gray-800',
                            },
                        });
        } else {
            throw new Error(result.error.message);
        }
    } catch (error) {
 // Close loading modal in case of an error
 Swal.close();
 onError(error);
 console.error('Failed to upload file:', error);
 
 // Show error message with SweetAlert
 Swal.fire({
     icon: 'error',
     title: 'Saving Failed',
     text: `Could not save ${fileName} to Google Drive.`,
     confirmButtonColor: '#d33',
     confirmButtonText: 'Try Again',
     background: 'white',
     iconColor: '#d33',
 });
    }
};
