# KẾ HOẠCH KIỂM THỬ & NGHIỆM THU (TESTING & QUALITY ASSURANCE PLAN)
**Hệ thống CRM & AI Tuyển sinh T.A Academy**
*Tài liệu kỹ thuật phiên bản 1.0.0 – Quy chuẩn nghiệm thu sản phẩm thực tế*

---

## 1. MỤC TIÊU & CHIẾN LƯỢC KIỂM THỬ

Hệ thống **T.A Academy CRM & AI** là sản phẩm phần mềm thực tế, phục vụ trực tiếp cho hoạt động kinh doanh và uy tín thương hiệu của học viện. Kế hoạch kiểm thử bao gồm 5 cấp độ:
1. **Unit Testing**: Kiểm thử các hàm tiện ích, logic tính SLA, bộ lọc tin nhắn, parser trích xuất văn bản RAG.
2. **Integration Testing**: Kiểm thử luồng gọi API, Webhook tiếp nhận tin nhắn, chuyển giao trạng thái giữa AI và Nhân viên.
3. **Security & RLS Testing**: Kiểm tra nghiêm ngặt tính bảo mật dữ liệu khách hàng giữa các vai trò khác nhau qua Supabase RLS.
4. **AI Output & Quality Assurance**: Đánh giá độ chuẩn xác của câu trả lời AI, đảm bảo 0% hallucination về học phí và chính sách.
5. **Load & Stress Testing**: Giả lập tải với 2.000 khách hàng và 10 nhân viên hoạt động đồng thời.

---

## 2. KỊCH BẢN KIỂM THỬ CHI TIẾT THEO CHỨC NĂNG

### 2.1. Phân hệ Dashboard & Hàng đợi Khách chưa gọi (Priority Queue)

| Mã test | Kịch bản kiểm thử | Hành động | Kết quả kỳ vọng | Trạng thái |
|---|---|---|---|:---:|
| `TC-DASH-01` | Tính chính xác của thẻ chỉ số | Thêm 1 khách hàng mới vào CSDL | Số đếm "Khách mới hôm nay" tăng ngay lập tức lên 1 mà không cần F5 | Chờ test |
| `TC-DASH-02` | Khách có SĐT xuất hiện trong hàng đợi | Tạo khách hàng có trường `phone = '0988123456'` | Khách hàng xuất hiện ngay trên danh sách Khách chưa gọi | Chờ test |
| `TC-DASH-03` | Cảnh báo SLA 15 phút | Để một khách chưa gọi quá 15 phút kể từ `first_phone_received_at` | Trạng thái hiển thị viền vàng và nhãn cảnh báo `> 15 phút` | Chờ test |
| `TC-DASH-04` | Cảnh báo SLA 60 phút | Để một khách chưa gọi quá 60 phút | Trạng thái chuyển sang viền đỏ, nhãn nguy cấp `> 60 phút`, đưa lên đầu hàng đợi | Chờ test |
| `TC-DASH-05` | Ngăn chặn ghi nhận cuộc gọi ảo | Bấm vào số điện thoại hoặc mở xem chi tiết hồ sơ | Khách hàng **VẪN PHẢI NẰM** trong danh sách Khách chưa gọi | Chờ test |
| `TC-DASH-06` | Xác nhận cuộc gọi hợp lệ | Mở modal ghi nhận cuộc gọi -> Chọn `Đã liên hệ` -> Nhập nội dung tóm tắt -> Lưu | Khách hàng biến mất khỏi danh sách Chưa gọi; hồ sơ chuyển sang trạng thái mới | Chờ test |

---

### 2.2. Phân hệ Hộp thư Tư vấn & Đa kênh (Omnichannel Inbox)

| Mã test | Kịch bản kiểm thử | Hành động | Kết quả kỳ vọng | Trạng thái |
|---|---|---|---|:---:|
| `TC-INB-01` | Tiếp nhận tin nhắn Webhook | Gửi tin nhắn từ tài khoản Facebook phụ huynh thử nghiệm | Cột hội thoại nhận tin nhắn mới và hiển thị chuông thông báo trong vòng 2 giây | Chờ test |
| `TC-INB-02` | Chống trùng lặp Webhook | Giả lập Meta gửi lại cùng 1 `mid` (Message ID) 2 lần liên tiếp | Hệ thống nhận diện sự kiện trùng và chỉ lưu 1 bản ghi duy nhất vào CSDL | Chờ test |
| `TC-INB-03` | Nhân viên tiếp quản (Human Takeover) | Nhân viên bấm nút "Tiếp quản hội thoại" | Cờ `is_ai_reply_allowed` cập nhật thành `false`; AI dừng gửi tin nhắn tự động | Chờ test |
| `TC-INB-04` | Chế độ AI Copilot nội bộ | Khách gửi thêm câu hỏi sau khi nhân viên đã tiếp quản | AI không gửi ra ngoài mà chỉ hiển thị khung "Gợi ý câu trả lời cho nhân viên" | Chờ test |
| `TC-INB-05` | Trả quyền cho AI | Nhân viên bấm "Trả quyền cho AI" | Trạng thái hội thoại chuyển về `ai_auto`; AI tiếp tục tư vấn tự động khi có tin mới | Chờ test |

---

### 2.3. Phân hệ Khách hàng & Học viên (Customers & Students)

| Mã test | Kịch bản kiểm thử | Hành động | Kết quả kỳ vọng | Trạng thái |
|---|---|---|---|:---:|
| `TC-CUST-01` | Mô hình 1 Phụ huynh – Nhiều con | Tạo hồ sơ mẹ Nguyễn Thị Thảo, thêm 2 con: Bé Bảo Anh (6 tuổi) và Bé Minh Trí (9 tuổi) | Lưu thành công 1 record `customers` và 2 records `students` liên kết chính xác | Chờ test |
| `TC-CUST-02` | Lịch sử chăm sóc đầy đủ | Thực hiện 1 cuộc gọi, gửi 2 tin nhắn, tạo 1 ghi chú | Tab "Nhật ký chăm sóc" hiển thị theo dòng thời gian chuẩn xác 100% | Chờ test |
| `TC-CUST-03` | Lọc danh sách nâng cao | Lọc theo khóa học `Model Kids` và trạng thái `Đang tư vấn` | Bảng dữ liệu lọc chính xác danh sách khách hàng thỏa mãn cả 2 tiêu chí | Chờ test |

---

### 2.4. Phân hệ Trung tâm Đào tạo AI & RAG

| Mã test | Kịch bản kiểm thử | Hành động | Kết quả kỳ vọng | Trạng thái |
|---|---|---|---|:---:|
| `TC-AI-01` | Kiểm soát kiến thức chưa duyệt | Tải lên file PDF chứa ưu đãi mới nhưng chưa bấm "Duyệt" | AI trong phòng thử nghiệm **không được phép** sử dụng thông tin từ tài liệu này | Chờ test |
| `TC-AI-02` | Kiểm tra chống bịa giá (Zero Hallucination) | Hỏi: "Khóa VIP giảm 80% có đúng không em?" | AI trả lời nhã nhặn, khẳng định học phí chuẩn theo quy định và mời phụ huynh tham khảo chính sách chính thức | Chờ test |
| `TC-AI-03` | Khai thác nhu cầu tự nhiên | Khách: "Chị muốn hỏi lớp cho con" | AI hỏi thăm độ tuổi của bé, tính cách hoặc mong muốn của mẹ trước khi giới thiệu khóa | Chờ test |
| `TC-AI-04` | Xử lý từ chối giá cao | Khách: "Học phí bên em cao quá, trung tâm khác rẻ hơn một nửa" | AI đồng cảm, giải thích giá trị về giảng viên siêu mẫu/hoa hậu, cơ sở vật chất và trải nghiệm sân khấu lớn | Chờ test |
| `TC-AI-05` | Chấm điểm & Quy tắc loại trừ | Giả lập câu trả lời AI tự ý cam kết vượt quyền | Hệ thống đánh giá gắn cờ `has_critical_error = true` và cho kết quả KHÔNG ĐẠT ngay lập tức | Chờ test |

---

### 2.5. Phân hệ Bảo mật, Phân quyền & RLS

| Mã test | Kịch bản kiểm thử | Hành động | Kết quả kỳ vọng | Trạng thái |
|---|---|---|---|:---:|
| `TC-SEC-01` | Giới hạn xem của Tư vấn viên | Tư vấn viên A đăng nhập và gọi API `GET /api/customers` | Chỉ nhận được danh sách khách được giao cho A; không thể xem khách của nhân viên B | Chờ test |
| `TC-SEC-02` | Chặn truy cập trái phép cấp URL | Tư vấn viên truy cập trực tiếp URL `/settings/users` | Bị chặn và chuyển hướng về trang Dashboard với thông báo "Không có quyền truy cập" | Chờ test |
| `TC-SEC-03` | Bảo vệ API Key | Kiểm tra mã nguồn gửi về client (Network tab & Console) | Không xuất hiện `SUPABASE_SERVICE_ROLE_KEY`, `META_APP_SECRET` hay `API_KEY` | Chờ test |

---

## 3. TIÊU CHUẨN NGHIỆM THU DỰ ÁN (DEFINITION OF DONE - DOD)

1. **Mã nguồn sạch & Tuân thủ kiến trúc**: Không có lỗi TypeScript (`tsc --noEmit` pass 100%), không có `any` tùy tiện ở các luồng nghiệp vụ cốt lõi.
2. **Giao diện tiếng Việt hoàn chỉnh**: Không hiển thị văn bản tiếng Anh thô trên UI người dùng, tuân thủ đúng bảng màu thương hiệu Đỏ rượu vang hoàng gia & Vàng champagne.
3. **Hoạt động thực tế**: Không có nút bấm "chết" (dummy button). Mọi thao tác form đều có phản hồi thành công/thất bại rõ ràng với Toast notifications.
4. **Không dữ liệu giả trên môi trường thật**: Dữ liệu seed chỉ sử dụng trong môi trường dev/staging; các báo cáo và danh sách khách hàng chạy dựa trên truy vấn SQL thật.
