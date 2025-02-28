'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField, Button, Box, Typography, Container, Alert } from '@mui/material';
import axios from 'axios';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '', // 닉네임 추가
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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
    setSuccess(false);

    const { email, password, confirmPassword, nickname } = formData;

    // 필드 유효성 검사
    if (!email || !password || !confirmPassword || !nickname) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      setError('비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/members/create', {
        email,
        password,
        nickname, // 닉네임 전달
      });

      if (response.status === 200) {
        setSuccess(true);
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          nickname: '', // 폼 초기화 시 nickname도 초기화
        });
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message || '회원가입에 실패했습니다.');
      } else {
        setError('회원가입 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    }
  };

  const handleHome = () => {
    router.push('/');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        회원가입
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          회원가입에 성공했습니다!
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
        <TextField
          fullWidth
          label="비밀번호 확인"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="닉네임" // 닉네임 라벨
          name="nickname" // 닉네임 이름
          type="text"
          value={formData.nickname}
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
            onClick={handleHome}
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
            회원가입
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default SignupPage;