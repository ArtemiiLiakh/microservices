import Router from 'next/router';
import { useRequest } from '@/hooks/useRequest';
import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { request, errors, setErrors } = useRequest();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await request({
      url: '/auth/signup',
      method: 'post',
      data: {
        email,
        password
      }
    });

    if (response) {
      Router.push('/');
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <h1>Sign up</h1>

      <Form.Group>
        <Form.Label htmlFor="email">Email</Form.Label>
        <Form.Control 
          id="email" 
          type="text" 
          placeholder='Enter email' 
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors(undefined);
          }}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label htmlFor="password">Password</Form.Label>
        <Form.Control 
          id="password" 
          type="password" 
          placeholder='Enter password' 
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors(undefined);
          }}
        />
      </Form.Group>

      { errors }
      
      <Button type="submit">Login</Button>
    </Form>
  );
}