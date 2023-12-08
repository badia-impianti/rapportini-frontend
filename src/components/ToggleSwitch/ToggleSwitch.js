import "./ToggleSwitch.css";

const ToggleSwitch = (props) => {

        const [value, setValue] = props.value;

        //edit here css content value in inner:after to change the text



        return (
            <div className="container" style={{ '--true-value': `"${props.trueValue}"`, '--false-value': `"${props.falseValue}"` }} >
                <div className="toggle-switch">
                    <input type="checkbox" className="checkbox"
                           name={props.name}
                           id={props.name}
                           onChange={(e) => {
                               setValue(e.target.checked)}
                    }
                            checked={value}
                    />
                    <label className="label" htmlFor={props.name}>
                        <span className="inner" />
                        <span className="switch"/>
                    </label>
                </div>
            </div>
        );
}

export default ToggleSwitch;