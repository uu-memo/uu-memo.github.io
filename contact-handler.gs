/**
 * UU MEMO Contact Form Handler - GAS 中繼程式
 * 負責接收聯絡表單資料並透過 Gmail 別名 (uu-memo@outlook.com) 轉寄通知
 */

function doPost(e) {
  const props = PropertiesService.getScriptProperties();
  const SECRET_TOKEN = props.getProperty('GAS_SECRET_TOKEN'); // 請在 GAS「專案設定」->「指令碼屬性」中設定此值
  
  try {
    const data = JSON.parse(e.postData.contents);
    const { name, email, subject, message, token } = data;
    
    // 1. 金鑰驗證 (Security Check)
    if (!SECRET_TOKEN || token !== SECRET_TOKEN) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "error",
        message: "Unauthorized: Invalid token"
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // 2. 設定目標信箱與寄件者別名
    const targetEmail = "uu-memo@outlook.com";
    const aliasEmail = "uu-memo@outlook.com";
    
    const emailBody = `您有一則新的聯絡訊息：\n\n` +
                      `姓名：${name}\n` +
                      `電子郵件：${email}\n` +
                      `主旨：${subject}\n` +
                      `訊息內容：\n${message}`;
                      
    GmailApp.sendEmail(targetEmail, `[UU MEMO] 新的聯絡訊息：${subject}`, emailBody, {
      from: aliasEmail,
      replyTo: email
    });
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Email sent successfully"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 中文說明：此 GAS 指令碼已加入安全性驗證。
 * 會比對請求中的 token 與 GAS 內部的 'GAS_SECRET_TOKEN' 是否一致。
 * 請務必在 GAS 的「指令碼屬性」中新增該變數以啟用保護。
 */
