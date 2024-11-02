import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const GoogleDriveLinkLoader = ({ onProjectLoadFromExternalSource }) => {
    const [accessToken, setAccessToken] = useState(localStorage.getItem('googleAccessToken'));
    const [tokenExpiry, setTokenExpiry] = useState(localStorage.getItem('googleTokenExpiry'));
    const [link, setLink] = useState('');

    useEffect(() => {
        const now = new Date().getTime();
        if (now >= tokenExpiry) {
            console.log("Token expired. Need re-authentication.");
            setAccessToken(null);
        }
    }, [tokenExpiry]);

    const authenticate = () => {
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
                }
            },
        }).requestAccessToken({ prompt: 'select_account' });
    };

    const handleLoadFromLink = async () => {
        const now = new Date().getTime();
        if (accessToken && now < tokenExpiry) {
            const fileId = extractGoogleDriveFileId(link);
            if (fileId) {
                const fileName = await fetchFileName(fileId); // Fetch the actual file name
                fetchFile(fileId, fileName || 'Google Drive Link Project.sb3'); // Use the file name or a fallback           
             } else {
              Swal.fire({
                icon: 'error',
                title: 'Invalid Google Drive link',
                text: 'Please check the link and try again!',
                confirmButtonColor: '#FF5252',
                confirmButtonText: 'Okay',
                background: 'white',
                iconColor: '#FF5252',
                customClass: {
                  title: 'text-red-500',
                  content: 'text-gray-800',
                },
              });
            }
        } else {
            authenticate();
        }
    };

    const extractGoogleDriveFileId = (url) => {
        const match = url.match(/[-\w]{25,}/); // Match Google Drive file IDs
        return match ? match[0] : null;
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

    // Function to fetch the file metadata and return the file name
const fetchFileName = async (fileId) => {
    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?fields=name`, {
        headers: new Headers({ 'Authorization': `Bearer ${accessToken}` })
    });
    if (response.ok) {
        const data = await response.json();
        return data.name; // Return the file name from the metadata
    } else {
        throw new Error('Failed to fetch file metadata');
    }
};
    return (
        <div>
            <input
    type="text"
    placeholder="Enter Google Drive link"
    value={link}
    onChange={(e) => setLink(e.target.value)}
    style={{
        marginRight: '10px',        // Adds space between input and button
        backgroundColor: '#FFFFFF', // White background
        color: '#000000',           // Black text
        border: '2px solid #FF5252',// Border color matching the button
        borderRadius: '4px',        // Optional: Rounded corners
        padding: '5px',             // Padding for comfort
        fontSize: '14px',           // Font size for readability
    }}
            />
<button
    style={{
        backgroundColor: '#FF5252',  // Matches the red background
        color: 'white',              // Text color
        border: '2px solid white',   // Visible border, adjust as needed
        borderRadius: '4px',         // Optional: Rounded corners
        padding: '1px 5px',         // Adjust padding
        cursor: 'pointer',           // Makes the button clickable
        fontSize: '12px',            // Adjust font size
    }}
    onClick={handleLoadFromLink}
>
    Load
</button>        
        </div>
    );
};

export default GoogleDriveLinkLoader;
