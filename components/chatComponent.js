"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import styles from "./chatComponent.module.css";

let stompClient = null; // WebSocket 클라이언트 전역 변수
const jwtToken = localStorage.getItem("jwt-token");

const ChatComponent = () => {
  const [message, setMessage] = useState(""); // 현재 입력 메시지 상태
  const [isConnected, setIsConnected] = useState(false); // WebSocket 연결 상태
  const [chatLogs, setChatLogs] = useState([]); // 기존 채팅 로그 상태

  // 기존 채팅 로그를 가져오는 함수
  const fetchChatLogs = async () => {
    try {
      const response = await axios.post("http://localhost:8083/chat/fixture/live/message/list", {
        fixtureId: "3dd67f5d-926a-422f-aa94-8463171a9918", // fixtureId를 요청 본문에 전달
      });

      // 서버 응답에서 메시지를 시간순으로 정렬하여 저장
      if (response.status === 200 && response.data.response) {
        const sortedLogs = response.data.response.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)); // 시간순 정렬
        setChatLogs(sortedLogs);
      }
    } catch (error) {
      console.error("Failed to fetch chat logs:", error);
    }
  };

  useEffect(() => {
    // WebSocket 연결 및 기존 로그 가져오기
    const socket = new SockJS(`http://localhost:8083/ws-chat`); // WebSocket 주소
    stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      console.log("WebSocket Connected!");
      setIsConnected(true); // 연결 상태 업데이트

      // WebSocket 연결 후 구독 시작
      stompClient.subscribe("/sub/some-topic", (message) => {
        const receivedMessage = JSON.parse(message.body);
        console.log("Received message:", receivedMessage);

        // 새로운 메시지를 채팅 로그에 추가
        setChatLogs((prevLogs) => [...prevLogs, receivedMessage]);
      });
    });

    // 연결 시점에서 기존 채팅 로그 fetch
    fetchChatLogs();

    // 컴포넌트 unmount 시 연결 해제
    return () => {
      if (stompClient) {
        stompClient.disconnect();
        setIsConnected(false);
        console.log("WebSocket Disconnected");
      }
    };
  }, []); // 빈 배열을 전달하여 컴포넌트 처음 렌더링 시 1회만 실행

  const sendMessage = () => {
    if (stompClient && stompClient.connected) {
      stompClient.send(
        "/pub/chat/fixture/live/message/send", // 서버에서 처리할 경로
        {},
        JSON.stringify({
          jwtToken: jwtToken,
          fixtureId: "3dd67f5d-926a-422f-aa94-8463171a9918", // 동일한 fixtureId
          message: message,
        })
      );
      console.log("Sent message:", message);
      setMessage(""); // 메시지 초기화
    } else {
      console.error("WebSocket is not connected.");
    }
  };

  return (
    <div className={styles.chatContainer}>
      <h3>채팅</h3>
      <div className={styles.chatLog}>
        {/* 채팅 로그를 시간 순으로 표시 */}
        {chatLogs.map((log, index) => (
          <div key={index} className={styles.chatMessage}>
            <strong>{log.nickname}:</strong> {log.message} <span className={styles.timestamp}>{new Date(log.timestamp).toLocaleString()}</span>
          </div>
        ))}
      </div>
      <div className={styles.messageBox}>
        <input
          type="text"
          value={message}
          placeholder="메시지를 입력하세요"
          onChange={(e) => setMessage(e.target.value)}
          className={styles.input}
        />
        <button onClick={sendMessage} className={styles.sendButton} disabled={!isConnected}>
          전송
        </button>
      </div>
      {!isConnected && <p className={styles.connectionStatus}>WebSocket 연결 중...</p>}
    </div>
  );
};

export default ChatComponent;