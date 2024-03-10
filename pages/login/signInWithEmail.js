import { useState } from 'react';
import { useRouter } from 'next/router';
import { signInWithEmailAndPassword, updateProfile } from "firebase/auth"; // Updated import for signing in
import { auth, useAuth } from "../../firebase";
import { Container, Row, Col, Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css'

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState(null);
  const { currentUser } = useAuth(); // This should be outside your `onSubmit` function

  const onSubmit = event => {
    event.preventDefault();
    setError(null);
    
    signInWithEmailAndPassword(auth, email, password)
      .then((authUser) => { // Corrected syntax for .then() callback function
        if (currentUser && currentUser.displayName == null) { // Corrected syntax for condition check
          const displayName = email.substring(0, email.lastIndexOf("@")); // Correct usage of email to get displayName
          updateProfile(authUser.user, { displayName: displayName })
            .then(() => {
              console.log("Display name updated successfully");
              // You can redirect or do additional tasks here
            }).catch((error) => {
              console.error("Error updating display name", error);
              // Handle errors for updateProfile here
            });
        }
        console.log("Success. The user is signed in to Firebase");
        router.push("/profile/view");
      })
      .catch(error => {
        // An error occurred
        setError(error.message);
      });
  };

  return (
    <Container className="text-center custom-container">
      <Row>
        <Col>
          <Form className="custom-form" onSubmit={onSubmit}>
            { error && <Alert color="danger">{error}</Alert> }
            <FormGroup row>
              <Label for="signInEmail" sm={4}>Email</Label>
              <Col sm={8}>
                <Input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  name="email"
                  id="signInEmail"
                  placeholder="Email" />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="signInPassword" sm={4}>Password</Label>
              <Col sm={8}>
                <Input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  id="signInPassword"
                  placeholder="Password" />
              </Col>
            </FormGroup>
            <FormGroup row>
  <Col sm={{ size: 8, offset: 4 }}> {/* Adjust the size and offset as needed */}
    <Button className="mr-2">Sign In</Button> {/* Add a margin-right to separate the buttons */}
    <Button color="secondary" onClick={() => router.push('./signUpWithEmail')}>Sign Up (New User)</Button> {/* Add navigation to the Sign Up page */}
  </Col>
</FormGroup>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default SignIn; // Updated for clarity
