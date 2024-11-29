import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Stack,
  Heading,
  Text,
  Divider,
  ButtonGroup,
  Button,
  Image,
  SimpleGrid,
  Box,
  Select,
  useBreakpointValue,
  Input,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Center,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import Bar from "./Bar";
import axios from "axios";
import { useCart } from "react-use-cart";
import Footer from "./Footer";
import { Avatar, HStack, Icon, VStack } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import PromoCard from "./PromoCard";

function Dashboard() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dataVideo, setDataVideo] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [idforChangebuttonMe, setIdforChangebuttonMe] = useState("");
  const { addItem, items } = useCart();
  const token = window.name;

  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const handleButtonClick = () => {
    console.log("Promo button clicked!");
    // Navigate to course details or enroll page
  };

  const userId = JSON.parse(localStorage.getItem("user")).user._id.trim();

  const CommentCard = ({ username, avatarUrl, rating, commentText }) => {
    return (
      <Box
        boxShadow="md"
        borderRadius="lg"
        p={5}
        backgroundColor="white"
        border="1px"
        borderColor="gray.200"
        maxW="md"
        mx="auto"
        my={3}
      >
        <HStack alignItems="flex-start" spacing={4}>
          <Avatar name={username} src={avatarUrl} size="md" />
          <VStack align="start" spacing={1} w="full">
            <Text fontWeight="bold" color="teal.600" fontSize="lg">
              {username}
            </Text>
            <HStack spacing={1}>
              {[...Array(5)].map((_, i) => (
                <Icon
                  as={StarIcon}
                  key={i}
                  color={i < rating ? "yellow.400" : "gray.300"}
                />
              ))}
            </HStack>
            <Text color="gray.600" fontSize="md" pt={2}>
              {commentText}
            </Text>
          </VStack>
        </HStack>
      </Box>
    );
  };
  const [comments, setComments] = useState([
    {
      username: "John Doe",
      avatarUrl: "https://bit.ly/broken-link",
      rating: 5,
      commentText: "Great course! Highly recommended.",
    },
    {
      username: "Jane Smith",
      avatarUrl: "https://bit.ly/broken-link",
      rating: 4,
      commentText: "Very informative, but could use more examples.",
    },
    {
      username: "Alice Johnson",
      avatarUrl: "https://bit.ly/broken-link",
      rating: 5,
      commentText: "Excellent content and well-structured.",
    },
  ]);

  // Fetch courses from API
  const getDatabaseApi = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_URL}/allcourse`
      );
      setDataVideo(response.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("Error fetching data");
      console.error("Error fetching data:", err);
    }
  };

  // Add item to cart in the database
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

  // Filter courses based on category and search term
  useEffect(() => {
    const filtered = dataVideo.filter((course) => {
      const matchesCategory =
        selectedCategory === "all" || course.categories === selectedCategory;
      const matchesSearchTerm = course.categories
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearchTerm;
    });
    const fetchHistory = async () => {
      try {
        const url = `${process.env.REACT_APP_URL}/gethistory/${userId}`;
        const res = await axios.get(url);
        const userRecords = res.data.userRecord_more;
        setIdforChangebuttonMe(
          userRecords.map((data) => data.historycourseforpayment.cart._id)
        );
        console.log();
      } catch (err) {
        console.log(err);
      }
    };
    fetchHistory();
    setFilteredCourses(filtered);
  }, [selectedCategory, searchTerm, dataVideo, userId]);
  // Fetch courses on page load
  useEffect(() => {
    if (token) {
      getDatabaseApi();
    }
  }, [token]);

  // Add course to cart without duplicates
  const handleAddToCart = async (course) => {
    const isItemInCart = items.some((item) => item.id === course._id);
    if (!isItemInCart) {
      addItem({
        id: course._id,
        price: course.price,
      });
      await addCartToDatabase(course._id); // Post to database after adding
      setLoading(false);
    } else {
      setLoading(false);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000); // Hide alert after 3 seconds
    }
  };

  const columns = useBreakpointValue({ base: 1, sm: 2, md: 3 });
  const handleClickgetTosingle = (id) => {
    localStorage.setItem("idcourese", id);
    navigate("/single");
  };
  if (loading) {
    return (
      <Center minH="100vh">
        <Box textAlign="center">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
          <Box mt={4} fontSize="lg" color="gray.600">
            Loading, please wait...
          </Box>
        </Box>
      </Center>
    );
  }
if(!token){
  return navigate('/login')
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
      <Bar />

      <Box p={5}>
        <PromoCard
          imageUrl="https://example.com/course-image.jpg"
          title="Learn React Today!"
          description="Get hands-on with React, one of the most popular frontend libraries, and build amazing projects."
          buttonText="Enroll Now"
          onButtonClick={handleButtonClick}
        />
      </Box>
      <StatGroup my={8} justifyContent="center">
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={4}
          boxShadow="xl"
          borderRadius="lg"
          backgroundColor="gray.50"
          padding={6}
          width={{ base: "full", md: "80%" }}
          alignItems="center"
          textAlign="center"
        >
          <Stat p={4} bg="white" borderRadius="md" boxShadow="md">
            <StatLabel fontSize="lg" fontWeight="medium" color="gray.600">
              Students
            </StatLabel>
            <StatNumber fontSize="2xl" color="teal.500">
              345,670
            </StatNumber>
            <StatHelpText>
              <StatArrow type="increase" color="green.400" />
              23.36%
            </StatHelpText>
          </Stat>

          <Stat p={4} bg="white" borderRadius="md" boxShadow="md">
            <StatLabel fontSize="lg" fontWeight="medium" color="gray.600">
              Rating
            </StatLabel>
            <StatNumber fontSize="2xl" color="teal.500">
              4.8
            </StatNumber>
            <StatHelpText>
              <StatArrow type="increase" color="green.400" />
              5.4%
            </StatHelpText>
          </Stat>

          <Stat p={4} bg="white" borderRadius="md" boxShadow="md">
            <StatLabel fontSize="lg" fontWeight="medium" color="gray.600">
              Teachers
            </StatLabel>
            <StatNumber fontSize="2xl" color="teal.500">
              500
            </StatNumber>
            <StatHelpText>
              <StatArrow type="increase" color="green.400" />
              3.2%
            </StatHelpText>
          </Stat>
        </Stack>
      </StatGroup>
      <Divider />
      <Center my={8}>
        <Text
          fontSize={{ base: "2xl", md: "3xl" }}
          fontWeight="bold"
          color="teal.600"
          textAlign="center"
          position="relative"
          _after={{
            content: '""',
            width: "60px",
            height: "4px",
            backgroundColor: "teal.400",
            position: "absolute",
            bottom: "-6px",
            left: "50%",
            transform: "translateX(-50%)",
            borderRadius: "md",
          }}
        >
          ALL Courses
        </Text>
      </Center>
      <Stack
        paddingTop={"40px"}
        direction={{ base: "column", md: "row" }}
        spacing={4}
      >
        {showAlert && (
          <Alert status="error" variant="left-accent" borderRadius="md">
            <AlertIcon />
            <AlertTitle>Already in Cart!</AlertTitle>
            <AlertDescription>
              This item is already in your cart.
            </AlertDescription>
          </Alert>
        )}
        <Select
          placeholder="Select Category"
          mb={5}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="programing">Programming</option>
          <option value="language">Languages</option>
          <option value="humanities">Humanities</option>
        </Select>

        <Input
          placeholder="Search courses"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Stack>
      <SimpleGrid columns={columns} spacing={8} p={5}>
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) =>
            course.courses.map((data) => (
              <Card
                key={data._id}
                maxW="sm"
                boxShadow="lg"
                borderRadius="lg"
                _hover={{ transform: "scale(1.05)", transition: "0.3s" }}
              >
                <CardBody>
                  <Box
                    cursor="pointer"
                    onClick={() => handleClickgetTosingle(course._id)} // Navigate to single course page
                  >
                    <Image
                      src={`${process.env.REACT_APP_URL}/${data.imageUrl}`}
                      alt={data.title}
                      borderRadius="md"
                      boxSize="200px"
                      width={"100%"}
                      objectFit="cover"
                      mb={4}
                    />
                  </Box>
                  <Stack mt="3" spacing="3">
                    <Heading size="md" noOfLines={2}>
                      {data.title}
                    </Heading>
                    <Text noOfLines={3}>{data.description}</Text>
                    <Text color="teal.500" fontSize="xl" fontWeight="bold">
                      ${data.price}
                    </Text>
                  </Stack>
                </CardBody>
                <Divider />
                <CardFooter>
                  {idforChangebuttonMe.includes(course._id) ? (
                    <Button
                      variant="solid"
                      colorScheme="teal"
                      onClick={() => navigate("/mycourses")}
                    >
                      Learn now
                    </Button>
                  ) : (
                    <ButtonGroup spacing="2">
                      <Button
                        variant="solid"
                        colorScheme="teal"
                        onClick={() => navigate("/")}
                      >
                        Buy now
                      </Button>
                      <Button
                        onClick={() => handleAddToCart(course)}
                        variant="outline"
                        colorScheme="teal"
                      >
                        Add to cart
                      </Button>
                    </ButtonGroup>
                  )}
                </CardFooter>
              </Card>
            ))
          )
        ) : (
          <Center w="full" py={10}>
            <Text fontSize="xl" color="gray.500">
              No courses found.
            </Text>
          </Center>
        )}
      </SimpleGrid>
      <Box p={5}>
        <Text fontSize="2xl" fontWeight="bold" color="teal.600" mb={5}>
          User Comments & Ratings
        </Text>
        <Stack spacing={4}>
          {comments.map((comment, index) => (
            <CommentCard
              key={index}
              username={comment.username}
              avatarUrl={comment.avatarUrl}
              rating={comment.rating}
              commentText={comment.commentText}
            />
          ))}
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
}

export default Dashboard;
