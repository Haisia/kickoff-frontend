"use client";

import React, { useState, useEffect } from "react";

const CommentSection = ({ leagueId, year, fixtureId }) => {
  const [commentList, setCommentList] = useState([]); // 댓글 목록 상태
  const [comment, setComment] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태

  // 로그인 여부 확인 및 초기 댓글 목록 로드
  useEffect(() => {
    const token = localStorage.getItem("jwt-token");
    setIsLoggedIn(!!token);
    fetchComments(); // 댓글 목록 초기 로드
  }, []);

  // 댓글 목록 가져오기 함수
  const fetchComments = async () => {
    setIsLoading(true); // 로딩 시작
    try {
      const response = await fetch("http://localhost:8082/matches/fixture/comment/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fixtureId,
        }),
      });

      if (!response.ok) {
        throw new Error("댓글 목록을 가져오는데 실패했습니다.");
      }

      const data = await response.json();
      setCommentList(data.response || []); // 댓글 목록 업데이트
    } catch (error) {
      alert(`댓글 목록을 불러오는 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  // 댓글 작성 함수
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
      fetchComments(); // 댓글 목록 새로고침
    } catch (error) {
      alert(`댓글 작성 중 오류가 발생했습니다: ${error.message}`);
    }
  };

  return (
    <div style={{ marginTop: "40px" }}>
      {/* 댓글 목록 섹션 */}
      <h2>댓글 목록</h2>
      {isLoading ? (
        <p>로딩 중...</p>
      ) : (
        <div
          style={{
            margin: "20px 0",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            backgroundColor: "#f9f9f9",
          }}
        >
          {commentList.length === 0 ? (
            <p style={{ textAlign: "center", color: "#555" }}>댓글이 없습니다.</p>
          ) : (
            commentList.map((commentItem, index) => (
              <div
                key={commentItem.fixtureCommentId}
                style={{
                  marginBottom: index === commentList.length - 1 ? "0" : "10px", // 마지막 줄 제외
                  paddingBottom: "10px",
                  borderBottom: index === commentList.length - 1 ? "none" : "1px solid #ddd",
                }}
              >
                <p style={{ fontSize: "12px", color: "#555", margin: 0 }}>
                  {commentItem.createdByEmail}
                </p>
                <p style={{ margin: "5px 0", fontSize: "14px" }}>{commentItem.comment}</p>
                <p style={{ fontSize: "12px", color: "#888", margin: 0 }}>
                  {new Date(commentItem.createdAt).toLocaleString("ko-KR")}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {/* 댓글 작성 섹션 */}
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