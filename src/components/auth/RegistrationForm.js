import React, { Component } from 'react';
import OktaAuth from '@okta/okta-auth-js';
import { withAuth } from '@okta/okta-react';
import { Form, Button, Nav, OverlayTrigger, Tooltip } from "react-bootstrap";
import config from '../../app.config';

export default withAuth(class RegistrationForm extends Component{
  constructor(props){
    super(props);
    this.state = {
      fields: {
        firstName: '',
        lastName: '',
        email: '',
        password: ''
      },
      error: null,
      formErrors: {},
      sessionToken: null
    };
    this.oktaAuth = new OktaAuth({ url: config.url });
    this.checkAuthentication = this.checkAuthentication.bind(this);
    this.checkAuthentication();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);  
  }

  async checkAuthentication() {
    const sessionToken = await this.props.auth.getIdToken();
    if (sessionToken) {
      this.setState({ sessionToken });
    }
  }

  componentDidUpdate() {
    this.checkAuthentication();
  }

  handleValidation() {
    let fields = this.state.fields;
    let formErrors = this.state.formErrors;
    let formIsValid = true;

    if (typeof fields['email'] !== 'undefined' && !fields['email'].match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
        formErrors['email'] = 'Email is invalid!';
        formIsValid = false;
        this.refs.emailError.show();
    } else {
       formIsValid = true;
       this.refs.emailError.hide();
    }
    
    if (typeof fields['firstName'] !== 'undefined' && fields['firstName'].length === 0) {
      formErrors['firstName'] = 'First Name is required!';
      formIsValid = false;
      this.refs.firstNameError.show();
    } else {
     formIsValid = true;
     this.refs.firstNameError.hide();
    }

    if (typeof fields['lastName'] !== 'undefined' && fields['lastName'].length === 0) {
      formErrors['lastName'] = 'Last Name is required!';
      formIsValid = false;
      this.refs.lastNameError.show();
    } else {
     formIsValid = true;
     this.refs.lastNameError.hide();
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

  handleSubmit(e){
    e.preventDefault();
    fetch('/api/users', { 
      method: 'POST', 
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state)
    }).then(user => {
      this.oktaAuth.signIn({
        username: this.state.fields['email'],
        password: this.state.fields['password']
      })
      .then(res => this.setState({
        sessionToken: res.sessionToken
      }));
    })
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

  render(){
    if (this.state.sessionToken) {
      this.props.auth.redirect({ sessionToken: this.state.sessionToken });
      return null;
    }
    const errorMessage = this.state.error ? 
    <span className="error-message">{this.state.error}</span> : 
    null;

    return(
        <div className = "Form">
        <Form.Text className = "welcome">Welcome to My Blog</Form.Text>
        <Form onSubmit = {this.handleSubmit}>
          {errorMessage}
          <Form.Group controlId = "email">
            <Form.Label>Email</Form.Label>
            <OverlayTrigger
              ref = "emailError"
              trigger = "manual"
              placement = "top"
              overlay = {<Tooltip>{this.state.formErrors['email']}</Tooltip>}>
              <Form.Control
                type = "email"
                value = {this.state.fields['email']}
                onChange = {this.handleChange.bind(this, 'email')}
                placeholder = "Email" />
            </OverlayTrigger>
          </Form.Group>
          <Form.Group controlId = "firstName">
            <Form.Label>First Name</Form.Label>
            <OverlayTrigger
              ref = "firstNameError"
              trigger = "manual"
              placement = "top"
              overlay = {<Tooltip>{this.state.formErrors['firstName']}</Tooltip>}>
              <Form.Control
                type = "firstName"
                value = {this.state.fields['firstName']}
                onChange = {this.handleChange.bind(this, 'firstName')}
                placeholder = "First Name" />
            </OverlayTrigger>
          </Form.Group>
          <Form.Group controlId = "lastName">
            <Form.Label>Last Name</Form.Label>
            <OverlayTrigger
              ref = "lastNameError"
              trigger = "manual"
              placement = "top"
              overlay = {<Tooltip>{this.state.formErrors['lastName']}</Tooltip>}>
              <Form.Control
                type = "lastName"
                value = {this.state.fields['lastName']}
                onChange = {this.handleChange.bind(this, 'lastName')}
                placeholder = "Last Name" />
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
            Register
          </Button>
        </Form>
        <Nav defaultActiveKey = "/login" className = "joinUs">
          Already have an account? <Nav.Link href = "/login">Login to My Blog</Nav.Link>
        </Nav>
      </div>
    );
  }

});