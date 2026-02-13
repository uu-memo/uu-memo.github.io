/**
 * UU MEMO GitHub Bridge - GAS 中繼程式
 * 負責將圖片備份至 Google Drive 並提交至 GitHub 倉庫
 */

function doPost(e) {
  const props = PropertiesService.getScriptProperties();
  const token = props.getProperty('GITHUB_PAT');
  const owner = props.getProperty('GITHUB_OWNER');
  const repo = props.getProperty('GITHUB_REPO');

  try {
    const data = JSON.parse(e.postData.contents);
    const { action, path, content, message, branch = 'main' } = data;

    if (action === 'upload_file') {
      return uploadToGitHub(owner, repo, path, content, message, branch, token);
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Unknown action'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 透過 GitHub REST API 提交檔案
 */
function uploadToGitHub(owner, repo, path, contentBase64, message, branch, token) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  
  // 1. 先嘗試取得該路徑的檔案（檢查是否存在以更新 SHA）
  let sha = null;
  try {
    const checkResponse = UrlFetchApp.fetch(url, {
      method: 'get',
      headers: { 'Authorization': `Bearer ${token}` },
      muteHttpExceptions: true
    });
    if (checkResponse.getResponseCode() === 200) {
      sha = JSON.parse(checkResponse.getContentText()).sha;
    }
  } catch (e) {}

  // 2. 構建提交資料
  const payload = {
    message: message,
    content: contentBase64, // GitHub 要求 Base64
    branch: branch
  };
  if (sha) payload.sha = sha;

  const options = {
    method: 'put',
    contentType: 'application/json',
    headers: { 'Authorization': `Bearer ${token}` },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  return ContentService.createTextOutput(response.getContentText()).setMimeType(ContentService.MimeType.JSON);
}

/**
 * 中文說明：此 GAS 指令碼負責接收後台傳來的內容，檢查 GitHub 是否已有該檔案，
 * 若無則新增，若有則更新（自動處理 SHA），並透過 UrlFetchApp 執行 GitHub API 調用。
 */
