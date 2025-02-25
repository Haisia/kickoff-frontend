"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

async function fetchFixtureDetail(leagueId, year, fixtureId) {
  const response = await fetch(`http://localhost:8082/matches/fixture/get`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      leagueId,
      year,
      fixtureId
    }), // 요청 본문에 `LeagueFixtureQuery` 데이터를 포함
  });

  if (!response.ok) {
    throw new Error("Failed to fetch fixture details");
  }

  const data = await response.json();
  return data.response[0]; // 첫 번째 경기 데이터 반환
}

async function fetchHeadToHead(leagueId, year, fixtureId) {
  const response = await fetch(
    `http://localhost:8082/matches/fixture/head-to-head/simple/list`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        leagueId,
        year,
        fixtureId
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch head-to-head data");
  }

  const data = await response.json();
  return data.response; // Head-to-Head 데이터 반환
}

const FixtureDetail = () => {
  const { leagueId, year, fixtureId } = useParams(); // 동적 라우팅에서 leagueId, year, fixtureId 가져오기
  const [fixture, setFixture] = useState(null);
  const [headToHeadData, setHeadToHeadData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!leagueId || !year || !fixtureId) return;

    const getFixtureData = async () => {
      try {
        const fixtureData = await fetchFixtureDetail(leagueId, year, fixtureId);
        setFixture(fixtureData);

        // Head-to-Head 정보 가져오기
        const h2hData = await fetchHeadToHead(leagueId, year, fixtureId);

        // 정렬: 날짜 기준으로 오름차순 (가장 오래된 경기 순으로)
        const sortedH2hData = h2hData.sort((a, b) => {
          return new Date(a.fixtureDateTime.date) - new Date(b.fixtureDateTime.date);
        });

        setHeadToHeadData(sortedH2hData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getFixtureData();
  }, [leagueId, year, fixtureId]);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>데이터를 가져오는 중 오류가 발생했습니다: {error}</p>;
  if (!fixture) return <p>경기 데이터를 찾을 수 없습니다.</p>;

  // fullTimeScore 기본값 처리
  const fullTimeScore = fixture.fullTimeScore || { home: "-", away: "-" };

  // WDL 색상 스타일 정의 (W: 초록색, D: 회색, L: 붉은색)
  const getResultStyle = (result) => {
    if (result === "W") return { color: "#006400", fontWeight: "bold" }; // 진한 초록색
    if (result === "D") return { color: "#808080", fontWeight: "bold" }; // 회색
    if (result === "L") return { color: "#FF0000", fontWeight: "bold" }; // 붉은색
  };

  return (
    <div
      style={{
        margin: "20px auto",
        maxWidth: "800px",
        padding: "20px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        border: "1px solid #ddd",
        backgroundColor: "#fff",
        fontFamily: "Arial",
      }}
    >
      <h1
        style={{
          fontSize: "32px",
          marginBottom: "40px",
          textAlign: "center",
        }}
      >
        경기 상세 정보
      </h1>
      <div style={{ marginTop: "40px" }}>
        <p>
          <strong>경기장:</strong> {fixture.venue?.name || "정보 없음"},{" "}
          {fixture.venue?.city || "정보 없음"}
        </p>
        <p>
          <strong>심판:</strong> {fixture.referee || "정보 없음"}
        </p>
        <p>
          <strong>경기 시작:</strong>{" "}
          {new Date(fixture.fixtureDateTime.date).toLocaleString("ko-KR")}
        </p>
        <p>
          <strong>경기 상태:</strong> {fixture.fixtureStatus?.description || ""}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "40px 0",
        }}
      >
        <div style={{ textAlign: "center", marginRight: "50px" }}>
          <img
            src={fixture.homeTeam?.logo || ""}
            alt={`${fixture.homeTeam?.name || "홈팀"} 로고`}
            style={{
              width: "150px",
              height: "150px",
              objectFit: "contain",
            }}
          />
          <h3>{fixture.homeTeam?.name || "홈팀"}</h3>
          <p>{fixture.homeTeam?.code || ""}</p>
        </div>

        <div
          style={{
            textAlign: "center",
            marginLeft: "50px",
            marginRight: "50px",
          }}
        >
          <h2>VS</h2>
          <div
            style={{
              fontSize: "64px",
              fontWeight: "bold",
            }}
          >
            {fullTimeScore?.home ?? "-"} - {fullTimeScore?.away ?? "-"}
          </div>
        </div>

        <div style={{ textAlign: "center", marginLeft: "50px" }}>
          <img
            src={fixture.awayTeam?.logo || ""}
            alt={`${fixture.awayTeam?.name || "원정팀"} 로고`}
            style={{
              width: "150px",
              height: "150px",
              objectFit: "contain",
            }}
          />
          <h3>{fixture.awayTeam?.name || "원정팀"}</h3>
          <p>{fixture.awayTeam?.code || ""}</p>
        </div>
      </div>

      <h2 style={{ marginTop: "40px" }}>Head-to-Head</h2>
      {headToHeadData.length > 0 ? (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>날짜</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                {fixture.homeTeam?.name || "홈팀"}
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                {fixture.awayTeam?.name || "원정팀"}
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>경기장</th>
            </tr>
          </thead>
          <tbody>
            {headToHeadData.map((h2h, index) => (
              <tr key={h2h.fixtureId || `row-${index}`}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {new Date(h2h.fixtureDateTime.date).toLocaleDateString("ko-KR")}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {h2h.fullTimeScore?.home ?? "-"}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {h2h.fullTimeScore?.away ?? "-"}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {h2h.venue?.name || "정보 없음"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Head-to-Head 데이터를 찾을 수 없습니다.</p>
      )}
    </div>
  );
};

export default FixtureDetail;