import { useState } from 'react';
import { useRouter } from 'next/router';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {auth} from "../../firebase"
import {useAuth} from "../../firebase"
import {Container, Row, Col, Button, Form, FormGroup, Label, Input, Alert} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './signUp.css';

/**
 * Component for handling user sign-up.
 * Allows new users to create an account by providing email, username, and password.
 */
const SignUp = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [passwordOne, setPasswordOne] = useState("");
  const [passwordTwo, setPasswordTwo] = useState("");
  const router = useRouter();
  const [error, setError] = useState(null);


  /**
   * Handles the submission of the sign-up form.
   * Creates a new user account with email and password authentication.
   * @param {React.FormEvent<HTMLFormElement>} event - The form event triggered by submitting the sign-up form.
   */
  const onSubmit = event => {
    event.preventDefault(); // Prevents the default form submit behavior
    setError(null);
    // Check if passwords match. If they do, creates user in Firebase and redirects logged in page.
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
            // An error occurred while updating the profile. 
            setError(error.message);
          });
        }).catch(error => {
          // An error occurred during user creation. 
          setError(error.message);
        });
    } else {
      setError("Passwords do not match");
    }
  };
  

  //renders sign up with a form to create account with e-mail and password. Options to sign in instead, which routes to the sign in page.
  return (
    <div className='signUp-page-container'>
      <img className="groupie-banner" src='/Banner.png'></img>
      <div className='signUp-content-container'>
    <h1>Become a Groupie!</h1>
    <Container className="text-center custom-container">
      <Row>
        <Col>
          <Form 
            className="custom-form"
            onSubmit={onSubmit}>
          { error && <Alert color="danger">{error}</Alert>}
            <FormGroup row>
              <Label for="signUpEmail" sm={4}>Email:</Label>
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
              <Label for="signUpPassword" sm={4}>Password:</Label>
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
              <Label for="signUpPassword2" sm={4}>Confirm Password:</Label>
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
               <button className='signUp-button'>Sign Up</button>
             </Col>
           </FormGroup>
          </Form>
        </Col>
      </Row>
    </Container>
    <div>
      Already have an account?
      <button className="login-button" onClick={() => router.push('/login')}>Log In!</button>
    </div>
    </div>
    <img className="groupie-banner2" src='/Banner.png'></img>
    </div>
  )
}

export default SignUp;