import {
  Button,
  CircularProgress,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  styled,
} from '@mui/material';
import useAction from './books.hooks';
import { IBooks } from './books.types';
import { ChangeEvent } from 'react';
import axios from 'axios';
import CommonPage from '../../components/common-page/common-page';
import { Link } from 'react-router-dom';
import { parseISO, format } from 'date-fns';

const HeaderElementStyled = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
`;

export default function List() {
  const { books, loading, setParams, params, meta, fetchBooks } = useAction();

  const renderContent = () => {
    if (loading) {
      return renderLoading();
    }
    return books?.map((record: IBooks) => (
        <TableRow
          key={record.id}
          sx={{ '&:last-child td, &:last-child th': { border: 0 },
          '&:hover': { backgroundColor: '#f5f5f5' } }}
        >
          <Link to={`/detail/${record.id}`} style={{ textDecoration: 'none', display: 'contents', width: '100%' }}>
            <TableCell component="th">{record.title}</TableCell>
            <TableCell>{record.author}</TableCell>
            <TableCell>{record.genre}</TableCell>
            <TableCell>{record.published_year}</TableCell>
            <TableCell align="right">{record.total_copies}</TableCell>
            <TableCell>
              {format(parseISO(record.created_at), 'dd/MM/yyyy HH:mm:ss')}
            </TableCell>
            <TableCell>
              <Link to={`/update/${record.id}`}>
                <Button variant="outlined">Edit</Button>
              </Link>
              <Button
                style={{ marginLeft: '4px' }}
                variant="contained"
                color="error"
                onClick={() => handleDelete(record.id)}
              >
                Delete
              </Button>
            </TableCell>
          </Link>
        </TableRow>
    ));
  };

  const renderLoading = () => (
    <TableRow>
      <TableCell colSpan={7} align="center">
        <CircularProgress />
      </TableCell>
    </TableRow>
  );

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setParams({
      ...params,
      search: value,
    });
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) {
      console.error('Invalid book id');
      return;
    }

    try {
      const confirmation = window.confirm('Are you sure you want to delete this book?');
      if (!confirmation) {
        return;
      }

      await axios.delete(`http://localhost:8000/api/books/${id}`, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });

      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  return (
    <CommonPage
      title="Books"
      actionElement={
        <HeaderElementStyled>
          <TextField
            name="search"
            placeholder="Search books title or author"
            onChange={handleSearch}
            size="small"
          />
          <Link to="/create">
            <Button type="button" variant="contained">
              Create new
            </Button>
          </Link>
        </HeaderElementStyled>
      }
    >
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Author</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Genre</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Published Year</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                Available
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Created At</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderContent()}</TableBody>
        </Table>
      </TableContainer>
      <Pagination
        sx={{ mt: 3 }}
        count={meta?.totalPages || 1}
        variant="outlined"
        shape="rounded"
        onChange={(_, page: number) => {
          setParams({
            ...params,
            page,
          });
        }}
      />
    </CommonPage>
  );
}
