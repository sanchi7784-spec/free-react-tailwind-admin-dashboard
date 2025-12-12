import { useEffect, useState } from 'react';
const CreatePortfolios = () => {
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);
  useEffect(() => {
    try {
      const mpId = typeof window !== 'undefined' ? localStorage.getItem('mp_user_id') : null;
      // Only allow admin with id "20"
      setIsAllowed(mpId === '7234220');
    } catch (e) {
      setIsAllowed(false);
    }
  }, []);
        const initailData = [
        { Staff_id: "1", Name: "User Manager", Email: "user@gmail.com", Phone_no: "9918671810", Reason: "Want to Change Password", Status: "Pending", Action: "Pending" },
        { Staff_id: "2", Name: "Gold Manager", Email: "gold@gmail.com", Phone_no: "9017151819", Reason: "Want to Change Email ", Status: "Done", Action: "Pending" },
        { Staff_id: "3", Name: "KYC Manager", Email: "kyc@gmail.com", Phone_no: "8191215171", Reason: "Want to Change Name ", Status: "Undone", Action: "Pending" },
        { Staff_id: "4", Name: "Accounts Manager", Email: "accounts@gmail.com", Phone_no: "7861314179", Reason: "Want to Change Password", Status: "Pending", Action: "Pending" },
        { Staff_id: "5", Name: "Transfer Manager", Email: "transfer@gmail.com", Phone_no: "9015711677", Reason: "Want to Change Email", Status: "Done", Action: "Pending" },
    ];
const [tableData,setTableData]=useState(initailData);
const [showModal, setShowModal] = useState<boolean>(false);
const [currentIndex, setCurrentIndex] = useState<number | null>(null);
const[message,setMessage]=useState("");
const handleActionChange=(index:number, value:string)=>{
    if(value==="Done"){
        // currentIndex:null 
        setCurrentIndex(null);
        setShowModal(true);
    }
    const updated=[...tableData];
    updated[index].Action=value;
    setTableData(updated);
}
  // While we check localStorage, avoid flashing page content
  if (isAllowed === null) return null;

  if (!isAllowed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Access Denied</h2>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">You do not have permission to view this page.</p>
          <div className="flex justify-center gap-3">
            <button
              className="px-4 py-2 bg-indigo-600 text-white rounded"
              onClick={() => { window.location.href = '/'; }}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
        <h1 className='text-4xl  dark:text-gray-200' style={{fontWeight:'700'}}>Staff Profiles</h1>
        <div className='mt-10 bg-gray-200 h-10 dark:bg-gray-800 dark:text-gray-200'>
            <h1 className='text-2xl' style={{fontWeight:'600'}}>Staff Will Request For Changing Profiles</h1>
        </div>
          <div className='overflow-x-auto '>
                <table className='w-full border-collapse mt-20'>
                    <thead className='bg-purple-50 text-gray-700 dark:bg-gray-800 dark:text-gray-200'>
                    <tr>
                         <th className='py-5 px-4 text-left'>User_id</th>
                           <th className='py-5 px-4 text-left'>Name</th>
                             <th className='py-5 px-4 text-left'>Email</th>
                               <th className='py-5 px-4 text-left'>Phone no.</th>
                                 <th className='py-5 px-4 text-left'>Reason</th>
                                   <th className='py-5 px-4 text-left'>Status</th>
                                     <th className='py-5 px-4 text-left'>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                        {tableData.map((item, index) => (
<tr key={index} className='border-t dark:hover:bg-gray-900 hover:bg-gray-50'>
    <td className='py-5 px-4 dark:text-white'>{item.Staff_id}</td>
    <td className='py-5 px-4 dark:text-white'>{item.Name}</td>
    <td className='py-5 px-4 dark:text-white'>{item.Email}</td>
    <td className='py-5 px-4 dark:text-white'>{item.Phone_no}</td>
    <td className='py-5 px-4 dark:text-white'>{item.Reason}</td>
    <td className=' py-5 px-4 dark:text-white'>{item.Status}</td>
    <td className='py-5 px-4 dark:text-white'><select name="border border-gray-300 bg-white dark:bg-gray-100 rounded-md px-3 py-1 text-sm focus:ring focus:ring-blue-200" defaultValue={item.Action} id="" onChange={(e)=>handleActionChange(index, e.target.value)}>
        <option value="Pending" className='bg-gray-50 dark:bg-gray-800'>Pending</option>
        <option value="Done" className='bg-gray-50 dark:bg-gray-800'>Done</option>
        <option value="Undone" className='bg-gray-50 dark:bg-gray-800'>Undone</option>
        </select></td>
</tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {showModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-lg font-semibold mb-3">Enter Update Message</h2>

      <input
        type="text"
        placeholder="Write what has been changed..."
        className="border w-full px-3 py-2 rounded mb-4"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <div className="flex justify-end gap-3">
        <button
          className="px-4 py-2 bg-gray-300 rounded"
          onClick={() => setShowModal(false)}
        >
          Cancel
        </button>

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => {
            console.log("Saved message:", message);
            setShowModal(false);
          }}
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}

    </div>
    
  )
}

export default CreatePortfolios;