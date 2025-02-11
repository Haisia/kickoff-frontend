'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Box, Typography, Container, Alert } from '@mui/material';
import axios from 'axios';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { email, password } = formData;

    if (!email || !password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/members/login', {
        email,
        password,
      });

      if (response.status === 200 && response.data.token) {
        localStorage.setItem('jwt-token', response.data.token);

        router.push('/');
      } else {
        setError('로그인에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message || '로그인에 실패했습니다.');
      } else {
        setError('로그인 과정에서 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        로그인
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="이메일"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="비밀번호"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          margin="normal"
          required
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mt: 3,
          }}
        >
          <Button
            type="button"
            variant="outlined"
            color="secondary"
            onClick={() => router.push('/')}
            sx={{ flex: 1, mr: 1 }}
          >
            홈으로
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ flex: 1, ml: 1 }}
          >
            로그인
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;