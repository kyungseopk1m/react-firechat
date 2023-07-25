import React, { useEffect, useState, useRef } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { firebaseConfig } from "@lib/firebase";
import { useFirestoreQuery } from "@frontend"

const Channel = ({ id = null }) => {
  // firebase initialize
  firebase.initializeApp(firebaseConfig);
  // get firestore from my firebase app
  const db = firebase.firestore();

  // firestore 에서 해당 채널 id의 컬렉션 가져옴. 없으면 새로 생성됨. (여기서 채널은 채팅방을 의미)
  const messagesRef = db.collection(`messages-${id}`);
  // hooks.js 에서 작성한 useFirestoreQuery 로 도큐먼트 가져옴
  const messages = useFirestoreQuery(
    messagesRef.orderBy("createdAt", "desc").limit(1000)
  );

  // 채팅 메세지 생성시 useState로 새로운 메세지 저장
  const [newMessage, setNewMessage] = useState("");

  // input 필드 포커싱과 하단 스크롤을 위한 useRef
  const inputRef = useRef();
  const bottomListRef = useRef();

  // 채팅 작성했을 때 onChanghandler, onSubmitHandler
  const handleOnChange = (e) => {
    // 추후에 내용 작성
  }

  const handleOnSubmit = async (e) => {
    // 추후에 내용 작성
  }

}