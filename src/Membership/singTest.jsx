import {
    Box,
    Flex,
    Image,
    Text,
    Button,
    Heading,
    Badge,
    List,
    ListItem,
    ListIcon,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    VStack,
    Divider,
    HStack,
    Avatar,
    Stack,
    IconButton,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    AspectRatio,
  } from "@chakra-ui/react";
  import { CheckCircleIcon, StarIcon } from "@chakra-ui/icons";
  import React, { useEffect, useState, useCallback } from "react";
  import Bar from "./Bar";
  import { Link } from "react-router-dom";
  import CourseList from "./CourseList";
  import ReviewList from "./ReviewList";
  import axios from "axios";
  import { FaPlayCircle } from "react-icons/fa";
  import ReactPlayer from "react-player";
  
  // Video data and handler function moved outside of the component to improve readability
  const videoList = [
    {
      title: "CISCO CCNA Lab Switch",
      url: "https://www.example.com/video1.mp4",
      duration: "11:48",
    },
    {
      title: "Switch Lab 2 - Basic VLAN",
      url: "https://www.example.com/video2.mp4",
      duration: "09:18",
    },
    {
      title: "Switch Lab 4 - VLAN Trunk II",
      url: "https://www.example.com/video3.mp4",
      duration: "06:16",
    },
    {
      title: "Switch Lab 20 - EtherChannel I",
      url: "https://www.example.com/video4.mp4",
      duration: "07:17",
    },
  ];
  
  const Singlecart = () => {
    const idcourese = localStorage.getItem("idcourese");
    const [courseData, setCourseData] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedVideo, setSelectedVideo] = useState(videoList[0].url);
  
    const handleVideoSelect = useCallback((url) => {
      setSelectedVideo(url);
    }, []);
  
    useEffect(() => {
      const fetchCourseData = async () => {
        try {
          const res = await axios.get(
            `${process.env.REACT_APP_URL}/getcoureseId/${idcourese}`
          );
          setCourseData(res.data.getcourses);
        } catch (err) {
          console.error("Error fetching course data", err);
        }
      };
      fetchCourseData();
    }, [idcourese]);
  
    const renderLessons = (lessons) =>
      lessons.map((lesson, index) => (
        <AccordionItem key={index}>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              {lesson.titleSmaller}
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            <Stack direction={{ base: "column", lg: "row" }}>
              <Box>
                <Text>{lesson.descriptionSmaller}</Text>
              </Box>
              <IconButton
                icon={<FaPlayCircle />}
                aria-label="Watch Video"
                colorScheme="blue"
                fontSize="3xl"
                variant="ghost"
                onClick={onOpen}
              />
            </Stack>
          </AccordionPanel>
        </AccordionItem>
      ));
  
    if (!courseData) {
      return <Text>Loading...</Text>;
    }
  
    const { courses } = courseData;
    const { title, description, price, imageUrl, lessons } = courses[0];
  
    return (
      <Box>
        <Bar />
        <Flex
          direction={{ base: "column", lg: "row" }}
          p={5}
          maxW="1200px"
          mx="auto"
        >
          {/* Left Section */}
          <Box flex="2" mr={{ lg: 5 }}>
            <Heading size="lg" mb={2}>
              {title}
            </Heading>
            <Text color="gray.600" mb={4}>
              {description}
            </Text>
            <Text fontSize="lg" fontWeight="bold" color="yellow.600">
              4.9 ★★★★☆ (448 รีวิว)
            </Text>
  
            {/* What you'll learn */}
            <Box
              mt={5}
              p={5}
              borderWidth="1px"
              borderRadius="md"
              borderColor="gray.200"
            >
              <Heading size="md" mb={4}>
                สิ่งที่คุณจะได้รับเรียนรู้
              </Heading>
              <List spacing={3}>
                <ListItem>
                  <ListIcon as={CheckCircleIcon} color="green.500" />{" "}
                  เข้าใจการทำงานของ HTML5, CSS3 และ JavaScript
                </ListItem>
                <ListItem>
                  <ListIcon as={CheckCircleIcon} color="green.500" />{" "}
                  พัฒนาเว็บไซต์ด้วย Script To Top
                </ListItem>
                <ListItem>
                  <ListIcon as={CheckCircleIcon} color="green.500" />{" "}
                  สร้างโครงการและออกแบบ Frontend
                </ListItem>
                <ListItem>
                  <ListIcon as={CheckCircleIcon} color="green.500" />{" "}
                  รวมการทำงานกับ RESTful API
                </ListItem>
              </List>
            </Box>
  
            {/* Course Content */}
            <Heading size="md" mt={8} mb={4}>
              เนื้อหาหลักสูตร
            </Heading>
            <Accordion allowToggle>{renderLessons(lessons)}</Accordion>
  
            <ReviewList />
            <CourseList />
          </Box>
  
          {/* Right Section */}
          <Box
            flex="1"
            p={5}
            borderWidth="1px"
            borderRadius="md"
            borderColor="gray.200"
            mt={{ base: 5, lg: 0 }}
          >
            <Box
              borderWidth="1px"
              borderRadius="lg"
              p={4}
              bg="gray.50"
              shadow="sm"
            >
              <Flex
                direction={{ base: "column", md: "row" }}
                align="center"
                gap={4}
              >
                <Image
                  src={`${process.env.REACT_APP_URL}/${imageUrl}`}
                  alt={title}
                  boxSize="100px"
                  objectFit="cover"
                  borderRadius="md"
                />
                <Box flex="1">
                  <Heading size="md">{title}</Heading>
                  <Text fontSize="sm" color="gray.600" mt={1}>
                    {description}
                  </Text>
                </Box>
              </Flex>
            </Box>
            <Text fontSize="2xl" fontWeight="bold" color="purple.600" mt={4}>
              USD$ {price.toLocaleString()}
            </Text>
            <Button colorScheme="purple" width="full" mt={2}>
              เพิ่มไปยังตะกร้า
            </Button>
            <Button variant="outline" colorScheme="purple" width="full" mt={2}>
              ซื้อเลย
            </Button>
  
            <Box mt={5}>
              <Heading size="sm" mb={2}>
                หลักสูตรที่เกี่ยวข้อง
              </Heading>
              <Flex wrap="wrap">
                <Badge colorScheme="blue" m={1}>
                  JavaScript
                </Badge>
                <Badge colorScheme="blue" m={1}>
                  การพัฒนาเว็บ
                </Badge>
                <Badge colorScheme="blue" m={1}>
                  การพัฒนา
                </Badge>
              </Flex>
            </Box>
    
            {/* <Box
              maxW="lg"
              p={5}
              borderWidth="1px"
              borderRadius="md"
              borderColor="gray.200"
            >
              <Heading size="md">วิทยากร</Heading>
              <Link href="#" color="blue.500" fontSize="lg" fontWeight="bold">
                Kong Ruksiam
              </Link>
              <Text color="gray.500">Programmer , Developer</Text>
  
              <HStack mt={4} align="center">
                <Avatar src="https://example.com/profile-image.jpg" size="lg" />
                <VStack align="start" spacing={1}>
                  <HStack>
                    <StarIcon color="yellow.500" />
                    <Text fontSize="sm">คะแนนวิทยากร 4.8</Text>
                  </HStack>
                  <Text fontSize="sm">รีวิว 3,182 รายการ</Text>
                  <Text fontSize="sm">ผู้เรียน 12,875 คน</Text>
                  <Text fontSize="sm">หลักสูตร 14 รายการ</Text>
                </VStack>
              </HStack>
              <Text mt={4}>
                โปรแกรมเมอร์, เจ้าของเพจ <strong>KongRuksiam Studio</strong>
              </Text>
              <Text>สอนเขียนโปรแกรมในช่องยูทูบตั้งแต่ปี 2015 ถึงปัจจุบัน</Text>
            </Box> */}
          </Box>
        </Flex>
  
        {/* Video Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="4xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>CISCO CCNA Lab Switch</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack align="start" spacing={4} mt={5}>
                {/* Mapping through lessons to render video list dynamically */}
                {lessons &&
                  lessons.map((lesson, index) => (
                    <>
                      <ReactPlayer
                        url={`${process.env.REACT_APP_URL}/${lesson.videoUrl}`}
                        controls
                        width="100%"
                        height="360px"
                        key={index}
                      />
                      <Text fontWeight="bold" mb={2}>
                        Video Playlist:
                      </Text>
                      <HStack
                        key={index}
                        spacing={4}
                        p={2}
                        cursor="pointer"
                        _hover={{ bg: "gray.100" }}
                        onClick={() => handleVideoSelect(lesson.videoUrl)} // Assuming lesson has videoUrl
                      >
                        <Box flex="1">
                          <Text fontWeight="semibold">{lesson.titleSmaller}</Text>
                        </Box>
                      </HStack>
                    </>
                  ))}
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    );
  };
  
  export default Singlecart;
  