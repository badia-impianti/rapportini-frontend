import React from "react";
import { Router } from "react-router-dom";
import Electricity from "../Images/Electricity.jpg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const login = (e) => {
        e.preventDefault();
        console.log("Login successful");
        fetch("https://backend.rapportini.rainierihomecollection.it/login", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
            email: email,
            password: password,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
            console.log(data);
            if (data.status === "ok"){
            navigate("/home");
            }
            });
    }


    return (
        (window.innerWidth > 1000) ?
        <div style={{ display: "flex", flexDirection: "row", width: "100%", height: window.innerHeight + 1}}>
            <div style={{ position: "absolute", height: window.innerHeight + 1, width: 100, right: window.innerWidth / 100 * 30 - 50, borderRadius: "50%", backgroundColor: "#ffffff"}}/>
            <div style={{ width: "70%", backgroundImage: `url(${Electricity})`, backgroundSize: "cover", backgroundPosition: "center" }}/>
            <div style={{ width: "30%", margin: "auto" }}>
                <div style={{ width: "85%", margin: "auto", backgroundColor: "white", padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <h1 style={{fontWeight: "bold", color: "#257cff", fontSize: 40, marginBottom: 40}}>Bentornato!</h1>
                    <form onSubmit={login} >
                        <div class="form__group field" >
                            <input
                                type="text"
                                id="email"
                                className="form__field"
                                placeholder="Email"
                                autoComplete="off"
                                required
                                text={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                            <label for="email" class="form__label">Email</label>
                        </div>
                        <div class="form__group field">
                            <input
                                type="password"
                                id="password"
                                className="form__field"
                                placeholder="Password"
                                required
                                text={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                            <label for="password" class="form__label">Password</label>
                        </div>
                        <input type="submit" value="Login" className="button" style={{marginTop: 35}} />
                    </form>
                </div>
                <p style={{color: "grey", position: "absolute", bottom: 10, right: 10}} > {new Date().toLocaleString()} </p>
            </div>
        </div>
        :
        <div style={{ display: "flex", flexDirection: "column", width: "100%", height: window.innerHeight + 1}}>
            <div style={{ width: "100%", margin: "auto" }}>
                <div style={{ width: "90%", margin: 0, backgroundColor: "white", padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <h1 style={{fontWeight: "bold", color: "#257cff", fontSize: 40, marginBottom: 40}}>Bentornato!</h1>
                    <form onSubmit={login}>
                        <div class="form__group field" >
                            <input
                                type="text"
                                id="email"
                                className="form__field"
                                placeholder="Email"
                                autoComplete="off"
                                required
                                text={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                            <label for="email" class="form__label">Email</label>
                        </div>
                        <div class="form__group field">
                            <input
                                type="password"
                                id="password"
                                className="form__field"
                                placeholder="Password"
                                required
                                text={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                            <label for="password" class="form__label">Password</label>
                        </div>
                        <input type="submit" value="Login" className="button" style={{marginTop: 35}} />
                    </form>
                </div>
                <p style={{color: "grey", position: "absolute", bottom: 10, right: 10}} > {new Date().toLocaleString()} </p>
            </div>
        </div>
        

    );
}

export default Login;