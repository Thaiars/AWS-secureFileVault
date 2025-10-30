# Secure File Vault

Secure File Vault là một ứng dụng web giúp người dùng lưu trữ và quản lý dữ liệu cá nhân một cách an toàn trên nền tảng AWS Cloud.
Hệ thống sử dụng các dịch vụ AWS như Cognito, Lambda, API Gateway, và DynamoDB để đảm bảo tính bảo mật, khả năng mở rộng và độ tin cậy cao.

### Mục tiêu dự án
- Cung cấp nơi lưu trữ dữ liệu cá nhân (hình ảnh, tài liệu, v.v.) an toàn cho người dùng.
- Áp dụng các dịch vụ bảo mật AWS trong thực tế.
- Mô phỏng kiến trúc serverless để xử lý dữ liệu người dùng nhanh chóng và tiết kiệm chi phí.

### Kiến trúc hệ thống
**Luồng hoạt động tổng quát:**
- Người dùng đăng ký hoặc đăng nhập tài khoản qua AWS Cognito → hệ thống cấp JWT Token để xác thực.
- Khi người dùng tải lên tệp (file), dữ liệu được gửi qua API Gateway.
- AWS Lambda nhận request từ API Gateway, xử lý logic (phân loại, xác minh, gán metadata…).
- Thông tin tệp được lưu vào DynamoDB, còn nội dung tệp được lưu trên Amazon S3.
-  Toàn bộ quá trình được bảo vệ bằng IAM Role & Cognito Authentication.

### Công nghệ sử dụng
AWS Cognito: Xác thực & quản lý người dùng
API Gateway: 	Cổng trung gian nhận & phân phối các request
AWS Lambda: Xử lý logic backend theo mô hình serverless
Amazon S3: Lưu trữ file người dùng
DynamoDB:	Lưu metadata và thông tin file
React + Bootstrap: 	Giao diện hoặc backend hỗ trợ

 ## Tính năng chính
- Đăng ký / đăng nhập tài khoản người dùng
- Upload & quản lý tệp trên cloud
- Xác thực & phân quyền bảo mật tự động bằng Cognito
- Lưu metadata và nhật ký hoạt động
- Kiến trúc serverless, không cần quản lý máy chủ
  
## Bài học & Kinh nghiệm 
- Hiểu rõ luồng xác thực và ủy quyền trên AWS Cognito
- Cấu hình API Gateway + Lambda để xây dựng ứng dụng serverless thực tế
- Thực hành lưu trữ dữ liệu phi cấu trúc trên S3 và metadata trên DynamoDB
- Quản lý IAM Role và quyền truy cập dịch vụ AWS đúng chuẩn bảo mật

## Cấu trúc thư mục
```
FILE_SECURE/
│
├── node_modules/
├── public/│
├── src/
│   ├── components/         # Chứa các component chính (Upload, List, Navbar, v.v.)
│   ├── DB/                 
        ├── dynamodb.js      #  file dynamodb.js để xử lý lưu dữ liệu
│   ├── register/           
        ├── amplify.js         # Kết nối toàn bộ dự án với các dịch vụ AWS
        ├── AuthContext.js     # File  tạo context quản lý trạng thái đăng nhập cho toàn app.
        ├── AuthForm.js        # Đây là form giao diện đăng ký / đăng nhập.
        ├── FileManager.js     # Trang quản lý file, ng dùng có thể upload file, xem danh sách file, xóa và tải file.
        ├── Login.js           #  file Login.js để đăng nhập tài khoản
        ├── Register.js        #  file Register.js để đăng kí tài khoản
        ├── Verify.js          #  file Verify.js để xác minh tài khoản
│   ├── App.css
│   ├── App.js              # Thành phần gốc của ứng dụng
│   ├── App.test.js
│   ├── Aws.js              # Cấu hình AWS (S3, Lambda, DynamoDB)
│   ├── cognito.js          # Cấu hình và hàm xử lý AWS Cognito (Auth)
│   ├── index.css
│   ├── index.js            # Điểm khởi đầu ứng dụng React
│   ├── reportWebVitals.js
│   ├── setupTests.js
│
├── .gitignore
├── package-lock.json
├── package.json
└── README.md
```

## Hướng phát triển tiếp theo
- Tích hợp kiểm tra malware hoặc mã độc khi upload file.  
- Xây dựng dashboard thống kê dung lượng và số lượt tải xuống.  
- Thêm xác thực đa yếu tố (MFA) trong đăng nhập Cognito.  

Dự án hiện đang ở phiên bản cơ bản. Các tính năng nâng cấp có thể được bổ sung trong tương lai tùy theo định hướng phát triển.
