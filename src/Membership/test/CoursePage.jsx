import React, { useState, useEffect } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { Box, Text, Button, Stack, Divider } from "@chakra-ui/react";
import { db } from "../../firebase";
import ReactPlayer from "react-player";

function CoursePage() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      const q = query(collection(db, "videos")); // Assume 'courses' is the collection
      const courseDocs = await getDocs(q);
      const courseList = courseDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCourses(courseList);
    } catch (error) {
      console.error("Error fetching courses: ", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Function to select a course and display lessons
  const selectCourse = (course) => {
    setSelectedCourse(course);
    setSelectedLesson(course.lessons[0]); // Auto select the first lesson
  };

  return (
    <Box>
      <Text fontSize="2xl" mb={4}>Courses</Text>
      <Stack direction="row">
        {/* List of courses */}
        <Box width="30%" borderWidth={1} p={4} borderRadius="md">
          <Text fontSize="lg" fontWeight="bold">Available Courses</Text>
          {courses.map((course) => (
            <Button
              key={course.id}
              width="100%"
              mt={2}
              onClick={() => selectCourse(course)}
            >
              {course.title}
            </Button>
          ))}
        </Box>

        {/* Selected course with lessons */}
        {selectedCourse && (
          <Box width="70%" borderWidth={1} p={4} borderRadius="md">
            <Text fontSize="lg" fontWeight="bold">{selectedCourse.title}</Text>
            <Divider my={2} />
            <Stack direction="row" align="start">
              {/* Lessons list */}
              <Box width="30%">
                <Text fontSize="md" fontWeight="bold">Lessons</Text>
                {selectedCourse.lessons.map((lesson, index) => (
                  <Button
                    key={index}
                    width="100%"
                    mt={2}
                    onClick={() => setSelectedLesson(lesson)}
                    colorScheme={selectedLesson?.title === lesson.title ? "teal" : "gray"}
                  >
                    {lesson.title}
                  </Button>
                ))}
              </Box>

              {/* Video player and lesson details */}
              <Box width="70%">
                {selectedLesson && (
                  <Box>
                    <ReactPlayer
                      url={selectedLesson.videoUrl}
                      controls={true}
                      width="100%"
                    />
                    <Text fontSize="xl" mt={2}>{selectedLesson.titleSmall}</Text>
                    <Text>{selectedLesson.descriptionSmall}</Text>
                  </Box>
                )}
              </Box>
            </Stack>
          </Box>
        )}
      </Stack>
    </Box>
  );
}

export default CoursePage;
