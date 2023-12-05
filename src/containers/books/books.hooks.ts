import axios from 'axios';
import { useEffect, useState } from 'react';
import { IBooks } from './books.types';
import { IApiResponse, IMeta, IParams } from '../../services/types';

export default function useAction() {
  const [params, setParams] = useState<IParams>({
    page: 1,
    size: 10,
  });
  const [meta, setMeta] = useState<IMeta>();
  const [loading, setLoading] = useState<boolean>(false);
  const [books, setBooks] = useState<IBooks[]>([]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get<IApiResponse<IBooks[]>>(
        'http://localhost:8000/api/books',
        {
          params,
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        }
      );
      setBooks(response.data.data);
      setMeta(response.data.meta);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [params]);

  return {
    books,
    params,
    setParams,
    loading,
    meta,
  };
}
