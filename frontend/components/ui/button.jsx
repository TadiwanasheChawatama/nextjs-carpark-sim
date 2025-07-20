"use client"
// import clsx from "clsx";
import { ReactNode } from "react";
import { FiMenu } from "react-icons/fi";

// interface buttonProps {
//     type?: "button" | "submit" | "reset"
//     text: string | ReactNode
//     onClick?: any | (() => void )
//     actionButton?: boolean
//     modalButton?: boolean
//     actButton?: boolean

// }

const Button = ({type, text, modalButton, classname}) => {
    return ( 
        <>
            <button 
                
                type={type}
                className={classname}
            >{text}</button>
        </>
     );
}
 
export default Button;