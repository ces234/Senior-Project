
import "./Header.css"
import worldIcon from "../../photos/logo/worldIcon.png";


const Header = () => {
    return (
    <div className="headerContainer">
        <div className="appTitleLogoContainer">
            <img src={worldIcon} className="logo" />
            <h1 className="headerTitle"> TerraBite</h1>
        </div>
        <hr />
    </div>)

}

export default Header;  
