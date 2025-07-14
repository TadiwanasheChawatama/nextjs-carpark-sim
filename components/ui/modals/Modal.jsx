    const Modal = ({ isVisible, onClose, children }) => {
    if (!isVisible) return null;

    const handleClose = (e) => {
        // e.preventDefault();
        if (e.target.id === "coverer") onClose();
    };

    return (
        <div className="!items-center !h-[400px] !w-[-40px] !start-1 !ml-[-50px] !box-content !justify-center !absolute modal">
        <div className="Form-container bg-blue-950 !bg-opacity-25 !w-[400px] !backdrop-blur-sm !h-[600px] !mt-[-80px] !ml-[-34px]"  id="coverer" onClick={handleClose}>
            <div className="w-auto !flex !flex-col !mt-8 ">
                <div className="!absolute !mb-[100px] !mt-[390px] !ml-[-90px] !place-items-center !place-self-center">
                   <button className="flex !rounded-full !w-min !p-3 !font-extrabold !text-white !text-center !absolute !p" onClick={() => onClose()}>Cancel</button>
                </div>
            <div className="!bg-teal-600 p-2 !rounded !absolute  justify-center items-center !w-[380px] !mt-[-10px] !ml-1" >{children}</div>
            </div>
        </div>
        </div>
    );
    };

    export default Modal;
