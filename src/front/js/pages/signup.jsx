import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext.js";

let initialState = {
  username: "",
  email: "",
  password: "",
}

export const Signup = () => {
  const { store, actions } = useContext(Context);

  const [userData, setUserData] = useState(initialState);
  let navigate = useNavigate();

  let handleSubmit = async (event) => {
    event.preventDefault();
    if (actions.userSignUp(userData)) {
      navigate("/");
    } else {
      console.log("registrado fallido");
    }
  }
  // let handleSubmit = async (event) =>{
  //   event.preventDefault()
  //   if (actions.signUpCredentials(userData)) {
  //     await actions.userSignUp(userData)
  //   } else {
  //     alert("Invalid credentials")
  //   }
  // }

  let handleChange = ({ target }) =>{
	setUserData({
    ...userData,
    [target.name]: target.value,
    })
  };

  return (
    <div className="text-center">
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type={"text"}
              className="form-control m-1"
              placeholder="Ingresa tu usuario"
              name="username"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              type={"text"}
              className="form-control m-1"
              placeholder="Ingresa tu email"
              name="email"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              type={"password"}
              className="form-control m-1"
              placeholder="Ingresa tu contraseña"
              name="password"
              onChange={handleChange}
            />
          </div>
          <div>
            <button className="btn btn-primary m-3" type="submit">
              Registrar
            </button>
          </div>
        </form>
        
        <p>
          ¿Ya tienes una cuenta? <a href="/"> Inicia sesión </a>
        </p>
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <Link to="/">
        <button className="btn btn-primary">Back home</button>
      </Link>
    </div>
  );
};
  
