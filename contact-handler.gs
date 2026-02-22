/**
 * UU MEMO Contact Form Handler - GAS 中繼程式
 * 負責接收聯絡表單資料並透過 Gmail 別名 (uu-memo@outlook.com) 轉寄通知
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const { name, email, subject, message } = data;
    
    // 設定目標信箱與寄件者別名
    // 注意：uu-memo@outlook.com 必須已在您的 Gmail 設定中的「透過以下地址傳送郵件」完成設定
    const targetEmail = "uu-memo@outlook.com";
    const aliasEmail = "uu-memo@outlook.com";
    
    const emailBody = `您有一則新的聯絡訊息：\n\n` +
                      `姓名：${name}\n` +
                      `電子郵件：${email}\n` +
                      `主旨：${subject}\n` +
                      `訊息內容：\n${message}`;
                      
    // 使用 GmailApp 以支援進階參數 (from)
    GmailApp.sendEmail(targetEmail, `[UU MEMO] 新的聯絡訊息：${subject}`, emailBody, {
      from: aliasEmail,
      replyTo: email
    });
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Email sent via alias"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 中文說明：此 GAS 指令碼負責接收聯絡表單資料。
 * 特別使用 GmailApp.sendEmail 並指定 'from' 參數，
 * 以確保信件是透過您的別名帳號 (uu-memo@outlook.com) 寄出。
 */
