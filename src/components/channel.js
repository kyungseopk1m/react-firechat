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

  // 포커싱과 하단 스크롤을 위한 useRef
  const inputRef = useRef();
  const bottomListRef = useRef();

  // 채팅 작성했을 때 onChanghandler, onSubmitHandler
  const handleOnChange = (e) => {
    setNewMessage(e.target.value);
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    // 입력한 채팅 공백 제거
    const trimmedMessage = newMessage.trim();
    if (trimmedMessage) {
      // Add new message in Firestore
      messagesRef.add({
        text: trimmedMessage,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid: currentUser?.id,
        displayName: currentUser?.name,
        photoURL: currentUser?.image,
        isRead: false,
      });

      // Clear input field
      setNewMessage("");
      // Scroll down to the bottom of the list
      bottomListRef.current.scrollIntoView({ behavior: "smooth" });
    }
    
    // 그 외, useRef 활용한 모션들
    useEffect(() => {
      if (inputRef.current) {
        // 인풋 포커싱
        inputRef.current.focus();
      }
    }, [inputRef]);
    
    // 첫 화면 하단 스크롤
    useEffect(() => {
      if (bottomListRef.current) {
        bottomListRef.current.scrollIntoView({ behavior: "smooth" });
      }
      // messagesRef 업데이트가 될 때마다 읽음/안읽음 표시 업데이트 할 수 있음.

    }, [messagesRef]);
  }


  return(
    <div className="flex flex-col h-full">
        <div className="overflow-auto h-full">
          <div className="py-4 max-w-screen-lg mx-auto">
            <ul>
              {messages
                ?.sort((first, second) =>
                  first?.createdAt?.seconds <= second?.createdAt?.seconds
                    ? -1
                    : 1
                )
                ?.map((message) => (
                  <li key={message.id}>
                    {/* 추후 Message 컴포넌트 생성해서 채팅 내용 표시 */}
                    <Message {...message} />
                  </li>
                ))}
            </ul>
            <div ref={bottomListRef} className="mb-16" />
          </div>
        </div>
      </div>
  
      {/* 채팅 입력 폼 생성 */}
       <div className="w-full z-20 pb-safe bottom-0 fixed md:max-w-xl p-4 bg-gray-50">
        <form onSubmit={handleOnSubmit} className="flex">
           <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={handleOnChange}
              placeholder="메세지를 입력하세요"
              className="border rounded-full px-4 h-10 flex-1 mr-1 ml-1"
           />
          <button
            type="submit"
            disabled={!(newMessage)}
            className="rounded-full bg-red-400 h-10 w-10"
          >
            <BiSend className="text-white text-xl w-10" />
          </button>
        </form>
      </div>
    );

}