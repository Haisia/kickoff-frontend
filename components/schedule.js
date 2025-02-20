import React from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar } from "@mui/material";

// UTC 시간 데이터를 한국 시간으로 변환하는 함수
const convertToKoreanTime = (dateString, dateTimeZone) => {
  const utcDate = new Date(dateString);
  const koreanTimeOffset = 9 * 60; // UTC+9
  const koreanTime = new Date(utcDate.getTime() + koreanTimeOffset * 60 * 1000);
  return koreanTime.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// 승자를 표시하는 함수 (✅ 이모지 추가)
const getHighlightedTeam = (homeScore, awayScore, homeTeamName, awayTeamName) => {
  if (homeScore > awayScore) {
    return { home: `${homeTeamName} ✅`, away: awayTeamName };
  } else if (awayScore > homeScore) {
    return { home: homeTeamName, away: `${awayTeamName} ✅` };
  } else {
    return { home: homeTeamName, away: awayTeamName }; // 무승부일 경우
  }
};

const Schedule = ({ data }) => {
  // 데이터 검증
  if (!data || !data.league || !data.fixtures || data.fixtures.length === 0) {
    return <Typography>경기 일정 데이터가 없습니다.</Typography>;
  }

  // 날짜/시간 기준 오름차순 정렬
  const sortedFixtures = [...data.fixtures].sort(
    (a, b) => a.fixtureDateTime.timestamp - b.fixtureDateTime.timestamp
  );

  return (
    <Box p={2}>
      {/* 리그 기본 정보 */}
      <Box display="flex" alignItems="center" mb={4}>
        <Avatar src={data.league.logo} alt={data.league.name} />
        <Typography variant="h4" ml={2}>
          {data.league.name} - {data.league.year}
        </Typography>
      </Box>

      {/* 경기 일정 테이블 */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>날짜/시간</TableCell>
              <TableCell>경기장</TableCell>
              <TableCell>홈팀</TableCell>
              <TableCell>원정팀</TableCell>
              <TableCell>결과</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedFixtures.map((fixture) => {
              const { homeTeam, awayTeam, fullTimeScore } = fixture;

              // 승자 강조를 위한 텍스트 생성
              const { home, away } = getHighlightedTeam(
                fullTimeScore?.home,
                fullTimeScore?.away,
                homeTeam?.name || "정보 없음",
                awayTeam?.name || "정보 없음"
              );

              return (
                <TableRow key={fixture.id}>
                  {/* 날짜/시간 */}
                  <TableCell>
                    {convertToKoreanTime(
                      fixture.fixtureDateTime.date,
                      fixture.fixtureDateTime.dateTimeZone
                    )}
                  </TableCell>

                  {/* 경기장 */}
                  <TableCell>
                    <Typography>{fixture.venue?.name || "정보 없음"}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {fixture.venue?.city || ""}
                    </Typography>
                  </TableCell>

                  {/* 홈팀 */}
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar
                        src={homeTeam?.logo || ""}
                        alt={homeTeam?.name || "홈팀"}
                        sx={{ width: 24, height: 24, mr: 1 }}
                      />
                      <Typography>{home}</Typography>
                    </Box>
                  </TableCell>

                  {/* 원정팀 */}
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar
                        src={awayTeam?.logo || ""}
                        alt={awayTeam?.name || "원정팀"}
                        sx={{ width: 24, height: 24, mr: 1 }}
                      />
                      <Typography>{away}</Typography>
                    </Box>
                  </TableCell>

                  {/* 경기 결과 */}
                  <TableCell>
                    {fullTimeScore?.home ?? "-"} - {fullTimeScore?.away ?? "-"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Schedule;