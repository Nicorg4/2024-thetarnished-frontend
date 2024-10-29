import { useState } from "react";
import ClassManager from "./ClassManager";
import ClassHistory from "./ClassHistory";


const ManageClasses = () => {

    const [showContainer, setShowContainer] = useState(true);
    
    const toggleContainer = () => {
        setShowContainer(!showContainer);
    };

    return (
        <>
        {showContainer ? <ClassManager toggleContainer={toggleContainer}/> :  <ClassHistory toggleContainer={toggleContainer}/>}
        </>
    );
};

export default ManageClasses;