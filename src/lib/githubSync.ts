import { Octokit } from "@octokit/rest";

export interface SyncFile {
  path: string;
  content: string; // Base64 encoded content
}

export interface SyncOptions {
  owner: string;
  repo: string;
  branch?: string;
  message: string;
  token: string;
}

/**
 * UU-MEMO GitHub Sync Service (Phase 3 - Strategy D)
 * Direct browser-to-GitHub synchronization using Octokit.
 */
export const githubSync = {
  /**
   * Performs a batch upload of files in a single commit.
   * This is more efficient than individual file updates as it minimizes build triggers.
   */
  async batchUpload(options: SyncOptions, files: SyncFile[]) {
    const { token, owner, repo, branch = "main", message } = options;
    const octokit = new Octokit({ auth: token });

    try {
      // 1. Get the latest commit SHA of the branch
      console.log(`[GitHubSync] Getting latest commit for ${branch}...`);
      const { data: refData } = await octokit.git.getRef({
        owner,
        repo,
        ref: `heads/${branch}`,
      });
      const latestCommitSha = refData.object.sha;

      // 2. Get the tree SHA of the latest commit
      const { data: commitData } = await octokit.git.getCommit({
        owner,
        repo,
        commit_sha: latestCommitSha,
      });
      const baseTreeSha = commitData.tree.sha;

      // 3. Create Blobs for each file
      console.log(`[GitHubSync] Creating ${files.length} blobs...`);
      const treeItems = await Promise.all(
        files.map(async (file) => {
          const { data: blobData } = await octokit.git.createBlob({
            owner,
            repo,
            content: file.content,
            encoding: "base64",
          });
          return {
            path: file.path,
            mode: "100644" as const,
            type: "blob" as const,
            sha: blobData.sha,
          };
        })
      );

      // 4. Create a new Tree extending the base tree
      console.log(`[GitHubSync] Creating new tree...`);
      const { data: treeData } = await octokit.git.createTree({
        owner,
        repo,
        base_tree: baseTreeSha,
        tree: treeItems,
      });

      // 5. Create the Commit
      console.log(`[GitHubSync] Creating commit: ${message}`);
      const { data: newCommitData } = await octokit.git.createCommit({
        owner,
        repo,
        message,
        tree: treeData.sha,
        parents: [latestCommitSha],
      });

      // 6. Update the reference to the new commit
      console.log(`[GitHubSync] Updating ref heads/${branch} to ${newCommitData.sha}`);
      await octokit.git.updateRef({
        owner,
        repo,
        ref: `heads/${branch}`,
        sha: newCommitData.sha,
      });

      return {
        success: true,
        commitSha: newCommitData.sha,
        filesCount: files.length,
      };
    } catch (error: any) {
      console.error("[GitHubSync] Error during batch upload:", error);
      throw new Error(error.message || "Unknown GitHub API error");
    }
  },

  /**
   * Utility to delete a single file (for emergency cleanup)
   */
  async deleteFile(options: SyncOptions, path: string) {
    const { token, owner, repo, branch = "main", message } = options;
    const octokit = new Octokit({ auth: token });

    try {
      // Get the SHA of the file to delete
      const { data: fileData } = await octokit.repos.getContent({
        owner,
        repo,
        path,
        ref: branch,
      });

      if (Array.isArray(fileData)) throw new Error("Path is a directory, not a file.");

      await octokit.repos.deleteFile({
        owner, repo, path,
        message,
        sha: fileData.sha,
        branch
      });

      return { success: true };
    } catch (error: any) {
      if (error.status === 404) {
        return { success: false, message: "File not found (already deleted?)" };
      }
      throw error;
    }
  },

  /**
   * Fetches all posts from the repository and parses basic metadata.
   */
  async listPosts(options: { token: string; owner: string; repo: string; branch?: string }) {
    const { token, owner, repo, branch = "main" } = options;
    const octokit = new Octokit({ auth: token });

    try {
      console.log(`[GitHubSync] Listing posts from src/content/posts...`);
      const { data: files } = await octokit.repos.getContent({
        owner,
        repo,
        path: "src/content/posts",
        ref: branch,
      });

      if (!Array.isArray(files)) return [];

      // Filter only .md files
      const mdFiles = files.filter(f => f.name.endsWith(".md"));

      // Fetch content for each file to parse frontmatter
      // Note: For performance, we only fetch the first 1KB if possible, but Octokit getContent returns full content.
      // We'll limit to 20 files per batch or similar if needed, but for now we'll do all and the user wanted pagination.
      const posts = await Promise.all(
        mdFiles.map(async (file) => {
          try {
            const { data: contentData }: any = await octokit.repos.getContent({
              owner,
              repo,
              path: file.path,
              ref: branch,
            });

            const content = decodeURIComponent(escape(atob(contentData.content)));

            // Simple Frontmatter Parser (regex)
            const titleMatch = content.match(/title:\s*["']?(.*?)["']?(\r?\n|$)/);
            const dateMatch = content.match(/publishDate:\s*(.*?)(\r?\n|$)/);
            const categoryMatch = content.match(/category:\s*\[?(.*?)\]?(\r?\n|$)/);

            return {
              name: file.name,
              path: file.path,
              sha: file.sha,
              title: titleMatch ? titleMatch[1] : file.name,
              publishDate: dateMatch ? dateMatch[1].trim() : "Unknown",
              category: categoryMatch ? categoryMatch[1].replace(/["']/g, "").split(",")[0].trim() : "Uncategorized"
            };
          } catch (e) {
            return {
              name: file.name,
              path: file.path,
              sha: file.sha,
              title: file.name,
              publishDate: "Error",
              category: "Error"
            };
          }
        })
      );

      // Sort by date descending
      return posts.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
    } catch (error: any) {
      console.error("[GitHubSync] Error listing posts:", error);
      throw error;
    }
  },

  /**
   * Fetches the full content of a specific post.
   */
  async getPostContent(options: { token: string; owner: string; repo: string; branch?: string; path: string }) {
    const { token, owner, repo, branch = "main", path } = options;
    const octokit = new Octokit({ auth: token });

    try {
      const { data: contentData }: any = await octokit.repos.getContent({
        owner,
        repo,
        path,
        ref: branch,
      });

      return decodeURIComponent(escape(atob(contentData.content)));
    } catch (error: any) {
      console.error("[GitHubSync] Error fetching post content:", error);
      throw error;
    }
  }
};
