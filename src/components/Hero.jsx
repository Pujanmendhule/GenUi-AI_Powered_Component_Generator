import React, { useState } from "react";
import Select from "react-select";
import { FaCode } from "react-icons/fa";
import Editor from '@monaco-editor/react';
import { IoCopyOutline } from "react-icons/io5";
import { BiExport } from "react-icons/bi";
import { TiExport } from "react-icons/ti";
import { GrRefresh } from "react-icons/gr";
import { GoogleGenAI } from "@google/genai";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { IoMdClose } from "react-icons/io";


const Hero = () => {

// react-select
const options = [
  { value: "html-css", label: "Html+Css" },
  { value: "html-css-javascript", label: "Html+Css+Javascript" },
  { value: "html-bootstrap", label: "Html+Css+Javascript" },
  { value: "html-bootstrap-javascript", label: "Html-Bootstrap-Javascript" },
];

function extractCode(response){
// regex se triple backtick ke andar ka content nikal do
const match=response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
return match ? match[1].trim() : response.trim();
}
// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({apiKey:"AIzaSyBdmaMwLfeFpNhro_DYnr-_HH2C4xb3BPg" });

async function getResponse() {
  setOutputScreen(false);
  setLoading(true);
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
     You are an experienced programmer with expertise in web development and UI/UX design. You create modern, animated, and fully responsive UI components. You are highly skilled in HTML, CSS, Tailwind CSS, Bootstrap, JavaScript, React, Next.js, Vue.js, Angular, and more.

Now, generate a UI component for: ${prompt}  
Framework to use: ${framework.value}  

Requirements:  
The code must be clean, well-structured, and easy to understand.  
Optimize for SEO where applicable.  
Focus on creating a modern, animated, and responsive UI design.  
Include high-quality hover effects, shadows, animations, colors, and typography.  
Return ONLY the code, formatted properly in **Markdown fenced code blocks**.  
Do NOT include explanations, text, comments, or anything else besides the code.  
And give the whole code in a single HTML file.
    `,
  });
  console.log(response.text);
  setCode(extractCode(response.text));
  setLoading(false);
  setOutputScreen(true);
}
 const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("code copied to clipboard!")
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast.error("failed to copy")
    }
  }

  const downloadFile = () => {
  const filename = "genai.html";
  const blob = new Blob([code], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename; // still saves as .html but contents are plain text
  link.click();
  URL.revokeObjectURL(url);
  toast.success("File Downloaded Successfully");
};

  //  this usestate is for open in new tab
  const [openNewTab, setOpenNewTab] = useState(false)
  // this usestate is for loading
  const [loading, setLoading] = useState(false)
  // this usestate is for code generated
  const [code, setCode] = useState("")
  //  this usestate is for textArea
  const [prompt, setPrompt] = useState("")
  // this usestate is for button swithing
  const [btnn, setBtnn] = useState(1)
  // this usestate is for monaco rendering
  const [outputScreen, setOutputScreen] = useState(false)
  // this code till return starts , is for react-select
  const [framework, setFramework] = useState(options[0]);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#1f1f1f",
      borderColor: "#333",
      color: "#fff",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#1f1f1f",
      color: "#fff",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#333"
        : state.isFocused
        ? "#2a2a2a"
        : "#1f1f1f",
      color: "#fff",
      cursor: "pointer",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#fff",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#aaa",
    }),
    input: (provided) => ({
      ...provided,
      color: "#fff",
    }),
  };

  return (
    <>
      <div className="all h-[80%] w-full  bg-#09090b flex items-center justify-between  ">
        {/* code for left main */}

        <div className="left h-[90%] w-[50%] bg-zinc-900 rounded-xl p-10 m-6">
          <h3 className="text-[25px] font-[700] bg-gradient-to-t from-slate-800 via-violet-500 to-zinc-400 bg-clip-text text-transparent">
            AI Component Generator
          </h3>
          <div className="flex">
            <p className="mt-2 font-[500] bg-gradient-to-t from-slate-300  to-zinc-800 bg-clip-text text-transparent">
              Describe Your Component And Let AI Code It For You{" "}
            </p>
            <p className="mt-2 pl-1">😁</p>
          </div>

          <h3 className="text-[20px] font-[600] mt-4  bg-gradient-to-t from-slate-800 via-violet-500 to-zinc-400 bg-clip-text text-transparent">Frameworks</h3>
          {/* react select code */}
          <div className="mt-2">
            <Select
              options={options}
              value={framework}
              onChange={setFramework}
              placeholder="Pick a Combo..."
              styles={customStyles}
            />
          </div>
          {/* react select ends here */}

          <h3 className="text-[20px] font-[600] mt-4  bg-gradient-to-t from-slate-800 via-violet-500 to-zinc-400 bg-clip-text text-transparent">
            Describe Your Component
          </h3>
          <textarea
            onChange={(e)=>{setPrompt(e.target.value)}}
            value={prompt}
            placeholder="Write your message..."
            className="w-full mt-2 h-40 p-3 rounded-lg border border-zinc-700 bg-zinc-950 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />

          <div className="flex items-center justify-between pt-5">
            <p className="bg-gradient-to-t from-slate-300  to-zinc-800 bg-clip-text text-transparent">
              Click On Generate Button To Generate Your Code
            </p>
            <button onClick={getResponse} className="py-2 px-4 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-slate-800 via-purple-500 to-slate-800 rounded-xl cursor-pointer hover:opacity-80 transition-opacity duration-200">
              Generate
            </button>
          </div>
        </div>

        {/* code for right main */}

        <div className="right relative h-[90%] w-[50%] bg-zinc-900 rounded-xl  px-10 py-5 m-6 ">
          {
             (!outputScreen)?
          <>
          {
            loading===true?
            <>
            <div className="loading absolute left-0 top-0 h-full w-full flex items-center justify-center bg-[rgb(0,0,0,0.5)]">
            <ClipLoader />
          </div>
          
            <p className="font-bold">Please wait Few Second 🙌</p>
            <p>We Deliver the BEST Code possible 😎</p>
         
          
            </>:""
          }
          
          <div className="skeleton flex items-center flex-col justify-center h-full">
            <div className="cirle p-3 flex items-center text-[30px] justify-center h-[80px] w-[80px]  bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-slate-800 via-purple-500 to-slate-800 rounded-xl cursor-pointer hover:opacity-80 transition-opacity duration-200  rounded-[50%]">
              <FaCode />
            </div>
            <p className="mt-3 bg-gradient-to-t from-slate-300  to-zinc-800 bg-clip-text text-transparent ">
            Your Code Will Appear Here
          </p>
          </div>
          </>
          :<> 
            <div className="diffRight h-[100%] w-full ">
              <div className="top h-[60px] w-full flex items-center gap-[15px] px-[1px]">
                <button onClick={()=>{setBtnn(1)}} className={`btn w-[50%] p-[10px] border border-zinc-500 cursor-pointer trasition-all rounded-xl ${btnn ===1 ?'bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-slate-800 via-purple-500 to-slate-800 hover:opacity-80 transition-opacity duration-200 ' : ''} `}>Code</button>
                <button onClick={()=>{setBtnn(2)}} className={`btn w-[50%] p-[10px] border border-zinc-500 cursor-pointer trasition-all rounded-xl ${btnn ===2 ?'bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-slate-800 via-purple-500 to-slate-800 hover:opacity-80 transition-opacity duration-200 ' : ''} `}>Preview</button>
              </div>
              {/* second top for copy and export button */}
              <div className="h-[50px] p-2 flex items-center justify-between ">
                {/* conditional rendering for second top heading and button */}
                {
                  btnn===1?<>
                  <h3 className="text-[18px] font-[600] mt-4  bg-gradient-to-t from-slate-800 via-violet-500 to-zinc-400 bg-clip-text text-transparent">Code Editor</h3>
                <div className="flex gap-[15px]">
                  <button className="bt w-[33px] bg-zinc-700 px-2 py-1 border border-zinc-500 rounded-xl hover:opacity-80 transition-opacity duration-200" onClick={copyCode}> <IoCopyOutline /></button>
                  <button className="bt w-[33px] bg-zinc-700 px-2 py-1 border border-zinc-500 rounded-xl hover:opacity-80 transition-opacity duration-200" onClick={downloadFile}> <BiExport /></button>
                </div>
                  </>:<>
                  <h3 className="text-[18px] font-[600] mt-4  bg-gradient-to-t from-slate-800 via-violet-500 to-zinc-400 bg-clip-text text-transparent" >Live Preview</h3>
                <div className="flex gap-[15px]">
                  <button className="bt w-[33px] bg-zinc-700 px-2 py-1 border border-zinc-500 rounded-xl hover:opacity-80 transition-opacity duration-200" onClick={()=>{setOpenNewTab(true)}}> <TiExport /></button>
                  <button className="bt w-[33px] bg-zinc-700 px-2 py-1 border border-zinc-500 rounded-xl hover:opacity-80 transition-opacity duration-200"> <GrRefresh /></button>
                </div>
                  </>

                  
                }
                
                {/*conditional rendering editor editor */}
              </div>
              {
                 btnn ===1 ?
                <>
                  <Editor height="50vh" value={code} theme="vs-dark" Language="html"  />
                </> :
                <iframe srcDoc={code} className="preview h-[50vh] w-full bg-white text-black "></iframe>
              }
              
            </div>
            
          </> 
          }
          
          
          
        </div>
      </div>
      {
        openNewTab===true?<>
        <div className="container  absolute left-0 top-0 bottom-0 right-0 bg-white text-black  w-screen min-h-screen overflow-auto ">
          <div className="top w-full h-[60px] flex items-center justify-between px-[20px]">
            <div className="left">
              <p className="font-bold">Preview</p>
            </div>
            <div className="right flex items-center gap-[10px]">
              <button className="copy w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-800 flex items-center justify-center transition-all hover:bg-red-600 " onClick={()=>{setOpenNewTab(false)}}><IoMdClose /></button>
            </div>
          </div>

          <iframe srcDoc={code} className="h-full w-full"></iframe>
        </div>
        
        </>
        
        :""
      }
    </>
  );
};

export default Hero;
