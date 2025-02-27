import React from 'react';
import { Box, Typography, Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess'; // 초록색 상승 화살표
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // 붉은색 하락 화살표
import RemoveIcon from '@mui/icons-material/Remove'; // 회색 `-` 표시

// 데이터를 props로 받아 테이블로 출력하는 컴포넌트
const LeagueRanking = ({ data }) => {
  if (!data || data.length === 0) {
    return <Typography>리그 데이터가 없습니다.</Typography>;
  }

  // "teams" 데이터 접근을 위한 상위 데이터 구조
  const leagueData = data[0]; // 첫 번째 리그 데이터

  // 순위 변화 상태를 나타내는 아이콘 컴포넌트
  const renderRankStatusIcon = (rankStatus) => {
    switch (rankStatus) {
      case 'UP':
        return <ExpandLessIcon style={{ color: 'green' }} />;
      case 'DOWN':
        return <ExpandMoreIcon style={{ color: 'red' }} />;
      case 'SAME':
        return <RemoveIcon style={{ color: 'gray' }} />;
      default:
        return null; // rankStatus가 없을 경우 아무것도 표시하지 않음
    }
  };

  // 최근 경기 폼 렌더링
  const renderRecentForm = (form) => {
    if (!form) return null; // form 값이 없으면 아무것도 표시하지 않음

    return (
      <Box display="flex" gap={0.5}>
        {form.split('').map((result, index) => {
          let color = 'gray'; // 기본: 무승부 (D)
          if (result === 'W') color = 'green'; // 승리
          if (result === 'L') color = 'red'; // 패배

          return (
            <Typography
              key={index}
              style={{
                color: color,
                fontWeight: 'bold', // 폰트 굵게
              }}
            >
              {result}
            </Typography>
          );
        })}
      </Box>
    );
  };

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
                <TableCell>
                  {/* 순위 숫자와 rankStatus 아이콘 표시 */}
                  <Box display="flex" alignItems="center">
                    <Typography variant="body1" style={{ marginRight: 4 }}>
                      {team.rank}
                    </Typography>
                    {renderRankStatusIcon(team.rankStatus)}
                  </Box>
                </TableCell>
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
                <TableCell>
                  {/* 최근 경기 폼 표시 */}
                  {renderRecentForm(team.form)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default LeagueRanking;