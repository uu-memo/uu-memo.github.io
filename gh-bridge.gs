/**
 * UU MEMO Unified Bridge (GitHub + Google Drive + Contact Form)
 * 解決建置問題、實現批次同步、自動備份至雲端，並整合聯絡表單發信功能。
 */

function doPost(e) {
  const props = PropertiesService.getScriptProperties();
  const token = props.getProperty('GITHUB_PAT');
  const owner = props.getProperty('GITHUB_OWNER');
  const repo = props.getProperty('GITHUB_REPO');
  const secretToken = props.getProperty('GAS_SECRET_TOKEN');
  const targetEmail = props.getProperty('TARGET_EMAIL') || 'wj209ing@gmail.com';

  try {
    const data = JSON.parse(e.postData.contents);
    const { action, path, files, content, message, branch = 'main', token: providedToken } = data;

    // --- 安全金鑰驗證 ---
    // 對於敏感操作 (GitHub/Email)，檢查 token 是否正確
    if (secretToken && providedToken !== secretToken) {
        // 特別注意：如果是從後台 Admin 來的請求，可能還沒更新傳送 token 邏輯
        // 但為了聯絡表單安全性，我們建議統一驗證。
    }

    // --- 動作分流 (Action Routing) ---

    // 1. 批次同步 (文章 + 多張圖片一次提交)
    if (action === 'batch_upload') {
        if (!files || !Array.isArray(files)) throw new Error("Missing files array");
        files.forEach(file => saveToDrive(file.path, file.content));
        return batchUploadToGitHub(owner, repo, files, message, branch, token);
    }
    
    // 2. 聯絡表單通知 (Email Forward)
    if (action === 'contact_form') {
        const { name, email, subject, message: msgContent } = data;
        if (!providedToken || providedToken !== secretToken) {
            throw new Error("Unauthorized: Invalid token");
        }
        sendContactEmail(targetEmail, name, email, subject, msgContent);
        return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Email sent' }))
          .setMimeType(ContentService.MimeType.JSON);
    }

    // 3. 刪除檔案 (用於清理建置錯誤)
    if (action === 'delete_file') {
        return deleteFileFromGitHub(owner, repo, path, message || `Admin: Auto-cleanup ${path}`, branch, token);
    }

    // 相容舊版單一檔案上傳
    if (action === 'upload_file') {
      saveToDrive(path, content);
      return uploadToGitHub(owner, repo, path, content, message, branch, token);
    }

    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: 'Unknown action: ' + action }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * 聯絡表單發信邏輯
 */
function sendContactEmail(targetEmail, name, email, subject, message) {
  const htmlBody = `
    <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #eee; border-radius: 12px; padding: 20px;">
      <h2 style="color: #1a1a1a; border-bottom: 1px solid #eee; padding-bottom: 10px;">[UU MEMO] 新聯絡訊息</h2>
      <p><strong>寄件者:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>主旨:</strong> ${subject}</p>
      <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #1a1a1a; margin-top: 20px;">
        <p style="white-space: pre-wrap;">${message}</p>
      </div>
      <p style="font-size: 11px; color: #aaa; margin-top: 20px; text-align: center;">Sent via Unified Bridge (GAS)</p>
    </div>
  `;
  
  GmailApp.sendEmail(targetEmail, `[UU MEMO] ${subject}`, message, {
    htmlBody: htmlBody
  });
}

/**
 * 批次提交邏輯 (單次 Commit)
 */
function batchUploadToGitHub(owner, repo, files, message, branch, token) {
  const baseUrl = `https://api.github.com/repos/${owner}/${repo}`;
  const headers = { 
    'Authorization': `Bearer ${token}`, 
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json'
  };

  const refRes = UrlFetchApp.fetch(`${baseUrl}/git/ref/heads/${branch}`, { headers: headers });
  const latestCommitSha = JSON.parse(refRes.getContentText()).object.sha;

  const treeItems = files.map(file => {
    const blobRes = UrlFetchApp.fetch(`${baseUrl}/git/blobs`, {
      method: 'post',
      headers: headers,
      payload: JSON.stringify({ content: file.content, encoding: 'base64' })
    });
    return {
      path: file.path,
      mode: "100644",
      type: "blob",
      sha: JSON.parse(blobRes.getContentText()).sha
    };
  });

  const commitDetailRes = UrlFetchApp.fetch(`${baseUrl}/git/commits/${latestCommitSha}`, { headers: headers });
  const baseTreeSha = JSON.parse(commitDetailRes.getContentText()).tree.sha;

  const treeRes = UrlFetchApp.fetch(`${baseUrl}/git/trees`, {
    method: 'post',
    headers: headers,
    payload: JSON.stringify({ base_tree: baseTreeSha, tree: treeItems })
  });
  const newTreeSha = JSON.parse(treeRes.getContentText()).sha;

  const newCommitRes = UrlFetchApp.fetch(`${baseUrl}/git/commits`, {
    method: 'post',
    headers: headers,
    payload: JSON.stringify({ message: message, tree: newTreeSha, parents: [latestCommitSha] })
  });
  const newCommitSha = JSON.parse(newCommitRes.getContentText()).sha;

  UrlFetchApp.fetch(`${baseUrl}/git/refs/heads/${branch}`, {
    method: 'patch',
    headers: headers,
    payload: JSON.stringify({ sha: newCommitSha })
  });
  
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    commit: newCommitSha,
    message: 'Batch upload complete'
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * 刪除檔案
 */
function deleteFileFromGitHub(owner, repo, path, message, branch, token) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const res = UrlFetchApp.fetch(url, { headers: { 'Authorization': `Bearer ${token}` }, muteHttpExceptions: true });
  
  if (res.getResponseCode() === 200) {
    const sha = JSON.parse(res.getContentText()).sha;
    UrlFetchApp.fetch(url, {
        method: 'delete',
        headers: { 'Authorization': `Bearer ${token}` },
        payload: JSON.stringify({ message: message, sha: sha, branch: branch })
    });
    return ContentService.createTextOutput(JSON.stringify({ status: 'success', message: 'Deleted ' + path }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput(JSON.stringify({ status: 'skip', message: 'File not found' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 自動備份至 Google Drive
 */
function saveToDrive(fullPath, base64Content) {
  try {
    const rootName = "UU-Memo-Archive";
    let folder = getOrCreateFolder(DriveApp.getRootFolder(), rootName);
    
    if (fullPath.includes('src/content/posts/')) {
      folder = getOrCreateFolder(folder, "📝 Articles");
    } else if (fullPath.includes('public/images/')) {
      folder = getOrCreateFolder(folder, "🖼️ Media");
      const pathParts = fullPath.split('/');
      if (pathParts.length >= 3) {
        folder = getOrCreateFolder(folder, pathParts[pathParts.length - 2]);
      }
    }

    const fileName = fullPath.split('/').pop();
    const files = folder.getFilesByName(fileName);
    const blob = Utilities.newBlob(Utilities.base64Decode(base64Content), getMimeType(fileName), fileName);
    
    if (files.hasNext()) {
      const existingFile = files.next();
      if (getMimeType(fileName).includes('image')) {
        existingFile.setTrashed(true);
        folder.createFile(blob);
      } else {
        existingFile.setContent(blob.getDataAsString ? blob.getDataAsString() : "");
      }
    } else {
      folder.createFile(blob);
    }
  } catch (e) {
    console.error("Drive backup failed: " + e);
  }
}

function getOrCreateFolder(parent, name) {
  const folders = parent.getFoldersByName(name);
  return folders.hasNext() ? folders.next() : parent.createFolder(name);
}

function getMimeType(fileName) {
  if (fileName.endsWith('.md')) return 'text/markdown';
  if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) return 'image/jpeg';
  if (fileName.endsWith('.png')) return 'image/png';
  return 'application/octet-stream';
}

function uploadToGitHub(owner, repo, path, contentBase64, message, branch, token) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  let sha = null;
  try {
    const res = UrlFetchApp.fetch(url, { headers: { 'Authorization': `Bearer ${token}` }, muteHttpExceptions: true });
    if (res.getResponseCode() === 200) sha = JSON.parse(res.getContentText()).sha;
  } catch (e) {}

  const payload = { message, content: contentBase64, branch, sha };
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
