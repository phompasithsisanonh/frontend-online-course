import { Box, Flex, Heading, VStack, FormControl, FormLabel, Input, Textarea, Button, Text, AspectRatio } from "@chakra-ui/react";
import Bar from "./Bar";
import Footer from "./Footer";

function Contact() {
  return (
    <Box bg="gray.50" py={10} px={5} borderRadius="md" boxShadow="md">
     <Bar/>
      <Flex direction="column" align="center" maxW="800px" mx="auto">
        <Heading as="h2" size="lg" mb={5} color="teal.500">
          Contact Us
        </Heading>
        <Text fontSize="md" color="gray.600" mb={6} textAlign="center">
          Have questions or need support? Fill out the form below and we’ll get back to you as soon as possible.
        </Text>
        <VStack spacing={4} w="100%" mb={8}>
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input placeholder="Enter your name" focusBorderColor="teal.500" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input type="email" placeholder="Enter your email" focusBorderColor="teal.500" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Message</FormLabel>
            <Textarea placeholder="Write your message here..." focusBorderColor="teal.500" />
          </FormControl>
          <Button colorScheme="teal" size="md" w="full" mt={4}>
            Send Message
          </Button>
        </VStack>

        {/* Embedded Google Map */}
        <AspectRatio ratio={16 / 9} w="100%">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509377!2d144.95373531531672!3d-37.81627937975154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf577efaf5e0d4e77!2sFederation%20Square!5e0!3m2!1sen!2sus!4v1699037930927!5m2!1sen!2sus"
            title="Google Map Location"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </AspectRatio>
      </Flex>
      <Footer/>
    </Box>
  );
}

export default Contact;
