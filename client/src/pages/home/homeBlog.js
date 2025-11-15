import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../api/host/host";

// Utility function to truncate text to a specific number of words
const truncateText = (text, wordLimit) => {
  if (!text) return "";
  const words = text.split(" ");
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(" ") + "...";
};

export default function HomeBlog() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/posts/posts`);
        if (response.data.Status) {
          const postsArray = Array.isArray(response.data.Result)
            ? response.data.Result
            : [];
          const lastFourPosts = postsArray.slice(-4); // oxirgi 4 ta post
          setPosts(lastFourPosts);
        } else {
          console.error(response.data.Error);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="home-blog-area pt-100 pb-80 pb-res pb0-320">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-9 col-sm-12">
            <div className="section-title text-center">
              <p className="title">Blogdan</p>
              <h2>
                Yangiliklar hikoyalar va fikrlar<span></span>
                hayotingizni sarguzasht bilan to'ldirish uchun
              </h2>
            </div>
          </div>
        </div>
        <div className="row">
          {posts
            .filter((post) => post.status !== 0)
            .map((post) => (
              <div key={post.id} className="col-lg-3 col-sm-6">
                <div className="single-post-blog">
                  <div className="post-thumbnail">
                    {post.images && post.images.split(",")[0] && (
                      <img
                        className="object-fit-cover"
                        src={`${BASE_URL}/uploads/${post.images.split(",")[0]}`}
                        alt={post.title}
                      />
                    )}
                  </div>
                  <div className="post-date">
                    <p>
                      {new Date(post.created_at).getDate()}{" "}
                      <span>
                        {new Date(post.created_at).toLocaleString("default", {
                          month: "short",
                        })}
                      </span>
                    </p>
                  </div>
                  <div className="post-blog-content">
                    <Link to={`/posts/${post.id}`}>
                      <h4>{post.title}</h4>
                    </Link>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: truncateText(post.text, 10),
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
