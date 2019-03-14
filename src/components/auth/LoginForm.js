import React, { Component } from 'react';
import OktaAuth from '@okta/okta-auth-js';
import { withAuth } from '@okta/okta-react';
import { Form, Button, Nav, OverlayTrigger, Tooltip } from "react-bootstrap";

export default withAuth(class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionToken: null,
      error: null,
      fields: {
        username: '',
        password: ''
      },
      formErrors: {}
    }
    this.oktaAuth = new OktaAuth({ url: props.baseUrl });
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleValidation() {
    let fields = this.state.fields;
    let formErrors = this.state.formErrors;
    let formIsValid = true;

    if (typeof fields['username'] !== 'undefined' && !fields['username'].match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
        formErrors['username'] = 'Username is invalid!';
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

  handleSubmit(e) {
    e.preventDefault();
    this.oktaAuth.signIn({
      username: this.state.fields['username'],
      password: this.state.fields['password']
    })
      .then(res => this.setState({
        sessionToken: res.sessionToken
      }))
      .catch(err => {
        this.setState({error: err.message});
        console.log(err.statusCode + ' error', err)
      });

    if (this.handleValidation()) {
        alert("Form submitted");
    } else {
        alert("Form has errors.")
    }
  }

  render() {
    if (this.state.sessionToken) {
      this.props.auth.redirect({ sessionToken: this.state.sessionToken });
      return null;
    }
    const errorMessage = this.state.error ? 
    <span className="error-message">{this.state.error}</span> : 
    null;

    return (
      <div className = "Form">
        <Form.Text className = "welcome">Login to My Blog</Form.Text>
        <Form onSubmit = {this.handleSubmit}>
          {errorMessage}
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
                placeholder = "Email" />
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
});