/**
 * UU MEMO Contact Form Handler - 專業優化版
 * 負責接收聯絡表單資料、驗證金鑰，並發送 HTML 格式的郵件通知。
 */

// 新增 doGet 方便直接在瀏覽器貼上網址測試 GAS 是否正常運作
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "ok",
    message: "GAS Service is running. Please use POST for form submissions.",
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const props = PropertiesService.getScriptProperties();
  const SECRET_TOKEN = props.getProperty('GAS_SECRET_TOKEN');
  
  try {
    // 檢查是否有傳入 POST 資料
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("No payload received. Ensure the request is a valid POST with content.");
    }

    const data = JSON.parse(e.postData.contents);
    const { name, email, subject, message, token } = data;
    
    // 1. 金鑰驗證 (Security Check)
    // 偵錯日誌：這會記錄在 GAS 內部的「執行作業」控制面板中
    if (!SECRET_TOKEN || token !== SECRET_TOKEN) {
      console.error("驗證失敗：Token 不符合或未設定。");
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "Unauthorized: Invalid or missing token"
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // 2. 設定目的地 (優先讀取環境變數，若無則使用預設信箱)
    let targetEmail = props.getProperty('TARGET_EMAIL');
    if (!targetEmail) {
      targetEmail = 'wj209ing@gmail.com';
    }
    
    // 3. 構建郵件內容
    // 純文字備份
    const textBody = `您有一則新的聯絡訊息：\n\n` +
                     `姓名：${name}\n` +
                     `電子郵件：${email}\n` +
                     `主旨：${subject}\n` +
                     `訊息內容：\n${message}`;

    // 豪華 HTML 範本
    const htmlBody = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 12px; background-color: #ffffff;">
        <div style="padding-bottom: 20px; border-bottom: 1px solid #eeeeee; margin-bottom: 20px;">
          <h2 style="color: #1a1a1a; margin: 0; font-size: 20px;">[UU MEMO] 新的聯絡訊息</h2>
          <p style="color: #666666; font-size: 14px; margin-top: 5px;">收到一份來自聯絡表單的正式請求</p>
        </div>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; color: #888888; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; width: 100px;">寄件者</td>
            <td style="padding: 10px 0; color: #1a1a1a; font-weight: bold; font-size: 14px;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #888888; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">電子郵件</td>
            <td style="padding: 10px 0; font-size: 14px;"><a href="mailto:${email}" style="color: #0066cc; text-decoration: none;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #888888; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">主旨</td>
            <td style="padding: 10px 0; color: #1a1a1a; font-size: 14px;">${subject}</td>
          </tr>
        </table>
        
        <div style="margin-top: 30px; padding: 20px; background-color: #f9f9f9; border-radius: 8px; border-left: 4px solid #1a1a1a;">
          <h3 style="margin-top: 0; font-size: 12px; color: #888888; text-transform: uppercase; letter-spacing: 1px;">訊息內容</h3>
          <p style="color: #333333; line-height: 1.6; white-space: pre-wrap; margin-bottom: 0; font-size: 15px;">${message}</p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee; text-align: center;">
          <p style="color: #aaaaaa; font-size: 11px;">此郵件由 UU MEMO 自動系統 (Google Apps Script) 發出</p>
        </div>
      </div>
    `;
    
    // 4. 發送郵件
    GmailApp.sendEmail(targetEmail, `[UU MEMO] 新的聯絡訊息：${subject}`, textBody, {
      htmlBody: htmlBody,
      replyTo: email
    });
    
    console.log("郵件已成功寄出至: " + targetEmail);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Email sent successfully"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error("發生錯誤: " + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
