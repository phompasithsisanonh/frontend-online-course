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
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Center,
  ButtonGroup,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import React, { useEffect, useState, useCallback } from "react";
import Bar from "./Bar";
import ReviewList from "./ReviewList";
import axios from "axios";
import { FaPlayCircle } from "react-icons/fa";
import { useCart } from "react-use-cart";
import { useNavigate } from "react-router-dom";
const Singlecart = () => {
  const idcourese = localStorage.getItem("idcourese");
  const [idforChangebuttonMe, setIdforChangebuttonMe] = useState("");
  const [courseData, setCourseData] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedVideo, setSelectedVideo] = useState(""); // Initially empty
  const { addItem, items } = useCart();

  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = window.name;
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem("user")).user._id.trim();
  const handleVideoSelect = useCallback((url) => {
    setSelectedVideo(url);
  }, []);
  const addCartToDatabase = async (id) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_URL}/cart/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (err) {
      console.error("Error saving cart to database:", err);
    }
  };
  const handleAddToCart = async (course) => {
    course.map(async (item) => {
      const isItemInCart = items.some((item) => item.id === courseData._id);
      if (!isItemInCart) {
        addItem({
          id: courseData._id,
          price: item.price,
        });
        await addCartToDatabase(courseData._id);
        setLoading(false);
      } else {
        setLoading(false);
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      }
    });
  };
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
    const fetchHistory = async () => {
      try {
        const url = `${process.env.REACT_APP_URL}/gethistory/${userId}`;
        const res = await axios.get(url);
        const userRecords = res.data.userRecord_more;
        setIdforChangebuttonMe(
          userRecords.map((data) => data.historycourseforpayment.cart._id)
        );
      } catch (err) {
        console.log(err);
      }
    };
    fetchHistory();
    fetchCourseData();
  }, [idcourese, courseData?._id,userId]);

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
              onClick={() => {
                handleVideoSelect(lesson); // Update selected video URL
                onOpen(); // Open the modal
              }}
            />
          </Stack>
        </AccordionPanel>
      </AccordionItem>
    ));

  if (!courseData) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return (
      <Center minH="100vh">
        <Box width="100%" maxW="md">
          <Alert
            status="error"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="200px"
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Oops! Something went wrong.
            </AlertTitle>
            <AlertDescription maxWidth="sm">{error}</AlertDescription>
          </Alert>
        </Box>
      </Center>
    );
  }

  const { courses } = courseData;
  const { title, description, price, imageUrl, lessons, details } = courses[0];

  return (
    <Box>
      <Bar />
      {showAlert && (
        <Alert status="error" variant="left-accent" borderRadius="md">
          <AlertIcon />
          <AlertTitle>Already in Cart!</AlertTitle>
          <AlertDescription>
            This item is already in your cart.
          </AlertDescription>
        </Alert>
      )}
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

          {/* What you'll learn */}
          <Box
            mt={5}
            p={5}
            borderWidth="1px"
            borderRadius="md"
            borderColor="gray.200"
          >
            <Heading size="md" mb={4}>
              ສິ່ງທີ່ທານຈະໄດ້ຮຽນຮູ້
            </Heading>
            <List spacing={3}>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="green.500" /> {details}
              </ListItem>
            </List>
          </Box>

          {/* Course Content */}
          <Heading size="md" mt={8} mb={4}>
           ເນື້ອຫາຫຼັກສູດ
          </Heading>
          <Accordion allowToggle>{renderLessons(lessons)}</Accordion>

          <ReviewList courseData={courseData._id} />
          {/* <CourseList /> */}
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
          {idforChangebuttonMe.includes(courseData._id) ? (
            <Button
              variant="solid"
              colorScheme="teal"
              onClick={() => navigate("/mycourses")}
            >
              Learn now
            </Button>
          ) : (
            <ButtonGroup spacing="10">
              <Button
                onClick={() => handleAddToCart(courses)}
                colorScheme="purple"
                width="full"
                mt={2}
              >
                ເພີ່ມໄປກະຕ່າ
              </Button>
              <Button
                variant="outline"
                colorScheme="purple"
                width="full"
                mt={2}
              >
                ຊື້ເລີຍ
              </Button>
            </ButtonGroup>
          )}

          <Box mt={5}>
            <Heading size="sm" mb={2}>
              ຫຼັກສູທີ່ກ່ຽວຂ້ອງ
            </Heading>
            <Flex wrap="wrap">
              <Badge colorScheme="blue" m={1}>
                JavaScript
              </Badge>
              <Badge colorScheme="blue" m={1}>
                ການພັດທະນາເວັບ
              </Badge>
              <Badge colorScheme="blue" m={1}>
                ການພັດທະນາ
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
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Online course</ModalHeader>
          <ModalCloseButton />
          <ModalBody width={"400px"}>
            <iframe
              src={`${process.env.REACT_APP_URL}/${selectedVideo.videoUrl}`}
              title="Video Player"
              width="640"
              height="360"
              allow="autoplay; fullscreen"
              allowFullScreen
              style={{ border: "none" }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Singlecart;
