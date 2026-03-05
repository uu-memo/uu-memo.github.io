
export interface PostMetadata {
    name: string;
    path: string;
    sha: string;
    title: string;
    publishDate: string;
    category: string;
    draft: boolean;
    isVisible: boolean;
}

export interface ImageProcessData {
    url: string;
    type: 'Landscape' | 'Portrait' | 'Square' | 'Original';
    w: number;
    h: number;
    id: string;
}

export interface CommentData {
    id: string;
    author: string;
    avatar: string;
    content: string;
    date: any; // Firebase Timestamp or Date
    isAuthor?: boolean;
    replies?: CommentData[];
    postId: string;
    postTitle?: string;
}

export interface SystemConfig {
    maintenance: boolean;
    allowComments: boolean;
    githubRepo: string;
    // Add other fields as needed
}
