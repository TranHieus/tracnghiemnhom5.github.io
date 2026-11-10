const { useState, useEffect, useRef } = React;
const html = htm.bind(React.createElement);

/* ========================================================
   1. BỘ BIỂU TƯỢNG SVG (ICONS)
   ======================================================== */
const P = {
  rocket: "M12 2c3 2 5 6 5 10l-2 3H9l-2-3c0-4 2-8 5-10zM9 15l-2 5 5-2M15 15l2 5-5-2M12 9.5v.01",
  book: "M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2V5zM4 19a2 2 0 012-2h13",
  briefcase: "M3 8h18v12H3zM9 8V5h6v3M3 13h18",
  flask: "M9 3h6M10 3v6l-5 9a2 2 0 002 3h10a2 2 0 002-3l-5-9V3",
  code: "M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16",
  users: "M8 11a3 3 0 100-6 3 3 0 000 6zM2 20c0-3 3-5 6-5s6 2 6 5M17 11a3 3 0 100-6M17 15c3 0 5 2 5 5",
  bulb: "M9 18h6M10 21h4M12 3a6 6 0 00-4 10c1 1 1 2 1 3h6c0-1 0-2 1-3a6 6 0 00-4-10z",
  globe: "M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18",
  coin: "M12 3a9 9 0 100 18 9 9 0 000-18zM14.5 9c-.5-1-1.5-1.5-2.5-1.5-1.5 0-2.5 1-2.5 2s1 1.5 2.5 2 2.5 1 2.5 2-1 2-2.5 2c-1 0-2-.5-2.5-1.5M12 6v1.5M12 16.5V18",
  clock: "M12 3a9 9 0 100 18 9 9 0 000-18zM12 7v5l3 2",
  laptop: "M5 6h14v9H5zM2 19h20",
  target: "M12 3a9 9 0 100 18 9 9 0 000-18zM12 7a5 5 0 100 10 5 5 0 000-10zM12 11.5v1",
  compass: "M12 3a9 9 0 100 18 9 9 0 000-18zM15.5 8.5l-2 5-5 2 2-5z"
};

const ic = (n, s = 24) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${P[n] || P.bulb}"/></svg>`;
const Svg = ({ s, c }) => html`<span className=${c || ''} dangerouslySetInnerHTML=${{ __html: s }}/>`;

/* ========================================================
   2. HÌNH MINH HỌA VÀ KHO ẢNH TRUYỀN CẢM HỨNG (UNSPLASH)
   ======================================================== */

// Ảnh nghệ thuật hoa anh đào dự phòng (SVG sắc nét phòng trường hợp offline)
const art = (id, a, b, body) => `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" role="img"><defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="400" height="220" fill="url(#${id})"/>${body}</svg>`;
const CAP = (x, y, k) => `<g transform="translate(${x} ${y}) scale(${k})"><path d="M0 0l36-14 36 14-36 14z" fill="#ffd166"/><path d="M16 10v14c10 6 26 6 40 0V10" fill="#f48c06"/></g>`;

const SAKURA_FALLBACK_SVG = [
  // 0: Tên lửa tăng tốc dưới hoa anh đào
  art('sakura0', '#ff758f', '#ff4d6d', `<g fill="#fff" opacity=".35"><circle cx="40" cy="40" r="18"/><circle cx="340" cy="50" r="24"/><circle cx="90" cy="180" r="22"/></g><path d="M0 190 Q120 150 240 180 T400 160 L400 220 L0 220 Z" fill="#c9184a" opacity=".4"/><g transform="translate(200 110) rotate(35)"><path d="M0-72c22 18 26 52 20 88h-40c-6-36-2-70 20-88z" fill="#fff"/><circle cy="-30" r="10" fill="#ff758f"/><path d="M-20 10l-22 24 22-4zM20 10l22 24-22-4z" fill="#ffd166"/><path d="M-10 18h20l-10 44z" fill="#fff"/></g>${CAP(280, 60, 1)}<text x="200" y="205" text-anchor="middle" fill="#fff" font-size="16" font-weight="700">🌸 TÊN LỬA TĂNG TỐC 🌸</text>`),
  // 1: Cân bằng khôn ngoan
  art('sakura1', '#ff85a1', '#52b788', `<circle cx="320" cy="50" r="28" fill="#fff" opacity=".4"/><g transform="rotate(-6 200 135)"><rect x="60" y="130" width="280" height="12" rx="6" fill="#fff"/><circle cx="200" cy="136" r="16" fill="#ff4d6d"/>${CAP(70, 94, 1)}<rect x="250" y="90" width="70" height="42" rx="6" fill="#2d132c"/><text x="285" y="118" fill="#ff758f" font-size="16" text-anchor="middle" font-family="monospace">&lt;IT/&gt;</text></g><text x="200" y="205" text-anchor="middle" fill="#fff" font-size="16" font-weight="700">🌸 CÂN BẰNG KHÔN NGOAN 🌸</text>`),
  // 2: Người xây nền móng
  art('sakura2', '#ff4d6d', '#800f2f', `<g fill="#fff"><rect x="50" y="170" width="70" height="42" opacity=".95" rx="4"/><rect x="120" y="140" width="70" height="72" opacity=".85" rx="4"/><rect x="190" y="110" width="70" height="102" opacity=".75" rx="4"/><rect x="260" y="80" width="70" height="132" opacity=".65" rx="4"/></g><path d="M295 80V35" stroke="#fff" stroke-width="4"/><path d="M295 35l36 10-36 10z" fill="#ffd166"/><circle cx="60" cy="60" r="25" fill="#fff" opacity=".25"/><text x="200" y="205" text-anchor="middle" fill="#fff" font-size="16" font-weight="700">🌸 NGƯỜI XÂY NỀN MÓNG 🌸</text>`),
  // 3: Nhà thám hiểm
  art('sakura3', '#590d22', '#c9184a', `<g fill="#fff" opacity=".7"><circle cx="50" cy="40" r="2"/><circle cx="150" cy="30" r="1.5"/><circle cx="280" cy="60" r="2"/><circle cx="360" cy="40" r="1.5"/></g><circle cx="320" cy="65" r="30" fill="#ffd166" opacity=".9"/><g transform="translate(100 70)"><circle r="30" fill="none" stroke="#fff" stroke-width="3"/><path d="M0-22l9 22-9 22-9-22z" fill="#ff758f"/><circle r="4" fill="#fff"/></g><text x="200" y="205" text-anchor="middle" fill="#fff" font-size="16" font-weight="700">🌸 NHÀ THÁM HIỂM 🌸</text>`)
];

// Kho ảnh trực tuyến chất lượng cao từ Unsplash
const PHOTO_COLLECTIONS = {
  hero: [
    {
      url: "https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=1000&q=80",
      caption: "Mùa hoa anh đào nở rộ tại khuôn viên trường đại học"
    },
    {
      url: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1000&q=80",
      caption: "Lễ tốt nghiệp rực rỡ trong sắc xuân hoa anh đào"
    }
  ],
  0: [ // Tên lửa tăng tốc
    {
      url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80",
      title: "Đội ngũ kỹ sư trẻ năng động",
      caption: "Bứt tốc vào ngành sớm, nắm bắt cơ hội tại các tech startup"
    },
    {
      url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1000&q=80",
      title: "Thực chiến lập trình tốc độ cao",
      caption: "Kinh nghiệm thực tế từ các sprint dự án đem lại lợi thế lớn"
    },
    {
      url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80",
      title: "Gia nhập môi trường chuyên nghiệp",
      caption: "Chủ động tự lập tài chính và xây dựng mạng lưới quan hệ"
    }
  ],
  1: [ // Cân bằng khôn ngoan
    {
      url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80",
      title: "Mùa tốt nghiệp trọn vẹn cùng bè bạn",
      caption: "Vừa có bằng tốt nghiệp đẹp, vừa có kinh nghiệm thực tập vững vàng"
    },
    {
      url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80",
      title: "Học nhóm & Thực hành dự án",
      caption: "Duy trì phong độ học tập ổn định đồng thời tích lũy đồ án thật"
    },
    {
      url: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1000&q=80",
      title: "Cân bằng học thuật và sự nghiệp",
      caption: "Lộ trình hài hòa giúp bạn tận hưởng trọn vẹn thanh xuân sinh viên"
    }
  ],
  2: [ // Người xây nền móng
    {
      url: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1000&q=80",
      title: "Khuôn viên học viện & Thư viện công nghệ",
      caption: "Đầu tư chiều sâu kiến thức thuật toán và kiến trúc hệ thống"
    },
    {
      url: "https://images.unsplash.com/photo-1507842229451-7f01be8610ce?auto=format&fit=crop&w=1000&q=80",
      title: "Nghiên cứu bài bản, gốc rễ vững vàng",
      caption: "Nền tảng Computer Science vững giúp thích nghi với mọi công nghệ mới"
    },
    {
      url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80",
      title: "Làm chủ mã nguồn và thuật toán",
      caption: "Chậm lại một nhịp để xây dựng tư duy phân tích sâu sắc"
    }
  ],
  3: [ // Nhà thám hiểm
    {
      url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80",
      title: "Vươn ra thế giới, khám phá không giới hạn",
      caption: "Du học, trao đổi quốc tế hoặc theo đuổi các dự án khởi nghiệp táo bạo"
    },
    {
      url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80",
      title: "Phòng nghiên cứu AI, Robotics & Security",
      caption: "Đầu tư vào những công nghệ mũi nhọn định hình tương lai"
    },
    {
      url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1000&q=80",
      title: "Thử nghiệm và sáng tạo đột phá",
      caption: "Mỗi kỳ kéo dài đều là một sản phẩm độc đáo hoặc bài báo công bố"
    }
  ]
};

/* ========================================================
   3. HỆ THỐNG LỜI KHUYÊN TOÀN DIỆN VÀ ĐA DẠNG
   ======================================================== */
const RS = [
  {
    title: "Tên Lửa Tăng Tốc",
    tag: "🌸 Lộ trình Tốt Nghiệp Sớm (3.0 – 3.5 năm) cực kỳ phù hợp với bạn!",
    summary: "Bạn có mục tiêu thực tế rõ ràng, khao khát tự lập tài chính và thích cọ xát với môi trường công việc thực tế hơn là thời gian kéo dài trên giảng đường. Trong ngành công nghệ thông tin – nơi kiến thức mới ra đời liên tục mỗi tháng – 1 năm kinh nghiệm thực chiến tại doanh nghiệp có sức nặng rất lớn trên CV của bạn.",
    stats: [
      { name: "Tốc độ gia nhập thị trường", val: 96 },
      { name: "Khả năng tự chủ tài chính", val: 92 },
      { name: "Kinh nghiệm thực chiến", val: 88 },
      { name: "Nền tảng lý thuyết chuyên sâu", val: 68 },
      { name: "Mức độ thử nghiệm hướng đi mới", val: 60 }
    ],
    roadmap: [
      { phase: "Giai đoạn 1: Năm 1 - 2", title: "Học vượt thông minh", desc: "Tận dụng học kỳ hè để hoàn thành các môn đại cương và tiên quyết. Giữ điểm GPA ở mức an toàn (trên 2.8), không để nợ môn." },
      { phase: "Giai đoạn 2: Năm 2.5", title: "Thực tập sớm & Đồ án thực chiến", desc: "Ứng tuyển thực tập từ cuối năm 2. Chọn đồ án tốt nghiệp gắn liền trực tiếp với sản phẩm bạn đang phát triển tại công ty." },
      { phase: "Giai đoạn 3: Năm 3.0 - 3.5", title: "Bảo vệ đồ án & Ký Full-time", desc: "Vừa hoàn tất thủ tục tốt nghiệp vừa chuyển tiếp thành công lên vị trí Junior/Middle Engineer chính thức." }
    ],
    techFocus: [
      "Bộ công cụ thực chiến: Git, Docker, RESTful APIs, CI/CD cơ bản",
      "Stack công nghệ thịnh hành: React/Vue/Flutter hoặc Java Spring / Node.js / Go",
      "Kỹ năng mềm then chốt: Quản lý thời gian, giao tiếp công việc, tư duy Agile/Scrum"
    ],
    financialAdvice: "Đi làm sớm giúp bạn hoàn vốn học phí nhanh chóng và tích lũy vốn ban đầu từ tuổi 21–22. Hãy lập quỹ dự phòng 3–6 tháng chi phí sinh hoạt trước khi nghĩ đến đầu tư mạo hiểm.",
    pitfalls: [
      "Bẫy chỉ biết 'code chạy được' mà hổng cấu trúc dữ liệu, thuật toán và bảo mật.",
      "Kiệt sức (Burnout) vì vừa cày đồ án tốt nghiệp vừa chạy deadline công ty.",
      "Thiếu hụt trải nghiệm kỷ niệm đời sinh viên và các hoạt động cộng đồng."
    ],
    senpaiQuote: {
      text: "Mình tốt nghiệp sớm 1 kỳ, vào công ty làm quen hệ thống trước bạn cùng trang lứa. Đến khi các bạn mới ra trường nộp CV xin việc thì mình đã lên Junior và được tin tưởng giao dẫn dắt tính năng mới.",
      author: "Nguyễn Tuấn Anh - Software Engineer tại VNG, cựu sinh viên tốt nghiệp sớm"
    },
    checklist: [
      "Tính toán lại bảng điểm để lên kế hoạch đăng ký học vượt các kỳ tới",
      "Chuẩn bị một bản CV kỹ thuật chuẩn ATS và đẩy ít nhất 2 dự án hoàn chỉnh lên GitHub",
      "Luyện tập 30 câu hỏi phỏng vấn cơ bản về OOP, Database và Networking",
      "Đăng ký tham gia ngày hội việc làm hoặc nộp đơn kỳ thực tập sắp tới"
    ]
  },
  {
    title: "Cân Bằng Khôn Ngoan",
    tag: "🌸 Tốt nghiệp Đúng Hạn hoặc Sớm 1 Kỳ, song hành học & thực tập!",
    summary: "Bạn có tư duy tỉnh táo, cân bằng tốt giữa lý thuyết và thực tiễn. Bạn hiểu rằng một tấm bằng đại học loại khá/giỏi kết hợp với 6–12 tháng kinh nghiệm thực tập thực tế là 'công thức vàng' được các tập đoàn công nghệ và công ty IT lớn ưa chuộng nhất hiện nay.",
    stats: [
      { name: "Độ an toàn & bền vững sự nghiệp", val: 95 },
      { name: "Kinh nghiệm thực chiến tích lũy", val: 85 },
      { name: "Cân bằng cuộc sống & học tập", val: 90 },
      { name: "Cơ hội vào tập đoàn công nghệ lớn", val: 92 },
      { name: "Sức chịu áp lực thời gian", val: 82 }
    ],
    roadmap: [
      { phase: "Giai đoạn 1: Năm 1 - 2", title: "Xây móng & Ngoại ngữ", desc: "Nắm vững Cấu trúc dữ liệu & Giải thuật, Hệ điều hành, Mạng máy tính. Đạt chứng chỉ Tiếng Anh (IELTS 6.0+ hoặc TOEIC 700+)." },
      { phase: "Giai đoạn 2: Năm 3", title: "Thực tập mùa hè & Dự án nhóm", desc: "Tham gia chương trình Fresher/Intern tại các công ty IT uy tín. Học cách làm việc theo nhóm và review code chuyên nghiệp." },
      { phase: "Giai đoạn 3: Năm 4", title: "Khóa luận chất lượng & Sẵn sàng", desc: "Tập trung làm khóa luận tốt nghiệp chỉn chu. Thảnh thơi nộp đơn tuyển dụng và tận hưởng những tháng ngày sinh viên đẹp nhất." }
    ],
    techFocus: [
      "Nền tảng vững vàng: DSA (LeetCode Easy/Medium), OOP, Thiết kế CSDL (SQL/NoSQL)",
      "Kỹ năng toàn diện: Microservices, Clean Architecture, Testing (Unit Test, Integration Test)",
      "Kỹ năng mềm: Thuyết trình kỹ thuật, đàm phán lương, viết CV chuyên nghiệp"
    ],
    financialAdvice: "Giai đoạn năm 3–4 bạn hoàn toàn có thể có thu nhập từ trợ cấp thực tập (5–12 triệu/tháng). Hãy dùng số tiền này để tự trang trải sinh hoạt và đầu tư các khóa học chứng chỉ quốc tế (AWS, GCP).",
    pitfalls: [
      "Thái độ nước đến chân mới nhảy, để dồn môn vào năm cuối.",
      "Chỉ học lý thuyết trên lớp mà không có dự án thực tế trên GitHub.",
      "Ngại ứng tuyển thực tập vì nghĩ 'mình chưa đủ giỏi'."
    ],
    senpaiQuote: {
      text: "Mình tốt nghiệp đúng hạn 4 năm với bằng Giỏi và 1 năm kinh nghiệm intern. Khi phỏng vấn vào tập đoàn đa quốc gia, hội đồng tuyển dụng đánh giá rất cao vì mình vừa có tư duy thuật toán tốt, vừa hiểu quy trình làm việc.",
      author: "Trần Mai Phương - Full-Stack Developer tại FPT Software"
    },
    checklist: [
      "Kiểm tra các môn học còn thiếu để phân bổ đều cho các kỳ còn lại",
      "Luyện ít nhất 1 bài LeetCode mỗi ngày để duy trì độ bén tư duy thuật toán",
      "Hoàn thiện profile LinkedIn và kết nối với các Recruiter trong ngành IT",
      "Tìm một giảng viên hướng dẫn đồ án tốt nghiệp tâm huyết"
    ]
  },
  {
    title: "Người Xây Nền Móng",
    tag: "🌸 Kéo dài 1–2 kỳ để tích lũy kiến thức sâu là quyết định sáng suốt!",
    summary: "Bạn thuộc mẫu người cẩn trọng, trân trọng tri thức gốc rễ và muốn hiểu sâu tận bản chất 'tại sao hệ thống lại chạy như vậy'. Trong ngành IT, các kỹ sư vươn lên tầm Architect hoặc Staff Engineer đều là những người có nền tảng cực kỳ vững. Kéo dài thêm một chút để hoàn thiện kỹ năng là sự đầu tư dài hạn vô cùng giá trị.",
    stats: [
      { name: "Độ sâu nền tảng thuật toán", val: 94 },
      { name: "Khả năng giải quyết bài toán khó", val: 92 },
      { name: "Tiềm năng trở thành Solution Architect", val: 90 },
      { name: "Khả năng thích ứng công nghệ mới", val: 86 },
      { name: "Tốc độ gia nhập thị trường ngay", val: 55 }
    ],
    roadmap: [
      { phase: "Giai đoạn 1: Năm 1 - 3", title: "Củng cố lý thuyết & Đào sâu", desc: "Học chắc các môn cốt lõi: Cấu trúc máy tính, Trình biên dịch, Hệ quản trị CSDL, Thuật toán nâng cao." },
      { phase: "Giai đoạn 2: Năm 4", title: "Làm đề tài nghiên cứu & Sản phẩm lớn", desc: "Tham gia Nghiên cứu Khoa học sinh viên (NCKH) hoặc xây dựng một hệ thống phân tán phức tạp làm đồ án." },
      { phase: "Giai đoạn 3: Kỳ kéo dài (4.5 - 5 năm)", title: "Tối ưu hóa & Đột phá", desc: "Hoàn thiện khóa luận xuất sắc, đăng bài báo hội thảo hoặc tham gia kỳ thực tập tại các viện/lab công nghệ lớn." }
    ],
    techFocus: [
      "Ngôn ngữ phân tích hiệu năng cao: C++, Rust, Go hoặc Java Core chuyên sâu",
      "Hệ thống & Tối ưu: Distributed Systems, Low-level programming, System Design",
      "Tư duy học thuật: Đọc hiểu tài liệu chuẩn (Whitepapers, RFC, Specs)"
    ],
    financialAdvice: "Việc học thêm 1–2 kỳ phát sinh thêm học phí. Hãy tìm kiếm học bổng khuyến khích học tập của trường, học bổng doanh nghiệp hoặc nhận làm Teaching Assistant (Trợ giảng) / Lab Assistant để có nguồn thu.",
    pitfalls: [
      "Kéo dài việc học mà không có mục tiêu đầu ra cụ thể, dẫn đến lười biếng và chán nản.",
      "Tự ti khi thấy bạn bè đồng trang lứa đã đi làm và có lương trước.",
      "Quá sa đà vào hoàn hảo hóa lý thuyết mà quên mất sản phẩm thực tế cần người dùng."
    ],
    senpaiQuote: {
      text: "Mình từng tự ti vì tốt nghiệp chậm hơn bạn bè 1 năm do làm đề tài nghiên cứu hệ thống lớn. Nhưng nhờ nền tảng sâu đó, khi đi làm mình nhanh chóng giải quyết được các bug nghẽn hệ thống mà người khác bó tay.",
      author: "Lê Hoàng Long - Senior Backend / System Engineer tại Viettel"
    },
    checklist: [
      "Lập bản kế hoạch chi tiết cho các kỳ học thêm: mục tiêu GPA, đồ án, chứng chỉ",
      "Đăng ký tham gia một đề tài Nghiên cứu Khoa học hoặc một dự án Open-Source lớn",
      "Trao đổi thẳng thắn với gia đình để nhận được sự đồng thuận và hậu thuẫn tinh thần",
      "Tìm kiếm một Mentor (giảng viên hoặc đàn anh đi trước) đồng hành định hướng"
    ]
  },
  {
    title: "Nhà Thám Hiểm",
    tag: "🌸 Tốt nghiệp Muộn Có Chủ Đích để chinh phục đỉnh cao mới!",
    summary: "Bạn có tâm hồn rộng mở, tư duy đột phá và không thích đi theo lối mòn khuôn mẫu. Bạn muốn thử sức với Khởi nghiệp (Startup), đi du học / trao đổi sinh viên quốc tế, hoặc dấn thân vào các lĩnh vực mũi nhọn như Trí tuệ Nhân tạo (AI/ML), An ninh Mạng (Cybersecurity) hay Game Studio. Một năm kéo dài có chủ đích có thể mở ra những cánh cửa hoàn toàn khác biệt cho cuộc đời bạn.",
    stats: [
      { name: "Tính sáng tạo & Đổi mới", val: 98 },
      { name: "Khả năng khởi nghiệp & Bứt phá", val: 94 },
      { name: "Tầm nhìn quốc tế & Hội nhập", val: 90 },
      { name: "Độ phong phú trải nghiệm cuộc sống", val: 95 },
      { name: "Mức độ kiên định với lối đi riêng", val: 88 }
    ],
    roadmap: [
      { phase: "Giai đoạn 1: Mở rộng biên giới", title: "Săn học bổng & Trao đổi", desc: "Tham gia các kỳ trao đổi sinh viên (Erasmus, ASEAN, Nhật Bản, Hàn Quốc) hoặc các cuộc thi Hackathon quốc tế." },
      { phase: "Giai đoạn 2: Dấn thân thực nghiệm", title: "Thử sức Startup / Nghiên cứu AI", desc: "Cùng đồng đội phát triển một sản phẩm MVP thực tế, gọi vốn ươm mầm hoặc công bố bài báo khoa học." },
      { phase: "Giai đoạn 3: Hội tụ & Thu hoạch", title: "Tốt nghiệp với profile khủng", desc: "Khép lại thời sinh viên với bằng cấp danh giá cùng một hồ sơ rực rỡ hiếm ai có được ở tuổi 23." }
    ],
    techFocus: [
      "Công nghệ đột phá: AI / Deep Learning, Blockchain, Cloud Native, IoT / Embedded",
      "Kỹ năng toàn cầu: Tiếng Anh thông thạo (IELTS 7.0+), Kỹ năng Pitching gọi vốn",
      "Tư duy sản phẩm: Product Mindset, Thiết kế trải nghiệm người dùng (UX), Growth Hacking"
    ],
    financialAdvice: "Con đường thám hiểm đòi hỏi nguồn lực. Hãy chủ động săn học bổng toàn phần, tiền thưởng từ các cuộc thi Hackathon công nghệ, hoặc kiếm thu nhập từ các dự án Remote quốc tế.",
    pitfalls: [
      "Lạc lối giữa quá nhiều sở thích mà không hoàn thành được bất kỳ mục tiêu nào đến nơi đến chốn.",
      "Quên hạn chót (Deadline) hoàn thành các tín chỉ quy định của trường dẫn đến bị quá hạn tốt nghiệp.",
      "Khủng hoảng hiện sinh khi dự án startup hoặc nghiên cứu gặp bế tắc tạm thời."
    ],
    senpaiQuote: {
      text: "Mình bảo lưu 1 năm để đi thực tập tại Nhật Bản và thử làm một app AI cùng người bạn. Dù tốt nghiệp muộn 1 năm rưỡi, nhưng đó là khoảng thời gian định hình toàn bộ tư duy và mở ra công việc remote với mức lương quốc tế cho mình.",
      author: "Vũ Minh Đức - AI Engineer & Indie Hacker"
    },
    checklist: [
      "Định rõ mốc thời gian chốt (Deadline) kết thúc giai đoạn trải nghiệm để làm thủ tục ra trường",
      "Lập danh sách các học bổng trao đổi, cuộc thi Hackathon và Lab nghiên cứu tiềm năng",
      "Tìm kiếm 2–3 người bạn cùng chí hướng để lập nhóm đồng hành",
      "Duy trì một blog cá nhân hoặc kênh YouTube/GitHub chia sẻ hành trình thám hiểm của bạn"
    ]
  }
];

/* ========================================================
   4. BỘ CÂU HỎI TRẮC NGHIỆM ĐỊNH HƯỚNG CHUYÊN SÂU
   ======================================================== */
const Q = [
  { t: 's', q: "Mục tiêu lớn nhất của bạn sau khi ra trường là gì?", o: [["Đi làm kiếm tiền sớm, tự lập tài chính", -2], ["Vào một tập đoàn công nghệ lớn", -1], ["Học thạc sĩ hoặc làm nghiên cứu chuyên sâu", 1], ["Thử sức khởi nghiệp hoặc khám phá nhiều hướng", 2]] },
  { t: 'i', q: "Hình nào mô tả 'một năm lý tưởng' của bạn nhất?", o: [["Tăng tốc sự nghiệp, sớm thăng tiến", -2, 'rocket'], ["Thực tập tích lũy đồ án thật", -1, 'briefcase'], ["Nghiên cứu đào sâu học thuật", 1, 'flask'], ["Trải nghiệm, du học và khám phá", 2, 'globe']] },
  { t: 'm', q: "Bạn đã hoặc đang tích cực làm những việc nào ngoài giờ lên lớp?", o: [["Thực tập chính thức tại doanh nghiệp", -2], ["Nhận dự án freelance, code có thù lao", -1], ["Tự xây dựng dự án cá nhân, đẩy mã lên GitHub", 0], ["Tham gia CLB, cuộc thi Hackathon, Nghiên cứu Khoa học", 1], ["Hiện tại chưa làm gì nhiều, chỉ học trên lớp", 2]] },
  { t: 's', q: "Tình hình tài chính và áp lực từ gia đình đối với bạn thế nào?", o: [["Gia đình cần tôi tốt nghiệp sớm để đỡ đần kinh tế", -2], ["Hơi áp lực tài chính nhưng vẫn thu xếp được", -1], ["Gia đình hỗ trợ học tập thoải mái, không giục giã", 1], ["Có điều kiện để học thêm, du học hoặc khởi nghiệp", 2]] },
  { t: 's', q: "Phương pháp học lập trình hiệu quả nhất đối với bạn là gì?", o: [["Làm dự án thực tế, cọ xát với deadline và khách hàng", -2], ["Vừa học lý thuyết vừa áp dụng ngay vào bài tập lớn", -1], ["Đọc sách chuyên ngành, hiểu rõ nguyên lý gốc rễ", 1], ["Tìm tòi nghiên cứu các bài báo khoa học và công nghệ mới", 2]] },
  { t: 'i', q: "Biểu tượng nào gần gũi với tính cách làm việc của bạn nhất?", o: [["Đúng tiến độ, tốc độ và hiệu quả", -2, 'clock'], ["Mục tiêu rõ ràng, tập trung cao độ", -1, 'target'], ["Tò mò, thích thử nghiệm sáng tạo", 1, 'bulb'], ["Thích tự do khám phá, không vội vàng", 2, 'compass']] },
  { t: 's', q: "Bạn cảm thấy thế nào nếu cần kéo dài thời gian học thêm 1 kỳ?", o: [["Rất sốt ruột, thấy lãng phí thời gian và cơ hội", -2], ["Hơi tiếc nhưng chấp nhận nếu có lý do chính đáng", -1], ["Hoàn toàn bình thường, cơ hội để học kỹ hơn", 1], ["Tuyệt vời, có thêm thời gian làm đồ án lớn hoặc đi trao đổi", 2]] },
  { t: 'm', q: "Bạn lo ngại điều gì nhất nếu tốt nghiệp quá sớm?", o: [["Thiếu kiến thức nền tảng và tư duy thuật toán sâu", 1], ["Bỏ lỡ những kỷ niệm thanh xuân tươi đẹp của sinh viên", 1], ["Bị nhà tuyển dụng đánh giá là còn non nớt", 1], ["Không lo gì cả, ra trường càng sớm càng có lợi", -2]] },
  { t: 'm', q: "Bạn lo ngại điều gì nhất nếu tốt nghiệp muộn hơn các bạn?", o: [["Cảm giác bị thụt lùi so với bạn bè đồng trang lứa", -1], ["Mất cơ hội việc làm tốt trong giai đoạn thị trường đang cần", -2], ["Tốn kém thêm chi phí ăn ở và học phí", -1], ["Không hề lo ngại, miễn là mỗi kỳ đều tạo ra giá trị mới", 2]] },
  { t: 'i', q: "Môi trường làm việc mơ ước trong tương lai của bạn là gì?", o: [["Startup công nghệ tốc độ cao, quyền tự chủ lớn", -2, 'laptop'], ["Làm Remote cho công ty công nghệ đa quốc gia", -1, 'globe'], ["Tập đoàn IT lớn, quy trình chuẩn mực và chế độ tốt", 1, 'users'], ["Viện nghiên cứu, phòng Lab AI hoặc trường đại học", 2, 'flask']] },
  { t: 's', q: "Bạn tự đánh giá trình độ kỹ năng lập trình hiện tại của mình?", o: [["Đã tự tin làm được các tính năng thực tế, sẵn sàng đi làm", -2], ["Khá ổn, làm được dự án vừa nhưng cần mentor hướng dẫn", -1], ["Còn nhiều lỗ hổng ở cấu trúc dữ liệu và giải thuật", 1], ["Mới bắt đầu, vẫn đang chật vật với các bài tập", 2]] },
  { t: 's', q: "Điểm trung bình tích lũy (GPA) hiện tại của bạn đang ở mức nào?", o: [["Rất cao (GPA >= 3.4 hoặc 8.5/10 - Bằng Giỏi/Xuất Sắc)", -2], ["Khá tốt (GPA 3.0 – 3.3 hoặc 7.5 – 8.4/10)", -1], ["Trung bình khá (GPA 2.5 – 2.9)", 1], ["Dưới 2.5 hoặc đang có nguy cơ nợ môn", 2]] },
  { t: 'm', q: "Trước khi bắt đầu công việc Full-time chính thức, bạn muốn thử điều gì?", o: [["Trải nghiệm thực tập ở 2–3 môi trường khác nhau", 1], ["Đi trao đổi sinh viên hoặc du học ngắn hạn", 2], ["Làm một đề tài NCKH có giải thưởng hoặc công bố", 1], ["Không cần trải nghiệm thêm, muốn đi làm nhận lương ngay", -2]] },
  { t: 's', q: "Kỳ vọng lớn nhất từ bố mẹ và người thân đối với việc học của bạn?", o: [["Sớm ra trường có công ăn việc làm ổn định", -2], ["Tốt nghiệp đúng hạn với tấm bằng đẹp", -1], ["Học lên cao hơn (Thạc sĩ, Tiến sĩ) nếu có thể", 1], ["Tự do phát triển theo đam mê và sở thích của con", 2]] },
  { t: 'i', q: "Nếu có 6 tháng tự do, bạn sẽ ưu tiên đầu tư vào điều gì nhất?", o: [["Đi làm full-time để tích lũy tài chính đầu đời", -2, 'coin'], ["Cày dự án code thực chiến và hoàn thiện Portfolio", -1, 'code'], ["Mở rộng mối quan hệ và tham gia các cộng đồng tech", 0, 'users'], ["Học thêm chứng chỉ quốc tế uy tín hoặc ngoại ngữ mới", 1, 'book']] },
  { t: 's', q: "Trước làn sóng AI và công nghệ đổi mới liên tục, bạn ứng phó ra sao?", o: [["Nhảy ngay vào thực tế để thích nghi và dùng công cụ AI hàng ngày", -2], ["Vừa học lý thuyết vừa ứng dụng thực hành song song", -1], ["Nắm thật chắc toán học và thuật toán cốt lõi, công nghệ mới sẽ dễ hiểu", 1], ["Đào sâu nghiên cứu cơ chế hoạt động của mô hình AI", 2]] },
  { t: 'm', q: "Hồ sơ cá nhân (CV / Portfolio) của bạn hiện tại đã có những gì?", o: [["Kinh nghiệm thực tập hoặc đi làm thực tế", -2], ["Ít nhất 1–2 dự án hoàn chỉnh chạy được trên môi trường thật", -1], ["Khả năng ngoại ngữ tốt (có chứng chỉ IELTS/TOEIC/JLPT)", -1], ["Chứng chỉ chuyên môn đám mây hoặc lập trình quốc tế", 0], ["Chưa có gì nổi bật ngoài bảng điểm ở trường", 2]] },
  { t: 's', q: "Quan điểm của bạn về yếu tố 'độ tuổi' khi gia nhập ngành IT?", o: [["Càng trẻ tuổi càng có nhiều năng lượng và lợi thế cạnh tranh", -2], ["Đúng thời điểm là được, 22 hay 23 tuổi không chênh lệch nhiều", -1], ["Tuổi tác không quan trọng bằng độ sâu kiến thức và tư duy", 1], ["Càng trưởng thành và nhiều trải nghiệm thì đi càng xa", 2]] },
  { t: 'i', q: "Hình ảnh nào phản ánh chính xác phong cách học tập của bạn nhất?", o: [["Tên lửa bứt tốc về đích sớm", -2, 'rocket'], ["Đồng hồ đều đặn đúng kế hoạch", -1, 'clock'], ["La bàn tìm tòi định hướng cẩn thận", 1, 'compass'], ["Bóng đèn không ngừng sáng tạo ý tưởng mới", 2, 'bulb']] },
  { t: 'm', q: "Điều gì có thể khiến bạn sẵn sàng hoãn tốt nghiệp thêm 1 kỳ?", o: [["Cơ hội tham gia đề tài nghiên cứu hoặc dự án quy mô lớn", 1], ["Cơ hội nhận học bổng trao đổi sinh viên quốc tế", 2], ["Đang phát triển một sản phẩm khởi nghiệp có triển vọng", 2], ["Hoàn toàn không có lý do gì, phải ra trường càng sớm càng tốt", -2]] }
];

const LAB = { s: "Chọn 1 đáp án", m: "Chọn nhiều đáp án", i: "Chọn bằng hình ảnh" };

/* ========================================================
   5. ÂM THANH CHUÔNG GIÓ PHONG LINH NHẬT BẢN (FURIN SOUND)
   ======================================================== */
function playFurinChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    if (ctx.state === 'suspended') ctx.resume();

    // Hợp âm phong linh trong trẻo thanh tịnh: E6, G6, B6, E7
    const freqs = [1318.5, 1567.98, 1975.53, 2637.0];
    const now = ctx.currentTime;

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0.08, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 1.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 1.8);
    });
  } catch (e) {
    // Trình duyệt không hỗ trợ Web Audio API hoặc bị chặn
  }
}

/* ========================================================
   6. HIỆU ỨNG CÁNH HOA ANH ĐÀO RƠI TỐI ƯU PIN & HIỆU NĂNG
   ======================================================== */
function initSakuraCanvas() {
  const canvas = document.getElementById('sakura-canvas');
  if (!canvas) return { stop: () => {} };
  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  let animId = null;
  let running = true;

  const onResize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', onResize);

  // Trên mobile giảm số cánh hoa xuống để không tốn pin
  const isMobile = width < 600;
  const numPetals = isMobile ? 16 : Math.min(32, Math.floor(width / 30));
  const petals = [];

  class Petal {
    constructor() {
      this.reset(true);
    }
    reset(init = false) {
      this.x = Math.random() * width;
      this.y = init ? Math.random() * height : -20;
      this.size = isMobile ? (8 + Math.random() * 8) : (10 + Math.random() * 12);
      this.speedY = 0.9 + Math.random() * 1.3;
      this.speedX = -0.5 + Math.random() * 1.0;
      this.angle = Math.random() * Math.PI * 2;
      this.angleSpeed = (Math.random() - 0.5) * 0.025;
      this.flip = Math.random() * Math.PI;
      this.flipSpeed = 0.02 + Math.random() * 0.025;

      const alpha = 0.4 + Math.random() * 0.45;
      const pinkShades = [
        `rgba(255, 183, 197, ${alpha})`,
        `rgba(255, 117, 143, ${alpha})`,
        `rgba(255, 77, 109, ${alpha})`,
        `rgba(255, 229, 236, ${alpha})`
      ];
      this.color = pinkShades[Math.floor(Math.random() * pinkShades.length)];
    }
    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.angle) * 0.35;
      this.angle += this.angleSpeed;
      this.flip += this.flipSpeed;

      if (this.y > height + 20 || this.x < -30 || this.x > width + 30) {
        this.reset();
      }
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.scale(Math.cos(this.flip), 1);

      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.moveTo(0, -this.size);
      ctx.bezierCurveTo(this.size * 0.8, -this.size * 0.6, this.size * 0.8, this.size * 0.6, 0, this.size);
      ctx.bezierCurveTo(-this.size * 0.8, this.size * 0.6, -this.size * 0.8, -this.size * 0.6, 0, -this.size);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < numPetals; i++) {
    petals.push(new Petal());
  }

  function loop() {
    if (!running) return;
    ctx.clearRect(0, 0, width, height);
    for (let p of petals) {
      p.update();
      p.draw();
    }
    animId = requestAnimationFrame(loop);
  }
  loop();

  // Tạm dừng khi tab bị ẩn để tiết kiệm pin tối đa cho thiết bị
  const onVisibilityChange = () => {
    if (document.hidden) {
      running = false;
      if (animId) cancelAnimationFrame(animId);
    } else {
      running = true;
      loop();
    }
  };
  document.addEventListener('visibilitychange', onVisibilityChange);

  return {
    stop: () => {
      running = false;
      if (animId) cancelAnimationFrame(animId);
      ctx.clearRect(0, 0, width, height);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    },
    start: () => {
      if (!running) {
        running = true;
        loop();
      }
    }
  };
}

/* ========================================================
   7. COMPONENT CHÍNH ỨNG DỤNG REACT
   ======================================================== */

function App() {
  const [st, setSt] = useState('start'); // 'start' | 'quiz' | 'res'
  const [i, setI] = useState(0);
  const [ans, setAns] = useState({});
  const [theme, setTheme] = useState('light');
  const [sakuraActive, setSakuraActive] = useState(true);
  const [soundActive, setSoundActive] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [checkedTasks, setCheckedTasks] = useState({});
  const [heroPhotoIdx, setHeroPhotoIdx] = useState(0);
  const [resultPhotoIdx, setResultPhotoIdx] = useState(0);
  const [imgLoadError, setImgLoadError] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const sakuraCtrl = useRef(null);

  // Khởi tạo hiệu ứng hoa anh đào
  useEffect(() => {
    sakuraCtrl.current = initSakuraCanvas();
    return () => {
      if (sakuraCtrl.current) sakuraCtrl.current.stop();
    };
  }, []);

  // Điều khiển hoa anh đào bật/tắt
  useEffect(() => {
    if (sakuraCtrl.current) {
      if (sakuraActive) sakuraCtrl.current.start();
      else sakuraCtrl.current.stop();
    }
  }, [sakuraActive]);

  // Điều khiển chế độ sáng/tối hoa anh đào
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const toggleSound = () => {
    const nextSound = !soundActive;
    setSoundActive(nextSound);
    if (nextSound) {
      playFurinChime();
      showToast('Đã bật âm thanh chuông gió Furin 🎐');
    } else {
      showToast('Đã tắt âm thanh 🔕');
    }
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2600);
  };

  const go = (s) => {
    setSt(s);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const restart = () => {
    setAns({});
    setI(0);
    setActiveTab(0);
    setCheckedTasks({});
    setImgLoadError(false);
    go('start');
  };

  // Tính điểm tổng hợp và phân loại kết quả
  const avg = Q.reduce((s, q, k) => {
    const a = ans[k] || [];
    return s + (a.length ? a.reduce((t, o) => t + q.o[o][1], 0) / a.length : 0);
  }, 0) / Q.length;

  const R = avg < -0.9 ? 0 : avg < 0 ? 1 : avg < 0.9 ? 2 : 3;
  const r = RS[R];
  const pos = Math.max(5, Math.min(95, ((avg + 2) / 4) * 100));

  // Tự động phân tích các câu trả lời riêng lẻ để đưa ra lời khuyên cá nhân hóa
  const generatePersonalizedInsights = () => {
    const insights = [];

    // Phân tích câu 11: GPA
    const gpaAns = ans[11] ? ans[11][0] : null;
    if (gpaAns === 0) {
      insights.push({
        title: "Ưu thế GPA Xuất sắc (>= 3.4)",
        desc: "Bạn có bảng điểm rất ấn tượng. Hãy tận dụng nó để săn học bổng cao học, học bổng doanh nghiệp lớn (Samsung, Vingroup) hoặc các chương trình Fast-track tuyển thẳng."
      });
    } else if (gpaAns === 3 || gpaAns === 2) {
      insights.push({
        title: "Chiến lược bù đắp GPA",
        desc: "Điểm lý thuyết chưa phải thế mạnh của bạn, nhưng đừng lo lắng! Trong IT, 75% nhà tuyển dụng chú trọng sản phẩm thực tế. Hãy xây dựng 2 dự án GitHub có người dùng thật để làm lu mờ điểm số trên lớp."
      });
    }

    // Phân tích câu 3: Tài chính
    const finAns = ans[3] ? ans[3][0] : null;
    if (finAns === 0) {
      insights.push({
        title: "Tối ưu hóa kinh tế cho gia đình",
        desc: "Ưu tiên chọn các kỳ thực tập có phụ cấp tốt (trên 6–10 triệu/tháng). Tốt nghiệp sớm 1 kỳ sẽ giúp bạn tiết kiệm được tiền thuê trọ và sinh hoạt phí đáng kể."
      });
    } else if (finAns === 3) {
      insights.push({
        title: "Tận dụng sự hậu thuẫn tài chính",
        desc: "Gia đình là điểm tựa vững chắc, hãy mạnh dạn đầu tư vào những trải nghiệm giá trị cao: học các chứng chỉ quốc tế uy tín hoặc tham gia trao đổi sinh viên nước ngoài."
      });
    }

    // Phân tích câu 9: Môi trường làm việc mơ ước
    const careerAns = ans[9] ? ans[9][0] : null;
    if (careerAns === 0) {
      insights.push({
        title: "Mục tiêu Tech Startup",
        desc: "Tại các startup, tốc độ triển khai và khả năng tự học đa nhiệm là số 1. Hãy làm quen với việc đọc tài liệu kỹ thuật tiếng Anh và làm chủ công cụ AI hỗ trợ code."
      });
    } else if (careerAns === 2) {
      insights.push({
        title: "Mục tiêu Tập đoàn Công nghệ lớn",
        desc: "Các công ty lớn thường phỏng vấn nghiêm ngặt về thuật toán (DSA) và thiết kế hệ thống (System Design). Hãy dành ít nhất 3 tháng chuyên tâm cày LeetCode."
      });
    }

    if (insights.length === 0) {
      insights.push({
        title: "Chủ động xây dựng Portfolio",
        desc: "Bất kể theo lộ trình nào, một hồ sơ cá nhân có sản phẩm chạy thực tế và link demo trực tiếp luôn là tấm vé thông hành tốt nhất."
      });
    }

    return insights;
  };

  // Chức năng sao chép tóm tắt lộ trình vào Clipboard
  const copyResultToClipboard = () => {
    const text = `🌸 KẾT QUẢ ĐỊNH HƯỚNG TỐT NGHIỆP IT (PHONG CÁCH HOA ANH ĐÀO) 🌸\n` +
      `Nhóm kết quả: ${r.title}\n` +
      `Đánh giá: ${r.tag}\n` +
      `Tóm tắt: ${r.summary}\n\n` +
      `🎯 Gợi ý trọng tâm:\n${r.techFocus.map(t => `- ${t}`).join('\n')}\n\n` +
      `Trắc nghiệm từ ứng dụng SVIT Hoa Anh Đào`;
    navigator.clipboard.writeText(text).then(() => {
      showToast('Đã sao chép cẩm nang lộ trình vào bộ nhớ tạm! 🌸');
    }).catch(() => {
      showToast('Không thể sao chép tự động, bạn có thể chụp ảnh màn hình nhé!');
    });
  };

  // Chức năng in / lưu trang kết quả
  const printResult = () => {
    window.print();
  };

  // Toggle checklist task
  const toggleTask = (taskIndex) => {
    setCheckedTasks(prev => ({
      ...prev,
      [taskIndex]: !prev[taskIndex]
    }));
  };

  /* ----------------------------------------------------
     GIAO DIỆN TRANG BẮT ĐẦU (START SCREEN)
     ---------------------------------------------------- */
  if (st === 'start') {
    const heroPhoto = PHOTO_COLLECTIONS.hero[heroPhotoIdx % PHOTO_COLLECTIONS.hero.length];

    return html`<div className="wrap">
      <!-- Header điều hướng phong cách hoa anh đào -->
      <header className="header-bar">
        <a href="#" className="brand-badge" onClick=${(e) => { e.preventDefault(); restart(); }}>
          <span className="sakura-icon">🌸</span>
          <span>SVIT Sakura • Hướng nghiệp IT</span>
        </a>
        <div className="header-actions">
          <button className="header-btn" title="Xem so sánh 4 lộ trình" onClick=${() => setShowCompareModal(true)}>
            <span>📊 So sánh lộ trình</span>
          </button>
          <button className="header-btn" title="Bật/Tắt chuông gió Furin" onClick=${toggleSound}>
            <span>${soundActive ? '🎐 Chuông: Bật' : '🎐 Chuông: Tắt'}</span>
          </button>
          <button className="header-btn" title="Bật/Tắt mưa hoa anh đào" onClick=${() => setSakuraActive(!sakuraActive)}>
            <span>${sakuraActive ? '🌸 Mưa: Bật' : '🌸 Mưa: Tắt'}</span>
          </button>
          <button className="header-btn" title="Chuyển chế độ Ngày / Đêm Hoa Anh Đào" onClick=${toggleTheme}>
            <span>${theme === 'light' ? '🌙 Đêm' : '☀️ Ngày'}</span>
          </button>
        </div>
      </header>

      <!-- Ảnh Hero phong cách hoa anh đào với nút đổi ảnh -->
      <div className="art-container">
        ${imgLoadError
          ? html`<${Svg} s=${SAKURA_FALLBACK_SVG[1]}/>`
          : html`<img src=${heroPhoto.url} alt=${heroPhoto.caption} onError=${() => setImgLoadError(true)}/>`}
        <div className="art-tag-badge">🌸 Mùa Tốt Nghiệp Hoa Anh Đào</div>
        <button className="art-change-btn" onClick=${() => setHeroPhotoIdx(prev => prev + 1)}>
          🔄 Đổi ảnh cảnh quan
        </button>
      </div>

      <h1>
        Tốt nghiệp sớm hay muộn: <span className="sakura-title-span">đâu là con đường nở hoa cho bạn?</span>
      </h1>
      
      <p className="mut">
        Với sinh viên Công nghệ Thông tin, mỗi lựa chọn về thời điểm tốt nghiệp đều mở ra một tương lai khác biệt. Tốt nghiệp sớm giúp bạn bứt phá vào nghề nhanh chóng, còn kéo dài có chủ đích giúp bạn xây nền móng học thuật và khám phá thế giới. Dưới sắc hoa anh đào mùa tốt nghiệp, hãy làm bài trắc nghiệm để tìm ra lộ trình cá nhân hóa hoàn hảo cho riêng bạn.
      </p>

      <div className="chips">
        <span>🌸 20 câu hỏi đa chiều</span>
        <span>⏱️ Khoảng 5 phút</span>
        <span>🎯 4 lộ trình sự nghiệp</span>
        <span>💡 Cẩm nang lời khuyên chuyên sâu</span>
      </div>

      <div style=${{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button className="pri" onClick=${() => go('quiz')}>
          <span>Bắt đầu khám phá lộ trình của bạn</span> ➔
        </button>
        <button className="ghost" onClick=${() => setShowCompareModal(true)}>
          <span>📊 Xem bảng so sánh 4 con đường</span>
        </button>
      </div>

      <!-- MODAL SO SÁNH 4 LỘ TRÌNH -->
      ${showCompareModal && html`
        <div className="modal-overlay" onClick=${() => setShowCompareModal(false)}>
          <div className="modal-content" onClick=${(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick=${() => setShowCompareModal(false)} title="Đóng bảng">✕</button>
            <h3 style=${{ color: 'var(--pri)', marginBottom: '8px' }}>🌸 Bảng So Sánh Toàn Diện 4 Lộ Trình Tốt Nghiệp IT</h3>
            <p className="mut" style=${{ fontSize: '13px', marginBottom: '14px' }}>
              Vuốt ngang để so sánh các tiêu chí quan trọng giữa các con đường:
            </p>
            <div className="comparison-table-wrap">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Tiêu chí so sánh</th>
                    <th>🚀 Tên Lửa Tăng Tốc</th>
                    <th>⚖️ Cân Bằng Khôn Ngoan</th>
                    <th>🏛️ Người Xây Nền Móng</th>
                    <th>🧭 Nhà Thám Hiểm</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><b>Thời gian tốt nghiệp</b></td>
                    <td>3.0 – 3.5 năm</td>
                    <td>Đúng hạn 4.0 năm</td>
                    <td>4.5 – 5.0 năm</td>
                    <td>4.5 – 5.5 năm (có chủ đích)</td>
                  </tr>
                  <tr>
                    <td><b>Áp lực học tập</b></td>
                    <td>Rất cao (học vượt tín)</td>
                    <td>Vừa phải, cân bằng</td>
                    <td>Cao về chiều sâu học thuật</td>
                    <td>Biến động theo dự án</td>
                  </tr>
                  <tr>
                    <td><b>Thu nhập ban đầu</b></td>
                    <td>Sớm nhất (từ 21 tuổi)</td>
                    <td>Ổn định theo lứa bạn bè</td>
                    <td>Bắt đầu sau nhưng thăng tiến nhanh</td>
                    <td>Đột phá nếu Startup/Remote</td>
                  </tr>
                  <tr>
                    <td><b>Phù hợp nhất với</b></td>
                    <td>Cần tài chính, thích thực chiến</td>
                    <td>Đa số sinh viên IT</td>
                    <td>Yêu thích thuật toán, hệ thống</td>
                    <td>Khởi nghiệp, du học, AI Lab</td>
                  </tr>
                  <tr>
                    <td><b>Mục tiêu trọng tâm</b></td>
                    <td>Kinh nghiệm thực tế</td>
                    <td>CV đẹp + GPA an toàn</td>
                    <td>Tư duy gốc rễ vững bền</td>
                    <td>Profile xuất sắc, sản phẩm riêng</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style=${{ textAlign: 'right', marginTop: '16px' }}>
              <button className="pri" style=${{ padding: '9px 20px', minHeight: 'auto', fontSize: '13.5px' }} onClick=${() => setShowCompareModal(false)}>
                Đã hiểu, đóng bảng
              </button>
            </div>
          </div>
        </div>
      `}

      <!-- Toast thông báo -->
      <div className=${'toast' + (toastMsg ? ' show' : '')}>
        <span>🌸</span> ${toastMsg}
      </div>
    </div>`;
  }

  /* ----------------------------------------------------
     GIAO DIỆN LÀM BÀI TRẮC NGHIỆM (QUIZ SCREEN)
     ---------------------------------------------------- */
  if (st === 'quiz') {
    const q = Q[i];
    const cur = ans[i] || [];

    const pick = (k) => {
      let n;
      if (q.t === 'm') {
        n = cur.includes(k) ? cur.filter(x => x !== k) : [...cur, k];
      } else {
        n = [k];
      }
      setAns({ ...ans, [i]: n });
    };

    const next = () => {
      if (i === Q.length - 1) {
        if (soundActive) playFurinChime();
        go('res');
      } else {
        setI(i + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    const progressPct = Math.round(((i + 1) / Q.length) * 100);

    return html`<div className="wrap">
      <header className="header-bar">
        <a href="#" className="brand-badge" onClick=${(e) => { e.preventDefault(); restart(); }}>
          <span className="sakura-icon">🌸</span>
          <span>SVIT Sakura • Câu ${i + 1}/${Q.length}</span>
        </a>
        <div className="header-actions">
          <button className="header-btn" onClick=${toggleSound}>
            <span>${soundActive ? '🎐 Bật' : '🎐 Tắt'}</span>
          </button>
          <button className="header-btn" onClick=${() => setSakuraActive(!sakuraActive)}>
            <span>${sakuraActive ? '🌸 Bật' : '🌸 Tắt'}</span>
          </button>
          <button className="header-btn" onClick=${toggleTheme}>
            <span>${theme === 'light' ? '🌙 Đêm' : '☀️ Ngày'}</span>
          </button>
        </div>
      </header>

      <div className="top">
        <span>Tiến độ hoàn thành: ${progressPct}%</span>
        <span className="badge">🌸 ${LAB[q.t]}</span>
      </div>

      <div className="bar-wrapper">
        <div className="bar">
          <i style=${{ width: progressPct + '%' }}/>
        </div>
      </div>

      <h2>${i + 1}. ${q.q}</h2>

      <div className=${q.t === 'i' ? 'grid' : 'list'}>
        ${q.o.map((o, k) => {
          const isSelected = cur.includes(k);
          return html`<button
            key=${i + '-' + k}
            className=${'opt' + (isSelected ? ' on' : '')}
            onClick=${() => pick(k)}
          >
            ${q.t === 'i'
              ? html`
                  <div className="icon-wrap">
                    <${Svg} s=${ic(o[2], 28)}/>
                  </div>
                  <span className="opt-text">${o[0]}</span>
                `
              : html`
                  <div className="opt-index">${String.fromCharCode(65 + k)}</div>
                  <span className="opt-text">${o[0]}</span>
                  ${q.t === 'm' && html`<b className="chk">${isSelected ? '✓' : ''}</b>`}
                `}
          </button>`;
        })}
      </div>

      <div className="nav">
        <button className="ghost" disabled=${i === 0} onClick=${() => setI(i - 1)}>
          ← Quay lại câu trước
        </button>
        <button className="pri" disabled=${!cur.length} onClick=${next}>
          ${i === Q.length - 1 ? '🌸 Xem kết quả phân tích' : 'Câu tiếp theo →'}
        </button>
      </div>
    </div>`;
  }

  /* ----------------------------------------------------
     GIAO DIỆN KẾT QUẢ & CẨM NANG LỜI KHUYÊN (RESULT SCREEN)
     ---------------------------------------------------- */
  const photos = PHOTO_COLLECTIONS[R] || PHOTO_COLLECTIONS[0];
  const activePhoto = photos[resultPhotoIdx % photos.length];
  const personalizedInsights = generatePersonalizedInsights();

  return html`<div className="wrap">
    <!-- Header kết quả -->
    <header className="header-bar">
      <a href="#" className="brand-badge" onClick=${(e) => { e.preventDefault(); restart(); }}>
        <span className="sakura-icon">🌸</span>
        <span>SVIT Sakura • Báo Cáo Định Hướng</span>
      </a>
      <div className="header-actions">
        <button className="header-btn" onClick=${() => setShowCompareModal(true)}>
          <span>📊 So sánh 4 lộ trình</span>
        </button>
        <button className="header-btn" onClick=${toggleSound}>
          <span>${soundActive ? '🎐 Chuông: Bật' : '🎐 Chuông: Tắt'}</span>
        </button>
        <button className="header-btn" onClick=${() => setSakuraActive(!sakuraActive)}>
          <span>${sakuraActive ? '🌸 Mưa: Bật' : '🌸 Mưa: Tắt'}</span>
        </button>
        <button className="header-btn" onClick=${toggleTheme}>
          <span>${theme === 'light' ? '🌙 Đêm' : '☀️ Ngày'}</span>
        </button>
      </div>
    </header>

    <!-- Khung ảnh trực tuyến tải tự động theo kết quả -->
    <div className="art-container">
      ${imgLoadError
        ? html`<${Svg} s=${SAKURA_FALLBACK_SVG[R]}/>`
        : html`<img src=${activePhoto.url} alt=${activePhoto.title} onError=${() => setImgLoadError(true)}/>`}
      <div className="art-tag-badge">🌸 Lộ trình: ${r.title}</div>
      <button className="art-change-btn" onClick=${() => setResultPhotoIdx(prev => prev + 1)}>
        🔄 Đổi ảnh truyền cảm hứng
      </button>
    </div>

    <div className="res-header-badge">🌸 BÁO CÁO ĐỊNH HƯỚNG TỐT NGHIỆP CÁ NHÂN HÓA</div>
    <h1>${r.title}</h1>
    <div className="tag">${r.tag}</div>

    <!-- Thước đo trực quan Sớm - Muộn -->
    <div className="meter">
      <div className="meter-title">
        <span>Vị trí của bạn trên cán cân Tốt nghiệp:</span>
        <span style=${{ color: 'var(--pri)' }}>
          ${pos < 40 ? 'Thiên hướng SỚM' : pos > 60 ? 'Thiên hướng MUỘN CÓ KẾ HOẠCH' : 'CÂN BẰNG HÀI HÒA'}
        </span>
      </div>
      <div className="track">
        <i style=${{ left: pos + '%' }} title="Điểm số của bạn">🌸</i>
      </div>
      <div className="lab">
        <span>🚀 Tốt nghiệp Sớm (Tăng tốc)</span>
        <span>⚖️ Cân bằng</span>
        <span>🧭 Tốt nghiệp Muộn (Khám phá)</span>
      </div>
    </div>

    <!-- Tóm tắt định hướng -->
    <div className="box box-highlight">
      <p style=${{ fontSize: '15.5px', lineHeight: '1.7', margin: 0 }}>${r.summary}</p>
    </div>

    <!-- Thanh chuyển Tab chuyên đề lời khuyên phong phú (Vuốt mượt trên Mobile) -->
    <div className="tabs-nav">
      <button className=${'tab-btn' + (activeTab === 0 ? ' active' : '')} onClick=${() => setActiveTab(0)}>
        🌟 Tổng quan & Kỹ năng
      </button>
      <button className=${'tab-btn' + (activeTab === 1 ? ' active' : '')} onClick=${() => setActiveTab(1)}>
        🧭 Lộ trình 3 giai đoạn
      </button>
      <button className=${'tab-btn' + (activeTab === 2 ? ' active' : '')} onClick=${() => setActiveTab(2)}>
        💡 Lời khuyên cho riêng bạn
      </button>
      <button className=${'tab-btn' + (activeTab === 3 ? ' active' : '')} onClick=${() => setActiveTab(3)}>
        📊 Chỉ số năng lực
      </button>
      <button className=${'tab-btn' + (activeTab === 4 ? ' active' : '')} onClick=${() => setActiveTab(4)}>
        ⚠️ Cạm bẫy & Senpai IT
      </button>
    </div>

    <!-- NỘI DUNG THEO TỪNG TAB -->

    <!-- TAB 0: TỔNG QUAN & KỸ NĂNG TRỌNG TÂM -->
    ${activeTab === 0 && html`<div>
      <div className="box">
        <h3>🌸 Bộ kỹ năng trọng tâm cần trang bị</h3>
        <p className="mut">Đừng dàn trải học quá nhiều thứ. Hãy tập trung làm chủ bộ công cụ sau để tạo điểm nhấn cạnh tranh:</p>
        <ul style=${{ paddingLeft: '20px', margin: 0 }}>
          ${r.techFocus.map((tf, idx) => html`<li key=${idx} style=${{ marginBottom: '10px', fontWeight: '500' }}>${tf}</li>`)}
        </ul>
      </div>

      <div className="box">
        <h3>💰 Lời khuyên Tài chính & Học phí</h3>
        <p style=${{ margin: 0 }}>${r.financialAdvice}</p>
      </div>

      <!-- Thư viện ảnh truyền cảm hứng nhỏ -->
      <div className="box">
        <h3>🌸 Khoảnh khắc truyền cảm hứng cho lộ trình này</h3>
        <div className="gallery-grid">
          ${photos.map((p, idx) => html`
            <div key=${idx} className="gallery-item" onClick=${() => setResultPhotoIdx(idx)} style=${{ cursor: 'pointer' }}>
              <img src=${p.url} alt=${p.title} loading="lazy"/>
              <div className="gallery-caption">${p.title}</div>
            </div>
          `)}
        </div>
      </div>
    </div>`}

    <!-- TAB 1: LỘ TRÌNH 3 GIAI ĐOẠN -->
    ${activeTab === 1 && html`<div>
      <div className="box">
        <h3>🧭 Kế hoạch hành động chi tiết từng chặng đường</h3>
        <div style=${{ display: 'grid', gap: '14px', marginTop: '12px' }}>
          ${r.roadmap.map((rm, idx) => html`
            <div key=${idx} style=${{ padding: '12px 14px', background: 'var(--sel)', borderRadius: '12px', borderLeft: '4px solid var(--pri)' }}>
              <div style=${{ fontSize: '12px', fontWeight: '700', color: 'var(--pri)', textTransform: 'uppercase' }}>${rm.phase}</div>
              <div style=${{ fontSize: '15.5px', fontWeight: '700', margin: '3px 0 5px' }}>${rm.title}</div>
              <div style=${{ fontSize: '13.5px', color: 'var(--ink-light)' }}>${rm.desc}</div>
            </div>
          `)}
        </div>
      </div>

      <!-- Checklist hành động có thể tích hoàn thành -->
      <div className="box">
        <h3>✅ Checklist hành động tuần này cho bạn</h3>
        <p className="mut">Hãy bấm vào từng nhiệm vụ khi bạn đã hoàn thành:</p>
        <div>
          ${r.checklist.map((task, idx) => {
            const isDone = !!checkedTasks[idx];
            return html`
              <div key=${idx} className=${'checklist-item' + (isDone ? ' done' : '')} onClick=${() => toggleTask(idx)}>
                <div className=${'checklist-chk' + (isDone ? ' done' : '')}>${isDone ? '✓' : ''}</div>
                <span style=${{ fontSize: '14px' }}>${task}</span>
              </div>
            `;
          })}
        </div>
      </div>
    </div>`}

    <!-- TAB 2: LỜI KHUYÊN CHO RIÊNG BẠN (CÁ NHÂN HÓA THEO CÂU TRẢ LỜI) -->
    ${activeTab === 2 && html`<div>
      <div className="box">
        <h3>💡 Lời khuyên tùy chỉnh dựa trên câu trả lời của bạn</h3>
        <p className="mut">Hệ thống phân tích dựa trên GPA, điều kiện kinh tế và nguyện vọng nghề nghiệp bạn vừa chọn:</p>
        <div style=${{ display: 'grid', gap: '12px', marginTop: '12px' }}>
          ${personalizedInsights.map((pi, idx) => html`
            <div key=${idx} style=${{ padding: '14px 16px', background: 'var(--card)', border: '1.5px solid var(--bd)', borderRadius: '14px' }}>
              <div style=${{ fontWeight: '700', color: 'var(--pri)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🌸</span> ${pi.title}
              </div>
              <div style=${{ fontSize: '14px', color: 'var(--ink)' }}>${pi.desc}</div>
            </div>
          `)}
        </div>
      </div>
    </div>`}

    <!-- TAB 3: ĐÁNH GIÁ CHỈ SỐ NĂNG LỰC -->
    ${activeTab === 3 && html`<div>
      <div className="box">
        <h3>📊 Phân tích 5 chỉ số năng lực theo hồ sơ của bạn</h3>
        <p className="mut">Định vị điểm mạnh và khía cạnh cần củng cố trên lộ trình ${r.title}:</p>
        <div className="stats-grid">
          ${r.stats.map((st, idx) => html`
            <div key=${idx} className="stat-item">
              <div className="stat-header">
                <span>${st.name}</span>
                <span style=${{ color: 'var(--pri)' }}>${st.val}%</span>
              </div>
              <div className="stat-bar">
                <div className="stat-fill" style=${{ width: st.val + '%' }}/>
              </div>
            </div>
          `)}
        </div>
      </div>
    </div>`}

    <!-- TAB 4: CẠM BẪY CẦN TRÁNH & LỜI KHUYÊN SENPAI IT -->
    ${activeTab === 4 && html`<div>
      <div className="box" style=${{ borderLeft: '5px solid #ff4d6d' }}>
        <h3>⚠️ 3 Cạm bẫy chí mạng cần tránh</h3>
        <p className="mut">Rất nhiều sinh viên đi trước đã mắc phải những sai lầm này, hãy ghi nhớ để né tránh:</p>
        <ul style=${{ paddingLeft: '20px', margin: 0 }}>
          ${r.pitfalls.map((pf, idx) => html`<li key=${idx} style=${{ marginBottom: '10px', color: '#c9184a', fontWeight: '500' }}>${pf}</li>`)}
        </ul>
      </div>

      <div className="box">
        <h3>💬 Lời nhắn nhủ từ Senpai IT</h3>
        <div className="senpai-quote">
          ${r.senpaiQuote.text}
          <span className="senpai-author">🌸 ${r.senpaiQuote.author}</span>
        </div>
      </div>
    </div>`}

    <!-- CÁC NÚT HÀNH ĐỘNG CUỐI TRANG -->
    <div className="action-buttons-group">
      <button className="btn-action" onClick=${copyResultToClipboard}>
        📋 Sao chép tóm tắt
      </button>
      <button className="btn-action" onClick=${printResult}>
        🖨️ Lưu / In thẻ kết quả
      </button>
      <button className="btn-action" onClick=${() => setShowCompareModal(true)}>
        📊 So sánh 4 lộ trình
      </button>
      <button className="ghost" onClick=${() => { setI(Q.length - 1); go('quiz'); }}>
        ← Xem lại câu trước
      </button>
      <button className="pri" onClick=${restart}>
        🔄 Làm lại trắc nghiệm
      </button>
    </div>

    <!-- MODAL SO SÁNH 4 LỘ TRÌNH (BẬT TỪ TRANG KẾT QUẢ) -->
    ${showCompareModal && html`
      <div className="modal-overlay" onClick=${() => setShowCompareModal(false)}>
        <div className="modal-content" onClick=${(e) => e.stopPropagation()}>
          <button className="modal-close-btn" onClick=${() => setShowCompareModal(false)} title="Đóng bảng">✕</button>
          <h3 style=${{ color: 'var(--pri)', marginBottom: '8px' }}>🌸 Bảng So Sánh Toàn Diện 4 Lộ Trình Tốt Nghiệp IT</h3>
          <p className="mut" style=${{ fontSize: '13px', marginBottom: '14px' }}>
            Vuốt ngang để so sánh các tiêu chí quan trọng giữa các con đường:
          </p>
          <div className="comparison-table-wrap">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Tiêu chí so sánh</th>
                  <th>🚀 Tên Lửa Tăng Tốc</th>
                  <th>⚖️ Cân Bằng Khôn Ngoan</th>
                  <th>🏛️ Người Xây Nền Móng</th>
                  <th>🧭 Nhà Thám Hiểm</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><b>Thời gian tốt nghiệp</b></td>
                  <td>3.0 – 3.5 năm</td>
                  <td>Đúng hạn 4.0 năm</td>
                  <td>4.5 – 5.0 năm</td>
                  <td>4.5 – 5.5 năm (có chủ đích)</td>
                </tr>
                <tr>
                  <td><b>Áp lực học tập</b></td>
                  <td>Rất cao (học vượt tín)</td>
                  <td>Vừa phải, cân bằng</td>
                  <td>Cao về chiều sâu học thuật</td>
                  <td>Biến động theo dự án</td>
                </tr>
                <tr>
                  <td><b>Thu nhập ban đầu</b></td>
                  <td>Sớm nhất (từ 21 tuổi)</td>
                  <td>Ổn định theo lứa bạn bè</td>
                  <td>Bắt đầu sau nhưng thăng tiến nhanh</td>
                  <td>Đột phá nếu Startup/Remote</td>
                </tr>
                <tr>
                  <td><b>Phù hợp nhất với</b></td>
                  <td>Cần tài chính, thích thực chiến</td>
                  <td>Đa số sinh viên IT</td>
                  <td>Yêu thích thuật toán, hệ thống</td>
                  <td>Khởi nghiệp, du học, AI Lab</td>
                </tr>
                <tr>
                  <td><b>Mục tiêu trọng tâm</b></td>
                  <td>Kinh nghiệm thực tế</td>
                  <td>CV đẹp + GPA an toàn</td>
                  <td>Tư duy gốc rễ vững bền</td>
                  <td>Profile xuất sắc, sản phẩm riêng</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style=${{ textAlign: 'right', marginTop: '16px' }}>
            <button className="pri" style=${{ padding: '9px 20px', minHeight: 'auto', fontSize: '13.5px' }} onClick=${() => setShowCompareModal(false)}>
              Đã hiểu, đóng bảng
            </button>
          </div>
        </div>
      </div>
    `}

    <p className="note">
      🌸 Kết quả định hướng được tính toán dựa trên các câu trả lời của bạn và số liệu thực tế ngành IT. Dù bạn chọn tốt nghiệp sớm để bứt phá hay kéo dài để đào sâu, điều quan trọng nhất là bạn luôn sống hết mình và tạo ra giá trị cho từng ngày trôi qua.
    </p>

    <!-- Toast thông báo -->
    <div className=${'toast' + (toastMsg ? ' show' : '')}>
      <span>🌸</span> ${toastMsg}
    </div>
  </div>`;
}

ReactDOM.createRoot(document.getElementById('root')).render(html`<${App}/>`);
