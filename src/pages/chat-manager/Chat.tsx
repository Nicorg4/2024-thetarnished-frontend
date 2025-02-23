import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import "./Chat.css";
import { useAuth } from "../../auth/useAuth";
import styled from "styled-components";
import { Button } from "../../components/main-button/components";
import { InteractionBlocker } from "../../components/interaction-blocker/components";
import { AnimatedLoadingLogo } from "../../components/animated-loading-logo/components";
import SimplifiedLogo from "../../assets/Logo transparent.png";
import colors from "../../assets/colors";
import { RiCloseLargeFill } from "react-icons/ri";
import avatars from "../../assets/avatars/avatars";
import { FaPaperclip } from "react-icons/fa";
import { PopUp, PopUpContainer } from "../../components/popup/components";
import { Message } from "../../components/message/components";
import { CiFileOn } from "react-icons/ci";
import { DownloadButtonContainer } from "../upload-notes/components";


interface Message {
  id: string;
  message: string;
  timestamp: Date; 
  studentId: string;
  teacherId: string;
  roomId: string;
  sender: string;
  fileid: string;
}
const SOCKET = import.meta.env.VITE_API_SOCKET;
const socket: Socket = io(`${SOCKET}`, {
  transports: ["websocket"],
  secure: true,
});

const Chat: React.FC<{ teacherId: string; studentId: string; closeChat: () => void }> = ({ teacherId, studentId, closeChat }) => {  
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [role, setRole] = useState("");
  const [studentName, setStudentName] = useState<string>("");
  const [teacherName, setTeacherName] = useState<string>("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [studentAvatar, setStudentAvatar] = useState(1);
  const [teacherAvatar, setTeacherAvatar] = useState(1);
  const {user} = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [uploadFilePopUpOpen ,setUploadFilePopUpOpen] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const URL = import.meta.env.VITE_API_URL;

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };
  
  useEffect(() => {
    if (user?.role) {
      setRole(user.role);
    }
    const fetchStudentName = async (id: string) => {
      try {
        const response = await fetch(
          `${URL}students/${id}`
        , { 
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${user?.token}`,
            'ngrok-skip-browser-warning': 'true',
          },
        });
        const student = await response.json();
        setStudentName(student.firstname +" "+ student.lastname);
        setStudentAvatar(student.avatar_id)
      } catch (error) {
        console.error("Error fetching student name:", error);
      }
    };
  
    const fetchTeacherName = async (id: string) => {
      try {
        const response = await fetch(
          `${URL}teachers/${id}`
          , {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              'Authorization': `Bearer ${user?.token}`,
              'ngrok-skip-browser-warning': 'true',
            },
          });
        const teacher = await response.json();
        setTeacherName(teacher.firstname +" "+ teacher.lastname);
        setTeacherAvatar(teacher.avatar_id);
  
      } catch (error) {
        console.error("Error fetching teacher name:", error);
      }
    };
    if (studentId && teacherId) {
      fetchStudentName(studentId);
      fetchTeacherName(teacherId);
    }
    scrollToBottom();
  }, [user, messages, studentId, teacherId, URL]);


  useEffect(() => {
    if (studentId && teacherId) {
      socket.emit("joinRoom", { studentId, teacherId });
      socket.on("messageHistory", (history: Message[]) => {
        const filteredHistory = history.filter(
          (msg) => msg.message && msg.message.trim() !== ""
        );
        setMessages(filteredHistory);
        setIsLoading(false);
        scrollToBottom();
      });

      socket.on("message", (newMessage: Message) => {
        if (newMessage.message && newMessage.message.trim() !== "") {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
          scrollToBottom();
        }
      });
    }
    return () => {
      socket.off("message");
      socket.off("messageHistory");
    };
  }, [studentId, teacherId]);

  const sendMessage = () => {
    if (message.trim() !== "") {
      const newMessage = {
        message,
        studentId: studentId!,
        teacherId: teacherId!,
        roomId: `${studentId}-${teacherId}`,
        sender: role === "STUDENT" ? studentId! : teacherId!,
      };
      socket.emit("sendMessage", newMessage);
      setMessage("");
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleCloseChat = () => {
    closeChat();
  };

  const handleUploadFilePopUpOpen = () =>{
    setUploadFilePopUpOpen(true);
  }

  const handleFilePopupClose = () => {
    setSelectedFile(null);
    setUploadFilePopUpOpen(false);
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!selectedFile) {
      setMessage("No file selected");
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 3000);
      return;
    }
  
    setIsUploading(true);
  
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
  
      const response = await fetch(`${URL}files/upload-from-chat`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'ngrok-skip-browser-warning': 'true'
        },
        body: formData,
      });
  
      if (!response.ok) {
        setMessage("Failed to upload file");
        throw new Error("Failed to upload file");
      }
  
      const fileData = await response.json();
      const fileid = fileData.id;
  
      const newMessage = {
        message: `${selectedFile.name}`,
        studentId: studentId!,
        teacherId: teacherId!,
        roomId: `${studentId}-${teacherId}`,
        sender: role === "STUDENT" ? studentId! : teacherId!,
        fileid,
      };
  
      socket.emit("sendMessage", newMessage);
      setUploadFilePopUpOpen(false);
    } catch (error) {
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 3000);
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleFileDownload = (fileId: string, fileName: string) => async () => {
    try {
      const response = await fetch(`${URL}files/download/${fileId}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      });
      if (!response.ok) {
        throw new Error("Failed to download file");
      }
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };
  

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file && file.type !== "application/pdf") {
      return;
    }
    setSelectedFile(file);
  };

  return (
    <>
    {showErrorMessage && <Message error>{message}</Message>}
      {uploadFilePopUpOpen &&
        <PopUpContainer>
            <PopUp>
            <Title>Select a pdf file.</Title>
              <UploadForm onSubmit={handleFileUpload}>
                <FileInput
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
                <DownloadButtonContainer>
                  <Button type="submit">
                    {isUploading ? <AnimatedLoadingLogo src={SimplifiedLogo} alt="Loading..." /> : "Upload"}
                  </Button>
                  <Button secondary onClick={handleFilePopupClose}>
                    Cancel
                  </Button>
                </DownloadButtonContainer>
              </UploadForm>
            </PopUp>
        </PopUpContainer>
      }
    <MainContainer isPopupOpen={uploadFilePopUpOpen}>
        {isLoading ? (<InteractionBlocker><AnimatedLoadingLogo src={SimplifiedLogo}/></InteractionBlocker>) : (
        <Content>        
        <div className="chat-container">
          <div className="sender-name">
            <UserImage src={(role === "TEACHER") ? avatars[studentAvatar - 1].src : avatars[teacherAvatar - 1].src} alt="User Image" />
            {role === "STUDENT" ? teacherName : studentName}<CloseButton onClick={handleCloseChat}><RiCloseLargeFill/></CloseButton></div>
          <div className="message-history" ref={chatContainerRef}>
          {messages.map((msg, index) => {
            const isSender =
              role === "STUDENT"
                ? String(msg.sender) === String(studentId)
                : String(msg.sender) === String(teacherId);
  
            const currentDate = new Date(msg.timestamp).toDateString();
            const previousDate =
              index > 0 ? new Date(messages[index - 1].timestamp).toDateString() : null;
  
            let dateSeparator = null;
            const today = new Date().toDateString();
            const dateLabel = currentDate === today ? "Today" : currentDate;
  
            if (currentDate !== previousDate) {
              const serverMessage = {
                id: `server-${index}`,
                message: ` ${dateLabel}`,
                timestamp: new Date(msg.timestamp), 
                sender: "server",
              };
  
              dateSeparator = (
                <div key={`server-msg-${index}`} className="server-message">
                  <p className="server-message-text">
                    {serverMessage.message}
                  </p>
                </div>
              );
            }
  
            const time = new Date(msg.timestamp);
            const formattedTimestamp = `${String(time.getHours()).padStart(
              2,
              "0"
            )}:${String(time.getMinutes()).padStart(2, "0")}`;
  
            return (
              <React.Fragment key={index}>
                {dateSeparator}
                <p style={{position:'relative'}} className={isSender ? "sender-message" : "other-message"}>
                  {msg.fileid ? (
                    <span
                      onClick={handleFileDownload(msg.fileid, msg.message)}
                      style={{ color: isSender ? "#4453aa" : '#61ced8', textDecoration: "underline", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", position:'absolute' }}
                    >
                      <CiFileOn style={{fontSize:'2.5rem'}}/>{msg.message}
                    </span>
                  ) : (
                    msg.message
                  )}
                  <br />
                  <em
                    style={{
                      fontSize: "0.85em",
                      color: "#fff",
                      textAlign: "right",
                      display: "block",
                    }}
                  >
                    {formattedTimestamp}
                  </em>
                </p>
              </React.Fragment>
            );
            
          })}
        </div>
        <BottomBarContainer>
          <div className="chat-input">
            <Input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              placeholder="Type a message"
            />
          </div>
          <FileButton onClick={handleUploadFilePopUpOpen}><FaPaperclip /></FileButton>
          <SendButton onClick={sendMessage}>Send</SendButton>
        </BottomBarContainer>
        </div>
      </Content>

      )}
    </MainContainer>
    </>
  );
};

interface MainContainerProps {
  isPopupOpen: boolean;
}


const MainContainer =  styled.div<MainContainerProps>`
    height: 100vh ;
    width: 100vw ;
    display: flex;
    align-items: center ;
    background: rgb(43,84,52);
    background: radial-gradient(circle, rgba(43,84,52,1) 0%, rgba(15,41,46,1) 92%);

    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999;
        opacity: ${({ isPopupOpen }) => (isPopupOpen ? 1 : 0)};
        transition: opacity 0.3s ease;
        pointer-events: none;
        backdrop-filter: blur(5px);      
    }
`

const Content = styled.div`
    width: 100% ;
    height: 100% ;
    display: flex ;
    flex-direction: column;
    align-items: center ;
    justify-content: center;
`

const CloseButton = styled.button`
    background-color: transparent;
    color: ${colors.primary};
    font-size: 1.4rem;
    border: none;
    position: absolute;
    top: 5px;
    right: 10px;

    &:hover {
        opacity: 0.7;
        background-color: transparent ;
    }
`

const UserImage = styled.img`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 2px solid ${colors.primary};
`

const BottomBarContainer = styled.div`
  display: flex;
  width: 95%;
  margin: auto;
  margin-bottom: 15px;
  justify-content: center;
  align-items: center;
`
const SendButton = styled(Button)`
  background-color: ${colors.primary};
  height: 100%;
  border-radius: 0 30px 30px 0;
  display: flex;
  text-align: center;
`

const FileButton = styled(Button)`
  background-color: ${colors.primary};
  height: 100%;
  border-radius: 0;
  display: flex;
  text-align: center;
`

const Input = styled.input`
  flex-grow: 1;
  padding-left: 15px;
  border-radius: 5px;
  color: #3e7d44;
  font-size: 1rem;
  border: none;
  margin-right: 10px;
  box-sizing: border-box;
  background-color: transparent;

  &:focus {
    outline: none;
  }
`

const Title = styled.h2`
    font-size: 1.2rem;
    font-weight: 400;
    margin: 0;
    color: ${colors.primary};

    @media (max-width: 1100px){
        font-size: 1rem;
    }
    @media (max-width: 900px){
        font-size: 0.8rem;
    }
`;

const UploadForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  max-width: 500px;
  background-color: ${colors.secondary};
  border-radius: 10px;
`;

const FileInput = styled.input`
  padding: 10px 15px;
  margin-top: 20px;
  border: 1px solid ${colors.primary};
  border-radius: 5px;
  font-size: 16px;
  color: ${colors.text};
  background-color: ${colors.secondary};
  transition: border 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }
`;

export default Chat;
