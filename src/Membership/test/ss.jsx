import React, { useState } from "react";
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
  } from "@chakra-ui/react";
  import { FaEdit, FaSave, FaCamera } from "react-icons/fa";
import Bar from "./Bar";

function Profile({
  user = [
    {
      name: "abc",
      courses: "ABC",
    },
    {
      name: "abc",
      courses: "ABC",
    },
  ],
  onUpdateProfile,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [courseCount, setCourseCount] = useState(1);
  const [profileData, setProfileData] = useState({
    name: user.name || "John Doe",
    email: user.email || "john.doe@example.com",
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleEditToggle = () => setEditMode((prev) => !prev);
  const handleEditToggleting = () => setIsEditing((prev) => !prev);
  const handleSaveting = () => {
    setIsEditing(false);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("pa");
    setEditMode(false);
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
          mb={2}
          bg="gray.100"
          maxW="md"
          position="relative"
        >
          <Avatar
            size="xl"
            name={profileData.name}
            src={profileData.avatarUrl || ""}
            onClick={onOpen} // Open avatar upload modal
            cursor="pointer"
            border="2px solid white"
            boxShadow="lg"
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
            {profileData.name}
          </Heading>
          <Text fontSize="sm" color="gray.600">
            {profileData.email}
          </Text>
        </Box>
        <IconButton
          ml="auto"
          icon={editMode ? <FaSave /> : <FaEdit />}
          onClick={editMode ? handleSave : handleEditToggle}
          aria-label="Edit Profile"
          colorScheme="blue"
          variant="outline"
        />
      </Flex>

      {/* Show input when editing */}
      {isEditing && (
        <>
          <Input type="file" accept="image/*" mt={4} />
          <Button colorScheme="blue" mt={4}>
            Upload New Avatar
          </Button>
        </>
      )}
      {/* Profile Content Tabs */}
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
                  <FormLabel>Name</FormLabel>
                  <Input
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Stack>
            ) : (
              <Box>
                <Heading size="md">Profile Information</Heading>
                <Text>Name: {profileData.name}</Text>
                <Text>Email: {profileData.email}</Text>
              </Box>
            )}
          </TabPanel>

          {/* Enrolled Courses Tab */}
          <TabPanel direction={{ base: "column", md: "row" }}>
            <Heading size="md" mb={4}>
              Your Courses
            </Heading>
            {user && user.length > 0 ? (
              user.map((course) => (
                <Box
                  key={course.id}
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  mb={2}
                  bg="gray.100"
                  maxW="md"
                  mx="auto"
                  direction={{ base: "row", md: "column" }}
                >
                  <Box>{course.courses}</Box>
                  <Text mt={2}>You are enrolled in</Text>
                  <Box>
                    {courseCount} {courseCount === 1 ? "Course" : "Courses"}
                  </Box>
                </Box>
              ))
            ) : (
              <Text>No enrolled courses.</Text>
            )}
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


        {/* Modal for Avatar Upload */}
        <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Avatar</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Select a new avatar</FormLabel>
              <Input
                type="file"
                accept="image/*"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSave} mr={3}>
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
