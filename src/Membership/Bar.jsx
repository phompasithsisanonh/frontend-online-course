import React from "react";
import {
  Box,
  Flex,
  Link,
  IconButton,
  HStack,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Spacer,
  VStack,
  Text,
} from "@chakra-ui/react";
import {
  FaShoppingCart,
  FaSignInAlt,
  FaRegAddressCard,
  FaBars,
} from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";
import { useCart } from "react-use-cart";

function Bar() {
  const { totalItems } = useCart();
  const token = window.name;
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box bg="blue.600" position="sticky" top="0" zIndex="1000">
      <Flex
        h={16}
        alignItems="center"
        justifyContent="space-between"
        px={{ base: 4, md: 8 }}
      >
        {/* Logo */}
        <Box color="white" fontWeight="bold" fontSize="xl">
          <Link as={RouterLink} to="/" _hover={{ textDecoration: "none" }}>
            OnlineCourses
          </Link>
        </Box>

        {/* Desktop Navigation */}
        <HStack
          spacing={8}
          display={{ base: "none", md: "flex" }}
          alignItems="center"
        >
          <Link
            as={RouterLink}
            to="/mycourses"
            color="white"
            _hover={{ color: "blue.300" }}
          >
            My Courses
          </Link>
          <Link
            as={RouterLink}
            to="/contact"
            color="white"
            _hover={{ color: "blue.300" }}
          >
            Contact
          </Link>
          <Link
            as={RouterLink}
            to="/wait-payment"
            color="white"
            _hover={{ color: "blue.300" }}
          >
            Wait Payment
          </Link>
        </HStack>

        <Spacer />

        {/* Right Side - Cart, Profile, Login/Register */}
        <HStack spacing={4}>
          {/* Cart with Badge */}
          <Box position="relative">
            <IconButton
              as={RouterLink}
              to="/cart"
              icon={<FaShoppingCart />}
              aria-label="Cart"
              colorScheme="whiteAlpha"
              variant="ghost"
            />
            {totalItems > 0 && (
              <Badge
                colorScheme="red"
                borderRadius="full"
                position="absolute"
                top="-2px"
                right="-2px"
                zIndex="1"
                fontSize="0.8em"
                p="1"
              >
                {totalItems}
              </Badge>
            )}
          </Box>

          {/* Profile or Auth Buttons */}
          {token ? (
            <Menu>
              <MenuButton>
                <Avatar size="sm" name="User Profile" />
              </MenuButton>
              <MenuList>
                <MenuItem as={RouterLink} to="/profile">
                  Profile
                </MenuItem>
                <MenuItem as={RouterLink} to="/signOut">
                  Sign Out
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <>
              <Button
                as={RouterLink}
                to="/login"
                size="sm"
                leftIcon={<FaSignInAlt />}
                colorScheme="whiteAlpha"
                variant="outline"
              >
                Login
              </Button>
              <Button
                as={RouterLink}
                to="/register"
                size="sm"
                leftIcon={<FaRegAddressCard />}
                colorScheme="whiteAlpha"
                variant="solid"
              >
                Register
              </Button>
            </>
          )}
        </HStack>

        {/* Mobile Menu Toggle */}
        <IconButton
          aria-label="Open Menu"
          icon={<FaBars />}
          display={{ base: "flex", md: "none" }}
          onClick={onOpen}
          colorScheme="whiteAlpha"
          variant="ghost"
        />
      </Flex>

      {/* Mobile Menu Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <VStack align="start" spacing={4}>
              <Link as={RouterLink} to="/" onClick={onClose}>
                Home
              </Link>
              <Link as={RouterLink} to="/mycourses" onClick={onClose}>
                My Courses
              </Link>
              <Link as={RouterLink} to="/contact" onClick={onClose}>
                Contact
              </Link>
              <Link as={RouterLink} to="/wait-payment" onClick={onClose}>
                Wait Payment
              </Link>
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            <Text fontSize="sm" color="gray.500">
              © 2024 OnlineCourses
            </Text>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}

export default Bar;
