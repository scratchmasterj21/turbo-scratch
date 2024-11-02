import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const GoogleDrivePickerButton = ({ developerKey, onProjectLoadFromExternalSource }) => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem('googleAccessToken'));
    const [tokenExpiry, setTokenExpiry] = useState(localStorage.getItem('googleTokenExpiry'));
 
    useEffect(() => {
        const now = new Date().getTime();
        if (now >= tokenExpiry) {
            console.log("Token expired. Need re-authentication.");
            setAccessToken(null);  // Clear the expired token
        }
    }, []);


    // Load or reload the Picker library
    const loadPickerApi = () => {
        if (window.google && window.google.picker) {
            // If the Picker library is already loaded, create the picker directly
            createPicker();
        } else {
            window.gapi.load('picker', () => {
                console.log("Picker API loaded.");
                createPicker();
            });
        }
    };

    const authenticateAndLoadPicker = () => {
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

                    setAccessToken(response.access_token);
                    setTokenExpiry(expiresAt);

                    localStorage.setItem('googleAccessToken', response.access_token);
                    localStorage.setItem('googleTokenExpiry', expiresAt);

                } else {
                    console.log("No access token obtained, forcing login prompt.");
                    requestUserLogin(); // Trigger a full login flow
                }
            },
        }).requestAccessToken({ prompt: 'select_account' });
    };

    const requestUserLogin = () => {
        authenticateAndLoadPicker(); // Call authenticate to ensure prompt for login
    };

    const handleOpenPicker = () => {
        const now = new Date().getTime();
        if (accessToken && now < tokenExpiry) {
            loadPickerApi();
        } else {
            authenticateAndLoadPicker();
        }
    };

    const createPicker = () => {
        if (!window.google || !window.google.picker) {
            console.error("Picker API is not fully loaded yet.");
            return;
        }

        const docsView = new window.google.picker.DocsView()
    .setOwnedByMe(true)  // Show files shared with the user (not owned by the user)
    .setQuery('.sb3')  // Filters files by extension in their name
    .setMode(window.google.picker.DocsViewMode.LIST) // Set the view mode to LIST
    .setSelectFolderEnabled(false);  // Don't allow folder selection

const sharedWithMeView = new window.google.picker.DocsView()
    .setQuery('.sb3')  // Filters files by extension in their name
    .setSelectFolderEnabled(false)  // Don't allow folder selection
    .setMode(window.google.picker.DocsViewMode.LIST) // Set the view mode to LIST
    .setOwnedByMe(false);  // Show files shared with the user (not owned by the user)

// Create the picker with both views
const picker = new window.google.picker.PickerBuilder()
    .addView(docsView)  // View to show docs with .sb3 (application/octet-stream)
    .addView(sharedWithMeView)  // Separate view for "Shared with Me"
    .setOAuthToken(accessToken)
    .setDeveloperKey(developerKey)
    .setCallback(pickerCallback)
    .build();

        picker.setVisible(true);
    };

    const pickerCallback = (data) => {
        if (data[window.google.picker.Response.ACTION] === window.google.picker.Action.PICKED) {
            const fileId = data[window.google.picker.Response.DOCUMENTS][0].id;
            const fileName = data[window.google.picker.Response.DOCUMENTS][0].name;
            fetchFile(fileId, fileName);
        }
    };

    const fetchFile = async (fileId, fileName) => {
        try {
        Swal.fire({
            title: 'Loading...',
            text: 'Please wait while we fetch the file from Google Drive.',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });

        const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
            headers: new Headers({ 'Authorization': `Bearer ${accessToken}` })
        });
        const data = await response.arrayBuffer();
        onProjectLoadFromExternalSource(data, fileName);

        Swal.close(); // Close the Swal loading modal when the file is fetched
    } catch (error) {
        console.error("Error fetching the file:", error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong while fetching the file!',
        });
      }
    };

    return (
        <div onClick={handleOpenPicker}>Load from Google Drive</div>
    );
};

export default GoogleDrivePickerButton;
