import React, { useState, useEffect } from "react";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { storage, db } from "../../firebase"; // Firebase configuration
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Progress,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Firebase Authentication

function Temple() {
  const [file, setFile] = useState(null); // File
  const [title, setTitle] = useState(""); // Title
  const [uploadedBy, setUploadedBy] = useState(""); // Uploaded By
  const [description, setDescription] = useState(""); // Description
  const [titleSmall, setTitleSmall] = useState(""); // Title Small
  const [image, setImage] = useState(""); // Image URL
  const [descriptionSmall, setDescriptionSmall] = useState(""); // Short description
  const [titleSmaller, setTitleSmaller] = useState(""); // Another title variant
  const [descriptionSmaller, setDescriptionSmaller] = useState(""); // Another description variant
  const [price, setPrice] = useState(""); // Course price
  const [progress, setProgress] = useState(0); // Upload progress
  const [isUploading, setIsUploading] = useState(false); // Uploading state
  const toast = useToast(); // Toast for alerts

  // Firebase Authentication
  const auth = getAuth();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAdmin(user); // Set the admin when user is authenticated
      } else {
        setAdmin(null); // No user is authenticated
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [auth]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const userData = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  const [userEmail, setUserEmail] = useState(userData ? userData.email : "");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file) {
      toast({
        title: "No file selected.",
        description: "Please choose a video file to upload.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    // Check if admin is authenticated
    if (!admin) {
      toast({
        title: "Not authenticated.",
        description: "You need to be logged in as an admin to upload videos. Please log in.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    // Get admin UID from Firebase Auth
    const adminId = admin.uid; 

    // Upload video to Firebase Storage
    const storageRef = ref(storage, `videos/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    setIsUploading(true);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        console.error("Error uploading file: ", error);
        toast({
          title: "Error uploading video.",
          description: "Something went wrong during upload.",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
        setIsUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

        // Save metadata to Firestore
        try {
          await addDoc(collection(db, "videos"), {
            userEmail: userEmail,
            adminId: adminId, // Save admin ID here
            course: [
              {
                title: title,
                description: description,
                image: image,
                price: price,
                lesson: [
                  {
                    lessonZero: [
                      {
                        titleSmaller: titleSmaller,
                        descriptionSmaller: descriptionSmaller,
                        videoUrl: downloadURL,
                      },
                    ],
                  },
                ],
                uploadDate: new Date(),
                uploadedBy: uploadedBy,
              },
            ],
          });
          toast({
            title: "Video uploaded.",
            description: "Your video has been uploaded successfully!",
            status: "success",
            duration: 4000,
            isClosable: true,
          });
        } catch (err) {
          console.error("Error saving video metadata: ", err);
          toast({
            title: "Error saving video.",
            description: "Failed to save video metadata.",
            status: "error",
            duration: 4000,
            isClosable: true,
          });
        }
        setIsUploading(false);
      }
    );
  };
  return (
    <Box p={6} maxW="600px" mx="auto">
      <Text fontSize="2xl" mb={4} fontWeight="bold">
        Upload Video
      </Text>
      <VStack spacing={5}>
        <form onSubmit={handleSubmit}>
        <FormControl id="title" isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormControl>
        </form>
      </VStack>
    </Box>
  );
}

export default Temple;
///videoList
import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  startAfter,
  limit,
} from "firebase/firestore";
import {
  Box,
  Flex,
  IconButton,
  Text,
  useToast,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Link,
  Heading,
  Stack,
  TabList,
  Button,
  Tabs,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { db } from "../../firebase";
import ReactPlayer from "react-player";

function VideoList() {
  const [videos, setVideos] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [page, setPage] = useState(1);
  const [isNextDisabled, setIsNextDisabled] = useState(false);
  const [isPrevDisabled, setIsPrevDisabled] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const limitValue = 1;
  const [bg_1, setBg_1] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const toast = useToast();

  const fetchVideos = async (direction = 0) => {
    try {
      let videoQuery;
      if (direction === 1 && lastVisible) {
        videoQuery = query(
          collection(db, "videos"),
          startAfter(lastVisible),
          limit(limitValue)
        );
      } else {
        videoQuery = query(collection(db, "videos"), limit(limitValue));
      }

      const documentSnapshots = await getDocs(videoQuery);
      const documentSnapshots_All = await getDocs(collection(db, "videos"));

      const lastVisibleDoc =
        documentSnapshots.docs[documentSnapshots.docs.length - 1];
      setLastVisible(lastVisibleDoc);

      setIsPrevDisabled(page === 1);
      setIsNextDisabled(documentSnapshots.docs.length < limitValue);

      const videoList = documentSnapshots_All.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setVideos(videoList);
    } catch (error) {
      console.error("Error fetching videos: ", error);
      toast({
        title: "Error",
        description: "Something went wrong while fetching videos.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };



  const handleLessonSelect = (lesson) => {
    console.log("Selected Lesson:", lesson); // Log the clicked lesson

    // Check if the lesson has a video URL
    if (lesson.videoUrl) {
      setSelectedVideo(lesson); // Update selected video state
      console.log("Video URL:", lesson.videoUrl); // Log the video URL
    } else {
      console.error("No video URL found in lesson:", lesson); // Log an error if no URL
    }
  };

  const handlePageChange = (direction) => {
    if (direction === 1) {
      setPage((prev) => prev + 1);
    } else if (direction === -1 && page > 1) {
      setPage((prev) => prev - 1);
    }
    fetchVideos(direction);
  };
  const handleChangeColor = (category) => {
    setSelectedCategory(category);
    setActiveCategory(category);
    switch (category) {
      case "ຄວາມຄິດເຫັນ":
        setBg_1("blue.500"); // เปลี่ยนเป็นสีน้ำเงิน
        break;
      case "ເອກະສານ":
        setBg_1("green.700"); // เปลี่ยนเป็นสีเขียวเข้ม
        break;
      case "ລະດັບການໃຫ້ຄະແນນ":
        setBg_1("red.600"); // เปลี่ยนเป็นสีแดงเข้ม
        break;
      case "ຕິດຕໍ່ສອບຖາມ":
        setBg_1("orange.300"); // เปลี่ยนเป็นสีส้ม
        break;
      default:
        setBg_1("gray.200"); // สีพื้นฐานถ้าไม่มีประเภท
        break;
    }
  };
  useEffect(() => {
    fetchVideos(); // Fetch the first page when component mounts
  }, []);
  return (
    <Box>
      <Flex height="100vh">
        {/* Sidebar for lesson list */}
        <Box w="25%" p={4} bg="gray.100" overflowY="auto">
          <Heading size="md" mb={4}>
            Course Content
          </Heading>
          <Accordion allowToggle>
            {videos.map((video) => (
              <AccordionItem key={video.id}>
                <AccordionButton>
                  <Box flex="1" textAlign="left" fontWeight="bold">
                    {video.title}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <Accordion allowToggle>
                    {video.lesson && video.lesson.length > 0 ? (
                      video.lesson.map((lesson, index) => (
                        <AccordionItem key={index}>
                          <AccordionButton>
                            <Box flex="1" textAlign="left">
                              <Link onClick={() => handleLessonSelect(lesson)}>
                                {lesson.TitleSmall}
                              </Link>
                            </Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </AccordionItem>
                      ))
                    ) : (
                      <Text>No lessons available</Text>
                    )}
                  </Accordion>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Box>

        {/* Main content area for playing the selected lesson */}
        <Box flex="1" p={6} bg="white">
          {selectedVideo ? (
            <Box>
              <Heading size="lg" mb={4}>
                {selectedVideo.TitleSmall || "No Title"}
              </Heading>
              <ReactPlayer
                url={selectedVideo.videoUrl} // Use ReactPlayer for better handling
                width="100%"
                height="300px"
                controls
              />
              <Text mt={4}>
                {selectedVideo.descriptionSmall || "No description available"}
              </Text>
              <Tabs flex="1" p={"10"} variant="unstyled">

              <Stack display={'flex'} justifyContent="center">
                <TabList>
                  {[
                    "ຄວາມຄິດເຫັນ",
                    "ເອກະສານ",
                    "ລະດັບການໃຫ້ຄະແນນ",
                    "ຕິດຕໍ່ສອບຖາມ",
                  ].map((category) => (
                    <Button
                      key={category}
                      value={category}
                      onClick={() => handleChangeColor(category)}
                      _active={{
                        bg: bg_1,
                        transform: "scale(0.95)",
                      }}
                      _selected={{
                        color: "white",
                        bg: bg_1,
                      }}
                      className={activeCategory === category ? "active" : ""}
                      bg={activeCategory === category ? bg_1 : "transparent"}
                    >
                      {category}
                    </Button>
                  ))}
                </TabList>
              </Stack>
              </Tabs>
            </Box>
          ) : (
            <Text>Select a lesson to start learning</Text>
          )}
        </Box>
      </Flex>

      {/* Pagination controls */}
      {/* <Flex mt="4" align="center" justify="center">
        <IconButton
          icon={<ChevronLeftIcon />}
          onClick={() => handlePageChange(-1)}
          isDisabled={isPrevDisabled}
          aria-label="Previous"
        />
        <Text mx="4">Page {page}</Text>
        <IconButton
          icon={<ChevronRightIcon />}
          onClick={() => handlePageChange(1)}
          isDisabled={isNextDisabled}
          aria-label="Next"
        />
      </Flex> */}
    </Box>
  );
}

export default VideoList;
