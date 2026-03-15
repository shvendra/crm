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
          onChange={(e) => setTitle(e.target.value)}
          error={!!errors.title}
          helperText={errors.title}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "14px",
              background: "#fff",
            },
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          label="Subtitle"
          fullWidth
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          error={!!errors.subtitle}
          helperText={errors.subtitle}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "14px",
              background: "#fff",
            },
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <TextField
          label="Link"
          fullWidth
          value={link}
          onChange={(e) => setLink(e.target.value)}
          error={!!errors.link}
          helperText={errors.link}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "14px",
              background: "#fff",
            },
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <Typography
          fontWeight={700}
          sx={{
            mb: 1,
            color: "#0f172a",
          }}
        >
          Blog Content *
        </Typography>

        <Box
          sx={{
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            overflow: "hidden",
            background: "#fff",
            boxShadow: "0 8px 20px rgba(15,23,42,0.05)",
          }}
        >
          <ReactQuill
            theme="snow"
            value={body}
            onChange={setBody}
            style={{ height: "200px", marginBottom: "30px" }}
          />
        </Box>

        {errors.body && (
          <Typography color="error" variant="caption">
            {errors.body}
          </Typography>
        )}
      </Grid>

      <Grid item xs={12}>
        <Button
          variant="outlined"
          component="label"
          startIcon={<MdCameraAlt />}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 700,
            borderColor: "#2563eb",
            color: "#2563eb",
            "&:hover": {
              borderColor: "#1d4ed8",
              backgroundColor: "#f1f5ff",
            },
          }}
        >
          Upload Photo
          <input
            type="file"
            name="photo"
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
              display: "block",
              mt: 2,
              maxHeight: 200,
              borderRadius: "14px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 10px 24px rgba(15,23,42,0.08)",
            }}
          />
        )}
      </Grid>

      <Grid item xs={12} sx={{ textAlign: "center", mt: 2 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          sx={{
            px: 4,
            py: 1.2,
            mr: 2,
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 800,
            background:
              "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            boxShadow: "0 10px 22px rgba(37,99,235,0.24)",
            "&:hover": {
              background:
                "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
            },
          }}
        >
          {isSubmitting
            ? blogData?._id
              ? "Updating..."
              : "Publishing..."
            : blogData?._id
            ? "Update Blog"
            : "Publish Blog"}
        </Button>

        {blogData && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={onCancel}
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 700,
              px: 3,
            }}
          >
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
   <Box
  sx={{
    borderRadius: "24px",
    border: "1px solid #e2e8f0",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)",
    boxShadow: "0 20px 60px rgba(15, 23, 42, 0.08)",
    p: { xs: 1.5, sm: 2 },
  }}
>
  <TextField
    placeholder="Search blog..."
    size="small"
    fullWidth
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon sx={{ color: "#64748b" }} />
        </InputAdornment>
      ),
    }}
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    sx={{
      mb: 2,
      "& .MuiOutlinedInput-root": {
        borderRadius: "14px",
        background: "#fff",
        boxShadow: "0 4px 12px rgba(15, 23, 42, 0.04)",
      },
    }}
  />

  <TableContainer
    component={Paper}
    sx={{
      borderRadius: "20px",
      overflowX: "auto",
      border: "1px solid #e2e8f0",
      boxShadow: "0 12px 30px rgba(15, 23, 42, 0.06)",
      WebkitOverflowScrolling: "touch",
    }}
  >
    <Table sx={{ minWidth: 1100 }}>
      <TableHead
        sx={{
          background:
            "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
        }}
      >
        <TableRow>
          <TableCell sx={{ fontWeight: 800 }}>Photo</TableCell>
          <TableCell sx={{ fontWeight: 800 }}>Title</TableCell>
          <TableCell sx={{ fontWeight: 800 }}>Subtitle</TableCell>
          <TableCell sx={{ fontWeight: 800 }}>Content</TableCell>
          <TableCell sx={{ fontWeight: 800 }}>Likes</TableCell>
          <TableCell sx={{ fontWeight: 800 }}>CreatedAt</TableCell>
          <TableCell sx={{ fontWeight: 800 }}>UpdatedAt</TableCell>
          <TableCell sx={{ fontWeight: 800 }}>Actions</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {filteredBlogs
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((blog) => {
            const isExpanded = expandedRows[blog._id];
            const plainText = blog.body.replace(/<[^>]+>/g, "");
            const preview =
              plainText.length > 100 && !isExpanded
                ? plainText.substring(0, 100) + "..."
                : plainText;

            return (
              <TableRow
                key={blog._id}
                sx={{
                  "&:nth-of-type(even)": {
                    backgroundColor: "#fafcff",
                  },
                  "&:hover": {
                    backgroundColor: "#f8fbff",
                  },
                }}
              >
                <TableCell>
                  {blog.photo ? (
                    <img
                      src={`${config.FILE_BASE_URL}${blog.photo}`}
                      alt={blog.title}
                      style={{
                        width: 80,
                        borderRadius: 12,
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 6px 16px rgba(15,23,42,0.08)",
                      }}
                    />
                  ) : (
                    "No Photo"
                  )}
                </TableCell>

                <TableCell sx={{ fontWeight: 700 }}>{blog.title}</TableCell>

                <TableCell>{blog.subtitle}</TableCell>

                <TableCell sx={{ minWidth: 260 }}>
                  <Typography
                    variant="body2"
                    dangerouslySetInnerHTML={{ __html: preview }}
                    sx={{ color: "#334155", lineHeight: 1.6 }}
                  />
                  {plainText.length > 100 && (
                    <Button
                      size="small"
                      onClick={() => toggleExpand(blog._id)}
                      sx={{
                        mt: 1,
                        p: 0,
                        fontSize: "0.78rem",
                        textTransform: "none",
                        fontWeight: 700,
                      }}
                    >
                      {isExpanded ? "Read Less" : "Read More"}
                    </Button>
                  )}
                </TableCell>

                <TableCell>
                  <a
                    href={blog.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "#2563eb",
                      fontWeight: 700,
                      textDecoration: "none",
                    }}
                  >
                    {blog.likes}
                  </a>
                </TableCell>

                <TableCell>
                  <Typography variant="body2" sx={{ color: "#475569" }}>
                    {new Date(blog.createdAt).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body2" sx={{ color: "#475569" }}>
                    {new Date(blog.updatedAt).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => onEdit(blog)}
                      sx={{
                        borderRadius: "10px",
                        textTransform: "none",
                        fontWeight: 700,
                      }}
                    >
                      Edit
                    </Button>

                    <Button
                      type="button"
                      variant="contained"
                      color={blog.isPublished ? "warning" : "success"}
                      size="small"
                      onClick={() => handleTogglePublish(blog)}
                      sx={{
                        borderRadius: "10px",
                        textTransform: "none",
                        fontWeight: 700,
                      }}
                    >
                      {blog.isPublished ? "Unpublish" : "Publish"}
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  </TableContainer>

  <Box
    sx={{
      mt: 1.5,
      borderRadius: "16px",
      overflow: "hidden",
      border: "1px solid #e2e8f0",
      background: "#fff",
    }}
  >
    <TablePagination
      component="div"
      count={filteredBlogs.length}
      page={page}
      onPageChange={(e, newPage) => setPage(newPage)}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={(e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
      }}
      rowsPerPageOptions={[5, 10, 20]}
    />
  </Box>
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
  <Box
  sx={{
    maxWidth: "1200px",
    margin: "0 auto",
    mt: 3,
    mb: 10,
    px: 2,
  }}
>
  <Card
    sx={{
      borderRadius: "28px",
      overflow: "hidden",
      border: "1px solid #e2e8f0",
      boxShadow: "0 20px 60px rgba(15, 23, 42, 0.08)",
      background:
        "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)",
      p: 0,
      mb: 4,
    }}
  >
    <Box
      sx={{
        px: { xs: 1.5, sm: 2.5 },
        pt: 2,
        pb: 1,
        background:
          "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <Tabs
        value={tabValue}
        onChange={(e, newValue) => {
          setTabValue(newValue);
          if (newValue === 0) setEditingBlog(null);
        }}
        sx={{
          mb: 0,
          "& .MuiTabs-indicator": {
            height: 3,
            borderRadius: "999px",
            background:
              "linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%)",
          },
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 700,
            fontSize: "0.95rem",
            minHeight: 48,
            color: "#64748b",
            borderRadius: "12px 12px 0 0",
          },
          "& .Mui-selected": {
            color: "#1d4ed8 !important",
          },
        }}
      >
        <Tab label={editingBlog ? "Edit Blog" : "Post Blog"} />
        <Tab label="Blog List" />
      </Tabs>
    </Box>

    {tabValue === 0 && (
      <CardContent
        sx={{
          p: { xs: 1.5, sm: 2.5 },
          background:
            "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
        }}
      >
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
      <CardContent
        sx={{
          p: { xs: 1.5, sm: 2.5 },
          background:
            "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
        }}
      >
        <BlogList
          onEdit={(blog) => {
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
