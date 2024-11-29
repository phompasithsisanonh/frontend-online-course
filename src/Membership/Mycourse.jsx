import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  Text,
  Stack,
  Button,
  Heading,
  Image,
  Flex,
  useToast,
  Badge,
  Center,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Progress,
  Divider,
} from "@chakra-ui/react";
import Bar from "./Bar";
import Footer from "./Footer";
import axios from "axios";
import { IdContext } from "../idContext";
import { useNavigate } from "react-router-dom";

function MyCourses() {
  const [videos, setVideos] = useState([]);
  const [progressData, setProgressData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = window.name;
  const toast = useToast();
  const { setIdCarttoPayment } = useContext(IdContext);
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem("user")).user._id.trim();

  useEffect(() => {
    const fetchVideosAndProgress = async () => {
      try {
        // Fetching courses
        const url = `${process.env.REACT_APP_URL}/gethistory/${userId}`;
        const res = await axios.get(url);
        const userRecords = res.data.userRecord_more;

        const videos = userRecords.map(
          (record) => record.historycourseforpayment
        );
        const progressIds = userRecords.map((record) => record.historycourse);
        setVideos(videos);

        // Fetching progress for each course
        const progressPromises = progressIds.map((id) =>
          axios.get(`${process.env.REACT_APP_URL}/getprograss/${id}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          })
        );

        const progressResponses = await Promise.all(progressPromises);
        const progressData = progressResponses.reduce((acc, res, index) => {
          const totalScore = res.data.res_id.reduce(
            (sum, item) => sum + (item.score || 0),
            0
          );
          const percentage = Math.min((totalScore / 5) * 100, 100);
          acc[progressIds[index]] = {
            percentage: isNaN(percentage) ? 0 : parseInt(percentage),
            conditionIds: res.data.res_id.map((item) => item.idforringall),
          };
          return acc;
        }, {});

        setProgressData(progressData);
        setLoading(false);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch data.",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
        setError("Failed to fetch data. Please try again.");
        setLoading(false);
      }
    };

    fetchVideosAndProgress();
  }, [token, userId, toast]);

  const handleClick = (data) => {
    setIdCarttoPayment(data);
    navigate("/video");
  };

  if (loading) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" thickness="4px" color="blue.500" />
        <Box mt={4} fontSize="lg" color="gray.600">
          Loading, please wait...
        </Box>
      </Center>
    );
  }

  if (error) {
    return (
      <Center minH="100vh">
        <Alert
          status="error"
          variant="subtle"
          flexDirection="column"
          textAlign="center"
        >
          <AlertIcon boxSize="40px" />
          <AlertTitle>Oops! Something went wrong.</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </Center>
    );
  }

  return (
    <Box>
      <Bar />
      <Heading mb={5} fontSize="2xl" textAlign="center">
        My Courses
      </Heading>
      <Stack spacing={6}>
        {videos.length > 0 ? (
          videos.map((items) =>
            items.cart.courses.map((course, index) => (
              <Box
                key={course.id}
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
                    src={`${process.env.REACT_APP_URL}/${course.imageUrl}`}
                    alt={course.title}
                    boxSize="100px"
                    objectFit="cover"
                    borderRadius="md"
                  />
                  <Box flex="1">
                    <Heading size="md">{course.title}</Heading>
                    <Text fontSize="sm" color="gray.600" mt={1}>
                      {course.description}
                    </Text>
                    <Badge colorScheme="blue" mt={2}>
                      {course.category}
                    </Badge>
                  </Box>
                </Flex>
                <Button
                  onClick={() => handleClick(items)}
                  colorScheme="teal"
                  size="sm"
                  mt={3}
                >
                  Start Course
                </Button>
                <Divider my={3} />

                <Center>
                  <Progress
                    value={progressData[items._id]?.percentage || 0}
                    width="100%"
                    colorScheme={
                      progressData[items._id]?.conditionIds.includes(items._id)
                        ? "green"
                        : "red"
                    }
                  />
                  <Text ml={3}>
                    {progressData[items._id]?.percentage || 0}%
                  </Text>
                </Center>
              </Box>
            ))
          )
        ) : (
          <Text fontSize="xl" color="red.500" textAlign="center" mt={5}>
            No your course
          </Text>
        )}
      </Stack>
      <Footer />
    </Box>
  );
}

export default MyCourses;
