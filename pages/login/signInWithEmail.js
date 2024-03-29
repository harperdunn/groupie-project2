import { useState } from 'react';
import { useRouter } from 'next/router';
import { signInWithEmailAndPassword, updateProfile } from "firebase/auth"; // Updated import for signing in
import { auth, useAuth } from "../../firebase";
import { Container, Row, Col, Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css'
import './signIn.css';

/**
 * SignIn component for user authentication with email and password.
 */
const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState(null);
  const { currentUser } = useAuth(); 

  /**
   * Handles the form submission for signing in.
   * @param {React.FormEvent<HTMLFormElement>} event - The form event.
   */
  const onSubmit = event => {
    event.preventDefault();
    setError(null);
    
    signInWithEmailAndPassword(auth, email, password)
      .then((authUser) => { 
        if (currentUser && currentUser.displayName == null) { // Corrected syntax for condition check
          const displayName = email.substring(0, email.lastIndexOf("@")); // Correct usage of email to get displayName
          updateProfile(authUser.user, { displayName: displayName })
            .then(() => {
              console.log("Display name updated successfully");
            }).catch((error) => {
              console.error("Error updating display name", error);
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
    <div className='signIn-page-container'>
      <img className="groupie-banner" src='/Banner.png'></img>
      <div className='signIn-content-container'>
        <h1>Hey, Groupie!</h1>
        <Container className="text-center custom-container">
          <Row>
            <Col>
              <Form className="custom-form" onSubmit={onSubmit}>
                { error && <Alert color="danger">{error}</Alert> }
                <FormGroup row>
                  <Label for="signInEmail" sm={4}><h2>Email:</h2></Label>
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
                  <Label for="signInPassword" sm={4}><h2>Password:</h2></Label>
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
                  <Col sm={{ size: 8, offset: 2 }}> 
                    <button className="signin-button">Sign In</button> 
                  </Col>
                </FormGroup>
              </Form>
            </Col>
          </Row>
        </Container>
        <div>
          Don't have an account?
          <button className="signup-button" onClick={() => router.push('/login/signUpWithEmail')}>Sign Up!</button> {/* Add navigation to the Sign Up page */}
        </div>
      </div>
      <img className="groupie-banner2" src='/Banner.png'></img>
    </div>
  );  
};

export default SignIn; // Updated for clarity
