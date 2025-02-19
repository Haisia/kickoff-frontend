import React from 'react';
import { Box, Typography, Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

// 데이터를 props로 받아 테이블로 출력하는 컴포넌트
const LeagueRanking = ({ data }) => {
  if (!data || data.length === 0) {
    return <Typography>리그 데이터가 없습니다.</Typography>;
  }

  // "teams" 데이터 접근을 위한 상위 데이터 구조
  const leagueData = data[0]; // 첫 번째 리그 데이터

  return (
    <Box p={2}>
      {/* 리그 기본 정보 표시 */}
      <Box display="flex" alignItems="center" mb={4}>
        <Avatar src={leagueData.league.logo} />
        <Typography variant="h4" ml={2}>
          {leagueData.league.name} - {leagueData.season}
        </Typography>
      </Box>

      {/* 리그 순위 테이블 */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>순위</TableCell>
              <TableCell>팀 로고</TableCell>
              <TableCell>팀 이름</TableCell>
              <TableCell>플레이 경기</TableCell>
              <TableCell>승</TableCell>
              <TableCell>무</TableCell>
              <TableCell>패</TableCell>
              <TableCell>골 득실</TableCell>
              <TableCell>승점</TableCell>
              <TableCell>최근 경기 폼</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* 팀 데이터 순회 */}
            {leagueData.teams.map((team) => (
              <TableRow key={team.id}>
                <TableCell>{team.rank}</TableCell>
                <TableCell>
                  <Avatar src={team.logo} alt={team.code} />
                </TableCell>
                <TableCell>{team.name}</TableCell>
                <TableCell>{team.played}</TableCell>
                <TableCell>{team.win}</TableCell>
                <TableCell>{team.draw}</TableCell>
                <TableCell>{team.lose}</TableCell>
                <TableCell>{team.goalsDiff}</TableCell>
                <TableCell>{team.points}</TableCell>
                <TableCell>{team.form}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default LeagueRanking;