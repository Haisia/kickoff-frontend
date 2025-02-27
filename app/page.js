'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

import Image from "next/image";
import styles from "./page.module.css";
import { Button } from "@mui/material";
import LeagueRankingContainer from "@/components/leagueRankingContainer";
import ScheduleContainer from "@/components/scheduleContainer";
import InPlayContainer from "@/components/inPlayContainer";

let stompClient = null; // WebSocket 클라이언트 전역 변수

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리
  const [message, setMessage] = useState(""); // 인풋 박스 메시지 상태

  useEffect(() => {
    const token = localStorage.getItem('jwt-token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwt-token');
    setIsLoggedIn(false);
    alert('로그아웃 되었습니다.');
  };

  const handleAttendance = async () => {
    try {
      const token = localStorage.getItem('jwt-token');
      if (!token) {
        alert('로그인이 필요합니다.');
        return;
      }

      const response = await axios.post(
        'http://localhost:8080/members/attendance',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert(response.data.message || '출석체크가 성공적으로 완료되었습니다.');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        alert(error.response.data.message || '출석체크를 실패하였습니다.');
      } else {
        alert('출석체크 중 문제가 발생했습니다. 나중에 다시 시도해주세요.');
      }
    }
  };

  useEffect(() => {
    const socket = new SockJS(`http://localhost:8083/ws-chat`); // WebSocket 주소
    stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      console.log("WebSocket Connected!");

      // 연결 후 구독 설정
      stompClient.subscribe("/sub/some-topic", (message) => {
        console.log("Received message:", message.body);
      });
    });

    return () => {
      if (stompClient) stompClient.disconnect(); // 연결 해제
    };
  }, []);

  const sendMessage = () => {
    if (stompClient && stompClient.connected) {
      stompClient.send(
        "/pub/chat/fixture/live/send", // 서버에서 처리할 경로
        {Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMGQzNjRlZS1iNjNlLTQ2YzktODEyNS1kMWE0YzVhNWQ2OTEiLCJpc3MiOiJtZW1iZXJzaGlwLXNlcnZpY2UiLCJpYXQiOjE3NDA2MzUxMjYsImV4cCI6MTc0MDYzODcyNn0.XuFbzEx-2NdfYUEYrDS9CtPxyrfbeOo_Pp9tF7dTkr4"}, // 헤더
        JSON.stringify({
          fixtureId: "616fa82b-f226-4ddf-ac0d-14e993c4dad0",
          message: message,
        }) // 메시지 본문
      );
      console.log("Sent message:", message);
      setMessage(""); // 메시지 초기화
    } else {
      console.error("WebSocket is not connected.");
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <InPlayContainer></InPlayContainer>
        <ScheduleContainer></ScheduleContainer>
        <LeagueRankingContainer></LeagueRankingContainer>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol>
          <li>
            Get started by editing <code>app/page.js</code>.
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className={styles.ctas}>
          {/* 로그인 상태에 따라 버튼 표시: 회원가입/로그인 버튼 */}
          {!isLoggedIn && ( // 로그아웃 상태에서만 표시
            <>
              <a
                className={styles.primary}
                href="/members/signup"
                rel="noopener noreferrer"
              >
                회원가입
              </a>
              <a
                className={styles.secondary}
                href="/members/login"
                rel="noopener noreferrer"
              >
                로그인
              </a>
            </>
          )}

          {/* 로그인 상태에서만 로그아웃 버튼 표시 */}
          {isLoggedIn && (
            <Button
              className={styles.secondary}
              onClick={handleLogout}
            >
              로그아웃
            </Button>
          )}

          <Button
            className={styles.secondary}
            onClick={handleAttendance}
          >
            출석체크
          </Button>
        </div>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>

      {/* 인풋 박스 및 전송 버튼 */}
      <div className={styles.messageBox}>
        <input
          type="text"
          value={message}
          placeholder="메시지를 입력하세요"
          onChange={(e) => setMessage(e.target.value)}
          className={styles.input}
        />
        <button onClick={sendMessage} className={styles.sendButton}>
          전송
        </button>
      </div>
    </div>
  );
}
