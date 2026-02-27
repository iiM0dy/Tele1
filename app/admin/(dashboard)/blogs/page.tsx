import { getBlogPosts } from "@/lib/blog-actions";
import BlogsClient from "./BlogsClient";

export default async function BlogsPage() {
    const { posts = [] } = await getBlogPosts();

    return (
        <BlogsClient initialPosts={posts as any} />
    );
}
