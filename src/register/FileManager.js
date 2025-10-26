import React, { useState, useEffect } from "react";
import { Container, Card, Button, Table, Alert, Spinner } from "react-bootstrap";
import { uploadData } from 'aws-amplify/storage';
import { getCurrentUser } from 'aws-amplify/auth';
import { Save_metaData, getUserFiles, deleteFileMetadata } from '../DB/dynamoDB';
import { v4 as uuidv4 } from 'uuid';
import { downloadData } from 'aws-amplify/storage';

function FileManager() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [userFiles, setUserFiles] = useState([]);
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 FileManager mounted, fetching data...');
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);

      setUserFiles([]);
      setUserId(null);
    try {
      console.log('🔄 Fetching user data...');
      
      const user = await getCurrentUser();
      console.log('👤 User object:', user);
      
      // Lấy userId từ nhiều nguồn để đảm bảo có giá trị
      const userIdentifier = user.userId || user.username || user.signInUserSession?.idToken?.payload?.sub;
      
      if (!userIdentifier) {
        throw new Error('Cannot extract user identifier from user object');
      }
      
      console.log('✅ Using userId:', userIdentifier);
      setUserId(userIdentifier);
      
      console.log('📁 Loading files from DynamoDB...');
      const files = await getUserFiles(userIdentifier);
      console.log('✅ Loaded', files.length, 'files');
      
      setUserFiles(files);
    } catch (error) {
      console.error(' Error fetching data:', error);
      setMessage('⚠️ Error loading files: ' + error.message);
      setUserFiles([]);
      setUserId(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  const handleUpload = async () => {
    console.log('=== UPLOAD START ===');
    console.log('Current userId:', userId);
    console.log('Current file:', file?.name);
    
    if (!userId) {
      console.error(' userId is null/undefined!');
      setMessage(' User not loaded yet. Please wait and try again.');
      return;
    }
    
    if (!file) {
      setMessage('Please select a file');
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      const fileId = uuidv4();
      const s3Key = `private/${userId}/${fileId}-${file.name}`;

      console.log('1️⃣ Uploading to S3:', s3Key);
      
      // 1. Upload file to S3
      const result = await uploadData({
        path: s3Key,
        data: file,
        options: {
          contentType: file.type
        }
      }).result;

      console.log('✅ S3 upload success');
      const newFile = {
        userId: userId,
        fileId: fileId,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        s3Key: s3Key,
        uploadedAt: new Date().toISOString()
      };

     
      // AWAIT save to DynamoDB
      await Save_metaData(userId, newFile);
      
      console.log('✅ DynamoDB save success');

      // 4. Update UI only AFTER DB save succeeds
      setUserFiles(prevFiles => [newFile, ...prevFiles]);
      setMessage('✅ File uploaded and saved successfully!');
      
      setFile(null);
      const inputElement = document.getElementById('fileInput');
      if (inputElement) inputElement.value = '';
      
      console.log('✅ Upload complete');

    } catch (error) {
      console.error('❌ Upload failed:', error);
      
      // Display specific error messages
      if (error.message?.includes('DynamoDB')) {
        setMessage('❌ Failed to save file info to database: ' + error.message);
      } else if (error.message?.includes('S3') || error.message?.includes('upload')) {
        setMessage('❌ Failed to upload file: ' + error.message);
      } else {
        setMessage('❌ Upload failed: ' + error.message);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fileId, s3Key, fileName) => {
   
   const fileObj = userFiles.find(f => f.fileId === fileId);
  
  if (!fileObj) {
    console.error('❌ File not found in array!');
    alert('Error: File not found');
    return;
  }
  
  console.log('File object:', fileObj);
  console.log('File userId:', fileObj.userId);
  console.log('File fileId:', fileObj.fileId);
  
  // ✅ CRITICAL: Dùng userId và fileId TỪ FILE OBJECT (từ DB)
  const userIdToDelete = fileObj.userId;  // ✅ Từ DB
  const fileIdToDelete = fileObj.fileId;  // ✅ Từ DB
  
  console.log('Will delete with:');
  console.log('  userId:', userIdToDelete);
  console.log('  fileId:', fileIdToDelete);
  
  // ✅ Verify match với current user
  if (userIdToDelete !== userId) {
    console.warn('⚠️ File belongs to different user!');
    if (!window.confirm('This file may belong to a different user. Continue?')) {
      return;
    }
  }
    
    try { 
      console.log('🗑️ Deleting file:', { fileId, s3Key });
      
      // 1. Remove from UI immediately (optimistic update)
      setUserFiles(prevFiles => prevFiles.filter(f => f.fileId !== fileId));
      setMessage('🗑️ Deleting file...');

      // 2. Delete from S3
      const { remove: removeFile } = await import('aws-amplify/storage');
      await removeFile({ path: s3Key });
      console.log('✅ Deleted from S3');

      // 3. Delete metadata from DynamoDB
      await deleteFileMetadata(userId, fileId);
      console.log('✅ Deleted from DynamoDB');

      setMessage('✅ File deleted successfully!');

    } catch (error) {
      console.error('Delete error:', error);
      
      // Rollback UI if delete fails
      if (fileObj) {
        setUserFiles(prevFiles => {
          if (!prevFiles.find(f => f.fileId === fileId)) {
            return [...prevFiles, fileObj].sort((a, b) => 
              new Date(b.uploadedAt) - new Date(a.uploadedAt)
            );
          }
          return prevFiles;
        });
      }
      
      setMessage('Delete failed: ' + error.message);
    }
  };

  const handleDownload = async (s3Key, fileName) => {
  try {
    setMessage('📦 Downloading file...');
    const result = await downloadData({
      path: s3Key,
      options: { accessLevel: 'private' }
    }).result;

    // Tạo link tải từ blob
    const blob = await result.body.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);

    setMessage('✅ File downloaded successfully!');
  } catch (error) {
    console.error('Download error:', error);
    setMessage('Download failed: ' + error.message);
  }
};

  // Test function
  const testDatabaseConnection = async () => {
    if (!userId) {
      alert('Please wait for user to load...');
      return;
    }
    
    try {
      console.log(' Testing database connection...');
      const files = await getUserFiles(userId);
      console.log(' Database connection OK, found', files.length, 'files');
      alert(` Database connected!\nFound ${files.length} files for user: ${userId}`);
    } catch (error) {
      console.error(' Database test failed:', error);
      alert(' Database connection failed: ' + error.message);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading user data...</p>
      </Container>
    );
  }

  // Error state if userId not loaded
  if (!userId) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="danger">
          <Alert.Heading>Cannot Load User Data</Alert.Heading>
          <p>Unable to get user information. Please logout and login again.</p>
          <hr />
          <div className="d-flex justify-content-center">
            <Button variant="primary" onClick={() => window.location.href = '/login'}>
              Go to Login
            </Button>
            <Button variant="secondary" className="ms-2" onClick={fetchUserData}>
              Retry
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container style={{ marginTop: "50px", marginBottom: "50px" }}>
      {/* Upload Card */}
      <Card 
        style={{
          width: "100%",
          maxWidth: "1000px",
          margin: "0 auto 30px auto",
          padding: "50px 35px",
          borderRadius: "20px",           
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px 0 #ffffff82",
          backgroundColor: "#ffffffe7",
        }}
      >
        <h3 className="text-center mb-4">📤 Upload File</h3>
        
        <div className="text-center border p-5 rounded bg-light mb-3">
          <p style={{ fontSize: "24px", marginBottom: "20px" }}>
            Drag and drop files here or click to select
          </p>
          
          <input 
            id="fileInput"
            type="file" 
            className="form-control mb-3" 
            onChange={handleFileChange}
            disabled={uploading}
            style={{ fontSize: "18px" }}
          />
          
          <Button 
            onClick={handleUpload}
            disabled={!file || uploading}
            style={{
              background: "linear-gradient(90deg, #667eea, #764ba2)",
              border: "none",
              fontWeight: "600",
              fontSize: "18px",
              padding: "12px 40px"
            }}
          >
            {uploading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Uploading...
              </>
            ) : (
              '📤 Upload'
            )}
          </Button>
        </div>

        {message && (
          <Alert variant={message.includes('✅') ? 'success' : 'danger'}>
            {message}
          </Alert>
        )}
      </Card>

      {/* File List Card */}
      <Card 
        style={{
          width: "100%",
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "35px",
          borderRadius: "20px",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px 0 #ffffff82",
          backgroundColor: "#ffffffe7",
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="mb-0">📁 Your Files ({userFiles.length})</h3>
          <div>
            <Button 
              onClick={testDatabaseConnection}
              variant="outline-info" 
              size="sm"
              className="me-2"
            >
              🧪 Test DB
            </Button>
            <Button 
              onClick={fetchUserData} 
              variant="outline-primary" 
              size="sm"
            >
              🔄 Refresh
            </Button>
          </div>
        </div>
        
        {userFiles.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted" style={{ fontSize: "18px" }}>
              No files uploaded yet. Upload your first file above! 👆
            </p>
          </div>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>File Name</th>
                <th>Size</th>
                <th>Type</th>
                <th>Uploaded</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {userFiles.map((file) => (
                <tr key={file.fileId}>
                  <td>
                    <div style={{ 
                      maxWidth: "300px", 
                      overflow: "hidden", 
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      fontWeight: "500"
                    }}>
                      {file.fileName}
                    </div>
                  </td>
                  <td>{(file.fileSize / 1024).toFixed(2)} KB</td>
                  <td>
                    <span className="badge bg-secondary">
                      {file.fileType}
                    </span>
                  </td>
                  <td>{new Date(file.uploadedAt).toLocaleString()}</td>
                 <td>
                    <button
                      className="btn btn-sm btn-success me-2"
                      onClick={() => handleDownload(file.s3Key, file.fileName, file.fileType)}
                    >
                      ⬇️ Download
                    </button>
                    <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(file.fileId, file.s3Key, file.fileName)}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>

      {/* Debug Info */}
      <div className="text-center mt-3 text-muted">
        <small>User ID: {userId}</small>
      </div>
    </Container>
  );
}

export default FileManager; 