import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Text,
  Heading,
  VStack,
  HStack,
  Avatar,
  Divider,
  IconButton,
  Button,
  SimpleGrid,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import { FaThumbsUp, FaThumbsDown, FaEllipsisV } from "react-icons/fa";

// ReviewCard Component
const ReviewCard = ({ comment, name, rating, timeAgo }) => {
  const nowTimestamp = Date.now();
  const timeDifference = nowTimestamp - new Date(timeAgo);
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  let timeago = "";
  if (days > 0) {
    timeago = `${days} day(s) ago`;
  } else if (hours > 0) {
    timeago = `${hours} hour(s) ago`;
  } else if (minutes > 0) {
    timeago = `${minutes} minute(s) ago`;
  } else {
    timeago = `${seconds} second(s) ago`;
  }

  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="md"
      overflow="hidden"
      p={4}
      m={2}
      boxShadow="sm"
    >
      <HStack spacing={4}>
        <Avatar />
        <VStack align="start" spacing={0}>
          <Heading size="sm">{name || "Student"}</Heading>
          <Text fontSize="xs" color="gray.500">
            {timeago || "Just now"}
          </Text>
        </VStack>
        <IconButton
          icon={<FaEllipsisV />}
          aria-label="More options"
          variant="ghost"
          size="sm"
          ml="auto"
        />
      </HStack>

      <HStack spacing={1} mt={2}>
        {[...Array(5)].map((_, i) => (
          <StarIcon key={i} color={i < rating ? "yellow.500" : "gray.300"} />
        ))}
      </HStack>
      <Text mt={2} fontSize="sm" noOfLines={4}>
        {comment}
      </Text>

      <Divider my={4} />

      <HStack spacing={4}>
        <Text fontSize="xs" color="gray.500">
          ເປັນປະໂຫຍດບໍ່?
        </Text>
        <IconButton
          icon={<FaThumbsUp />}
          aria-label="Useful"
          variant="ghost"
          size="sm"
        />
        <IconButton
          icon={<FaThumbsDown />}
          aria-label="Not useful"
          variant="ghost"
          size="sm"
        />
      </HStack>
    </Box>
  );
};

// ReviewList Component
const ReviewList = ({ courseData }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [getcomment, setGetcomment] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchcomment = async () => {
      try {
        const url = `${process.env.REACT_APP_URL}/allcommentCourese/${courseData}`;
        const res = await axios.get(url);
        setGetcomment(res.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching comments");
        setLoading(false);
      }
    };
    fetchcomment();
  }, [courseData]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text color="red.500">Error: {error}</Text>;
  }

  const totalRating = getcomment.reduce(
    (total, item) => total + item.rating,
    0
  );
  const averageRating = totalRating / getcomment.length || 0;

  // Comments to display
  const commentsToShow = showAll ? getcomment : getcomment.slice(0, 2);

  // Toggle Read More/Less
  const handleReadMore = () => {
    setShowAll(!showAll);
  };

  return (
    <Box maxW="4xl" mx="auto" p={5}>
      <HStack spacing={2}>
        <StarIcon color="yellow.500" />
        <Text fontSize="lg" fontWeight="bold" color="yellow.600"></Text>
        <StarIcon
          key={0}
          value={averageRating}
          color={0 < averageRating ? "yellow.500" : "gray.300"}
        />

        <Heading size="md">
          คะแนนหลักสูตร {averageRating.toFixed(1)} คะแนน
        </Heading>
        <Text fontSize="md">• {totalRating} ລີວິວ</Text>
      </HStack>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} mt={4}>
        {commentsToShow.map((item) => (
          <ReviewCard
            key={item._id}
            rating={item.rating}
            comment={item.comment}
            timeAgo={item.createdAt}
            name={item.user?.name}
          />
        ))}
      </SimpleGrid>

      {getcomment.length > 2 && (
        <Button
          mt={4}
          onClick={handleReadMore}
          variant="outline"
          colorScheme="purple"
        >
          {showAll ? "ປິດລີວິວ" : "ເບີ່ງລີວິວທັງໝົດ"}
        </Button>
      )}
    </Box>
  );
};

export default ReviewList;
