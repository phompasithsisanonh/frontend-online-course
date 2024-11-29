import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Text,
  Stack,
  Button,
  Heading,
  Divider,
  Image,
  Flex,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Badge,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import { IdContext } from "../idContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Bar from "./Bar";

function Payment() {
  const navigate = useNavigate();
  const { idCarttoPayment } = useContext(IdContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = window.name;
  const [datacart, setDatacart] = useState(null);
  const [paymentSend, setPaymentSend] = useState({});
  const [typePayment, setTypePayment] = useState("cash");
  const [email, setEmail] = useState("");
  const [tel, setTel] = useState("");
  const [address, setAddress] = useState("");
  const discount = 10;

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_URL}/getPaymentcartId/${idCarttoPayment}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDatacart(response.data.cart_id);
        setEmail(response.data?.cart_id?.user?.email || "");
        setTel(response.data?.cart_id?.user?.tel || "");
        setAddress(response.data?.cart_id?.user?.address || "");
        setLoading(false);
      } catch (err) {
        setError("Error fetching cart data");
        setLoading(false);
      }
    };

    if (idCarttoPayment) {
      fetchCartData();
    } else {
      navigate("/cart");
    }
  }, [token, idCarttoPayment, navigate]);

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

  const handlePayment = async (id) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_URL}/payment/${id}`,
        {
          typePayment,
          statusAccess: "not access",
          email,
          tel,
          address,
          cart_id: datacart._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/cart");
    } catch (error) {
      setError("Failed to process payment. Please try again.");
      console.log(error);
    }
  };

  const totalAnddiscount = datacart.items.courses.reduce(
    (accumulator, currentValue) =>
      currentValue.price-(currentValue.price * (discount / 100)) ,
    0
  );

  return (
    <Box
      p={1}
      bg="white"

    >
      <Bar/>
      <Heading mb={6} fontSize="3xl" textAlign="center" color="gray.700">
       ລາຍລະອຽດຊຳລະ
      </Heading>
      
      <Stack spacing={8} mb={6}>
        {datacart.items.courses.map((data) => (
          <Box
            key={data._id}
            borderWidth="1px"
            borderRadius="lg"
            p={4}
            bg="gray.50"
            shadow="md"
            display="flex"
            gap={4}
            alignItems="center"
          >
            <Image
             src={`${process.env.REACT_APP_URL}/${data?.imageUrl}`}
              alt={data?.title}
              boxSize="120px"
              objectFit="cover"
              borderRadius="md"
            />
            <Box flex="1">
              <Heading size="md" color="gray.800">{data?.title}</Heading>
              <Text fontSize="sm" mt={2} color="gray.600">
                {data?.description}
              </Text>
              <Text fontWeight="bold" color="blue.600" mt={3}>
                ${data?.price}
              </Text>
            </Box>
          </Box>
        ))}
        
        <Divider />
        <Text color="gray.700" fontWeight="medium">
          Discount: {discount}%
        </Text>
        <Text fontWeight="bold" fontSize="lg" color="blue.600">
          Total: ${totalAnddiscount.toLocaleString()}
        </Text>
      </Stack>

      <Badge fontSize="18px" colorScheme="red" mb={4}>
        ໝາຍເຫດ: ລໍຖ້າ 15-30 ນາທີ
      </Badge>

      <VStack spacing={6} align="stretch">
        <FormControl isRequired>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            focusBorderColor="blue.500"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel htmlFor="tel">Phone Number</FormLabel>
          <Input
            id="tel"
            type="tel"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
            placeholder="Enter your phone number"
            focusBorderColor="blue.500"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel htmlFor="address">Address</FormLabel>
          <Input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your address"
            focusBorderColor="blue.500"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel htmlFor="payment-type">Payment Type</FormLabel>
          <RadioGroup value={typePayment} onChange={setTypePayment}>
            <Stack direction="row" spacing={8}>
              <Radio value="cash">Cash</Radio>
              <Radio value="bank">Bank Transfer</Radio>
            </Stack>
          </RadioGroup>
        </FormControl>

        <Button
          colorScheme="blue"
          size="lg"
          onClick={() => handlePayment(datacart._id)}
          _hover={{ bg: "blue.600" }}
          isFullWidth
        >
          ຊຳລະເງິນ
        </Button>
      </VStack>
    </Box>
  );
}

export default Payment;
