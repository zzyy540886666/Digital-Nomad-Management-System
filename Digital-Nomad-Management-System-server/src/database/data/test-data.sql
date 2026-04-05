-- ============================================
-- Digital Nomad Management System - Test Data
-- ============================================

USE digital_nomad;

-- 清空现有数据
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE audit_logs;
TRUNCATE TABLE event_logs;
TRUNCATE TABLE task_signups;
TRUNCATE TABLE matches;
TRUNCATE TABLE posts;
TRUNCATE TABLE event_signups;
TRUNCATE TABLE package_leads;
TRUNCATE TABLE package_optional_services;
TRUNCATE TABLE package_items;
TRUNCATE TABLE packages;
TRUNCATE TABLE tasks;
TRUNCATE TABLE community_groups;
TRUNCATE TABLE pois;
TRUNCATE TABLE events;
TRUNCATE TABLE user_profiles;
TRUNCATE TABLE users;
TRUNCATE TABLE admins;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- 管理员账户 (密码都是 password123)
-- ============================================
INSERT INTO admins (username, password, nickname, role) VALUES 
('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3/ItB/XBG/eCknfIrqS6', '超级管理员', 'admin'),
('operator1', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3/ItB/XBG/eCknfIrqS6', '运营专员张三', 'operator'),
('operator2', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3/ItB/XBG/eCknfIrqS6', '运营专员李四', 'operator');

-- ============================================
-- 用户数据
-- ============================================
INSERT INTO users (id, openid, nickname, avatar_url, phone) VALUES 
(1, 'test_openid_001', '张小明', 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUqQZ0ZT0qXaKJicn5vM1f0aYv0aKJicn5vM1f0aYv0aKJicn5vM1f0aYv0/132', '13800138001'),
(2, 'test_openid_002', '李小红', 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUqQZ0ZT0qXaKJicn5vM1f0aYv0aKJicn5vM1f0aYv0aKJicn5vM1f0aYv0/132', '13800138002'),
(3, 'test_openid_003', '王小华', 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUqQZ0ZT0qXaKJicn5vM1f0aYv0aKJicn5vM1f0aYv0aKJicn5vM1f0aYv0/132', '13800138003'),
(4, 'test_openid_004', '赵小芳', 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUqQZ0ZT0qXaKJicn5vM1f0aYv0aKJicn5vM1f0aYv0aKJicn5vM1f0aYv0/132', '13800138004'),
(5, 'test_openid_005', '陈小龙', 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUqQZ0ZT0qXaKJicn5vM1f0aYv0aKJicn5vM1f0aYv0aKJicn5vM1f0aYv0/132', '13800138005'),
(6, 'test_openid_006', '刘小燕', 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUqQZ0ZT0qXaKJicn5vM1f0aYv0aKJicn5vM1f0aYv0aKJicn5vM1f0aYv0/132', '13800138006'),
(7, 'test_openid_007', '周小强', 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUqQZ0ZT0qXaKJicn5vM1f0aYv0aKJicn5vM1f0aYv0aKJicn5vM1f0aYv0/132', '13800138007'),
(8, 'test_openid_008', '吴小美', 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUqQZ0ZT0qXaKJicn5vM1f0aYv0aKJicn5vM1f0aYv0aKJicn5vM1f0aYv0/132', '13800138008'),
(9, 'test_openid_009', '孙小伟', 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUqQZ0ZT0qXaKJicn5vM1f0aYv0aKJicn5vM1f0aYv0aKJicn5vM1f0aYv0/132', '13800138009'),
(10, 'test_openid_010', '郑小丽', 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUqQZ0ZT0qXaKJicn5vM1f0aYv0aKJicn5vM1f0aYv0aKJicn5vM1f0aYv0/132', '13800138010');

-- ============================================
-- 用户资料
-- ============================================
INSERT INTO user_profiles (user_id, city_from, stay_intent_days, budget_level, work_type, interests, skills, privacy_level) VALUES 
(1, '北京', 30, 'medium', 'remote', '["摄影", "徒步", "咖啡"]', '["前端开发", "UI设计", "摄影"]', 'public'),
(2, '上海', 14, 'high', 'creator', '["阅读", "瑜伽", "美食"]', '["内容创作", "视频剪辑", "文案"]', 'normal'),
(3, '深圳', 60, 'low', 'freelance', '["编程", "游戏", "音乐"]', '["后端开发", "Python", "吉他"]', 'public'),
(4, '广州', 7, 'medium', 'remote', '["旅行", "摄影", "写作"]', '["产品经理", "数据分析", "写作"]', 'normal'),
(5, '杭州', 21, 'high', 'remote', '["健身", "阅读", "投资"]', '["全栈开发", "项目管理", "英语"]', 'private'),
(6, '成都', 90, 'low', 'freelance', '["美食", "音乐", "电影"]', '["插画", "平面设计", "钢琴"]', 'public'),
(7, '武汉', 14, 'medium', 'other', '["运动", "摄影", "科技"]', '["运维", "Linux", "网络安全"]', 'normal'),
(8, '南京', 30, 'high', 'creator', '["艺术", "旅行", "咖啡"]', '["品牌设计", "摄影", "市场营销"]', 'public'),
(9, '西安', 45, 'medium', 'remote', '["历史", "美食", "写作"]', '["Java开发", "架构设计", "技术写作"]', 'normal'),
(10, '重庆', 60, 'low', 'freelance', '["美食", "户外", "电影"]', '["短视频", "直播运营", "剪辑"]', 'public');

-- ============================================
-- 套餐数据
-- ============================================
INSERT INTO packages (id, title, cover_url, images, price_min, price_max, duration_options, tags, price_note, notice, status) VALUES 
(1, '河源数字游民7日体验包', 'https://picsum.photos/400/300?random=1', '["https://picsum.photos/800/600?random=11", "https://picsum.photos/800/600?random=12", "https://picsum.photos/800/600?random=13"]', 1500.00, 2500.00, '[{"days": 7, "price": 1800}, {"days": 14, "price": 3200}]', '["体验", "短期", "含工位", "适合新手"]', '价格包含住宿和工位，不含餐饮', '请提前3天预约；入住需提供身份证；退房需在中午12点前', 'published'),
(2, '河源旅居月租套餐', 'https://picsum.photos/400/300?random=2', '["https://picsum.photos/800/600?random=21", "https://picsum.photos/800/600?random=22", "https://picsum.photos/800/600?random=23"]', 3500.00, 5500.00, '[{"days": 30, "price": 4000}, {"days": 60, "price": 7500}, {"days": 90, "price": 10500}]', '["长期", "住宿", "联合办公", "性价比高"]', '月租价格更优惠，水电另计', '需签订入住协议；押一付一；提前7天预约', 'published'),
(3, '万绿湖畔深度旅居包', 'https://picsum.photos/400/300?random=3', '["https://picsum.photos/800/600?random=31", "https://picsum.photos/800/600?random=32", "https://picsum.photos/800/600?random=33"]', 4000.00, 6000.00, '[{"days": 14, "price": 4500}, {"days": 30, "price": 8000}]', '["湖景", "安静", "品质", "适合创作"]', '湖景房，含早餐，免费使用皮划艇', '湖边蚊虫较多，请自备防蚊用品；夜间较安静', 'published'),
(4, '河源文化探索周', 'https://picsum.photos/400/300?random=4', '["https://picsum.photos/800/600?random=41", "https://picsum.photos/800/600?random=42"]', 2000.00, 3000.00, '[{"days": 7, "price": 2500}]', '["文化", "体验", "导游", "深度游"]', '包含本地文化体验活动和专业导游', '每周一出发；最少4人成团', 'published'),
(5, '数字游民创业孵化套餐', 'https://picsum.photos/400/300?random=5', '["https://picsum.photos/800/600?random=51", "https://picsum.photos/800/600?random=52"]', 5000.00, 8000.00, '[{"days": 30, "price": 6000}, {"days": 60, "price": 11000}]', '["创业", "孵化", "资源对接", "导师辅导"]', '含创业导师一对一辅导和资源对接服务', '需提交创业计划书；通过审核后入住', 'published'),
(6, '周末短途游套餐', 'https://picsum.photos/400/300?random=6', '["https://picsum.photos/800/600?random=61"]', 500.00, 1000.00, '[{"days": 2, "price": 688}, {"days": 3, "price": 998}]', '["周末", "短途", "休闲", "适合上班族"]', '周五入住，周日退房', '需周四前预约', 'draft');

-- 套餐项目
INSERT INTO package_items (package_id, type, name, description) VALUES 
(1, 'stay', '精品民宿单间', '独立卫浴，WiFi，空调，拎包入住'),
(1, 'cowork', '联合办公工位', '24小时开放，高速网络，咖啡茶水'),
(1, 'service', '接站服务', '河源站/河源东站免费接送'),
(2, 'stay', '公寓式酒店', '一室一厅，厨房，阳台，洗衣机'),
(2, 'cowork', '专属固定工位', '独立办公桌，储物柜，显示器'),
(2, 'service', '每周保洁', '每周一次房间清洁服务'),
(3, 'stay', '湖景民宿', '270度湖景阳台，浴缸，智能家居'),
(3, 'cowork', '湖畔办公亭', '独立玻璃房，湖景办公位'),
(3, 'service', '皮划艇体验', '免费使用皮划艇2小时/天'),
(4, 'stay', '特色客栈', '客家风情装修，庭院花园'),
(4, 'service', '文化体验活动', '客家美食制作、茶园参观'),
(4, 'service', '专业导游', '本地文化讲解，深度游览'),
(5, 'stay', '创业公寓', '独立办公区，会议室使用权'),
(5, 'service', '创业导师辅导', '每周2小时一对一辅导'),
(5, 'service', '资源对接', '投资人对接，政策咨询');

-- 套餐可选服务
INSERT INTO package_optional_services (package_id, name, price) VALUES 
(1, '机场接送', 150.00),
(1, '洗衣服务', 50.00),
(1, '早餐套餐', 30.00),
(2, '健身房会员', 200.00),
(2, '停车位', 300.00),
(2, '宠物友好', 100.00),
(3, '钓鱼装备租赁', 80.00),
(3, '烧烤套餐', 200.00),
(3, '私人厨师', 500.00),
(5, '法务咨询', 500.00),
(5, '财务代理', 800.00);

-- ============================================
-- 套餐意向
-- ============================================
INSERT INTO package_leads (id, user_id, package_id, arrival_date, stay_days, people_count, budget_level, work_type, note, contact_phone, status, created_at) VALUES 
(1, 1, 1, DATE_ADD(CURDATE(), INTERVAL 7 DAY), 7, 1, 'medium', 'remote', '希望安排安静的房间，需要稳定网络工作', '13800138001', 'submitted', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(2, 2, 2, DATE_ADD(CURDATE(), INTERVAL 14 DAY), 30, 1, 'high', 'creator', '需要能拍摄视频的环境，最好有好的光线', '13800138002', 'contacted', DATE_SUB(NOW(), INTERVAL 5 DAY)),
(3, 3, 3, DATE_ADD(CURDATE(), INTERVAL 21 DAY), 14, 2, 'low', 'freelance', '两个人一起，希望有双床房', '13800138003', 'confirmed', DATE_SUB(NOW(), INTERVAL 10 DAY)),
(4, 4, 1, DATE_ADD(CURDATE(), INTERVAL 3 DAY), 7, 1, 'medium', 'remote', '第一次来河源，希望有人介绍周边环境', '13800138004', 'submitted', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(5, 5, 5, DATE_ADD(CURDATE(), INTERVAL 30 DAY), 60, 1, 'high', 'remote', '创业项目是教育科技，希望对接相关资源', '13800138005', 'submitted', NOW()),
(6, 6, 2, DATE_ADD(CURDATE(), INTERVAL 10 DAY), 90, 1, 'low', 'freelance', '插画师，需要安静的创作环境', '13800138006', 'contacted', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(7, NULL, 3, DATE_ADD(CURDATE(), INTERVAL 5 DAY), 14, 2, 'medium', 'remote', '情侣出行，希望安排湖景房', '13900139001', 'submitted', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(8, 7, 4, DATE_ADD(CURDATE(), INTERVAL 7 DAY), 7, 1, 'medium', 'other', '对客家文化很感兴趣', '13800138007', 'closed', DATE_SUB(NOW(), INTERVAL 20 DAY)),
(9, 8, 1, DATE_ADD(CURDATE(), INTERVAL 2 DAY), 7, 1, 'high', 'creator', '需要拍摄产品照片，希望有好的取景地', '13800138008', 'lost', DATE_SUB(NOW(), INTERVAL 15 DAY)),
(10, 9, 2, DATE_ADD(CURDATE(), INTERVAL 45 DAY), 30, 1, 'medium', 'remote', '技术写作需要安静环境', '13800138009', 'submitted', NOW());

-- ============================================
-- POI数据
-- ============================================
INSERT INTO pois (id, type, name, address, latitude, longitude, phone, open_hours, tags, description, status) VALUES 
(1, 'cowork', '河源联合办公空间', '河源市源城区建设大道88号', 23.7460, 114.6970, '0762-3388001', '08:00-22:00', '["WiFi", "咖啡", "会议室", "打印"]', '河源最大的联合办公空间，提供固定工位和流动工位，配备高速网络、会议室、茶水间等设施', 'published'),
(2, 'cowork', '万绿湖创意园', '河源市东源县万绿湖大道168号', 23.7300, 114.7200, '0762-8765002', '09:00-21:00', '["湖景", "安静", "咖啡", "停车位"]', '湖景办公环境，适合需要安静创作环境的数字游民，有独立办公亭', 'published'),
(3, 'cowork', '源城共享办公', '河源市源城区沿江路56号', 23.7450, 114.6980, '0762-3322003', '24小时', '["24小时", "WiFi", "茶水"]', '24小时开放的共享办公空间，适合夜猫子', 'published'),
(4, 'stay', '万绿湖畔民宿', '河源市东源县万绿湖路88号', 23.7305, 114.7205, '0762-87654321', NULL, '["湖景", "浴缸", "阳台", "早餐"]', '湖景精品民宿，每间房都有独立阳台和浴缸，提供免费早餐', 'published'),
(5, 'stay', '河源数字游民公寓', '河源市源城区建设大道66号', 23.7465, 114.6975, '0762-3388004', NULL, '["长租", "厨房", "洗衣机", "办公桌"]', '专为数字游民设计的长租公寓，配备办公桌椅和高速网络', 'published'),
(6, 'stay', '客家风情客栈', '河源市源城区老城区太平路12号', 23.7440, 114.6960, '0762-3333005', NULL, '["特色", "庭院", "文化体验"]', '传统客家建筑改造的精品客栈，有庭院花园', 'published'),
(7, 'stay', '湖畔帐篷营地', '河源市东源县万绿湖景区内', 23.7280, 114.7220, '0762-8765006', NULL, '["露营", "烧烤", "户外"]', '万绿湖畔的帐篷营地，适合喜欢户外体验的游民', 'published'),
(8, 'food', '本地特色餐厅-客家味道', '河源市源城区沿江路128号', 23.7455, 114.6985, '0762-3333007', '10:00-21:00', '["客家菜", "本地特色", "人均50-80"]', '正宗客家菜，推荐酿豆腐、盐焗鸡、梅菜扣肉', 'published'),
(9, 'food', '万绿湖鱼庄', '河源市东源县万绿湖路168号', 23.7310, 114.7210, '0762-8765008', '11:00-22:00', '["河鲜", "湖景", "人均80-120"]', '万绿湖新鲜河鲜，湖景用餐环境', 'published'),
(10, 'food', '游民咖啡', '河源市源城区建设大道88号1楼', 23.7462, 114.6972, '0762-3388009', '08:00-22:00', '["咖啡", "简餐", "WiFi", "插座"]', '数字游民聚集地，提供精品咖啡和简餐，有充足插座', 'published'),
(11, 'food', '深夜食堂', '河源市源城区老城区太平路56号', 23.7445, 114.6965, '0762-3333010', '18:00-02:00', '["夜宵", "烧烤", "小酒馆"]', '营业到凌晨的小酒馆，适合夜猫子', 'published'),
(12, 'medical', '河源市人民医院', '河源市源城区文祥路1号', 23.7500, 114.7000, '0762-3322120', '24小时急诊', '["三甲", "急诊", "体检"]', '河源市最大的三甲医院，24小时急诊', 'published'),
(13, 'medical', '源城区中医院', '河源市源城区公园路28号', 23.7430, 114.6950, '0762-3333012', '08:00-17:30', '["中医", "理疗", "针灸"]', '提供中医诊疗和理疗服务', 'published'),
(14, 'medical', '万绿湖社区卫生站', '河源市东源县万绿湖大道88号', 23.7315, 114.7215, '0762-8765013', '08:00-20:00', '["社区医疗", "常用药品"]', '社区医疗站，可处理常见病', 'published'),
(15, 'transport', '河源火车站', '河源市源城区站前路1号', 23.7400, 114.6900, '0762-3322014', NULL, '["高铁", "普速", "出租车"]', '河源火车站，有高铁和普速列车', 'published'),
(16, 'transport', '河源汽车客运站', '河源市源城区建设大道168号', 23.7470, 114.6978, '0762-3322015', '06:00-20:00', '["长途汽车", "省内班线"]', '河源主要汽车客运站，有发往珠三角各地的班线', 'published'),
(17, 'transport', '万绿湖旅游码头', '河源市东源县万绿湖景区入口', 23.7270, 114.7230, '0762-8765016', '08:00-17:00', '["游船", "水上交通"]', '万绿湖游船码头，可乘船游览万绿湖', 'published'),
(18, 'venue', '河源文化中心', '河源市源城区文化广场1号', 23.7480, 114.6990, '0762-3322017', '09:00-21:00', '["会议", "展览", "演出"]', '河源市文化中心，可举办大型会议和活动', 'published'),
(19, 'venue', '万绿湖会议中心', '河源市东源县万绿湖大道168号', 23.7308, 114.7208, '0762-8765018', '08:00-22:00', '["会议", "培训", "团建"]', '湖景会议中心，适合企业团建和培训', 'published'),
(20, 'other', '河源市图书馆', '河源市源城区文化广场2号', 23.7485, 114.6995, '0762-3322019', '09:00-21:00', '["阅读", "自习", "WiFi"]', '河源市图书馆，安静的自习环境', 'published'),
(21, 'other', '万绿湖景区', '河源市东源县万绿湖风景区', 23.7250, 114.7250, '0762-8765020', '08:00-17:30', '["自然风光", "游船", "徒步"]', '国家4A级景区，广东最大的人工湖', 'published'),
(22, 'other', '河源恐龙博物馆', '河源市源城区滨江大道', 23.7420, 114.6940, '0762-3322021', '09:00-17:00', '["恐龙蛋", "科普", "亲子"]', '收藏大量恐龙蛋化石的博物馆', 'published');

-- ============================================
-- 活动数据
-- ============================================
INSERT INTO events (id, title, category, cover_url, description, start_time, end_time, venue_poi_id, venue_name, venue_address, latitude, longitude, capacity, fee_type, fee_amount, notice, status) VALUES 
(1, '周末咖啡品鉴会', 'social', 'https://picsum.photos/400/300?random=101', '与志同道合的游民一起品鉴本地特色咖啡，了解咖啡文化，认识新朋友。活动包含三种不同产地的咖啡豆品鉴，专业咖啡师讲解。', DATE_ADD(NOW(), INTERVAL 3 DAY), DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 2 HOUR, 10, '游民咖啡', '河源市源城区建设大道88号1楼', 23.7462, 114.6972, 20, 'free', 0, '请提前10分钟到达；活动期间请保持安静', 'published'),
(2, '数字游民分享沙龙', 'skillshare', 'https://picsum.photos/400/300?random=102', '邀请资深数字游民分享旅居经验，包括如何选择旅居地、远程工作技巧、税务规划等实用话题。', DATE_ADD(NOW(), INTERVAL 5 DAY), DATE_ADD(NOW(), INTERVAL 5 DAY) + INTERVAL 3 HOUR, 1, '河源联合办公空间', '河源市源城区建设大道88号', 23.7460, 114.6970, 30, 'free', 0, '请自带笔记本；活动有互动环节', 'published'),
(3, '万绿湖徒步活动', 'outdoor', 'https://picsum.photos/400/300?random=103', '探索河源最美湖泊风光，全程约8公里，适合初级徒步爱好者。沿途欣赏湖光山色，呼吸新鲜空气。', DATE_ADD(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 7 DAY) + INTERVAL 4 HOUR, 21, '万绿湖景区', '河源市东源县万绿湖风景区', 23.7250, 114.7250, 15, 'paid', 68.00, '费用包含门票和保险；请穿运动鞋；自备饮用水', 'published'),
(4, '客家美食制作体验', 'culture', 'https://picsum.photos/400/300?random=104', '学习制作正宗客家酿豆腐、盐焗鸡等传统美食，了解客家饮食文化。', DATE_ADD(NOW(), INTERVAL 10 DAY), DATE_ADD(NOW(), INTERVAL 10 DAY) + INTERVAL 3 HOUR, 8, '客家味道餐厅', '河源市源城区沿江路128号', 23.7455, 114.6985, 12, 'paid', 128.00, '费用包含食材和成品带走；请穿围裙', 'published'),
(5, '创业者交流晚宴', 'social', 'https://picsum.photos/400/300?random=105', '数字游民创业者交流晚宴，分享创业心得，拓展人脉资源。', DATE_ADD(NOW(), INTERVAL 14 DAY), DATE_ADD(NOW(), INTERVAL 14 DAY) + INTERVAL 3 HOUR, 9, '万绿湖会议中心', '河源市东源县万绿湖大道168号', 23.7308, 114.7208, 25, 'paid', 198.00, '费用包含晚餐；请着正装出席', 'published'),
(6, '摄影技巧分享会', 'skillshare', 'https://picsum.photos/400/300?random=106', '专业摄影师分享风光摄影技巧，包括构图、光线运用、后期处理等。', DATE_ADD(NOW(), INTERVAL 8 DAY), DATE_ADD(NOW(), INTERVAL 8 DAY) + INTERVAL 2 HOUR, 10, '游民咖啡', '河源市源城区建设大道88号1楼', 23.7462, 114.6972, 15, 'free', 0, '可自带相机；有实操环节', 'published'),
(7, '周末读书会', 'social', 'https://picsum.photos/400/300?random=107', '每周一次的读书分享会，本期主题：《数字游民生活方式》。', DATE_ADD(NOW(), INTERVAL 4 DAY), DATE_ADD(NOW(), INTERVAL 4 DAY) + INTERVAL 2 HOUR, 20, '河源市图书馆', '河源市源城区文化广场2号', 23.7485, 114.6995, 20, 'free', 0, '请提前阅读指定章节', 'published'),
(8, '户外写生活动', 'outdoor', 'https://picsum.photos/400/300?random=108', '万绿湖畔户外写生，专业美术老师指导，适合绘画爱好者。', DATE_ADD(NOW(), INTERVAL 12 DAY), DATE_ADD(NOW(), INTERVAL 12 DAY) + INTERVAL 4 HOUR, 21, '万绿湖景区', '河源市东源县万绿湖风景区', 23.7250, 114.7250, 10, 'paid', 88.00, '费用包含画材租赁；门票自理', 'published'),
(9, '编程工作坊', 'build', 'https://picsum.photos/400/300?random=109', '全栈开发入门工作坊，从零开始学习Web开发，适合编程新手。', DATE_ADD(NOW(), INTERVAL 6 DAY), DATE_ADD(NOW(), INTERVAL 6 DAY) + INTERVAL 6 HOUR, 1, '河源联合办公空间', '河源市源城区建设大道88号', 23.7460, 114.6970, 20, 'paid', 299.00, '请自带笔记本电脑；有午餐', 'published'),
(10, '瑜伽晨练', 'social', 'https://picsum.photos/400/300?random=110', '每周六早晨的瑜伽活动，在湖畔草地上进行，适合各水平参与者。', DATE_ADD(NOW(), INTERVAL 2 DAY), DATE_ADD(NOW(), INTERVAL 2 DAY) + INTERVAL 1 HOUR, 7, '万绿湖畔民宿', '河源市东源县万绿湖路88号', 23.7305, 114.7205, 15, 'free', 0, '请穿舒适运动服；自备瑜伽垫', 'published'),
(11, '已结束的活动', 'social', 'https://picsum.photos/400/300?random=111', '这是一个已经结束的活动，用于测试历史记录显示。', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 7 DAY) + INTERVAL 2 HOUR, 10, '游民咖啡', '河源市源城区建设大道88号1楼', 23.7462, 114.6972, 20, 'free', 0, NULL, 'published'),
(12, '草稿活动', 'social', 'https://picsum.photos/400/300?random=112', '这是一个草稿状态的活动，不应该在小程序显示。', DATE_ADD(NOW(), INTERVAL 30 DAY), DATE_ADD(NOW(), INTERVAL 30 DAY) + INTERVAL 2 HOUR, 10, '游民咖啡', '河源市源城区建设大道88号1楼', 23.7462, 114.6972, 20, 'free', 0, NULL, 'draft');

-- 活动报名
INSERT INTO event_signups (event_id, user_id, status, created_at) VALUES 
(1, 1, 'signed', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(1, 2, 'signed', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(1, 3, 'signed', NOW()),
(2, 1, 'signed', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(2, 4, 'signed', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(2, 5, 'signed', NOW()),
(3, 2, 'signed', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(3, 6, 'signed', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(3, 7, 'signed', NOW()),
(4, 3, 'signed', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(4, 8, 'signed', NOW()),
(5, 5, 'signed', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(5, 9, 'signed', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(6, 4, 'signed', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(6, 10, 'signed', NOW()),
(7, 6, 'signed', NOW()),
(7, 1, 'signed', NOW()),
(8, 8, 'signed', NOW()),
(9, 3, 'signed', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(9, 7, 'signed', NOW()),
(10, 2, 'signed', NOW()),
(10, 4, 'signed', NOW()),
(10, 6, 'signed', NOW()),
(11, 1, 'attended', DATE_SUB(NOW(), INTERVAL 10 DAY)),
(11, 2, 'attended', DATE_SUB(NOW(), INTERVAL 10 DAY)),
(11, 3, 'cancelled', DATE_SUB(NOW(), INTERVAL 8 DAY));

-- ============================================
-- 帖子数据
-- ============================================
INSERT INTO posts (id, user_id, type, title, content, tags, reward_type, available_time, status, created_at) VALUES 
(1, 1, 'offer', '提供前端开发技术支持', '我是前端开发工程师，有5年React开发经验。可以提供以下服务：\n1. 前端技术问题咨询\n2. 代码Review\n3. 项目架构建议\n\n希望交换：摄影技巧或本地向导服务', '["前端", "React", "技术咨询"]', 'swap', '工作日下午和周末', 'approved', DATE_SUB(NOW(), INTERVAL 5 DAY)),
(2, 2, 'offer', '提供视频拍摄和剪辑服务', '专业视频创作者，有完整的拍摄设备。可提供：\n- 产品宣传视频\n- Vlog拍摄\n- 活动记录\n\n付费服务，价格面议', '["视频", "剪辑", "拍摄"]', 'paid', '随时可约', 'approved', DATE_SUB(NOW(), INTERVAL 4 DAY)),
(3, 3, 'need', '寻找英语口语练习伙伴', '想提高英语口语水平，希望找英语母语者或英语好的朋友一起练习。可以用编程技能交换，或者请喝咖啡。', '["英语", "语言交换"]', 'swap', '晚上7点后', 'approved', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(4, 4, 'offer', '提供产品经理咨询服务', '10年产品经验，曾在大厂负责过千万级用户产品。可以提供：\n- 产品设计建议\n- 用户研究方法\n- 数据分析指导', '["产品", "数据分析", "用户研究"]', 'swap', '周末', 'approved', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(5, 5, 'project', '寻找创业合伙人', '正在做一个教育科技项目，寻找技术合伙人。项目已有初步产品，需要有人一起完善。股权合作，感兴趣的朋友可以聊聊。', '["创业", "教育科技", "合伙人"]', 'swap', '随时', 'approved', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(6, 6, 'offer', '提供插画设计服务', '自由插画师，擅长扁平风格和手绘风格。可接商业插画、头像定制、海报设计等。', '["插画", "设计", "手绘"]', 'paid', '工作日', 'approved', NOW()),
(7, 7, 'need', '寻找羽毛球球友', '周末想打羽毛球，一个人不太好约场。有想一起打球的朋友吗？水平中等，以锻炼为主。', '["羽毛球", "运动"]', 'volunteer', '周末', 'approved', NOW()),
(8, 8, 'offer', '提供品牌设计服务', '品牌设计师，可提供Logo设计、VI设计、品牌策略等服务。有作品集可参考。', '["品牌", "Logo", "VI设计"]', 'paid', '随时', 'approved', DATE_SUB(NOW(), INTERVAL 6 DAY)),
(9, 9, 'need', '寻找技术写作合作', '正在写技术博客，希望找有技术背景的朋友帮忙审稿和提建议。可以提供Java架构方面的咨询作为交换。', '["写作", "技术博客", "Java"]', 'swap', '晚上', 'approved', DATE_SUB(NOW(), INTERVAL 7 DAY)),
(10, 10, 'offer', '提供短视频运营咨询', '有百万粉丝账号运营经验，可以提供短视频内容策划、运营策略、变现建议等。', '["短视频", "运营", "抖音"]', 'paid', '周末', 'approved', DATE_SUB(NOW(), INTERVAL 8 DAY)),
(11, 1, 'need', '寻找本地向导', '刚来河源，希望有本地朋友带我熟悉环境，推荐好吃的餐厅和好玩的地方。', '["本地", "向导", "美食"]', 'volunteer', '周末', 'pending', NOW()),
(12, 3, 'project', '开源项目寻找贡献者', '正在开发一个数字游民社区的开源项目，寻找有兴趣的开发者一起参与。技术栈：Node.js + Vue3', '["开源", "Node.js", "Vue"]', 'volunteer', '随时', 'pending', NOW()),
(13, 5, 'offer', '提供投资理财咨询', '有证券从业资格，可以提供基金、股票投资建议。注意：仅供参考，不构成投资建议。', '["投资", "理财", "基金"]', 'volunteer', '周末', 'rejected', DATE_SUB(NOW(), INTERVAL 10 DAY)),
(14, 7, 'need', '寻找吉他学习伙伴', '刚开始学吉他，希望找同样在学习的朋友一起练习交流。', '["吉他", "音乐", "学习"]', 'swap', '晚上', 'offline', DATE_SUB(NOW(), INTERVAL 15 DAY));

-- 匹配数据
INSERT INTO matches (from_user_id, to_user_id, post_id, message, status, created_at) VALUES 
(1, 3, 3, '我可以教你前端，你帮我练英语口语怎么样？', 'accepted', DATE_SUB(NOW(), INTERVAL 4 DAY)),
(3, 1, 1, '正好想学前端，我们交换吧！', 'accepted', DATE_SUB(NOW(), INTERVAL 4 DAY)),
(2, 5, 5, '对教育科技很感兴趣，可以聊聊吗？', 'sent', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(4, 3, 3, '我英语还可以，可以一起练习', 'rejected', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(6, 4, 4, '想咨询一下产品设计的问题', 'sent', NOW()),
(8, 7, 7, '我也喜欢打羽毛球，周末约？', 'accepted', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(9, 1, 1, '可以帮我看看代码架构吗？', 'accepted', DATE_SUB(NOW(), INTERVAL 5 DAY)),
(10, 2, 2, '想拍一个产品介绍视频，多少钱？', 'sent', NOW()),
(1, 9, 9, '我可以帮你审稿，你帮我看看Java问题', 'sent', NOW()),
(5, 6, 6, '需要为项目做一些插画，可以聊聊吗？', 'accepted', DATE_SUB(NOW(), INTERVAL 2 DAY));

-- ============================================
-- 社群数据
-- ============================================
INSERT INTO community_groups (id, name, description, qr_code_url, status) VALUES 
(1, '河源数字游民新手群', '刚来河源的数字游民交流群，欢迎新人加入，老手分享经验', 'https://picsum.photos/200/200?random=301', 'published'),
(2, '河源活动通知群', '活动报名与通知群，第一时间获取活动信息', 'https://picsum.photos/200/200?random=302', 'published'),
(3, '河源项目协作群', '本地项目协作群，寻找合作伙伴和项目机会', 'https://picsum.photos/200/200?random=303', 'published'),
(4, '河源美食探索群', '分享河源美食，组织聚餐活动', 'https://picsum.photos/200/200?random=304', 'published'),
(5, '河源户外运动群', '徒步、骑行、羽毛球等户外活动组织', 'https://picsum.photos/200/200?random=305', 'published'),
(6, '河源创业者社群', '创业者交流、资源对接、经验分享', 'https://picsum.photos/200/200?random=306', 'published'),
(7, '河源摄影爱好者', '摄影交流、外拍活动、作品分享', 'https://picsum.photos/200/200?random=307', 'published'),
(8, '已下线社群', '这是一个已下线的社群', 'https://picsum.photos/200/200?random=308', 'offline');

-- ============================================
-- 任务数据
-- ============================================
INSERT INTO tasks (id, title, description, category, requirements, start_time, end_time, status) VALUES 
(1, '社区活动志愿者招募', '协助组织周末社区活动，包括场地布置、签到引导、拍照记录等工作。', 'volunteer', '热心、有责任心、有活动组织经验优先', DATE_ADD(NOW(), INTERVAL 3 DAY), DATE_ADD(NOW(), INTERVAL 3 DAY) + INTERVAL 4 HOUR, 'published'),
(2, '网站开发顾问', '为本地企业提供网站建设咨询，包括技术选型、开发流程、成本估算等。', 'consulting', '有3年以上网站开发经验，熟悉主流技术栈', NULL, NULL, 'published'),
(3, '摄影工作坊导师', '分享摄影技巧，带领户外拍摄活动。', 'workshop', '有摄影作品集，有教学经验优先', DATE_ADD(NOW(), INTERVAL 8 DAY), DATE_ADD(NOW(), INTERVAL 8 DAY) + INTERVAL 4 HOUR, 'published'),
(4, '小程序开发项目', '为本地餐厅开发点餐小程序，包含菜单展示、在线下单、订单管理功能。', 'project', '熟悉微信小程序开发，有完整项目经验', DATE_ADD(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 30 DAY), 'published'),
(5, '品牌设计项目', '为本地民宿设计品牌形象，包括Logo、名片、宣传物料等。', 'project', '有品牌设计经验，有民宿行业作品优先', DATE_ADD(NOW(), INTERVAL 5 DAY), DATE_ADD(NOW(), INTERVAL 20 DAY), 'published'),
(6, '英语角主持人', '每周组织英语角活动，带领大家练习英语口语。', 'volunteer', '英语口语流利，有组织活动经验', DATE_ADD(NOW(), INTERVAL 4 DAY), NULL, 'published'),
(7, '短视频运营培训', '为本地商家提供短视频运营培训，包括内容策划、拍摄技巧、运营策略。', 'workshop', '有短视频运营成功案例，有培训经验优先', DATE_ADD(NOW(), INTERVAL 10 DAY), DATE_ADD(NOW(), INTERVAL 10 DAY) + INTERVAL 3 HOUR, 'published'),
(8, '财务咨询顾问', '为数字游民提供税务规划、发票管理等财务咨询服务。', 'consulting', '有财务或税务背景，熟悉自由职业者税务政策', NULL, NULL, 'published'),
(9, '周末徒步领队', '带领周末徒步活动，规划路线、确保安全。', 'volunteer', '熟悉河源周边徒步路线，有户外活动经验', DATE_ADD(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 7 DAY) + INTERVAL 5 HOUR, 'published'),
(10, '下线任务测试', '这是一个下线状态的任务，不应该显示。', 'volunteer', '测试用', NULL, NULL, 'offline');

-- 任务报名
INSERT INTO task_signups (task_id, user_id, status, created_at) VALUES 
(1, 1, 'applied', NOW()),
(1, 2, 'approved', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(2, 3, 'applied', NOW()),
(2, 5, 'approved', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(3, 4, 'applied', NOW()),
(3, 8, 'approved', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(4, 1, 'applied', NOW()),
(4, 3, 'rejected', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(5, 6, 'applied', NOW()),
(5, 8, 'approved', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(6, 2, 'applied', NOW()),
(6, 4, 'approved', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(7, 10, 'applied', NOW()),
(8, 9, 'applied', NOW()),
(9, 7, 'applied', NOW()),
(9, 1, 'approved', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(1, 5, 'done', DATE_SUB(NOW(), INTERVAL 5 DAY)),
(2, 1, 'done', DATE_SUB(NOW(), INTERVAL 10 DAY));

-- ============================================
-- 事件日志
-- ============================================
INSERT INTO event_logs (user_id, event_name, properties, created_at) VALUES 
(1, 'page_view', '{"page": "home", "source": "launch"}', DATE_SUB(NOW(), INTERVAL 1 HOUR)),
(1, 'package_view', '{"package_id": 1}', DATE_SUB(NOW(), INTERVAL 50 MINUTE)),
(1, 'event_signup', '{"event_id": 1}', DATE_SUB(NOW(), INTERVAL 45 MINUTE)),
(2, 'page_view', '{"page": "events", "source": "tab"}', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(2, 'event_view', '{"event_id": 2}', DATE_SUB(NOW(), INTERVAL 115 MINUTE)),
(3, 'post_create', '{"post_id": 3, "type": "need"}', DATE_SUB(NOW(), INTERVAL 3 HOUR)),
(4, 'match_send', '{"post_id": 1, "to_user_id": 3}', DATE_SUB(NOW(), INTERVAL 4 HOUR)),
(5, 'lead_submit', '{"package_id": 5}', DATE_SUB(NOW(), INTERVAL 5 HOUR)),
(NULL, 'page_view', '{"page": "packages", "source": "share"}', DATE_SUB(NOW(), INTERVAL 6 HOUR)),
(1, 'task_signup', '{"task_id": 1}', DATE_SUB(NOW(), INTERVAL 30 MINUTE)),
(2, 'guide_view', '{"poi_id": 1}', DATE_SUB(NOW(), INTERVAL 20 MINUTE)),
(3, 'community_join', '{"group_id": 1}', DATE_SUB(NOW(), INTERVAL 10 MINUTE));

-- ============================================
-- 轮播图数据
-- ============================================
INSERT INTO banners (id, title, image_url, url, sort_order, status) VALUES
(1, '河源数字游民 7 日体验包', 'https://picsum.photos/750/320?random=201', '/pages/packages/detail/index?id=1', 1, 'published'),
(2, '万绿湖徒步活动报名中', 'https://picsum.photos/750/320?random=202', '/pages/events/detail/index?id=3', 2, 'published'),
(3, '客家文化探索之旅', 'https://picsum.photos/750/320?random=203', '/pages/packages/detail/index?id=4', 3, 'published'),
(4, '数字游民创业孵化套餐', 'https://picsum.photos/750/320?random=204', '/pages/packages/detail/index?id=5', 4, 'published'),
(5, '加入数字游民社群', 'https://picsum.photos/750/320?random=205', '/pages/community/index', 5, 'published');

-- ============================================
-- 审计日志
INSERT INTO audit_logs (operator_id, action, target_type, target_id, details, created_at) VALUES 
(1, 'create', 'package', 1, '{"title": "河源数字游民7日体验包"}', DATE_SUB(NOW(), INTERVAL 10 DAY)),
(1, 'update', 'package', 1, '{"status": "draft -> published"}', DATE_SUB(NOW(), INTERVAL 9 DAY)),
(1, 'create', 'event', 1, '{"title": "周末咖啡品鉴会"}', DATE_SUB(NOW(), INTERVAL 8 DAY)),
(2, 'update', 'event', 1, '{"capacity": 15 -> 20}', DATE_SUB(NOW(), INTERVAL 7 DAY)),
(1, 'approve', 'post', 1, '{"status": "pending -> approved"}', DATE_SUB(NOW(), INTERVAL 5 DAY)),
(2, 'approve', 'post', 2, '{"status": "pending -> approved"}', DATE_SUB(NOW(), INTERVAL 4 DAY)),
(1, 'update', 'lead', 2, '{"status": "submitted -> contacted"}', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(2, 'create', 'task', 1, '{"title": "社区活动志愿者招募"}', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(1, 'approve', 'task_signup', 2, '{"status": "applied -> approved"}', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(2, 'reject', 'post', 13, '{"reason": "涉及金融投资建议，不符合平台规范"}', DATE_SUB(NOW(), INTERVAL 10 DAY));

-- ============================================
-- 数据统计
-- ============================================
SELECT '数据初始化完成' AS message;
SELECT '用户' AS 表名, COUNT(*) AS 数量 FROM users
UNION ALL SELECT '用户资料', COUNT(*) FROM user_profiles
UNION ALL SELECT '套餐', COUNT(*) FROM packages
UNION ALL SELECT '套餐项目', COUNT(*) FROM package_items
UNION ALL SELECT '套餐可选服务', COUNT(*) FROM package_optional_services
UNION ALL SELECT '套餐意向', COUNT(*) FROM package_leads
UNION ALL SELECT 'POI', COUNT(*) FROM pois
UNION ALL SELECT '活动', COUNT(*) FROM events
UNION ALL SELECT '活动报名', COUNT(*) FROM event_signups
UNION ALL SELECT '帖子', COUNT(*) FROM posts
UNION ALL SELECT '匹配', COUNT(*) FROM matches
UNION ALL SELECT '社群', COUNT(*) FROM community_groups
UNION ALL SELECT '任务', COUNT(*) FROM tasks
UNION ALL SELECT '任务报名', COUNT(*) FROM task_signups
UNION ALL SELECT '管理员', COUNT(*) FROM admins
UNION ALL SELECT '事件日志', COUNT(*) FROM event_logs
UNION ALL SELECT '审计日志', COUNT(*) FROM audit_logs;
