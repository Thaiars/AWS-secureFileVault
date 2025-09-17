Secure File Vault
Dự án xây dựng ứng dụng lưu trữ file trên đám mây AWS với tính bảo mật cao.
## Tình trạng dự án: Đang phát triển

- ✅ **Đã hoàn thành**: API tải file lên, các hàm xử lý, kết nối S3, ghi log cơ sở dữ liệu
- 🔄 **Đang thực hiện**: Xác thực người dùng, cấu hình CORS 
- 📋 **Sắp tới**: Giao diện quản lý file, thêm chức năng CRUD

## Cách hoạt động của hệ thống

### Các công nghệ đã dùng
- **Xử lý backend**: AWS Lambda (Node.js)
- **API Gateway**: Tạo các endpoint REST
- **Lưu trữ**: Amazon S3 với URL có chữ ký
- **Cơ sở dữ liệu**: DynamoDB lưu thông tin file
- **Xác thực**: AWS Cognito (đang làm)
- **Bảo mật**: IAM roles và quyền hạn

### Quy trình xử lý
```
Yêu cầu từ User → API Gateway → Lambda Function → Tạo S3 URL
                                        ↓
                                    DynamoDB 
```

## Những tính năng đã làm được

### ✅ Tải file lên
- Tạo đường link an toàn để upload lên S3
- Kiểm tra kích thước file và định dạng
- Lưu thông tin file vào cơ sở dữ liệu
- Hỗ trợ đa dạng các loại file khác nhau

### ✅ Quản lý thông tin file
- Theo dõi thông tin từng file
- Gán file với từng user
- Lưu thời gian và lịch sử thao tác
- Kiểm soát trạng thái file

## Các đường link API

### POST /upload
Tạo đường link để tải file lên

**Yêu cầu gửi lên:**
```json
{
  "fileName": "tailieu.pdf",
  "fileSize": 1024000,
  "contentType": "application/pdf"
}
```

**Kết quả trả về:**
```json
{
  "success": true,
  "uploadUrl": "https://s3.amazonaws.com/...",
  "fileId": "1234567890",
  "s3Key": "user-123/1234567890/tailieu.pdf"
}
```

## Cấu trúc các file trong dự án
```
├── lambda-functions/          (Các hàm xử lý)
│   └── upload-handler/
│       ├── index.mjs          (Code chính)
│       └── package.json       (Cấu hình)
├── infrastructure/            (Cấu hình hạ tầng)
│   ├── s3-bucket-policy.json  (Quyền S3)
│   └── iam-roles.json         (Quyền IAM)
├── docs/                      (Tài liệu)
│   └── architecture-diagram.png
└── README.md                  (File này)
```

## Cách cài đặt và chạy

### Yêu cầu trước khi bắt đầu
- Tài khoản AWS với quyền admin
- Đã cài đặt AWS CLI trên máy
- Node.js phiên bản 18 trở lên

### Thiết lập các dịch vụ AWS
1. **S3 Bucket**: Tên `securevaults` với CORS được bật
2. **DynamoDB Table**: Tên `SecureVault-Files` 
   - Khóa chính: `user_id` (String)
   - Khóa phụ: `fileId` (String)  
3. **Lambda Function**: Chạy Node.js 18.x
4. **API Gateway**: REST API kết nối với Lambda

### Các biến môi trường
```
BUCKET_NAME=securevaults
TABLE_NAME=SecureVault-Files
AWS_REGION=eu-central-1
```

## Tính năng bảo mật
- **URL có chữ ký**: Truy cập tạm thời vào S3
- **IAM Roles**: Nguyên tắc quyền hạn tối thiểu
- **Kiểm tra đầu vào**: Giới hạn loại file và kích thước
- **CORS Policy**: Kiểm soát truy cập từ các domain khác
- **Ghi log**: Theo dõi tất cả thao tác với file

## Kế hoạch phát triển trong tương lai
- [ ] Xác thực người dùng
  - Thiết lập Cognito User Pool
  - Kiểm tra JWT token
  - Bảo vệ các API endpoint
- [ ] Quản lý file nâng cao
  - GET /files - Liệt kê file của user
  - DELETE /files/{fileId} - Xóa file
  - GET /files/{fileId}/download - Tạo link tải về
- [ ] Giao diện quản lý file (Web UI / Dashboard)
- [ ] Cải thiện logging và monitoring
  - CloudWatch Logs nâng cao
  - Cảnh báo khi lỗi upload

## Những kinh nghiệm rút ra được
- **Tích hợp các dịch vụ AWS**: Cách kết nối nhiều dịch vụ AWS với nhau
- **Serverless**: Ưu điểm và hạn chế của serverless
- **Bảo mật**: Cách thiết lập IAM policies, presigned URLs
- **Thiết kế API**: RESTful endpoints và xử lý lỗi
- **Debug**: Sử dụng CloudWatch logs để tìm lỗi
---
*Trạng thái: Đang phát triển - Cập nhật lần cuối: Tháng 9 năm 2025*
