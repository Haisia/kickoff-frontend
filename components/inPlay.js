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

const InPlay = ({ data }) => {
  // 데이터 유효성 검사
  if (!data || !data.league || !data.fixtures || data.fixtures.length === 0) {
    return <Typography>진행 중인 경기 데이터가 없습니다.</Typography>;
  }

  return (
    <Box p={2}>
      {/* 리그 정보 */}
      <Box display="flex" alignItems="center" mb={4}>
        <Avatar src={data.league.logo} alt={data.league.name} />
        <Typography variant="h4" ml={2}>
          {data.league.name} - {data.league.year}
        </Typography>
      </Box>

      {/* 경기 정보 테이블 */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>진행 상태</TableCell>
              <TableCell>경기장</TableCell>
              <TableCell>홈팀</TableCell>
              <TableCell>점수</TableCell>
              <TableCell>원정팀</TableCell>
              <TableCell>심판</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.fixtures.map((fixture) => (
              <TableRow key={fixture.id}>
                {/* 진행 상태 */}
                <TableCell>
                  <Typography>{fixture.fixtureStatus.description}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {fixture.fixtureStatus.elapsed}분
                  </Typography>
                </TableCell>

                {/* 경기장 정보 */}
                <TableCell>
                  <Typography>{fixture.venue?.name || "정보 없음"}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {fixture.venue?.city || ""}
                  </Typography>
                </TableCell>

                {/* 홈팀 정보 */}
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Avatar
                      src={fixture.homeTeam?.logo || ""}
                      alt={fixture.homeTeam?.name || "홈팀"}
                      sx={{ width: 24, height: 24, mr: 1 }}
                    />
                    <Typography>
                      {fixture.homeTeam?.name || "정보 없음"}
                    </Typography>
                  </Box>
                </TableCell>

                {/* 점수 */}
                <TableCell>
                  <Typography>
                    {fixture.halfTimeScore?.home ?? 0} - {fixture.halfTimeScore?.away ?? 0}
                  </Typography>
                </TableCell>

                {/* 원정팀 정보 */}
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Avatar
                      src={fixture.awayTeam?.logo || ""}
                      alt={fixture.awayTeam?.name || "원정팀"}
                      sx={{ width: 24, height: 24, mr: 1 }}
                    />
                    <Typography>
                      {fixture.awayTeam?.name || "정보 없음"}
                    </Typography>
                  </Box>
                </TableCell>

                {/* 심판 정보 */}
                <TableCell>
                  <Typography>{fixture.referee || "알 수 없음"}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default InPlay;