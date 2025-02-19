import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, CircularProgress, Avatar, Tabs, Tab } from '@mui/material';
import LeagueRanking from "@/components/leagueRanking";

const LeagueRankingContainer = () => {
  const [leagueData, setLeagueData] = useState([]); // 모든 리그 데이터 저장
  const [selectedLeagueIndex, setSelectedLeagueIndex] = useState(0); // 선택된 리그 인덱스 관리
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  useEffect(() => {
    const fetchLeagueRankings = async () => {
      setLoading(true);
      setError(null);

      try {
        // API 요청
        const response = await axios.post('http://localhost:8082/matches/league/rank/main');

        // 응답 데이터 상태에 저장
        setLeagueData(response.data.response || []);
      } catch (err) {
        console.error('리그 순위 데이터를 가져오는 중 에러 발생:', err);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeagueRankings();
  }, []);

  const handleTabChange = (event, newIndex) => {
    // 탭 변경시 선택된 리그 인덱스 업데이트
    setSelectedLeagueIndex(newIndex);
  };

  // 로딩 상태
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  // 데이터가 없는 경우
  if (!leagueData.length) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography>리그 데이터를 찾을 수 없습니다.</Typography>
      </Box>
    );
  }

  // 선택된 리그 데이터
  const selectedLeague = leagueData[selectedLeagueIndex];

  return (
    <Box p={2}>
      {/* 탭으로 리그 전환 */}
      <Tabs
        value={selectedLeagueIndex}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="리그 탭"
      >
        {leagueData.map((league, index) => (
          <Tab
            key={league.league.id}
            label={
              <Box display="flex" alignItems="center">
                <Avatar
                  src={league.league.logo}
                  alt={league.league.name}
                  sx={{ width: 32, height: 32, mr: 1 }}
                />
                {league.league.name}
              </Box>
            }
            value={index}
          />
        ))}
      </Tabs>

      {/* 리그 순위 테이블 */}
      <Box mt={4}>
        <LeagueRanking data={[selectedLeague]} />
      </Box>
    </Box>
  );
};

export default LeagueRankingContainer;