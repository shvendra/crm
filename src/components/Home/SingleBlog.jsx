import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Divider,
  Button,
  IconButton,
  Stack,
  Snackbar,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ShareIcon from '@mui/icons-material/Share';
import { useParams } from 'react-router-dom';
import axios from "../../utils/axiosConfig";
import config from '../../config';
import { Helmet } from 'react-helmet-async';

const SingleBlog = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${config.API_BASE_URL}/api/v1/blogs/${id}`);
        setBlog(res.data.blog);
      } catch (err) {
        console.error('Error fetching blog', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleLike = async () => {
    try {
      await axios.put(`${config.API_BASE_URL}/api/v1/blogs/like/${id}`);
      setBlog(prev => ({ ...prev, likes: (prev.likes || 0) + 1 }));
    } catch (err) {
      console.error('Error liking blog', err);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setSnackbar({ open: true, message: 'Link copied to clipboard!' });
  };

  if (loading)
    return (
      <Box sx={{ height: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );

  if (!blog)
    return (
      <Box sx={{ textAlign: 'center', mt: 10 }}>
        <Typography variant="h6" color="text.secondary">
          Blog not found.
        </Typography>
      </Box>
    );

  return (
    <Box sx={{ mt: 2, mb: 4, px: { xs: 2, md: 8 } }}>
      <Helmet>
        <title>{blog.title} | BookMyWorkers</title>
        <meta name="description" content={blog.title || blog.body?.slice(0, 150)} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.subtitle || blog.body?.slice(0, 150)} />
        <meta property="og:image" content={blog.photo} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
      </Helmet>

      <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
        <CardMedia
          component="img"
          height="300"
  image={`${config.FILE_BASE_URL}/${blog.photo}`}
          alt={blog.title}
          sx={{ borderRadius: 3, objectFit: 'cover' }}
        />
        <CardContent>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            {blog.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {blog.subtitle}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Posted on {new Date(blog.createdAt).toLocaleDateString()}
          </Typography>

          <Divider sx={{ my: 2 }} />
          <Typography
            variant="body1"
            dangerouslySetInnerHTML={{ __html: blog.body }}
            sx={{ lineHeight: 1.8 }}
          />
          <Divider sx={{ my: 2 }} />

          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button variant="contained" startIcon={<ThumbUpIcon />} onClick={handleLike}>
              {blog.likes || 0} Likes
            </Button>
            <Tooltip title="Share Blog">
              <IconButton color="primary" onClick={handleShare}>
                <ShareIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default SingleBlog;
