import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";

function PaymentCoures() {
  const videos = JSON.parse(localStorage.getItem("video"));
  const [title, setTitle] = useState(videos.title);
  const [email, setEmail] = useState();
  const [tel, setTel] = useState();
  const [firstName, setFirstName] = useState("");
  const [bank, setBank] = useState("");
  const [bankSlip, setBankSlip] = useState("");
  return (
    <Flex direction={{ base: "column", md: "row" }}>
      <Box
        maxWidth="400px"
        mx="auto"
        mt={10}
        p={5}
        boxShadow="md"
        borderRadius="md"
        bg="white"
      display={'flex'}
      justifyContent={'center'}
      >
        <Text>{title}</Text>
      </Box>
      
      <Box
        maxWidth="400px"
        mx="auto"
        mt={10}
        p={5}
        boxShadow="md"
        borderRadius="md"
        bg="white"
      >
        <Heading as="h2" size="lg" mb={5} textAlign="center">
          Course Payment
        </Heading>

        <form>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your name"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <RadioGroup onChange={setBank} value={bank}>
              <Stack direction="row">
                <Radio value="1">BCEL</Radio>
                <Radio value="2">JDB</Radio>
                <Radio value="3">CASH</Radio>
              </Stack>
            </RadioGroup>

            <FormControl>
              <FormLabel>bank slip</FormLabel>
              <Input type="files" />
            </FormControl>

            <Button type="submit" colorScheme="blue" width="full" mt={4}>
              Pay Now
            </Button>
          </Stack>
        </form>
      </Box>
    </Flex>
  );
}

export default PaymentCoures;
