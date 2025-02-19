import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, CircularProgress, Avatar, Tabs, Tab, IconButton, Paper } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess'; // 위 화살표
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // 아래 화살표
import LeagueRanking from "@/components/leagueRanking";

const LeagueRankingContainer = () => {
  const [leagueData, setLeagueData] = useState([]); // 모든 리그 데이터 저장
  const [selectedLeagueIndex, setSelectedLeagueIndex] = useState(0); // 선택된 리그 인덱스 관리
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [isCollapsed, setIsCollapsed] = useState(true); // 접기/펼치기 상태

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
    if (isCollapsed) {
      toggleCollapse();
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev); // 접기/펼치기 상태 변경
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
    <Paper
      elevation={3} // 카드 그림자 설정 (0-24)
      sx={{
        padding: 2,        // 카드 내부 여백
        borderRadius: 2,   // 모서리 둥글게
        marginBottom: 4,   // 다음 섹션과 간격
        backgroundColor: "white", // 카드 배경색
      }}
    >
      {/* 제목 추가 */}
      <Typography
        variant="h4"  // 제목 크기 설정
        fontWeight="bold" // 글자 굵게
        textAlign="center" // 중앙 정렬
        display="flex" // 레이아웃 정리
        alignItems="center"
        sx={{
          mb: 2,              // 아래 간격
        }}
      >
        리그 랭킹 👑
      </Typography>

      {/* 탭과 접기/펼치기 버튼 */}
      <Box display="flex" alignItems="center">
        {/* 탭으로 리그 전환 */}
        <Tabs
          value={selectedLeagueIndex}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="리그 탭"
          sx={{
            flex: 1, // 탭이 남은 공간을 차지하도록 설정
          }}
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

        {/* 접기/펼치기 버튼 */}
        <IconButton
          onClick={toggleCollapse}
          sx={{
            ml: 1, // 버튼과 탭 간의 간격 추가
            flexShrink: 0, // 버튼 크기를 줄이지 않음
          }}
        >
          {isCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </IconButton>
      </Box>

      {/* 리그 순위 테이블 */}
      <Box
        mt={2}
        style={{
          height: isCollapsed ? 0 : "auto", // 펼쳐진 상태의 높이 설정
          overflow: "hidden", // 접힌 경우 내용을 숨김
          transition: "height 0.3s ease", // 접기/펼치기 애니메이션
        }}
      >
        <LeagueRanking data={[selectedLeague]} />
      </Box>
    </Paper>
  );
};

export default LeagueRankingContainer;