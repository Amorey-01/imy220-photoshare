import { useState } from 'react';
import { api } from '../api';
import Image from './Image';

function CreatePost({ onCreated }) {
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  function processFile(file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError('Image must be under 8MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target.result);
      setError('');
    };
    reader.readAsDataURL(file);
  }

  function handleFileChange(e) {
    processFile(e.target.files?.[0]);
  }

  // Drag and drop handlers
  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!image) {
      setError('An image is required');
      return;
    }
    setIsSubmitting(true);
    setError('');
    try {
      const newPost = await api('/posts', {
        method: 'POST',
        body: { image, description, hashtags },
      });
      setImage('');
      setDescription('');
      setHashtags('');
      if (onCreated) onCreated(newPost);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-sandDark/70 bg-sand p-6 dark:bg-stone-900 dark:border-stone-800">
      <h2 className="text-xl font-bold">Create a New Post</h2>
      {error && <p className="error">{error}</p>}

      {/* Drag & Drop File Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition cursor-pointer ${
          isDragging
            ? 'border-clay bg-clay/10 dark:bg-clay/20'
            : 'border-sandDark/80 hover:border-clay/50 dark:border-stone-700'
        }`}
      >
        {image ? (
          <div className="relative max-h-64 overflow-hidden rounded-xl">
            <Image src={image} alt="Preview" className="max-h-64 object-contain" />
            <button
              type="button"
              onClick={() => setImage('')}
              className="absolute top-2 right-2 rounded-full bg-charcoal/70 p-1 text-xs text-white hover:bg-charcoal"
            >
              ✕ Remove
            </button>
          </div>
        ) : (
          <label className="cursor-pointer space-y-2 w-full">
            <div className="text-3xl">📁</div>
            <p className="text-sm font-medium">
              Drag and drop an image here, or <span className="text-clay underline">browse</span>
            </p>
            <p className="text-xs text-muted">Supports PNG, JPG, WEBP, SVG up to 8MB</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Description</label>
        <textarea
          className="input min-h-[80px]"
          placeholder="What is this sketch or artwork about?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1">Hashtags</label>
        <input
          className="input"
          placeholder="e.g. #sketch #watercolor #digital"
          value={hashtags}
          onChange={(e) => setHashtags(e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !image}
        className="btn-primary w-full disabled:opacity-50"
      >
        {isSubmitting ? 'Publishing…' : 'Publish Post'}
      </button>
    </form>
  );
}

export default CreatePost;