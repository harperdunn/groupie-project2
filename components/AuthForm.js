import { useState } from 'react';
import { auth } from '../firebase';

const AuthForm = ({ isRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await auth.createUserWithEmailAndPassword(email, password);
      } else {
        await auth.signInWithEmailAndPassword(email, password);
      }
    } catch (error) {
      console.error('Authentication Error:', error);
    }
  };
  return (
    

              type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
              type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {isRegister ? 'Register' : 'Login'}
    
  );
};
export default AuthForm;