import postgres from 'postgres';
import 'dotenv/config';

const sql = postgres(process.env.DATABASE_URL, {
  prepare: false,
  ssl: { rejectUnauthorized: false },
});

const articles = [
  {
    title: 'Cách học tập hiệu quả cho sinh viên năm 2026',
    slug: 'cach-hoc-tap-hieu-qua-cho-sinh-vien-nam-2026',
    excerpt: 'Khám phá cách học tập hiệu quả cho sinh viên năm 2026 với phương pháp khoa học, thời gian học hợp lý và công cụ hỗ trợ tăng năng suất.',
    category: 'Học tập',
    coverImage: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    affiliateUrl: '',
    content: `<h2>Vì sao học tập hiệu quả lại quan trọng?</h2><p>Học tập hiệu quả không phải là học nhiều hơn, mà là học đúng cách. Nhiều sinh viên dành hàng giờ để ôn lại bài nhưng vẫn không ghi nhớ tốt vì thiếu phương pháp. Nếu muốn nâng cao hiệu quả học tập, bạn cần thay đổi cách sắp xếp thời gian, cách ghi nhớ và cách sử dụng công cụ hỗ trợ.</p><h2>1. Xác định mục tiêu học tập rõ ràng</h2><p>Trước khi bắt đầu buổi học, hãy đặt mục tiêu cụ thể như “hôm nay học xong 2 chương và làm 15 câu trắc nghiệm”. Mục tiêu rõ ràng giúp bạn tập trung hơn và không bị lạc hướng.</p><h2>2. Chia nhỏ nội dung để học dễ tiếp thu</h2><p>Học theo từng phần nhỏ khiến não bộ dễ tiếp nhận hơn. Bạn nên chia bài dài thành các phần ngắn 20-30 phút, sau đó nghỉ 5-10 phút.</p><h2>3. Tạo lịch học phù hợp</h2><p>Mỗi người có khung giờ học tốt khác nhau. Hãy tìm thời điểm tập trung nhất của mình và duy trì thói quen đó mỗi ngày.</p><h2>4. Ôn tập đều đặn</h2><p>Phương pháp lặp lại ngắt quãng là cách ghi nhớ hiệu quả. Hãy ôn lại sau 1 ngày, 3 ngày và 7 ngày để củng cố thông tin.</p><h2>5. Dùng công cụ hỗ trợ</h2><p>App học tập, lịch học và flashcard giúp quản lý tiến độ, tập trung và ghi nhớ tốt hơn.</p><h2>Kết luận</h2><p>Học tập hiệu quả không cần học quá nhiều, mà cần học đúng cách và đều đặn. Khi có lộ trình rõ ràng, bạn sẽ giảm căng thẳng và học tốt hơn.</p>`,
  },
  {
    title: 'Top app học tập tốt nhất để tăng năng suất',
    slug: 'top-app-hoc-tap-tot-nhat-de-tang-nang-suat',
    excerpt: 'Khám phá các app học tập tốt nhất để quản lý thời gian, tăng tập trung và nâng cao hiệu quả học tập cá nhân.',
    category: 'App',
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    affiliateUrl: '',
    content: `<h2>Vì sao app học tập lại quan trọng?</h2><p>Ứng dụng học tập giúp bạn quản lý thời gian, xây dựng thói quen và tập trung vào mục tiêu. Dùng app đúng cách, bạn có thể tối ưu năng suất học mỗi ngày.</p><h2>1. App quản lý thời gian</h2><p>Những app này giúp bạn lên lịch học rõ ràng và nhắc nhở đúng thời điểm khi cần bắt đầu.</p><h2>2. App ghi chú và tóm tắt</h2><p>Việc ghi chú nhanh và lưu trữ thông tin giúp bạn tiếp cận kiến thức dễ dàng hơn ngay khi cần.</p><h2>3. App flashcard</h2><p>Flashcard cực hiệu quả với các môn học cần nhớ từ vựng, định nghĩa hoặc khái niệm.</p><h2>4. App chặn xao nhãng</h2><p>Với nhiều người, yếu tố khiến học kém chính là thông báo và mạng xã hội. App chặn thông báo giúp tập trung hơn.</p><h2>Kết luận</h2><p>App học tập tốt nhất không phải app nào cũng phù hợp với mọi người. Hãy chọn công cụ hỗ trợ phong cách học của bạn.</p>`,
  },
  {
    title: 'Review 5 công cụ học tập giúp bạn tập trung hơn',
    slug: 'review-5-cong-cu-hoc-tap-giup-ban-tap-trung-hon',
    excerpt: 'Tìm hiểu 5 công cụ học tập hiệu quả giúp bạn tập trung hơn, giảm xao nhãng và cải thiện hiệu suất mỗi ngày.',
    category: 'Review',
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
    affiliateUrl: '',
    content: `<h2>Nhiều người nghĩ chỉ cần động lực là đủ</h2><p>Thực tế, năng suất học tập không chỉ dựa vào ý chí. Môi trường học tập, thời gian và các công cụ hỗ trợ rất quan trọng.</p><h2>1. Công cụ quản lý thời gian</h2><p>Giúp bạn xây dựng lịch học rõ ràng, tránh lãng phí thời gian.</p><h2>2. Công cụ ghi chú</h2><p>Hỗ trợ lưu trữ kiến thức nhanh và trực quan.</p><h2>3. Công cụ flashcard</h2><p>Tăng khả năng ghi nhớ dài hạn.</p><h2>4. Công cụ chặn xao nhãng</h2><p>Giảm mất tập trung từ mạng xã hội và thông báo.</p><h2>5. Công cụ theo dõi tiến độ</h2><p>Cho phép bạn biết mình đã tiến bộ đến đâu.</p><h2>Kết luận</h2><p>Một công cụ tốt sẽ giúp bạn học đều đặn và tập trung hơn. Hãy chọn theo nhu cầu thực tế của mình.</p>`,
  },
  {
    title: 'Phương pháp học tập hiệu quả theo khoa học',
    slug: 'phuong-phap-hoc-tap-hieu-qua-theo-khoa-hoc',
    excerpt: 'Tìm hiểu các phương pháp học tập hiệu quả theo khoa học để ghi nhớ lâu hơn và tăng năng suất mỗi ngày.',
    category: 'Học tập',
    coverImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80',
    affiliateUrl: '',
    content: `<h2>Học hiệu quả theo khoa học</h2><p>Phương pháp học tập hiệu quả tập trung vào cách não bộ tiếp nhận và lưu giữ thông tin. Việc ôn tập đúng cách và nghỉ hợp lý giúp tăng hiệu suất rất rõ.</p><h2>1. Học bằng thực hành</h2><p>Áp dụng kiến thức vào bài tập và ví dụ sẽ giúp bạn ghi nhớ lâu hơn so với đọc thuộc lòng.</p><h2>2. Lặp lại ngắt quãng</h2><p>Hãy ôn lại sau các khoảng thời gian ngắn, sau đó dài hơn để củng cố trí nhớ.</p><h2>3. Không học quá lâu một lần</h2><p>Buổi học 50-60 phút với nghỉ ngắn hiệu quả hơn học 3 tiếng không nghỉ.</p><h2>4. Tạo môi trường học tập tốt</h2><p>Môi trường yên tĩnh, đủ ánh sáng và ít xao nhãng sẽ cải thiện tập trung đáng kể.</p><h2>Kết luận</h2><p>Học hiệu quả không nhất thiết là học nhiều hơn, mà là học đúng cách và đều đặn.</p>`,
  },
  {
    title: 'Cách học tiếng Anh hiệu quả cho người bận rộn',
    slug: 'cach-hoc-tieng-anh-hieu-qua-cho-nguoi-ban-ron',
    excerpt: 'Khám phá cách học tiếng Anh hiệu quả cho người bận rộn với phương pháp đơn giản, bền vững và phù hợp với lối sống hiện đại.',
    category: 'Ngoại ngữ',
    coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    affiliateUrl: '',
    content: `<h2>Học tiếng Anh không cần quá nhiều thời gian</h2><p>Nhiều người nghĩ phải có nhiều thời gian mới học tốt tiếng Anh. Thực tế, học đều đặn mỗi ngày là yếu tố quyết định.</p><h2>1. Đặt mục tiêu cụ thể</h2><p>Hãy xác định mục tiêu bạn muốn đạt như giao tiếp cơ bản, đọc báo, nghe podcast hoặc thi chứng chỉ.</p><h2>2. Học ngắn nhưng đều</h2><p>20-30 phút mỗi ngày hiệu quả hơn học 2 tiếng một lần rồi bỏ dở.</p><h2>3. Kết hợp nhiều kỹ năng</h2><p>Đọc, nghe, nói và viết cùng lúc giúp bạn tiếp thu tự nhiên hơn.</p><h2>4. Dùng app hỗ trợ</h2><p>Flashcard, từ điển và app luyện nghe giúp bạn học nhanh và dễ duy trì.</p><h2>Kết luận</h2><p>Học tiếng Anh hiệu quả là quá trình đều đặn, có mục tiêu và có hệ thống. Bạn không cần thay đổi cả cuộc sống để tiến bộ.</p>`,
  },
  {
    title: 'Xu hướng học tập 2026 đang thay đổi như thế nào?',
    slug: 'xu-huong-hoc-tap-2026-dang-thay-doi-nhu-the-nao',
    excerpt: 'Cập nhật những xu hướng học tập mới nhất năm 2026: AI, học tập cá nhân hóa, linh hoạt và công cụ hỗ trợ học tập hiện đại.',
    category: 'Tin tức',
    coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    affiliateUrl: '',
    content: `<h2>2026 là năm của học tập cá nhân hóa</h2><p>Học tập không còn chỉ là truyền thống lớp học, mà đang chuyển sang mô hình cá nhân hóa, linh hoạt và tập trung vào trải nghiệm người học.</p><h2>1. Học theo năng lực riêng</h2><p>Người học có thể lựa chọn lộ trình học phù hợp với tốc độ và mục tiêu của mình.</p><h2>2. AI hỗ trợ học tập mạnh hơn</h2><p>AI có thể tóm tắt bài, gợi ý kế hoạch học, và giúp giải thích nội dung dễ hiểu hơn.</p><h2>3. Học online linh hoạt hơn</h2><p>Người học có thể học ở bất cứ đâu và bất cứ lúc nào nhờ thiết bị di động và nền tảng trực tuyến.</p><h2>4. Kỹ năng thực tế được ưu tiên</h2><p>Học tập đang hướng tới kỹ năng ứng dụng và giải quyết vấn đề hơn là học thuộc lòng.</p><h2>Kết luận</h2><p>Người học cần thay đổi cách tiếp cận để đồng bộ với xu hướng mới, tận dụng công nghệ và tạo cho mình thói quen học tốt hơn.</p>`,
  },
  {
    title: 'Top 7 app quản lý thời gian học tập hiệu quả nhất',
    slug: 'top-7-app-quan-ly-thoi-gian-hoc-tap-hieu-qua-nhat',
    excerpt: 'Danh sách 7 app quản lý thời gian học tập giúp bạn sắp xếp lịch, tăng tập trung và hoàn thành mục tiêu học tập dễ dàng hơn.',
    category: 'App',
    coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
    affiliateUrl: '',
    content: `<h2>Quản lý thời gian là chìa khóa học tập hiệu quả</h2><p>Không phải ai cũng biết cách sắp xếp thời gian học đúng cách. Một lịch học hợp lý có thể giúp bạn tiến bộ nhanh hơn rất nhiều.</p><h2>1. App nhắc lịch học</h2><p>Giúp bạn duy trì thói quen học đều đặn mà không quên.</p><h2>2. App phân chia nhiệm vụ</h2><p>Phù hợp với người học cần quản lý nhiều môn cùng lúc.</p><h2>3. App ghi lại tiến độ</h2><p>Cho phép bạn biết mình đang đi đúng hướng hay chưa.</p><h2>4. App giảm xao nhãng</h2><p>Giúp bạn tập trung hơn trong các buổi học ngắn nhưng chất lượng.</p><h2>Kết luận</h2><p>Chọn app phù hợp với nhu cầu cá nhân sẽ giúp bạn học tốt hơn mà không áp lực quá nhiều.</p>`,
  },
  {
    title: 'Cách tạo thói quen học tập đều đặn mỗi ngày',
    slug: 'cach-tao-thoi-quen-hoc-tap-deu-dan-moi-ngay',
    excerpt: 'Khám phá cách tạo thói quen học tập đều đặn mỗi ngày để duy trì tiến bộ dài hạn và giảm cảm giác nản chí.',
    category: 'Học tập',
    coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
    affiliateUrl: '',
    content: `<h2>Thói quen là yếu tố quyết định</h2><p>Thói quen học tập tốt giúp bạn tiến bộ đều đặn dù không luôn có động lực. Việc học đều hàng ngày là nền tảng của thành công dài hạn.</p><h2>1. Chọn thời gian học cố định</h2><p>Thời gian học cố định giúp cơ thể và trí óc hình thành nhịp sinh hoạt ổn định.</p><h2>2. Thiết lập mục tiêu nhỏ</h2><p>Thay vì đặt mục tiêu lớn quá, hãy tập trung vào các nhiệm vụ nhỏ, dễ thực hiện.</p><h2>3. Tạo môi trường học hợp lý</h2><p>Môi trường yên tĩnh, đủ sáng và ít xao nhãng là yếu tố then chốt.</p><h2>4. Ghi nhận tiến độ</h2><p>Nhìn lại những ngày đã học sẽ tạo động lực bền vững.</p><h2>Kết luận</h2><p>Thói quen học tập đều đặn không cần quá khó. Chỉ cần bắt đầu và duy trì đúng nhịp, hiệu quả sẽ dần tăng lên.</p>`,
  },
  {
    title: '5 cách tăng năng suất học tập không cần thay đổi cả ngày',
    slug: '5-cach-tang-nang-suat-hoc-tap-khong-can-thay-doi-ca-ngay',
    excerpt: 'Nâng cao năng suất học tập bằng những cách đơn giản, dễ thực hiện trong ngày mà không cần thay đổi cả cuộc sống.',
    category: 'Năng suất',
    coverImage: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80',
    affiliateUrl: '',
    content: `<h2>Năng suất học không chỉ là việc học nhiều</h2><p>Để học tốt hơn, bạn không cần phải học cả ngày. Một số thay đổi nhỏ trong thói quen hàng ngày có thể đem lại hiệu quả lớn.</p><h2>1. Học theo khung giờ cố định</h2><p>Học trong khung giờ nhất định giúp não bộ hoạt động ổn định hơn.</p><h2>2. Chia nhỏ nhiệm vụ</h2><p>Chia công việc lớn thành các phần nhỏ giúp bạn dễ bắt đầu và duy trì nhịp học.</p><h2>3. Nghỉ ngắn giữa các buổi học</h2><p>Thời gian nghỉ ngắn giúp não bộ hồi phục và cải thiện khả năng tập trung.</p><h2>4. Sử dụng checklist</h2><p>Checklist giúp bạn đo lường tiến độ và cảm thấy có động lực rõ rệt hơn.</p><h2>5. Tránh xao nhãng</h2><p>Giảm thông báo, tắt tab không cần thiết và tập trung vào mục tiêu của buổi học.</p><h2>Kết luận</h2><p>Năng suất học tập có thể tăng lên nếu bạn thay đổi cách học chứ không cần thay đổi cả cuộc sống.</p>`,
  },
  {
    title: 'Review app học tập cho sinh viên: nên chọn nào?',
    slug: 'review-app-hoc-tap-cho-sinh-vien-nen-chon-nao',
    excerpt: 'So sánh các app học tập phổ biến cho sinh viên để bạn chọn đúng công cụ phù hợp với phong cách học và lịch học của mình.',
    category: 'Review',
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    affiliateUrl: '',
    content: `<h2>Chọn app học tập phù hợp là rất quan trọng</h2><p>Sinh viên thường có lịch học dày, nhiều môn và nhiều nhiệm vụ khác nhau. Vì vậy, app học tập phù hợp phải giúp quản lý thời gian và ghi nhớ thông tin tốt.</p><h2>1. App phù hợp với người hay quên lịch</h2><p>Những app nhắc lịch sẽ giúp bạn không bỏ lỡ buổi học hoặc deadline.</p><h2>2. App phù hợp với người cần ghi chú nhanh</h2><p>Đây là công cụ quan trọng cho việc lưu lại kiến thức vừa học.</p><h2>3. App phù hợp với người cần luyện nhớ</h2><p>Flashcard rất hiệu quả với sinh viên ôn thi hoặc học từ vựng.</p><h2>4. App phù hợp với người dễ bị xao nhãng</h2><p>Đây là lựa chọn cho những ai cần tránh sai sót khi học.</p><h2>Kết luận</h2><p>Không có app nào “vượt trội” cho mọi người. Cách tốt nhất là chọn theo phương pháp học và lịch trình của bạn.</p>`,
  },
];

const rows = await Promise.all(
  articles.map(async (post) => {
    const [existing] = await sql`SELECT id FROM news_posts WHERE slug = ${post.slug} LIMIT 1`;
    if (existing) {
      return null;
    }

    const result = await sql`
      INSERT INTO news_posts (
        slug, category, title, excerpt, content, cover_image, affiliate_url, is_published, published_at, created_at, updated_at
      )
      VALUES (
        ${post.slug},
        ${post.category},
        ${post.title},
        ${post.excerpt},
        ${post.content},
        ${post.coverImage},
        ${post.affiliateUrl},
        true,
        NOW(),
        NOW(),
        NOW()
      )
      RETURNING id, slug, title;`;

    return result[0];
  })
);

const inserted = rows.filter(Boolean);
console.log(`Inserted ${inserted.length} new SEO articles.`);
for (const row of inserted) {
  console.log(`- ${row.title} (${row.slug})`);
}

await sql.end();
