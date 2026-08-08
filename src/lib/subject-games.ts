export type SubjectGameId =
    | "history"
    | "geography"
    | "literature"
    | "science"
    | "informatics"
    | "life-skills";

export interface SubjectQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
}

export interface SubjectGame {
    id: SubjectGameId;
    title: string;
    shortTitle: string;
    description: string;
    playHint: string;
    questions: SubjectQuestion[];
}

export const SUBJECT_GAMES: Record<SubjectGameId, SubjectGame> = {
    history: {
        id: "history",
        title: "Sử Việt 60s",
        shortTitle: "Lịch sử",
        description: "Xếp đúng mốc thời gian và sự kiện lịch sử Việt Nam.",
        playHint: "Chọn đúng sự kiện hoặc mốc thời gian trước khi hết giờ.",
        questions: [
            {
                question: "Chiến thắng Bạch Đằng năm 938 gắn với vị anh hùng nào?",
                options: ["Ngô Quyền", "Lý Thường Kiệt", "Trần Hưng Đạo", "Quang Trung"],
                correctAnswer: "Ngô Quyền",
                explanation: "Ngô Quyền lãnh đạo chiến thắng Bạch Đằng năm 938, chấm dứt hơn một nghìn năm Bắc thuộc.",
            },
            {
                question: "Chiến thắng Điện Biên Phủ diễn ra vào năm nào?",
                options: ["1945", "1954", "1975", "1986"],
                correctAnswer: "1954",
                explanation: "Chiến thắng Điện Biên Phủ năm 1954 là mốc quan trọng của cuộc kháng chiến chống Pháp.",
            },
            {
                question: "Cách mạng tháng Tám thành công vào năm nào?",
                options: ["1930", "1945", "1954", "1975"],
                correctAnswer: "1945",
                explanation: "Cách mạng tháng Tám năm 1945 giành chính quyền về tay nhân dân.",
            },
            {
                question: "Quốc khánh Việt Nam là ngày nào?",
                options: ["30/4", "2/9", "20/11", "22/12"],
                correctAnswer: "2/9",
                explanation: "Ngày 2/9/1945, Chủ tịch Hồ Chí Minh đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình.",
            },
            {
                question: "Văn Miếu – Quốc Tử Giám được xây dựng đầu tiên dưới triều đại nào?",
                options: ["Nhà Lý", "Nhà Trần", "Nhà Lê", "Nhà Nguyễn"],
                correctAnswer: "Nhà Lý",
                explanation: "Văn Miếu được lập năm 1070 dưới triều Lý Thánh Tông.",
            },
            {
                question: "Vị vua đặt quốc hiệu Đại Cồ Việt là ai?",
                options: ["Đinh Tiên Hoàng", "Lê Hoàn", "Lý Công Uẩn", "Trần Thái Tông"],
                correctAnswer: "Đinh Tiên Hoàng",
                explanation: "Năm 968, Đinh Tiên Hoàng đặt quốc hiệu Đại Cồ Việt và đóng đô ở Hoa Lư.",
            },
            {
                question: "Chiến thắng Ngọc Hồi – Đống Đa gắn với nhân vật nào?",
                options: ["Quang Trung", "Nguyễn Trãi", "Trần Quốc Toản", "Phan Bội Châu"],
                correctAnswer: "Quang Trung",
                explanation: "Quang Trung lãnh đạo nghĩa quân Tây Sơn đại phá quân Thanh mùa xuân năm 1789.",
            },
            {
                question: "Ngày Giải phóng miền Nam, thống nhất đất nước là?",
                options: ["19/8/1945", "2/9/1945", "30/4/1975", "7/5/1954"],
                correctAnswer: "30/4/1975",
                explanation: "Ngày 30/4/1975 đánh dấu thắng lợi của cuộc Tổng tiến công và nổi dậy mùa Xuân.",
            },
        ],
    },
    geography: {
        id: "geography",
        title: "Bản đồ tốc độ",
        shortTitle: "Địa lý",
        description: "Khám phá Việt Nam và thế giới qua các câu hỏi bản đồ ngắn.",
        playHint: "Nhìn nhanh dữ kiện địa lý và chọn đáp án chính xác.",
        questions: [
            {
                question: "Thủ đô của Việt Nam là thành phố nào?",
                options: ["Hà Nội", "Hải Phòng", "Đà Nẵng", "Cần Thơ"],
                correctAnswer: "Hà Nội",
                explanation: "Hà Nội là thủ đô của nước Cộng hòa xã hội chủ nghĩa Việt Nam.",
            },
            {
                question: "Đỉnh núi cao nhất Việt Nam là?",
                options: ["Fansipan", "Ngọc Linh", "Tây Côn Lĩnh", "Bạch Mã"],
                correctAnswer: "Fansipan",
                explanation: "Fansipan thuộc dãy Hoàng Liên Sơn, thường được gọi là nóc nhà Đông Dương.",
            },
            {
                question: "Đồng bằng lớn nhất Việt Nam là?",
                options: ["Đồng bằng sông Cửu Long", "Đồng bằng sông Hồng", "Đồng bằng Thanh – Nghệ – Tĩnh", "Đồng bằng duyên hải miền Trung"],
                correctAnswer: "Đồng bằng sông Cửu Long",
                explanation: "Đồng bằng sông Cửu Long có diện tích lớn nhất nước ta.",
            },
            {
                question: "Thành phố nào nằm bên sông Hương?",
                options: ["Huế", "Hội An", "Nha Trang", "Hạ Long"],
                correctAnswer: "Huế",
                explanation: "Sông Hương chảy qua thành phố Huế, tỉnh Thừa Thiên Huế.",
            },
            {
                question: "Quần đảo Hoàng Sa thuộc thành phố trực thuộc trung ương nào?",
                options: ["Đà Nẵng", "Hải Phòng", "Hồ Chí Minh", "Cần Thơ"],
                correctAnswer: "Đà Nẵng",
                explanation: "Về đơn vị hành chính, huyện Hoàng Sa thuộc thành phố Đà Nẵng.",
            },
            {
                question: "Châu lục có diện tích lớn nhất là?",
                options: ["Châu Á", "Châu Âu", "Châu Phi", "Châu Mỹ"],
                correctAnswer: "Châu Á",
                explanation: "Châu Á là châu lục có diện tích và dân số lớn nhất thế giới.",
            },
            {
                question: "Đại dương lớn nhất Trái Đất là?",
                options: ["Thái Bình Dương", "Đại Tây Dương", "Ấn Độ Dương", "Bắc Băng Dương"],
                correctAnswer: "Thái Bình Dương",
                explanation: "Thái Bình Dương là đại dương có diện tích lớn nhất.",
            },
            {
                question: "Đà Lạt nổi tiếng với kiểu khí hậu nào?",
                options: ["Mát mẻ quanh năm", "Nóng khô quanh năm", "Băng giá quanh năm", "Nóng ẩm quanh năm"],
                correctAnswer: "Mát mẻ quanh năm",
                explanation: "Nhờ độ cao địa hình, Đà Lạt có khí hậu mát mẻ hơn nhiều nơi ở Việt Nam.",
            },
        ],
    },
    literature: {
        id: "literature",
        title: "Thám tử câu chữ",
        shortTitle: "Ngữ văn",
        description: "Săn từ loại, biện pháp tu từ và cách dùng từ đúng.",
        playHint: "Đọc kỹ một chi tiết nhỏ trước khi chốt đáp án.",
        questions: [
            {
                question: "Từ nào được viết đúng chính tả?",
                options: ["sẵn sàng", "sẳn sàng", "sẳn xàng", "sẵng sàng"],
                correctAnswer: "sẵn sàng",
                explanation: "Cách viết đúng là “sẵn sàng”.",
            },
            {
                question: "Trong câu “Mặt hồ phẳng như gương”, biện pháp tu từ là gì?",
                options: ["So sánh", "Nhân hóa", "Ẩn dụ", "Điệp ngữ"],
                correctAnswer: "So sánh",
                explanation: "Từ “như” đặt hai sự vật cạnh nhau là dấu hiệu của so sánh.",
            },
            {
                question: "Từ nào là động từ?",
                options: ["chạy", "bầu trời", "xanh", "rất"],
                correctAnswer: "chạy",
                explanation: "“Chạy” chỉ hoạt động nên là động từ.",
            },
            {
                question: "Từ nào là tính từ?",
                options: ["chăm chỉ", "học tập", "quyển vở", "bởi vì"],
                correctAnswer: "chăm chỉ",
                explanation: "“Chăm chỉ” nêu đặc điểm, tính chất nên là tính từ.",
            },
            {
                question: "Câu nào dùng dấu câu phù hợp?",
                options: ["Bạn đã làm bài tập chưa?", "Bạn đã làm bài tập chưa.", "Bạn, đã làm bài tập chưa!", "Bạn đã, làm bài tập chưa?"],
                correctAnswer: "Bạn đã làm bài tập chưa?",
                explanation: "Câu hỏi kết thúc bằng dấu chấm hỏi và không ngắt sai chủ ngữ – vị ngữ.",
            },
            {
                question: "Trong câu “Cây bàng dang tay che nắng”, cây bàng được dùng biện pháp gì?",
                options: ["Nhân hóa", "So sánh", "Liệt kê", "Nói quá"],
                correctAnswer: "Nhân hóa",
                explanation: "“Dang tay” là hoạt động của con người được gán cho cây bàng.",
            },
            {
                question: "Từ nào là từ láy?",
                options: ["lung linh", "học sinh", "xe đạp", "sách vở"],
                correctAnswer: "lung linh",
                explanation: "“Lung linh” có sự lặp lại âm tạo sắc thái gợi hình.",
            },
            {
                question: "Câu nào có chủ ngữ rõ ràng?",
                options: ["Lan đang đọc sách.", "Đang đọc sách.", "Rất chăm chỉ.", "Ở ngoài sân."],
                correctAnswer: "Lan đang đọc sách.",
                explanation: "“Lan” là chủ ngữ, nêu người thực hiện hoạt động đọc sách.",
            },
        ],
    },
    science: {
        id: "science",
        title: "Phòng thí nghiệm mini",
        shortTitle: "Khoa học",
        description: "Dự đoán hiện tượng Vật lý, Hóa học và Sinh học.",
        playHint: "Quan sát hiện tượng, rồi chọn kết luận khoa học đúng.",
        questions: [
            {
                question: "Ở áp suất khí quyển chuẩn, nước sôi ở khoảng bao nhiêu °C?",
                options: ["100°C", "0°C", "50°C", "200°C"],
                correctAnswer: "100°C",
                explanation: "Ở điều kiện áp suất khí quyển chuẩn, nước sôi ở 100°C.",
            },
            {
                question: "Chất nào dẫn điện tốt?",
                options: ["Đồng", "Gỗ khô", "Nhựa", "Cao su"],
                correctAnswer: "Đồng",
                explanation: "Đồng là kim loại và dẫn điện tốt.",
            },
            {
                question: "Cây xanh cần yếu tố nào để quang hợp?",
                options: ["Ánh sáng", "Âm thanh", "Gió mạnh", "Bóng tối"],
                correctAnswer: "Ánh sáng",
                explanation: "Ánh sáng là một điều kiện cần để cây thực hiện quang hợp.",
            },
            {
                question: "Khí nào cần thiết cho sự cháy?",
                options: ["Oxy", "Nitơ", "Carbon dioxide", "Hơi nước"],
                correctAnswer: "Oxy",
                explanation: "Oxy duy trì sự cháy; khi thiếu oxy, ngọn lửa sẽ tắt.",
            },
            {
                question: "Lực hút các vật về phía Trái Đất được gọi là?",
                options: ["Trọng lực", "Lực ma sát", "Lực đàn hồi", "Lực đẩy"],
                correctAnswer: "Trọng lực",
                explanation: "Trọng lực là lực hút của Trái Đất tác dụng lên vật.",
            },
            {
                question: "Hiện tượng nước đá chuyển thành nước lỏng là?",
                options: ["Nóng chảy", "Đông đặc", "Bay hơi", "Ngưng tụ"],
                correctAnswer: "Nóng chảy",
                explanation: "Chất rắn chuyển sang thể lỏng được gọi là nóng chảy.",
            },
            {
                question: "Bộ phận nào của cây chủ yếu hấp thụ nước và muối khoáng?",
                options: ["Rễ", "Hoa", "Quả", "Lá"],
                correctAnswer: "Rễ",
                explanation: "Rễ, đặc biệt là miền lông hút, hấp thụ nước và muối khoáng từ đất.",
            },
            {
                question: "Khi thả một vật vào nước, vật nổi khi nào?",
                options: ["Khối lượng riêng của vật nhỏ hơn nước", "Vật có màu sáng", "Nước thật lạnh", "Vật luôn có hình tròn"],
                correctAnswer: "Khối lượng riêng của vật nhỏ hơn nước",
                explanation: "Một vật có thể nổi khi khối lượng riêng trung bình của nó nhỏ hơn khối lượng riêng của nước.",
            },
        ],
    },
    informatics: {
        id: "informatics",
        title: "Code Flow",
        shortTitle: "Tin học",
        description: "Tìm quy luật, sắp xếp thuật toán và đọc code giả.",
        playHint: "Hãy lần lượt đọc dữ liệu vào, xử lý rồi mới đến kết quả.",
        questions: [
            {
                question: "Thứ tự cơ bản của một chương trình thường là?",
                options: ["Nhập → xử lý → xuất", "Xuất → nhập → xử lý", "Xử lý → xuất → nhập", "In → xóa → tắt"],
                correctAnswer: "Nhập → xử lý → xuất",
                explanation: "Chương trình thường nhận dữ liệu vào, xử lý rồi đưa ra kết quả.",
            },
            {
                question: "Câu lệnh điều kiện thường dùng để làm gì?",
                options: ["Chọn việc làm khi điều kiện đúng/sai", "Lưu ảnh", "Tắt máy", "Mở trình duyệt"],
                correctAnswer: "Chọn việc làm khi điều kiện đúng/sai",
                explanation: "Câu lệnh điều kiện giúp chương trình rẽ nhánh theo một điều kiện.",
            },
            {
                question: "Vòng lặp dùng để làm gì?",
                options: ["Lặp lại một nhóm lệnh", "Đổi màu màn hình", "Xóa bàn phím", "Tạo mật khẩu"],
                correctAnswer: "Lặp lại một nhóm lệnh",
                explanation: "Vòng lặp giúp thực hiện lại một hay nhiều lệnh theo số lần hoặc điều kiện.",
            },
            {
                question: "Hệ nhị phân dùng những chữ số nào?",
                options: ["0 và 1", "0 đến 9", "A và B", "1 và 2"],
                correctAnswer: "0 và 1",
                explanation: "Hệ nhị phân có cơ số 2, chỉ gồm hai chữ số 0 và 1.",
            },
            {
                question: "Mật khẩu nào an toàn hơn?",
                options: ["M!nhHoc2026#", "123456", "ngaysinh", "password"],
                correctAnswer: "M!nhHoc2026#",
                explanation: "Mật khẩu mạnh nên dài và kết hợp chữ hoa, chữ thường, số, ký tự đặc biệt.",
            },
            {
                question: "Trong sơ đồ khối, hình thoi thường biểu diễn gì?",
                options: ["Điều kiện/rẽ nhánh", "Bắt đầu hoặc kết thúc", "Nhập xuất dữ liệu", "Xử lý"],
                correctAnswer: "Điều kiện/rẽ nhánh",
                explanation: "Hình thoi trong sơ đồ khối thường biểu diễn một điều kiện cần kiểm tra.",
            },
            {
                question: "Thuật toán là gì?",
                options: ["Dãy bước rõ ràng để giải một việc", "Một loại máy tính", "Tên của mạng xã hội", "Một trò chơi"],
                correctAnswer: "Dãy bước rõ ràng để giải một việc",
                explanation: "Thuật toán mô tả các bước hữu hạn, rõ ràng để giải quyết một bài toán.",
            },
            {
                question: "Khi nhận email lạ có đường link đáng ngờ, bạn nên làm gì?",
                options: ["Không bấm link và kiểm tra người gửi", "Bấm ngay để xem", "Gửi tiếp cho mọi người", "Cung cấp mật khẩu"],
                correctAnswer: "Không bấm link và kiểm tra người gửi",
                explanation: "Không mở liên kết đáng ngờ giúp giảm nguy cơ lừa đảo và mất tài khoản.",
            },
        ],
    },
    "life-skills": {
        id: "life-skills",
        title: "Quyết định trong 10 giây",
        shortTitle: "Kỹ năng sống",
        description: "Xử lý nhanh tình huống học đường, an toàn và số.",
        playHint: "Chọn phương án an toàn, tôn trọng và có trách nhiệm nhất.",
        questions: [
            {
                question: "Đèn giao thông màu đỏ, bạn nên?",
                options: ["Dừng lại", "Đi nhanh qua", "Đi nếu đường vắng", "Bấm còi liên tục"],
                correctAnswer: "Dừng lại",
                explanation: "Đèn đỏ yêu cầu người tham gia giao thông phải dừng lại đúng vạch quy định.",
            },
            {
                question: "Bạn nhận tin nhắn xin mật khẩu tài khoản. Cách xử lý an toàn là?",
                options: ["Không chia sẻ mật khẩu", "Gửi ngay cho họ", "Đăng mật khẩu công khai", "Dùng chung mật khẩu với mọi người"],
                correctAnswer: "Không chia sẻ mật khẩu",
                explanation: "Mật khẩu là thông tin riêng tư, không nên chia sẻ qua tin nhắn.",
            },
            {
                question: "Khi thấy bạn bị bắt nạt trên mạng, bạn nên?",
                options: ["Lưu bằng chứng và báo người lớn tin cậy", "Hùa theo bình luận", "Chia sẻ rộng hơn", "Im lặng rồi gửi lại cho bạn khác"],
                correctAnswer: "Lưu bằng chứng và báo người lớn tin cậy",
                explanation: "Lưu bằng chứng và tìm hỗ trợ từ người lớn đáng tin cậy là cách xử lý an toàn.",
            },
            {
                question: "Khi căng thẳng trước bài kiểm tra, việc nào hữu ích nhất?",
                options: ["Hít thở chậm và chia nhỏ việc cần làm", "Bỏ ăn, bỏ ngủ", "Tự trách bản thân", "Lướt mạng cả đêm"],
                correctAnswer: "Hít thở chậm và chia nhỏ việc cần làm",
                explanation: "Điều hòa nhịp thở và lập bước nhỏ giúp giảm căng thẳng, dễ bắt đầu hơn.",
            },
            {
                question: "Nếu có cháy trong phòng, ưu tiên đầu tiên là?",
                options: ["Báo động và thoát ra theo lối an toàn", "Trốn trong tủ", "Quay lại lấy đồ", "Dùng thang máy"],
                correctAnswer: "Báo động và thoát ra theo lối an toàn",
                explanation: "Cần báo động, rời khỏi khu vực nguy hiểm theo lối thoát hiểm; không dùng thang máy khi cháy.",
            },
            {
                question: "Khi làm việc nhóm, cách nào tôn trọng mọi người hơn?",
                options: ["Lắng nghe và phân chia việc rõ ràng", "Làm hết rồi trách bạn", "Ngắt lời liên tục", "Không phản hồi tin nhắn"],
                correctAnswer: "Lắng nghe và phân chia việc rõ ràng",
                explanation: "Lắng nghe và thống nhất trách nhiệm giúp nhóm hợp tác hiệu quả.",
            },
            {
                question: "Một người lạ rủ bạn đi nơi khác mà không báo gia đình. Bạn nên?",
                options: ["Từ chối và báo người lớn tin cậy", "Đi ngay", "Giữ bí mật", "Lên xe nếu họ hứa tặng quà"],
                correctAnswer: "Từ chối và báo người lớn tin cậy",
                explanation: "Không đi cùng người lạ; hãy tìm sự hỗ trợ từ người lớn tin cậy.",
            },
            {
                question: "Thông tin nào không nên đăng công khai?",
                options: ["Địa chỉ nhà và mật khẩu", "Sở thích đọc sách", "Một bức ảnh phong cảnh", "Mục tiêu học tập"],
                correctAnswer: "Địa chỉ nhà và mật khẩu",
                explanation: "Địa chỉ và mật khẩu là thông tin nhạy cảm, cần được bảo vệ.",
            },
        ],
    },
};
