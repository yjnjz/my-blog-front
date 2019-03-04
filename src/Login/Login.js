import React, { Component } from 'react';
import { Form, Button, Nav, OverlayTrigger, Tooltip } from "react-bootstrap";
import "./Login.scss";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        username: '',
        password: ''
      },
      formErrors: {}
    };
  }

  handleValidation() {
    let fields = this.state.fields;
    let formErrors = this.state.formErrors;
    let formIsValid = true;

    if (typeof fields['username'] !== 'undefined' && fields['username'].length < 5) {
      formErrors['username'] = 'Username must contain at least 5 characters!';
      formIsValid = false;
      this.refs.usernameError.show();
    } else if (!fields['username'].match(/(?!^\d+$)^.+$/)) {
      formErrors['username'] = "Username must contain letters!";
      formIsValid = false;
      this.refs.usernameError.show();
   } else {
     formIsValid = true;
     this.refs.usernameError.hide();
   }
  
    if (typeof fields['password'] !== 'undefined' && fields['password'].length < 6) {
      formErrors['password'] = 'Password must contain at least 6 characters!';
      formIsValid = false;
      this.refs.passwordError.show();
    } else {
      formIsValid = true;
      this.refs.passwordError.hide();
    }
    this.setState({formErrors: formErrors});
    return formIsValid;
  }

  handleChange(field, e){         
    let fields = this.state.fields;
    fields[field] = e.target.value;        
    this.setState({fields});
  }

  handleSubmit = event => {
    event.preventDefault();
    if (this.handleValidation()) {
        alert("Form submitted");
    } else {
        alert("Form has errors.")
    }
  }

  render() {
    return (
      <div className = "Login">
        <Form.Text className = "welcome">Login to My Blog</Form.Text>
        <Form onSubmit = {this.handleSubmit}>
          <Form.Group controlId = "username">
            <Form.Label>Username</Form.Label>
            <OverlayTrigger
              ref = "usernameError"
              trigger = "manual"
              placement = "top"
              overlay = {<Tooltip>{this.state.formErrors['username']}</Tooltip>}>
              <Form.Control
                type = "username"
                value = {this.state.fields['username']}
                onChange = {this.handleChange.bind(this, 'username')}
                placeholder = "Username" />
            </OverlayTrigger>
          </Form.Group>
          <Form.Group controlId = "password">
            <Form.Label>Password</Form.Label>
            <OverlayTrigger
              ref = "passwordError"
              trigger = "manual"
              placement = "top"
              overlay = {<Tooltip>{this.state.formErrors['password']}</Tooltip>}>
              <Form.Control
                value = {this.state.fields['password']}
                onChange = {this.handleChange.bind(this, 'password')}
                type = "password"
                placeholder = "Password" />
            </OverlayTrigger>
          </Form.Group>
          <Button
            type = "submit">
            Login
          </Button>
        </Form>
        <Nav defaultActiveKey = "/register" className = "joinUs">
          New to us? <Nav.Link href = "/register">Join My Blog</Nav.Link>
        </Nav>
      </div>
      );
  }    
}