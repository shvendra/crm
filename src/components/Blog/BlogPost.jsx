import React, { useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from "../../utils/axiosConfig";
import toast from 'react-hot-toast';
import { Context } from '../../main';
import config from '../../config';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  TextField,
  Button,
  Grid,
  Box,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  InputAdornment,
  Stack,
} from '@mui/material';
import { MdCameraAlt } from 'react-icons/md';
import SearchIcon from '@mui/icons-material/Search';

// ---------- Blog Form ----------
const BlogForm = ({ blogData, onSubmitSuccess, onCancel }) => {
  const [title, setTitle] = useState(blogData?.title || '');
  const [subtitle, setSubtitle] = useState(blogData?.subtitle || '');
  const [body, setBody] = useState(blogData?.body || '');
  const [link, setLink] = useState(blogData?.link || '');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(blogData?.photo || null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (blogData) {
      setTitle(blogData.title || '');
      setSubtitle(blogData.subtitle || '');
      setBody(blogData.body || '');
      setLink(blogData.link || '');
      setPhotoPreview(blogData.photo || null);
      setPhoto(null);
    } else {
      setTitle('');
      setSubtitle('');
      setBody('');
      setLink('');
      setPhotoPreview(null);
      setPhoto(null);
    }
  }, [blogData]);

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        if (img.width <= img.height) {
          toast.error('Please upload a landscape (horizontal) image.');
          setPhoto(null);
          setPhotoPreview(null);
          return;
        }
        setPhoto(file);
        setPhotoPreview(img.src);
      };
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!subtitle.trim()) newErrors.subtitle = 'Subtitle is required';
    if (!link.trim()) newErrors.link = 'Link is required';
    if (!body.trim()) newErrors.body = 'Blog content is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePublish = async e => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('subtitle', subtitle);
    formData.append('body', body);
    formData.append('link', link);
    if (photo) formData.append('photo', photo);
    try {
      const url = blogData?._id
        ? `${config.API_BASE_URL}/api/v1/blogs/update/${blogData._id}`
        : `${config.API_BASE_URL}/api/v1/blogs/save`;

      const res = await axios.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }, // ✅ Add this
        withCredentials: true,
      });

      toast.success(res.data.message || 'Blog saved successfully!');
      onSubmitSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving blog.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handlePublish}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Title"
            fullWidth
            value={title}
            onChange={e => setTitle(e.target.value)}
            error={!!errors.title}
            helperText={errors.title}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Subtitle"
            fullWidth
            value={subtitle}
            onChange={e => setSubtitle(e.target.value)}
            error={!!errors.subtitle}
            helperText={errors.subtitle}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Link"
            fullWidth
            value={link}
            onChange={e => setLink(e.target.value)}
            error={!!errors.link}
            helperText={errors.link}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography fontWeight={500} sx={{ mb: 1 }}>
            Blog Content *
          </Typography>
          <ReactQuill
            theme="snow"
            value={body}
            onChange={setBody}
            style={{ height: '200px', marginBottom: '30px' }}
          />
          {errors.body && (
            <Typography color="error" variant="caption">
              {errors.body}
            </Typography>
          )}
        </Grid>

        <Grid item xs={12}>
          <Button variant="outlined" component="label" startIcon={<MdCameraAlt />}>
            Upload Photo
            <input
              type="file"
              name="photo" // ✅ Important - must match upload.single("photo")
              hidden
              onChange={handleImageChange}
            />
          </Button>
          {photoPreview && (
            <Box
              component="img"
              src={photoPreview}
              alt="Preview"
              sx={{
                display: 'block',
                mt: 1,
                maxHeight: 200,
                borderRadius: 2,
                boxShadow: 1,
              }}
            />
          )}
        </Grid>

        <Grid item xs={12} sx={{ textAlign: 'center', mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            sx={{ px: 4, py: 1, mr: 2 }}
          >
            {isSubmitting
              ? blogData?._id
                ? 'Updating...'
                : 'Publishing...'
              : blogData?._id
                ? 'Update Blog'
                : 'Publish Blog'}
          </Button>

          {blogData && (
            <Button variant="outlined" color="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </Grid>
      </Grid>
    </form>
  );
};

// ---------- Blog List ----------
const BlogList = ({ onEdit }) => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [expandedRows, setExpandedRows] = useState({});

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${config.API_BASE_URL}/api/v1/blogs/list`, {
        withCredentials: true,
      });
      const fetchedBlogs = res.data?.blogs || [];
      setBlogs(fetchedBlogs);
      setFilteredBlogs(fetchedBlogs);
    } catch (err) {
      toast.error('Failed to load blogs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    const filtered = blogs.filter(
      b =>
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBlogs(filtered);
    setPage(0);
  }, [searchTerm, blogs]);

  const toggleExpand = id => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleTogglePublish = async blog => {
    try {
      const url = `${config.API_BASE_URL}/api/v1/blogs/toggle-publish/${blog._id}`;
      const res = await axios.put(url, {}, { withCredentials: true }); // <-- Changed to PUT
      toast.success(res.data.message || 'Blog status updated.');
      fetchBlogs();
    } catch (err) {
      console.error('Toggle publish error:', err);
      toast.error('Failed to update blog status.');
    }
  };

  if (loading)
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'background.default',
          px: 2,
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );

  return (
    <Box>
      <TextField
        placeholder="Search blog..."
        size="small"
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Photo</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Subtitle</TableCell>
              <TableCell>Content</TableCell>
              <TableCell>Likes</TableCell>
              <TableCell>CreatedAt</TableCell>
              <TableCell>UpdatedAt</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBlogs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(blog => {
              const isExpanded = expandedRows[blog._id];
              const plainText = blog.body.replace(/<[^>]+>/g, '');
              const preview =
                plainText.length > 100 && !isExpanded
                  ? plainText.substring(0, 100) + '...'
                  : plainText;

              return (
                <TableRow key={blog._id}>
                  <TableCell>
                    {blog.photo ? (
                      <img
                        src={`${config.API_BASE_URL}${blog.photo}`}
                        alt={blog.title}
                        style={{ width: 80, borderRadius: 8 }}
                      />
                    ) : (
                      'No Photo'
                    )}
                  </TableCell>
                  <TableCell>{blog.title}</TableCell>
                  <TableCell>{blog.subtitle}</TableCell>
                  <TableCell>
                    <Typography variant="body2" dangerouslySetInnerHTML={{ __html: preview }} />
                    {plainText.length > 100 && (
                      <Button
                        size="small"
                        onClick={() => toggleExpand(blog._id)}
                        sx={{ mt: 1, p: 0, fontSize: '0.75rem' }}
                      >
                        {isExpanded ? 'Read Less' : 'Read More'}
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    <a href={blog.link} target="_blank" rel="noopener noreferrer">
                      {blog.likes}
                    </a>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">
                      {new Date(blog.createdAt).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(blog.updatedAt).toLocaleString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>
                  </TableCell>
                  {/* <TableCell>
                    <Typography color={blog.isPublished ? 'green' : 'red'} fontWeight="bold">
                      {blog.isPublished ? 'Published' : 'Unpublished'}
                    </Typography>
                  </TableCell> */}
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button variant="outlined" size="small" onClick={() => onEdit(blog)}>
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="contained"
                        color={blog.isPublished ? 'warning' : 'success'}
                        size="small"
                        onClick={() => handleTogglePublish(blog)}
                      >
                        {blog.isPublished ? 'Unpublish' : 'Publish'}
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredBlogs.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={e => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 20]}
      />
    </Box>
  );
};

// ---------- Main Component ----------
const PostBlog = () => {
  const { isAuthorized, user } = useContext(Context);
  const [tabValue, setTabValue] = useState(0);
  const [editingBlog, setEditingBlog] = useState(null);

  if (!isAuthorized || !['Admin', 'SuperAdmin'].includes(user?.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return (
    <Box sx={{ maxWidth: '1200px', margin: '0 auto', mt: 3, mb: 10, px: 2 }}>
      <Card sx={{ borderRadius: 3, boxShadow: 3, p: 2, mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => {
            setTabValue(newValue);
            if (newValue === 0) setEditingBlog(null);
          }}
          sx={{ mb: 2 }}
        >
          <Tab label={editingBlog ? 'Edit Blog' : 'Post Blog'} />
          <Tab label="Blog List" />
        </Tabs>

        {tabValue === 0 && (
          <CardContent>
            <BlogForm
              blogData={editingBlog}
              onSubmitSuccess={() => {
                setEditingBlog(null);
                setTabValue(1);
              }}
              onCancel={() => setEditingBlog(null)}
            />
          </CardContent>
        )}

        {tabValue === 1 && (
          <CardContent>
            <BlogList
              onEdit={blog => {
                setEditingBlog(blog);
                setTabValue(0);
              }}
            />
          </CardContent>
        )}
      </Card>
    </Box>
  );
};

export default PostBlog;
