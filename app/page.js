"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import { Button } from "@mui/material";
import dynamic from "next/dynamic";
import LeagueRankingContainer from "@/components/leagueRankingContainer";
import ScheduleContainer from "@/components/scheduleContainer";
import InPlayContainer from "@/components/inPlayContainer";

// ChatComponent를 동적 로드로 처리. SSR 비활성화
const ChatComponent = dynamic(() => import("@/components/chatComponent"), {
  ssr: false,
});

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") { // 브라우저 환경인지 확인
      const token = localStorage.getItem("jwt-token");
      setIsLoggedIn(!!token);
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("jwt-token");
    }
    setIsLoggedIn(false);
    alert("로그아웃 되었습니다.");
  };

  const handleAttendance = async () => {
    // 기존 로직 유지
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <InPlayContainer />
        <ScheduleContainer />
        <LeagueRankingContainer />
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
          {!isLoggedIn && (
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
          {isLoggedIn && (
            <Button className={styles.secondary} onClick={handleLogout}>
              로그아웃
            </Button>
          )}
          <Button className={styles.secondary} onClick={handleAttendance}>
            출석체크
          </Button>
        </div>
        {/* 채팅 컴포넌트를 이곳에 추가 */}
        <ChatComponent />
      </main>
      <footer className={styles.footer}>
        {/* 기존 푸터 */}
      </footer>
    </div>
  );
}