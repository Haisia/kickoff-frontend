import React from "react";
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar } from "@mui/material";

// UTC 시간 데이터를 한국 시간으로 변환하는 함수
const convertToKoreanTime = (dateString, dateTimeZone) => {
  // dateString은 ISO 형식의 날짜 (`fixtureDateTime.date`)로 제공됨
  const utcDate = new Date(dateString);

  // 브라우저 또는 환경이 타임존을 이해하지 못하는 경우 기본 UTC 시간 변환
  if (dateTimeZone !== "UTC") {
    console.warn(`Unhandled timezone format: ${dateTimeZone}`);
  }

  // KST(한국 표준 시간) 변환 (UTC+9)
  const koreanTimeOffset = 9 * 60; // 9시간을 분 단위로 변경
  const koreanTime = new Date(utcDate.getTime() + koreanTimeOffset * 60 * 1000);

  return koreanTime.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
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
            {sortedFixtures.map((fixture) => (
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
                      src={fixture.homeTeam?.logo || ""}
                      alt={fixture.homeTeam?.name || "홈팀"}
                      sx={{ width: 24, height: 24, mr: 1 }}
                    />
                    <Typography>
                      {fixture.homeTeam?.name || "정보 없음"}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" ml={1}>
                      ({fixture.homeTeam?.code || ""})
                    </Typography>
                  </Box>
                </TableCell>

                {/* 원정팀 */}
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
                    <Typography variant="body2" color="textSecondary" ml={1}>
                      ({fixture.awayTeam?.code || ""})
                    </Typography>
                  </Box>
                </TableCell>

                {/* 경기 결과 */}
                <TableCell>
                  {fixture.fullTimeScore?.home ?? "-"} -{" "}
                  {fixture.fullTimeScore?.away ?? "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Schedule;