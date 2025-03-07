"use client"; // 클라이언트 컴포넌트 표시

import { useRouter } from "next/navigation";
import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
} from "@mui/material";

// UTC 시간 문자열을 한국 시간으로 변환
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

// 승패/무승부를 강조하는 함수
const getHighlightedTeam = (homeScore, awayScore, homeTeamName, awayTeamName) => {
  if (homeScore > awayScore) {
    return { home: `${homeTeamName} ✅`, away: awayTeamName };
  } else if (awayScore > homeScore) {
    return { home: homeTeamName, away: `${awayTeamName} ✅` };
  } else {
    return { home: homeTeamName, away: awayTeamName };
  }
};

const Schedule = ({ data }) => {
  const router = useRouter(); // 라우팅을 위한 useRouter

  // 데이터가 없거나 잘못된 경우 처리
  if (!data || !data.league || !data.fixtures || data.fixtures.length === 0) {
    return <Typography>경기 일정 데이터가 없습니다.</Typography>;
  }

  // 경기 일정 정렬
  const sortedFixtures = [...data.fixtures].sort(
    (a, b) => a.fixtureDateTime.timestamp - b.fixtureDateTime.timestamp
  );

  // 테이블 Row 클릭 이벤트
  const handleRowClick = (fixtureId) => {
    const leagueId = data.league.id; // 리그 ID 가져오기
    const year = data.league.year; // 리그 연도 가져오기
    router.push(`/fixtures/detail/${leagueId}/${year}/${fixtureId}`); // 경로 이동
  };

  return (
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

            const { home, away } = getHighlightedTeam(
              fullTimeScore?.home,
              fullTimeScore?.away,
              homeTeam?.name || "정보 없음",
              awayTeam?.name || "정보 없음"
            );

            return (
              <TableRow
                key={fixture.id}
                hover
                style={{ cursor: "pointer" }}
                onClick={() => handleRowClick(fixture.id)} // 상세 페이지로 이동
              >
                <TableCell>
                  {convertToKoreanTime(
                    fixture.fixtureDateTime.date,
                    fixture.fixtureDateTime.dateTimeZone
                  )}
                </TableCell>
                <TableCell>
                  <Typography>{fixture.venue?.name || "정보 없음"}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {fixture.venue?.city || ""}
                  </Typography>
                </TableCell>
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
                <TableCell>
                  {fullTimeScore?.home ?? "-"} - {fullTimeScore?.away ?? "-"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Schedule;