"use client";

import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    const socket = new SockJS(`http://localhost:8083/ws-chat`);
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

  const sendMessage = () => {
    if (message.trim() === "") return; // 메시지가 공백일 경우 전송하지 않음
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && message.trim() !== "") {
      sendMessage();
    }
  };

  return (
    <div className={styles.chatContainer}>
      <h3>채팅</h3>
      <div className={styles.chatLog}>
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
          onKeyDown={handleKeyDown} // Enter 키 이벤트 처리 추가
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