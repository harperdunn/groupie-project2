import { useState } from 'react';
import { useRouter } from 'next/router';
import { signInWithEmailAndPassword } from "firebase/auth"; // Updated import for signing in
import { auth } from "../../firebase";
import { Container, Row, Col, Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const SignIn = () => { // Component name updated for clarity
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Simplified for sign in
  const router = useRouter();
  const [error, setError] = useState(null);

  const onSubmit = event => {
    event.preventDefault(); // Moved to prevent form submission if JS fails
    setError(null);
    
    signInWithEmailAndPassword(auth, email, password) // Updated to sign in
      .then(authUser => {
        console.log("Success. The user is signed in to Firebase");
        router.push("/profile/edit"); // Or any other path you want the user to go to after sign-in
      })
      .catch(error => {
        // An error occurred. Set error message to be displayed to user
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
    <Button color="secondary" onClick={() => router.push('./signUpWithUsername')}>Sign Up (New User)</Button> {/* Add navigation to the Sign Up page */}
  </Col>
</FormGroup>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default SignIn; // Updated for clarity
