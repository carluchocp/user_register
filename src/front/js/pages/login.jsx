import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext.js";
import "../../styles/home.css";




export const Login = () => {
  const { store, actions } = useContext(Context);

  const [userData, setUserData] = useState(initialState);
  let navigate = useNavigate();

  let initialState = {
    email: "",
    password: "",
  };

  let handleSubmit = async (event) => {
    event.preventDefault();
    console.log("ejecuto el submit");
    if (await actions.userLogIn(userData)) {
      navigate("/registered");
    } else {
      alert("Bad credentials");
    }
    // if (actions.logInCredentials(userData)) {
    //     if (actions.userLogIn(userData)) {
    //       navigate("/feed")
    //     }
    // } else {
    //   console.log("registrado fallido")
    // }
  };

  let handleChange = (event) => {
    setUserData({
      ...userData,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div className="text-center">
      <div className="container">
        <br />
        <br />
        <br />
        <br />
        <form onSubmit={handleSubmit}>
          <h1>¡Bienvenido foodie! Inicia sesión </h1>
          <br />
          <div className="form-group">
            <input
              type={"text"}
              className="form-control m-1"
              placeholder="email"
              name="email"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              type={"password"}
              className="form-control m-1"
              placeholder="Contraseña"
              name="password"
              onChange={handleChange}
            />
          </div>
          <div>
            <button className="btn btn-primary m-3" type="submit">
              Iniciar Sesión
            </button>
          </div>
        </form>
        <p>
          ¿No tienes cuenta? <a href="/signup">Registrate </a>
        </p>
        <br />
        <br />
        <br />
        <br />
      </div>
    </div>
  );
};
