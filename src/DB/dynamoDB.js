// import { DynamoDBClient  } from "@aws-sdk/client-dynamodb";
// import { DynamoDBDocumentClient, PutCommand, QueryCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
// import { fetchAuthSession } from 'aws-amplify/auth';

// const TABLE_NAME = "SecureVault-Files";
// const REGION = "eu-central-1"; 


// const getDNMdb_cli = async () => {
//   const session = await fetchAuthSession();
  
//   const client = new DynamoDBClient({
//     region: REGION,
//     credentials: session.credentials
//   });
  
//   return DynamoDBDocumentClient.from(client);
// };

// // Lưu file metadata vào DynamoDB
// export const Save_metaData = async (userId, fileData) => {
//   const client = await getDNMdb_cli();
  
//   const params = {
//     TableName: TABLE_NAME,
//     Item: {
//       user_id : userId,
//       fileId: fileData.fileId,
//       fileName: fileData.fileName,
//       fileSize: fileData.fileSize,
//       fileType: fileData.fileType,
//       s3Key: fileData.s3Key,
//       uploadedAt: new Date().toISOString()
//     }
//   };

//   try {
//     await client.send(new PutCommand(params));
//     console.log(" File metadata saved to DynamoDB");
//     return { success: true };
//   } catch (error) {
//     console.error(" Error saving: ", error);
//     throw error;
//   }
// };

// // Lấy danh sách files của user
// export const getUserFiles = async (userId) => {
//   const client = await getDNMdb_cli();
  
//   const params = {
//     TableName: TABLE_NAME,
//     KeyConditionExpression: "userId = :userId",
//     ExpressionAttributeValues: {
//       ":userId": userId
//     }
//   };

//   try {
//     const result = await client.send(new QueryCommand(params));
//     return result.Items || [];
//   } catch (error) {
//     console.error(" Error fetching files:", error);
//     throw error;
//   }
// };

// // Xóa file metadata
// export const deleteFileMetadata = async (userId, fileId) => {
//   const client = await getDNMdb_cli();
  
//   const params = {
//     TableName: TABLE_NAME,
//     Key: {
//       userId: userId,
//       fileId: fileId
//     }
//   };
   
//   try {
//     const result = await client.send(new DeleteCommand(params));
//     // console.log("✅ File metadata deleted from DynamoDB");
//     // console.log("✅ Delete result:", result);
//     return { success: true };
//   } catch (error) {
//     // console.error("❌ Error deleting from DynamoDB:", error);
//     // console.error("❌ Error name:", error.name);
//     // console.error("❌ Error message:", error.message);
//     throw error;
//   }
// };





import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { fetchAuthSession } from 'aws-amplify/auth';

const TABLE_NAME = "SecureVault-Files";  
const REGION = "eu-central-1";  

const getDNMdb_cli = async () => {  
  const session = await fetchAuthSession();
  
  console.log('📋 Session info:', {
    hasCredentials: !!session.credentials,
    identityId: session.identityId
  });
  
  if (!session.credentials) {
    throw new Error('No AWS credentials! Check Identity Pool configuration.');
  }
  
  const client = new DynamoDBClient({
    region: REGION,
    credentials: session.credentials
  });
  
  console.log('✅ DynamoDB client created');
  
  return DynamoDBDocumentClient.from(client);
};

export const Save_metaData = async (userId, fileData) => {
  console.log('💾 === SAVE TO DYNAMODB START ===');
  console.log('User ID:', userId);
  console.log('File data:', fileData);
  
  try {
    const client = await getDNMdb_cli();
    
    const params = {
      TableName: TABLE_NAME,
      Item: {
        user_id: userId,
        fileId: fileData.fileId,
        fileName: fileData.fileName,
        fileSize: fileData.fileSize,
        fileType: fileData.fileType,
        s3Key: fileData.s3Key,
        uploadedAt: fileData.uploadedAt || new Date().toISOString()
        
      }
    };
    
    console.log('📝 PutCommand params:', JSON.stringify(params, null, 2));
    
    const result = await client.send(new PutCommand(params));
    
    console.log('✅ DynamoDB PutItem SUCCESS');
    console.log('Result:', result);
    console.log('💾 === SAVE TO DYNAMODB END ===');
    
    return { success: true };
    
  } catch (error) {
    console.error('❌ === DYNAMODB SAVE FAILED ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.$metadata?.httpStatusCode);
    console.error('Full error:', error);
    
    // Parse error type
    if (error.name === 'AccessDeniedException') {
      throw new Error('❌ IAM Permission Denied: Role does not have dynamodb:PutItem permission');
    } else if (error.name === 'ResourceNotFoundException') {
      throw new Error(`❌ Table not found: ${TABLE_NAME} in region ${REGION}`);
    } else if (error.message?.includes('credentials')) {
      throw new Error('❌ AWS Credentials issue: Cannot authenticate');
    } else {
      throw new Error(`❌ DynamoDB error: ${error.message}`);
    }
  }
};

export const getUserFiles = async (userId) => {
  console.log('📖 === LOAD FROM DYNAMODB START ===');
  console.log('User ID:', userId);
  
  try {
    const client = await getDNMdb_cli();
    
    const params = {
      TableName: TABLE_NAME,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId
      },
      ScanIndexForward: false
    };
    
    console.log('📝 Query params:', JSON.stringify(params, null, 2));
    
    const result = await client.send(new QueryCommand(params));
    
    console.log('✅ DynamoDB Query SUCCESS');
    console.log('Items count:', result.Items?.length || 0);
    console.log('Items:', result.Items);
    console.log('📖 === LOAD FROM DYNAMODB END ===');
    
    return result.Items || [];
    
  } catch (error) {
    console.error('❌ === DYNAMODB LOAD FAILED ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
    
    return [];
  }
};

export const deleteFileMetadata = async (userId, fileId) => {
  console.log('🗑️ === DELETE FROM DYNAMODB START ===');
  console.log('📥 Input params:');
 
  
  try {
    const cln = await getDNMdb_cli();
    
    const params = {
      TableName: TABLE_NAME,
      Key: {
        user_id: userId,
        fileId: fileId
      }
    };
    
    console.log('📝 DeleteCommand params:', JSON.stringify(params, null, 2));
    
    const result = await cln.send(new DeleteCommand(params));
    
    console.log('✅ DynamoDB DeleteItem SUCCESS');
    return { success: true };
    
  } catch (error) {
    console.error('❌ === DYNAMODB DELETE FAILED ===');
     console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Full error:', JSON.stringify(error, null, 2));
    console.error('Error:', error);
    throw error;
  }
};