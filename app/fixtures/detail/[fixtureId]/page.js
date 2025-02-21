"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

async function fetchFixtureDetail(fixtureId) {
  const response = await fetch(
    `http://localhost:8082/matches/fixture/${fixtureId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch fixture details");
  }

  const data = await response.json();
  return data.response[0]; // 첫 번째 경기 데이터 반환
}

const FixtureDetail = () => {
  const { fixtureId } = useParams(); // useParams()로 가져오기
  const [fixture, setFixture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!fixtureId) return; // fixtureId가 없는 경우 방어 처리

    const getFixtureData = async () => {
      try {
        const data = await fetchFixtureDetail(fixtureId);
        setFixture(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getFixtureData();
  }, [fixtureId]);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>데이터를 가져오는 중 오류가 발생했습니다: {error}</p>;
  if (!fixture) return <p>경기 데이터를 찾을 수 없습니다.</p>;

  const fullTimeScore = fixture.fullTimeScore || { home: "-", away: "-" }; // fullTimeScore의 기본값 설정

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
            {fullTimeScore.home} - {fullTimeScore.away} {/* 안전한 접근 */}
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
    </div>
  );
};

export default FixtureDetail;