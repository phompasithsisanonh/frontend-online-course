import React, { useState, useEffect } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { storage, db } from "../../firebase"; // Firebase configuration
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Progress,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Firebase Authentication

function Temple() {
  const [fileList, setFileList] = useState([]); // Store files for each lesson
  const [title, setTitle] = useState(""); // Title
  const [uploadedBy, setUploadedBy] = useState(""); // Uploaded By
  const [description, setDescription] = useState(""); // Description
  const [image, setImage] = useState(""); // Image URL
  const [price, setPrice] = useState(""); // Course price
  const [progressList, setProgressList] = useState([]); // Progress for each lesson
  const [isUploading, setIsUploading] = useState(false); // Uploading state
  const [lessons, setLessons] = useState([]); // Multiple lessons
  const toast = useToast(); // Toast for alerts

  // Firebase Authentication
  const auth = getAuth();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Logged in as: ", user.uid, user.email);
        setAdmin(user); // Set the admin when user is authenticated
      } else {
        setAdmin(null); // No user is authenticated
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [auth]);

  // Add new lesson input fields dynamically
  const handleAddLesson = () => {
    setLessons([
      ...lessons,
      { titleSmaller: "", descriptionSmaller: "", videoUrl: "" },
    ]);
    setFileList([...fileList, null]); // Add placeholder for new file
    setProgressList([...progressList, 0]); // Add placeholder for progress
  };

  // Handle changes in lesson fields
  const handleLessonChange = (index, field, value) => {
    const updatedLessons = [...lessons];
    updatedLessons[index][field] = value;
    setLessons(updatedLessons);
  };

  // Handle file input change
  const handleFileChange = (index, file) => {
    const updatedFileList = [...fileList];
    updatedFileList[index] = file;
    setFileList(updatedFileList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fileList.length) {
      toast({
        title: "No file selected.",
        description: "Please choose a video file to upload.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    // Check if admin is authenticated
    if (!admin) {
      toast({
        title: "Not authenticated.",
        description:
          "You need to be logged in as an admin to upload videos. Please log in.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    const adminId = admin.uid;

    setIsUploading(true);

    try {
      const uploadTasks = fileList.map((file, index) => {
        if (file) {
          return new Promise((resolve, reject) => {
            const storageRef = ref(storage, `videos/${adminId}/${file.name}`); // Save video in folder by user ID
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
              "state_changed",
              (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                const updatedProgressList = [...progressList];
                updatedProgressList[index] = progress;
                setProgressList(updatedProgressList);
              },
              (error) => reject(error),
              async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                const updatedLessons = [...lessons];
                updatedLessons[index].videoUrl = downloadURL;
                setLessons(updatedLessons);
                resolve(downloadURL);
              }
            );
          });
        } else {
          return Promise.resolve(null);
        }
      });

      // Wait for all uploads to finish
      await Promise.all(uploadTasks);

      // Save metadata to Firestore
      const userVideosRef = doc(db, "videos", adminId); // Reference to user's document in "videos" collection
      await setDoc(userVideosRef, {
        userEmail: admin.email,
        adminId: adminId,
        courses: [
          {
            title: title,
            description: description,
            image: image,
            price: price,
            lessons: lessons, // Store the lessons with video URLs
            uploadDate: new Date(),
            uploadedBy: uploadedBy,
          },
        ],
      }, { merge: true }); // Merge with existing data if any

      toast({
        title: "Videos uploaded.",
        description: "Your video and lessons have been uploaded successfully!",
        status: "success",
        duration: 4000,
        isClosable: true,
      });

    } catch (err) {
      console.error("Error uploading videos: ", err);
      toast({
        title: "Error uploading videos.",
        description: "Failed to upload videos and save metadata.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }

    setIsUploading(false);
  };

  return (
    <Box p={6} maxW="600px" mx="auto">
      <Text fontSize="2xl" mb={4} fontWeight="bold">
        Upload Course
      </Text>
      <VStack spacing={5}>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl id="title" isRequired>
              <FormLabel>Course Title</FormLabel>
              <Input
                type="text"
                placeholder="Course Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormControl>
            <FormControl id="uploadedBy" isRequired>
              <FormLabel>Uploaded by</FormLabel>
              <Input
                type="text"
                placeholder="Uploaded by"
                value={uploadedBy}
                onChange={(e) => setUploadedBy(e.target.value)}
              />
            </FormControl>
            <FormControl id="description" isRequired>
              <FormLabel>Description</FormLabel>
              <Input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>
            <FormControl id="image" isRequired>
              <FormLabel>Image URL</FormLabel>
              <Input
                type="text"
                placeholder="Image URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </FormControl>
            <FormControl id="price" isRequired>
              <FormLabel>Price</FormLabel>
              <Input
                type="text"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </FormControl>

            {/* Dynamic lesson fields */}
            {lessons.map((lesson, index) => (
              <VStack
                key={index}
                spacing={4}
                border="1px solid #ccc"
                p={4}
                borderRadius="md"
              >
                <FormControl id={`titleSmaller-${index}`} isRequired>
                  <FormLabel>Lesson Title {index + 1}</FormLabel>
                  <Input
                    type="text"
                    placeholder="Lesson Title"
                    value={lesson.titleSmaller}
                    onChange={(e) =>
                      handleLessonChange(index, "titleSmaller", e.target.value)
                    }
                  />
                </FormControl>
                <FormControl id={`descriptionSmaller-${index}`} isRequired>
                  <FormLabel>Lesson Description {index + 1}</FormLabel>
                  <Input
                    type="text"
                    placeholder="Lesson Description"
                    value={lesson.descriptionSmaller}
                    onChange={(e) =>
                      handleLessonChange(
                        index,
                        "descriptionSmaller",
                        e.target.value
                      )
                    }
                  />
                </FormControl>
                <FormControl id={`file-${index}`} isRequired>
                  <FormLabel>Upload Video {index + 1}</FormLabel>
                  <Input
                    type="file"
                    onChange={(e) => handleFileChange(index, e.target.files[0])}
                  />
                </FormControl>
                {progressList[index] > 0 && (
                  <Progress
                    value={progressList[index]}
                    size="sm"
                    width="full"
                    colorScheme="green"
                  />
                )}
              </VStack>
            ))}

            <Button onClick={handleAddLesson} colorScheme="teal" width="full">
              Add Another Lesson
            </Button>

            <Button type="submit" colorScheme="blue" width="full" isDisabled={isUploading}>
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
}

export default Temple;
