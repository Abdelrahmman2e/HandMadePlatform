const approveArtisanEmailHtml = (name) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>تمت الموافقة على طلبك!</title>
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
      color: #2e7d32;
      text-align: center;
    }
    .btn {
      display: inline-block;
      margin-top: 20px;
      padding: 12px 20px;
      background-color: #2e7d32;
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
    <h2 class="header">تهانينا ${name}، تمت الموافقة على طلبك! 🎉</h2>
    <p>يسعدنا إبلاغك بأنه قد تم قبول طلبك لتصبح <strong>حرفيًا</strong> على منصة <strong>HandMade</strong>.</p>
    <p>يمكنك الآن الدخول إلى لوحة التحكم الخاصة بالحرفيين وبدء إضافة منتجاتك الإبداعية!</p>

    <a href="https://your-handmade-platform.com/dashboard" class="btn">الذهاب إلى لوحة التحكم</a>

    <p>نتمنى لك التوفيق في مسيرتك معنا!</p>

    <div class="footer">
      &copy; 2025 Handmade. جميع الحقوق محفوظة.
    </div>
  </div>
</body>
</html>
`;

module.exports = approveArtisanEmailHtml;
