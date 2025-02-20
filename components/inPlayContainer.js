import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, CircularProgress, Avatar, Tabs, Tab, IconButton, Paper } from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InPlay from "@/components/inPlay";

const InPlayContainer = () => {
  const [inPlayData, setInPlayData] = useState([]); // 진행 중인 경기 데이터
  const [selectedLeagueIndex, setSelectedLeagueIndex] = useState(0); // 선택된 리그 인덱스
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [isCollapsed, setIsCollapsed] = useState(false); // 접기 상태

  useEffect(() => {
    const fetchInPlayMatches = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.post("http://localhost:8082/matches/fixture/in-play");
        const leagues = response.data.response || [];

        // 진행 중인 경기가 있는 리그의 첫 번째 인덱스를 찾음
        const indexWithInPlayMatches = leagues.findIndex((league) => league.fixtures && league.fixtures.length > 0);

        // 진행 중인 경기가 있는 리그가 있으면 해당 리그를 기본 활성화
        if (indexWithInPlayMatches !== -1) {
          setSelectedLeagueIndex(indexWithInPlayMatches);
        } else {
          // 없으면 첫 번째 리그를 활성화
          setSelectedLeagueIndex(0);
        }

        setInPlayData(leagues);
      } catch (err) {
        console.error("진행 중인 경기를 불러오는 중 에러 발생:", err);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchInPlayMatches();
  }, []);

  const handleTabChange = (event, newIndex) => {
    setSelectedLeagueIndex(newIndex);
    if (isCollapsed) {
      toggleCollapse();
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  // 로딩 상태 처리
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  // 데이터가 없는 경우
  if (!inPlayData.length) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography>현재 진행 중인 경기가 없습니다.</Typography>
      </Box>
    );
  }

  const selectedLeague = inPlayData[selectedLeagueIndex];

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 2,
        borderRadius: 2,
        marginBottom: 4,
        backgroundColor: "white",
      }}
    >
      {/* 제목 */}
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{ mb: 2 }}
      >
        진행 중인 경기 ⚽
      </Typography>

      {/* 탭 */}
      <Box display="flex" alignItems="center">
        <Tabs
          value={selectedLeagueIndex}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="리그 탭"
          sx={{ flex: 1 }}
        >
          {inPlayData.map((league, index) => (
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
          sx={{ ml: 1 }}
        >
          {isCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </IconButton>
      </Box>

      {/* 경기 데이터 표시 */}
      <Box
        mt={2}
        style={{
          height: isCollapsed ? 0 : "auto",
          overflow: "hidden",
          transition: "height 0.3s ease",
        }}
      >
        <InPlay data={selectedLeague} />
      </Box>
    </Paper>
  );
};

export default InPlayContainer;