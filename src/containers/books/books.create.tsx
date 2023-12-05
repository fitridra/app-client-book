import { Box, TextField, Switch, Stack, styled } from '@mui/material';
import CommonPage from '../../components/common-page/common-page';
import { ChangeEvent, FormEvent, useState } from 'react';
import { CloudUpload } from '@mui/icons-material';
import axios from 'axios';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';

const initialFormValues = {
  title: '',
  author: '',
  isbn: '',
  published_year: '',
  genre: '',
  total_copies: '',
  copies_available: '',
  published: false,
};

interface IFileItem {
  url: string;
  secure_url: string;
  width?: number;
  height?: number;
  resourceType?: string;
}

export default function Create() {
  const VisuallyHiddenInput = styled('input')`
    display: none;
  `;

  const navigate = useNavigate();
  const [formValues, setFormValues] = useState(initialFormValues);
  const [loadingCover, setLoadingCover] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [fileItem, setFileItem] = useState<IFileItem>();

  const handleUploadCover = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      try {
        setLoadingCover(true);
        const formData = new FormData();
        formData.append('cover', files[0]);

        const response = await axios.post('http://localhost:8000/api/books/upload', formData, {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });

        setFileItem(response.data.data);
      } catch (error) {
        console.error('Error uploading cover:', error);
      } finally {
        setLoadingCover(false);
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLDivElement>) => {
    e.preventDefault();
    try {
      setLoadingSubmit(true);
      const payload = { ...formValues, cover: fileItem };
      await axios.post('http://localhost:8000/api/books', payload, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });

      setFormValues(initialFormValues);
      navigate(-1);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <CommonPage
      withBack
      component={'form'}
      title="Create new Book"
      actionElement={
        <LoadingButton type="submit" variant="contained" loading={loadingSubmit}>
          Submit
        </LoadingButton>
      }
      onSubmit={handleSubmit}
    >
      <Box
        sx={{
          width: '50%',
        }}
      >
        <TextField
          name="title"
          size="small"
          sx={{ width: '100%', mb: 3 }}
          label="Title"
          onChange={(e) =>
            setFormValues({
              ...formValues,
              title: e.target.value,
            })
          }
        />
        <TextField
          name="author"
          size="small"
          sx={{ width: '100%', mb: 3 }}
          label="Author"
          onChange={(e) =>
            setFormValues({
              ...formValues,
              author: e.target.value,
            })
          }
        />
        <TextField
          name="isbn"
          size="small"
          sx={{ width: '100%', mb: 3 }}
          label="ISBN"
          onChange={(e) =>
            setFormValues({
              ...formValues,
              isbn: e.target.value,
            })
          }
        />
        <TextField
          name="published_year"
          size="small"
          sx={{ width: '100%', mb: 3 }}
          label="Published Year"
          type="number"
          onChange={(e) =>
            setFormValues({
              ...formValues,
              published_year: e.target.value,
            })
          }
        />
        <TextField
          name="genre"
          size="small"
          sx={{ width: '100%', mb: 3 }}
          label="Genre"
          onChange={(e) =>
            setFormValues({
              ...formValues,
              genre: e.target.value,
            })
          }
        />
        <TextField
          name="total_copies"
          size="small"
          sx={{ width: '100%', mb: 3 }}
          label="Total Copies"
          type="number"
          onChange={(e) =>
            setFormValues({
              ...formValues,
              total_copies: e.target.value,
            })
          }
        />
        <TextField
          name="copies_available"
          size="small"
          sx={{ width: '100%', mb: 3 }}
          label="Copies Available"
          type="number"
          onChange={(e) =>
            setFormValues({
              ...formValues,
              copies_available: e.target.value,
            })
          }
        />
        <LoadingButton
          component="label"
          variant="contained"
          startIcon={<CloudUpload />}
          sx={{ mb: 3 }}
          loading={loadingCover}
        >
          Upload Book Cover
          <VisuallyHiddenInput
            type="file"
            accept=".png, .jpg, .jpeg"
            onChange={handleUploadCover}
          />
        </LoadingButton>
        {fileItem && fileItem.url && (
          <Box>
            <img
              src={fileItem.secure_url}
              alt="preview"
              style={{ width: '100%', objectFit: 'cover' }}
            />
          </Box>
        )}
        <Box>
          <Stack direction={'row'} alignItems={'center'}>
            <div>Publish</div>
            <Switch
              name="published"
              title="Published"
              onChange={(e) =>
                setFormValues({
                  ...formValues,
                  published: e.target.checked,
                })
              }
            />
          </Stack>
        </Box>
      </Box>
    </CommonPage>
  );
}
