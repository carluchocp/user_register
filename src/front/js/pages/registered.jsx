import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";

export const Registered = () => {

	return (
		<>
		<div className="d-flex justify-content-center align-items-center">
			<h1>
				Congratulations you are registered!
			</h1>
		</div>
		</>
	);
};

