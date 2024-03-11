import { useState } from 'react';
import { useRouter } from 'next/router';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {auth} from "../../firebase"
import {useAuth} from "../../firebase"
import {Container, Row, Col, Button, Form, FormGroup, Label, Input, Alert} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [passwordOne, setPasswordOne] = useState("");
  const [passwordTwo, setPasswordTwo] = useState("");
  const router = useRouter();
  const [error, setError] = useState(null);


  const onSubmit = event => {
    event.preventDefault(); // This should be at the beginning to prevent the default form submit behavior
    setError(null);
    // Check if passwords match. If they do, create user in Firebase
    // and redirect to your logged in page.
    if (passwordOne === passwordTwo) {
      createUserWithEmailAndPassword(auth, email, passwordOne)
        .then(authUser => {
          const displayName = email.substring(0, email.lastIndexOf("@")); // Stores the part of the email before the '@'
          updateProfile(authUser.user, {
            displayName: displayName,
          }).then(() => {
            console.log("Success. The user is created in Firebase");
            router.push("/profile/edit");
          }).catch(error => {
            // An error occurred while updating the profile. Set error message to be displayed to user
            setError(error.message);
          });
        }).catch(error => {
          // An error occurred during user creation. Set error message to be displayed to user
          setError(error.message);
        });
    } else {
      setError("Passwords do not match");
    }
  };
  

  return (
    <div>
    <div className="text-wrapper">Become a Groupie!</div>
    <Container className="text-center custom-container">
      <Row>
        <Col>
          <Form 
            className="custom-form"
            onSubmit={onSubmit}>
          { error && <Alert color="danger">{error}</Alert>}
            <FormGroup row>
              <Label for="signUpEmail" sm={4}>Email</Label>
              <Col sm={8}>
                <Input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  name="email"
                  id="signUpEmail"
                  placeholder="Email" />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="signUpPassword" sm={4}>Password</Label>
              <Col sm={8}>
                <Input
                  type="password"
                  name="passwordOne"
                  value={passwordOne}
                  onChange={(event) => setPasswordOne(event.target.value)}
                  id="signUpPassword"
                  placeholder="Password" />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="signUpPassword2" sm={4}>Confirm Password</Label>
              <Col sm={8}>
                <Input
                  type="password"
                  name="password"
                  value={passwordTwo}
                  onChange={(event) => setPasswordTwo(event.target.value)}
                  id="signUpPassword2"
                  placeholder="Password" />
              </Col>
            </FormGroup>
            <FormGroup row>
             <Col>
               <button className='signin-button'>Sign Up</button>
             </Col>
           </FormGroup>
          </Form>
        </Col>
      </Row>
    </Container>
    <div>
      Already have an account?
      <button className="signup-button" onClick={() => router.push('/login')}>Log In!</button>
    </div>
    </div>
  )
}

export default SignUp;