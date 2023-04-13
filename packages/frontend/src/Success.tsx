import { Container, Heading, Stack, Text } from "@chakra-ui/react";

export default function Success() {
  return (
    <Container maxW={"container.sm"} h="100vh">
      <Stack
        spacing={2}
        alignContent={"center"}
        alignItems={"center"}
        justifyItems={"center"}
        justifyContent={"center"}
        h="100%"
      >
        <Heading as="h2">Success</Heading>
        <Text>Thank you for verifying your email!</Text>
      </Stack>
    </Container>
  );
}
