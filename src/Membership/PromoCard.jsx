import React from "react";
import Slider from "react-slick";
import { Box, Image, Text, Stack, Center } from "@chakra-ui/react";

const PromoCard = () => {
  const promoData = [
    {
      imageUrl: "https://example.com/image1.jpg",
      title: "The Sounds of Winter are Gone",
      description: "A beautiful story about letting go and moving on.",
    },
    {
      imageUrl: "https://example.com/image2.jpg",
      title: "Success Beyond Limits",
      description: "An inspirational journey to financial freedom.",
    },
    {
      imageUrl: "https://example.com/image3.jpg",
      title: "Come Back!",
      description: "A gripping tale of second chances and redemption.",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <Box maxW="1000px" mx="auto" py={5}>
      <Slider {...settings}>
        {promoData.map((promo, index) => (
          <Box key={index} position="relative" p={2}>
            <Image
              src={promo.imageUrl}
              alt={promo.title}
              objectFit="cover"
              width="100%"
              height="300px"
              borderRadius="md"
              boxShadow="md"
            />
            <Center position="absolute" top="0" left="0" w="100%" h="100%">
              <Box
                bg="rgba(0, 0, 0, 0.6)"
                p={4}
                borderRadius="md"
                textAlign="center"
                color="white"
              >
                <Stack spacing={2}>
                  <Text fontSize="lg" fontWeight="bold">
                    {promo.title}
                  </Text>
                  <Text fontSize="sm">{promo.description}</Text>
                </Stack>
              </Box>
            </Center>
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default PromoCard;
