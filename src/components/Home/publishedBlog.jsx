import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Divider,
  IconButton,
  Stack,
  Snackbar,
  Box,
  Tooltip,
  ThemeProvider,
  createTheme,
  CssBaseline,
  CircularProgress,
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ShareIcon from '@mui/icons-material/Share';
import axios from "../../utils/axiosConfig";
import config from '../../config';
import { Helmet } from 'react-helmet-async';

const BlogDisplay = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [visibleCount, setVisibleCount] = useState(20);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('light');

  const theme = useMemo(() => createTheme({ palette: { mode } }), [mode]);
  const isDark = mode === 'dark';

  // ✅ Ref for scrolling to top of blog content
  const blogTopRef = useRef(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (selectedBlog) fetchComments(selectedBlog._id);
  }, [selectedBlog]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${config.API_BASE_URL}/api/v1/blogs/list-publish`);
      setBlogs(res.data.blogs || []);
      if (res.data.blogs?.length > 0) setSelectedBlog(res.data.blogs[0]);
    } catch (err) {
      console.error('Error fetching blogs', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReadMore = () => setVisibleCount(prev => prev + 10);

  const handleBlogClick = async blog => {
    try {
      const res = await axios.get(`${config.API_BASE_URL}/api/v1/blogs/${blog._id}`);
      setSelectedBlog(res.data.blog);

      // ✅ Scroll to top of blog content after selecting
      setTimeout(() => {
        blogTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    } catch (err) {
      console.error('Error fetching blog details', err);
    }
  };

  const handleLike = async id => {
    try {
      await axios.put(`${config.API_BASE_URL}/api/v1/blogs/like/${id}`);
      setSelectedBlog(prev => ({ ...prev, likes: (prev.likes || 0) + 1 }));
    } catch (err) {
      console.error('Error liking blog', err);
    }
  };

  const fetchComments = async id => {
    try {
      const res = await axios.get(`${config.API_BASE_URL}/api/v1/blogs-comment/${id}/comments`);
      setComments(res.data.comments || []);
    } catch (err) {
      console.error('Error fetching comments', err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await axios.post(`${config.API_BASE_URL}/api/v1/blogs-comment/${selectedBlog._id}/comments`, {
        comment: newComment,
      });
      setNewComment('');
      fetchComments(selectedBlog._id);
      setSnackbar({ open: true, message: 'Comment added!' });
    } catch (err) {
      console.error('Error adding comment', err);
      setSnackbar({ open: true, message: 'Failed to add comment' });
    }
  };

  const handleShare = () => {
    const url = window.location.origin + '/blog/' + selectedBlog._id;
    if (navigator.share) {
      navigator
        .share({
          title: selectedBlog.title,
          text: selectedBlog.subtitle || 'Check out this blog on BookMyWorker!',
          url: url,
        })
        .then(() => console.log('Successful share'))
        .catch(error => console.error('Error sharing', error));
    } else {
      navigator.clipboard.writeText(url);
      setSnackbar({ open: true, message: 'Link copied to clipboard!' });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          mt: 0,
          mb: 6,
          bgcolor: isDark ? 'grey.900' : 'grey.100',
          minHeight: '100vh',
          borderRadius: 2,
          pl: 1,
          pr: 1,
          pt: 2,
          pb: 2,
        }}
      >
        {selectedBlog && (
          <Helmet>
            <title>{selectedBlog.title} | BookMyWorkers</title>
            <meta
              name="description"
              content={selectedBlog.title || selectedBlog.body?.slice(0, 150)}
            />
            <meta property="og:title" content={selectedBlog.title} />
            <meta
              property="og:description"
              content={selectedBlog.title || selectedBlog.body?.slice(0, 150)}
            />
            <meta property="og:image" content={selectedBlog.photo} />
            <meta property="og:type" content="article" />
            <meta property="og:url" content={window.location.href} />
          </Helmet>
        )}

        <Grid container spacing={2}>
          {/* Left - Blog Details */}
          <Grid item xs={12} md={8}>
            <div ref={blogTopRef} /> {/* ✅ This is the scroll target */}
            {loading ? (
              <Box
                sx={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  bgcolor: 'rgba(255,255,255,0.6)',
                  zIndex: 9999,
                }}
              >
                <CircularProgress size={50} />
              </Box>
            ) : selectedBlog ? (
              <Card sx={{ borderRadius: 4, boxShadow: 6, bgcolor: isDark ? 'grey.900' : '#fff' }}>
                <CardMedia
                  component="img"
                  height="300"
  image={`${config.FILE_BASE_URL}/${selectedBlog.photo}`}
                  alt={selectedBlog.title}
                  sx={{ borderRadius: 3, objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                    {selectedBlog.title}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {selectedBlog.subtitle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Posted on {new Date(selectedBlog.createdAt).toLocaleDateString()}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography
                    variant="body1"
                    dangerouslySetInnerHTML={{ __html: selectedBlog.body }}
                    sx={{ lineHeight: 1.8 }}
                  />
                  <Divider sx={{ my: 2 }} />
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      startIcon={<ThumbUpIcon />}
                      onClick={() => handleLike(selectedBlog._id)}
                    >
                      {selectedBlog.likes || 0} Likes
                    </Button>
                    <Tooltip title="Share Blog">
                      <IconButton color="primary" onClick={handleShare}>
                        <ShareIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </CardContent>
              </Card>
            ) : (
              <Typography variant="h6" color="text.secondary" textAlign="center" mt={4}>
                No blog posts available.
              </Typography>
            )}
          </Grid>

          {/* Right - Blog List */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: 'sticky', top: 10 }}>
              {blogs.slice(0, visibleCount).map(blog => (
                <Card
                  key={blog._id}
                  onClick={() => handleBlogClick(blog)}
                  sx={{
                    mb: 2,
                    cursor: 'pointer',
                    boxShadow: selectedBlog?._id === blog._id ? 8 : 2,
                    border: selectedBlog?._id === blog._id ? '2px solid #1976d2' : 'none',
                    borderRadius: 3,
                    transition: '0.3s',
                    '&:hover': { boxShadow: 6, transform: 'translateY(-2px)' },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={blog.photo}
                    alt={blog.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography variant="h6" noWrap sx={{ fontWeight: 600 }}>
                      {blog.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {blog.subtitle}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
              {visibleCount < blogs.length && (
                <Button variant="outlined" fullWidth onClick={handleReadMore} sx={{ mt: 1 }}>
                  Load More
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={2000}
          onClose={() => setSnackbar({ open: false, message: '' })}
          message={snackbar.message}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </Box>
    </ThemeProvider>
  );
};

export default BlogDisplay;
