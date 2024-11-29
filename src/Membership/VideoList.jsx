import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Flex,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Link,
  Heading,
  Text,
  Button,
  useToast,
  Stack,
  Tabs,
  TabList,
  FormLabel,
  Textarea,
  FormControl,
  Divider,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  IconButton,
  Checkbox,
} from "@chakra-ui/react";
import ReactPlayer from "react-player";
import axios from "axios";
import StarRatingComponent from "react-rating-stars-component";
import { IdContext } from "../idContext";
import { useNavigate } from "react-router-dom";
import Rating from "react-rating";
import { FiFileText, FiStar, FiMessageCircle } from "react-icons/fi";
import "font-awesome/css/font-awesome.min.css";
import "../App.css";

const DocumentComponent = () => (
  <Box>
    <Heading size="md">Documents</Heading>
    <Text>Here are some important documents.</Text>
  </Box>
);

const CommentComponent = () => (
  <Box>
    <Heading size="md">Contact Your Teacher</Heading>
    <Text>Leave a comment or ask a question below.</Text>
  </Box>
);

const RatingComponent = ({
  rating,
  setRating,
  comment,
  setComment,
  submitComment,
  commentsToShow,
  handleReadMore,
  getcomment,
  showAll,
}) => (
  <Box
    p={5}
    borderWidth="1px"
    borderRadius="lg"
    bg="white"
    shadow="md"
    maxW={{ base: "90%", md: "800px" }}
    mx="auto"
  >
    <Heading mb={5}>Rate This Course</Heading>
    <StarRatingComponent
      name="rate1"
      starCount={5}
      value={rating}
      onChange={(value) => setRating(value)}
      starSize={40}
    />
    <FormControl mt={4}>
      <FormLabel>Leave a Comment</FormLabel>
      <Textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="What did you think of this course?"
        mb={3}
      />
      <Button onClick={submitComment} colorScheme="teal">
        Submit Comment
      </Button>
    </FormControl>
    <Divider my={5} />
    <Heading size="md" mb={3}>
      User Comments
    </Heading>
    <Stack spacing={4}>
      {commentsToShow.map((comment, index) => (
        <Box
          key={index}
          p={4}
          borderWidth="1px"
          borderRadius="md"
          bg="gray.100"
          boxShadow="sm"
        >
          <Flex justifyContent="space-between" align="center">
            <Text fontWeight="bold" color="teal.600">
              {comment.user}
            </Text>
            <Rating
              initialRating={comment.rating}
              readonly
              emptySymbol="fa fa-star-o custom-icon"
              fullSymbol="fa fa-star custom-icon"
            />
          </Flex>
          <Text mt={2}>{comment.comment}</Text>
        </Box>
      ))}
      {getcomment.length > 5 && (
        <Button onClick={handleReadMore} colorScheme="teal">
          {showAll ? "Show Less" : "Read More"}
        </Button>
      )}
    </Stack>
  </Box>
);

function VideoList() {
  const { idCarttoPayment } = useContext(IdContext);
  console.log(idCarttoPayment);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [activeCategory, setActiveCategory] = useState("");
  const [bgColor, setBgColor] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [getcomment, setGetcomment] = useState("");
  const [showAll, setShowAll] = useState(false);
  const commentsToShow = showAll ? getcomment : getcomment.slice(0, 5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();
  const token = window.name;
  const [completedLessons, setCompletedLessons] = useState(false);
  const [refreah, setRefreah] = useState("");
  const userId = JSON.parse(localStorage.getItem("user")).user._id.trim();
  const handleEditToggle = async (lessonId, id_core, event) => {
    try {
      const isCompleted = event.target.checked;
      setCompletedLessons((prev) => ({ ...prev, [lessonId]: isCompleted }));

      const url = `${process.env.REACT_APP_URL}/prograss`;
      const res = await axios.post(
        url,
        {
          score: 1,
          completedLessons: isCompleted,
          historycourse: lessonId,
          idforringall: id_core,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRefreah(res.data);
    } catch (err) {
      setError("Error updating lesson progress");
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchcomment = async () => {
      try {
        const url = `${process.env.REACT_APP_URL}/getcomment_rating/${idCarttoPayment?._id}`;
        const res = await axios.get(url);
        setGetcomment(res.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching cart data");
        console.log(error);
      }
    };
    const fetprograss = async () => {
      try {
        const url = `${process.env.REACT_APP_URL}/getcomment_rating/${idCarttoPayment?._id}`;
        const res = await axios.get(url);
        setGetcomment(res.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching cart data");
        console.log(error);
      }
    };
    if (idCarttoPayment?.cart?.courses.length === undefined) {
      navigate("/mycourses");
      return;
    }

    fetchcomment();
    fetprograss();
  }, [toast, token, navigate, idCarttoPayment, userId]);

  const handleLessonSelect = (lessonId) => {
    setSelectedVideo(lessonId);
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setBgColor(
      category === "ເອກະສານ"
        ? "green.700"
        : category === "ລະດັບການໃຫ້ຄະແນນ"
        ? "red.600"
        : category === "ຕິດຕໍ່ສອບຖາມ"
        ? "orange.300"
        : "gray.200"
    );
  };

  const submitComment = async () => {
    try {
      const url = `${process.env.REACT_APP_URL}/comment/${idCarttoPayment?._id}`;
      await axios.post(
        url,

        { comment, rating, cart: idCarttoPayment?.cart._id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast({
        title: "Success",
        description: "Comment and rating submitted successfully.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      const res = await axios.get(
        `${process.env.REACT_APP_URL}/getcomment_rating/${idCarttoPayment?._id}`
      );
      setGetcomment(res.data); // Update the state with the new list of comments from the backend
      setComment("");
      setRating(0);
    } catch (err) {
      setError("Error submitting comment");
      console.log(err);
    }
  };

  const renderCategoryContent = () => {
    switch (activeCategory) {
      case "ເອກະສານ":
        return <DocumentComponent />;
      case "ລະດັບການໃຫ້ຄະແນນ":
        return (
          <RatingComponent
            rating={rating}
            comment={comment}
            setRating={setRating}
            setComment={setComment}
            submitComment={submitComment}
            commentsToShow={commentsToShow}
            getcomment={getcomment}
            handleReadMore={() => setShowAll(!showAll)}
            showAll={showAll}
          />
        );
      case "ຕິດຕໍ່ສອບຖາມ":
        return <CommentComponent />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Center minH="100vh">
        <Box textAlign="center">
          <Spinner thickness="4px" speed="0.65s" color="blue.500" size="xl" />
          <Box mt={4} fontSize="lg" color="gray.600">
            Loading, please wait...
          </Box>
        </Box>
      </Center>
    );
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

  return (
    <Box>
      <Flex direction={{ base: "column", md: "row" }} height="100vh">
        <Box
          w={{ base: "100%", md: "25%" }}
          p={{ base: 2, md: 4 }}
          bg="gray.50"
          overflowY="auto"
        >
          <Heading size="md" mb={4}>
            Course Content
          </Heading>
          <Accordion allowToggle>
            {idCarttoPayment ? (
              idCarttoPayment.cart.courses.map((course) => (
                <AccordionItem key={course._id} border="none">
                  <AccordionButton
                    _expanded={{ bg: "blue.200", color: "blue.700" }}
                    _hover={{ bg: "blue.100" }}
                    p={4}
                    borderRadius="md"
                  >
                    <Box textAlign="left" fontWeight="bold">
                      {course.title}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel>
                    <Accordion allowToggle>
                      {course.lessons.map((lesson) => (
                        <AccordionItem key={lesson.id} border="none">
                          <AccordionButton _hover={{ bg: "blue.100" }}>
                            <Box flex="1" textAlign="left" fontWeight="medium">
                              <Link onClick={() => handleLessonSelect(lesson)}>
                                {lesson.titleSmaller}
                              </Link>
                            </Box>
                            <Checkbox
                              onChange={(event) =>
                                handleEditToggle(
                                  lesson._id,
                                  idCarttoPayment._id,
                                  event
                                )
                              }
                              isChecked={completedLessons[lesson._id]}
                            />
                            <AccordionIcon />
                          </AccordionButton>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </AccordionPanel>
                </AccordionItem>
              ))
            ) : (
              <Text
                fontSize="xl"
                fontWeight="semibold"
                color="red.500"
                textAlign="center"
                mt={5}
              >
                No videos available
              </Text>
            )}
          </Accordion>
        </Box>
        <Box
          flex="1"
          p={{ base: 4, md: 6 }}
          bg="white"
          boxShadow="lg"
          borderRadius="lg"
        >
          {selectedVideo ? (
            <Box>
              <Heading size="lg" mb={4}>
                {selectedVideo.titleSmaller || "No Title"}
              </Heading>
              <Box
                w="100%"
                h={{ base: "200px", md: "300px" }}
                borderRadius="lg"
                overflow="hidden"
                mb={4}
                boxShadow="md"
              >
                <ReactPlayer
                  url={`${process.env.REACT_APP_URL}/${selectedVideo.videoUrl}`}
                  width="100%"
                  height="100%"
                  controls
                />
              </Box>
              <Text mt={4}>
                {selectedVideo.descriptionSmaller || "No description available"}
              </Text>
            </Box>
          ) : (
            <Text
              fontSize="2xl"
              fontWeight="bold"
              color="teal.500"
              textAlign="center"
              mt={10}
            >
              Select a lesson to start learning
            </Text>
          )}
        </Box>
      </Flex>
      <Box bg={bgColor} p={5} minH="200px">
        <Tabs isFitted variant="enclosed" colorScheme="green">
          <TabList justifyContent="center" spacing={4}>
            <IconButton
              aria-label="Documents"
              icon={<FiFileText />}
              onClick={() => handleCategoryChange("ເອກະສານ")}
              variant={activeCategory === "ເອກະສານ" ? "solid" : "ghost"}
              colorScheme="green"
              size="lg"
            />
            <IconButton
              aria-label="Rating"
              icon={<FiStar />}
              onClick={() => handleCategoryChange("ລະດັບການໃຫ້ຄະແນນ")}
              variant={
                activeCategory === "ລະດັບການໃຫ້ຄະແນນ" ? "solid" : "ghost"
              }
              colorScheme="black"
              size="lg"
            />
            <IconButton
              aria-label="Contact Teacher"
              icon={<FiMessageCircle />}
              onClick={() => handleCategoryChange("ຕິດຕໍ່ສອບຖາມ")}
              variant={activeCategory === "ຕິດຕໍ່ສອບຖາມ" ? "solid" : "ghost"}
              colorScheme="blue"
              size="lg"
            />
          </TabList>
          <Box p={5}>{renderCategoryContent()}</Box>
        </Tabs>
      </Box>
    </Box>
  );
}

export default VideoList;
