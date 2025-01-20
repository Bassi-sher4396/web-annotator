import {getActiveTabURL} from "./utils.js";

 const colorInput = document.getElementById("color")
const buttonh = document.querySelector('.HIGHLIGHT')

const clickbuttonh = async(e)=>{
    const activeTab =await getActiveTabURL()
    chrome.tabs.sendMessage(activeTab.id,{
        type:"highlight",
        value:colorInput.value
    })
}
buttonh.addEventListener('click',clickbuttonh)

const notes = document.getElementById("add_notes")
const buttonn = document.querySelector(".add_notes")



const addnotes=async(e)=>{
    const activeTab = await getActiveTabURL()
    chrome.tabs.sendMessage(activeTab.id,{
        type:'add note',
        value:notes.value,
        
    })
}
buttonn.addEventListener('click',addnotes)