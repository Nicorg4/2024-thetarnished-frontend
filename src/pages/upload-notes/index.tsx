import { useState, useEffect } from "react";
import SideBar from "../../components/sidebar/sidebar";
import Logo from "../../components/top-down-logo";
import Topbar from "../../components/topbar";
import { BrowserWrapper, Card, CardInfo, CardsContainer, CloseButton, Content, DownloadButton, DownloadButtonContainer, EditButton, FileInput, MainContainer, NoSubjectsFound, PageTitle, StaticSkeletonCard, Title, UploadForm } from "./components";
import { useAuth } from "../../auth/useAuth";
import Notification from "../../components/notification";
import TextInput from "../../components/search-input";
import { LiaSchoolSolid } from "react-icons/lia";
import { IoMdDownload } from "react-icons/io";
import { AnimatedLoadingLogo } from "../../components/animated-loading-logo/components";
import SimplifiedLogoAlt from "../../assets/Logo transparent alt.png";
import { motion } from 'framer-motion';
import { PopUp, PopUpContainer } from "../../components/popup/components";
import { RiCloseLargeFill } from "react-icons/ri";
import { Button } from "../../components/main-button/components";
import { FaUnlockAlt, FaLock } from 'react-icons/fa';
import SimplifiedLogo from "../../assets/Logo transparent.png";
import { Message } from "../../components/message/components";
import { LuUpload } from "react-icons/lu";
import { FaUserLock } from "react-icons/fa6";

interface File {
    id: string;
    file_path: string;
    teacher_id: number;
    filename: string;
    mime_type: string;
    size: number;
    created_at: Date;
    url?: string;
  }

interface Student {
    studentid: string;
    firstname: string;
    lastname: string;
    email: string;
}
  

const UploadNotes = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [fileId, setFileId] = useState<string>('');
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [isGranting, setIsGranting] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadFilePopUpOpen ,setUploadFilePopUpOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [activeGranting, setActiveGranting] = useState('');
  const [activeRevoking, setActiveRevoking] = useState('');
  const URL = import.meta.env.VITE_API_URL;

  const fetchFiles = async () => {
    try {
      const res = await fetch(`${URL}files/teacher-files-by/${user?.id}`,{
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token}`,
            'ngrok-skip-browser-warning': 'true',
          },
          
      });
      const data = await res.json();
      setFiles(data.files);
      setLoading(false);
    } catch (error) {
      setFiles([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchFiles();
    }
  }, [user?.id]);

  const handleFileDownload = (fileId: number, fileName: string) => async () => {
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

  const fetchPreviousStudents = async () => {
    setLoadingStudents(true);
    try{
      const response = await fetch(`${URL}teachers/get-previous/${user?.id}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      });
      if(!response.ok){
        throw new Error("Failed to fetch previous students");
      }
      const data = await response.json();
      setStudents(data);
      setLoadingStudents(false);
    }catch(error){
      setLoadingStudents(false);
      console.error("Error fetching previous students:", error);
    }
  }

  const handleOpenGivePermissionsPopUp = (fileId: string) => {
    setIsPopUpOpen(true);
    fetchPreviousStudents();
    setFileId(fileId);
  };

  const truncateText = (text: string, maxLength: number = 50): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const handlePopupClose = () => {
    setFileId('');
    setIsPopUpOpen(false);
  };

  const handleFilePopupClose = () => {
    setSelectedFile(null);
    setUploadFilePopUpOpen(false);
  };

  const filteredSubjects = files.filter(subject =>
        subject.filename.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const numStaticSkeletonCards = 0 /* Math.max(0, 9 - filteredSubjects.length) */;
    const cardsToDisplay = [...filteredSubjects.map(item => item), ...Array(numStaticSkeletonCards).fill(null)];

  const handleGrantAccess = (fileID: string, studentID: string) => async () => {
    setIsGranting(true);
    setActiveGranting(studentID);
    try {
      const response = await fetch(`${URL}files/assign-file/${fileID}/to/${studentID}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      });
      
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || "Failed to grant access");
        throw new Error(data.message || "Failed to grant access"); 
      }

      setIsGranting(false);
      setMessage("Access granted successfully");
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    } catch (error) {
      setIsGranting(false);
      setShowErrorMessage(true);
      setTimeout(() => {
        setShowErrorMessage(false);
      }, 3000);
      console.error("Error granting access:", error);
    }
  };

  const handleRevokeAccess = (fileID: string, studentID: string) => async () => {
    setIsRevoking(true);
    setActiveRevoking(studentID);
    try {
      const response = await fetch(`${URL}files/unassign-file/${fileID}/to/${studentID}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || "Failed to revoke access");
        throw new Error(data.message || "Failed to revoke access"); 
      }
      setIsRevoking(false);
      setMessage("Access revoked successfully");
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    } catch (error) {
      setIsRevoking(false);
      setShowErrorMessage(true);
      setTimeout(() => {
        setShowErrorMessage(false);
      }, 3000);
      console.error("Error revoking access:", error);
    }
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file && file.type !== "application/pdf") {
      return;
    }
    setSelectedFile(file);
  };

  const handleFileUpload = async (e: any) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessage("No file selected");
      setShowErrorMessage(true);
      setTimeout(() => {
        setShowErrorMessage(false);
      }, 3000);
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      if (user?.id) {
        formData.append("teacher_id", user.id.toString());
      }

      const response = await fetch(`${URL}files/upload`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${user?.token}`,
          'ngrok-skip-browser-warning': 'true',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      setIsUploading(false);
      setMessage("File uploaded successfully");
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 3000);
      setUploadFilePopUpOpen(false);
      fetchFiles();
    } catch (error) {
      setIsUploading(false);
      setMessage("Failed to upload file");
      setShowErrorMessage(true);
      setTimeout(() => {
        setShowErrorMessage(false);
      }, 3000);
    }
  };  

  const handleUploadFilePopUpOpen = () =>{
    setUploadFilePopUpOpen(true);
  }

  return (
    <>
    {isPopUpOpen &&
        <PopUpContainer>
            <PopUp>
                <CloseButton onClick={handlePopupClose}><RiCloseLargeFill/></CloseButton>
                <Title>Grant or revoke file access permissions.</Title>
                {loadingStudents ? (
                  <div style={{ textAlign: "center", padding: "20px" }}>
                    <AnimatedLoadingLogo src={SimplifiedLogoAlt} alt="Loading..." />
                  </div>
                ) : students.length === 0 ? (
                  <p>No students available.</p>
                ) : (
                  students.map((student) => (
                    <Card key={student.studentid}>
                      <CardInfo>
                        <p>{student.firstname} {student.lastname}</p>
                      </CardInfo>
                      <DownloadButtonContainer>
                        <Button onClick={handleGrantAccess(fileId, student.studentid)}>
                          {isGranting && activeGranting === student.studentid ? <AnimatedLoadingLogo src={SimplifiedLogo} alt="Loading..." /> : <FaUnlockAlt />}
                        </Button>
                        <Button important onClick={handleRevokeAccess(fileId, student.studentid)}>
                          {isRevoking && activeRevoking === student.studentid ? <AnimatedLoadingLogo src={SimplifiedLogo} alt="Loading..." /> : <FaLock />}
                        </Button>
                      </DownloadButtonContainer>
                    </Card>
                  ))
                )}

            </PopUp>
        </PopUpContainer>
    }
    {uploadFilePopUpOpen &&
        <PopUpContainer>
            <PopUp>
            <CloseButton onClick={handleFilePopupClose}><RiCloseLargeFill/></CloseButton>
            <Title>Upload your file.</Title>
              <UploadForm onSubmit={handleFileUpload}>
                <FileInput
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
                <Button type="submit">
                  {isUploading ? <AnimatedLoadingLogo src={SimplifiedLogo} alt="Loading..." /> : "Upload"}
                </Button>
              </UploadForm>
            </PopUp>
        </PopUpContainer>
    }
    <MainContainer isPopupOpen={isPopUpOpen || uploadFilePopUpOpen}>
      {showMessage && <Message>{message}</Message>}
      {showErrorMessage && <Message error>{message}</Message>}
      <Logo />
      <Topbar />
      <SideBar />
      <Content>
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: 0.3 }}
            style={{
                display: 'flex',
                flexDirection: 'column',
                width: '95%'
            }}
        >
        <PageTitle>My notes</PageTitle>
        </motion.div>
        {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'center'}}>
                <AnimatedLoadingLogo src={SimplifiedLogoAlt} width='70px' height='70px' />
            </div>
        ) : (
            (files.length === 0) ? 
            <NoSubjectsFound>
                <Notification alternative={true} message={"There are no notes to display."} />
                <Button onClick={handleUploadFilePopUpOpen}><LuUpload size={25}/></Button>
            </NoSubjectsFound>
            : (
            <>
            <BrowserWrapper>
            <div style={{ display: 'flex', marginBottom: '20px', alignItems:'left', width: '100%' }}>
                <TextInput
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    icon={<LiaSchoolSolid />}
                    placeholder='Search for a file...'
                />
                <Button onClick={handleUploadFilePopUpOpen}><LuUpload size={25}/></Button>
            </div>
            
            <CardsContainer style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '100%'}}>
                {cardsToDisplay.map((file, index) => (
                    file ? (
                        <Card 
                            key={file.filename}
                            role="button" 
                            tabIndex={0}
                            aria-label={`File: ${file.filename}`}
                        >  
                        
                            <CardInfo>
                                <Title>{truncateText(file.filename)}</Title>
                                <DownloadButtonContainer>
                                  <EditButton onClick={() => handleOpenGivePermissionsPopUp(file.id)}><FaUserLock /></EditButton>
                                  <DownloadButton onClick={handleFileDownload(file.id, file.filename)}><IoMdDownload /></DownloadButton>
                                </DownloadButtonContainer>
                            </CardInfo>
                        </Card>
                    ) : (
                        <StaticSkeletonCard key={`skeleton-${index}`} />
                    )
                ))}
            </CardsContainer>
            </BrowserWrapper>
            </>
            )
        )}
        
      </Content>
    </MainContainer>
    </>
  );
};

export default UploadNotes;
