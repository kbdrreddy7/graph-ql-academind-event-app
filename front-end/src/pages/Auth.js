import React, { Component, createRef } from "react";
import AuthContext from "../context/auth-context";

class Auth extends Component {
  state = {
    isLogin: true
  };
  static contextType = AuthContext; // then we can acess contaxt directly  like-> this.contaxt
  constructor(props) {
    super(props);
    this.emailEl = createRef();
    this.passwordEl = createRef();
  }

  switchModeHandler = () => {
    this.setState(previousState => {
      return { isLogin: !previousState.isLogin };
    });
  };

  submitHandler = event => {
    event.preventDefault();

    let email = this.emailEl.current.value;
    let password = this.passwordEl.current.value;

    if (email.trim() === "" || password.trim() === "") return;

    console.log(email, password);

    let reqBody = {
      query: `
            query{
                    login( email:"${email}", password:"${password}")
                                                                  {
                                                                    userId
                                                                    token
                                                                    tokenExpiration
                                                                  }
                    }`
    };

    if (!this.state.isLogin)
      reqBody = {
        query: `
            mutation{
                    createUser(userInput:{
                                          email:"${email}",
                                          password:"${password}"
                                          })
                                            {
                                              _id
                                              email
                                            }
                    }`
      };

    fetch(`http://localhost:5000/graphql`, {
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-type": "application/json"
      }
    })
      .then(res => {
        console.log(res);
        if (res.status !== 200 && res.status !== 201) throw new Error("Failed");
        return res.json();
      })
      .then(resData => {
        console.log("resData", resData);

        if (this.state.isLogin) {
          let { token, userId, tokenExpiration } = resData.data.login;

          this.context.login(token, userId, tokenExpiration);
        }
      })
      .catch(err => console.log("err ", err));
  };

  render() {
    return (
      <form className="auth-form" onSubmit={this.submitHandler}>
        <h2 className="title">{this.state.isLogin ? "Login" : "SignUp"}</h2>
        <div className="form-control">
          <label htmlFor="email">E-mail</label>
          <input type="email" id="email" ref={this.emailEl} />
        </div>

        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" ref={this.passwordEl} />
        </div>

        <div className="form-actions">
          <button type="submit">Submit</button>
          <button type="button" onClick={this.switchModeHandler}>
            Swith to {this.state.isLogin ? "SignUp" : "Login"}
          </button>
        </div>
      </form>
    );
  }
}

export default Auth;
