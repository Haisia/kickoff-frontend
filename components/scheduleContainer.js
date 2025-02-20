import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, CircularProgress, Avatar, Tabs, Tab, IconButton, Paper } from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Schedule from "@/components/schedule";

const ScheduleContainer = () => {
  const [scheduleData, setScheduleData] = useState([]); // 리그별 경기 데이터를 저장
  const [selectedLeagueIndex, setSelectedLeagueIndex] = useState(0); // 선택된 리그 인덱스
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [isCollapsed, setIsCollapsed] = useState(true); // 접기/펼치기 상태

  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      setError(null);

      try {
        // API 요청
        const response = await axios.post("http://localhost:8082/matches/fixture/main");

        // 응답 데이터를 상태에 저장
        setScheduleData(response.data.response || []);
      } catch (err) {
        console.error("경기 일정 데이터를 가져오는 중 에러 발생:", err);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const handleTabChange = (event, newIndex) => {
    setSelectedLeagueIndex(newIndex); // 선택된 탭 인덱스 업데이트
    if (isCollapsed) {
      toggleCollapse();
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev); // 접기/펼치기 상태 토글
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
  if (!scheduleData.length) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography>경기 일정 데이터를 찾을 수 없습니다.</Typography>
      </Box>
    );
  }

  // 선택된 리그 데이터
  const selectedLeague = scheduleData[selectedLeagueIndex];

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
        textAlign="center"
        display="flex"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        경기 일정 📅
      </Typography>

      {/* 탭 (리그별 전환) */}
      <Box display="flex" alignItems="center">
        <Tabs
          value={selectedLeagueIndex}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="리그 탭"
          sx={{ flex: 1 }}
        >
          {scheduleData.map((league, index) => (
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

      {/* 경기 일정 표시 부분 */}
      <Box
        mt={2}
        style={{
          height: isCollapsed ? 0 : "auto",
          overflow: "hidden",
          transition: "height 0.3s ease",
        }}
      >
        <Schedule data={selectedLeague} />
      </Box>
    </Paper>
  );
};

export default ScheduleContainer;