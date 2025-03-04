"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import styles from "./chatComponent.module.css";

let stompClient = null;
const jwtToken = localStorage.getItem("jwt-token");

const ChatComponent = () => {
  const [message, setMessage] = useState(""); // 현재 입력 메시지 상태
  const [isConnected, setIsConnected] = useState(false); // WebSocket 연결 상태
  const [chatLogs, setChatLogs] = useState([]); // 기존 채팅 로그 상태
  const chatLogRef = useRef(null); // 채팅 로그 DOM 참조
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true); // 현재 스크롤이 맨 아래인지 상태 저장

  // 채팅 로그 데이터를 가져오는 함수
  const fetchChatLogs = async () => {
    try {
      const response = await axios.post("http://localhost:8083/chat/general/live/message/list");

      if (response.status === 200 && response.data.response) {
        const sortedLogs = response.data.response.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setChatLogs(sortedLogs);
      }
    } catch (error) {
      console.error("Failed to fetch chat logs:", error);
    }
  };

  // 컴포넌트 실행 시 WebSocket 연결 및 채팅 로그 fetch
  useEffect(() => {
    const socket = new SockJS("http://localhost:8083/ws-chat");
    stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      console.log("WebSocket Connected!");
      setIsConnected(true);

      stompClient.subscribe("/sub/general-live-chat", (message) => {
        const receivedMessage = JSON.parse(message.body);
        console.log("Received message:", receivedMessage);

        setChatLogs((prevLogs) => [...prevLogs, receivedMessage]);
      });
    });

    fetchChatLogs();

    return () => {
      if (stompClient) {
        stompClient.disconnect();
        setIsConnected(false);
        console.log("WebSocket Disconnected");
      }
    };
  }, []);

  // 새 메시지가 추가될 때 동작: 스크롤이 맨 아래 상태일 경우 자동으로 맨 아래로 이동
  useEffect(() => {
    const chatLogElement = chatLogRef.current;

    if (!chatLogElement) return;

    // 스크롤이 맨 아래 상태인 경우에만 스크롤 맨 아래로 이동
    if (isScrolledToBottom) {
      chatLogElement.scrollTop = chatLogElement.scrollHeight;
    }
  }, [chatLogs]); // chatLogs가 바뀔 때 실행

  // 사용자가 스크롤 할 때 맨 아래 상태인지 체크하는 이벤트 핸들러
  const handleScroll = () => {
    const chatLogElement = chatLogRef.current;

    if (!chatLogElement) return;

    // 현재 스크롤이 맨 아래인지 계산 (부동소수점 차이를 허용)
    const isAtBottom =
      Math.abs(chatLogElement.scrollHeight - chatLogElement.scrollTop - chatLogElement.clientHeight) < 1;

    setIsScrolledToBottom(isAtBottom);
  };

  // 메시지 전송 함수
  const sendMessage = () => {
    if (message.trim() === "") return;

    if (stompClient && stompClient.connected) {
      stompClient.send(
        "/pub/chat/general/live/message/send",
        {},
        JSON.stringify({
          jwtToken: jwtToken,
          message: message,
        })
      );
      console.log("Sent message:", message);
      setMessage("");
    } else {
      console.error("WebSocket is not connected.");
    }
  };

  // Enter 키 핸들러
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && message.trim() !== "") {
      sendMessage();
    }
  };

  // 렌더링 후 초기 스크롤을 맨 아래로 이동
  useEffect(() => {
    const chatLogElement = chatLogRef.current;

    if (chatLogElement) {
      chatLogElement.scrollTop = chatLogElement.scrollHeight;
    }
  }, []);

  return (
    <div className={styles.chatContainer}>
      <h3>채팅</h3>
      <div
        className={styles.chatLog}
        ref={chatLogRef}
        onScroll={handleScroll} // 스크롤 감지 이벤트 추가
      >
        {chatLogs.map((log, index) => (
          <div key={index} className={styles.chatMessage}>
            <strong>{log.nickname}:</strong> {log.message}{" "}
            <span className={styles.timestamp}>
              {new Date(log.timestamp).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
      <div className={styles.messageBox}>
        <input
          type="text"
          value={message}
          placeholder="메시지를 입력하세요"
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
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