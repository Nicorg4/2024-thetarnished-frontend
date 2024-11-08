import { useState } from "react";
import ClassManager from "./ClassManager";
import ClassHistory from "./ClassHistory";
import Logo from "../../components/top-down-logo";


const ManageClasses = () => {

    const [showContainer, setShowContainer] = useState(true);
    
    const toggleContainer = () => {
        setShowContainer(!showContainer);
    };

    return (
        <>
        <Logo/>
        {showContainer ? <ClassManager toggleContainer={toggleContainer}/> :  <ClassHistory toggleContainer={toggleContainer}/>}
        </>
    );
};

export default ManageClasses;