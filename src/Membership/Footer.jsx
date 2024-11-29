import {
    Box,
    Container,
    Stack,
    Text,
    Link,
    Divider,
    SimpleGrid,
    Heading,
    Flex,
    useBreakpointValue,
  } from "@chakra-ui/react";
  
  function Footer() {
    return (
      <Box bg="gray.800" color="gray.300" py={10} mt={10}>
        <Container maxW="6xl">
          <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
            {/* About Us */}
            <Box>
              <Heading as="h4" size="md" mb={4} color="white">
                About Us
              </Heading>
              <Text fontSize="sm">
                We provide top-quality online courses to help you achieve your learning goals.
              </Text>
            </Box>
  
            {/* Courses */}
            <Box>
              <Heading as="h4" size="md" mb={4} color="white">
                Courses
              </Heading>
              <Stack spacing={2}>
                <Link href="#" _hover={{ textDecoration: "underline" }}>Web Development</Link>
                <Link href="#" _hover={{ textDecoration: "underline" }}>Data Science</Link>
                <Link href="#" _hover={{ textDecoration: "underline" }}>Design</Link>
                <Link href="#" _hover={{ textDecoration: "underline" }}>Marketing</Link>
              </Stack>
            </Box>
  
            {/* Support */}
            <Box>
              <Heading as="h4" size="md" mb={4} color="white">
                Support
              </Heading>
              <Stack spacing={2}>
                <Link href="#" _hover={{ textDecoration: "underline" }}>FAQs</Link>
                <Link href="#" _hover={{ textDecoration: "underline" }}>Contact Us</Link>
                <Link href="#" _hover={{ textDecoration: "underline" }}>Help Center</Link>
                <Link href="#" _hover={{ textDecoration: "underline" }}>Privacy Policy</Link>
              </Stack>
            </Box>
  
            {/* Social Media */}
            <Box>
              <Heading as="h4" size="md" mb={4} color="white">
                Follow Us
              </Heading>
              <Stack spacing={2}>
                <Link href="#" _hover={{ textDecoration: "underline" }}>Facebook</Link>
                <Link href="#" _hover={{ textDecoration: "underline" }}>Twitter</Link>
                <Link href="#" _hover={{ textDecoration: "underline" }}>Instagram</Link>
                <Link href="#" _hover={{ textDecoration: "underline" }}>LinkedIn</Link>
              </Stack>
            </Box>
          </SimpleGrid>
  
          <Divider my={8} borderColor="gray.600" />
  
          <Flex justifyContent="center" wrap="wrap">
            <Text fontSize="sm" color="gray.500" textAlign="center">
              © {new Date().getFullYear()} Online Course Platform. All rights reserved.
            </Text>
          </Flex>
        </Container>
      </Box>
    );
  }
  
  export default Footer;
  