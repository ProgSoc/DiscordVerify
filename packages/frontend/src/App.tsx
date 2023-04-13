import { useState } from "react";
import viteLogo from "/vite.svg";
import useAuthStatus from "./hooks/useAuthStatus";
import {
  Container,
  Stack,
  Heading,
  Link,
  Button,
  FormControl,
  useToast,
  Input,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import useVerifyEmail from "./hooks/useVerifyEmail";

interface EmailVerifyForm {
  email: string;
}

function App() {
  const authStatusQuery = useAuthStatus();
  const mutateEmail = useVerifyEmail();
  const toast = useToast();

  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    setError,
    reset,
  } = useForm<EmailVerifyForm>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<EmailVerifyForm> = async (data) => {
    try {
      await mutateEmail.mutateAsync(data);
      reset({ email: "" });
      toast({
        title: "Email sent",
        description: "Check your email for a verification link",
        status: "success",
      });
    } catch (error) {
      if (error instanceof Error) {
        setError("email", { type: "manual", message: error.message });
      }
    }
  };

  if (authStatusQuery.isLoading) return <div>Loading...</div>;
  if (authStatusQuery.isError)
    return <div>Error: {authStatusQuery.error.message}</div>;

  if (!authStatusQuery.data.loggedIn) {
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
          <Heading as="h2">Login</Heading>
          <Button as="a" href="/api/auth/discord">
            Login
          </Button>
        </Stack>
      </Container>
    );
  }

  return (
    <Container
      maxW={"container.sm"}
      h="100vh"
      as="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Stack
        spacing={5}
        h="100%"
        alignContent={"center"}
        // alignItems={"center"}
        // justifyItems={"center"}
        justifyContent={"center"}
      >
        <Heading as="h2">Verify Email</Heading>
        <FormControl isInvalid={!!errors.email}>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            type="email"
            placeholder="Email"
            id="email"
            {...register("email", { required: true })}
          />
          {errors.email ? (
            <FormErrorMessage>{errors.email.message}</FormErrorMessage>
          ) : (
            <FormHelperText>Enter your email to verify</FormHelperText>
          )}
        </FormControl>
        <Button type="submit" isLoading={isSubmitting}>
          Verify
        </Button>
      </Stack>
    </Container>
  );
}

export default App;
