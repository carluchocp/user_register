import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext.js";

export const Navbar = () => {
	const { store, actions } = useContext(Context);

	return (
	  <nav className="navbar navbar-expand-lg navbar-light bg-light d-flex justify-content-around">
		<Link to="/">
		  <h1>Home</h1>
		</Link>
		<div>
			<Link to="/">
				<button className="btn btn-primary" onClick={actions.userLogOut}>Logout</button>
			</Link>
		</div>		
	  </nav>
	);
  };
  