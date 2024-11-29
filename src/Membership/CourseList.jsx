// src/CourseCard.js
import {
    Box,
    Image,
    Text,
    Heading,
    VStack,
    HStack,
    Stack,
    Divider,
    Link,
  } from "@chakra-ui/react";
  import { StarIcon } from "@chakra-ui/icons";
  import React from "react";
  
  const CourseCard = ({ image, title, instructor, rating, reviews, hours, lectures, level, price }) => {
    return (
      <Box maxW="xs" borderWidth="1px" borderRadius="md" overflow="hidden" p={4} m={2}>
        <Image src={image} alt={title} borderRadius="md" />
  
        <VStack align="start" mt={4}>
          <Heading size="sm" noOfLines={2}>
            {title}
          </Heading>
          <Text fontSize="sm" color="gray.500">
            {instructor}
          </Text>
  
          <HStack>
            <Text fontSize="sm" color="yellow.500">
              {rating.toFixed(1)}
            </Text>
            <HStack spacing="1px">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} color={i < Math.round(rating) ? "yellow.500" : "gray.300"} />
              ))}
            </HStack>
            <Text fontSize="sm" color="gray.500">
              ({reviews})
            </Text>
          </HStack>
  
          <Text fontSize="sm" color="gray.500">
            ทั้งหมด {hours} ชั่วโมง • {lectures} การบรรยาย • {level}
          </Text>
  
          <Text fontWeight="bold" fontSize="lg">
            US${price}
          </Text>
        </VStack>
      </Box>
    );
  };
  
  // src/CourseList.js
  const CourseList = () => {
    const courses = [
      {
        image: "https://example.com/react-image.jpg",
        title: "พัฒนาเว็บแอพพลิเคชั่นด้วย React (Real-World Projects)",
        instructor: "Kong Ruksiam",
        rating: 4.7,
        reviews: 445,
        hours: 12.5,
        lectures: 99,
        level: "ทุกระดับ",
        price: 74.99,
      },
      {
        image: "https://example.com/js-image.jpg",
        title: "พัฒนาเว็บด้วย JavaScript 40 Workshop (Building 40 Projects)",
        instructor: "Kong Ruksiam",
        rating: 4.8,
        reviews: 511,
        hours: 48.5,
        lectures: 249,
        level: "ระดับกลาง",
        price: 64.99,
      },
      {
        image: "https://example.com/ts-image.jpg",
        title: "เจาะลึก TypeScript ตั้งแต่เริ่มต้นจนใช้งานจริง",
        instructor: "Kong Ruksiam",
        rating: 4.9,
        reviews: 227,
        hours: 12,
        lectures: 102,
        level: "ระดับผู้เริ่ม",
        price: 49.99,
      },
    ];
  
    return (
      <Box maxW="4xl" mx="auto" p={5}>
        <Heading size="lg" mb={4} color="purple.700">
          หลักสูตรเพิ่มเติมโดย <Link color="purple.500">Kong Ruksiam</Link>
        </Heading>
        <HStack spacing={4} wrap="wrap" justify="space-between">
          {courses.map((course, index) => (
            <CourseCard key={index} {...course} />
          ))}
        </HStack>
        <Divider my={8} />
        <Box textAlign="center">
          <Text fontSize="lg">รายงานการสั่งจงละเอียด</Text>
        </Box>
      </Box>
    );
  };
  
  export default CourseList;
  