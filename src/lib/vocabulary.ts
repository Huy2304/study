export type VocabularyLevel = "A1" | "A2" | "B1";
export type VocabularyCategory =
    | "daily"
    | "home"
    | "school"
    | "food"
    | "travel"
    | "health"
    | "work"
    | "feelings"
    | "communication"
    | "environment"
    | "learning"
    | "technology";

export interface VocabularyItem {
    id: string;
    english: string;
    vietnamese: string;
    level: VocabularyLevel;
    category: VocabularyCategory;
}

export const VOCABULARY_LEVELS: Array<{
    id: VocabularyLevel;
    label: string;
    description: string;
}> = [
    { id: "A1", label: "A1", description: "Nền tảng" },
    { id: "A2", label: "A2", description: "Giao tiếp" },
    { id: "B1", label: "B1", description: "Mở rộng" },
];

export const VOCABULARY_CATEGORIES: Array<{
    id: VocabularyCategory;
    label: string;
    level: VocabularyLevel;
}> = [
    { id: "daily", label: "Hằng ngày", level: "A1" },
    { id: "home", label: "Nhà cửa", level: "A1" },
    { id: "school", label: "Trường học", level: "A1" },
    { id: "food", label: "Ăn uống", level: "A1" },
    { id: "travel", label: "Du lịch", level: "A2" },
    { id: "health", label: "Sức khỏe", level: "A2" },
    { id: "work", label: "Công việc", level: "A2" },
    { id: "feelings", label: "Cảm xúc", level: "A2" },
    { id: "communication", label: "Giao tiếp", level: "B1" },
    { id: "environment", label: "Môi trường", level: "B1" },
    { id: "learning", label: "Học tập", level: "B1" },
    { id: "technology", label: "Công nghệ", level: "B1" },
];

function createPack(
    prefix: string,
    level: VocabularyLevel,
    category: VocabularyCategory,
    entries: Array<[english: string, vietnamese: string]>
): VocabularyItem[] {
    return entries.map(([english, vietnamese], index) => ({
        id: `${prefix}-${index + 1}`,
        english,
        vietnamese,
        level,
        category,
    }));
}

export const VOCABULARY: VocabularyItem[] = [
    ...createPack("a1-daily", "A1", "daily", [
        ["hello", "xin chào"], ["goodbye", "tạm biệt"],
        ["please", "làm ơn"], ["thank you", "cảm ơn"],
        ["sorry", "xin lỗi"], ["welcome", "chào mừng"],
        ["yes", "có / vâng"], ["no", "không"],
        ["maybe", "có lẽ"], ["always", "luôn luôn"],
        ["never", "không bao giờ"], ["today", "hôm nay"],
        ["tomorrow", "ngày mai"], ["yesterday", "hôm qua"],
        ["morning", "buổi sáng"], ["evening", "buổi tối"],
        ["friend", "bạn bè"], ["family", "gia đình"],
        ["child", "trẻ em"], ["parent", "cha hoặc mẹ"],
    ]),
    ...createPack("a1-home", "A1", "home", [
        ["house", "ngôi nhà"], ["room", "căn phòng"],
        ["kitchen", "nhà bếp"], ["bathroom", "phòng tắm"],
        ["bedroom", "phòng ngủ"], ["door", "cánh cửa"],
        ["window", "cửa sổ"], ["table", "cái bàn"],
        ["chair", "cái ghế"], ["bed", "cái giường"],
        ["light", "đèn / ánh sáng"], ["key", "chìa khóa"],
        ["clean", "sạch"], ["dirty", "bẩn"],
        ["near", "gần"], ["far", "xa"],
        ["inside", "bên trong"], ["outside", "bên ngoài"],
        ["floor", "sàn nhà"], ["garden", "khu vườn"],
    ]),
    ...createPack("a1-school", "A1", "school", [
        ["school", "trường học"], ["teacher", "giáo viên"],
        ["student", "học sinh"], ["class", "lớp học"],
        ["lesson", "bài học"], ["book", "sách"],
        ["notebook", "vở ghi"], ["pen", "bút mực"],
        ["pencil", "bút chì"], ["eraser", "cục tẩy"],
        ["ruler", "thước kẻ"], ["question", "câu hỏi"],
        ["answer", "câu trả lời"], ["read", "đọc"],
        ["write", "viết"], ["learn", "học"],
        ["study", "học bài"], ["language", "ngôn ngữ"],
        ["homework", "bài tập về nhà"], ["test", "bài kiểm tra"],
    ]),
    ...createPack("a1-food", "A1", "food", [
        ["food", "thức ăn"], ["water", "nước"],
        ["bread", "bánh mì"], ["rice", "cơm / gạo"],
        ["fruit", "trái cây"], ["vegetable", "rau củ"],
        ["meat", "thịt"], ["fish", "cá"],
        ["egg", "trứng"], ["milk", "sữa"],
        ["sugar", "đường"], ["salt", "muối"],
        ["hungry", "đói"], ["thirsty", "khát"],
        ["breakfast", "bữa sáng"], ["lunch", "bữa trưa"],
        ["dinner", "bữa tối"], ["cook", "nấu ăn"],
        ["delicious", "ngon"], ["restaurant", "nhà hàng"],
    ]),
    ...createPack("a2-travel", "A2", "travel", [
        ["airport", "sân bay"], ["ticket", "vé"],
        ["passport", "hộ chiếu"], ["suitcase", "va li"],
        ["hotel", "khách sạn"], ["reservation", "đặt chỗ"],
        ["map", "bản đồ"], ["journey", "chuyến đi"],
        ["arrive", "đến nơi"], ["leave", "rời đi"],
        ["return", "quay trở lại"], ["direction", "phương hướng"],
        ["station", "ga / trạm"], ["platform", "sân ga"],
        ["luggage", "hành lý"], ["tourist", "khách du lịch"],
        ["guide", "hướng dẫn viên"], ["local", "địa phương"],
        ["abroad", "nước ngoài"], ["explore", "khám phá"],
    ]),
    ...createPack("a2-health", "A2", "health", [
        ["healthy", "khỏe mạnh"], ["illness", "bệnh tật"],
        ["headache", "đau đầu"], ["fever", "sốt"],
        ["medicine", "thuốc"], ["doctor", "bác sĩ"],
        ["nurse", "y tá"], ["hospital", "bệnh viện"],
        ["exercise", "tập thể dục"], ["rest", "nghỉ ngơi"],
        ["sleep", "ngủ"], ["energy", "năng lượng"],
        ["pain", "cơn đau"], ["injury", "chấn thương"],
        ["improve", "cải thiện"], ["recover", "hồi phục"],
        ["habit", "thói quen"], ["balanced", "cân bằng"],
        ["stress", "căng thẳng"], ["relax", "thư giãn"],
    ]),
    ...createPack("a2-work", "A2", "work", [
        ["job", "công việc"], ["office", "văn phòng"],
        ["meeting", "cuộc họp"], ["project", "dự án"],
        ["schedule", "lịch trình"], ["deadline", "hạn chót"],
        ["colleague", "đồng nghiệp"], ["manager", "quản lý"],
        ["customer", "khách hàng"], ["salary", "lương"],
        ["interview", "phỏng vấn"], ["career", "sự nghiệp"],
        ["task", "nhiệm vụ"], ["report", "báo cáo"],
        ["organize", "sắp xếp"], ["prepare", "chuẩn bị"],
        ["attend", "tham dự"], ["decision", "quyết định"],
        ["responsibility", "trách nhiệm"], ["achieve", "đạt được"],
    ]),
    ...createPack("a2-feelings", "A2", "feelings", [
        ["happy", "vui"], ["sad", "buồn"],
        ["excited", "hào hứng"], ["worried", "lo lắng"],
        ["angry", "tức giận"], ["proud", "tự hào"],
        ["embarrassed", "xấu hổ"], ["surprised", "ngạc nhiên"],
        ["nervous", "hồi hộp"], ["calm", "bình tĩnh"],
        ["confident", "tự tin"], ["disappointed", "thất vọng"],
        ["grateful", "biết ơn"], ["lonely", "cô đơn"],
        ["curious", "tò mò"], ["brave", "dũng cảm"],
        ["patient", "kiên nhẫn"], ["kind", "tử tế"],
        ["helpful", "hay giúp đỡ"], ["honest", "trung thực"],
    ]),
    ...createPack("b1-communication", "B1", "communication", [
        ["discuss", "thảo luận"], ["explain", "giải thích"],
        ["describe", "miêu tả"], ["suggest", "đề xuất"],
        ["agree", "đồng ý"], ["disagree", "không đồng ý"],
        ["opinion", "ý kiến"], ["reason", "lý do"],
        ["example", "ví dụ"], ["message", "tin nhắn"],
        ["conversation", "cuộc trò chuyện"], ["relationship", "mối quan hệ"],
        ["persuade", "thuyết phục"], ["announce", "thông báo"],
        ["respond", "phản hồi"], ["recommend", "khuyên dùng"],
        ["clarify", "làm rõ"], ["negotiate", "đàm phán"],
        ["communicate", "giao tiếp"], ["feedback", "phản hồi góp ý"],
    ]),
    ...createPack("b1-environment", "B1", "environment", [
        ["environment", "môi trường"], ["pollution", "ô nhiễm"],
        ["recycle", "tái chế"], ["waste", "rác thải"],
        ["protect", "bảo vệ"], ["climate", "khí hậu"],
        ["resource", "tài nguyên"], ["energy", "năng lượng"],
        ["solar", "thuộc năng lượng mặt trời"], ["forest", "rừng"],
        ["wildlife", "động vật hoang dã"], ["drought", "hạn hán"],
        ["flood", "lũ lụt"], ["reduce", "giảm"],
        ["reuse", "tái sử dụng"], ["sustainable", "bền vững"],
        ["temperature", "nhiệt độ"], ["weather", "thời tiết"],
        ["natural", "tự nhiên"], ["global", "toàn cầu"],
    ]),
    ...createPack("b1-learning", "B1", "learning", [
        ["knowledge", "kiến thức"], ["skill", "kỹ năng"],
        ["progress", "tiến bộ"], ["practice", "luyện tập"],
        ["challenge", "thử thách"], ["solution", "giải pháp"],
        ["research", "nghiên cứu"], ["article", "bài viết"],
        ["source", "nguồn"], ["evidence", "bằng chứng"],
        ["method", "phương pháp"], ["goal", "mục tiêu"],
        ["focus", "tập trung"], ["review", "ôn tập"],
        ["memorize", "ghi nhớ"], ["compare", "so sánh"],
        ["analyze", "phân tích"], ["creative", "sáng tạo"],
        ["independent", "độc lập"], ["effective", "hiệu quả"],
    ]),
    ...createPack("b1-technology", "B1", "technology", [
        ["technology", "công nghệ"], ["device", "thiết bị"],
        ["software", "phần mềm"], ["website", "trang web"],
        ["password", "mật khẩu"], ["privacy", "quyền riêng tư"],
        ["download", "tải xuống"], ["upload", "tải lên"],
        ["network", "mạng"], ["online", "trực tuyến"],
        ["digital", "kỹ thuật số"], ["update", "cập nhật"],
        ["feature", "tính năng"], ["account", "tài khoản"],
        ["data", "dữ liệu"], ["search", "tìm kiếm"],
        ["connect", "kết nối"], ["secure", "an toàn"],
        ["virtual", "ảo"], ["artificial", "nhân tạo"],
    ]),
];

export function getCategoryLabel(category: VocabularyCategory) {
    return (
        VOCABULARY_CATEGORIES.find((item) => item.id === category)
            ?.label ?? category
    );
}
