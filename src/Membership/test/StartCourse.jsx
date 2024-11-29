import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
  Stack,
  Button,
  Image,
  Divider,
  Textarea,
  FormControl,
  FormLabel,
  Input,
  Flex,
} from "@chakra-ui/react";
import StarRatingComponent from "react-rating-stars-component";

function StartCourse() {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState([
    { user: "John", comment: "Great course!", rating: 5 },
    { user: "Jane", comment: "Very informative!", rating: 4 },
  ]);

  const courseData = {
    id: 1,
    title: "ReactJS",
    description: "Become proficient in React.js development.",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=8",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", // Example YouTube video
    price: 640,
    category: "programming",
    about: "This course teaches you everything you need to know about React.js, from the basics to advanced concepts.",
  };

  const submitComment = () => {
    setComments([...comments, { user: "Anonymous", comment, rating }]);
    setComment("");
    setRating(0);
  };

  return (
    <Box p={5} borderWidth="1px" borderRadius="lg" bg="white" shadow="md" maxW="800px" mx="auto">
      <Heading mb={5}>{courseData.title}</Heading>
      <Text fontSize="lg" mb={3}>{courseData.about}</Text>

      <Flex justifyContent="center" mb={5}>
        <iframe
          width="560"
          height="315"
          src={courseData.videoUrl}
          title={courseData.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </Flex>

      <Heading size="md" mb={3}>About This Course</Heading>
      <Text>{courseData.description}</Text>

      <Divider my={5} />

      <Heading size="md" mb={3}>Rate This Course</Heading>
      <StarRatingComponent
        name="rate1"
        starCount={5}
        value={rating}
        onStarClick={(value) => setRating(value)}
      />
      <FormControl mt={4}>
        <FormLabel>Leave a Comment</FormLabel>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What did you think of this course?"
          mb={3}
        />
        <Button onClick={submitComment} colorScheme="teal">Submit Comment</Button>
      </FormControl>

      <Divider my={5} />

      <Heading size="md" mb={3}>User Comments</Heading>
      <Stack spacing={4}>
        {comments.map((comment, index) => (
          <Box key={index} p={4} borderWidth="1px" borderRadius="lg" bg="gray.50">
            <Flex justifyContent="space-between" align="center">
              <Text fontWeight="bold">{comment.user}</Text>
              <StarRatingComponent
                name={`rate-comment-${index}`}
                starCount={5}
                value={comment.rating}
                editing={false}
              />
            </Flex>
            <Text mt={2}>{comment.comment}</Text>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

export default StartCourse;
