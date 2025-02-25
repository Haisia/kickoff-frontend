"use client";

import React, { useState, useEffect } from "react";

const CommentSection = ({ leagueId, year, fixtureId }) => {
  const [comment, setComment] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwt-token");
    setIsLoggedIn(!!token); // 로그인 여부 확인
  }, []);

  const handleCommentSubmit = async () => {
    const token = localStorage.getItem("jwt-token");

    if (!token) {
      alert("로그인이 필요합니다."); // 비로그인 상태 경고
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8082/matches/fixture/comment/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // 인증 토큰 포함
          },
          body: JSON.stringify({
            leagueId,
            year,
            fixtureId,
            comment,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("댓글 작성에 실패했습니다.");
      }

      alert("댓글이 작성되었습니다!");
      setComment(""); // 댓글 인풋 초기화
    } catch (error) {
      alert(`댓글 작성 중 오류가 발생했습니다: ${error.message}`);
    }
  };

  return (
    <div style={{ marginTop: "40px" }}>
      <h2>댓글 작성</h2>
      {!isLoggedIn ? (
        <div>
          <p style={{ color: "red" }}>먼저 로그인해주세요.</p>
          <textarea
            disabled
            style={{
              width: "100%",
              marginTop: "10px",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
              resize: "none",
            }}
            placeholder="댓글을 작성하려면 로그인하세요."
          />
        </div>
      ) : (
        <div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{
              width: "100%",
              marginTop: "10px",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
              resize: "none",
            }}
            placeholder="댓글을 입력하세요."
          />
          <button
            onClick={handleCommentSubmit}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              backgroundColor: "#006400",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            댓글 작성
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentSection;