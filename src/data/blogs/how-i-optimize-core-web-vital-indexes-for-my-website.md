---
title: 'How I optimize core web vital indexes for my website?'
summary: 'I moved to a new team at the end of 2025, within 7 months, I have reduced the bad URLs count by 99%, reduced the TBT by 10 times, and increased the overall score by roughly 20 points. In this article, I will share how I achieved this.'
date: '2026-06-06'
lastModified: '2026-06-06'
authors: ['vawnnam']
draft: false
tags: ['performance', 'cwv']
---

13.400 URL với chỉ số Core Web Vitals không đạt chuẩn. Đó là di sản tôi tiếp nhận khi gia nhập team mới vào cuối năm 2025. 7 tháng sau, con số đó còn lại chưa tới 200.

Trước đó, tôi chủ yếu phụ trách các dự án back-office nội bộ — thứ mà chỉ cần hoạt động đúng nghiệp vụ, không ai quan tâm đến performance. Nay chuyển sang một website e-commerce hướng tới người dùng cuối, với nhiệm vụ đầu tiên là tối ưu Core Web Vitals, tôi gần như bắt đầu từ con số 0.

Bài viết này ghi lại hành trình đó — từ giai đoạn mò mẫm, đến khi xây dựng được chiến lược bài bản, và cuối cùng tìm ra root cause ẩn sau một bug INP tưởng như không thể tái hiện.

---

## Core Web Vitals là gì?

### Các chỉ số cần quan tâm

[Core Web Vitals (CWV)](https://web.dev/articles/vitals) là bộ chỉ số do Google phát triển để đo lường trải nghiệm người dùng thực tế trên trang web. Hiện tại gồm 3 chỉ số chính:

- **Largest Contentful Paint (LCP):** thời gian để phần tử lớn nhất trên trang (ảnh hero, đoạn văn bản chính) được hiển thị hoàn toàn. Ngưỡng tốt: **< 2.5s**.
- **Interaction to Next Paint (INP):** thời gian từ khi người dùng tương tác (click, tap, gõ phím) đến khi trang phản hồi bằng một thay đổi giao diện. Ngưỡng tốt: **< 200ms**.
- **Cumulative Layout Shift (CLS):** mức độ "nhảy layout" không mong muốn trong quá trình tải trang. Ngưỡng tốt: **< 0.1**.

Ngoài 3 chỉ số trên, một chỉ số Lab data quan trọng cũng được theo dõi thường xuyên là **Total Blocking Time (TBT)** — tổng thời gian main thread bị block bởi các tác vụ nặng, khiến trang không thể phản hồi người dùng. TBT không phải CWV chính thức nhưng là proxy tốt cho INP trong môi trường Lab.

### Tại sao CWV quan trọng?

CWV ảnh hưởng trực tiếp đến 2 thứ: **trải nghiệm người dùng** và **thứ hạng SEO**. Một trang web có LCP chậm, INP cao, hoặc layout bị giật sẽ khiến người dùng rời đi trước khi họ kịp mua hàng — đặc biệt nguy hiểm với e-commerce.

Từ năm 2021, Google chính thức đưa CWV vào bộ tiêu chí xếp hạng tìm kiếm. Điều này có nghĩa: tối ưu CWV không chỉ là cải thiện UX, mà còn trực tiếp ảnh hưởng đến organic traffic.

### Công cụ đo lường

| Công cụ                                                     | Mục đích                                                      |
| ----------------------------------------------------------- | ------------------------------------------------------------- |
| [Google PageSpeed Insights](https://pagespeed.web.dev/)     | Báo cáo Lab + Field data theo URL                             |
| [Lighthouse](https://developer.chrome.com/docs/lighthouse/) | Đo Lab data ngay trên trình duyệt, dễ tích hợp CI             |
| [CrUX Dashboard](https://cruxvis.withgoogle.com/)           | Theo dõi Field data theo thời gian, phân tách theo loại trang |
| Google Search Console                                       | Theo dõi bad URLs và trạng thái xếp hạng CWV                  |

### Lab data vs. Field data — điều quan trọng cần hiểu trước

Đây là điểm mà nhiều người hay nhầm lẫn khi bắt đầu tối ưu CWV:

- **Lab data:** đo trong môi trường kiểm soát (Lighthouse, PageSpeed Insights), với thiết bị và mạng mô phỏng. Kết quả có ngay lập tức sau mỗi thay đổi. Hữu ích để debug và đánh giá nhanh.
- **Field data (Real User Monitoring):** đo từ người dùng thực tế, tổng hợp trong 28 ngày gần nhất. Đây là thứ Google dùng để đánh giá và xếp hạng website của bạn.

**Hệ quả thực tế:** Lab data tốt chưa chắc đã cải thiện Field data. Ngược lại, một fix nhỏ có thể mang lại tác động lớn trên Field data mà Lab data lại không phản ánh được. Vì vậy, cần theo dõi song song cả hai.

---

## Hiện trạng ban đầu

Website được chia làm 3 loại trang chính: **trang chủ**, **trang danh mục (collection)**, và **trang chi tiết sản phẩm (detail)**. Dưới đây là bộ chỉ số Lab data đo được vào đầu Q4 2025:

| Trang      | Thiết bị | Performance | FCP  | LCP   | TBT      | CLS   | Speed Index |
| ---------- | -------- | ----------- | ---- | ----- | -------- | ----- | ----------- |
| Home       | Mobile   | 32          | 2.5s | 11.9s | 11,840ms | 0     | 12.7s       |
| Home       | Desktop  | 16          | 0.9s | 16.9s | 7,140ms  | 0.01  | 5.0s        |
| Collection | Mobile   | 30          | 3.1s | 15.3s | 13,210ms | 0.005 | 23.2s       |
| Collection | Desktop  | 34          | 0.9s | 16.9s | 7,140ms  | 0.01  | 5.0s        |
| Detail     | Mobile   | 52          | 2.6s | 2.9s  | 11,490ms | 0     | 10.5s       |
| Detail     | Desktop  | 50          | 0.6s | 2.3s  | 2,620ms  | 0.087 | 2.7s        |

Tổng số bad URLs trên Google Search Console vào thời điểm này là **~13.400 URL**, phần lớn đến từ trang chi tiết sản phẩm trên mobile.

![Bad URLs Q4 2025](/static/images/how-i-optimize-core-web-vital-indexes-for-my-website/bad_url_q4_2025.png)

Nhìn vào số liệu, có thể thấy ngay 2 vấn đề nghiêm trọng nhất:

1. **LCP quá cao** — 11–16s trên hầu hết các trang, gấp 4–6 lần ngưỡng tốt.
2. **TBT cực kỳ cao** — 7.000–13.000ms, cho thấy main thread đang bị block nặng nề, ảnh hưởng trực tiếp đến INP.

---

## Chiến lược tối ưu

Trước khi bắt tay vào làm, tôi xác định 2 KPI chính để đo lường hiệu quả:

1. **Bad URLs count:** số URL có CWV không đạt chuẩn theo Google Search Console. Mục tiêu: giảm càng nhiều càng tốt.
2. **Overall CWV score:** điểm tổng hợp trên CrUX Dashboard. Mục tiêu: cải thiện đều trên cả 3 loại trang.

Về mặt phương pháp, tôi áp dụng vòng lặp sau cho từng chu kỳ tối ưu:

> **Đo lường → Phân tích user journey thực tế → Xác định điểm nghẽn → Ưu tiên theo impact → Implement → Theo dõi 28 ngày → Lặp lại**

Tại sao tập trung vào **INP** thay vì LCP? Vì LCP chủ yếu phụ thuộc vào server response time và tài nguyên tĩnh — những thứ cần sự phối hợp của nhiều team (backend, infra). Trong khi đó, INP nằm hoàn toàn trong tầm kiểm soát của frontend, và đây là chỉ số duy nhất có nhiều URL đang fail trên Field data.

---

## Phase 1: Quick Wins (Q4 2025)

Giai đoạn này tôi vừa làm quen với codebase, vừa tìm hiểu về CWV. Chưa có chiến lược rõ ràng, các action chủ yếu là những tối ưu phổ biến mang tính "vệ sinh" để cải thiện Lab data nhanh:

| Action                                                           | Kết quả                                |
| ---------------------------------------------------------------- | -------------------------------------- |
| Defer các tracking/analytics script trên trang chi tiết sản phẩm | INP: 792ms → 688ms                     |
| Lazy load các component không visible ngay khi tải trang         | Bundle size: 800KB → 500KB (giảm ~30%) |
| Deprecate các tính năng không còn sử dụng                        | First Load JS: 620KB → 540KB           |
| Tích hợp n8n để tự động hóa theo dõi và báo cáo CWV hàng tuần    | —                                      |

Kết quả Lab data cải thiện nhẹ, nhưng **Field data và bad URLs count gần như không thay đổi.** Lý do: những tối ưu trên chủ yếu cải thiện chỉ số tải trang (LCP, FCP), trong khi vấn đề cốt lõi — INP của các interaction quan trọng — vẫn chưa được chạm đến.

Đây là bài học đầu tiên: **Lab data tốt hơn không có nghĩa là Field data tốt hơn.**

---

## Phase 2: Tối ưu có chiến lược (Q1 & Q2 2026)

Bước sang Q1 2026, việc tối ưu CWV trở thành OKR chính thức của domain. Điều này có nghĩa là có thêm resource: 1 BA theo dõi sát sao, weekly review meeting với team, và quan trọng nhất — tôi có đủ thời gian để làm bài bản.

**Thay đổi lớn nhất ở giai đoạn này không phải là kỹ thuật, mà là phương pháp.**

Thay vì đoán xem cần tối ưu gì, tôi bắt đầu **phân tích từng user action trên production**, tài liệu hóa chúng, đo INP của từng action, và sắp xếp theo thứ tự ưu tiên dựa trên mức độ ảnh hưởng. Kết quả là 2 tài liệu phân tích chi tiết cho trang collection và trang detail.

Chỉ số của trang web vào cuối Q1 2026:

**Lab Data**

| Trang      | Thiết bị | Performance | FCP  | LCP   | TBT      | CLS   | Speed Index |
| ---------- | -------- | ----------- | ---- | ----- | -------- | ----- | ----------- |
| Home       | Mobile   | 13          | 2.6s | 10.3s | 14,330ms | 0.403 | 14.4s       |
| Home       | Desktop  | 23          | 0.6s | 4.5s  | 2,140ms  | 0.341 | 3.6s        |
| Collection | Mobile   | 37          | 3.0s | 5.6s  | 13,980ms | 0.009 | 7.2s        |
| Collection | Desktop  | 54          | 0.7s | 1.6s  | 10,300ms | 0.09  | 3.4s        |
| Detail     | Mobile   | 44          | 2.4s | 4.2s  | 12,460ms | 0     | 9.8s        |
| Detail     | Desktop  | 58          | 0.6s | 1.3s  | 5,220ms  | 0.007 | 4.1s        |

> **Lưu ý:** Điểm Performance của một số trang (đặc biệt Home Mobile: 32 → 13) giảm so với baseline. Nguyên nhân là trong giai đoạn này có nhiều feature mới được phát triển song song, làm tăng bundle size và ảnh hưởng đến Lab score. Đây là một thực tế phổ biến khi tối ưu CWV song song với phát triển sản phẩm.

**Field Data (28-day period)**

| Trang      | Thiết bị | LCP  | INP     | CLS  | FCP  | TTFB |
| ---------- | -------- | ---- | ------- | ---- | ---- | ---- |
| Home       | Mobile   | 1.5s | 1,577ms | 0.05 | 1.3s | 0.5s |
| Home       | Desktop  | 2s   | 187ms   | 0.71 | 0.8s | 0.5s |
| Collection | Mobile   | 2.3s | 1,346ms | 0.08 | 2s   | 1.5s |
| Collection | Desktop  | 1.4s | 201ms   | 0.46 | 1.1s | 0.8s |
| Detail     | Mobile   | 3s   | 1,105ms | 0.01 | 2.6s | 2s   |
| Detail     | Desktop  | 2.4s | 121ms   | 0.16 | 1.4s | 1s   |

INP trên mobile đang ở mức thảm họa — **1.100ms đến 1.577ms**, gấp 5–7 lần ngưỡng tốt. Đây rõ ràng là mục tiêu số 1.

### Đối mặt với INP — bài toán không thể tái hiện

Từ dữ liệu phân tích user journey, action có INP tệ nhất và tần suất cao nhất trên trang detail là **"Add to cart"**. Khi người dùng click nút này, một loạt sự kiện được kích hoạt: gửi request cập nhật giỏ hàng, hiển thị loading icon, cập nhật giao diện, hiển thị thông báo thành công.

Vấn đề là: **INP của action này rất tệ trên production, nhưng hoàn toàn bình thường trên staging và local.** Không có cách nào tái hiện được.

Tôi phải làm việc hoàn toàn dựa trên suy luận từ code. Nhiều kỹ thuật đã được thử:

- Memoization các computed values nặng
- Lazy load các component không cần thiết trong flow Add to cart
- Defer các side-effect bằng `requestIdleCallback` và `setTimeout`

Tất cả đều không có hiệu quả đáng kể. Việc tối ưu Add to cart tạm thời rơi vào bế tắc.

### Bước ngoặt — Category Menu

Trong lúc đó, tôi chuyển sang xử lý một action khác trên trang collection: **mở menu danh mục**. INP của action này đang ở mức **~800ms** — một con số không thể chấp nhận được cho một thao tác đơn giản như vậy.

Cơ chế hoạt động: trên mobile, menu danh mục nằm ở bottom bar. Khi người dùng tap vào, một drawer mở ra hiển thị danh sách ~200 danh mục theo cấu trúc cha–con. Danh mục cha ở cột trái, tap vào một danh mục cha sẽ hiển thị danh mục con ở cột phải.

Sau khi đọc code, tìm ra 2 vấn đề:

1. Toàn bộ cây danh mục (cha + tất cả con của từng cha) được **tính toán và render ngay từ đầu**
2. Các danh mục không được hiển thị bị ẩn bằng `display: none` — nghĩa là browser vẫn phải **tính layout cho tất cả** chúng

Fix rất đơn giản: chỉ render danh mục con khi danh mục cha tương ứng được người dùng chọn.

**Kết quả: INP giảm từ ~800ms xuống ~80ms.**

### Root cause của Add to cart INP

Song song với việc tối ưu menu, tôi thực hiện một refactor nhỏ: **tách loading icon của Add to cart ra khỏi `LoadingProvider`**.

Kiến trúc context của app lúc đó:

```jsx
<XProvider>
  <LoadingProvider>
    {/* Global loading state */}
    ...
    <CartProvider>
      {/* Xử lý giỏ hàng, Add to cart */}
      ...
      <Layout />
    </CartProvider>
  </LoadingProvider>
</XProvider>
```

Sau khi cả 2 thay đổi được deploy lên production, **INP của Add to cart giảm xuống dưới 200ms**.

**Tại sao?** Mối liên hệ không hề rõ ràng ngay từ đầu, nhưng nhìn lại thì hoàn toàn có lý:

> Khi người dùng click "Add to cart" → `LoadingProvider` setState để hiển thị loading icon → React re-render toàn bộ cây component bên trong `LoadingProvider` → bao gồm cả `Layout` với toàn bộ cây 200 danh mục chưa được tối ưu → Browser phải tính layout cho tất cả → **Trì hoãn việc paint loading icon lên màn hình → INP tăng cao**.

Sau 2 thay đổi:

- Menu danh mục chỉ render những gì cần thiết → re-render nhanh hơn nhiều
- Loading icon được render độc lập, không phụ thuộc vào `LoadingProvider` → browser có thể paint ngay lập tức

Đây là ví dụ điển hình của **butterfly effect trong React rendering**: một component tưởng chừng không liên quan lại là nguyên nhân gốc rễ của một performance bug ở nơi khác hoàn toàn.

---

## Kết quả

Sau 28 ngày theo dõi để Field data được cập nhật trên Google Search Console:

| Chỉ số                  | Trước     | Sau           |
| ----------------------- | --------- | ------------- |
| Bad URLs count (mobile) | ~13.400   | ~200          |
| Mức giảm bad URLs       | —         | **~99%**      |
| Overall CWV score       | —         | Tăng ~20 điểm |
| TBT                     | ~11.490ms | ~1.500ms      |

![Bad URL result 2026](/static/images/how-i-optimize-core-web-vital-indexes-for-my-website/bad_url_result.png)

![Bot Monitor Result](/static/images/how-i-optimize-core-web-vital-indexes-for-my-website/monitor_result.png)

---

## Lessons Learned

**1. Data trước, action sau.** Giai đoạn Phase 1 với các action theo cảm tính gần như không tạo ra tác động thực sự. Chỉ khi có tài liệu phân tích user journey và số liệu cụ thể, mới xác định đúng được điểm cần tối ưu.

**2. Lab data và Field data đo những thứ khác nhau.** Đừng vui mừng khi Lighthouse score tăng nếu bad URLs count không giảm. Và đừng nản lòng khi Lab score đi xuống do feature mới — Field data mới là thứ Google quan tâm.

**3. Root cause có thể ẩn ở một nơi bạn không ngờ tới.** Bug INP của "Add to cart" hoàn toàn không đến từ code của Add to cart. Nếu tôi không tình cờ tối ưu category menu song song, có thể sẽ mãi không tìm ra được nguyên nhân thực sự.

**4. Không thể tái hiện bug ≠ không thể fix bug.** Với các chỉ số chỉ xấu trên production (thiết bị thật, mạng thật, data thật), đôi khi cách duy nhất là ngồi đọc code, lý luận từng bước rendering pipeline, và thử từng hypothesis một.

**5. Tổ chức và visibility quan trọng không kém kỹ thuật.** Việc OKR hóa, có BA theo dõi, weekly review meeting đã tạo ra áp lực và focus đúng hướng. Performance optimization là marathon, không phải sprint.

---

## Kết luận

Tối ưu Core Web Vitals dạy tôi một thứ mà nhiều năm làm back-office không bao giờ có cơ hội học: cách tư duy về **browser rendering pipeline**, cách đo lường chính xác, và cách tìm kiếm nguyên nhân gốc rễ trong một hệ thống phức tạp mà bạn chưa nắm rõ.

Nếu bạn đang bắt đầu hành trình tương tự, lời khuyên của tôi là: **đừng vội tối ưu**. Hãy dành thời gian hiểu rõ dữ liệu, phân tích user journey thực tế, và xác định đúng điểm nghẽn trước. Phần còn lại sẽ tự nhiên hơn nhiều.
