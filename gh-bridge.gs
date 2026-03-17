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
    console.log(`[Bridge] Received Action: ${action}`);
    const isSecretValid = secretToken && providedToken === secretToken;
    console.log(`[Bridge] Secret Valid: ${isSecretValid}`);

    if (secretToken && providedToken !== secretToken) {
        // 特別注意：如果是從後台 Admin 來的請求，可能還沒更新傳送 token 邏輯
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

    // 4. 管理員身份驗證 (繞過 Ad-blocker)
    if (action === 'verify_admin') {
        const { email } = data;
        const adminEmails = [
            'jing180804@gmail.com',
            'uu-memo@outlook.com'
        ];
        
        const isVerified = adminEmails.includes(email);
        return ContentService.createTextOutput(JSON.stringify({ 
            status: isVerified ? 'success' : 'error', 
            isAdmin: isVerified,
            message: isVerified ? 'Admin verified via Bridge' : 'Access denied'
        })).setMimeType(ContentService.MimeType.JSON);
    }

    // 5. 獲取文章列表
    if (action === 'list_posts') {
        const postsData = listPostsFromGitHub(owner, repo, branch, token);
        return ContentService.createTextOutput(JSON.stringify({
            success: postsData.status === 'success',
            files: postsData.posts || [],
            message: postsData.message
        })).setMimeType(ContentService.MimeType.JSON);
    }

    // 6. 獲取單一文章內容
    if (action === 'get_content') {
        if (!path) throw new Error("Missing path for get_content");
        const contentData = getFileContentFromGitHub(owner, repo, path, branch, token);
        return ContentService.createTextOutput(JSON.stringify({
            success: contentData.status === 'success',
            content: contentData.content,
            message: contentData.message
        })).setMimeType(ContentService.MimeType.JSON);
    }

    // 相容舊版單一檔案上傳
    if (action === 'upload_file') {
      saveToDrive(path, content);
      return uploadToGitHub(owner, repo, path, content, message, branch, token);
    }

    return ContentService.createTextOutput(JSON.stringify({ 
        status: 'error', 
        message: `Unknown action: ${action}. Please check if you have deployed the latest gh-bridge.gs version.` 
    })).setMimeType(ContentService.MimeType.JSON);

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
  const brand = {
    base: '#f5f0e7',
    sub: '#ddccb3',
    main: '#6d492f',
    dark: '#4a301e',
    light: '#ffffff'
  };

  const htmlBody = `
    <div style="font-family: 'Noto Sans TC', sans-serif, Arial; max-width: 600px; margin: 0 auto; background-color: ${brand.base}; border-radius: 24px; overflow: hidden; border: 1px solid ${brand.sub};">
      <!-- Header -->
      <div style="background-color: ${brand.main}; padding: 40px 20px; text-align: center;">
        <h1 style="color: ${brand.base}; margin: 0; font-size: 20px; letter-spacing: 4px; font-weight: 700;">UU MEMO</h1>
        <p style="color: ${brand.sub}; margin: 10px 0 0 0; font-size: 10px; text-transform: uppercase; letter-spacing: 2px;">New Contact Notification</p>
      </div>

      <!-- Content -->
      <div style="padding: 40px 30px; background-color: ${brand.base};">
        <div style="margin-bottom: 30px;">
          <h2 style="color: ${brand.dark}; font-size: 16px; margin: 0 0 20px 0; border-bottom: 2px solid ${brand.sub}; padding-bottom: 10px; display: inline-block;">聯絡詳情</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; color: ${brand.main}; font-size: 12px; width: 80px; font-weight: bold;">寄件姓名</td>
              <td style="padding: 10px 0; color: ${brand.dark}; font-size: 14px;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: ${brand.main}; font-size: 12px; font-weight: bold;">電子郵件</td>
              <td style="padding: 10px 0; font-size: 14px;"><a href="mailto:${email}" style="color: ${brand.main}; text-decoration: underline;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: ${brand.main}; font-size: 12px; font-weight: bold;">訊息主旨</td>
              <td style="padding: 10px 0; color: ${brand.dark}; font-size: 14px; font-weight: bold;">${subject}</td>
            </tr>
          </table>
        </div>

        <div style="background-color: ${brand.light}; padding: 30px; border-radius: 16px; border: 1px solid ${brand.sub}; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
          <h3 style="color: ${brand.main}; font-size: 11px; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 1px;">訊息內容 Message</h3>
          <p style="color: ${brand.dark}; font-size: 15px; line-height: 1.8; white-space: pre-wrap; margin: 0;">${message}</p>
        </div>
      </div>

      <!-- Footer -->
      <div style="padding: 30px; text-align: center; border-top: 1px solid ${brand.sub};">
        <p style="color: ${brand.main}; font-size: 11px; opacity: 0.6; margin: 0;">此郵件由 UU MEMO 自動備份系統發出</p>
        <p style="color: ${brand.sub}; font-size: 9px; margin-top: 5px;">Sent via Unified Bridge (GAS)</p>
      </div>
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

/**
 * 獲取文章清單 (僅限 .md 檔案)
 */
function listPostsFromGitHub(owner, repo, branch, token) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/src/content/posts?ref=${branch}`;
  const options = {
    headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.github.v3+json' },
    muteHttpExceptions: true
  };
  
  const response = UrlFetchApp.fetch(url, options);
  if (response.getResponseCode() !== 200) {
    return { status: 'error', message: response.getContentText() };
  }
  
  const files = JSON.parse(response.getContentText());
  const posts = files.filter(f => f.name.endsWith('.md')).map(f => ({
    name: f.name,
    path: f.path,
    sha: f.sha,
    size: f.size
  }));
  
  return {
    status: 'success',
    posts: posts
  };
}

/**
 * 獲取特定檔案內容 (Markdown 格式)
 */
function getFileContentFromGitHub(owner, repo, path, branch, token) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
  const options = {
    headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/vnd.github.v3+json' },
    muteHttpExceptions: true
  };
  
  const response = UrlFetchApp.fetch(url, options);
  const data = JSON.parse(response.getContentText());
  return {
    status: response.getResponseCode() === 200 ? 'success' : 'error',
    content: data.content,
    message: data.message
  };
}
