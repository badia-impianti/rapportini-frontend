import Electricity from "../Images/Electricity.jpg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import  {useAuth}  from "../useAuth";
import LoadingError from "../components/LoadingError";
import LoadingSpinner from "../components/LoadingSpinner";

import "./Login.css"


const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [loadingError, setLoadingError] = useState(false);
    const [errorDescription, setErrorDescription] = useState("");
    const [wrongCredentials, setWrongCredentials] = useState(false);

    const { auth, setAuth } = useAuth();

    const navigate = useNavigate();

    const login = async (e) => {
        e.preventDefault();
        setIsLoading(true)

        try {
            const response = await fetch("https://backend.rapportini.badiasilvano.it/login-aruba", {
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

            if (response.status === 200) {
                const responseJson = await response.json();

                setAuth(responseJson);

                if (responseJson.name === "" || responseJson.surname === "" || responseJson.name == null || responseJson.surname == null) {
                    setIsLoading(false)
                    navigate("/setname");
                    return;
                }

                setIsLoading(false)
                navigate("/home");

            } else if (response.status === 401) {
                setIsLoading(false)
                setWrongCredentials(true)
            } else {
                setErrorDescription("Errore sconosciuto")
                setLoadingError(true)
            }
        } catch (error) {
            setErrorDescription("Errore di rete")
            setLoadingError(true)
        }
    }


    return (

        (loadingError) ? <LoadingError errorDescription={errorDescription} /> :
        (isLoading) ? <LoadingSpinner /> :

        <div className="mainLoginContainer">
            <img src={Electricity} alt="Immagine decorativa" />
            <div className="loginFormContainer">
                <form onSubmit={login} >
                    <h1>Rapportini</h1>
                    <p>Accedi con @badiasilvano.it</p>
                    <div className="form__group field" >
                        <input
                            type="text"
                            autoCapitalize='none'
                            id="email"
                            className="form__field"
                            placeholder="Email"
                            autoComplete="off"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                        <label className="form__label">Email</label>
                    </div>
                    <div className="form__group field">
                        <input
                            type="password"
                            id="password"
                            className="form__field"
                            placeholder="Password"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <label className="form__label">Password</label>
                    </div>
                    <input type="submit" value="Login" className="button" style={{marginTop: 35}} />
                    </form>
                {wrongCredentials && <p style={{color: "red", textAlign: "center", marginTop: 20}}>Credenziali errate</p>}
                <p className="customFooter">Portale riservato al personale di Badia Silvano. Ogni tentativo di abuso verrà riportato e punito a norma di legge </p>
            </div>
        </div>
    );
}

export default Login;