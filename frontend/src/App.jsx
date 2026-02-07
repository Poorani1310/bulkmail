import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import * as XLSX from "xlsx";

function App() {
  const [status, setStatus] = useState();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [emailList, setEmailList] = useState([]);

  const handlefileInput = (e) => 
  {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetname = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetname];
      const values = XLSX.utils.sheet_to_json(sheet, { header: "A" });
      const mail_list = values.map((item) => {
        return item.A;
      });
      setEmailList(mail_list);
    };
  };

  const handleSubject = (e) => {
    setSubject(e.target.value);
  };

  const handleMessage = (e) => {
    setMessage(e.target.value);
  };

  const handleSend = async (e) => {
      let response = await fetch('http://localhost:5000/sendmail', {
        method:'POST', 
        headers:{'Content-Type' : 'application/json'}, 
        body:JSON.stringify({subject, message, emailList})
    });
    const data = await response.text();
    console.log('response', response)
    if (response.status == 200)
    {
      alert(data);
    }
    else{
      alert(data);
    }
  }

  return (
    <div>
      <div className="bg-cyan-500 p-4 text-center font-bold text-2xl">
        Bulk mail Application
      </div>
      <div className="bg-cyan-400 p-4 text-center font-bold text-xl">
        Help you send mail to multiple Email-ids at once
      </div>
      <div className="bg-cyan-300 p-4 text-center font-bold text-l">
        Drag and drop
      </div>
      <div className="bg-cyan-200 p-4 text-center flex flex-col items-center gap-4 h-103">
        <input
          className="border rounded bg-white p-2 w-xl"
          placeholder="Enter the Subject"
          value={subject}
          onChange={handleSubject}
        />
        <textarea
          className="bg-white border rounded border-black w-xl h-32 p-2"
          placeholder="Enter the Email Text"
          value={message}
          onChange={handleMessage}
        />
        <div className="border-4 border-dashed border-white p-2">
          <input
            className="cursor-pointer"
            onChange={handlefileInput}
            type="file"
            id="fileInput"
          />
        </div>
        <div>
          <p className="m-2">Total E-Mails in the sheet : {emailList.length}</p>
          <button
            className="bg-black text-white p-2 m-2 border rounded-xl"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
