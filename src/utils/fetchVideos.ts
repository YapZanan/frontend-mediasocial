// utils/fetchVideos.ts
interface Video {
    id: string;
    channelId: string;
    title: string;
    url: string;
    thumbnailUrl: string;
    createdAt: string;
    updatedAt: string;
}

interface AllVideoResponse {
    videos: Video[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export const fetchVideos = async (page: number, limit: number): Promise<AllVideoResponse> => {
    const response = await fetch(
        `https://mediasocial-backend.yapzanan.workers.dev/all-video?page=${page}&limit=${limit}`
    );
    const result = await response.json();
    return result.data;
};