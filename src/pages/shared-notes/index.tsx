import { useState, useEffect } from "react";
import SideBar from "../../components/sidebar/sidebar";
import Logo from "../../components/top-down-logo";
import Topbar from "../../components/topbar";
import { BrowserWrapper, Card, CardInfo, CardsContainer, Content, DownloadButton, DownloadButtonContainer, MainContainer, NoSubjectsFound, PageTitle, StaticSkeletonCard, Title } from "./components";
import { useAuth } from "../../auth/useAuth";
import Notification from "../../components/notification";
import TextInput from "../../components/search-input";
import { LiaSchoolSolid } from "react-icons/lia";
import { IoMdDownload } from "react-icons/io";
import { AnimatedLoadingLogo } from "../../components/animated-loading-logo/components";
import SimplifiedLogoAlt from "../../assets/Logo transparent alt.png";
import { motion } from 'framer-motion';


interface File {
    id: number;
    file_path: string;
    teacher_id: number;
    filename: string;
    mime_type: string;
    size: number;
    created_at: Date;
    url?: string;
  }
  

const SharedNotes = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { user } = useAuth();
  const URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch(`${URL}files/all-files-by/${user?.id}`,{
            method: "GET",
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user?.token}`,
              'ngrok-skip-browser-warning': 'true',
            },
        });
        const data = await res.json();
        setFiles(data.files || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching files:", error);
        setFiles([]);
        setLoading(false);
      }
    };

    fetchFiles();
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

  const truncateText = (text: string, maxLength: number = 50): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

    const filteredSubjects = files.filter(subject =>
        subject.filename.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const numStaticSkeletonCards = 0 /* Math.max(0, 9 - filteredSubjects.length); */
    const cardsToDisplay = [...filteredSubjects.map(item => item), ...Array(numStaticSkeletonCards).fill(null)];

  return (
    <MainContainer isPopupOpen={false}>
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
        <PageTitle>Notes</PageTitle>
        </motion.div>
        {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'center'}}>
                <AnimatedLoadingLogo src={SimplifiedLogoAlt} width='70px' height='70px' />
            </div>
          ) : (
            <>
            <BrowserWrapper>
              {files.length !== 0 && (
                <div style={{ display: 'flex', marginBottom: '20px', alignItems:'center', width: '100%', justifyContent: 'center'}}>
                <TextInput
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    icon={<LiaSchoolSolid />}
                    placeholder='Search for a file...'
                />
              </div>
              )}
            
            {cardsToDisplay.length > 0 ? (
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
                                    <DownloadButton onClick={handleFileDownload(file.id, file.filename)}><IoMdDownload /></DownloadButton>
                                </DownloadButtonContainer>
                            </CardInfo>
                        </Card>
                    ) : (
                        <StaticSkeletonCard key={`skeleton-${index}`} />
                    )
                ))}
            </CardsContainer>
            ) : (
              <NoSubjectsFound>
                  <Notification alternative={true} message={"There are no notes to display."} />
              </NoSubjectsFound>

            )}
            </BrowserWrapper>
            </>
        )}
        
      </Content>
    </MainContainer>
  );
};

export default SharedNotes;
