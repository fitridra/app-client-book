import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Stack } from '@mui/material';
import { useParams } from 'react-router-dom';
import CommonPage from '../../components/common-page/common-page';

interface IBook {
  id: number;
  title: string;
  author: string;
  isbn: string;
  published_year: string;
  genre: string;
  total_copies: number;
  copies_available: number;
}

interface IFileItem {
  url: string;
  secure_url: string;
  width?: number;
  height?: number;
  resourceType?: string;
}

export default function BookDetail() {
  const params = useParams();
  const [book, setBook] = useState<IBook>();
  const [fileItem, setFileItem] = useState<IFileItem>();

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/books/${params.id}`)
      .then((response) => {
        setFileItem(response.data.data.cover);
        setBook(response.data.data);
      })
      .catch((error) => console.error('Error fetching book details:', error));
  }, [params.id]);

  if (!book) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <CommonPage withBack component={'form'} title="Book Detail">
      <Stack spacing={2}>
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Detail Information</Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <Box sx={{ width: '100%' }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Title</Typography>
            <Typography variant="body1">{book.title}</Typography>

            <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 2 }}>Author</Typography>
            <Typography variant="body1">{book.author}</Typography>

            <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 2 }}>ISBN</Typography>
            <Typography variant="body1">{book.isbn}</Typography>

            <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 2 }}>Published Year</Typography>
            <Typography variant="body1">{book.published_year}</Typography>
          </Box>

          <Box sx={{ width: '100%' }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold'}}>Genre</Typography>
            <Typography variant="body1">{book.genre}</Typography>

            <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 2 }}>Copies Available</Typography>
            <Typography variant="body1">{book.copies_available}</Typography>

            <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 2 }}>Total Copies</Typography>
            <Typography variant="body1">{book.total_copies}</Typography>
          </Box>
        
          {fileItem && fileItem.url && (
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Book Cover</Typography>
              <img
                src={fileItem.secure_url}
                alt="Book Cover"
                style={{ width: '100%', objectFit: 'cover', marginTop: '2px' }}
                />
            </Box>
          )}
        </Stack>
      </Stack>
    </CommonPage>
  );
}
