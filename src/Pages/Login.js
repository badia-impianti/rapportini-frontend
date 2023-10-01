import React from "react";
import Electricity from "../Images/Electricity.jpg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import  {useAuth}  from "../useAuth";
import LoadingError from "../components/LoadingError";
import LoadingSpinner from "../components/LoadingSpinner";


const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [loadingError, setLoadingError] = useState(false);
    const [wrongCredentials, setWrongCredentials] = useState(false);

    const { auth, setAuth } = useAuth();

    const navigate = useNavigate();

    const login = (e) => {
        e.preventDefault();
        setIsLoading(true)
        fetch("https://backend.rapportini.rainierihomecollection.it/login", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
            username: email,
            password: password,
            }),
        })
            .then((res) => {
                if (res.status === 200) {
                    console.log("Login successful");
                    res.json().then((data) => {
                        setAuth(data);
                        setIsLoading()
                        navigate("/home");
                    });
                }
                else if (res.status === 401) {
                    setIsLoading(false)
                    setWrongCredentials(true)
                }
                else {
                    setLoadingError(true)
                }
            })
            .catch((err) => {
                setLoadingError(true)
            });
    }


    return (

        (loadingError) ? <LoadingError /> :
        (isLoading) ? <LoadingSpinner /> :

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
                {wrongCredentials && <p style={{color: "red", textAlign: "center", marginTop: 20}}>Credenziali errate</p>}
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