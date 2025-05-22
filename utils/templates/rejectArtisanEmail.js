const rejectArtisanEmailHtml = (name) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>تم رفض الطلب</title>
  <style>
    body {
      font-family: 'Segoe UI', sans-serif;
      background-color: #f4f4f4;
      color: #333;
      padding: 20px;
    }
    .container {
      background-color: #fff;
      padding: 30px;
      border-radius: 10px;
      max-width: 600px;
      margin: auto;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      color: #c62828;
      text-align: center;
    }
    .btn {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 20px;
      background-color: #c62828;
      color: #fff;
      text-decoration: none;
      border-radius: 5px;
    }
    .footer {
      margin-top: 30px;
      font-size: 13px;
      color: #aaa;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2 class="header">مرحبًا ${name}</h2>
    <p>نأسف لإبلاغك بأن طلبك للتحويل إلى <strong>حرفي</strong> على منصة <strong>HandMade</strong> قد تم رفضه في الوقت الحالي.</p>
    <p>يمكنك إعادة المحاولة لاحقًا أو التواصل معنا إذا كان لديك أي استفسار أو طلب توضيح.</p>

    <a href="mailto:support@handmade.com" class="btn">تواصل مع الدعم</a>

    <div class="footer">
      &copy; 2025 Handmade. جميع الحقوق محفوظة.
    </div>
  </div>
</body>
</html>
`;

module.exports = rejectArtisanEmailHtml;
