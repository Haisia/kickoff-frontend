"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import axios from "axios";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    league: "", // 리그 선택
    team: "",   // 팀 선택
  });

  const [leagues, setLeagues] = useState([]);
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // API를 호출하여 리그 목록 가져오기
    const fetchLeagues = async () => {
      try {
        const response = await axios.post("http://localhost:8082/matches/team/list");
        if (response.status === 200) {
          setLeagues(response.data.response);
        }
      } catch (err) {
        console.error("리그를 가져오는 중 오류 발생:", err);
        setError("리그 정보를 불러오는데 실패했습니다.");
      }
    };

    fetchLeagues();
  }, []);

  const handleLeagueChange = (e) => {
    const selectedLeagueId = e.target.value;
    setFormData((prev) => ({ ...prev, league: selectedLeagueId, team: "" }));

    // 선택된 리그의 팀 목록 필터링
    const selectedLeague = leagues.find((league) => league.league.id === selectedLeagueId);
    if (selectedLeague) {
      setTeams(selectedLeague.teams);
    } else {
      setTeams([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const { email, password, confirmPassword, nickname, team } = formData;

    // 필드 유효성 검사
    if (!email || !password || !confirmPassword || !nickname || !team) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/members/create", {
        email,
        password,
        nickname,
        favoriteTeamId: team, // 선택된 팀 ID 전달
      });

      if (response.status === 200) {
        setSuccess(true);
        setFormData({
          email: "",
          password: "",
          confirmPassword: "",
          nickname: "",
          league: "",
          team: "",
        });
        setTeams([]);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message || "회원가입에 실패했습니다.");
      } else {
        setError("회원가입 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
    }
  };

  const handleHome = () => {
    router.push("/");
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
          label="닉네임"
          name="nickname"
          type="text"
          value={formData.nickname}
          onChange={handleChange}
          margin="normal"
          required
        />
        {/* 리그 선택 */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="league-label">리그</InputLabel>
          <Select
            labelId="league-label"
            name="league"
            value={formData.league}
            onChange={handleLeagueChange}
          >
            {leagues.map((league) => (
              <MenuItem key={league.league.id} value={league.league.id}>
                <img
                  src={league.league.logo}
                  alt={league.league.name}
                  style={{ width: 24, height: 24, marginRight: 8 }}
                />
                {league.league.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* 팀 선택 */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="team-label">응원 팀</InputLabel>
          <Select
            labelId="team-label"
            name="team"
            value={formData.team}
            onChange={handleChange}
            disabled={!formData.league}
          >
            {teams.map((team) => (
              <MenuItem key={team.id} value={team.id}>
                <img
                  src={team.logo}
                  alt={team.name}
                  style={{ width: 24, height: 24, marginRight: 8 }}
                />
                {team.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
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