const Post = require("../models/Post");

exports.createPost = async (req, res) => {
    const { content } = req.body;
    try {
        const newPost = new Post({
            user: req.session.user.id,
            content,
            imageUrl: req.file ? `/uploads/${req.file.filename}` : "",
        });
        await newPost.save();
        res.status(201).json({
            message: "Post created successfully",
            post: newPost,
        });
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ message: "Failed to create post" });
    }
};

exports.getFeed = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate("user", "username profileImage");

        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching feed:", error);
        res.status(500).json({ message: "Failed to fetch feed" });
    }
};

exports.getMyPosts = async (req, res) => {
    try {
        const myPosts = await Post.find({ user: req.session.user.id })
            .sort({ createdAt: -1 })
            .populate("user", "username profileImage");

        res.status(200).json(myPosts);
    } catch (error) {
        console.error("Error fetching my posts:", error);
        res.status(500).json({ message: "Failed to fetch my posts" });
    }
};
