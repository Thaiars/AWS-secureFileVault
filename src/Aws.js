// src/Aws.js
// import {  uploadToS3, getFiles, deleteFile } from '../Aws';

export const AWS_CONFIG = {
    API_URL: 'https://gsxcebdzs6.execute-api.eu-central-1.amazonaws.com/prod',
    USER_POOL_ID: 'eu-central-1_9DUZ3HyCf',
    CLIENT_ID: '7v7v8svggc1piqbtbq7rbud8u0',
    REGION: 'eu-central-1',
    // AuthFlow: 'USER_PASSWORD_AUTH' 
}
 


// API calls
export const uploadFile = async (fileName, fileSize, contentType) => {
    const token = localStorage.getItem('idToken');
    
    const response = await fetch(`${AWS_CONFIG.API_URL}/upload`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ fileName, fileSize, contentType })
    });
    
    return await response.json();
};

export const getFiles = async () => {
    const token = localStorage.getItem('idToken');
    
    const response = await fetch(`${AWS_CONFIG.API_URL}/files`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    return await response.json();
};

export const deleteFile = async (fileId) => {
    const token = localStorage.getItem('idToken');
    
    const response = await fetch(`${AWS_CONFIG.API_URL}/files/${fileId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    return await response.json();
};

export const uploadToS3 = async (presignedUrl, file) => {
    const response = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
            'Content-Type': file.type
        }
    });
    
    return response.ok;
};