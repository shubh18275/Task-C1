import { useState } from 'react';
import './Post.css';

function Post() {
  const [postType, setPostType] = useState('question');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [abstract, setAbstract] = useState('');
  const [articleText, setArticleText] = useState('');
  const [tags, setTags] = useState('');

  const handlePostTypeChange = (e) => {
    setPostType(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (postType === 'question') {
      if (!title.trim() || !description.trim() || !tags.trim()) {
        alert('Please fill in all the required fields.');
        return;
      }
    } else {
      if (!title.trim() || !abstract.trim() || !articleText.trim() || !tags.trim()) {
        alert('Please fill in all the required fields.');
        return;
      }
    }

    alert('Your post has been sent successfully!');
    setTitle('');
    setDescription('');
    setAbstract('');
    setArticleText('');
    setTags('');
  };

  return (
    <div className="new-post-container">
      <div className="post-header-bar">New Post</div>

      <div className="post-type-selector">
        <span className="post-type-label">Select Post Type:</span>
        <label className="radio-label">
          <input
            type="radio"
            name="postType"
            value="question"
            checked={postType === 'question'}
            onChange={handlePostTypeChange}
          />
          Question
        </label>
        <label className="radio-label">
          <input
            type="radio"
            name="postType"
            value="article"
            checked={postType === 'article'}
            onChange={handlePostTypeChange}
          />
          Article
        </label>
      </div>

      <div className="post-header-bar">What do you want to ask or share</div>

      <form onSubmit={handleSubmit} className="post-form">
        {postType === 'question' ? (
          <div className="question-section">
            <div className="inline-field">
              <label htmlFor="question-title">Title</label>
              <input
                id="question-title"
                type="text"
                placeholder="Start your question with how, what, why, etc."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="stacked-field">
              <label htmlFor="question-desc">Describe your problem</label>
              <textarea
                id="question-desc"
                rows="12"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="inline-field">
              <label htmlFor="question-tags">Tags</label>
              <input
                id="question-tags"
                type="text"
                placeholder="Please add up to 3 tags to describe what your question is about e.g., Java"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
          </div>
        ) : (
          <div className="article-section">
            <div className="inline-field">
              <label htmlFor="article-title">Title</label>
              <input
                id="article-title"
                type="text"
                placeholder="Enter a descriptive title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="stacked-field">
              <label htmlFor="article-abstract">Abstract</label>
              <textarea
                id="article-abstract"
                rows="3"
                placeholder="Enter a 1-paragraph abstract"
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
              />
            </div>

            <div className="stacked-field">
              <label htmlFor="article-text">Article Text</label>
              <textarea
                id="article-text"
                rows="10"
                placeholder="Enter a 1-paragraph abstract"
                value={articleText}
                onChange={(e) => setArticleText(e.target.value)}
              />
            </div>

            <div className="inline-field">
              <label htmlFor="article-tags">Tags</label>
              <input
                id="article-tags"
                type="text"
                placeholder="Please add up to 3 tags to describe what your article is about e.g., Java"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="post-button-container">
          <button type="submit" className="post-submit-btn">
            Post
          </button>
        </div>
      </form>
    </div>
  );
}

export default Post;
