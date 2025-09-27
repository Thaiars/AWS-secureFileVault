import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand, GetCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({ region: process.env.AWS_REGION });
const ddbClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const dynamodb = DynamoDBDocumentClient.from(ddbClient);

export const handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));
    console.log('Debug routing:', {
        httpMethod: event.httpMethod,
        resource: event.resource
    });

    try {
        const httpMethod = event.httpMethod;
        const resource = event.resource;
        
        // Route to appropriate handler
        if (httpMethod === 'POST' && resource === '/upload') {
            return await handleUpload(event);
        } else if (httpMethod === 'GET' && resource === '/files') {
            return await handleListFiles(event);
        } else if (httpMethod === 'DELETE' && resource === '/files/{fileId}') {
            return await handleDeleteFile(event);
        }
        else if (httpMethod === 'GET' && resource === '/files/{fileId}/download') {
            return await handleDownloadFile(event);
        }
        
        return {
            statusCode: 404,
            headers: { 
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: 'route not found' })
        };
        
    } catch (error) {
        console.error('Error details:', error);
        return {
            statusCode: 500,
            headers: { 
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                error: 'Internal server error',
                message: error.message,
                details: error.stack
            })
        };
    }
};

async function handleUpload(event) {
    // parse body
    const requestBody = JSON.parse(event.body || '{}');
    const fileName = requestBody.fileName || "test.pdf";
    const fileSize = requestBody.fileSize || 1024;
    const contentType = requestBody.contentType || "application/pdf";
    
    console.log('Input:', { fileName, fileSize, contentType });
    
    // Get user_id from JWT token 
    const user_id = event.requestContext.authorizer.claims.sub;
    const fileId = Date.now().toString();
    const s3Key = `${user_id}/${fileId}/${fileName}`;
    
    console.log('Generated s3Key:', s3Key);
    
    // Generate pre-signed URL
    const command = new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: s3Key,
        ContentType: contentType    
    });
    
    const uploadUrl = await getSignedUrl(s3Client, command, { 
        expiresIn: 300 
    });
    
    console.log('Generated upload URL');
    
    // save  DynamoDB
    const putCommand = new PutCommand({
        TableName: process.env.TABLE_NAME,
        Item: {
            user_id,
            fileId,
            fileName,
            fileSize: parseInt(fileSize),
            contentType,
            s3Key,
            status: 'pending',
            createdAt: new Date().toISOString()
        }
    });
    
    await dynamodb.send(putCommand);
    console.log('Saved to DynamoDB');
    
    return {
        statusCode: 200,
        headers: { 
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            success: true,
            uploadUrl,
            fileId,
            s3Key,
            message: 'Upload URL generated successfully'
        })
    };
    }

async function handleListFiles(event) {
    // Get user_id tu JWT token
    const user_id = event.requestContext.authorizer.claims.sub;
    
    console.log('Listing files for user:', user_id);
    
    // Query dynamodb for files cho user 
    const queryCommand = new QueryCommand({
        TableName: process.env.TABLE_NAME,
        KeyConditionExpression: 'user_id = :user_id',
        ExpressionAttributeValues: {
            ':user_id': user_id
        },
        ScanIndexForward: false  // sap xep theo createdAt giam dan
    });
    
    const result = await dynamodb.send(queryCommand);    
    console.log(`Found ${result.Count} files for user`);
    
    // response body chi chua thong tin can thiet
    // khong gui s3Key ve client
    // client chi su dung fileId de download or xoa file
    const files = result.Items.map(item => ({
        fileId: item.fileId,
        fileName: item.fileName,
        fileSize: item.fileSize,
        contentType: item.contentType,
        status: item.status,
        createdAt: item.createdAt,
        s3Key: item.s3Key
    }));
    
    return {
        statusCode: 200,
        headers: { 
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            success: true,
            files: files,
            count: result.Count,
            message: `Found ${result.Count} files`
        })
    };
}

async function handleDeleteFile(event) {
    const user_id = event.requestContext.authorizer.claims.sub;
    const fileId = event.pathParameters.fileId;
    
    console.log(`Attempting to delete file ${fileId} for user ${user_id}`);
    
    try {
        // tim file cua user trong dynamodb
        const getCommand = new GetCommand({
            TableName: process.env.TABLE_NAME,
            Key: { user_id, fileId }
        });
        
        const result = await dynamodb.send(getCommand);
        
        if (!result.Item) {
            return {
                statusCode: 404,
                headers: { 
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    error: 'File not found',
                    message: 'File does not exist or does not belong to user'
                })
            };
        }
        
        const fileItem = result.Item;
        console.log('Found file to delete:', fileItem);
        
      // xoa tu dynamodb
        const deleteCommand = new DeleteCommand({
            TableName: process.env.TABLE_NAME,
            Key: { user_id, fileId }
        });
        
        await dynamodb.send(deleteCommand);
        console.log('Deleted from DynamoDB');
        
        // xoa tu s3
        const s3DeleteCommand = new DeleteObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: fileItem.s3Key
        });
        // xoa file tren s3
        await s3Client.send(s3DeleteCommand);
        console.log('Deleted from S3:', fileItem.s3Key);
        
        return {
            statusCode: 200,
            headers: { 
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                success: true,
                message: 'File deleted successfully',
                deletedFile: {
                    fileId: fileItem.fileId,
                    fileName: fileItem.fileName,
                    s3Key: fileItem.s3Key
                }
            })
        };
        
    } catch (error) {
        console.error('Error deleting file:', error);
        
        return {
            statusCode: 500,
            headers: { 
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                error: 'Failed to delete file',
                message: error.message
            })
        };
    }
}
async function handleDownloadFile(event) {
    const user_id = event.requestContext.authorizer.claims.sub;
    const fileId = event.pathParameters.fileId;
    
    const getCommand = new GetCommand({
        TableName: process.env.TABLE_NAME,
        Key: { user_id, fileId }
    });
    
    const result = await dynamodb.send(getCommand);
    
    if (!result.Item) {
        return {
            statusCode: 404,
            body: JSON.stringify({ error: 'file not found' })
        };
    }
    // generate presigned URL de tai file
    const command = new GetObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: result.Item.s3Key
    });
    // URL het han trong 5p
    const downloadUrl = await getSignedUrl(s3Client, command, { 
        expiresIn: 300 
    });
    
    return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
            success: true,
            downloadUrl,
            fileName: result.Item.fileName,
            fileSize: result.Item.fileSize
        })
    };
}