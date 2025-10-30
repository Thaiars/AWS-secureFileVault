🗄️ Secure File Vault (AWS Version)
📖 Giới thiệu

Secure File Vault là một ứng dụng web giúp người dùng lưu trữ và quản lý dữ liệu cá nhân một cách an toàn trên nền tảng AWS Cloud.
Hệ thống sử dụng các dịch vụ AWS như Cognito, Lambda, API Gateway, và DynamoDB để đảm bảo tính bảo mật, khả năng mở rộng và độ tin cậy cao.

🎯 Mục tiêu dự án

Cung cấp nơi lưu trữ dữ liệu cá nhân (hình ảnh, tài liệu, v.v.) an toàn cho người dùng.

Áp dụng các dịch vụ bảo mật AWS trong thực tế.

Mô phỏng kiến trúc serverless để xử lý dữ liệu người dùng nhanh chóng và tiết kiệm chi phí.

⚙️ Kiến trúc hệ thống

Luồng hoạt động tổng quát:

👤 Người dùng đăng ký hoặc đăng nhập tài khoản qua AWS Cognito → hệ thống cấp JWT Token để xác thực.

📤 Khi người dùng tải lên tệp (file), dữ liệu được gửi qua API Gateway.

⚙️ AWS Lambda nhận request từ API Gateway, xử lý logic (phân loại, xác minh, gán metadata…).

🧾 Thông tin tệp được lưu vào DynamoDB, còn nội dung tệp được lưu trên Amazon S3.

🔐 Toàn bộ quá trình được bảo vệ bằng IAM Role & Cognito Authentication.

🧱 Công nghệ sử dụng
Thành phần	Mô tả
AWS Cognito	Xác thực & quản lý người dùng
API Gateway	Cổng trung gian nhận & phân phối request
AWS Lambda	Xử lý logic backend theo mô hình serverless
Amazon S3	Lưu trữ file người dùng
DynamoDB	Lưu metadata và thông tin file
React / Flask (tùy chọn)	Giao diện hoặc backend hỗ trợ
🧩 Tính năng chính

🔑 Đăng ký / đăng nhập tài khoản người dùng

☁️ Upload & quản lý tệp trên cloud

🔐 Xác thực & phân quyền bảo mật tự động bằng Cognito

🧾 Lưu metadata và nhật ký hoạt động

🚀 Kiến trúc serverless, không cần quản lý máy chủ

🧠 Bài học & Kinh nghiệm đạt được

Hiểu rõ luồng xác thực và ủy quyền trên AWS Cognito

Cấu hình API Gateway + Lambda để xây dựng ứng dụng serverless thực tế

Thực hành lưu trữ dữ liệu phi cấu trúc trên S3 và metadata trên DynamoDB

Quản lý IAM Role và quyền truy cập dịch vụ AWS đúng chuẩn bảo mật

📂 Cấu trúc thư mục (ví dụ)
SecureFileVault/
├── frontend/          # Mã nguồn React hoặc giao diện web
├── lambda/            # Mã nguồn hàm AWS Lambda
├── dynamodb/          # Cấu hình DynamoDB table
├── docs/              # Tài liệu hướng dẫn và sơ đồ kiến trúc
└── README.md          # Tệp mô tả dự án

🚀 Hướng phát triển tiếp theo

Bổ sung mã hóa dữ liệu đầu cuối (end-to-end encryption)

Thêm chức năng chia sẻ tệp có kiểm soát

Xây dựng bảng điều khiển (dashboard) cho quản trị viên

Tích hợp thêm CloudWatch để giám sát hoạt động hệ thống
