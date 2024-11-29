import React, { useEffect, useState } from "react";
import {
  Box,
  Avatar,
  Heading,
  Text,
  Button,
  Flex,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  FormControl,
  FormLabel,
  Input,
  Stack,
  IconButton,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  CircularProgress,
  CircularProgressLabel,
  Image,
} from "@chakra-ui/react";
import { FaEdit, FaSave, FaCamera } from "react-icons/fa";
import Bar from "./Bar";
import axios from "axios";

function Profile() {
  const [profileData, setProfileData] = useState({
    firstName: "",
    tel: "",
    address: "",
    detail: "",
    note: "",
    image: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = window.name; // Ensure this is secure
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  // Toggle edit mode
  const handleEditToggle = () => setEditMode((prev) => !prev);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_URL}/getprofile`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProfileData(response.data);
        toast({
          title: "Profile loaded.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Failed to load profile.",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token, toast]);
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      setProfileData((prev) => ({ ...prev, image: file })); // Update the state with the file
    }
  };

  // Save profile data
  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("firstName", profileData.firstName);
      formData.append("email", profileData.email);
      formData.append("tel", profileData.tel);
      formData.append("address", profileData.address);
      formData.append("note", profileData.note);
      formData.append("detail", profileData.detail);
      if (profileData.image) {
        formData.append("image", profileData.image);
      }
      await axios.post(`${process.env.REACT_APP_URL}/updateProfile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setEditMode(false);
      toast({
        title: "Profile updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to update profile.",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Bar />
      <Flex
        direction={{ base: "column", md: "row" }}
        padding="20px"
        align="center"
        justify="center"
        mb={6}
      >
        <Box
          p={4}
          borderWidth="1px"
          borderRadius="md"
          bg="gray.100"
          maxW="md"
          position="relative"
        >
          <Avatar
            size="xl"
            cursor="pointer"
            border="2px solid white"
            boxShadow="lg"
            src={`${process.env.REACT_APP_URL}/${profileData.image}`}
            onClick={onOpen}
          />

          <IconButton
            position="absolute"
            bottom="0"
            right="0"
            size="sm"
            aria-label="Edit Avatar"
            icon={<FaCamera />}
            onClick={onOpen}
            colorScheme="blue"
            borderRadius="50%"
          />
        </Box>
        <Box ml={4} textAlign="center">
          <Heading size="lg" mb={2}>
            {profileData?.firstName || ""}
          </Heading>
        </Box>
        <IconButton
          ml="auto"
          icon={editMode ? <FaSave /> : <FaEdit />}
          onClick={editMode ? handleSave : handleEditToggle}
          aria-label="Edit Profile"
          colorScheme="blue"
          variant="outline"
          isLoading={loading}
        />
      </Flex>

      {/* Profile Tabs */}
      <Tabs variant="enclosed" colorScheme="blue">
        <TabList>
          <Tab>Overview</Tab>
          <Tab>Enrolled Courses</Tab>
          <Tab>Settings</Tab>
        </TabList>
        <TabPanels>
          {/* Overview Tab */}
          <TabPanel>
            {editMode ? (
              <Stack spacing={4}>
                <FormControl>
                  <FormLabel>firstName</FormLabel>
                  <Input
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    isDisabled
                    value={profileData.email}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>address</FormLabel>
                  <Input
                    name="address"
                    type="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>tel</FormLabel>
                  <Input
                    name="tel"
                    type="tel"
                    value={profileData?.tel}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>detail</FormLabel>
                  <Input
                    name="detail"
                    type="detail"
                    value={profileData?.detail}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>note</FormLabel>
                  <Input
                    name="note"
                    type="note"
                    value={profileData?.note}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Stack>
            ) : (
              <Box>
                <Heading size="md" mb={4}>
                  Profile Information
                </Heading>
                <Stack spacing={2}>
                  <Text fontSize="sm" color="gray.700">
                    <strong>Name:</strong> {profileData?.firstName || "N/A"}
                  </Text>
                  <Text fontSize="sm" color="gray.700">
                    <strong>Email:</strong> {profileData?.email || "N/A"}
                  </Text>
                  <Text fontSize="sm" color="gray.700">
                    <strong>Detail:</strong> {profileData?.detail || "N/A"}
                  </Text>
                  <Text fontSize="sm" color="gray.700">
                    <strong>Address:</strong> {profileData?.address || "N/A"}
                  </Text>
                  <Text fontSize="sm" color="gray.700">
                    <strong>Telephone:</strong> {profileData?.tel || "N/A"}
                  </Text>
                  <Text fontSize="sm" color="gray.700">
                    <strong>Note:</strong> {profileData?.note || "N/A"}
                  </Text>
                </Stack>
              </Box>
            )}
          </TabPanel>

          {/* Enrolled Courses Tab */}
          <TabPanel>
            <Heading size="md" mb={4}>
              Your Courses
            </Heading>
            {/* Add logic to display courses */}
            <Text>No enrolled courses.</Text>
          </TabPanel>

          {/* Settings Tab */}
          <TabPanel>
            <Heading size="md" mb={4}>
              Account Settings
            </Heading>
            <Button colorScheme="red">Delete Account</Button>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Avatar Upload Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Avatar</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Select a new avatar</FormLabel>
              <Input
                name="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange} // Update to handle file input change
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose} mr={3}>
              Save Changes
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Profile;
