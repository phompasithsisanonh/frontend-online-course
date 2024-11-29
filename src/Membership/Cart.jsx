import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Text,
  Stack,
  Button,
  Heading,
  Divider,
  Image,
  Flex,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import Bar from "./Bar";
import axios from "axios";
import { IdContext } from "../idContext";
import { useNavigate } from "react-router-dom";
import { useCart } from "react-use-cart";
function Cart() {
  const { setIdCarttoPayment } = useContext(IdContext);
  const navigate = useNavigate();
  const [cartData, setCartData] = useState({
    cartCount: 0,
    cartList: [],
  });
  const [dataHistory, setDataHistory] = useState("");
  const [paymentdata, setPaymentdata] = useState("");
  const [cartpaymentdata, setCartpaymentdata] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [moreDataID, setMoreDataID] = useState(null);
  const sortedCart = cartData.cartList.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  
  const [iddelete, setIddelete] = useState("");
  const { removeItem,items } = useCart();
  const token = window.name;
  const handleClickProccess = (id) => {
    console.log(id);
    setIdCarttoPayment(id);
    navigate("/payment");
  };
  const user = JSON.parse(localStorage.getItem("user"));
  const Id = user.user._id.trim();

  useEffect(() => {
    const paymentAccess = async () => {
      try {
        // Log the URL to verify it's correct
        const url = `${process.env.REACT_APP_URL}/gethistory/${Id}`;
        const res = await axios.get(url);
        setDataHistory(res.data.userRecord.historycourseforpayment.cart_id);

        const item_more = res.data.userRecord_more.map((item) => item);
        const item_more_1 = item_more.map(
          (data) => data.historycourseforpayment.cart_id
        );
        const itemfordeletereaactUsercart = item_more.map(
          (data) => data.historycourseforpayment.cart._id
        );
        setIddelete(itemfordeletereaactUsercart);
        setMoreDataID(item_more_1);
      } catch (error) {
        console.log(error);
      }
    };
    //pedding acess payment
    const fetchCartData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_URL}/getcart`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        ); // Replace with your actual API endpoint
        setCartData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching cart data");
        setLoading(false);
      }
    };
    const fetchpaymentdata = async (id) => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_URL}/getpayment`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        ); // Replace with your actual API endpoint
        setPaymentdata(response.data.getpayment._id);
        setCartpaymentdata(response.data.getpayment.cart);
        setLoading(false);
      } catch (err) {
        setError("Error fetching cart data");
        setLoading(false);
      }
    };
    paymentAccess();
    fetchCartData();
    fetchpaymentdata();
    const te = cartData.cartList.filter((item) =>
      iddelete.includes(item.items._id) // Check if the item's ID exists in the `iddelete` array
    );
    
    te.forEach((item) => {
      removeItem(item.items._id); // Remove items that match the condition
    });
  }, [
    token,
    dataHistory,
    paymentdata,
    Id,
    moreDataID,
    cartData,
    removeItem,
    iddelete,
    items
  ]);
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
    </Center>;
  }
  // Calculate the total price
  // const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);

  return (
    <Box p={5} borderWidth="1px" borderRadius="lg" bg="white" shadow="md">
      <Bar cartCount={cartData.cartCount} />
      <Heading mb={5} fontSize="2xl" textAlign="center">
        Your Cart
      </Heading>

      {cartData.cartList.length === 0 ? (
        <Text>Your cart is empty.</Text>
      ) : (
        
        <Stack spacing={6}>
          {sortedCart.map((item, index) => (
            <>
              {item.items.courses.map((item_1, index) => (
                <Box
                  key={index}
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
                      src={`${process.env.REACT_APP_URL}/${item_1.imageUrl}`}
                      alt={item_1.title}
                      boxSize="100px"
                      objectFit="cover"
                      borderRadius="md"
                      flexShrink={0}
                    />
                    <Box flex="1">
                      <Heading size="md">{item_1.title}</Heading>
                      <Text fontSize="sm" mt={1} color="gray.600">
                        {item_1.description}
                      </Text>
                      <Text fontWeight="bold" color="blue.600" mt={2}>
                        ${item_1.price}
                      </Text>
                    </Box>
                    {cartpaymentdata === item._id ? (
                      <Button isDisabled colorScheme="orange">
                        Pending Approval
                      </Button>
                    ) : (
                      <>
                        {moreDataID && moreDataID.includes(item._id) ? (
                          <Text color="green.500">Already Purchased</Text>
                        ) : (
                          <Button
                            colorScheme="blue"
                            onClick={() => handleClickProccess(item._id)}
                          >
                            Proceed to Payment
                          </Button>
                        )}
                      </>
                    )}
                  </Flex>
                </Box>
              ))}
            </>
          ))}

          <Divider />

          <Box textAlign="center">
            <Text fontWeight="bold" fontSize="lg" mb={4}></Text>
          </Box>
        </Stack>
      )}
    </Box>
  );
}

export default Cart;
