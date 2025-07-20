const UserNotes = () => {
    const notifications = JSON.parse(localStorage.getItem("usernotifications"))
    return ( 
        <div className='flex flex-col justify-center items-center '>
      {notifications?.map((notification) => (
        <div className="mt-4 text-bold bg-gray-400 text-black relative w-[330px] shadow-lg shadow-black rounded-md" key={notification?.date_generated}>
          {/* Render each notification item here */}
          <p className="text-bold capitalize">{notification?.note_type}</p>
          <p>{notification?.note_body}</p>
          <p>{notification?.date_generated}</p>
        </div>
      ))}
    </div>
     );
}
 
export default UserNotes;